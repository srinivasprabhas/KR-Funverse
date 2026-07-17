# KR Funverse — Website

An interactive, animated marketing site for **KR Funverse**, a go-karting, box
cricket and indoor-games arena in Ghatkesar, Hyderabad.

Built with **Next.js 16 (App Router) + TypeScript**, **Tailwind CSS v4** and
**Framer Motion** (the `motion` package).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Requires Node.js 20.9+.

## ✏️ Editing the content (important)

**All site copy, contact details, pricing, hours, attractions, stats, gallery
images and testimonials live in one file:**

> `src/data/site.ts`

Verified facts (name, tagline, the three activities, area, phone, Instagram) are
already filled in. Blocks marked **`PLACEHOLDER`** in that file — pricing,
opening hours, stats, and testimonials — are illustrative defaults. **Replace
them with real values from the owner before going live.**

## Structure

- **Home** (`src/app/page.tsx`) — one immersive scrolling page: hero, marquee,
  about, filterable attractions, animated stats, rate card, safety, events,
  gallery, testimonials, location + map, and a booking/enquiry section.
- **Sub-pages** — `/attractions`, `/pricing`, `/gallery`, `/book`.
- **Enquiry API** — `src/app/api/enquiry/route.ts`. It currently logs submissions
  server-side; wire it to email / a sheet / a CRM where the `TODO` comment is.
- **Images** — `public/images/` (free-licensed Pexels stock; swap for real venue
  photos when available).

## Booking / contact

The site uses floating **WhatsApp** and **click-to-call** buttons plus an
enquiry form. Phone/WhatsApp/Instagram are all read from `src/data/site.ts`.

## Notes

- Fully responsive and honors the OS "reduce motion" setting.
- Dark motorsport theme; design tokens live in `src/app/globals.css`.
