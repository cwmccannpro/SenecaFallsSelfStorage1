import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Home, Phone } from "lucide-react";
import logoImg from "@/assets/logo4.png";

export const Route = createFileRoute("/payment-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    checkoutId: (search.checkoutId as string) ?? "",
    orderId: (search.orderId as string) ?? "",
    transactionId: (search.transactionId as string) ?? "",
    referenceId: (search.referenceId as string) ?? "",
  }),
  component: PaymentSuccess,
});

const PHONE_DISPLAY = "(315) 539-4692";
const PHONE_HREF = "tel:+13155394692";

function PaymentSuccess() {
  const { checkoutId, orderId, transactionId, referenceId } =
    Route.useSearch();

  const confirmationId = orderId || checkoutId || transactionId || referenceId;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #4A0F14 0%, #3A0C11 100%)" }}
    >
      {/* Top border accent */}
      <div style={{ height: "3px", background: "#C78A3B" }} />

      {/* Header */}
      <header
        className="flex items-center justify-center py-5 px-6"
        style={{ borderBottom: "1px solid rgba(199,138,59,0.3)" }}
      >
        <a href="/" aria-label="Seneca Falls Self Storage">
          <img
            src={logoImg}
            alt="Seneca Falls Self Storage"
            className="h-12 w-auto"
          />
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-lg text-center p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(199,138,59,0.45)",
          }}
        >
          {/* Check icon */}
          <div className="flex justify-center mb-6">
            <div
              className="flex h-20 w-20 items-center justify-center"
              style={{
                background: "rgba(199,138,59,0.14)",
                border: "2px solid #C78A3B",
                borderRadius: "50%",
              }}
            >
              <CheckCircle className="h-10 w-10" style={{ color: "#E0A34A" }} />
            </div>
          </div>

          {/* Heading */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#C78A3B",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Payment Confirmed
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#F4E9D8",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              marginTop: "0.4rem",
              lineHeight: 1.2,
            }}
          >
            Thank You for Your Payment
          </h1>

          <div
            style={{
              height: "1px",
              width: "72px",
              background: "#C78A3B",
              margin: "1.25rem auto",
            }}
          />

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#D8C6AF",
              fontSize: "1.1rem",
              lineHeight: "1.75",
            }}
          >
            Your payment has been received. You're all set — your unit access
            remains active. If you have any questions, give us a call.
          </p>

          {/* Confirmation ID */}
          {confirmationId && (
            <div
              className="mt-6 px-5 py-4"
              style={{
                background: "rgba(199,138,59,0.08)",
                border: "1px solid rgba(199,138,59,0.3)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "#C78A3B",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "0.35rem",
                }}
              >
                Confirmation ID
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  color: "#F4E9D8",
                  fontSize: "0.9rem",
                  wordBreak: "break-all",
                }}
              >
                {confirmationId}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: "0.15em",
                color: "#2A1412",
                background: "#C78A3B",
                border: "1px solid #C78A3B",
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E0A34A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#C78A3B")
              }
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>

            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: "0.15em",
                color: "#D8C6AF",
                border: "1px solid rgba(199,138,59,0.5)",
                background: "transparent",
                textDecoration: "none",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C78A3B";
                e.currentTarget.style.color = "#E0A34A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(199,138,59,0.5)";
                e.currentTarget.style.color = "#D8C6AF";
              }}
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-6 px-4"
        style={{ borderTop: "1px solid rgba(199,138,59,0.2)" }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#7A5C4A",
            fontSize: "0.85rem",
          }}
        >
          © {new Date().getFullYear()} Seneca Falls Self Storage · 189 Ovid St, Seneca Falls, NY 13148
        </p>
      </footer>

      {/* Bottom border accent */}
      <div style={{ height: "3px", background: "#C78A3B" }} />
    </div>
  );
}
