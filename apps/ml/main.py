from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import os
import threading

from models.postgres_connector import PostgresConnector
from models.monitor import AnomalyMonitor

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Uptime Monitor ML Service",
    description="AI-driven anomaly detection for web service monitoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = None
monitor = None


class RetrainRequest(BaseModel):
    website_id: str


@app.on_event("startup")
async def startup():
    global db, monitor

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logger.error("DATABASE_URL not set!")
        return

    try:
        db = PostgresConnector(database_url)
        logger.info("Connected to PostgreSQL")

        poll_interval = int(os.getenv("ML_POLL_INTERVAL", "30"))
        min_samples = int(os.getenv("ML_MIN_SAMPLES", "50"))

        monitor = AnomalyMonitor(
            db=db, poll_interval=poll_interval, min_samples=min_samples
        )
        monitor.start()
        logger.info(f"Anomaly monitor started (poll_interval={poll_interval}s)")

    except Exception as e:
        logger.error(f"Failed to start: {e}")
        raise


@app.on_event("shutdown")
async def shutdown():
    global monitor, db
    if monitor:
        monitor.stop()
    if db:
        db.close()
    logger.info("ML service stopped")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ml-anomaly-detector",
        "monitor_running": monitor.is_running if monitor else False,
    }


@app.get("/")
async def root():
    return {
        "service": "Uptime Monitor ML Service",
        "version": "1.0.0",
        "description": "Reads from PostgreSQL, detects anomalies, stores results back",
        "endpoints": {
            "health": "/health",
            "retrain": "POST /api/v1/retrain/{website_id}",
            "stats": "GET /api/v1/stats/{website_id}",
        },
    }


@app.post("/api/v1/retrain/{website_id}")
async def retrain_website(website_id: str):
    if not monitor:
        raise HTTPException(status_code=503, detail="Monitor not initialized")

    success = monitor.retrain_website(website_id)
    if success:
        return {"status": "success", "website_id": website_id, "retrained": True}
    else:
        raise HTTPException(status_code=400, detail="Failed to retrain model")


@app.get("/api/v1/stats/{website_id}")
async def get_website_stats(website_id: str):
    if not db:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        ticks = db.get_recent_ticks(website_id, limit=100)
        if not ticks:
            return {"website_id": website_id, "count": 0}

        response_times = [t.response_time_ms for t in ticks]
        import numpy as np

        response_times = np.array(response_times)

        return {
            "website_id": website_id,
            "count": len(ticks),
            "mean": float(np.mean(response_times)),
            "std": float(np.std(response_times)),
            "min": int(np.min(response_times)),
            "max": int(np.max(response_times)),
            "p50": float(np.percentile(response_times, 50)),
            "p95": float(np.percentile(response_times, 95)),
            "p99": float(np.percentile(response_times, 99)),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
