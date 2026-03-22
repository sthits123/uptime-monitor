
CREATE TABLE anomaly_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL,
    region_id UUID NOT NULL,
    response_time_ms INTEGER NOT NULL,
    anomaly_score DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    reason TEXT NOT NULL,
    is_anomaly BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT anomaly_event_website_id_fkey
        FOREIGN KEY (website_id)
        REFERENCES website(id)
        ON DELETE CASCADE,

    CONSTRAINT anomaly_event_region_id_fkey
        FOREIGN KEY (region_id)
        REFERENCES region(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_anomaly_event_website_created_at
    ON anomaly_event(website_id, created_at DESC);

CREATE INDEX idx_anomaly_event_is_anomaly
    ON anomaly_event(is_anomaly) WHERE is_anomaly = true;

---- create above / drop below ----

DROP INDEX IF EXISTS idx_anomaly_event_is_anomaly;
DROP INDEX IF EXISTS idx_anomaly_event_website_created_at;
DROP TABLE IF EXISTS anomaly_event;
