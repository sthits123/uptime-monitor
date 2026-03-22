-- Migration: Convert TIMESTAMP to TIMESTAMPTZ for consistency

ALTER TABLE website_tick 
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE anomaly_event 
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE website 
    ALTER COLUMN time_added TYPE TIMESTAMPTZ USING time_added AT TIME ZONE 'UTC';

ALTER TABLE website_tick ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE anomaly_event ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE website ALTER COLUMN time_added SET DEFAULT now();
