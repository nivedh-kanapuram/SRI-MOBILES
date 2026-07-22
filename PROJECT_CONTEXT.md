# Sri Mobiles — Project Context

## Project Overview

A full-stack Next.js 15 web application for **Sri Mobiles**, a multi-brand mobile & laptop repair service center in Hyderabad (Chaitanyapuri, Dilsukh Nagar). Customers can book repairs online, track repair status, and leave reviews. Admins manage bookings, upload before/after photos, approve reviews, and send WhatsApp status updates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Database | PostgreSQL via Neon.tech (serverless) |
| ORM | Prisma 7 (`@prisma/client` + `@prisma/adapter-pg`) |
| Auth | NextAuth 4 (Credentials provider, JWT strategy) |
| Password Hashing | bcryptjs |
| Animations | Framer Motion 11, Embla Carousel 8 |
| Icons | Lucide React 0.454 |
| Fonts | Inter (body), Montserrat (headings), Cinzel (brand) via Google Fonts |
| Deployment | Vercel |

---

## Project Structure

```
sri-mobiles/
├── app/                      # Next.js App Router pages & API
│   ├── api/                  # API routes
│   │   ├── admin/            # Admin-only endpoints
│   │   ├── auth/             # Auth (NextAuth + register)
│   │   ├── bookings/         # Booking CRUD + tracking
│   │   └── reviews/          # Review submission + approved listing
│   ├── admin/                # Admin dashboard (protected)
│   ├── auth/                 # Sign in / Sign up
│   ├── booking/              # Multi-step booking form
│   ├── dashboard/            # Customer dashboard
│   ├── track/                # Public tracking page
│   ├── warranty/             # Static pages
│   ├── refund/
│   ├── privacy/
│   ├── terms/
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout (fonts, metadata, providers)
│   ├── template.tsx          # Page transition wrapper
│   ├── page.tsx              # Homepage (section composition)
│   ├── loading.tsx           # Loading spinner
│   ├── not-found.tsx         # 404 page
│   ├── sitemap.ts            # Auto-generated sitemap
│   └── robots.ts             # Robots.txt
├── components/
│   ├── layout/               # Navbar, Footer, ScrollProgress, BackToTop, WhatsAppButton
│   ├── sections/             # HeroSection, ServicesSection, BrandsSection, etc.
│   └── ui/                   # Button, Badge, Container, Section, SectionTitle, Breadcrumbs, CopyButton, ProblemDescription, PageTransition
├── lib/
│   ├── prisma.ts             # PrismaClient singleton (Neon + SSL)
│   ├── auth.ts               # NextAuth config (Credentials, JWT, callbacks)
│   └── utils.ts              # cn(), scrollToSection()
├── hooks/
│   └── useCountUp.ts         # Animated number counter hook
├── types/
│   ├── index.ts              # Brand, Service, WhyChooseUs, FAQ, etc.
│   └── next-auth.d.ts        # Session/JWT augmentation (id, role)
├── data/                     # Static data arrays
│   ├── brands.ts             # 15 brands with SVG references
│   ├── services.ts           # 8 services with icons & features
│   ├── why-choose-us.ts      # 6 trust reasons
│   ├── faq.ts                # 6 FAQs
│   └── contact.ts            # Contact info, social links, nav, footer sections
├── scripts/
│   ├── seed.ts               # Seed/upsert admin user
│   └── update-admin-role.ts  # Upgrade user to admin
├── prisma/
│   └── schema.prisma         # Database schema (3 models)
├── public/
│   ├── images/               # logo.png, brands/*.svg, icons/*, services/*
│   ├── uploads/repairs/      # Before/after photos (gitignored)
│   └── gallery/              # Gallery images
├── middleware.ts              # Route protection (dashboard, admin, booking)
├── tailwind.config.ts         # Theme: colors, fonts, shadows, animations
├── next.config.js             # Image optimization, experimental
└── package.json              # Dependencies & scripts
```

---

## Database Schema (3 Models)

### `User`
| Field | Type | Notes |
|---|---|---|
| id | String (uuid) | PK |
| name | String | |
| email | String | Unique |
| password | String | bcrypt hashed |
| phone | String? | |
| role | String | Default `"customer"`, also `"admin"` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Relations: bookings[], reviews[]

