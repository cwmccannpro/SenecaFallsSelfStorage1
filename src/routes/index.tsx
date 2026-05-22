import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import heroImg from "@/assets/hero-storage.png";
import logoImg from "@/assets/logo4.png";

export const Route = createFileRoute("/")({
  component: Index,
});

const PAY_URL = "https://example.com/pay"; // TODO: replace with Square payment link
const ADDRESS = "189 Ovid St, Seneca Falls, NY 13148";
const PHONE_DISPLAY = "(315) 539-4692";
const PHONE_HREF = "tel:+13155394692";
const EMAIL = "tim@senecafallsselfstorage.com";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Unit Sizes", href: "#unit-sizes" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const UNITS = [
  { size: "5×10", price: 65, fits: "Perfect for boxes, seasonal gear, or a small bedroom", popular: true },
  { size: "10×10", price: 85, fits: "Fits furniture, boxes, and everything from a 1-bedroom apartment" },
  { size: "10×15", price: 95, fits: "Fits a 2-bedroom apartment" },
  { size: "10×20", price: 140, fits: "Fits a 3-bedroom home" },
];

const UNIT_DATA = [
  {
    size: "5×10", width: 5, depth: 10, sqft: 50, price: 65, label: "5 ft × 10 ft",
    fits: [
      "Boxes & seasonal gear (10–15 totes)",
      "Small bedroom furniture",
      "Sports equipment & bikes",
      "Holiday decorations & keepsakes",
    ],
  },
  {
    size: "10×10", width: 10, depth: 10, sqft: 100, price: 85, label: "10 ft × 10 ft",
    fits: [
      "Full 1-bedroom apartment contents",
      "Queen bed, dresser & couch",
      "Small kitchen appliances & table",
      "Boxes, bins & personal items",
    ],
  },
  {
    size: "10×15", width: 10, depth: 15, sqft: 150, price: 95, label: "10 ft × 15 ft",
    fits: [
      "Full 2-bedroom apartment contents",
      "Multiple beds, couch & dining set",
      "Washer, dryer & large appliances",
      "Many boxes, bins & extra furniture",
    ],
  },
  {
    size: "10×20", width: 10, depth: 20, sqft: 200, price: 140, label: "10 ft × 20 ft",
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

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <Hero />
      <Features />
      <UnitSizing />
      <Pricing />
      <About />
      <Reviews />
      <Contact />
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}

function smoothScrollTo(href: string) {
  const id = href.replace('#', '');
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const el = document.getElementById(id);
    if (el) {
      const navH = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
      let top = el.getBoundingClientRect().top + window.scrollY - navH;
      if (id === 'unit-sizes') {
        const label = document.getElementById('unit-sizes-label');
        if (label) {
          top = label.getBoundingClientRect().top + window.scrollY - navH;
        }
      }
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href="#top" onClick={e => { e.preventDefault(); smoothScrollTo('#top'); }} className={`flex items-center flex-none ${className}`} aria-label="Seneca Falls Self Storage">
      <img src={logoImg} alt="Seneca Falls Self Storage" className="h-10 sm:h-12 lg:h-14 w-auto" />
    </a>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={e => { e.preventDefault(); smoothScrollTo(href); onClick?.(); }}
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: '#D8C6AF',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.13em',
        textTransform: 'uppercase' as const,
        transition: 'color 0.2s ease, text-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#E0A34A';
        e.currentTarget.style.textShadow = '0 0 14px rgba(224, 163, 74, 0.45)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = '#D8C6AF';
        e.currentTarget.style.textShadow = 'none';
      }}
    >
      {children}
    </a>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      id="top"
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, #5C1219 0%, #4A0F14 45%, #3A0C11 100%)',
        borderTop: '2px solid #C78A3B',
        borderBottom: '2px solid #C78A3B',
        boxShadow: '0 4px 32px rgba(30, 4, 8, 0.7), inset 0 1px 0 rgba(224, 163, 74, 0.12)',
      }}
    >
      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Wordmark />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((n) => (
              <NavLink key={n.label} href={n.href}>{n.label}</NavLink>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-4 flex-none">
            {/* Reserve Unit — desktop only */}
            <a
              href="#availability-form"
              onClick={e => { e.preventDefault(); smoothScrollTo('#availability-form'); }}
              className="btn-nav-primary"
            >
              Check Availability
            </a>

            {/* Pay Online — always visible */}
            <a
              href="/login"
              className="btn-nav-gold"
            >
              Pay Online
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              className="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 p-1.5"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span style={{
                display: 'block', height: '1.5px', width: '100%', background: '#C78A3B',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display: 'block', height: '1.5px', width: '100%', background: '#C78A3B',
                transition: 'opacity 0.3s ease',
                opacity: open ? 0 : 1,
              }} />
              <span style={{
                display: 'block', height: '1.5px', width: '100%', background: '#C78A3B',
                transition: 'transform 0.3s ease',
                transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        style={{
          maxHeight: open ? '480px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderTop: open ? '1px solid rgba(199, 138, 59, 0.25)' : 'none',
          background: 'linear-gradient(180deg, #3A0C11 0%, #4A0F14 100%)',
        }}
      >
        <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col">
          {NAV.map((n) => (
            <NavLink key={n.label} href={n.href} onClick={() => setOpen(false)}>
              <span className="block py-3.5 border-b" style={{ borderColor: 'rgba(199, 138, 59, 0.2)' }}>
                {n.label}
              </span>
            </NavLink>
          ))}
          <div className="mt-5 flex flex-col gap-3 pb-2">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#D8C6AF', fontWeight: 600, fontSize: '1rem' }}
            >
              <Phone className="h-4 w-4" style={{ color: '#C78A3B' }} />
              {PHONE_DISPLAY}
            </a>
            <a
              href="#availability-form"
              onClick={e => { e.preventDefault(); smoothScrollTo('#availability-form'); setOpen(false); }}
              className="flex items-center justify-center py-3 text-xs uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#E0A34A',
                border: '1px solid #C78A3B',
                borderRadius: '2px',
                background: 'rgba(199, 138, 59, 0.09)',
              }}
            >
              Check Availability
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ background: 'linear-gradient(180deg, #F4E9D8 0%, #EDE0C8 100%)' }}>

      {/* ── Full-bleed image flush against navbar ── */}
      <div className="relative" style={{ borderBottom: '2px solid #C78A3B' }}>
        <img
          src={heroImg}
          alt="Seneca Falls Self Storage facility on Route 414 — three buildings of red-door units"
          className="hero-img"
        />
        {/* Badge overlaid centered near top of image */}
        <div className="absolute top-5 sm:top-8 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: '0.15em',
              color: '#F4E9D8',
              background: 'rgba(74, 15, 20, 0.72)',
              border: '1px solid #C78A3B',
              backdropFilter: 'blur(4px)',
            }}
          >
            <MapPin className="h-3.5 w-3.5 flex-none" style={{ color: '#C78A3B' }} />
            189 Ovid St, Seneca Falls, NY
          </span>
        </div>

        {/* Phone badge centered at bottom of image */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: '0.15em',
              color: '#F4E9D8',
              background: 'rgba(74, 15, 20, 0.72)',
              border: '1px solid #C78A3B',
              backdropFilter: 'blur(4px)',
              textDecoration: 'none',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,15,20,0.9)'; e.currentTarget.style.color = '#E0A34A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,15,20,0.72)'; e.currentTarget.style.color = '#F4E9D8'; }}
          >
            <Phone className="h-3.5 w-3.5 flex-none" style={{ color: '#C78A3B' }} />
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      {/* ── Below-image content ── */}
      <div className="text-center px-4 sm:px-6 pt-6 sm:pt-10 pb-10 sm:pb-16">
        <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, #C78A3B)' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#7A4A20', fontSize: '1.2rem', fontWeight: 600, fontStyle: 'italic' }}>
            Your Stuff. Safe. Yours to Access Anytime.
          </p>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, #C78A3B)' }} />
        </div>

        <p className="mt-4 mx-auto max-w-xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#5C3A28', fontSize: '1.1rem', lineHeight: '1.75' }}>
          Clean units, 24/7 access, and monitored security — no corporate hassle, just straightforward storage from a neighbor you can call.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contact" onClick={e => { e.preventDefault(); smoothScrollTo('#contact'); }} className="btn-primary w-full sm:w-auto justify-center">
            Check Availability <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#pricing" onClick={e => { e.preventDefault(); smoothScrollTo('#pricing'); }} className="btn-outline-gold w-full sm:w-auto justify-center">
            View Pricing
          </a>
        </div>
      </div>

    </section>
  );
}

