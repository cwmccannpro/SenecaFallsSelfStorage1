import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Customer, CustomerStatus, UnitStatus } from "@/lib/database.types";
import { Users, Building2, ClipboardList, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

interface Stats {
  customers: Record<CustomerStatus, number>;
  units: Record<UnitStatus, number>;
}

function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: custs }, { data: units }] = await Promise.all([
        supabase.from("customers").select("status"),
        supabase.from("units").select("status"),
      ]);

      const custCounts: Record<string, number> = {};
      custs?.forEach((c) => { custCounts[c.status] = (custCounts[c.status] ?? 0) + 1; });

      const unitCounts: Record<string, number> = {};
      units?.forEach((u) => { unitCounts[u.status] = (unitCounts[u.status] ?? 0) + 1; });

      setStats({
        customers: custCounts as Record<CustomerStatus, number>,
        units: unitCounts as Record<UnitStatus, number>,
      });

      const { data: pendingCusts } = await supabase
        .from("customers")
        .select("*, unit:units(*)")
        .eq("status", "pending_verification")
        .order("created_at");

      setPending((pendingCusts as Customer[]) ?? []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <BodySpinner />;

  const totalCustomers = Object.values(stats?.customers ?? {}).reduce((a, b) => a + b, 0);
  const totalUnits = Object.values(stats?.units ?? {}).reduce((a, b) => a + b, 0);

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={LBL}>Administration</p>
        <h1 style={H1}>Overview</h1>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <StatCard
          icon={<Users size={20} style={{ color: "#C78A3B" }} />}
          label="Total Customers"
          value={totalCustomers}
        />
        <StatCard
          icon={<AlertCircle size={20} style={{ color: "#C78A3B" }} />}
          label="Pending Verification"
          value={stats?.customers.pending_verification ?? 0}
          alert={(stats?.customers.pending_verification ?? 0) > 0}
          link="/admin/customers"
        />
        <StatCard
          icon={<Users size={20} style={{ color: "#C78A3B" }} />}
          label="Active Customers"
          value={stats?.customers.active ?? 0}
        />
        <StatCard
          icon={<Building2 size={20} style={{ color: "#C78A3B" }} />}
          label="Total Units"
          value={totalUnits}
        />
        <StatCard
          icon={<Building2 size={20} style={{ color: "#C78A3B" }} />}
          label="Available Units"
          value={stats?.units.available ?? 0}
        />
        <StatCard
          icon={<Building2 size={20} style={{ color: "#C78A3B" }} />}
          label="Occupied Units"
          value={stats?.units.occupied ?? 0}
        />
      </div>

      {/* Pending accounts */}
      {pending.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <AlertCircle size={18} style={{ color: "#C78A3B" }} />
            <h2 style={{ ...H2, margin: 0 }}>
              Pending Verification ({pending.length})
            </h2>
          </div>
          <div
            style={{
              background: "#FDF8F0",
              border: "1px solid #D8C6AF",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#4A0F14" }}>
                  {["Name", "Email", "Phone", "Requested Unit", "Registered", ""].map((h) => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? "#FDF8F0" : "#F8F2E8" }}>
                    <td style={TD}>{c.first_name} {c.last_name}</td>
                    <td style={TD}>{c.email}</td>
                    <td style={TD}>{c.phone ?? "—"}</td>
                    <td style={TD}>{c.requested_unit_number ?? "—"}</td>
                    <td style={TD}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td style={{ ...TD, textAlign: "right" }}>
                      <a
                        href="/admin/customers"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          color: "#4A0F14",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          textDecoration: "underline",
                        }}
                      >
                        Review →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div style={{ marginTop: "2.5rem" }}>
        <h2 style={{ ...H2, marginBottom: "1rem" }}>Quick Actions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {[
            { href: "/admin/customers", icon: <Users size={16} />, label: "Manage Customers" },
            { href: "/admin/units", icon: <Building2 size={16} />, label: "Manage Units" },
            { href: "/admin/payment-links", icon: <ClipboardList size={16} />, label: "Manage Payment Links" },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="btn-outline-gold"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  alert,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  alert?: boolean;
  link?: string;
}) {
  const inner = (
    <div
      style={{
        background: "#FDF8F0",
        border: alert ? "1px solid #C78A3B" : "1px solid #D8C6AF",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {icon}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#7A5C4A",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          color: alert ? "#4A0F14" : "#2A1412",
          fontSize: "2rem",
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  );

  if (link) {
    return (
      <a href={link} style={{ textDecoration: "none" }}>
        {inner}
      </a>
    );
  }

  return inner;
}

const LBL: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#C78A3B",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  margin: "0 0 0.25rem",
};

const H1: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  color: "#2A1412",
  fontSize: "clamp(1.5rem, 3vw, 2rem)",
  fontWeight: 700,
  margin: 0,
};

const H2: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  color: "#2A1412",
  fontSize: "1.15rem",
  fontWeight: 700,
};

const TH: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#F4E9D8",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  padding: "0.65rem 0.85rem",
  textAlign: "left",
};

const TD: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#2A1412",
  fontSize: "0.95rem",
  padding: "0.7rem 0.85rem",
  borderBottom: "1px solid #EDE0CC",
};

function BodySpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #D8C6AF",
          borderTopColor: "#4A0F14",
          borderRadius: "50%",
          animation: "sfss-spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}
