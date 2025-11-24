CREATE TABLE IF NOT EXISTS feeds (
                                     id SERIAL PRIMARY KEY,
                                     name TEXT NOT NULL,
                                     url TEXT NOT NULL UNIQUE,
                                     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

-- триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_feeds_updated_at ON feeds;
CREATE TRIGGER trigger_update_feeds_updated_at
    BEFORE UPDATE ON feeds
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();