### `Booking`
| Field | Type | Notes |
|---|---|---|
| id | String (uuid) | PK |
| trackingId | String? | Unique, auto-generated `SM{YYYY}-{counter}` |
| userId | String | FK → User |
| fullName | String | |
| phone | String | |
| email | String? | |
| deviceType | String | `"mobile"` or `"laptop"` |
| brand | String | e.g. "Samsung" |
| model | String | |
| problem | String | Issue description |
| serviceType | String | `"self_visit"` (default) or `"pickup"` |
| visitDate | String? | Self-visit date |
| visitTimeSlot | String? | Self-visit time slot |
| pickupAddress | String? | Pickup address |
| pickupLandmark | String? | Pickup landmark |
| pincode | String? | Pickup area pincode |
| pickupDate | String? | Pickup date |
| pickupTimeSlot | String? | Pickup time slot |
| status | String | Default `"booking_confirmed"` |
| adminNotes | String? | |
| beforeImage | String? | URL path |
| afterImage | String? | URL path |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Relations: user (User), review (Review?)

### `Review`
| Field | Type | Notes |
|---|---|---|
| id | String (uuid) | PK |
| userId | String | FK → User |
| bookingId | String | Unique FK → Booking |
| rating | Int | 1-5 |
| comment | String | |
| approved | Boolean | Default `false` |
| createdAt | DateTime | |

---

## Status Flow (6 Steps)

```
booking_confirmed → device_received → diagnosis_complete → repair_in_progress → ready_for_pickup → completed
                                                                                                ↘ cancelled
```

Backward compatible: old DB records with `"pending"` or `"in_progress"` are mapped in RepairTimeline.

---

## Design System

### Colors (Tailwind)
- `gold`: `#D4AF37` — accent/highlights
- `sky`: `#0EA5E9` — primary buttons, links
- `whatsapp`: `#25D366` — WhatsApp elements
- Background: `#FFFFFF` / `#F8FAFC`
- Text: `#111827`

### Typography
- Brand name → **Cinzel** (serif, decorative)
- Headings (h1-h6) → **Montserrat** (`font-display`), set via global CSS base rule
- Body → **Inter** (`font-sans`)

### Shadows
- `shadow-card`: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- `shadow-card-hover`: `0 10px 25px rgba(0,0,0,0.08)`
- `shadow-premium`: `0 4px 30px rgba(0,0,0,0.1)`
- `shadow-gold`: `0 0 20px rgba(212,175,55,0.3)`

### CSS Utilities (in `globals.css`)
- `.text-gradient-gold` — gold gradient text
- `.card` / `.card-hover` — standard card styles
- `.premium-shadow` / `.premium-shadow-hover`

### Animations (Tailwind keyframes)
- `fade-in`, `slide-up`, `slide-down`, `scale-in`, `spin-slow`, `confetti`, `check-bounce`

---

## Authentication & Authorization

### Login
- Admin: `srimobiles.dsnr@gmail.com` / `Sri@232656`
- Registration creates customer accounts; upgrade to admin via `scripts/update-admin-role.ts`

### NextAuth Config (`lib/auth.ts`)
- Credentials provider (email + password, bcrypt compare)
- JWT strategy (no database sessions)
- Callbacks inject `id` and `role` into JWT → Session
- Custom sign-in page at `/auth/signin`

### Middleware (`middleware.ts`)
- Protects `/dashboard/:path*`, `/admin/:path*`, `/booking` → requires auth
- Admin routes additionally require `token?.role === 'admin'`
- Unauthenticated users redirected to `/auth/signin`

---

## API Routes

| Endpoint | Auth | Method | Purpose |
|---|---|---|---|
| `/api/auth/[...nextauth]` | — | GET/POST | NextAuth handler |
| `/api/auth/register` | — | POST | Register new user |
| `/api/bookings` | User | GET | Get user's bookings (with review) |
| `/api/bookings` | User | POST | Create booking → generates `SM{YYYY}-{counter}` trackingId → WhatsApp message |
| `/api/bookings/track/[trackingId]` | — | GET | Public tracking lookup |
| `/api/reviews` | User | POST | Submit review (completed booking, no duplicates) |
| `/api/reviews/approved` | — | GET | Get approved reviews for testimonials |
| `/api/admin/bookings` | Admin | GET | All bookings with user + review |
| `/api/admin/bookings/[id]` | Admin | PATCH | Update status/notes, auto-create gallery entry on `"completed"` |
| `/api/admin/stats` | Admin | GET | Aggregated booking counts |
| `/api/admin/reviews` | Admin | PATCH | Approve/reject review |
| `/api/admin/photos` | Admin | PATCH | Update before/after image URLs |
| `/api/admin/upload` | Admin | POST | File upload (multipart, JPG/PNG/WEBP) |
| `/api/admin/update-role` | Secret | GET | Upgrade user to admin (query param `?email=x&secret=admin-update-2024`) |
| `/api/admin/clean-db` | Secret | GET | Wipe reviews + bookings (secret: `admin-update-2024`) |

---

## Key Pages & Features

