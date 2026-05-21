import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Customer, BillingType } from "@/lib/database.types";
import logoImg from "@/assets/logo4.png";
import { Phone, Mail, LogOut } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const PHONE_HREF = "tel:+13155394692";
const PHONE_DISPLAY = "(315) 539-4692";
const EMAIL = "tim@senecafallsselfstorage.com";

function DashboardPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingType, setPayingType] = useState<BillingType | null>(null);
  const [annualLinkExists, setAnnualLinkExists] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: "/login" });
        return;
      }

      const { data: cust } = await supabase
        .from("customers")
        .select("*, unit:units(*)")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setCustomer(cust as Customer | null);

      // Pre-check whether an annual payment link exists for their unit size
      if (cust?.unit) {
        const { data: annualLink } = await supabase
          .from("payment_links")
          .select("id")
          .eq("unit_size", cust.unit.unit_size)
          .eq("billing_type", "annual")
          .eq("active", true)
          .maybeSingle();
        setAnnualLinkExists(!!annualLink);
      }

      setLoading(false);
    };

    load();
  }, [navigate]);

  const handlePay = async (billingType: BillingType) => {
    if (!customer?.unit) return;
    setPayingType(billingType);

    const { data: link } = await supabase
      .from("payment_links")
      .select("square_payment_link_url, amount")
      .eq("unit_size", customer.unit.unit_size)
      .eq("billing_type", billingType)
      .eq("active", true)
      .maybeSingle();

    if (!link?.square_payment_link_url) {
      setPayingType(null);
      return;
    }

    // Insert a pending payment row so we can match it on return
    const { data: payment } = await supabase
      .from("payments")
      .insert({
        customer_id: customer.id,
        unit_id: customer.unit.id,
        billing_type: billingType,
        amount: link.amount,
        status: "pending",
        payment_date: null,
        notes: null,
      })
      .select("id")
      .single();

    if (payment?.id) {
      localStorage.setItem("sfss_pending_payment_id", payment.id);
    }

    window.location.href = link.square_payment_link_url;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (loading) return <PageSpinner />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4E9D8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: "linear-gradient(180deg, #5C1219 0%, #4A0F14 100%)",
          borderBottom: "2px solid #C78A3B",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a href="/">
            <img
              src={logoImg}
              alt="Seneca Falls Self Storage"
              style={{ height: "40px", width: "auto" }}
            />
          </a>
          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: "none",
              color: "#D8C6AF",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.95rem",
              cursor: "pointer",
              padding: "0.4rem 0",
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          flex: 1,
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
          padding: "2rem 1.5rem 3rem",
        }}
      >
        {/* Welcome */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#7A4A20",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 0.25rem",
            }}
          >
            Customer Portal
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2A1412",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {customer
              ? `Welcome, ${customer.first_name}.`
              : "Welcome to Your Account"}
          </h1>
        </div>

        {/* Status-based content */}
        {!customer && <NoProfile />}
        {customer?.status === "pending_verification" && <PendingState />}
        {customer?.status === "inactive" && <InactiveState />}
        {customer?.status === "active" && !customer.unit && <NoUnitState />}
        {customer?.status === "active" && customer.unit && (
          <ActiveState
            customer={customer}
            annualLinkExists={annualLinkExists ?? false}
            onPay={handlePay}
            payingType={payingType}
          />
        )}

        {/* Contact footer */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.25rem 1.5rem",
            background: "#FDF8F0",
            border: "1px solid #D8C6AF",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2A1412",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Need help?
          </span>
          <a
            href={PHONE_HREF}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Cormorant Garamond', serif",
              color: "#4A0F14",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            <Phone size={15} style={{ color: "#C78A3B" }} />
            {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Cormorant Garamond', serif",
              color: "#4A0F14",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            <Mail size={15} style={{ color: "#C78A3B" }} />
            {EMAIL}
          </a>
        </div>
      </main>
    </div>
  );
}

function NoProfile() {
  return (
    <InfoCard color="#FEF3C7" border="#FDE68A">
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#92400E",
          fontSize: "1.05rem",
          margin: 0,
        }}
      >
        We couldn't find a profile for your account. Please contact us at{" "}
        <a href={`tel:+13155394692`} style={{ color: "#4A0F14", fontWeight: 700 }}>
          (315) 539-4692
        </a>{" "}
        so we can set you up.
      </p>
    </InfoCard>
  );
}