function Features() {
  const items = [
    { icon: KeyRound, title: "24/7 Gate Access", desc: "Get in whenever you need to — your schedule, your storage." },
    { icon: ShieldCheck, title: "24-Hour Security", desc: "Sleep easy. Cameras and a secure perimeter gate watch over your belongings around the clock." },
    { icon: MoveVertical, title: "High Ceilings & Tall Units", desc: "Taller units mean you store more without paying for a bigger footprint — stack smart and save." },
    { icon: Boxes, title: "Pay Online, Anytime", desc: "Manage your account and pay your bill from your phone — no checks, no phone calls required." },
  ];
  return (
    <section
      id="features"
      className="py-10 sm:py-16 lg:py-24"
      style={{ background: 'linear-gradient(180deg, #4A0F14 0%, #3A0C11 100%)', borderTop: '2px solid #C78A3B', borderBottom: '2px solid #C78A3B' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 text-center">
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #C78A3B, transparent)', marginBottom: '1.5rem' }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Our Facility
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: '0.5rem' }}>
            The Way Storage Should Be
          </h2>
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #C78A3B, transparent)', marginTop: '1.5rem' }} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 transition-all duration-300 cursor-default"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(199,138,59,0.28)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(199,138,59,0.09)'; (e.currentTarget as HTMLElement).style.borderColor = '#C78A3B'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(199,138,59,0.28)'; }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center"
                style={{ background: 'rgba(199,138,59,0.14)', border: '1px solid rgba(199,138,59,0.4)' }}
              >
                <Icon className="h-5 w-5" style={{ color: '#E0A34A' }} />
              </div>
              <h3 className="mt-4 text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8' }}>
                {title}
              </h3>
              <p className="mt-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '1.05rem', lineHeight: '1.65' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      aria-label={`Floor plan for ${size} storage unit`}
    >
      <rect x={PAD} y={PAD} width={unitW} height={unitH} fill="#F4E9D8" stroke="#2A1412" strokeWidth={2} />

      {vLines.map((x, i) => (
        <line key={`v${i}`} x1={PAD + x} y1={PAD} x2={PAD + x} y2={PAD + unitH}
          stroke="#C78A3B" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.4} />
      ))}
      {hLines.map((y, i) => (
        <line key={`h${i}`} x1={PAD} y1={PAD + y} x2={PAD + unitW} y2={PAD + y}
          stroke="#C78A3B" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.4} />
      ))}

      {items.map((item, i) => (
        <g key={i}>
          <rect
            x={PAD + item.x * SCALE} y={PAD + item.y * SCALE}
            width={item.w * SCALE} height={item.h * SCALE}
            fill={item.color || "rgba(199,138,59,0.18)"}
            stroke="#C78A3B" strokeWidth={0.75} rx={1}
          />
          {item.w * SCALE > 28 && item.h * SCALE > 12 && (
            <text
              x={PAD + (item.x + item.w / 2) * SCALE}
              y={PAD + (item.y + item.h / 2) * SCALE + 3.5}
              textAnchor="middle" fill="#5C3A28" fontSize={8.5}
              fontFamily="'Cormorant Garamond', Georgia, serif"
            >
              {item.label}
            </text>
          )}
        </g>
      ))}

      {/* Door gap at bottom */}
      <rect x={PAD + unitW / 2 - 22} y={PAD + unitH - 2} width={44} height={4} fill="#F4E9D8" />
      <line x1={PAD + unitW / 2 - 22} y1={PAD + unitH} x2={PAD + unitW / 2 + 22} y2={PAD + unitH}
        stroke="#C78A3B" strokeWidth={2} />
      <text x={PAD + unitW / 2} y={PAD + unitH + 13}
        textAnchor="middle" fill="#7A4A20" fontSize={8}
        fontFamily="'Cormorant Garamond', Georgia, serif" letterSpacing={1.5}>
        ▲ DOOR
      </text>

      {/* Width label */}
      <text x={PAD + unitW / 2} y={PAD - 10} textAnchor="middle"
        fill="#2A1412" fontSize={10} fontWeight={700}
        fontFamily="'Cormorant Garamond', Georgia, serif">
        {width} ft
      </text>

      {/* Depth label (rotated) */}
      <text
        x={PAD - 12} y={PAD + unitH / 2}
        textAnchor="middle" fill="#2A1412" fontSize={10} fontWeight={700}
        fontFamily="'Cormorant Garamond', Georgia, serif"
        transform={`rotate(-90, ${PAD - 12}, ${PAD + unitH / 2})`}
      >
        {depth} ft
      </text>
    </svg>
  );
}

