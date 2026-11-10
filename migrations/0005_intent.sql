-- Anonymous first-party visit tracking. No names, phone numbers, emails or IP addresses are stored.
-- Additive only: safe to run before or after the Worker deploys.
CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 1,
  first_source TEXT,
  last_source TEXT
);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen);

CREATE TABLE IF NOT EXISTS visit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  type TEXT NOT NULL,
  path TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_visit_events_visitor ON visit_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visit_events_created ON visit_events(created_at);

-- Links each enquiry to the visitor's anonymous ID (set when the form is sent)
ALTER TABLE enquiries ADD COLUMN visitor_id TEXT;
CREATE INDEX IF NOT EXISTS idx_enquiries_visitor ON enquiries(visitor_id);
