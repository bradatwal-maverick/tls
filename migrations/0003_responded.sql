-- Responded: set when Dan taps Call, Email or Mark booked on an enquiry
ALTER TABLE enquiries ADD COLUMN responded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE enquiries ADD COLUMN responded_at TEXT;
UPDATE enquiries SET responded = 1, responded_at = booked_at WHERE booked = 1;
CREATE INDEX IF NOT EXISTS idx_enquiries_responded ON enquiries(responded);
