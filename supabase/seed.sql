-- ════════════════════════════════════════════════════════════
-- Seneca Falls Self Storage — Seed Data
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: uses ON CONFLICT DO NOTHING for units,
-- and ON CONFLICT (unit_size, billing_type) DO UPDATE for
-- payment links so URLs stay current.
-- ════════════════════════════════════════════════════════════

-- ── Remove placeholder sample data (A01/B01 etc.) ───────────
DELETE FROM units
WHERE unit_number IN ('A01','A02','A03','B01','B02','C01','C02','D01','D02');

-- ── Units ────────────────────────────────────────────────────
-- Columns: unit_number, unit_size, monthly_price, annual_price, status
-- Annual price = 11 months (1 month FREE promotion)

INSERT INTO units (unit_number, unit_size, monthly_price, annual_price, status) VALUES
  -- 5×10 units — $65/mo
  ('1',  '5×10',   65.00,  715.00, 'available'),
  ('2',  '5×10',   65.00,  715.00, 'available'),
  ('3',  '5×10',   65.00,  715.00, 'available'),
  ('4',  '5×10',   65.00,  715.00, 'available'),
  ('5',  '5×10',   65.00,  715.00, 'available'),
  ('6',  '5×10',   65.00,  715.00, 'available'),

  -- 10×20 units — $140/mo
  ('7',  '10×20', 140.00, 1540.00, 'available'),
  ('8',  '10×20', 140.00, 1540.00, 'available'),
  ('9',  '10×20', 140.00, 1540.00, 'available'),
  ('10', '10×20', 140.00, 1540.00, 'available'),
  ('11', '10×20', 140.00, 1540.00, 'available'),
  ('12', '10×20', 140.00, 1540.00, 'available'),

  -- 10×15 units — $95/mo
  ('13', '10×15',  95.00, 1045.00, 'available'),
  ('14', '10×15',  95.00, 1045.00, 'available'),
  ('15', '10×15',  95.00, 1045.00, 'available'),
  ('16', '10×15',  95.00, 1045.00, 'available'),
  ('17', '10×15',  95.00, 1045.00, 'available'),
  ('18', '10×15',  95.00, 1045.00, 'available'),
  ('19', '10×15',  95.00, 1045.00, 'available'),
  ('20', '10×15',  95.00, 1045.00, 'available'),
  ('21', '10×15',  95.00, 1045.00, 'available'),
  ('22', '10×15',  95.00, 1045.00, 'available'),

  -- 10×10 units — $85/mo
  ('23', '10×10',  85.00,  935.00, 'available'),
  ('24', '10×10',  85.00,  935.00, 'available'),
  ('25', '10×10',  85.00,  935.00, 'available'),
  ('26', '10×10',  85.00,  935.00, 'available'),
  ('27', '10×10',  85.00,  935.00, 'available'),
  ('28', '10×10',  85.00,  935.00, 'available'),

  -- Unit 29 is the office (same 5×10 pricing)
  ('29', '5×10',   65.00,  715.00, 'available'),

  -- 5×10 units — $65/mo
  ('30', '5×10',   65.00,  715.00, 'available'),
  ('31', '5×10',   65.00,  715.00, 'available'),
  ('32', '5×10',   65.00,  715.00, 'available'),
  ('33', '5×10',   65.00,  715.00, 'available'),
  ('34', '5×10',   65.00,  715.00, 'available'),

  -- 10×10 units — $85/mo
  ('35', '10×10',  85.00,  935.00, 'available'),
  ('36', '10×10',  85.00,  935.00, 'available'),
  ('37', '10×10',  85.00,  935.00, 'available'),
  ('38', '10×10',  85.00,  935.00, 'available'),
  ('39', '10×10',  85.00,  935.00, 'available'),
  ('40', '10×10',  85.00,  935.00, 'available'),

  -- 10×15 units — $95/mo
  ('41', '10×15',  95.00, 1045.00, 'available'),
  ('42', '10×15',  95.00, 1045.00, 'available'),
  ('43', '10×15',  95.00, 1045.00, 'available'),
  ('44', '10×15',  95.00, 1045.00, 'available'),
  ('45', '10×15',  95.00, 1045.00, 'available'),
  ('46', '10×15',  95.00, 1045.00, 'available'),
  ('47', '10×15',  95.00, 1045.00, 'available'),
  ('48', '10×15',  95.00, 1045.00, 'available'),
  ('49', '10×15',  95.00, 1045.00, 'available'),
  ('50', '10×15',  95.00, 1045.00, 'available'),

  -- 10×20 units — $140/mo
  ('51', '10×20', 140.00, 1540.00, 'available'),
  ('52', '10×20', 140.00, 1540.00, 'available'),
  ('53', '10×20', 140.00, 1540.00, 'available'),
  ('54', '10×20', 140.00, 1540.00, 'available'),
  ('55', '10×20', 140.00, 1540.00, 'available'),
  ('56', '10×20', 140.00, 1540.00, 'available'),

  -- 5×10 units — $65/mo
  ('57', '5×10',   65.00,  715.00, 'available'),
  ('58', '5×10',   65.00,  715.00, 'available'),
  ('59', '5×10',   65.00,  715.00, 'available'),
  ('60', '5×10',   65.00,  715.00, 'available'),
  ('61', '5×10',   65.00,  715.00, 'available'),
  ('62', '5×10',   65.00,  715.00, 'available'),

  -- 10×10 units — $85/mo
  ('63', '10×10',  85.00,  935.00, 'available'),
  ('64', '10×10',  85.00,  935.00, 'available'),
  ('65', '10×10',  85.00,  935.00, 'available'),
  ('66', '10×10',  85.00,  935.00, 'available'),
  ('67', '10×10',  85.00,  935.00, 'available'),
  ('68', '10×10',  85.00,  935.00, 'available'),

  -- 10×15 units — $95/mo
  ('69', '10×15',  95.00, 1045.00, 'available'),
  ('70', '10×15',  95.00, 1045.00, 'available'),
  ('71', '10×15',  95.00, 1045.00, 'available'),
  ('72', '10×15',  95.00, 1045.00, 'available'),
  ('73', '10×15',  95.00, 1045.00, 'available'),
  ('74', '10×15',  95.00, 1045.00, 'available'),
  ('75', '10×15',  95.00, 1045.00, 'available'),
  ('76', '10×15',  95.00, 1045.00, 'available'),
  ('77', '10×15',  95.00, 1045.00, 'available'),
  ('78', '10×15',  95.00, 1045.00, 'available'),

  -- 10×20 units — $140/mo
  ('79', '10×20', 140.00, 1540.00, 'available'),
  ('80', '10×20', 140.00, 1540.00, 'available'),
  ('81', '10×20', 140.00, 1540.00, 'available'),
  ('82', '10×20', 140.00, 1540.00, 'available'),
  ('83', '10×20', 140.00, 1540.00, 'available'),
  ('84', '10×20', 140.00, 1540.00, 'available')

ON CONFLICT (unit_number) DO NOTHING;

-- ── Payment Links ────────────────────────────────────────────
-- One Square Payment Link per unit size (monthly billing).
-- Add a unique constraint on (unit_size, billing_type) if not present,
-- then upsert so re-running this file keeps URLs current.

ALTER TABLE payment_links
  DROP CONSTRAINT IF EXISTS payment_links_unit_size_billing_type_key;

ALTER TABLE payment_links
  ADD CONSTRAINT payment_links_unit_size_billing_type_key
  UNIQUE (unit_size, billing_type);

INSERT INTO payment_links (unit_size, billing_type, amount, square_payment_link_url, active)
VALUES
  ('5×10',  'monthly',  65.00, 'https://square.link/u/GbgnnuN3', TRUE),
  ('10×10', 'monthly',  85.00, 'https://square.link/u/2PdagJii', TRUE),
  ('10×15', 'monthly',  95.00, 'https://square.link/u/gQ1atsyv', TRUE),
  ('10×20', 'monthly', 140.00, 'https://square.link/u/v8cC26Pj', TRUE)
ON CONFLICT (unit_size, billing_type)
  DO UPDATE SET
    square_payment_link_url = EXCLUDED.square_payment_link_url,
    amount                  = EXCLUDED.amount,
    active                  = EXCLUDED.active,
    updated_at              = NOW();

-- ════════════════════════════════════════════════════════════
-- Done. All 84 units and 4 monthly payment links are seeded.
-- Unit 29 is the office unit (5×10 pricing).
-- To add annual payment links, add rows with billing_type='annual'.
-- ════════════════════════════════════════════════════════════
