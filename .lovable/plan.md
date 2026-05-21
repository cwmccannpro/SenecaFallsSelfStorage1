# Seneca Falls Self Storage — Build Plan

A clean, light-themed single-page marketing site with a sticky top nav, smooth-scroll anchor sections, and one Google Map embed.

## Design system (src/styles.css)

- Background: white `#FFFFFF`
- Section alt bg (warm gray): `#F5F2EE`
- Primary (deep red): `#8B1A1A`
- Foreground: near-black for body, bold sans-serif for headings
- Tokens defined in `oklch` and mapped via `@theme inline` (primary, secondary/muted = warm gray, etc.)
- Headings: bold sans (e.g. Plus Jakarta Sans / Inter via Google Fonts), generous whitespace, white cards with subtle shadow + 0.75rem radius

## Routing

Single-page site — keep it on `src/routes/index.tsx` with hash-anchor smooth scrolling between sections (matches the user's "single-page scroll" request). Update `__root.tsx` `head()` with proper title + description + og tags.

## Assets

- Copy `user-uploads://2249943a-...png` to `src/assets/hero-storage.png` and use as the hero background image with a soft white-to-transparent gradient overlay so headline text stays legible.

## Sections (all in `src/routes/index.tsx`, broken into local components)

1. **TopNav** (sticky, white, subtle border)
   - Left: "Seneca Falls Self Storage" wordmark
   - Center links: Features, Pricing, About, Contact
   - Right: red "Pay Online" button → `https://example.com/pay` (placeholder)

2. **Hero**
   - Full-width, hero photo as background with light gradient overlay
   - H1: "Seneca Falls Self Storage"
   - Tagline: "Secure. Accessible. Affordable."
   - Primary red CTA "Reserve Your Unit" (scrolls to #contact)
   - Secondary link "View Pricing" (scrolls to #pricing)
   - Small "Pay Online" link visible too

3. **Features Bar** — 4 white icon cards (Lucide icons): KeyRound (24/7 Gate Access), ShieldCheck (24-Hour Security), MoveVertical (High Ceilings & Tall Units), Boxes (84 Units Available)

4. **Pricing** (warm gray bg)
   - 4 white cards: 5×10 $65, 10×10 $85 (highlighted "Most Popular" with red ring/badge), 10×15 $95, 10×20 $140
   - Each card: size, price, fit description, "Reserve" button
   - Red banner below: "🎉 First Month FREE — One-time offer for new rentals."

5. **About / Why Us**
   - Short paragraph about locally owned in Seneca Falls, NY
   - Bullet list: tall units, 24/7 access, monitored security, flexible month-to-month

6. **Contact** (warm gray bg)
   - Two-column: left = info (address, phone, email as clickable `tel:` / `mailto:` links) + Google Map iframe embed of 189 Ovid St, Seneca Falls, NY 13148
   - Right = form (Name, Email, Phone, Unit Size select, Message) using shadcn `input`, `textarea`, `select`, `button`
   - Validation with `zod` + `react-hook-form` (already in shadcn `form.tsx`); on submit show a `sonner` toast "Thanks — we'll be in touch." (no backend wired yet — placeholder handler)

7. **Footer** — wordmark, address, phone, email, © 2026

## Technical details

- Pure frontend; no Cloud / DB needed for this build.
- Google Map: standard `<iframe>` embed with `https://www.google.com/maps?q=...&output=embed` (no API key required).
- `Pay Online` URL kept as a single constant `PAY_URL` at top of file so it's easy to swap for the Square link later.
- Smooth scroll via CSS `html { scroll-behavior: smooth }` and `<a href="#pricing">` style nav.
- Mobile: nav collapses to a simple hamburger (shadcn `sheet`); pricing grid stacks; hero text scales down.
- Update `__root.tsx` `head()` meta: title "Seneca Falls Self Storage — Secure, Accessible, Affordable", description, og tags.

## Files touched

- `src/styles.css` — replace token values with the brand palette, add font import
- `src/routes/__root.tsx` — meta tags
- `src/routes/index.tsx` — full page implementation
- `src/assets/hero-storage.png` — copied from upload

No new packages required (shadcn, lucide, react-hook-form, zod, sonner already present).
