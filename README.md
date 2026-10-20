# FrameIQ Static Site

FrameIQ is a pure-static website for the FrameIQ computer-vision products, sector use cases, company information, and enquiry flows. It uses HTML, CSS, and browser JavaScript; no build step or package installation is required.

## Run locally

- **VS Code Live Server:** open this folder in VS Code, right-click `index.html`, and choose **Open with Live Server**.
- **Without an extension:** serve this folder with `python -m http.server 8000` and open `http://localhost:8000/`. Direct `file://` opening still works with fallback tiles, but browsers block loading the local-photo allowlist there.

## Folder map

- `index.html` — home page.
- `pages/` — standalone site pages, including contact, product, company, and legal pages.
- `pages/sectors/` — sector-specific pages.
- `docs/PROPOSAL-AUDIT.md` — implementation status for the supplied Phase 3 requirements; the referenced source proposal is still needed to audit sections 4.1–4.13, 6, and 7 bullet-by-bullet.
- Product concept pages: `pages/pcb-guardian.html`, `pages/ppe-safety.html`, and `pages/autolabel.html`; unspecified functionality is marked to be confirmed.
- Illustrative input-based calculators: `pages/roi-pcb-guardian.html` and `pages/roi-ppe-safety.html`; results are not product claims, quotes, or promised savings.
- `assets/css/` — shared styles and page-specific stylesheets.
- `assets/fonts/` — locally hosted Bootstrap Icons CSS, WOFF2 font, and license.
- `assets/js/` — shared site behavior and page-specific scripts.
- `assets/data/` — content and configuration consumed by the pages.
- `assets/img/` — local images; current live-site carryover photos are pending source/license verification. The favicon has intentionally been removed.

## Data and configuration files

- `assets/data/ai-products.js` — AI Store product listings and product-use-case information.
- `assets/data/beejhealth.js` — BeejHealth page content and its confirmation display flag.
- `assets/data/blog-posts.js` — blog post metadata and content.
- `assets/data/careers.js` — careers roles and company values.
- `assets/data/company-data.js` — About page process, projects, technology, and `SHOW_DRAFT`.
- `assets/data/coverage.js` — geographic coverage and map-region information.
- `assets/data/docs.js` — documentation sections and their statuses.
- `assets/data/features.js` — feature pillars and use cases.
- `assets/data/hardware.js` — Gear Store hardware listings, pricing, and product details.
- `assets/data/sectors.js` — nine sector use-case entries, including Events & Entertainment; all are discussion topics whose suitability and scope are confirmed on enquiry.
- `assets/data/images.js` — image slots, local JPEG paths, alt text, dimensions, fallback icons, and the disabled remote-image switch.
- `assets/data/local-photos.js` — generated allowlist of local JPEG slots, so missing files are not requested.
- `assets/data/live-carryover.js` — source-page-tagged copy from the current live site; one `SHOW_UNCONFIRMED` flag controls the review-only content and banner.
- `assets/data/legal.js` — legal-page draft visibility; keep `SHOW_DRAFT: true` for review and set it to `false` at launch.
- `assets/data/research.js` — research content and confirmation flag.
- `assets/data/search-index.js` — pages, products, and resources available in site search.
- `assets/data/sectors.js` — sector-page content and related use cases.
- `assets/data/site-data.js` — `SITE_URL`, shared `FORM_ENDPOINT`, `SITE_PAGES`, `SITE_CONTACT`, navigation/footer links, social links, and FAQs.
- `assets/js/roi-calculators.js` — browser-only, user-input time/value scenarios with formulas, print-to-PDF, and an optional mailto draft.
- `assets/js/partners.js` — partner enquiry email-draft flow; the static page does not submit to a server.
- `assets/js/forms.js` — shared message-copy fallback for disconnected forms.
- `assets/js/seo.js` — canonical, Open Graph, Twitter, and structured-data metadata from the shared site configuration.
- `assets/js/photos.js` — shared photo loader, local-file allowlist, fixed aspect ratios, and designed CSS fallback tiles.
- `assets/js/pages/home-selector.js` — homepage sector chips, data-driven use cases and catalog matches, and safely persisted selection.
- `assets/js/pages/pcb-guardian.js` — fixed sample-value PCB demo interaction; it is labelled demo data and does not analyze images.
- `scripts/update-photos.ps1` — scans `assets/img/photos/*.jpg` and regenerates the local photo allowlist.
- `pages/style-guide.html` — unlinked, development-only icon reference; delete it before launch.