### Homepage (`/`)
Composed of sections in order: ScrollProgress → Navbar → HeroSection → TrackRepairSection → BrandsSection → ServicesSection → WhyChooseUsSection → TestimonialsSection → GallerySection → FAQSection (desktop only) → ContactSection (desktop only) → MapSection → CTABanner → Footer → WhatsAppButton → BackToTop

### Booking (`/booking`) — Multi-step form
1. Service Type (Self Visit / Doorstep Pickup)
2. Device Details (mobile/laptop, brand, model)
3. Issue Details (problem + date time or pickup address)
4. Your Info (name, phone, email)
5. Summary & Confirm
- Requires authentication
- On success: `BookingSuccess` component with confetti, tracking ID display, CopyButton
- Valid pincodes defined inline for pickup area

### Admin Dashboard (`/admin`)
- Stats cards (total, pending, in-progress, completed)
- Filter tabs: service type (All / Self Visit / Doorstep Pickup) + status (all 6 statuses + cancelled)
- Per-booking card: name, phone, status dropdown, WhatsApp button, date, ProblemDescription, pickup/visit details, before/after PhotoUpload, Save Changes / Discard, review approval
- Draft changes tracked locally; saved batch via API on button click
- PhotoUpload component: file input (JPG/PNG/WEBP), preview thumbnail, Remove/Replace buttons

### Customer Dashboard (`/dashboard`)
- All user bookings listed
- Each card: tracking ID + CopyButton, device info, status badge, pickup location details
- Completed bookings: green completion card with date, before/after thumbnails
- Image viewer modal: full-screen, zoom/pan, keyboard navigation, scroll-wheel zoom
- Review form: star rating (1-5) + comment textarea, one review per completed booking
- ProblemDescription component for truncated issue text

### Tracking (`/track`)
- Accepts `?bookingId=` query param → auto-searches on load
- Fallback: manual input form (no param)
- Full 6-step RepairTimeline visual
- Booking details: device info, dates, status, problem description
- Invalid ID: "Booking not found. Please check your Booking ID."

### Gallery (`/`)
- 6 gallery images in a responsive grid
- Lightbox modal with prev/next navigation
- Auto-generated from `public/gallery/repairs/manifest.json` when admin marks booking as completed

---

## Mobile Responsiveness

- **HeroSection stats counters**: `hidden md:grid` — hidden on mobile
- **FAQSection**: `hidden md:block` — visible only on desktop
- **ContactSection**: desktop only
- **BrandsSection**: mobile uses `grid-cols-3` pills (`rounded-full`, `border-gold/15`, 14px, py-2.5) — desktop uses logo cards
- **Hero CTA buttons**: uniform `h-12 text-sm max-w-[300px]` on mobile
- **Hero description**: `text-xs` (12px) on mobile, `max-w-xs`, `md:text-lg lg:text-xl` on desktop
- **Booking form**: responsive grid, stacked on mobile
- **Admin page**: responsive filter overflow-x, stacked cards on mobile

---

## Key Components

### `Button.tsx` (Polymorphic)
- Variants: `primary`, `secondary`, `outline`, `ghost`, `sky`, `gold`, `whatsapp`
- Sizes: `sm`, `md`, `lg`, `xl`, `icon`
- Features: loading state, disabled, asChild (Slot), forwardRef

### `ProblemDescription.tsx`
- Props: `text: string`, `maxChars?: number` (default 120), `className?: string`
- Shows truncated text with "Read More" / "Show Less" toggle
- Gray rounded container, `whitespace-pre-wrap`, `break-words`
- Used in: admin dashboard, customer dashboard, tracking page

### `CopyButton.tsx`
- Props: `text: string`, `label?: string`
- One-click copy to clipboard with Copy icon → Check icon + "Copied!" feedback

### `RepairTimeline.tsx`
- 6-step visual timeline (booking_confirmed → completed + cancelled)
- Current + completed statuses highlighted; cancelled shown separately
- Backward compatible with old DB values (`pending` → `booking_confirmed`, `in_progress` → `repair_in_progress`)

### `PhotoUpload.tsx` (inline in admin/page.tsx)
- File input for image upload, preview thumbnail
- Buttons: Upload Photo (no image), Replace / Remove (image exists)
- Validates JPG/PNG/WEBP, uploads via `/api/admin/upload`
- Shows spinner during upload

### `BookingSuccess.tsx`
- Displays on successful booking creation
- Confetti animation, congratulatory message
- Track Your Repair button → `/track?bookingId={id}`
- CopyButton for booking ID

---

## Gallery System

When admin marks a booking as `"completed"` via PATCH `/api/admin/bookings/[id]`, the API writes an entry to `public/gallery/repairs/manifest.json` with:
```json
{
  "src": "/uploads/repairs/{bookingId}/after.jpg",
  "alt": "{brand} {model} - After Repair",
  "description": "{fullName}",
  "uploadedAt": "{timestamp}"
}
```

