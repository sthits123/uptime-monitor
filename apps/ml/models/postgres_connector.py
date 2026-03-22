import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional
import logging
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)


@dataclass
class TickData:
    id: str
    website_id: str
    region_id: str
    region_name: str
    response_time_ms: int
    status: str
    created_at: datetime


@dataclass
class WebsiteInfo:
    id: str
    url: str
    user_id: str


class PostgresConnector:
    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or os.getenv("DATABASE_URL")
        if not self.database_url:
            raise ValueError("DATABASE_URL not set")
        self._conn = None

    def _get_connection(self):
        if self._conn is None or self._conn.closed:
            self._conn = psycopg2.connect(self.database_url)
        return self._conn

    def close(self):
        if self._conn and not self._conn.closed:
            self._conn.close()

    def get_recent_ticks(self, website_id: str, limit: int = 100) -> list[TickData]:
        conn = self._get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT 
                    wt.id,
                    wt.website_id,
                    wt.region_id,
                    r.name as region_name,
                    wt.response_time_ms,
                    wt.status::text,
                    wt.created_at
                FROM website_tick wt
                JOIN region r ON wt.region_id = r.id
                WHERE wt.website_id = %s
                ORDER BY wt.created_at DESC
                LIMIT %s
            """,
                (website_id, limit),
            )

            rows = cur.fetchall()
            return [TickData(**dict(row)) for row in rows]

    def get_all_websites(self) -> list[WebsiteInfo]:
        conn = self._get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, url, user_id 
                FROM website 
                WHERE is_active = true
            """)
            rows = cur.fetchall()
            return [WebsiteInfo(**dict(row)) for row in rows]

    def get_latest_tick_per_website(self) -> dict[str, TickData]:
        conn = self._get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT DISTINCT ON (wt.website_id)
                    wt.id,
                    wt.website_id,
                    wt.region_id,
                    r.name as region_name,
                    wt.response_time_ms,
                    wt.status::text,
                    wt.created_at
                FROM website_tick wt
                JOIN region r ON wt.region_id = r.id
                ORDER BY wt.website_id, wt.created_at DESC
            """)

            rows = cur.fetchall()
            result = {}
            for row in rows:
                tick = TickData(**dict(row))
                result[tick.website_id] = tick
            return result

    def insert_anomaly_event(
        self,
        website_id: str,
        region_id: str,
        response_time_ms: int,
        anomaly_score: float,
        confidence: float,
        reason: str,
    ) -> bool:
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO anomaly_event (
                        website_id, region_id, response_time_ms,
                        anomaly_score, confidence, reason, is_anomaly
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, true)
                """,
                    (
                        website_id,
                        region_id,
                        response_time_ms,
                        anomaly_score,
                        confidence,
                        reason,
                    ),
                )
                conn.commit()
                return True
        except Exception as e:
            logger.error(f"Failed to insert anomaly event: {e}")
            conn.rollback()
            return False

    def check_recent_anomaly_exists(
        self, website_id: str, region_id: str, minutes: int = 5
    ) -> bool:
        conn = self._get_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT EXISTS(
                    SELECT 1 FROM anomaly_event
                    WHERE website_id = %s 
                    AND region_id = %s
                    AND created_at > NOW() - INTERVAL '%s minutes'
                    AND is_anomaly = true
                )
            """,
                (website_id, region_id, minutes),
            )
            result = cur.fetchone()
            return result[0] if result else False

    def get_training_data(self, website_id: str, limit: int = 500) -> list[int]:
        conn = self._get_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT response_time_ms
                FROM website_tick
                WHERE website_id = %s
                ORDER BY created_at DESC
                LIMIT %s
            """,
                (website_id, limit),
            )
            return [row[0] for row in cur.fetchall()]
