import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Customer, CustomerStatus, Unit, BillingType, PaymentStatus } from "@/lib/database.types";
import { lookupUnit } from "@/lib/unitMapping";
import { X } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

type FilterStatus = "all" | CustomerStatus;

const STATUS_LABELS: Record<CustomerStatus, string> = {
  pending_verification: "Pending",
  active: "Active",
  inactive: "Inactive",
};

const STATUS_COLORS: Record<CustomerStatus, { bg: string; color: string }> = {
  pending_verification: { bg: "#FEF3C7", color: "#92400E" },
  active: { bg: "#D1FAE5", color: "#065F46" },
  inactive: { bg: "#F3F4F6", color: "#374151" },
};

function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [editForm, setEditForm] = useState({
    unit_id: "",
    status: "pending_verification" as CustomerStatus,
    notes: "",
  });

  const [payForm, setPayForm] = useState({
    billing_type: "monthly" as BillingType,
    amount: "",
    status: "paid" as PaymentStatus,
    payment_date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const loadData = async () => {
    const [{ data: custs }, { data: unitList }] = await Promise.all([
      supabase
        .from("customers")
        .select("*, unit:units(*)")
        .order("created_at", { ascending: false }),
      supabase.from("units").select("*"),
    ]);
    setCustomers((custs as Customer[]) ?? []);
    const sortedUnits = (unitList ?? []).sort(
      (a, b) => parseInt(a.unit_number) - parseInt(b.unit_number)
    );
    setUnits(sortedUnits);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setEditForm({
      unit_id: c.unit_id ?? "",
      status: c.status,
      notes: c.notes ?? "",
    });
    setMsg("");
  };

  const saveEdit = async () => {
    if (!editingCustomer) return;
    setSaving(true);
    const prevUnitId = editingCustomer.unit_id;
    const newUnitId = editForm.unit_id || null;

    const { error } = await supabase
      .from("customers")
      .update({
        unit_id: newUnitId,
        status: editForm.status,
        notes: editForm.notes || null,
      })
      .eq("id", editingCustomer.id);

    if (error) {
      setMsg("Error: " + error.message);
      setSaving(false);
      return;
    }

    // Keep unit statuses in sync
    if (prevUnitId !== newUnitId) {
      if (prevUnitId) {
        await supabase.from("units").update({ status: "available" }).eq("id", prevUnitId);
      }
      if (newUnitId) {
        await supabase.from("units").update({ status: "occupied" }).eq("id", newUnitId);
      }
    }

    await loadData();
    setEditingCustomer(null);
    setSaving(false);
  };

  const openPayment = (c: Customer) => {
    setPaymentCustomer(c);
    setPayForm({
      billing_type: "monthly",
      amount: c.unit?.monthly_price?.toString() ?? "",
      status: "paid",
      payment_date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setMsg("");
  };

  const savePayment = async () => {
    if (!paymentCustomer) return;
    setSaving(true);

    const { error } = await supabase.from("payments").insert({
      customer_id: paymentCustomer.id,
      unit_id: paymentCustomer.unit_id ?? null,
      billing_type: payForm.billing_type,
      amount: parseFloat(payForm.amount),
      status: payForm.status,
      payment_date: payForm.payment_date
        ? new Date(payForm.payment_date).toISOString()
        : null,
      notes: payForm.notes || null,
    });

    if (error) {
      setMsg("Error: " + error.message);
      setSaving(false);
      return;
    }

    setPaymentCustomer(null);
    setSaving(false);
  };

  const visible = filter === "all" ? customers : customers.filter((c) => c.status === filter);

  if (loading) return <BodySpinner />;

  // Available units for assignment = available ones + the currently assigned unit
  const assignableUnits = (customer: Customer) =>
    units.filter(
      (u) => u.status === "available" || u.id === customer.unit_id
    );

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <p style={LBL}>Administration</p>
          <h1 style={H1}>Customers</h1>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["all", "pending_verification", "active", "inactive"] as FilterStatus[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.45rem 0.9rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid",
                  borderRadius: "3px",
                  background: filter === f ? "#4A0F14" : "transparent",
                  color: filter === f ? "#F4E9D8" : "#4A0F14",
                  borderColor: filter === f ? "#4A0F14" : "#D8C6AF",
                }}
              >
                {f === "all"
                  ? `All (${customers.length})`
                  : `${STATUS_LABELS[f as CustomerStatus]} (${customers.filter((c) => c.status === f).length})`}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#FDF8F0",
          border: "1px solid #D8C6AF",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#4A0F14" }}>
              {["Name", "Email", "Phone", "Unit", "Status", "Registered", "Actions"].map(
                (h) => (
                  <th key={h} style={TH}>{h}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...TD, textAlign: "center", color: "#7A5C4A" }}>
                  No customers found.
                </td>
              </tr>
            )}
            {visible.map((c, i) => {
              const { bg, color } = STATUS_COLORS[c.status];
              return (
                <tr key={c.id} style={{ background: i % 2 === 0 ? "#FDF8F0" : "#F8F2E8" }}>
                  <td style={{ ...TD, fontWeight: 600 }}>
                    {c.first_name} {c.last_name}
                  </td>
                  <td style={TD}>{c.email}</td>
                  <td style={TD}>{c.phone ?? "—"}</td>
                  <td style={TD}>
                    {c.unit ? (
                      <>
                        <span style={{ fontWeight: 600 }}>#{c.unit.unit_number}</span>
                        <span style={{ color: "#7A5C4A" }}> ({c.unit.unit_size})</span>
                      </>
                    ) : (
                      <span style={{ color: "#7A5C4A" }}>
                        {c.requested_unit_number
                          ? `Req: ${c.requested_unit_number}`
                          : "—"}
                      </span>
                    )}
                  </td>
                  <td style={TD}>
                    <span
                      style={{
                        background: bg,
                        color,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "2px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      {STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td style={TD}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td style={{ ...TD, whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => openEdit(c)}
                      style={ActionBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openPayment(c)}
                      style={{ ...ActionBtn, marginLeft: "0.5rem", color: "#065F46" }}
                    >
                      + Payment
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editingCustomer && (
        <Modal onClose={() => setEditingCustomer(null)} title={`Edit: ${editingCustomer.first_name} ${editingCustomer.last_name}`}>
          {msg && <ErrorMsg>{msg}</ErrorMsg>}

          <Field label="Assign Unit">
            {editingCustomer.requested_unit_number && (() => {
              const spec = lookupUnit(editingCustomer.requested_unit_number);
              return (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#92400E", background: "#FEF3C7", border: "1px solid #FDE68A", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
                  Customer requested unit <strong>#{editingCustomer.requested_unit_number}</strong>
                  {spec ? ` — ${spec.size}, $${spec.monthlyPrice}/mo` : " (unknown unit)"}
                </p>
              );
            })()}
            <select
              value={editForm.unit_id}
              onChange={(e) => setEditForm((f) => ({ ...f, unit_id: e.target.value }))}
              style={SELECT}
            >
              <option value="">— No unit assigned —</option>
              {assignableUnits(editingCustomer).map((u) => (
                <option key={u.id} value={u.id}>
                  #{u.unit_number} — {u.unit_size} — ${u.monthly_price}/mo ({u.status})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Account Status">
            <select
              value={editForm.status}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, status: e.target.value as CustomerStatus }))
              }
              style={SELECT}
            >
              <option value="pending_verification">Pending Verification</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>

          <Field label="Internal Notes">
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              style={{ ...SELECT, resize: "vertical" }}
              placeholder="Notes visible only to admin…"
            />
          </Field>

          {editingCustomer.requested_unit_number && (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#7A4A20", fontSize: "0.95rem", margin: "0 0 0.75rem" }}>
              Customer requested unit: <strong>{editingCustomer.requested_unit_number}</strong>
            </p>
          )}

          <ModalActions>
            <button onClick={() => setEditingCustomer(null)} className="btn-outline-gold" style={{ padding: "10px 24px" }}>
              Cancel
            </button>
            <button onClick={saveEdit} disabled={saving} className="btn-primary" style={{ padding: "10px 24px", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </ModalActions>
        </Modal>
      )}

      {/* Record payment modal */}
      {paymentCustomer && (
        <Modal onClose={() => setPaymentCustomer(null)} title={`Record Payment: ${paymentCustomer.first_name} ${paymentCustomer.last_name}`}>
          {msg && <ErrorMsg>{msg}</ErrorMsg>}

          <Field label="Billing Type">
            <select
              value={payForm.billing_type}
              onChange={(e) =>
                setPayForm((f) => ({ ...f, billing_type: e.target.value as BillingType }))
              }
              style={SELECT}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </Field>

          <Field label="Amount ($)">
            <input
              type="number"
              step="0.01"
              value={payForm.amount}
              onChange={(e) => setPayForm((f) => ({ ...f, amount: e.target.value }))}
              style={INPUT}
            />
          </Field>

          <Field label="Payment Status">
            <select
              value={payForm.status}
              onChange={(e) => setPayForm((f) => ({ ...f, status: e.target.value as PaymentStatus }))}
              style={SELECT}
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="manual_review">Manual Review</option>
            </select>
          </Field>

          <Field label="Payment Date">
            <input
              type="date"
              value={payForm.payment_date}
              onChange={(e) => setPayForm((f) => ({ ...f, payment_date: e.target.value }))}
              style={INPUT}
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={payForm.notes}
              onChange={(e) => setPayForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              style={{ ...SELECT, resize: "vertical" }}
            />
          </Field>

          <ModalActions>
            <button onClick={() => setPaymentCustomer(null)} className="btn-outline-gold" style={{ padding: "10px 24px" }}>
              Cancel
            </button>
            <button
              onClick={savePayment}
              disabled={saving || !payForm.amount}
              className="btn-primary"
              style={{ padding: "10px 24px", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Recording…" : "Record Payment"}
            </button>
          </ModalActions>
        </Modal>
      )}
    </main>
  );
}

// ── Shared sub-components ───────────────────────────────────

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,20,18,0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#FDF8F0",
          border: "1px solid #D8C6AF",
          padding: "1.75rem",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2A1412",
              fontSize: "1.15rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#7A5C4A", padding: "0.1rem" }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: "#2A1412",
          marginBottom: "0.35rem",
          fontSize: "1rem",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ModalActions({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
        marginTop: "1.5rem",
        paddingTop: "1rem",
        borderTop: "1px solid #D8C6AF",
      }}
    >
      {children}
    </div>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FEE2E2",
        border: "1px solid #FECACA",
        color: "#991B1B",
        padding: "0.6rem 0.85rem",
        marginBottom: "1rem",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "0.95rem",
      }}
    >
      {children}
    </div>
  );
}

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

const TH: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#F4E9D8",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  padding: "0.65rem 0.85rem",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#2A1412",
  fontSize: "0.95rem",
  padding: "0.7rem 0.85rem",
  borderBottom: "1px solid #EDE0CC",
};

const SELECT: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.8rem",
  border: "1px solid #D8C6AF",
  background: "#fff",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "1rem",
  color: "#2A1412",
  boxSizing: "border-box",
};

const INPUT: React.CSSProperties = { ...SELECT };

const ActionBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "#4A0F14",
  cursor: "pointer",
  padding: "0.1rem 0",
  textDecoration: "underline",
};
