-- Write your migrate up statements here

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.


-- ------------------------
-- Up Migration
-- ------------------------

-- Create enum for website tick status
CREATE TYPE website_status AS ENUM ('UP', 'DOWN', 'UNKNOWN');

-- Create user table


-- Create region table
CREATE TABLE "region" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create website table
CREATE TABLE "website" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    time_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create website_tick table
CREATE TABLE "website_tick" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_time_ms INTEGER NOT NULL,
    status website_status NOT NULL DEFAULT 'UNKNOWN',
    region_id UUID NOT NULL REFERENCES "region"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    website_id UUID NOT NULL REFERENCES "website"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX "user_username_key" ON "user"(username);