function UnitSizing() {
  const [active, setActive] = useState(0);
  const BAR_SCALE = 8;
  const unit = UNIT_DATA[active];

  return (
    <section
      id="unit-sizes"
      className="py-12 sm:py-20 lg:py-28"
      style={{ background: 'linear-gradient(160deg, #FDF8F0 0%, #F4E9D8 100%)', borderTop: '2px solid #C78A3B', borderBottom: '2px solid #C78A3B' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center">
          <span id="unit-sizes-label" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Unit Sizes
          </span>
          <h2 id="unit-sizes-heading" style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: '0.4rem' }}>
            Find Your Perfect Fit
          </h2>
          <div style={{ height: '1px', width: '72px', background: '#C78A3B', marginTop: '1rem', marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#5C3A28', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Select a size to see a floor plan and what fits inside. All dimensions shown to scale.
          </p>
        </div>

        {/* Comparison bar */}
        <div className="mt-8 sm:mt-10 overflow-x-auto">
          <div className="flex items-end justify-center gap-6 pb-2 min-w-max mx-auto">
            {UNIT_DATA.map((u, i) => (
              <button
                key={u.size}
                onClick={() => setActive(i)}
                title={`${u.size} — ${u.sqft} sq ft`}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                className="flex flex-col items-center gap-2"
              >
                <div style={{
                  width: u.width * BAR_SCALE,
                  height: u.depth * BAR_SCALE,
                  background: active === i ? 'rgba(74,15,20,0.82)' : 'rgba(199,138,59,0.12)',
                  border: active === i ? '2px solid #C78A3B' : '1.5px solid rgba(199,138,59,0.45)',
                  transition: 'all 0.2s ease',
                }} />
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.78rem', fontWeight: 700,
                  color: active === i ? '#2A1412' : '#7A4A20',
                  letterSpacing: '0.06em',
                }}>
                  {u.size}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Floor plan + info panel */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">

          {/* SVG */}
          <div
            className="flex justify-center items-start overflow-auto"
            style={{ maxHeight: 520 }}
          >
            <UnitSvg width={unit.width} depth={unit.depth} size={unit.size} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                Unit Size
              </span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: '2rem', fontWeight: 700, marginTop: '0.2rem' }}>
                {unit.label}
              </h3>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A4A20', fontSize: '1.1rem', marginTop: '0.15rem' }}>
                {unit.sqft} sq ft
              </div>
            </div>

            <div style={{ height: '1px', width: '60px', background: '#C78A3B', marginLeft: 'auto', marginRight: 'auto' }} className="lg:mx-0" />

            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                What fits inside:
              </div>
              <ul className="space-y-2.5 inline-block text-left">
                {unit.fits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center"
                      style={{ background: 'rgba(199,138,59,0.18)', border: '1px solid rgba(199,138,59,0.45)' }}>
                      <Check className="h-3.5 w-3.5" style={{ color: '#E0A34A' }} />
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3A1A12', fontSize: '1.05rem' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A4A20', fontSize: '0.78rem', textTransform: 'uppercase' as const, letterSpacing: '0.15em' }}>
                Starting at
              </div>
              <div className="flex items-baseline justify-center lg:justify-start gap-1 mt-1 mb-4">
                <span style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: '2.5rem', fontWeight: 800 }}>
                  ${unit.price}
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A4A20', fontSize: '1rem' }}>/mo</span>
              </div>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); smoothScrollTo('#contact'); }}
                className="btn-gold w-full justify-center"
              >
                Check Availability
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-12 sm:py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #FDF8F0 0%, #F4E9D8 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Storage Units
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: '0.4rem' }}>
            Simple, Honest Pricing
          </h2>
          <div style={{ height: '1px', width: '72px', background: '#C78A3B', marginTop: '1rem', marginBottom: '0.75rem' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#5C3A28', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Month-to-month rentals. No hidden fees. Pick the size that fits — upgrade or downsize anytime.
          </p>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {UNITS.map((u) => (
            <div
              key={u.size}
              className="relative flex flex-col p-6"
              style={{
                background: u.popular ? '#4A0F14' : '#FDF8F0',
                border: u.popular ? '2px solid #C78A3B' : '1px solid #D8C6AF',
                boxShadow: u.popular ? '0 8px 32px rgba(74,15,20,0.22)' : '0 2px 8px rgba(42,20,18,0.06)',
              }}
            >
              {u.popular && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase whitespace-nowrap"
                  style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.15em', background: '#C78A3B', color: '#2A1412' }}
                >
                  Most Popular
                </span>
              )}
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: u.popular ? '#D8C6AF' : '#7A4A20' }}>
                {u.size}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800, color: u.popular ? '#F4E9D8' : '#2A1412' }}>${u.price}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", color: u.popular ? '#D8C6AF' : '#7A4A20', fontSize: '1rem' }}>/mo</span>
              </div>
              <p className="mt-3 flex-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: u.popular ? '#D8C6AF' : '#5C3A28' }}>
                {u.fits}
              </p>
              <a href="#contact" onClick={e => { e.preventDefault(); smoothScrollTo('#contact'); }} className={`mt-6 justify-center ${u.popular ? 'btn-gold' : 'btn-primary'}`}>
                Check Availability
              </a>
            </div>
          ))}
        </div>
        <div
          className="mt-10 px-6 py-5 text-center"
          style={{ background: '#4A0F14', border: '1px solid #C78A3B' }}
        >
          <p style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontSize: '1.1rem', fontWeight: 700 }}>
            ✦ Pay Annually. Get One Month FREE. ✦
          </p>
        </div>
      </div>
    </section>
  );
}

