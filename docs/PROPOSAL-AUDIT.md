# Proposal audit

## Scope note

The proposal source containing sections 4.1–4.13, 6, and 7 was not present in the workspace or supplied in the conversation. The section rows below are therefore marked **Needs company input** rather than inventing proposal bullets. This document audits the requirements explicitly supplied in the Phase 3 request; provide the source proposal to map its original bullets one-by-one.

## Referenced proposal sections

| Proposal section | Status | Implementing file |
|---|---|---|
| 4.1 | Needs company input — proposal text not supplied | Not available |
| 4.2 | Needs company input — proposal text not supplied | Not available |
| 4.3 | Needs company input — proposal text not supplied | Not available |
| 4.4 | Needs company input — proposal text not supplied | Not available |
| 4.5 | Needs company input — proposal text not supplied | Not available |
| 4.6 | Needs company input — proposal text not supplied | Not available |
| 4.7 | Needs company input — proposal text not supplied | Not available |
| 4.8 | Needs company input — proposal text not supplied | Not available |
| 4.9 | Needs company input — proposal text not supplied | Not available |
| 4.10 | Needs company input — proposal text not supplied | Not available |
| 4.11 | Needs company input — proposal text not supplied | Not available |
| 4.12 | Needs company input — proposal text not supplied | Not available |
| 4.13 | Needs company input — proposal text not supplied | Not available |
| 6 | Needs company input — proposal text not supplied | Not available |
| 7 | Needs company input — proposal text not supplied | Not available |

## Explicit Phase 3 requirements

Status describes the workspace implementation after the Phase 3 changes. **Needs company input** is reserved for factual or approval-dependent content; **Partial** indicates a feature is implemented but its supplied source data or production integration is incomplete.

| Requirement | Status | Implementing file(s) |
|---|---|---|
| Add an Events & Entertainment sector, own page, navigation, sector listing, search, sitemap, and footer | Done | `assets/data/sectors.js`, `pages/sectors/events-entertainment.html`, `assets/data/site-data.js`, `assets/data/search-index.js`, `pages/sectors.html`, `sitemap.xml` |
| Add Multi-Sensor Array as Gear product six, Sensor Kits, INR 16,500, out of stock; retain indicative-price language | Done | `assets/data/hardware.js`, `assets/js/components/gear-ui.js`, `assets/js/pages/gear.js` |
| Show Mon–Fri, 9am–6pm IST in contact details, footer, and structured data | Done | `assets/data/site-data.js`, `pages/contact.html`, `pages/about.html`, `index.html`, `assets/js/main.js`, `assets/js/seo.js`, `assets/js/pages/contact.js` |
| Do not add a 24-hour response promise | Done | `pages/contact.html`, `assets/js/pages/contact.js` |
| Preserve existing CIN/LLP wording and report registration wording for confirmation | Needs company input | `assets/data/site-data.js`, `assets/js/seo.js`, `docs/COMPLETION-CHECK.md` |
| Homepage industry selector, dynamically sourced content, and safely persisted choice | Done | `index.html`, `assets/js/pages/home-selector.js`, `assets/css/pages/home.css`, `assets/data/sectors.js`, `assets/data/ai-products.js`, `assets/data/hardware.js` |
| Camera-to-Decision scroll story with reduced-motion support | Done | `index.html`, `assets/js/pages/home.js`, `assets/css/pages/home.css` |
| Page-aware sticky CTA, hidden at Contact and near footer | Done | `assets/js/components.js`, `assets/css/components.css` |
| AI Store compare, quick view, filters/search, and URL state | Done | `pages/ai-store.html`, `assets/js/pages/ai-store.js`, `assets/css/pages/ai-store.css` |
| Research comparison toggle, accessible HTML/CSS architecture diagram, and model-card template | Done | `pages/research.html`, `assets/js/pages/research.js`, `assets/css/pages/research.css`, `assets/data/research.js` |
| PCB Guardian sandbox clearly labelled Demo data | Done | `pages/pcb-guardian.html`, `assets/js/pages/pcb-guardian.js`, `assets/css/pages/site-pages.css` |
| Contact budget/timeline fields, no upload control, and email-reply attachment note | Done | `pages/contact.html`, `assets/js/pages/contact.js` |
| Chatbot recommendations from current catalog data and Contact CTA; no claimed live agent | Done | `assets/js/components.js`, `assets/css/components.css`, `assets/data/ai-products.js`, `assets/data/hardware.js` |
| Gear and AI Store skeleton loaders, page fade, improved small-text contrast, consistent focus styles | Done | `pages/gear.html`, `pages/ai-store.html`, `assets/css/pages/gear.css`, `assets/css/pages/ai-store.css`, `assets/css/base.css`, `assets/css/components.css` |
| Static-only implementation, no SVG or external runtime requests, responsive in both themes | Done | Shared source and assets; see `docs/COMPLETION-CHECK.md` for the verification record |
