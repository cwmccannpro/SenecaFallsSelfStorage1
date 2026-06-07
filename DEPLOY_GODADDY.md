# GoDaddy Deployment Guide — Seneca Falls Self Storage

## Hosting Type: Static Site (GoDaddy Shared / cPanel)

This is a fully static single-page app. No server or Node.js is required.
Upload the contents of `dist/` to GoDaddy and you're done.

---

## Build

```bash
npm install
npm run build
```

Output goes to `dist/`. That folder is everything GoDaddy needs.

---

## GoDaddy cPanel Upload Steps

1. Log in to GoDaddy → **My Products** → **Web Hosting** → **Manage**
2. Open **cPanel** → **File Manager**
3. Navigate to `public_html/` (this is your web root)
4. Delete any existing placeholder files (e.g. `index.html` from GoDaddy)
5. Upload **the contents of `dist/`** — not the folder itself, everything inside it:
   - `index.html`
   - `favicon.png`
   - `.htaccess`
   - `assets/` folder (with all JS, CSS, images)
6. Make sure `.htaccess` uploaded correctly — it's a hidden file. In File Manager, enable **"Show Hidden Files"** to confirm it's there.

---

## Environment Variables

The EmailJS credentials are currently hardcoded in `src/routes/index.tsx`.
No environment variables need to be set on GoDaddy.

If you ever move them to `.env` variables, they must be set **before building**
(they're baked in at build time, not at runtime, since this is a static site).

---

## Domain / DNS

If your domain is registered with GoDaddy and pointing to this hosting account,
no DNS changes are needed — just uploading the files is enough.

If you have a custom domain elsewhere, point its A record or CNAME to GoDaddy's
IP / hostname shown in your hosting dashboard.

---

## `.htaccess` — Why It's There

The site uses client-side routing (TanStack Router). Without `.htaccess`, refreshing
any page other than `/` would return a 404 from Apache. The included `.htaccess`
tells Apache to serve `index.html` for any path that isn't a real file, letting
the JavaScript router take over.

GoDaddy shared hosting runs Apache, so this works out of the box.

---

## No Node.js, No Server Required

- No `npm start` on the server
- No Node version to set
- No environment variables on GoDaddy
- No database (Supabase has been removed)
- Contact form uses EmailJS (runs entirely in the browser)

---

## Re-deploying After Changes

```bash
npm run build
```

Then re-upload the contents of `dist/` to `public_html/`, overwriting existing files.
