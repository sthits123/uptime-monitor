import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class AnomalyDetector:
    def __init__(
        self,
        contamination: float = 0.1,
        n_estimators: int = 100,
        random_state: int = 42,
    ):
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.random_state = random_state
        self.model: Optional[IsolationForest] = None
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.threshold = 0.5

    def _create_features(self, response_times: np.ndarray) -> np.ndarray:
        if len(response_times) < 10:
            return response_times.reshape(-1, 1)

        features = []
        for i in range(len(response_times)):
            row = [response_times[i]]

            if i >= 1:
                row.append(response_times[i] - response_times[i - 1])
            else:
                row.append(0)

            if i >= 5:
                window = response_times[max(0, i - 5) : i]
                row.append(np.mean(window))
                row.append(np.std(window))
            else:
                row.append(response_times[i])
                row.append(0)

            features.append(row)

        return np.array(features)

    def fit(self, response_times: np.ndarray) -> bool:
        if len(response_times) < 50:
            logger.warning(f"Not enough samples to train: {len(response_times)}")
            return False

        X = self._create_features(response_times)
        X_scaled = self.scaler.fit_transform(X)

        self.model = IsolationForest(
            contamination=self.contamination,
            n_estimators=self.n_estimators,
            random_state=self.random_state,
            n_jobs=-1,
        )
        self.model.fit(X_scaled)
        self.is_fitted = True

        scores = self.model.decision_function(X_scaled)
        self.threshold = np.percentile(scores, 10)

        logger.info(
            f"Model fitted with {len(response_times)} samples, threshold: {self.threshold:.4f}"
        )
        return True

    def predict(self, response_times: np.ndarray) -> dict:
        if not self.is_fitted or self.model is None:
            return {
                "is_anomaly": False,
                "anomaly_score": 0.0,
                "confidence": 0.0,
                "reason": "model_not_trained",
            }

        X = self._create_features(response_times)
        X_scaled = self.scaler.transform(X)

        score = self.model.decision_function(X_scaled)[-1]
        is_anomaly = score < self.threshold

        normalized_score = (score - self.threshold) / (abs(self.threshold) + 0.001)
        confidence = min(abs(normalized_score), 1.0)

        reason = "normal"
        if is_anomaly:
            if response_times[-1] > np.mean(response_times) + 2 * np.std(
                response_times
            ):
                reason = "spike_detected"
            elif score < self.threshold * 0.5:
                reason = "severe_anomaly"
            else:
                reason = "minor_deviation"

        return {
            "is_anomaly": bool(is_anomaly),
            "anomaly_score": float(score),
            "confidence": float(confidence),
            "reason": reason,
        }

    def predict_single(self, response_time: int, recent_history: np.ndarray) -> dict:
        combined = np.append(recent_history[-49:], response_time)
        return self.predict(combined)

    def save(self, path: str):
        os.makedirs(
            os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True
        )
        with open(path, "wb") as f:
            pickle.dump(
                {
                    "model": self.model,
                    "scaler": self.scaler,
                    "threshold": self.threshold,
                    "is_fitted": self.is_fitted,
                    "contamination": self.contamination,
                    "n_estimators": self.n_estimators,
                },
                f,
            )
        logger.info(f"Model saved to {path}")

    def load(self, path: str) -> bool:
        if not os.path.exists(path):
            logger.warning(f"Model file not found: {path}")
            return False

        with open(path, "rb") as f:
            data = pickle.load(f)
            self.model = data["model"]
            self.scaler = data["scaler"]
            self.threshold = data["threshold"]
            self.is_fitted = data["is_fitted"]
            self.contamination = data["contamination"]
            self.n_estimators = data["n_estimators"]

        logger.info(f"Model loaded from {path}")
        return True