The GallerySection reads this manifest to display completed repair photos.

---

## Image Upload

- Endpoint: `POST /api/admin/upload`
- Format: multipart/form-data with fields: `file`, `bookingId`, `type` (before/after)
- Validated: JPG, PNG, WEBP only; 10MB max
- Saved to: `public/uploads/repairs/{bookingId}/{type}.{ext}`
- Returns: `{ "url": "/uploads/repairs/{bookingId}/{type}.{ext}" }`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/sri-mobiles?sslmode=require` |
| `NEXTAUTH_SECRET` | JWT signing secret | `sri-mobiles-production-secret-2026-xk9m2p` |
| `NEXTAUTH_URL` | App URL for NextAuth callbacks | `http://localhost:3000` (dev) / `https://sri-mobiles-iojb.vercel.app` (prod) |

---

## Important Gotchas & Decisions

1. **Prisma client is gitignored**: Output at `/lib/generated/prisma` is in `.gitignore`. Regenerated via `postinstall` script (`prisma generate`). Anyone cloning the repo must run `npm install` (which triggers `prisma generate`).

2. **No email/SMTP**: Notification system was removed. Admin manually sends WhatsApp messages. Booking confirmation includes WhatsApp link.

3. **Before/after images stored in `public/uploads/repairs/`**: This directory is gitignored. In production (Vercel), uploads go to the ephemeral filesystem — they will be lost on redeploy. A permanent solution (e.g., S3/Cloudinary) would be needed for production longevity.

4. **Gallery manifest.json**: Uses `import` for gallery entries. GallerySection imports this at build time; new entries added by admin API at runtime via `fs.writeFileSync`. Works in Vercel because `public/` is writable during runtime (Vercel uses a writable `/tmp` but `public/` is not writable at runtime — this is a known production issue that needs fixing).

5. **Neon SSL**: The `DATABASE_URL` must include `sslmode=require` (or `verify-full`). Prisma adapter uses `@prisma/adapter-pg` with Neon connection.

6. **Gallery JSON inconsistency**: `manifest.json` uses `import` syntax (`import galleryData from '@/public/gallery/repairs/manifest.json'`) but the admin API writes a plain JSON file without `export default`. This inconsistency exists and should be fixed — either use `fs.readFileSync` or fix the JSON format.

7. **Admin page collapse**: The admin page had a major uncommitted state restored via git checkout. Ensure all admin features (file upload, ProblemDescription, draft save, pickup details card, status/service filters) are intact before further development.

8. **`next build` passes**: The project compiles and builds successfully. No TypeScript or build errors.

9. **Status values**: `booking_confirmed` (initial), `device_received`, `diagnosis_complete`, `repair_in_progress`, `ready_for_pickup`, `completed`, `cancelled`. Old values (`pending`, `in_progress`) handled via backward compatibility in `RepairTimeline` component.

10. **GallerySection import**: `import galleryData from '@/public/gallery/repairs/manifest.json'` — this is a build-time static import. The admin API writes to the file at runtime, which won't update the imported data. To see new entries, a full page reload is needed (and the data is only as recent as the last build in production).

---

## Running Locally

```bash
# Install dependencies + generate Prisma client
npm install

# Copy .env from a colleague or recreate with your Neon credentials
# Required: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# Run database migrations
npx prisma migrate dev

# Seed admin user
npx tsx scripts/seed.ts

# Start dev server
npm run dev
# → http://localhost:3000

# Type check
npm run type-check

# Build
npm run build
```

---

## Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` → Neon connection string with `sslmode=require`
   - `NEXTAUTH_SECRET` → same secret
   - `NEXTAUTH_URL` → `https://{your-domain}.vercel.app`
3. Build command: `next build` (default)
4. `postinstall` script automatically runs `prisma generate` after `npm install`
5. If using a custom domain, update `NEXTAUTH_URL` to match

---

## Known Issues / TODOs

1. **Gallery manifest.json production issue**: Admin API uses `fs.writeFileSync` to write to `public/gallery/repairs/manifest.json`, but Vercel's runtime filesystem may not persist this across instances. Consider using the database or external storage.

2. **Image uploads ephemeral on Vercel**: Uploaded images are saved to the local filesystem and will be lost on redeploy. Use S3/Cloudinary/Uploadthing for production.

3. **GallerySection uses build-time import**: `import galleryData from '@/public/gallery/repairs/manifest.json'` is resolved at build time. New entries added at runtime via the admin page won't appear until next build.

4. **No TypeScript errors**: Running `npm run type-check` should pass.

5. **Admin login credentials**: `srimobiles.dsnr@gmail.com` / `Sri@232656`

---

*Generated for AI-assisted development continuation. Last updated: July 21, 2026.*
