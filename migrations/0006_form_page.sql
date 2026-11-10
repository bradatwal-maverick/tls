-- The page the enquiry form was sent from (path only, for example /states/new-south-wales).
-- Nullable and additive: safe to run before or after the Worker deploys.
ALTER TABLE enquiries ADD COLUMN form_page TEXT;
