import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { PaymentLink, BillingType } from "@/lib/database.types";
import { Plus, X, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/payment-links")({
  component: AdminPaymentLinks,
});

const UNIT_SIZES = ["5×10", "10×10", "10×15", "10×20"];

function AdminPaymentLinks() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<PaymentLink | null | "new">(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    unit_size: "5×10",
    billing_type: "monthly" as BillingType,
    amount: "",
    square_payment_link_url: "",
    active: true,
  });

  const loadData = async () => {
    const { data } = await supabase
      .from("payment_links")
      .select("*")
      .order("unit_size")
      .order("billing_type");
    setLinks(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditingLink("new");
    setForm({ unit_size: "5×10", billing_type: "monthly", amount: "", square_payment_link_url: "", active: true });
    setMsg("");
  };

  const openEdit = (l: PaymentLink) => {
    setEditingLink(l);
    setForm({
      unit_size: l.unit_size,
      billing_type: l.billing_type,
      amount: l.amount.toString(),
      square_payment_link_url: l.square_payment_link_url,
      active: l.active,
    });
    setMsg("");
  };

  const save = async () => {
    if (!form.amount || !form.square_payment_link_url) {
      setMsg("Amount and payment link URL are required.");
      return;
    }
    setSaving(true);

    const payload = {
      unit_size: form.unit_size,
      billing_type: form.billing_type,
      amount: parseFloat(form.amount),
      square_payment_link_url: form.square_payment_link_url.trim(),
      active: form.active,
    };

    let error;
    if (editingLink === "new") {
      ({ error } = await supabase.from("payment_links").insert(payload));
    } else if (editingLink) {
      ({ error } = await supabase.from("payment_links").update(payload).eq("id", editingLink.id));
    }

    if (error) {
      setMsg("Error: " + error.message);
      setSaving(false);
      return;
    }

    await loadData();
    setEditingLink(null);
    setSaving(false);
  };

  const toggleActive = async (link: PaymentLink) => {
    await supabase.from("payment_links").update({ active: !link.active }).eq("id", link.id);
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, active: !l.active } : l))
    );
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Delete this payment link?")) return;
    await supabase.from("payment_links").delete().eq("id", id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) return <BodySpinner />;

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 4rem", width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p style={LBL}>Administration</p>
          <h1 style={H1}>Payment Links</h1>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "10px 20px" }}
        >
          <Plus size={15} /> Add Link
        </button>
      </div>

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#7A5C4A",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        Each Square Payment Link is matched to a unit size and billing type. Customers are
        automatically routed to the correct link when they click "Pay" on their dashboard.
      </p>

      {/* Table */}
      <div style={{ background: "#FDF8F0", border: "1px solid #D8C6AF", overflow: "auto", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "620px" }}>
          <thead>
            <tr style={{ background: "#4A0F14" }}>
              {["Unit Size", "Type", "Amount", "Square Payment URL", "Active", "Actions"].map(
                (h) => <th key={h} style={TH}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...TD, textAlign: "center", color: "#7A5C4A" }}>
                  No payment links yet. Add your first Square Payment Link above.
                </td>
              </tr>
            )}
            {links.map((l, i) => (
              <tr key={l.id} style={{ background: i % 2 === 0 ? "#FDF8F0" : "#F8F2E8" }}>
                <td style={{ ...TD, fontWeight: 700 }}>{l.unit_size}</td>
                <td style={TD}>
                  <span
                    style={{
                      background: l.billing_type === "monthly" ? "#DBEAFE" : "#EDE9FE",
                      color: l.billing_type === "monthly" ? "#1E40AF" : "#5B21B6",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "2px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {l.billing_type}
                  </span>
                </td>
                <td style={{ ...TD, fontWeight: 600 }}>${l.amount}</td>
                <td style={TD}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", maxWidth: "280px" }}>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.85rem",
                        color: "#5C3A28",
                        flex: 1,
                      }}
                    >
                      {l.square_payment_link_url}
                    </span>
                    <a
                      href={l.square_payment_link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#C78A3B", flexShrink: 0 }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
                <td style={TD}>
                  <button
                    onClick={() => toggleActive(l)}
                    style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid",
                      background: l.active ? "#D1FAE5" : "#F3F4F6",
                      color: l.active ? "#065F46" : "#6B7280",
                      borderColor: l.active ? "#A7F3D0" : "#D1D5DB",
                    }}
                  >
                    {l.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td style={{ ...TD, whiteSpace: "nowrap" }}>
                  <button onClick={() => openEdit(l)} style={ActionBtn}>Edit</button>
                  <button
                    onClick={() => deleteLink(l.id)}
                    style={{ ...ActionBtn, marginLeft: "0.75rem", color: "#991B1B" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Matrix helper: which combinations are covered */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#2A1412", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Coverage Matrix
        </h2>
        <div style={{ background: "#FDF8F0", border: "1px solid #D8C6AF", overflow: "auto", width: "100%" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "400px" }}>
            <thead>
              <tr style={{ background: "#4A0F14" }}>
                <th style={TH}>Unit Size</th>
                <th style={TH}>Monthly Link</th>
                <th style={TH}>Annual Link</th>
              </tr>
            </thead>
            <tbody>
              {UNIT_SIZES.map((size, i) => {
                const hasMonthly = links.some((l) => l.unit_size === size && l.billing_type === "monthly" && l.active);
                const hasAnnual  = links.some((l) => l.unit_size === size && l.billing_type === "annual"  && l.active);
                return (
                  <tr key={size} style={{ background: i % 2 === 0 ? "#FDF8F0" : "#F8F2E8" }}>
                    <td style={{ ...TD, fontWeight: 700 }}>{size}</td>
                    <td style={TD}><CoverageCell ok={hasMonthly} /></td>
                    <td style={TD}><CoverageCell ok={hasAnnual} optional /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      {editingLink !== null && (
        <Modal
          title={editingLink === "new" ? "Add Payment Link" : "Edit Payment Link"}
          onClose={() => setEditingLink(null)}
        >
          {msg && <ErrorMsg>{msg}</ErrorMsg>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Unit Size">
              <select
                value={form.unit_size}
                onChange={(e) => setForm((f) => ({ ...f, unit_size: e.target.value }))}
                style={INPUT}
              >
                {UNIT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Billing Type">
              <select
                value={form.billing_type}
                onChange={(e) => setForm((f) => ({ ...f, billing_type: e.target.value as BillingType }))}
                style={INPUT}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </Field>
          </div>

          <Field label="Amount ($)">
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              style={INPUT}
              placeholder="65.00"
            />
          </Field>

          <Field label="Square Payment Link URL">
            <input
              type="url"
              value={form.square_payment_link_url}
              onChange={(e) => setForm((f) => ({ ...f, square_payment_link_url: e.target.value }))}
              style={INPUT}
              placeholder="https://square.link/u/..."
            />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#7A5C4A", fontSize: "0.88rem", margin: "0.3rem 0 0" }}>
              Create links in Square Dashboard → Online Checkout → Payment Links
            </p>
          </Field>

          <Field label="Status">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#4A0F14" }}
              />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#2A1412" }}>
                Active (customers will be routed to this link)
              </span>
            </label>
          </Field>

          <ModalActions>
            <button onClick={() => setEditingLink(null)} className="btn-outline-gold" style={{ padding: "10px 24px" }}>
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary"
              style={{ padding: "10px 24px", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving…" : editingLink === "new" ? "Add Link" : "Save Changes"}
            </button>
          </ModalActions>
        </Modal>
      )}
    </main>
  );
}

function CoverageCell({ ok, optional }: { ok: boolean; optional?: boolean }) {
  if (ok) return <span style={{ color: "#065F46", fontWeight: 700 }}>✓ Linked</span>;
  if (optional) return <span style={{ color: "#7A5C4A" }}>— (optional)</span>;
  return <span style={{ color: "#991B1B", fontWeight: 600 }}>✗ Missing</span>;
}

// ── Shared ───────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(42,20,18,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#FDF8F0", border: "1px solid #D8C6AF", padding: "1.75rem", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#2A1412", fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#7A5C4A" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#2A1412", marginBottom: "0.35rem", fontSize: "1rem" }}>{label}</label>
      {children}
    </div>
  );
}

function ModalActions({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #D8C6AF" }}>
      {children}
    </div>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", color: "#991B1B", padding: "0.6rem 0.85rem", marginBottom: "1rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>
      {children}
    </div>
  );
}

function BodySpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>
      <div style={{ width: "32px", height: "32px", border: "3px solid #D8C6AF", borderTopColor: "#4A0F14", borderRadius: "50%", animation: "sfss-spin 0.8s linear infinite" }} />
    </div>
  );
}

const LBL: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", color: "#C78A3B", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 0.25rem" };
const H1: React.CSSProperties = { fontFamily: "'Playfair Display', serif", color: "#2A1412", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, margin: 0 };
const TH: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", color: "#F4E9D8", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.65rem 0.85rem", textAlign: "left", whiteSpace: "nowrap" };
const TD: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", color: "#2A1412", fontSize: "0.95rem", padding: "0.7rem 0.85rem", borderBottom: "1px solid #EDE0CC" };
const INPUT: React.CSSProperties = { width: "100%", padding: "0.65rem 0.8rem", border: "1px solid #D8C6AF", background: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#2A1412", boxSizing: "border-box" };
const ActionBtn: React.CSSProperties = { background: "none", border: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontWeight: 700, color: "#4A0F14", cursor: "pointer", padding: "0.1rem 0", textDecoration: "underline" };
