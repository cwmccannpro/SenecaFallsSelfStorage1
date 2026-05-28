import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logoImg from "@/assets/logo4.png";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

const S = {
  page: {
    minHeight: "100vh",
    background: "#F4E9D8",
    display: "flex",
    flexDirection: "column" as const,
  },
  wrap: { width: "100%", maxWidth: "420px" },
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
};

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when user lands here from the reset email link.
    // It also handles setting the session from the URL hash automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if there's already a session (in case event already fired)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }

    setDone(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 2500);
  };

  const pageHeader = (
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

  if (done) {
    return (
      <div style={S.page}>
        {pageHeader}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
          <div style={S.wrap}>
            <div style={{ ...S.card, textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#C78A3B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDF8F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 style={{ ...S.h1, textAlign: "center" }}>Password Updated</h1>
              <p style={{ ...S.sub, textAlign: "center" }}>
                Your password has been changed. Redirecting you to your dashboard…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={S.page}>
        {pageHeader}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
          <div style={S.wrap}>
            <div style={{ ...S.card, textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#7A5C4A", fontSize: "1.05rem" }}>
                Verifying reset link…
              </p>
            </div>
            <p style={{ textAlign: "center", marginTop: "1.5rem", fontFamily: "'Cormorant Garamond', serif", color: "#7A5C4A", fontSize: "0.95rem" }}>
              <a href="/login" style={{ color: "#C78A3B" }}>← Back to Sign In</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {pageHeader}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
        <div style={S.wrap}>
          <div style={S.card}>
            <h1 style={S.h1}>Set New Password</h1>
            <p style={S.sub}>Choose a strong password for your account</p>

            {error && <div style={S.err}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={S.label}>New Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={S.input}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label style={S.label}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={S.input}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Saving…" : "Update Password"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontFamily: "'Cormorant Garamond', serif", color: "#7A5C4A", fontSize: "0.95rem" }}>
            <a href="/login" style={{ color: "#C78A3B" }}>← Back to Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
