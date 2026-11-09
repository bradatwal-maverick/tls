-- Enquiries written by the contact form, managed on the /dashboard page
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  state TEXT,
  licence TEXT,
  message TEXT,
  source TEXT,
  booked INTEGER NOT NULL DEFAULT 0,
  booked_at TEXT,
  amount_aud REAL
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- Phone subscriptions for new-enquiry alerts (Web Push)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  subscription TEXT NOT NULL,
  created_at TEXT NOT NULL
);
