-- Site settings Dan edits from /dashboard (Site settings tab): prices, phone, home headline, notice banner.
-- One row per setting that differs from the original. No row means the original value in the code is used.
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);
