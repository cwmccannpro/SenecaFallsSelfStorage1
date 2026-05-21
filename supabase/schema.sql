-- ════════════════════════════════════════════════════════════
-- Seneca Falls Self Storage — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ════════════════════════════════════════════════════════════

-- ── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS units (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number   TEXT NOT NULL UNIQUE,
  unit_size     TEXT NOT NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  annual_price  NUMERIC(10,2),
  status        TEXT NOT NULL DEFAULT 'available'
                CHECK (status IN ('available','occupied','reserved','maintenance')),
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT,
  unit_id               UUID REFERENCES units(id) ON DELETE SET NULL UNIQUE,
  status                TEXT NOT NULL DEFAULT 'pending_verification'
                        CHECK (status IN ('pending_verification','active','inactive')),
  requested_unit_number TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_links (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_size               TEXT NOT NULL,
  billing_type            TEXT NOT NULL CHECK (billing_type IN ('monthly','annual')),
  amount                  NUMERIC(10,2) NOT NULL,
  square_payment_link_url TEXT NOT NULL,
  active                  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  unit_id      UUID REFERENCES units(id) ON DELETE SET NULL,
  billing_type TEXT CHECK (billing_type IN ('monthly','annual')),
  amount       NUMERIC(10,2) NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','paid','failed','manual_review')),
  payment_date TIMESTAMPTZ,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── updated_at trigger ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE OR REPLACE TRIGGER units_updated_at
  BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER payment_links_updated_at
  BEFORE UPDATE ON payment_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── is_admin helper ──────────────────────────────────────────
-- SECURITY DEFINER so it reads admin_users bypassing RLS (no recursion)

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

-- ── Enable Row Level Security ────────────────────────────────

ALTER TABLE admin_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE units         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments      ENABLE ROW LEVEL SECURITY;

-- ── admin_users policies ─────────────────────────────────────
-- First admin must be inserted via SQL Editor (service role bypasses RLS):
--   INSERT INTO admin_users (user_id) VALUES ('<auth-user-uuid>');

CREATE POLICY "admin_users_admin" ON admin_users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── customers policies ───────────────────────────────────────

CREATE POLICY "customers_select" ON customers
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "customers_insert" ON customers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Non-admins may update phone/notes only; unit_id, status, user_id are frozen
CREATE POLICY "customers_update" ON customers
  FOR UPDATE
  USING (user_id = auth.uid() OR is_admin())
  WITH CHECK (
    is_admin()
    OR (
      unit_id  IS NOT DISTINCT FROM (SELECT unit_id  FROM customers c WHERE c.id = customers.id)
      AND status   IS NOT DISTINCT FROM (SELECT status   FROM customers c WHERE c.id = customers.id)
      AND user_id  IS NOT DISTINCT FROM (SELECT user_id  FROM customers c WHERE c.id = customers.id)
    )
  );

CREATE POLICY "customers_delete" ON customers
  FOR DELETE USING (is_admin());

-- ── units policies ───────────────────────────────────────────

CREATE POLICY "units_select" ON units
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "units_admin" ON units
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── payment_links policies ───────────────────────────────────

CREATE POLICY "payment_links_select" ON payment_links
  FOR SELECT USING (active = TRUE OR is_admin());

CREATE POLICY "payment_links_admin" ON payment_links
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── payments policies ────────────────────────────────────────

CREATE POLICY "payments_select" ON payments
  FOR SELECT USING (
    is_admin()
    OR customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

CREATE POLICY "payments_admin" ON payments
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── Sample units (edit unit numbers to match your actual facility) ──

INSERT INTO units (unit_number, unit_size, monthly_price, annual_price, status) VALUES
  ('A01', '5×10',   65.00,  715.00, 'available'),
  ('A02', '5×10',   65.00,  715.00, 'available'),
  ('A03', '5×10',   65.00,  715.00, 'available'),
  ('B01', '10×10',  85.00,  935.00, 'available'),
  ('B02', '10×10',  85.00,  935.00, 'available'),
  ('C01', '10×15',  95.00, 1045.00, 'available'),
  ('C02', '10×15',  95.00, 1045.00, 'available'),
  ('D01', '10×20', 140.00, 1540.00, 'available'),
  ('D02', '10×20', 140.00, 1540.00, 'available')
ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- SETUP CHECKLIST:
-- 1. Run this entire file in SQL Editor
-- 2. In Supabase → Authentication → Settings:
--    - Disable "Email Confirmations" for simple onboarding
--    - Or leave enabled and handle the verify-email flow
-- 3. Create your admin account at /register
-- 4. Find your user UUID: Supabase → Authentication → Users
-- 5. Run: INSERT INTO admin_users (user_id) VALUES ('<your-uuid>');
-- 6. Add your Square Payment Links via /admin/payment-links
-- ════════════════════════════════════════════════════════════
