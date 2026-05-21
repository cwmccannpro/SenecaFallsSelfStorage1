export type UnitStatus = "available" | "occupied" | "reserved" | "maintenance";
export type CustomerStatus = "pending_verification" | "active" | "inactive";
export type BillingType = "monthly" | "annual";
export type PaymentStatus = "pending" | "paid" | "failed" | "manual_review";

export interface Unit {
  id: string;
  unit_number: string;
  unit_size: string;
  monthly_price: number;
  annual_price: number | null;
  status: UnitStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  unit_id: string | null;
  status: CustomerStatus;
  requested_unit_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined field — not in DB row
  unit?: Unit | null;
}

export interface PaymentLink {
  id: string;
  unit_size: string;
  billing_type: BillingType;
  amount: number;
  square_payment_link_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  customer_id: string;
  unit_id: string | null;
  billing_type: BillingType | null;
  amount: number;
  status: PaymentStatus;
  payment_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { id: string; user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: Partial<{ user_id: string }>;
      };
      units: {
        Row: Unit;
        Insert: Omit<Unit, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Unit, "id" | "created_at" | "updated_at">>;
      };
      customers: {
        Row: Omit<Customer, "unit">;
        Insert: Omit<Customer, "id" | "created_at" | "updated_at" | "unit">;
        Update: Partial<Omit<Customer, "id" | "created_at" | "updated_at" | "unit">>;
      };
      payment_links: {
        Row: PaymentLink;
        Insert: Omit<PaymentLink, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PaymentLink, "id" | "created_at" | "updated_at">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at">;
        Update: Partial<Omit<Payment, "id" | "created_at">>;
      };
    };
  };
}
