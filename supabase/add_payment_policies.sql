-- Allow customers to insert their own payment rows
CREATE POLICY "payments_insert_customer" ON payments
  FOR INSERT
  WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Allow customers to update their own payment rows (e.g. to mark paid)
CREATE POLICY "payments_update_customer" ON payments
  FOR UPDATE
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  )
  WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );
