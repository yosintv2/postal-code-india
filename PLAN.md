# PinCodeFinder — India PIN Code Directory

## Project Overview

A fully SEO-optimized Next.js 15 static site for finding India Post PIN (Postal Index Number) codes. Covers all 35 states and union territories, organized as State → District → PIN Code. Deployed on GitHub Pages at **www.pincodefinder.net**.

---

## Data Source

**API:** `https://api.singhyogendra.com.np/india-pincode/{state}.json`

Data is pre-downloaded before every build via `scripts/fetch-data.mjs` into a local `data/` directory (git-ignored). During static generation, `lib/pincode.ts` reads from disk — zero network calls at build time.

### API File Names (35 states/UTs)

| State / UT | API File |
|---|---|
| Andhra Pradesh | `andhra_pradesh` |
| Arunachal Pradesh | `arunachal_pradesh` |
| Assam | `assam` |
| Bihar | `bihar` |
| Chhattisgarh | `chattisgarh` |
| Goa | `goa` |
| Gujarat | `gujarat` |
| Haryana | `haryana` |
| Himachal Pradesh | `himachal_pradesh` |
| Jharkhand | `jharkhand` |
| Karnataka | `karnataka` |
| Kerala | `kerala` |
| Madhya Pradesh | `madhya_pradesh` |
| Maharashtra | `maharashtra` |
| Manipur | `manipur` |
| Meghalaya | `meghalaya` |
| Mizoram | `mizoram` |
| Nagaland | `nagaland` |
| Odisha | `odisha` |
| Punjab | `punjab` |
| Rajasthan | `rajasthan` |
| Sikkim | `sikkim` |
| Tamil Nadu | `tamil_nadu` |
| Tripura | `tripura` |
| Uttar Pradesh | `uttar_pradesh` |
| Uttarakhand | `uttarakhand` |
| West Bengal | `west_bengal` |
| Andaman & Nicobar | `andaman_and_nicobar_islands` |
| Chandigarh | `chandigarh` |
| Dadra & Nagar Haveli | `dadra_and_nagar_haveli` |
| Daman & Diu | `daman_and_diu` |
| Delhi | `delhi` |
| Jammu & Kashmir | `jammu_and_kashmir` |
| Lakshadweep | `lakshadweep` |
| Puducherry | `pondicherry` |

> **Note:** Telangana is excluded — the API has no `telangana.json`.

### TypeScript Interfaces (`types/pincode.ts`)

```ts
PostOffice      { officeName, pincode, officeType, deliveryStatus, divisionName, regionName, circleName, taluk, districtName, stateName }
PincodeGroup    { pincode, offices: PostOffice[], hasHeadOffice }
DistrictData    { districtName, districtSlug, pincodes, totalOffices, pincodeRange }
StateData       { stateName, stateSlug, apiFile, districts, totalDistricts, totalOffices }
StateInfo       { name, slug, apiFile, capital, type: 'state' | 'ut' }
```

---

## URL Structure

```
/                                                    → Homepage
/state/[state]/                                      → State page
/state/[state]/[district]/                           → District page
/state/[state]/[district]/[pincode]/                 → PIN code detail page
/about/                                              → About Us
/contact/                                            → Contact
/privacy-policy/                                     → Privacy Policy
/cookie-policy/                                      → Cookie & Consent Management
```

**Example URLs:**
```
/state/uttar-pradesh/
/state/uttar-pradesh/agra/
/state/uttar-pradesh/agra/282001/
```

---

## Page Content

### Homepage (`/`)
- Hero with live fuzzy search (scored matching — exact PIN → prefix → office → district → state)
- State cards grid (States + Union Territories, with capital, district count, office count)
- "How to Find Your PIN Code" 3-step guide
- Recently Viewed PIN Codes (last 2, from localStorage)
- 8 FAQs (JSON-LD FAQPage schema)

### State Page (`/state/[state]/`)
- State name, capital, type (State / UT), coverage stats
- Unique overview paragraph + postal note (from `lib/stateContent.ts`)
- District grid with PIN range per district
- Other States & UTs pills
- 10 FAQs
- Per-state OG image (`app/state/[state]/opengraph-image.tsx`)

### District Page (`/state/[state]/[district]/`)
- District + state name, office count, PIN range
- District overview prose
- Full PIN code list (table: PIN, H.O/S.O/B.O count, delivery status)
- Other Districts pills
- 10 FAQs

### PIN Code Detail Page (`/state/[state]/[district]/[pincode]/`)
- **Detail card:** Left panel (PIN number, office type badge, Copy Code button) + Right panel (2-col grid: Office, District, State, Division, Circle, Country, Full Address)
- Address format box (copyable)
- Post offices table (name, type badge, delivery status, taluk, division)
- Other PIN Codes in same district
- Share buttons
- Other States & UTs pills
- 10 FAQs
- Tracks page to `localStorage` (recently viewed)

### Legal Pages
| Path | Purpose |
|---|---|
| `/about/` | Mission, coverage stats, India Post disclaimer |
| `/contact/` | Contact form (no backend, no email exposed publicly) |
| `/privacy-policy/` | Full GDPR-compliant policy |
| `/cookie-policy/` | Per-cookie table + live consent management UI |

---

## Components

| File | Description |
|---|---|
| `Logo.tsx` | Location-pin SVG with saffron gradient, parameterised `size` |
| `Navbar.tsx` | Logo + brand + main links + top-state quick links |
| `Footer.tsx` | State/UT columns + legal links row (About, Contact, Privacy, Cookies) |
| `SearchClient.tsx` | `'use client'` — scored fuzzy search, reuses `rv-item` CSS classes |
| `RecentlyViewed.tsx` | `'use client'` — reads from localStorage, shows last 2 |
| `PincodeTracker.tsx` | `'use client'` — writes current PIN page to localStorage on mount |
| `PrefetchLinks.tsx` | `'use client'` — injects `<link rel="prefetch">` tags on mount |
| `CookieConsent.tsx` | `'use client'` — GDPR banner, localStorage key `pcf_cookie_consent` |
| `CopyButton.tsx` | Copy to clipboard button (two variants: hero / default) |
| `ShareButtons.tsx` | WhatsApp, Twitter/X, copy-link share buttons |
| `Breadcrumb.tsx` | BreadcrumbList JSON-LD + visual breadcrumb |
| `Faq.tsx` | FAQPage JSON-LD accordion |

---

## SEO Features

### Per-page Metadata
- Unique `<title>` and `<meta description>` on every route
- Canonical URL via `alternates.canonical`
- Expanded `keywords` (12–16 terms per page, location-specific)
- Open Graph + Twitter Card

### JSON-LD Schemas
| Page | Schemas |
|---|---|
| Layout (all pages) | WebSite + Organization + GovernmentOrganization (India Post) |
| Homepage | FAQPage (8 Qs) |
| State | FAQPage (10 Qs) |
| District | FAQPage (10 Qs) |
| PIN Code | PostalAddress + PostOffice + FAQPage (10 Qs) |

### OG Images
- Homepage: `app/opengraph-image.tsx` (1200×630, Satori/ImageResponse)
- Per-state: `app/state/[state]/opengraph-image.tsx` (dynamic state name + capital)

### Crawling
- `app/robots.ts` — explicit allow rules for Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, anthropic-ai
- `public/llms.txt` — AI crawler guidance (URL structure, data format, allowed uses)
- `app/sitemap.ts` — auto-generated XML sitemap (all 21,097+ pages)

---

## Branding

| Property | Value |
|---|---|
| Brand name | **PinCodeFinder** |
| Domain | `www.pincodefinder.net` |
| Logo | Location-pin SVG with saffron gradient (`components/Logo.tsx`) |
| Favicon | `app/icon.svg` (same location-pin, 40×40 viewBox) |
| Theme color | `#f97316` (saffron/orange) |
| Nav/card background | `#1a3a6b` (navy) |
| Tagline | "India's PIN Code Directory" |

## Color Palette