function PendingState() {
  return (
    <InfoCard color="#FEF3C7" border="#FDE68A">
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#92400E",
          fontWeight: 700,
          fontSize: "1.1rem",
          margin: "0 0 0.5rem",
        }}
      >
        Account Pending Verification
      </p>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#78350F",
          fontSize: "1.05rem",
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        Thank you for signing up! Our team will review your account and activate it within one
        business day. You'll be able to pay and manage your unit once we've confirmed your
        details.
      </p>
    </InfoCard>
  );
}

function InactiveState() {
  return (
    <InfoCard color="#F3F4F6" border="#D1D5DB">
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#374151",
          fontSize: "1.05rem",
          margin: 0,
        }}
      >
        Your account is currently inactive. Please contact us if you'd like to reactivate.
      </p>
    </InfoCard>
  );
}

function NoUnitState() {
  return (
    <InfoCard color="#EFF6FF" border="#BFDBFE">
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#1E40AF",
          fontSize: "1.05rem",
          margin: 0,
        }}
      >
        Your account is active but no unit has been assigned yet. Please contact us to get your
        unit set up.
      </p>
    </InfoCard>
  );
}

function ActiveState({
  customer,
  annualLinkExists,
  onPay,
  payingType,
}: {
  customer: Customer;
  annualLinkExists: boolean;
  onPay: (type: BillingType) => void;
  payingType: BillingType | null;
}) {
  const unit = customer.unit!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Unit info card */}
      <div
        style={{
          background: "#FDF8F0",
          border: "1px solid #D8C6AF",
          padding: "1.75rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#C78A3B",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 1rem",
          }}
        >
          Your Storage Unit
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <UnitStat label="Unit Number" value={`#${unit.unit_number}`} large />
          <UnitStat label="Unit Size" value={unit.unit_size} />
          <UnitStat label="Monthly Rate" value={`$${unit.monthly_price}/mo`} />
          {unit.annual_price && (
            <UnitStat
              label="Annual Rate"
              value={`$${unit.annual_price}/yr`}
              sub="(saves 1 month)"
            />
          )}
        </div>

        {/* Payment buttons */}
        <div
          style={{
            borderTop: "1px solid #D8C6AF",
            paddingTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          <button
            onClick={() => onPay("monthly")}
            disabled={payingType !== null}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: "1rem",
              padding: "16px 24px",
              opacity: payingType !== null ? 0.7 : 1,
            }}
          >
            {payingType === "monthly" ? "Opening payment…" : `Pay Monthly Bill — $${unit.monthly_price}`}
          </button>

          {annualLinkExists ? (
            <button
              onClick={() => onPay("annual")}
              disabled={payingType !== null}
              className="btn-outline-gold"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "1rem",
                padding: "15px 24px",
                opacity: payingType !== null ? 0.7 : 1,
              }}
            >
              {payingType === "annual"
                ? "Opening payment…"
                : `Pay for the Year — $${unit.annual_price ?? ""}`}
            </button>
          ) : (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#7A5C4A",
                fontSize: "0.95rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              For annual payment options, please contact us.
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          background: "#4A0F14",
          border: "1px solid #C78A3B",
          padding: "1rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#F4E9D8",
            fontSize: "1rem",
            margin: 0,
          }}
        >
          ✦ Pay annually and get one month FREE — contact us to set it up. ✦
        </p>
      </div>
    </div>
  );
}

function UnitStat({
  label,
  value,
  sub,
  large,
}: {
  label: string;
  value: string;
  sub?: string;
  large?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#7A5C4A",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: "0 0 0.25rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#2A1412",
          fontSize: large ? "1.6rem" : "1.25rem",
          fontWeight: 700,
          margin: 0,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#C78A3B",
            fontSize: "0.8rem",
            margin: "0.15rem 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function InfoCard({
  children,
  color,
  border,
}: {
  children: React.ReactNode;
  color: string;
  border: string;
}) {
  return (
    <div style={{ background: color, border: `1px solid ${border}`, padding: "1.5rem" }}>
      {children}
    </div>
  );
}

function PageSpinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4E9D8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #D8C6AF",
          borderTopColor: "#4A0F14",
          borderRadius: "50%",
          animation: "sfss-spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}