## Visual system and interactions

- `assets/css/tokens.css` defines shared color, type, spacing, radius, shadow, blur, motion, and stacking tokens.
- `assets/fonts/` contains the self-hosted Inter and Space Grotesk variable fonts and Bootstrap Icons.
- `assets/css/base.css` and `assets/css/components.css` provide shared typography, surfaces, navigation, and components; page-specific styles remain under `assets/css/pages/`.
- `assets/js/main.js` initializes the theme, keyboard-accessible navigation, command palette, reduced-motion-aware polish, and long-page section navigation.
- The home vision overlay is drawn on canvas and pauses when off-screen or when reduced motion is preferred.
- AI Store and Gear catalogs support filtering, search, sorting, grid/list layouts, product details, comparison, and enquiry links using the existing catalog data.
- AI Store search text and category filters are represented in the URL; its Quick view and comparison use the existing AI product data.
- The homepage industry selector and four-stage Camera to Decision story use existing sector/product data and reduced-motion-aware behavior. The site-wide contextual CTA hides at the Contact page and as the footer enters view.
- Research contains a conceptual approach toggle, an HTML/CSS-only architecture diagram, and a model-card template with unconfirmed fields clearly marked.
- The Contact form collects optional budget and timeline choices. It has no upload control; users can attach files when replying to the enquiry email.
- Gear shows the Multi-Sensor Array as its sixth catalog item (Sensor Kits, INR 16,500, out of stock). All Gear prices are indicative and confirmed on enquiry.

## Check before launch

- Replace the `SITE_URL` placeholder in `assets/data/site-data.js`, `robots.txt`, and `sitemap.xml` after the final public domain is approved.
- Set each `SHOW_DRAFT` flag in the relevant data file to `false` at launch; the flags are currently `true` for manager review. The legal pages remain visibly marked pending approval until approved legal text is supplied.
- Set `SHOW_UNCONFIRMED` in `assets/data/beejhealth.js` as appropriate; keep unconfirmed content hidden until approved.
- Configure the shared `FORM_ENDPOINT` in `assets/data/site-data.js` with the production Formspree endpoint. Leave it empty during review to use the honest mailto and copy-message fallbacks.
- Verify `SITE_CONTACT` in `assets/data/site-data.js`, including its phone, email, location, hours, and registration details.
- Current contact hours are Mon–Fri, 9am–6pm IST. The existing CIN/LLP registration wording has not been changed and still needs company confirmation.
- `assets/img/og-image.jpg` is a branded, non-photographic social preview. Replace it only if an approved launch image is supplied.

## Pending from the company

- [ ] Confirm team names and roles.
- [ ] Provide and approve final legal text.
- [ ] Provide the production form endpoint.
- [ ] Confirm the WhatsApp destination.
- [ ] Confirm the calendar link.
- [ ] Confirm product prices.
- [ ] Provide approved product photos.
- [ ] Confirm PCB Guardian, PPE Safety, and AutoLabel scope, availability, supported specifications, deployment options, and pricing.
- [ ] Confirm responsible-AI, privacy, data-handling, partner-program, and reseller terms before making commitments.
- [ ] Approve product output examples and any performance claims before publication.
- [ ] Approve press boilerplate, spokesperson details, and brand assets/usage permissions.
- [ ] Confirm whether the registration identifier should be CIN or LLPIN.
- [ ] Confirm the exact proposal text for sections 4.1–4.13, 6, and 7 so the audit can list and assess every original bullet.
- [ ] Confirm the final public domain.
- [ ] Approve final client wording and any client references.

## Navigation, product concepts, and calculators

The shared navigation and footer use the Solutions, Products, Hardware, Demos, Resources, and Company groups. Solutions includes Events & Entertainment. The primary action is **Book a Demo** (Contact); Playground is labelled **Try Live Demo** and is explicitly illustrative. The legacy `pages/getstarted.html` route remains available as an enquiry page.

PCB Guardian, PPE Safety, and AutoLabel pages distinguish existing site information from details that are still to be confirmed. The ROI-labelled tools accept blank-by-default user inputs and display only an illustrative time/value scenario using their visible formulas. They do not claim verified savings, product performance, payback, or ROI. Printing invokes the browser print dialog; email opens a draft addressed to `SITE_CONTACT.email` and does not send it.