function About() {
  const points = [
    "Tall units for extra vertical storage",
    "Easy 24/7 gate access",
    "Monitored security",
    "Flexible month-to-month rentals",
  ];
  return (
    <section
      id="about"
      className="py-12 sm:py-20 lg:py-28"
      style={{ background: 'linear-gradient(180deg, #4A0F14 0%, #3A0C11 100%)', borderTop: '2px solid #C78A3B', borderBottom: '2px solid #C78A3B' }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Why Us
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: '0.4rem', lineHeight: 1.2 }}>
            Locally Owned.<br />Built for the Finger Lakes.
          </h2>
          <div style={{ height: '1px', width: '60px', background: '#C78A3B', margin: '1.1rem 0' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '1.1rem', lineHeight: '1.8' }}>
            Family-owned and right in your backyard. We built this place the way we'd want storage for our own family — clean, secure, and easy to use. No corporate runaround. When you call, you reach a real person.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center"
                  style={{ background: 'rgba(199,138,59,0.18)', border: '1px solid rgba(199,138,59,0.45)' }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: '#E0A34A' }} />
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '1.05rem' }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="overflow-hidden shadow-xl" style={{ border: '2px solid #C78A3B' }}>
            <img src={heroImg} alt="Seneca Falls Self Storage facility on Route 414" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute -bottom-6 -left-6 hidden sm:block px-6 py-4 shadow-xl"
            style={{ background: '#4A0F14', border: '1px solid #C78A3B' }}
          >
            <div style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontSize: '2rem', fontWeight: 800 }}>84</div>
            <div style={{ color: '#D8C6AF', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Units on site</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    name: "Thomas Dyson",
    location: "Google Review",
    rating: 5,
    text: "Rented a unit to store a vehicle, Tim was great, all went according to plan. No issues.",
  },
  {
    name: "Eileen Dyson",
    location: "Google Review",
    rating: 5,
    text: "Clean units. Very pleased with the service.",
  },
  {
    name: "Mike T.",
    location: "Seneca Falls, NY",
    rating: 5,
    text: "Best storage facility in the area. Clean, secure, and the 24/7 access is a game changer. I've used other places and nothing compares — this one actually feels like they care about your stuff.",
  },
  {
    name: "Linda R.",
    location: "Waterloo, NY",
    rating: 5,
    text: "I was nervous about storing my mother's belongings after she passed, but the staff here were so kind and professional. The units are spotless and the gate system made me feel at ease. Highly recommend.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C78A3B" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section
      id="reviews"
      className="py-12 sm:py-20 lg:py-28"
      style={{ background: 'linear-gradient(160deg, #FDF8F0 0%, #F4E9D8 100%)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            What Our Customers Say
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: '0.4rem' }}>
            Trusted by Your Neighbors
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4 max-w-sm mx-auto">
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, #C78A3B)' }} />
            <Stars count={5} />
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, #C78A3B)' }} />
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="flex flex-col p-6"
              style={{ background: '#FDF8F0', border: '1px solid #D8C6AF' }}
            >
              {/* Opening quote mark */}
              <div style={{ fontFamily: "'Playfair Display', serif", color: '#C78A3B', fontSize: '2.5rem', lineHeight: 1, marginBottom: '-0.5rem', opacity: 0.6 }}>"</div>

              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3A1A12', fontSize: '1.05rem', lineHeight: '1.7', flex: 1 }}>
                {r.text}
              </p>

              <div className="mt-5 pt-4" style={{ borderTop: '1px solid #D8C6AF' }}>
                <Stars count={r.rating} />
                <div className="mt-2">
                  <div style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A5C4A', fontSize: '0.85rem' }}>{r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA nudge */}
        <div className="mt-8 sm:mt-12 text-center">
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); smoothScrollTo('#contact'); }}
            className="btn-primary"
          >
            Check Availability
          </a>
        </div>
      </div>
    </section>
  );
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  unitSize: z.string().min(1, "Select a unit size"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function InquirySuccess({
  name,
  unitSize,
  onReset,
}: {
  name: string;
  unitSize: string;
  onReset: () => void;
}) {
  const displaySize = unitSize === "not-sure" ? "a unit" : `a ${unitSize} unit`;
  return (
    <div
      style={{
        background: "#FDF8F0",
        border: "1px solid #D8C6AF",
        borderTop: "3px solid #C78A3B",
        padding: "2.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      {/* Gold circle check */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(199,138,59,0.12)",
          border: "2px solid #C78A3B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          color: "#C78A3B",
        }}
      >
        ✦
      </div>

      {/* Eyebrow */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#C78A3B",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Inquiry Received
      </p>

      {/* Heading */}
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#2A1412",
          fontSize: "1.5rem",
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.25,
        }}
      >
        Thank you, {name}.
      </h3>

      {/* Gold rule */}
      <div style={{ width: "60px", height: "1px", background: "#C78A3B" }} />

      {/* Body */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#5C3A28",
          fontSize: "1.05rem",
          lineHeight: "1.75",
          margin: 0,
          maxWidth: "360px",
        }}
      >
        We've received your request for <strong>{displaySize}</strong> and will
        be in touch within one business day.
      </p>

      {/* Direct contact nudge */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#7A5C4A",
          fontSize: "0.95rem",
          margin: 0,
        }}
      >
        Need a faster answer?
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        <a
          href={PHONE_HREF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "'Cormorant Garamond', serif",
            color: "#4A0F14",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <Phone className="h-4 w-4" style={{ color: "#C78A3B" }} />
          {PHONE_DISPLAY}
        </a>
        <a
          href={`mailto:${EMAIL}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "'Cormorant Garamond', serif",
            color: "#4A0F14",
            fontSize: "1rem",
            textDecoration: "none",
          }}
        >
          <Mail className="h-4 w-4" style={{ color: "#C78A3B" }} />
          {EMAIL}
        </a>
      </div>

      {/* Reset link */}
      <button
        onClick={onReset}
        style={{
          marginTop: "0.5rem",
          background: "none",
          border: "none",
          fontFamily: "'Cormorant Garamond', serif",
          color: "#7A5C4A",
          fontSize: "0.9rem",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Submit another inquiry
      </button>
    </div>
  );
}

// Set this to your Formspree endpoint once you sign up at formspree.io
// e.g. "https://formspree.io/f/xabc1234"
const FORMSPREE_ENDPOINT = "";

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [unitSize, setUnitSize] = useState("");
  const [submitted, setSubmitted] = useState<{ name: string; unitSize: string } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      return;
    }
    setSubmitting(true);

    if (FORMSPREE_ENDPOINT) {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          unit_size: parsed.data.unitSize,
          message: parsed.data.message ?? "",
        }),
      });
      setSubmitting(false);
      if (!res.ok) {
        toast.error(`Something went wrong. Please call us at ${PHONE_DISPLAY}.`);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 500));
      setSubmitting(false);
    }

    setSubmitted({ name: parsed.data.name, unitSize: parsed.data.unitSize });
  };

  return (
    <section id="contact" className="py-12 sm:py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #FDF8F0 0%, #F4E9D8 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C78A3B', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Get In Touch
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: '0.4rem', textWrap: 'balance' } as React.CSSProperties}>
            Ready to Reserve? Let's Get You Set Up.
          </h2>
          <div style={{ height: '1px', width: '72px', background: '#C78A3B', marginTop: '1rem', marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#5C3A28', fontSize: '1.05rem' }}>
            Or just have a question — we respond fast.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col gap-8">
          {/* Top row: info box + form/success side by side */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <div className="p-6" style={{ background: '#FDF8F0', border: '1px solid #D8C6AF' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2A1412', fontSize: '1.2rem', fontWeight: 700 }}>Email or Call</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 flex-none" style={{ color: '#C78A3B' }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3A1A12', fontSize: '1rem' }}>{ADDRESS}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 flex-none" style={{ color: '#C78A3B' }} />
                  <a href={PHONE_HREF}
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3A1A12', fontSize: '1rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C78A3B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3A1A12')}
                  >{PHONE_DISPLAY}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 flex-none" style={{ color: '#C78A3B' }} />
                  <a href={`mailto:${EMAIL}`}
                    className="break-all"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3A1A12', fontSize: '1rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C78A3B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3A1A12')}
                  >{EMAIL}</a>
                </li>
              </ul>
            </div>

            {submitted ? (
              <InquirySuccess
                name={submitted.name}
                unitSize={submitted.unitSize}
                onReset={() => { setSubmitted(null); setUnitSize(""); }}
              />
            ) : (
            <form id="availability-form" onSubmit={onSubmit} className="p-6 sm:p-8 space-y-4" style={{ background: '#FDF8F0', border: '1px solid #D8C6AF' }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required maxLength={100} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" required maxLength={30} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required maxLength={255} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="unitSize">Unit Size</Label>
                <Select value={unitSize} onValueChange={setUnitSize}>
                  <SelectTrigger id="unitSize" className="mt-1.5">
                    <SelectValue placeholder="Select a unit size" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u.size} value={u.size}>{u.size} — ${u.price}/mo</SelectItem>
                    ))}
                    <SelectItem value="not-sure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={4} maxLength={1000} className="mt-1.5" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
            )}
          </div>

          {/* Map full width below both boxes */}
          <div className="overflow-hidden" style={{ border: '1px solid #D8C6AF' }}>
            <iframe
              title="Map to Seneca Falls Self Storage"
              src={MAP_EMBED}
              width="100%"
              height="320"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerLink = { fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#D8C6AF', fontSize: '0.95rem', transition: 'color 0.2s' };
  return (
    <footer style={{ background: 'linear-gradient(180deg, #4A0F14 0%, #3A0C11 100%)', borderTop: '2px solid #C78A3B' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '0.95rem', marginTop: '0.75rem' }}>
              Locally owned self storage on Route 414.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Visit</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '0.95rem', lineHeight: '1.6' }}>{ADDRESS}</p>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Contact</div>
            <div className="flex flex-col gap-1">
              <a href={PHONE_HREF} style={footerLink} onMouseEnter={e => (e.currentTarget.style.color = '#E0A34A')} onMouseLeave={e => (e.currentTarget.style.color = '#D8C6AF')}>{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`} className="break-all" style={footerLink} onMouseEnter={e => (e.currentTarget.style.color = '#E0A34A')} onMouseLeave={e => (e.currentTarget.style.color = '#D8C6AF')}>{EMAIL}</a>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: '#F4E9D8', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Quick Links</div>
            <div className="flex flex-col gap-1">
              {[['Pricing', '#pricing', false], ['Check Availability', '#contact', false], ['Pay Online', '/login', false]].map(([label, href, external]) => (
                <a
                  key={label as string}
                  href={href as string}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onClick={!external ? (e => { e.preventDefault(); smoothScrollTo(href as string); }) : undefined}
                  style={footerLink}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E0A34A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#D8C6AF')}
                >{label}</a>
              ))}
            </div>
          </div>
        </div>
        <div
          className="mt-10 pt-6 flex flex-wrap items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(199,138,59,0.3)' }}
        >
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} Seneca Falls Self Storage. All rights reserved.
          </span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D8C6AF', fontSize: '0.82rem' }}>
            senecafallsselfstorage.com
          </span>
        </div>
      </div>
    </footer>
  );
}