```css
--red:        #f97316   /* saffron — primary accent, badges, CTAs */
--red-dark:   #ea580c
--navy:       #1a3a6b   /* nav, detail card, footer */
--navy-dark:  #0d2040
--gold:       #d97706   /* PIN code number highlights */
--gold-light: #fef9c3   /* PIN badge backgrounds */
--green:      #16a34a   /* B.O badge, delivery status */
--green-lt:   #dcfce7
--bg:         #ffffff
--bg-alt:     #f8f9fb
--border:     #e2e8f0
--border-lt:  #f1f5f9
--text:       #1a202c
--text-mid:   #374151
--text-muted: #6b7280
```

---

## File Structure

```
india-pincode/
├── PLAN.md
├── package.json                    # prebuild → scripts/fetch-data.mjs
├── next.config.ts                  # output: 'export', staticPageGenerationTimeout: 300
├── tsconfig.json
├── .github/workflows/deploy.yml    # GitHub Actions → GitHub Pages
├── scripts/
│   └── fetch-data.mjs              # Downloads all 35 state JSONs to data/ before build
├── data/                           # Git-ignored; populated by fetch-data.mjs
│   └── *.json
├── types/
│   └── pincode.ts
├── lib/
│   ├── pincode.ts                  # Data fetching (disk-first, API fallback), grouping
│   ├── states.ts                   # STATES array + STATES_BY_SLUG map
│   ├── stateContent.ts             # Unique overview paragraphs for all 35 states/UTs
│   └── utils.ts                    # toSlug, fromSlug
├── components/
│   ├── Logo.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── SearchClient.tsx
│   ├── RecentlyViewed.tsx
│   ├── PincodeTracker.tsx
│   ├── PrefetchLinks.tsx
│   ├── CookieConsent.tsx
│   ├── CopyButton.tsx
│   ├── ShareButtons.tsx
│   ├── Breadcrumb.tsx
│   └── Faq.tsx
├── app/
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx                  # Root layout, global JSON-LD, Google Fonts
│   ├── page.tsx                    # Homepage
│   ├── not-found.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── opengraph-image.tsx         # Homepage OG image (Satori)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── cookie-policy/page.tsx
│   └── state/
│       └── [state]/
│           ├── page.tsx
│           ├── opengraph-image.tsx # Per-state OG image
│           └── [district]/
│               ├── page.tsx
│               └── [pincode]/
│                   └── page.tsx
└── public/
    ├── CNAME                       # www.pincodefinder.net
    ├── site.webmanifest
    └── llms.txt
```

---

## Build & Deployment

### Local Development
```bash
npm run dev          # Start dev server (fetches from API live)
npm run fetch-data   # Download all 35 state JSONs to data/
npm run build        # prebuild (fetch-data) + next build → out/
```

### GitHub Actions CI (`deploy.yml`)
1. Checkout → Install (`npm ci`)
2. `npm run build` → triggers `prebuild` → downloads data → Next.js static export
3. Upload `out/` → Deploy to GitHub Pages

### Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.pincodefinder.net` | Canonical base URL for metadata + sitemap |
| `NEXT_BASE_PATH` | `` | Base path (empty for custom domain) |

---

## Internal Linking Strategy

Each page links to:
1. **Up the hierarchy:** Breadcrumb (PIN → District → State → Home)
2. **Same level:** Other PIN codes in same district, other districts in same state
3. **Cross-state:** All other states/UTs pill links on every page
4. **Prefetch:** First 4–6 likely-next pages via `<link rel="prefetch">` (client-side)

---

## Key Technical Decisions

| Decision | Reason |
|---|---|
| `output: 'export'` | Fully static — deploys to GitHub Pages without a server |
| Pre-download data script | API is flaky under parallel build load; disk reads are instant and reliable |
| `staticPageGenerationTimeout: 300` | 21k pages need more than the 60s default |
| Disk-first data reading | `readFileSync` in `lib/pincode.ts` — no network during page generation |
| Control character stripping | `himachal_pradesh.json` and others contain invalid JSON control chars |
| `'use client'` only where needed | `localStorage`, copy-to-clipboard, cookie consent — rest is pure SSG |
| Satori OG images | Every `<div>` must have explicit `display: 'flex'`; no `<br>` tags |
| CSS-only (no Tailwind) | Single `globals.css` file, all custom properties, full control |
