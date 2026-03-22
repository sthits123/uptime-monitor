"""
Seed script to test anomaly detection with sample data.
This creates fake tick data with anomalies to test the ML service.
"""

import os
import psycopg2
import random
import time
from datetime import datetime, timedelta
from uuid import uuid4

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    return psycopg2.connect(DATABASE_URL)


def create_sample_ticks(
    website_id: str, region_id: str, count: int = 60, spike_at: int = None
):
    """Create sample ticks with normal behavior, optionally with a spike."""
    conn = get_connection()
    cursor = conn.cursor()

    now = datetime.now()

    for i in range(count):
        timestamp = now - timedelta(minutes=count - i)

        # Normal response time between 80-120ms
        response_time = random.randint(80, 120)

        # Inject spike
        if spike_at and i >= spike_at:
            response_time = random.randint(800, 1500)  # Big spike!

        status = "up" if response_time < 500 else "down"

        cursor.execute(
            """
            INSERT INTO website_tick 
            (id, website_id, region_id, response_time_ms, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """,
            (str(uuid4()), website_id, region_id, response_time, status, timestamp),
        )

    conn.commit()
    cursor.close()
    conn.close()
    print(f"Created {count} ticks for website {website_id}")
    print(f"  - Normal: {count if not spike_at else spike_at} ticks (80-120ms)")
    print(
        f"  - Spike: {count - spike_at if spike_at else 0} ticks (800-1500ms)"
    ) if spike_at else None


def create_anomaly_event(
    website_id: str,
    region_id: str,
    response_time_ms: int,
    reason: str = "spike_detected",
):
    """Create an anomaly event for testing."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO anomaly_event 
        (id, website_id, region_id, response_time_ms, anomaly_score, confidence, reason, is_anomaly, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """,
        (
            str(uuid4()),
            website_id,
            region_id,
            response_time_ms,
            -0.15,  # Anomaly score (negative = anomalous)
            0.85,  # 85% confidence
            reason,
            True,
            datetime.now(),
        ),
    )

    conn.commit()
    cursor.close()
    conn.close()
    print(f"Created anomaly event: {reason} (score: -0.15, confidence: 85%)")


def get_websites():
    """Get all active websites."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, url FROM website WHERE is_active = true")
    websites = cursor.fetchall()
    cursor.close()
    conn.close()
    return websites


def get_regions():
    """Get all regions."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM region")
    regions = cursor.fetchall()
    cursor.close()
    conn.close()
    return regions


def seed_database():
    """Main function to seed the database with test data."""
    print("=" * 60)
    print("ANOMALY DETECTION TEST DATA SEEDER")
    print("=" * 60)

    # Get existing websites and regions
    websites = get_websites()
    regions = get_regions()

    print(f"\nFound {len(websites)} websites and {len(regions)} regions\n")

    if not websites:
        print("No websites found. Please add a website first via the UI or API.")
        return

    if not regions:
        print("No regions found. Please ensure regions are set up.")
        return

    # Use first website and region for testing
    website_id, website_url = websites[0]
    region_id, region_name = regions[0]

    print(f"Using website: {website_url} ({website_id})")
    print(f"Using region: {region_name} ({region_id})")

    # Create sample ticks with a spike at tick 45
    print("\n[1/3] Creating sample tick data...")
    create_sample_ticks(website_id, region_id, count=60, spike_at=45)

    # Create anomaly event
    print("\n[2/3] Creating anomaly event...")
    create_anomaly_event(website_id, region_id, 1200, "spike_detected")

    # Create more anomalies
    print("\n[3/3] Creating additional anomaly events...")
    create_anomaly_event(website_id, region_id, 800, "severe_anomaly")

    print("\n" + "=" * 60)
    print("TEST DATA CREATED SUCCESSFULLY!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Start ML service: cd apps/ml && uv run uvicorn main:app")
    print("2. Check UI at http://localhost:5173")
    print("3. The Anomaly Panel should show:")
    print("   - Response Time Chart with spike visible")
    print("   - Anomaly events in timeline")
    print("   - Stats: Avg ~200ms, Peak ~1200ms, Anomalies: 2")


def create_test_website():
    """Create a test website if none exist."""
    conn = get_connection()
    cursor = conn.cursor()

    website_id = str(uuid4())
    user_id = str(uuid4())

    # Create a test user first
    cursor.execute(
        """
        INSERT INTO users (id, username, password, created_at)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (username) DO NOTHING
    """,
        (user_id, "testuser", "test123", datetime.now()),
    )

    # Create test website
    cursor.execute(
        """
        INSERT INTO website (id, url, user_id, time_added, is_active)
        VALUES (%s, %s, %s, %s, %s)
    """,
        (website_id, "https://httpbin.org/delay/1", user_id, datetime.now(), True),
    )

    conn.commit()
    cursor.close()
    conn.close()

    print(f"Created test website: {website_id}")
    return website_id


if __name__ == "__main__":
    if not DATABASE_URL:
        print("Error: DATABASE_URL environment variable not set")
        print("Example: export DATABASE_URL='postgresql://user:pass@host/db'")
        exit(1)

    websites = get_websites()
    if not websites:
        print("No websites found. Creating test website...")
        create_test_website()
        print("Test website created. Please run this script again.")
    else:
        seed_database()
