import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import logoImg from "@/assets/logo4.png";
import { LogOut, Users, Building2, Link2, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

export function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: "/login" });
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!admin) {
        navigate({ to: "/dashboard" });
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    check();
  }, [navigate]);

  if (loading) return <PageSpinner />;

  return (
    <div style={{ minHeight: "100vh", background: "#F0EBE0", display: "flex", flexDirection: "column", width: "100%", overflowX: "clip" }}>
      <AdminNav user={user} onSignOut={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }} />
      <Outlet />
    </div>
  );
}

function AdminNav({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
  const navLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
    { to: "/admin/customers", icon: Users, label: "Customers", exact: false },
    { to: "/admin/units", icon: Building2, label: "Units", exact: false },
    { to: "/admin/payment-links", icon: Link2, label: "Payment Links", exact: false },
  ];

  return (
    <header
      style={{
        background: "linear-gradient(180deg, #5C1219 0%, #4A0F14 100%)",
        borderBottom: "2px solid #C78A3B",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <a href="/" style={{ flexShrink: 0 }}>
          <img src={logoImg} alt="SFSS" style={{ height: "36px", width: "auto" }} />
        </a>

        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#C78A3B",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Admin
        </span>

        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "0.25rem", flex: 1, overflowX: "auto" }}>
          {navLinks.map(({ to, icon: Icon, label, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.75rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
                borderRadius: "3px",
                transition: "background 0.15s",
              }}
              inactiveProps={{ style: { color: "#D8C6AF" } }}
              activeProps={{
                style: {
                  color: "#F4E9D8",
                  background: "rgba(199,138,59,0.18)",
                  outline: "1px solid rgba(199,138,59,0.35)",
                },
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
          {user && (
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#D8C6AF",
                fontSize: "0.85rem",
                display: "none",
              }}
              className="hidden sm:block"
            >
              {user.email}
            </span>
          )}
          <button
            onClick={onSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "transparent",
              border: "none",
              color: "#D8C6AF",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: "0.35rem",
            }}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </header>
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
