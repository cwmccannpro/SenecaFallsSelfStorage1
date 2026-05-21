import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import logoImg from "@/assets/logo4.png";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const S = {
  page: {
    minHeight: "100vh",
    background: "#F4E9D8",
    display: "flex",
    flexDirection: "column" as const,
  },
  wrap: { width: "100%", maxWidth: "480px" },
  card: { background: "#FDF8F0", border: "1px solid #D8C6AF", padding: "2rem" },
  h1: {
    fontFamily: "'Playfair Display', serif",
    color: "#2A1412",
    fontSize: "1.6rem",
    fontWeight: 700,
    margin: "0 0 0.25rem",
  },
  sub: {
    fontFamily: "'Cormorant Garamond', serif",
    color: "#7A5C4A",
    fontSize: "1.05rem",
    margin: "0 0 1.5rem",
  },
  label: {
    display: "block",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    color: "#2A1412",
    marginBottom: "0.35rem",
    fontSize: "1.05rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem 0.85rem",
    border: "1px solid #D8C6AF",
    background: "#fff",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1rem",
    color: "#2A1412",
    boxSizing: "border-box" as const,
    outline: "none",
  },
  err: {
    background: "#FEE2E2",
    border: "1px solid #FECACA",
    color: "#991B1B",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    fontSize: "0.95rem",
    fontFamily: "'Cormorant Garamond', serif",
  },
  hint: {
    fontFamily: "'Cormorant Garamond', serif",
    color: "#7A5C4A",
    fontSize: "0.9rem",
    marginTop: "0.3rem",
  },
};

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    requestedUnit: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpErr) {
      setError(signUpErr.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const { error: profileErr } = await supabase.from("customers").insert({
      user_id: data.user.id,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      requested_unit_number: form.requestedUnit.trim() || null,
      status: "pending_verification",
    });

    if (profileErr) {
      setError("Account created but profile save failed: " + profileErr.message);
      setLoading(false);
      return;
    }

    // If session is set, auto-confirm is enabled — go straight to dashboard
    if (data.session) {
      navigate({ to: "/dashboard" });
      return;
    }

    // Otherwise email confirmation is required
    setSuccess(true);
    setLoading(false);
  };

  const Banner = () => (
    <header style={{
      background: "linear-gradient(180deg, #5C1219 0%, #4A0F14 100%)",
      borderTop: "3px solid #C78A3B",
      borderBottom: "2px solid #C78A3B",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.1rem 1.5rem",
      boxShadow: "0 4px 24px rgba(30,4,8,0.5)",
    }}>
      <a href="/">
        <img src={logoImg} alt="Seneca Falls Self Storage" style={{ height: "56px", width: "auto" }} />
      </a>
    </header>
  );

  if (success) {
    return (
      <div style={S.page}>
        <Banner />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
        <div style={S.wrap}>
          <div style={S.card}>
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#166534",
                padding: "1rem",
                marginBottom: "1.5rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.05rem",
              }}
            >
              ✓ Account created! Check your email to verify your address, then sign in.
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#5C3A28",
                fontSize: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              Once your account is verified, our team will review and activate it. You'll have full
              access to your dashboard after we confirm your unit assignment.
            </p>
            <a href="/login" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Go to Sign In
            </a>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Banner />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
      <div style={S.wrap}>
        <div style={S.card}>
          <h1 style={S.h1}>Create an Account</h1>
          <p style={S.sub}>Set up your storage account to pay and manage your unit online.</p>

          {error && <div style={S.err}>{error}</div>}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={S.label}>First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={set("firstName")}
                  style={S.input}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label style={S.label}>Last Name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={set("lastName")}
                  style={S.input}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label style={S.label}>Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                style={S.input}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={S.label}>Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={set("password")}
                style={S.input}
                autoComplete="new-password"
              />
              <p style={S.hint}>At least 8 characters</p>
            </div>

            <div>
              <label style={S.label}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                style={S.input}
                autoComplete="tel"
                placeholder="(315) 555-0000"
              />
            </div>

            <div>
              <label style={S.label}>
                Unit Number{" "}
                <span style={{ fontWeight: 400, color: "#7A5C4A" }}>(optional)</span>
              </label>
              <input
                type="text"
                value={form.requestedUnit}
                onChange={set("requestedUnit")}
                style={S.input}
                placeholder="e.g. 14"
              />
              <p style={S.hint}>
                If you already rented a unit, enter it here. Our team will verify and assign it to
                your account.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "0.5rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontFamily: "'Cormorant Garamond', serif",
              color: "#7A5C4A",
              marginTop: "1.5rem",
              fontSize: "1.05rem",
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{ color: "#4A0F14", fontWeight: 700, textDecoration: "underline" }}
            >
              Sign in
            </a>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontFamily: "'Cormorant Garamond', serif",
            color: "#7A5C4A",
            fontSize: "0.95rem",
          }}
        >
          <a href="/" style={{ color: "#C78A3B" }}>
            ← Back to main site
          </a>
        </p>
      </div>
      </div>
    </div>
  );
}
