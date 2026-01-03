-- +migrate Up

CREATE TABLE user_tick (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    website_id UUID NOT NULL,
    response_time_ms INTEGER NOT NULL,
    status website_status NOT NULL,
    response_code INTEGER,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT user_tick_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT user_tick_website_id_fkey
        FOREIGN KEY (website_id)
        REFERENCES website(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_tick_user_id_created_at
    ON user_tick(user_id, created_at DESC);

CREATE INDEX idx_user_tick_website_id_created_at
    ON user_tick(website_id, created_at DESC);

-- +migrate Down

DROP INDEX IF EXISTS idx_user_tick_website_id_created_at;
DROP INDEX IF EXISTS idx_user_tick_user_id_created_at;
DROP TABLE IF EXISTS user_tick;

