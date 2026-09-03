import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  MoveVertical,
  Boxes,
  Phone,
  Mail,
  MapPin,
  Check,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Star,
  CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { z } from "zod";
import heroImg from "@/assets/Hero.webp";
import logoImg from "@/assets/logo4-opt.png";
import facilityImg1 from "@/assets/IMG_9167.jpeg";
import facilityImg2 from "@/assets/IMG_9170.jpeg";
import facilityImg3 from "@/assets/IMG_9173.jpeg";
import facilityImg4 from "@/assets/IMG_9174.jpeg";

export const Route = createFileRoute("/")({ component: Index });
const ADDRESS = "189 Ovid St, Seneca Falls, NY 13148";
const PHONE_DISPLAY = "(315) 539-4692";
const PHONE_HREF = "tel:+13155394692";
const EMAIL = "tim@senecafallsselfstorage.com";
const MAP_EMBED = `https://www.google.com/maps?q=42.895932,-76.798644&output=embed`;
const MAP_LINK =
  "https://www.google.com/maps/place/Seneca+Falls+Self+Storage+LLC/@42.9160559,-76.8080464,14z/data=!4m10!1m2!2m1!1sseneca+falls+self+storage!3m6!1s0x89d0b7b99fb065c7:0xf507e8a07fc5c869!8m2!3d42.895932!4d-76.798644!15sChlzZW5lY2EgZmFsbHMgc2VsZiBzdG9yYWdlWhsiGXNlbmVjYSBmYWxscyBzZWxmIHN0b3JhZ2WSARVzZWxmX3N0b3JhZ2VfZmFjaWxpdHmaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTnViV0YyU201blJSQULgAQD6AQQIABBM!16s%2Fg%2F1tfrsxj1?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D";

const UNITS = [
  {
    size: "5×10",
    price: 65,
    fits: "Perfect for boxes, seasonal gear, or a small bedroom",
    popular: true,
  },
  {
    size: "10×10",
    price: 85,
    fits: "Fits furniture, boxes, and everything from a 1-bedroom apartment",
  },
  { size: "10×15", price: 105, fits: "Fits a 2-bedroom apartment" },
  { size: "10×20", price: 130, fits: "Fits a 3-bedroom home" },
];

const UNIT_DATA = [
  {
    size: "5×10",
    width: 5,
    depth: 10,
    sqft: 50,
    price: 65,
    label: "5 ft × 10 ft",
    fits: [
      "Boxes & seasonal gear (10–15 totes)",
      "Small bedroom furniture",
      "Sports equipment & bikes",
      "Holiday decorations & keepsakes",
    ],
  },
  {
    size: "10×10",
    width: 10,
    depth: 10,
    sqft: 100,
    price: 85,
    label: "10 ft × 10 ft",
    fits: [
      "Full 1-bedroom apartment contents",
      "Queen bed, dresser & couch",
      "Small kitchen appliances & table",
      "Boxes, bins & personal items",
    ],
  },
  {
    size: "10×15",
    width: 10,
    depth: 15,
    sqft: 150,
    price: 105,
    label: "10 ft × 15 ft",
    fits: [
      "Full 2-bedroom apartment contents",
      "Multiple beds, couch & dining set",
      "Washer, dryer & large appliances",
      "Many boxes, bins & extra furniture",
    ],
  },
  {
    size: "10×20",
    width: 10,
    depth: 20,
    sqft: 200,
    price: 130,
    label: "10 ft × 20 ft",
    fits: [
      "Full 3-bedroom home contents",
      "Multiple large furniture pieces",
      "Full appliance suite & garage items",
      "Vehicle, motorcycle or boat",
    ],
  },
];

type FurnitureItem = { x: number; y: number; w: number; h: number; label: string; color?: string };

