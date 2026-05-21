import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Unit, UnitStatus } from "@/lib/database.types";
import { lookupUnit } from "@/lib/unitMapping";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin/units")({
  component: AdminUnits,
});

const STATUS_COLORS: Record<UnitStatus, { bg: string; color: string }> = {
  available:   { bg: "#D1FAE5", color: "#065F46" },
  occupied:    { bg: "#FEE2E2", color: "#991B1B" },
  reserved:    { bg: "#FEF3C7", color: "#92400E" },
  maintenance: { bg: "#F3F4F6", color: "#374151" },
};

interface UnitWithTenant extends Unit {
  customers?: Array<{ id: string; first_name: string; last_name: string; email: string }>;
}

function AdminUnits() {
  const [units, setUnits] = useState<UnitWithTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState<Unit | null | "new">(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<UnitStatus | "all">("all");

  const [form, setForm] = useState({
    unit_number: "",
    unit_size: "",
    monthly_price: "",
    annual_price: "",
    status: "available" as UnitStatus,
  });

  const loadData = async () => {
    const { data } = await supabase
      .from("units")
      .select("*, customers(id, first_name, last_name, email)");
    const sorted = (data as UnitWithTenant[] ?? []).sort(
      (a, b) => parseInt(a.unit_number) - parseInt(b.unit_number)
    );
    setUnits(sorted);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditingUnit("new");
    setForm({ unit_number: "", unit_size: "", monthly_price: "", annual_price: "", status: "available" });
    setMsg("");
  };

  const openEdit = (u: Unit) => {
    setEditingUnit(u);
    setForm({
      unit_number: u.unit_number,
      unit_size: u.unit_size,
      monthly_price: u.monthly_price.toString(),
      annual_price: u.annual_price?.toString() ?? "",
      status: u.status,
    });
    setMsg("");
  };

  const save = async () => {
    if (!form.unit_number || !form.unit_size || !form.monthly_price) {
      setMsg("Unit number, size, and monthly price are required.");
      return;
    }
    setSaving(true);

    const payload = {
      unit_number: form.unit_number.trim(),
      unit_size: form.unit_size.trim(),
      monthly_price: parseFloat(form.monthly_price),
      annual_price: form.annual_price ? parseFloat(form.annual_price) : null,
      status: form.status,
    };

    let error;
    if (editingUnit === "new") {
      ({ error } = await supabase.from("units").insert(payload));
    } else if (editingUnit) {
      ({ error } = await supabase.from("units").update(payload).eq("id", editingUnit.id));
    }

    if (error) {
      setMsg("Error: " + error.message);
      setSaving(false);
      return;
    }

    await loadData();
    setEditingUnit(null);
    setSaving(false);
  };

  const visible = filterStatus === "all" ? units : units.filter((u) => u.status === filterStatus);

  if (loading) return <BodySpinner />;

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
          <h1 style={H1}>Units</h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {(["all", "available", "occupied", "reserved", "maintenance"] as (UnitStatus | "all")[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid",
                    borderRadius: "3px",
                    background: filterStatus === f ? "#4A0F14" : "transparent",
                    color: filterStatus === f ? "#F4E9D8" : "#4A0F14",
                    borderColor: filterStatus === f ? "#4A0F14" : "#D8C6AF",
                    textTransform: "capitalize",
                  }}
                >
                  {f === "all" ? `All (${units.length})` : `${f} (${units.filter((u) => u.status === f).length})`}
                </button>
              )
            )}
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "10px 20px" }}>
            <Plus size={15} /> Add Unit
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#FDF8F0", border: "1px solid #D8C6AF", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
          <thead>
            <tr style={{ background: "#4A0F14" }}>
              {["Unit #", "Size", "Monthly", "Annual", "Status", "Current Tenant", "Actions"].map(
                (h) => <th key={h} style={TH}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...TD, textAlign: "center", color: "#7A5C4A" }}>
                  No units found.
                </td>
              </tr>
            )}
            {visible.map((u, i) => {
              const tenant = u.customers?.[0] ?? null;
              const { bg, color } = STATUS_COLORS[u.status];
              return (
                <tr key={u.id} style={{ background: i % 2 === 0 ? "#FDF8F0" : "#F8F2E8" }}>
                  <td style={{ ...TD, fontWeight: 700 }}>#{u.unit_number}</td>
                  <td style={TD}>{u.unit_size}</td>
                  <td style={TD}>${u.monthly_price}/mo</td>
                  <td style={TD}>{u.annual_price ? `$${u.annual_price}/yr` : "—"}</td>
                  <td style={TD}>
                    <span style={{ background: bg, color, padding: "0.2rem 0.55rem", borderRadius: "2px", fontSize: "0.82rem", fontWeight: 600, textTransform: "capitalize" }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={TD}>
                    {tenant ? (
                      <span>
                        {tenant.first_name} {tenant.last_name}
                        <br />
                        <span style={{ color: "#7A5C4A", fontSize: "0.85rem" }}>{tenant.email}</span>
                      </span>
                    ) : (
                      <span style={{ color: "#7A5C4A" }}>—</span>
                    )}
                  </td>
                  <td style={{ ...TD, whiteSpace: "nowrap" }}>
                    <button onClick={() => openEdit(u)} style={ActionBtn}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {editingUnit !== null && (
        <Modal
          onClose={() => setEditingUnit(null)}
          title={editingUnit === "new" ? "Add New Unit" : `Edit Unit #${(editingUnit as Unit).unit_number}`}
        >
          {msg && <ErrorMsg>{msg}</ErrorMsg>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Unit Number">
              <input
                type="text"
                value={form.unit_number}
                onChange={(e) => {
                  const num = e.target.value;
                  if (editingUnit === "new") {
                    const spec = lookupUnit(num);
                    setForm((f) => ({
                      ...f,
                      unit_number: num,
                      ...(spec ? {
                        unit_size: spec.size,
                        monthly_price: spec.monthlyPrice.toString(),
                        annual_price: spec.annualPrice.toString(),
                      } : {}),
                    }));
                  } else {
                    setForm((f) => ({ ...f, unit_number: num }));
                  }
                }}
                style={INPUT}
                placeholder="1–84"
              />
              {editingUnit === "new" && form.unit_number && lookupUnit(form.unit_number) && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#065F46", fontSize: "0.88rem", margin: "0.3rem 0 0" }}>
                  ✓ Auto-filled from unit map
                </p>
              )}
            </Field>
            <Field label="Unit Size">
              <select
                value={form.unit_size}
                onChange={(e) => setForm((f) => ({ ...f, unit_size: e.target.value }))}
                style={INPUT}
              >
                <option value="">Select size</option>
                {["5×10", "10×10", "10×15", "10×20"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Monthly Price ($)">
              <input
                type="number"
                step="0.01"
                value={form.monthly_price}
                onChange={(e) => setForm((f) => ({ ...f, monthly_price: e.target.value }))}
                style={INPUT}
                placeholder="65.00"
              />
            </Field>
            <Field label="Annual Price ($) — optional">
              <input
                type="number"
                step="0.01"
                value={form.annual_price}
                onChange={(e) => setForm((f) => ({ ...f, annual_price: e.target.value }))}
                style={INPUT}
                placeholder="715.00"
              />
            </Field>
          </div>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as UnitStatus }))}
              style={INPUT}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </Field>

          <ModalActions>
            <button onClick={() => setEditingUnit(null)} className="btn-outline-gold" style={{ padding: "10px 24px" }}>
              Cancel
            </button>
            <button onClick={save} disabled={saving} className="btn-primary" style={{ padding: "10px 24px", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editingUnit === "new" ? "Add Unit" : "Save Changes"}
            </button>
          </ModalActions>
        </Modal>
      )}
    </main>
  );
}

// ── Shared ───────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(42,20,18,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#FDF8F0", border: "1px solid #D8C6AF", padding: "1.75rem", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
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
