# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Homeowners with private gardens (chalets, villas, townhouses) in Fuengirola, Mijas, Benalmádena and Alhaurín. They find Facundo via Google or by asking an AI where to get pruning done nearby. Situation: a palm or tree needs attention now or soon. Job: contact a trustworthy local pruner and get a fixed price fast — ideally by sending a photo over WhatsApp.

Secondary: English-speaking residents/expats on the Costa del Sol (site is fully bilingual ES/EN).

## Product Purpose

Single landing page (`/` Spanish, `/en` English) that turns local search intent into WhatsApp/phone contact for Facundo Gutiérrez's pruning business. Success = visitor contacts Facundo within seconds of landing. No accounts, no booking system, no CMS — a fast static page plus a quote form.

## Positioning

One named tradesman, not a company: Facundo himself answers, quotes and does the work. Palm specialist (date and Canary Island palms) with 15 years on the Costa del Sol. What a neighboring business could not truthfully copy: first-person voice, the real local phone number, and 15 years of named local reputation.

## Operating Context

- Mobile-first: most visitors arrive from a phone, often standing in their garden.
- Contact channels: WhatsApp Business (primary), phone call, quote form (Web3Forms).
- Service area: Fuengirola (base), Mijas, Benalmádena, Alhaurín el Grande, Alhaurín de la Torre.
- Discovery: Google local search + AI-assistant recommendations + Google Business Profile (separate asset, not this repo).

## Capabilities and Constraints

- Static Astro site, Tailwind v4, deployed on Vercel. Spanish default; non-Spanish browsers redirect to `/en` (client-side detection + cookie).
- Sections: hero, services (palm pruning, tree pruning, felling/stump grinding, 24h emergency), service area, why-me, gallery, reviews, FAQ + schema, quote form, sticky mobile CTA.
- Quote form posts to Web3Forms (needs a real access key pre-deploy). Analytics via Umami (needs a real website ID pre-deploy).
- No backend, no cookies of our own except the `lang` preference.
- Undecided: exact-image set for gallery, permit-handling copy per municipality.

## Brand Commitments

- Official name: **Facundo Gutiérrez**. Trading mark/logo lockup reads "Podas Gutiérrez — Poda de palmeras".
- Voice: first person singular ("Soy Facundo…"), plain peninsular Spanish tuteo, concrete over generic (species, prices from €60, same-day reply).
- Assets on hand: logo badge (`public/images/logo.png`… see Evidence), real phone +34 632 227 016.
- Display type echoes the logo's condensed-bold lettering (Barlow Condensed); body stays system sans.

## Evidence on Hand

- Logo: `public/images/logo.jpg` (shield badge with phone number baked in).
- Real contact: WhatsApp/call +34 632 227 016 (wired through `src/content/config.ts`).
- ABSENT — future work must not fabricate: gallery photos (`public/images/galeria/*` referenced but missing), hero photo (currently reuses the logo), the 3 Google reviews in `landing.*.json` (placeholder copy), Web3Forms access key, Umami website ID.

## Product Principles

1. The visitor reaches Facundo in under 15 seconds: phone and WhatsApp are always one tap away.
2. One man, one name, one voice — never sound like an agency or a franchise.
3. Concrete beats generic: species, towns, prices, response times — never lorem-style claims.
4. Fast on cheap phones: static HTML first, JavaScript only where it earns its bytes.
5. Bilingual without dilution: every fact exists identically in Spanish and English.

## Accessibility & Inclusion

Mobile-first audience including older homeowners: tap targets ≥44px, 16px minimum input text (no iOS zoom trap), visible focus, Spanish plain language; English mirror for expats.