const UNIT_FURNITURE: Record<string, FurnitureItem[]> = {
  "5×10": [
    { x: 0.3, y: 0.3, w: 4.4, h: 4.2, label: "Boxes", color: "rgba(199,138,59,0.18)" },
    { x: 0.3, y: 4.8, w: 2.2, h: 4.9, label: "Dresser", color: "rgba(199,138,59,0.28)" },
    { x: 2.8, y: 4.8, w: 1.9, h: 4.9, label: "Bike", color: "rgba(199,138,59,0.18)" },
  ],
  "10×10": [
    { x: 0.3, y: 0.3, w: 5.5, h: 2.5, label: "Couch", color: "rgba(199,138,59,0.28)" },
    { x: 6.2, y: 0.3, w: 3.5, h: 4.2, label: "Boxes", color: "rgba(199,138,59,0.18)" },
    { x: 0.3, y: 3.2, w: 5, h: 2.2, label: "Bed", color: "rgba(199,138,59,0.35)" },
    { x: 0.3, y: 5.8, w: 2.5, h: 1.8, label: "Dresser", color: "rgba(199,138,59,0.28)" },
    { x: 0.3, y: 7.9, w: 9.4, h: 1.8, label: "Boxes", color: "rgba(199,138,59,0.18)" },
  ],
  "10×15": [
    { x: 0.3, y: 0.3, w: 5.5, h: 2.5, label: "Couch", color: "rgba(199,138,59,0.28)" },
    { x: 6.2, y: 0.3, w: 3.5, h: 4, label: "Boxes", color: "rgba(199,138,59,0.18)" },
    { x: 0.3, y: 3.2, w: 5, h: 2.2, label: "Bed", color: "rgba(199,138,59,0.35)" },
    { x: 0.3, y: 5.7, w: 5, h: 2.2, label: "Bed", color: "rgba(199,138,59,0.35)" },
    { x: 0.3, y: 8.2, w: 2.5, h: 2, label: "Dresser", color: "rgba(199,138,59,0.28)" },
    { x: 3.1, y: 8.2, w: 2.5, h: 2, label: "W/D", color: "rgba(199,138,59,0.22)" },
    { x: 0.3, y: 10.5, w: 9.4, h: 4.2, label: "Boxes", color: "rgba(199,138,59,0.18)" },
  ],
  "10×20": [
    { x: 0.3, y: 0.3, w: 5.5, h: 2.5, label: "Couch", color: "rgba(199,138,59,0.28)" },
    { x: 6.2, y: 0.3, w: 3.5, h: 5, label: "Boxes", color: "rgba(199,138,59,0.18)" },
    { x: 0.3, y: 3.2, w: 5, h: 2.2, label: "Bed", color: "rgba(199,138,59,0.35)" },
    { x: 0.3, y: 5.7, w: 5, h: 2.2, label: "Bed", color: "rgba(199,138,59,0.35)" },
    { x: 0.3, y: 8.2, w: 2.5, h: 2, label: "Dresser", color: "rgba(199,138,59,0.28)" },
    { x: 3.1, y: 8.2, w: 2.5, h: 2, label: "W/D", color: "rgba(199,138,59,0.22)" },
    { x: 6.2, y: 5.8, w: 3.5, h: 4.5, label: "Appliances", color: "rgba(199,138,59,0.22)" },
    { x: 0.3, y: 10.5, w: 5, h: 3, label: "Dining Table", color: "rgba(199,138,59,0.28)" },
    { x: 0.3, y: 14, w: 9.4, h: 5.7, label: "Boxes", color: "rgba(199,138,59,0.18)" },
  ],
};

const REVIEWS = [
  {
    name: "Thomas Dyson",
    location: "Google Review",
    rating: 5,
    text: "Rented a unit to store a vehicle, Tim was great, all went according to plan. No issues.",
  },
  {
    name: "Mike T.",
    location: "Seneca Falls, NY",
    rating: 5,
    text: "Best storage facility in the area. Clean, secure, and the 24/7 access is a game changer. I've used other places and nothing compares — this one actually feels like they care about your stuff.",
  },
  {
    name: "Eileen Dyson",
    location: "Google Review",
    rating: 5,
    text: "Clean units. Very pleased with the service.",
  },
  {
    name: "Linda R.",
    location: "Waterloo, NY",
    rating: 5,
    text: "I was nervous about storing my mother's belongings after she passed, but the staff here were so kind and professional. The units are spotless and the 24/7 access made me feel at ease. Highly recommend.",
  },
];

const formSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  unitSize: z.string().min(1, "Select a unit size"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const EMAILJS_SERVICE_ID = "service_bs0jee3";
const EMAILJS_TEMPLATE_ID = "template_xucae0r";
const EMAILJS_PUBLIC_KEY = "__PjBvNitw59O6Kq6";

function UnitSvg({ width, depth, size }: { width: number; depth: number; size: string }) {
  const SCALE = 20;
  const PAD = 30;
  const unitW = width * SCALE;
  const unitH = depth * SCALE;
  const svgW = unitW + PAD * 2;
  const svgH = unitH + PAD * 2 + 12;

  const vLines: number[] = [];
  for (let x = 1; x < width; x++) vLines.push(x * SCALE);
  const hLines: number[] = [];
  for (let y = 1; y < depth; y++) hLines.push(y * SCALE);

  const items = UNIT_FURNITURE[size] || [];

  return (
    <svg
      role="img"
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
      aria-label={`Floor plan for ${size} storage unit`}
    >
      <rect
        x={PAD}
        y={PAD}
        width={unitW}
        height={unitH}
        fill="#F4E9D8"
        stroke="#2A1412"
        strokeWidth={2}
      />

      {vLines.map((x, i) => (
        <line
          key={`v${i}`}
          x1={PAD + x}
          y1={PAD}
          x2={PAD + x}
          y2={PAD + unitH}
          stroke="#C78A3B"
          strokeWidth={0.5}
          strokeDasharray="3,3"
          opacity={0.4}
        />
      ))}
      {hLines.map((y, i) => (
        <line
          key={`h${i}`}
          x1={PAD}
          y1={PAD + y}
          x2={PAD + unitW}
          y2={PAD + y}
          stroke="#C78A3B"
          strokeWidth={0.5}
          strokeDasharray="3,3"
          opacity={0.4}
        />
      ))}

      {items.map((item, i) => (
        <g key={i}>
          <rect
            x={PAD + item.x * SCALE}
            y={PAD + item.y * SCALE}
            width={item.w * SCALE}
            height={item.h * SCALE}
            fill={item.color || "rgba(199,138,59,0.18)"}
            stroke="#C78A3B"
            strokeWidth={0.75}
            rx={1}
          />
          {item.w * SCALE > 28 && item.h * SCALE > 12 && (
            <text
              x={PAD + (item.x + item.w / 2) * SCALE}
              y={PAD + (item.y + item.h / 2) * SCALE + 3.5}
              textAnchor="middle"
              fill="#5C3A28"
              fontSize={13}
              fontFamily="'DM Sans', sans-serif"
            >
              {item.label}
            </text>
          )}
        </g>
      ))}

      {/* Door gap at bottom */}
      <rect x={PAD + unitW / 2 - 22} y={PAD + unitH - 2} width={44} height={4} fill="#F4E9D8" />
      <line
        x1={PAD + unitW / 2 - 22}
        y1={PAD + unitH}
        x2={PAD + unitW / 2 + 22}
        y2={PAD + unitH}
        stroke="#C78A3B"
        strokeWidth={2}
      />
      <text
        x={PAD + unitW / 2}
        y={PAD + unitH + 13}
        textAnchor="middle"
        fill="#7A4A20"
        fontSize={11}
        fontFamily="'DM Sans', sans-serif"
        letterSpacing={1.5}
      >
        ▲ DOOR
      </text>

      {/* Width label */}
      <text
        x={PAD + unitW / 2}
        y={PAD - 10}
        textAnchor="middle"
        fill="#2A1412"
        fontSize={13}
        fontWeight={700}
        fontFamily="'DM Sans', sans-serif"
      >
        {width} ft
      </text>

      {/* Depth label (rotated) */}
      <text
        x={PAD - 12}
        y={PAD + unitH / 2}
        textAnchor="middle"
        fill="#2A1412"
        fontSize={13}
        fontWeight={700}
        fontFamily="'DM Sans', sans-serif"
        transform={`rotate(-90, ${PAD - 12}, ${PAD + unitH / 2})`}
      >
        {depth} ft
      </text>
    </svg>
  );
}

const NAV = [
  { label: "Unit sizes", href: "#unit-sizes" },
  { label: "Pricing", href: "#pricing" },
  { label: "Our facility", href: "#about" },
  { label: "Reviews", href: "#reviews" },
];

function Index() {
  const [unitSize, setUnitSize] = useState("");
  const [submitted, setSubmitted] = useState<{ name: string; unitSize: string } | null>(null);
  const requestUnit = (size: string) => {
    setUnitSize(size);
    setSubmitted(null);
    requestAnimationFrame(() => smoothScrollTo("#availability-form"));
  };
  return (
    <div id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <TopNav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Features />
        <UnitSizing onSelect={requestUnit} />
        <Pricing onSelect={requestUnit} />
        <About />
        <Reviews />
        <Contact
          unitSize={unitSize}
          setUnitSize={setUnitSize}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}

function smoothScrollTo(href: string) {
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
  const top =
    href === "#top" ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
  window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
  // Move keyboard focus along with the visual navigation, without a second scroll.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

function SectionLink({
  href,
  children,
  className = "",
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        smoothScrollTo(href);
      }}
    >
      {children}
    </a>
  );
}

function Wordmark() {
  return (
    <SectionLink href="#top" className="wordmark">
      <img src={logoImg} alt="Seneca Falls Self Storage — home" width="252" height="80" />
    </SectionLink>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="container nav-bar">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map((n) => (
            <SectionLink key={n.href} href={n.href}>
              {n.label}
            </SectionLink>
          ))}
        </nav>
        <div className="nav-actions">
          <a href={PHONE_HREF} className="nav-phone" aria-label={"Call " + PHONE_DISPLAY}>
            <Phone size={16} />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <SectionLink href="#availability-form" className="btn-gold nav-cta">
            Check Availability <ArrowUpRight size={16} />
          </SectionLink>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <a className="mobile-location" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
        <MapPin size={16} aria-hidden="true" />
        <span>189 Ovid St, Seneca Falls, NY</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </a>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {NAV.map((n) => (
          <SectionLink key={n.href} href={n.href} onNavigate={() => setOpen(false)}>
            {n.label}
            <ArrowUpRight size={16} />
          </SectionLink>
        ))}
        <SectionLink href="#availability-form" onNavigate={() => setOpen(false)}>
          Check availability
          <ArrowUpRight size={16} />
        </SectionLink>
        <a href={PHONE_HREF}>
          <Phone size={16} />
          {PHONE_DISPLAY}
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        src={heroImg}
        alt="Red-door storage buildings at Seneca Falls Self Storage on Route 414"
        width="1122"
        height="1402"
        fetchPriority="high"
        className="hero-img"
      />
      <div className="container hero-grid">
        <a className="hero-location" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
          <MapPin size={17} aria-hidden="true" />
          189 Ovid St, Seneca Falls, NY
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <div className="hero-copy">
          <h1 id="hero-title">
            Store It Here.
            <br />
            <em>Rest Easy.</em>
          </h1>
          <p className="hero-description">
            Locally owned self storage on Route 414 in Seneca Falls.
          </p>
          <div className="hero-actions">
            <SectionLink href="#availability-form" className="btn-gold">
              Check Availability <ArrowRight size={18} />
            </SectionLink>
            <SectionLink href="#pricing" className="hero-text-link">
              View Pricing <ArrowUpRight size={17} />
            </SectionLink>
          </div>
          <div className="hero-assurance">
            <ShieldCheck size={19} />
            <span>24/7 Access</span>
            <span className="dot" />
            <span>24/7 Security</span>
            <span className="dot" />
            <span>Locally Owned</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: KeyRound,
      title: "24/7 Access",
      text: "Get in whenever you need to — your schedule, your storage.",
    },
    {
      icon: ShieldCheck,
      title: "24-Hour Security",
      text: "Sleep easy. Cameras watch over your belongings around the clock.",
    },
    {
      icon: MoveVertical,
      title: "12-Foot Ceilings",
      text: "Store more without paying for a bigger footprint — stack smart and save.",
    },
    {
      icon: CalendarDays,
      title: "No Long-Term Contracts",
      text: "Rent month-to-month and move out when you’re ready — no pressure.",
    },
  ];
  return (
    <section className="features" aria-label="Storage benefits">
      <div className="container feature-grid">
        {features.map(({ icon: Icon, title, text }) => (
          <div className="feature" key={title}>
            <Icon size={24} strokeWidth={1.5} />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={"section-heading" + (centered ? " centered" : "")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p className="section-description">{children}</p>}
    </div>
  );
}

function UnitSizing({ onSelect }: { onSelect: (size: string) => void }) {
  const [active, setActive] = useState(0);
  const unit = UNIT_DATA[active];
  return (
    <section id="unit-sizes" className="section size-section">
      <div className="container">
        <SectionHeading eyebrow="Unit Sizes" title="Find Your Perfect Fit" centered>
          Select a size to see a floor plan and what fits inside.
        </SectionHeading>
        <div className="size-guide">
          <div className="size-options" role="group" aria-label="Choose a storage unit size">
            {UNIT_DATA.map((u, i) => (
              <button
                key={u.size}
                className={active === i ? "size-option active" : "size-option"}
                aria-pressed={active === i}
                aria-controls="unit-details"
                onClick={() => setActive(i)}
              >
                <span>
                  {u.size}
                  <small> ft</small>
                </span>
                <span>{u.sqft} sq ft</span>
              </button>
            ))}
          </div>
          <div className="size-detail" id="unit-details">
            <div className="floor-plan">
              <span className="plan-label">A look inside</span>
              <div className="plan-drawing">
                <UnitSvg width={unit.width} depth={unit.depth} size={unit.size} />
              </div>
              <p>
                Illustrative layout · Dimensions in feet
                <br />
                Actual fit depends on your items and how you pack.
              </p>
            </div>
            <div className="unit-info">
              <div aria-live="polite" aria-atomic="true">
                <p className="eyebrow">{unit.sqft} square feet · 12-foot ceilings</p>
                <h3>{unit.label}</h3>
                <p className="unit-dimensions">What fits inside:</p>
              </div>
              <ul className="check-list">
                {unit.fits.map((item) => (
                  <li key={item}>
                    <Check size={17} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="unit-bottom">
                <div className="unit-price">
                  <strong>${unit.price}</strong>
                  <span>/ month</span>
                </div>
                <button className="btn-primary" onClick={() => onSelect(unit.size)}>
                  Choose this unit
                  <ArrowRight size={17} />
                </button>
              </div>
              <p className="unit-help">
                Not sure? <a href={PHONE_HREF}>Give us a call.</a> We’re happy to help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ onSelect }: { onSelect: (size: string) => void }) {
  return (
    <section id="pricing" className="section pricing-section">
      <div className="container">
        <div className="section-heading-row">
          <SectionHeading eyebrow="Storage Units" title="Simple, Honest Pricing">
            Month-to-month rentals. No hidden fees. Pick the size that fits — upgrade or downsize
            anytime.
          </SectionHeading>
          <span className="section-note">
            <Check size={17} /> No long-term contracts
          </span>
        </div>
        <div className="pricing-grid">
          {UNITS.map((u, i) => (
            <article key={u.size} className={"pricing-card" + (u.popular ? " popular" : "")}>
              <div className="pricing-card-top">
                <Boxes size={25} strokeWidth={1.4} />
                {u.popular && <span className="popular-label">Most popular</span>}
              </div>
              <h3>
                {u.size}
                <span> ft</span>
              </h3>
              <p className="pricing-area">{UNIT_DATA[i].sqft} square feet</p>
              <div className="price">
                <strong>${u.price}</strong>
                <span>/ month</span>
              </div>
              <p className="pricing-fits">{u.fits}.</p>
              <div className="pricing-includes">
                <Check size={15} />
                24/7 access included
              </div>
              <button
                className={u.popular ? "btn-gold" : "btn-outline"}
                onClick={() => onSelect(u.size)}
              >
                Check availability
                <ArrowUpRight size={17} />
              </button>
            </article>
          ))}
        </div>
        <div className="annual-offer">
          <div className="offer-icon">
            <CalendarDays size={25} strokeWidth={1.5} />
          </div>
          <div>
            <strong>Pay Annually. Get One Month FREE.</strong>
            <p>Ask us about annual payment options.</p>
          </div>
          <SectionLink href="#availability-form">
            Ask about annual savings
            <ArrowUpRight size={17} />
          </SectionLink>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container about-grid">
        <div className="about-copy">
          <p className="eyebrow">Why Us</p>
          <h2>
            Locally Owned.
            <br />
            <em>Built for the Finger Lakes.</em>
          </h2>
          <p>
            Family-owned and right in your backyard. We built this place the way we'd want storage
            for our own family — clean, secure, and easy to use.
          </p>
          <p>No corporate runaround. When you call, you reach a real person.</p>
          <div className="about-signoff">
            <div className="about-mark">
              <KeyRound size={23} />
            </div>
            <div>
              <strong>Family-owned. Locally operated.</strong>
              <span>Find us on Route 414 in Seneca Falls.</span>
            </div>
          </div>
          <a className="text-link" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
            Get Directions
            <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="facility-gallery">
          {[
            { src: facilityImg1, alt: "Storage unit interior viewed from the entrance" },
            { src: facilityImg2, alt: "Tall walls inside a storage unit" },
            { src: facilityImg3, alt: "Storage interior with a red roll-up door" },
            { src: facilityImg4, alt: "Clean floor and walls inside a storage unit" },
          ].map(({ src, alt }) => (
            <img
              key={src}
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              width="560"
              height="560"
            />
          ))}
          <p>
            <MapPin size={14} /> A closer look at our facility
          </p>
        </div>
      </div>
    </section>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="stars" role="img" aria-label={count + " out of 5 stars"}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <SectionHeading
          eyebrow="What Our Customers Say"
          title="Trusted by Your Neighbors"
          centered
        />
        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <figure className="review" key={r.name}>
              <Stars count={r.rating} />
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <span className="review-avatar" aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.location}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquirySuccess({
  name,
  unitSize,
  onReset,
}: {
  name: string;
  unitSize: string;
  onReset: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="inquiry-success" role="status">
      <span className="success-icon">
        <Check size={30} />
      </span>
      <p className="eyebrow">Inquiry received</p>
      <h3 ref={heading} tabIndex={-1}>
        Thank you, {name}.
      </h3>
      <p>
        We've received your request for{" "}
        {unitSize === "not-sure" ? "a unit" : "a " + unitSize + " unit"} and will be in touch within
        one business day.
      </p>
      <a className="text-link" href={PHONE_HREF}>
        <Phone size={16} />
        {PHONE_DISPLAY}
      </a>
      <button className="btn-outline" onClick={onReset}>
        Send another inquiry
      </button>
    </div>
  );
}

function Contact({
  unitSize,
  setUnitSize,
  submitted,
  setSubmitted,
}: {
  unitSize: string;
  setUnitSize: (size: string) => void;
  submitted: { name: string; unitSize: string } | null;
  setSubmitted: (value: { name: string; unitSize: string } | null) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    const parsed = formSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      unitSize,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      const invalidField = parsed.error.issues[0]?.path[0];
      if (typeof invalidField === "string") document.getElementById(invalidField)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: parsed.data.name,
          reply_to: parsed.data.email,
          phone: parsed.data.phone,
          unit_size: parsed.data.unitSize === "not-sure" ? "Not sure yet" : parsed.data.unitSize,
          message: parsed.data.message || "No message provided",
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setSubmitted({ name: parsed.data.name, unitSize: parsed.data.unitSize });
    } catch {
      toast.error("Something went wrong. Please call us at " + PHONE_DISPLAY + ".");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid">
        <div className="contact-info">
          <SectionHeading eyebrow="Get In Touch" title="Ready to Reserve? Let's Get You Set Up.">
            Or just have a question — we respond fast.
          </SectionHeading>
          <div className="contact-methods">
            <a href={PHONE_HREF}>
              <Phone size={20} />
              <span>
                <small>Call Us</small>
                <strong>{PHONE_DISPLAY}</strong>
              </span>
              <ArrowUpRight size={18} />
            </a>
            <a href={"mailto:" + EMAIL}>
              <Mail size={20} />
              <span>
                <small>Email Us</small>
                <strong>{EMAIL}</strong>
              </span>
              <ArrowUpRight size={18} />
            </a>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">
              <MapPin size={20} />
              <span>
                <small>Visit us on Route 414</small>
                <strong>{ADDRESS}</strong>
              </span>
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="contact-map">
            <iframe
              title="Map to Seneca Falls Self Storage"
              src={MAP_EMBED}
              width="100%"
              height="210"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">
              Get directions
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div id="availability-form" className="inquiry-panel">
          {submitted ? (
            <InquirySuccess
              name={submitted.name}
              unitSize={submitted.unitSize}
              onReset={() => {
                setSubmitted(null);
                setUnitSize("");
              }}
            />
          ) : (
            <form onSubmit={onSubmit} aria-labelledby="inquiry-heading" aria-busy={submitting}>
              <p className="eyebrow">Get Started</p>
              <h3 id="inquiry-heading">Check availability</h3>
              <p className="form-intro">A quick hello. No commitment required.</p>
              <fieldset disabled={submitting} className="form-fields">
                <legend className="sr-only">Your contact information and storage needs</legend>
                <div className="form-row">
                  <div>
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      placeholder="Full name"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(315) 555-0123"
                      required
                      maxLength={30}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <Label htmlFor="unitSize">Unit size</Label>
                  <Select value={unitSize} onValueChange={setUnitSize} disabled={submitting}>
                    <SelectTrigger id="unitSize" aria-required="true">
                      <SelectValue placeholder="Choose a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u.size} value={u.size}>
                          {u.size} ft — ${u.price}/month
                        </SelectItem>
                      ))}
                      <SelectItem value="not-sure">Not sure — help me choose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">
                    Anything else? <span className="optional">(optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="What are you storing? When would you like to move in?"
                    rows={4}
                    maxLength={1000}
                  />
                </div>
                <button type="submit" className="btn-primary form-submit" disabled={submitting}>
                  {submitting ? "Sending your inquiry…" : "Send inquiry"}
                  <ArrowRight size={17} />
                </button>
              </fieldset>
              <p className="form-note">
                <ShieldCheck size={15} />
                We’ll be in touch within one business day.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Wordmark />
            <p>Locally owned self storage on Route 414.</p>
          </div>
          <div>
            <h2>Quick Links</h2>
            <SectionLink href="#unit-sizes">Unit size guide</SectionLink>
            <SectionLink href="#pricing">Pricing & savings</SectionLink>
            <SectionLink href="#availability-form">Check availability</SectionLink>
          </div>
          <div>
            <h2>Visit</h2>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">
              189 Ovid Street
              <br />
              Seneca Falls, NY 13148
            </a>
            <p>Unit access: 24 hours, every day</p>
          </div>
          <div>
            <h2>Contact</h2>
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <a href={"mailto:" + EMAIL}>{EMAIL}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Seneca Falls Self Storage. All rights reserved.</span>
          <SectionLink href="#top">Back to top ↑</SectionLink>
        </div>
      </div>
    </footer>
  );
}