The Responsible AI page is a discussion guide, not a policy or legal claim. The Partners form prepares a mail draft and does not submit data to a backend. The Press Kit contains text and brand-colour references only, not licensed media assets.

## LOCAL PHOTO WORKFLOW

LoremFlickr returned intermittent HTTP 500 errors, so remote photos are disabled (`USE_TEMP_REMOTE: false`). Empty image slots show a themed, text-free icon tile and do not probe missing files.

Add licensed JPEGs to `assets/img/photos/`, using the exact slot names from `assets/data/images.js` (for example, `sector-banking.jpg`). Use 1600×900 images where practical and keep each file under 300 KB. Record the source, creator, and license for every photo in `assets/img/photos/CREDITS.md`.

After adding photos, run: `powershell -ExecutionPolicy Bypass -File scripts\update-photos.ps1`, then hard-refresh (Ctrl+F5).

The generated `assets/data/local-photos.js` lists only slots with a matching `.jpg`; the loader requests local images only for slots in that list. Missing or empty lists leave all affected slots as designed fallback tiles. The remote LoremFlickr/Picsum code path remains available for a future explicitly approved switch, but is currently off.

The favicon has intentionally been removed. Pages use an empty data-URL icon to prevent browser requests for a missing `/favicon.ico`; do not restore favicon assets or manifest icon entries.

## SEO and QA

- `SITE_PAGES` in `assets/data/site-data.js` is the canonical page list used by the metadata helper; keep `sitemap.xml` and `robots.txt` aligned with it.
- The latest Playwright matrix in `docs/QA-REPORT.md` covers all 40 registered routes in dark and light themes at 320, 360, 375, 390, 420, 768, 1024, and 1280px. No Lighthouse run was performed.
- `docs/QA-REPORT.md` records launch-readiness checks and company-input blockers.

## Content carried over from the live site

The review build reads copied content from `assets/data/live-carryover.js`. `SHOW_REVIEW_BANNER` controls only the review banner and defaults to `false`. `SHOW_UNCONFIRMED` remains enabled and controls carried-over content, ratings, and local live-site photos.

- [x] Home statistics, impact metrics, both displayed testimonials, and FAQ, each tagged with source page `/`.
- [x] Sector names and Impact boxes, tagged with source page `/sectors`.
- [x] Gear hero/product ratings, product details, AI Store category chips and product bullets, tagged with their source pages.
- [x] About registration details, incorporation date, milestones and values; Contact business hours and response card; each item is tagged with its source page.
- [x] Three Blog article records, including visible body copy, authors, dates, categories, excerpts and reading times, tagged with their article source paths.
- [x] Live sector, Gear and Blog photos saved locally using the corresponding `assets/data/images.js` slots.
- [x] Broken/mismatched Gear images are recorded in `LIVE_CARRYOVER.skippedImages` and `assets/img/photos/CREDITS.md`; their slots remain designed fallback tiles.
- [ ] Verify all carried-over claims, figures, testimonials, ratings, blog metadata and body copy with the company before launch.
- [ ] Confirm creators, source rights and licenses for the 12 downloaded photos; credits and source URLs are in `assets/img/photos/CREDITS.md`.

The three copied Blog dates (2/1/2025, 1/28/2025 and 1/25/2025) predate the live About incorporation date of June 5, 2025. Dates are preserved as observed and need company verification.

## Verify before launch

Confirm each carried-over item in `assets/data/live-carryover.js` with the company before launch:

- [ ] Statistics and impact figures (source page `/`).
- [ ] Testimonials and quoted customer statements (source page `/`).
- [ ] Gear and AI Store ratings (source pages `/gear` and the AI Store pages).
- [ ] Contact hours and response-time wording (source page `/contact`).
- [ ] Company registration details and incorporation date (source page `/about`).
- [ ] Blog publication dates (source pages `/blog` and individual article paths).
- [ ] Blog author names and biographies (source pages `/blog` and individual article paths).

## CSS wordmark

The shared header, mobile drawer, and footer use a CSS-only camera-frame mark and the `FrameIQ` wordmark generated by `renderBrand()` in `assets/js/components.js`. No logo image, favicon, or SVG is used.
