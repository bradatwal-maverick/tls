-- Google Ads tagging: click ID, UTM values, landing page and a quick is_ad flag
ALTER TABLE enquiries ADD COLUMN gclid TEXT;
ALTER TABLE enquiries ADD COLUMN utm_source TEXT;
ALTER TABLE enquiries ADD COLUMN utm_medium TEXT;
ALTER TABLE enquiries ADD COLUMN utm_campaign TEXT;
ALTER TABLE enquiries ADD COLUMN landing_page TEXT;
ALTER TABLE enquiries ADD COLUMN is_ad INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_enquiries_ad ON enquiries(is_ad);
