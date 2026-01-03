-- +migrate Up

CREATE TYPE website_status AS ENUM ('up', 'down', 'unknown');

CREATE TABLE website (
    id UUID PRIMARY KEY,
    url TEXT NOT NULL,
    user_id UUID NOT NULL,
    time_added TIMESTAMP NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT website_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE region (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE website_tick (
    id UUID PRIMARY KEY,
    website_id UUID NOT NULL,
    region_id UUID NOT NULL,
    response_time_ms INTEGER NOT NULL,
    status website_status NOT NULL,
    response_code INTEGER,
    error_message TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT website_tick_website_id_fkey
        FOREIGN KEY (website_id)
        REFERENCES website(id)
        ON DELETE CASCADE,

    CONSTRAINT website_tick_region_id_fkey
        FOREIGN KEY (region_id)
        REFERENCES region(id)
        ON DELETE RESTRICT
);


CREATE INDEX idx_website_user_id
    ON website(user_id);

CREATE INDEX idx_website_tick_website_created_at
    ON website_tick(website_id, created_at DESC);


