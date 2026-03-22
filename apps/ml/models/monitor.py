import asyncio
import logging
import threading
import numpy as np
from typing import Dict
from models.postgres_connector import PostgresConnector
from models.isolation_forest import AnomalyDetector

logger = logging.getLogger(__name__)


class AnomalyMonitor:
    def __init__(
        self,
        db: PostgresConnector,
        poll_interval: int = 30,
        min_samples: int = 50,
    ):
        self.db = db
        self.poll_interval = poll_interval
        self.min_samples = min_samples
        self.models: Dict[str, AnomalyDetector] = {}
        self.is_running = False
        self._thread = None

    def _get_or_create_model(self, website_id: str) -> AnomalyDetector:
        if website_id not in self.models:
            self.models[website_id] = AnomalyDetector()
        return self.models[website_id]

    def _process_website(self, website_id: str) -> None:
        try:
            ticks = self.db.get_recent_ticks(website_id, limit=100)

            if len(ticks) < self.min_samples:
                logger.debug(
                    f"Website {website_id}: not enough data ({len(ticks)}/{self.min_samples})"
                )
                return

            response_times = [t.response_time_ms for t in ticks]
            response_times = np.array(response_times[::-1])

            model = self._get_or_create_model(website_id)

            if not model.is_fitted:
                logger.info(
                    f"Training model for website {website_id} with {len(response_times)} samples"
                )
                model.fit(response_times)
                return

            latest_tick = ticks[-1]

            if self.db.check_recent_anomaly_exists(
                latest_tick.website_id, latest_tick.region_id
            ):
                logger.debug(f"Skipping {website_id}: recent anomaly already recorded")
                return

            result = model.predict_single(latest_tick.response_time_ms, response_times)

            if result["is_anomaly"]:
                logger.warning(
                    f"ANOMALY DETECTED for {website_id} "
                    f"(region: {latest_tick.region_name}): "
                    f"response_time={latest_tick.response_time_ms}ms, "
                    f"reason={result['reason']}, "
                    f"score={result['anomaly_score']:.4f}, "
                    f"confidence={result['confidence']:.2f}"
                )

                success = self.db.insert_anomaly_event(
                    website_id=latest_tick.website_id,
                    region_id=latest_tick.region_id,
                    response_time_ms=latest_tick.response_time_ms,
                    anomaly_score=result["anomaly_score"],
                    confidence=result["confidence"],
                    reason=result["reason"],
                )

                if success:
                    logger.info(f"Anomaly event saved to database for {website_id}")
            else:
                logger.debug(
                    f"Website {website_id}: normal "
                    f"(response_time={latest_tick.response_time_ms}ms)"
                )

        except Exception as e:
            logger.error(f"Error processing website {website_id}: {e}")

    def _poll_loop(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        while self.is_running:
            try:
                latest_ticks = self.db.get_latest_tick_per_website()

                if not latest_ticks:
                    logger.debug("No websites found to monitor")
                else:
                    logger.info(
                        f"Processing {len(latest_ticks)} websites for anomaly detection"
                    )

                    for website_id in latest_ticks:
                        if not self.is_running:
                            break
                        self._process_website(website_id)

            except Exception as e:
                logger.error(f"Error in poll loop: {e}")

            for _ in range(self.poll_interval):
                if not self.is_running:
                    break
                threading.Event().wait(1)

    def start(self):
        if self.is_running:
            logger.warning("Monitor already running")
            return

        logger.info(f"Starting anomaly monitor (poll_interval={self.poll_interval}s)")
        self.is_running = True
        self._thread = threading.Thread(target=self._poll_loop, daemon=True)
        self._thread.start()

    def stop(self):
        logger.info("Stopping anomaly monitor")
        self.is_running = False
        if self._thread:
            self._thread.join(timeout=5)

    def retrain_website(self, website_id: str) -> bool:
        try:
            response_times = self.db.get_training_data(website_id, limit=500)

            if len(response_times) < self.min_samples:
                logger.warning(f"Not enough data to retrain {website_id}")
                return False

            response_times = np.array(response_times[::-1])
            model = self._get_or_create_model(website_id)
            success = model.fit(response_times)

            if success:
                model.save(f"models/{website_id}_model.pkl")
                logger.info(f"Model retrained for {website_id}")

            return success
        except Exception as e:
            logger.error(f"Error retraining website {website_id}: {e}")
            return False
