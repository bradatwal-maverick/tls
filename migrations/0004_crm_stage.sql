-- CRM pipeline stage: New, In Contact, Booked, No. Default 'new' covers every new enquiry.
ALTER TABLE enquiries ADD COLUMN stage TEXT NOT NULL DEFAULT 'new';
-- Backfill from the old flags: booked -> Booked, responded (not booked) -> In Contact, otherwise New
UPDATE enquiries SET stage = CASE
  WHEN booked = 1 THEN 'booked'
  WHEN responded = 1 THEN 'in_contact'
  ELSE 'new'
END;
CREATE INDEX IF NOT EXISTS idx_enquiries_stage ON enquiries(stage);
