import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logoImg from "@/assets/logo4.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
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

type View = "login" | "forgot" | "sent";

function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setReady(true);
        return;
      }
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
      navigate({ to: admin ? "/admin" : "/dashboard" });
    });
  }, [navigate]);

  if (!ready) return <PageSpinner />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    navigate({ to: admin ? "/admin" : "/dashboard" });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (resetErr) {
      setError(resetErr.message);
      return;
    }
    setView("sent");
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

  if (view === "sent") {
    return (
      <div style={S.page}>
        {pageHeader}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
          <div style={S.wrap}>
            <div style={{ ...S.card, textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#C78A3B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDF8F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 style={{ ...S.h1, textAlign: "center" }}>Check your email</h1>
              <p style={{ ...S.sub, textAlign: "center", marginBottom: "1.75rem" }}>
                We sent a password reset link to <strong>{email}</strong>. Click the link in that email to set a new password.
              </p>
              <button
                onClick={() => { setView("login"); setError(""); }}
                className="btn-outline-gold"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "forgot") {
    return (
      <div style={S.page}>
        {pageHeader}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
          <div style={S.wrap}>
            <div style={S.card}>
              <h1 style={S.h1}>Reset Password</h1>
              <p style={S.sub}>Enter your email and we'll send you a reset link</p>

              {error && <div style={S.err}>{error}</div>}

              <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={S.label}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={S.input}
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", color: "#7A5C4A", marginTop: "1.5rem", fontSize: "1.05rem" }}>
                <button
                  onClick={() => { setView("login"); setError(""); }}
                  style={{ background: "none", border: "none", color: "#4A0F14", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                >
                  ← Back to Sign In
                </button>
              </p>
            </div>
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
          <h1 style={S.h1}>Customer Sign In</h1>
          <p style={S.sub}>Access your storage account</p>

          {error && <div style={S.err}>{error}</div>}

          <form
            onSubmit={handleSignIn}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={S.label}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={S.input}
                autoComplete="email"
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
                <label style={{ ...S.label, marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => { setView("forgot"); setError(""); }}
                  style={{ background: "none", border: "none", color: "#C78A3B", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={S.input}
                autoComplete="current-password"
              />
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
              {loading ? "Signing in…" : "Sign In"}
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
            New customer?{" "}
            <a
              href="/register"
              style={{ color: "#4A0F14", fontWeight: 700, textDecoration: "underline" }}
            >
              Create an account
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
