# FrameIQ final QA report

## Summary

### Fix now

- Resolved light-theme contrast on the Home secondary hero CTA and the light-theme accent token.
- Split long gradient-text runs on About and Sectors; all gradient boxes now remain under two line-heights.
- Removed duplicate breadcrumb/Organization structured data and made canonical, Open Graph, Twitter, and structured-data URLs use `SITE_URL`.
- Made Login and Enquiry descriptions unique, changed the phone example placeholder so it does not resemble a company contact number, removed the Playground date placeholder, and aligned the sitemap home URL with its canonical URL.
- Added the required developer-only comment to the style guide.

### Needs input from the company

- Verify creator/source rights for the 12 live-site photos in `assets/img/photos/`; fill remaining photo slots only with licensed assets. The Open Graph preview is a generated branded graphic.
- Approve the final domain and replace `https://example.invalid` in `SITE_URL`, `robots.txt`, and `sitemap.xml`.
- Provide the production `FORM_ENDPOINT`, final legal text, team names, WhatsApp destination, calendar link, real prices, product photos, CIN-versus-LLPIN decision, and approved client wording.

### Later

- Lighthouse scores were not collected; Lighthouse is not configured in this static project. The browser-measured maximum same-origin payload was 781 KB, below the 2 MB page budget.
- Add any approved photos to `assets/img/photos/` and regenerate the local-photo allowlist with `scripts/update-photos.ps1`; absent slots use the designed fallback tiles.

## Phase 3 responsive page matrix

All 40 routes in `SITE_PAGES` were opened in Chromium in dark and light themes at 320, 360, 375, 390, 420, 768, 1024, and 1280 CSS pixels (640 route/theme/viewport checks).

## Check results

| Check | Coverage | Status | Detail |
|---|---|---|---|
| Console and network | 40 pages; both themes; all eight widths | PASS | 0 console errors, 0 external requests, and 0 HTTP 404s during the current matrix. |
| Layout and heading wraps | 640 variants | PASS | 0 horizontal overflow cases; all visible H1–H3 words remained on one line box; visible header CTAs stayed at least 8px inside the viewport, and the CTA was hidden below 420px. |
| SVG and fallback tiles | 640 variants | PASS | 0 inline SVG elements and 0 text nodes inside `.photo-frame__tile` fallbacks. |
| Images | All registered pages plus 48 photo-mode checks | PARTIAL | 12 copied local JPEGs (maximum width 1600px; all under 300 KB); four mismatched/broken Gear images were skipped. Source rights remain unverified; other slots use designed tiles. |
| Local links and assets | All registered pages | PASS | The current browser matrix produced no HTTP 404s. |
| Contact details | HTML, data, rendered pages, JSON-LD | PASS | Contact text and schema use `SITE_CONTACT`: +91 94231 49303, official@cvframeiq.com, Mon–Fri 9am–6pm IST, Panvel, Maharashtra, India, registration label/value retained as currently supplied pending confirmation. The phone input uses a non-numeric format hint rather than another phone number. |
| Honesty and internal notes | HTML and data files | PASS WITH REVIEW CONTENT | Live-site accuracy/latency figures, testimonials, ratings, dates, and response-time wording are visibly marked by the single review banner and need company verification. No free-trial or no-credit-card claim was added. Manager-review drafts remain visible while their `SHOW_DRAFT` flags are `true`. |
| Accessibility structure | All registered pages | PASS | The heading-word line-box check and tested fallback-tile accessibility labels passed. Reduced-motion and focus-visible rules are present in CSS. |
| SEO | Registered pages | PASS | Titles/descriptions and structured data are generated from shared site configuration; replace the `example.invalid` placeholder after domain approval. |
| Forms | Contact, Enquiry, newsletter | PASS | With the shared endpoint empty, each form presented an honest mailto fallback and a “Copy my message” option; no success state was shown. QA-only test submissions were not sent. |
| Sitemap and robots | 40 registered routes | PASS | `sitemap.xml` includes Events & Entertainment; the domain is still the `example.invalid` placeholder and needs company approval. |
| SVG removal | Project source and files | PASS | 0 `.svg` files, 0 `<svg>` markup, and 0 SVG-specific source references. The remaining CSS `url()` references are not SVG references. |
| Page weight | Not remeasured in this matrix | — | Lighthouse and page-weight audits were not run. |

## Interaction smoke checks

- Theme toggle changed the theme and persisted it after reload.
- Chatbot opened and closed.
- Mobile menu opened, wrapped focus from the last item to the first, closed on Escape, and returned focus to its trigger.
- Mega-menu close behavior was verified by dispatching an Escape keydown event; the browser harness did not consistently deliver native key presses, so perform a manual keyboard pass before launch.
- Homepage sector choice persisted across reload; Events & Entertainment produced “Book an Events & Entertainment Demo” and a Contact URL with its sector parameter.
- AI Store Quick view, two-product comparison, search query, and category hash controls worked. Research toggles and architecture details, the PCB Guardian demo sample, Contact budget/timeline/no-upload states, and the Events page/footer were checked.
- Gear rendered all six products, including the Multi-Sensor Array in Sensor Kits at INR 16,500 and Out of stock.
- No Lighthouse run was performed.

## Visible pending content

- The requested manager-review drafts remain visible on About (team placeholders), Careers, Docs, Features, Blog article, and the four legal pages while their draft flags are enabled. The legal pages show “Pending approval” and “Last updated: pending” without legal clauses.
- The Home page still displays its note that client results/testimonials await verification and that global coverage is coming soon. The chatbot states that chat is coming soon. These are disclosure/pending notes, not performance or customer claims.
- The Playground’s literal “[Placeholder: add date]” line was removed. Product data placeholders are filtered from rendered product details.

## Verification notes

- The test server was `http://127.0.0.1:8768/`.
- All 26 JavaScript files passed `node --check`.
- Sitemap XML parsed successfully and its route set matches `SITE_PAGES` (the `index.html` entry is represented by the canonical root URL `/`).

## Navigation and new-page QA · 19 Oct 2026

- A temporary Python HTTP server on `127.0.0.1:8767` served all 39 registered routes plus the existing 404 and developer style-guide pages.
- Playwright checked 246 route/theme/viewport combinations: 375px and 1280px in dark and light themes, plus 360px in both themes. There were no horizontal scroll cases, clipped H1s, inline SVG elements, console errors, failed requests, HTTP errors, or external requests. The Contact heading stayed within the viewport.
- Desktop navigation exposed all six requested groups; the Products dropdown worked. The mobile drawer exposed the same six expandable groups and its Login and Book a Demo actions. Footer groups matched the reorganized navigation; menu and search targets resolved to registered routes.
- Both calculators started with empty assumptions and disabled email actions. Sample-only inputs produced 16.7 hours and ₹8,333 for the PCB scenario, and 8.5 hours and ₹4,267 for the PPE scenario. Invalid negative input stayed blocked; print buttons invoked the browser print action. These are formula checks only, not product or savings claims.
- The Partners form prepared a mailto draft addressed to `SITE_CONTACT.email`, displayed that nothing was submitted, and provided the shared copy-message control.
- Sitemap XML and `SITE_PAGES` both contain 40 matching routes. No Lighthouse or long-running test was run.

## Phase 3A live carryover QA · 19 Oct 2026

- Read the current live Home, Sectors, Gear, AI Store, About, Contact, Blog and article pages directly in Playwright before copying content. Source page tags are attached to copied records in `assets/data/live-carryover.js`.
- Playwright checked all 40 registered pages at 320, 360, 375, 390, 420, 768, 1024 and 1280px in dark and light themes (640 combinations). There were 0 horizontal overflows, mid-word H1–H3 line wraps, inline SVG elements, text-bearing photo tiles, external requests, HTTP errors, console errors or page errors.
- Separate no-photo and Banking-only photo modes each checked Home, Sectors, Banking detail, Gear, BeejHealth and Blog at 375px and 1280px in both themes (24 checks per mode). Empty mode had only accessible text-free tiles; Banking-only mode loaded only the Banking photo on matching pages. There were no external requests, 404s, console errors or measured frame-height changes.
- Flag-off smoke checks on Home, Sectors, Banking detail, Gear and Blog confirmed that the review banner, live stats/testimonials/sector impact/response card, product ratings and copied Blog body were not rendered; carried-over local images remained tiles.
- Blog dates 2/1/2025, 1/28/2025 and 1/25/2025 precede the June 5, 2025 incorporation date shown on the live About page. They are copied verbatim and remain pending company verification.
- Skipped Gear imagery: the AI Vision Pro camera photo was unrelated circuit artwork; Industrial CV Camera image was broken; Edge AI Processor X1 image depicted a phone; Multi-Sensor Array image was a generic processor-board close-up. These slots retain designed tiles.
- JavaScript syntax checks passed. `assets/data/local-photos.js` was regenerated from the 12 remaining JPG files after temporary photo-mode checks. No temporary fixture photo remains.
- Photo source/creator/license verification and copied claims/content still need company approval. The header uses the CSS-only mark and wordmark; no live PNG logo is used. No Lighthouse run was performed.

## Phase 3C verification · 20 Oct 2026

Verification ran in Chromium against a temporary local `http.server` at `127.0.0.1:8769`. No Lighthouse run was performed.

### Navigation, branding, and interactions

- Dropdown matrix: Home, Sectors, and Contact at 1024, 1280, 1440, and 1920px; all five menu triggers on each page (60 checks). All panels stayed inside the viewport, below and clear of their trigger, and aligned within 2px to the trigger's left edge or the right edge for Company and Resources. Solutions rendered two columns with All sectors spanning the first row. No failures.
- Keyboard: Tab focus opened Solutions; Escape closed and restored focus; ArrowDown/ArrowUp, Home/End, and outside click all passed.
- Logo at 375px in dark and light themes: one header mark and one `FrameIQ` wordmark; mobile menu and footer each rendered one CSS mark and the contiguous wordmark. Frame/IQ text boundary measured 0px; IQ used the accent gradient. No logo image was used.
- Research toggle: switching Agentic CV and Traditional CV changed the comparison copy and updated the pressed state.
- Skeleton loaders: Gear initially showed 3 skeletons while busy, then 6 product cards and no skeletons; AI Store initially showed 4 skeletons while busy, then 8 product cards and no skeletons.
- Page fade: `page-fade-in` ran with reduced motion off and was absent with `animation: none` when reduced motion was enabled.
- Mobile sticky CTA at 375px: 10.4px clearance from the chat button, no overlap; CTA hid on footer approach (30 footer links remained visible) and while the Partners form was visible. Contact had no sticky CTA.
- Small grey text contrast against the themed background: dark soft 5.83:1, dark muted 9.07:1; light soft 5.02:1, light muted 7.11:1. All meet WCAG AA's 4.5:1 minimum.

### Local photo inventory and slot audit

“Shown” means the local JPG loaded in the slot; “No” means no corresponding JPG is present and the designed tile is shown. The same result was verified in both themes. For sector aliases, the file column names the canonical JPG used by the alias.

| Slot | JPG file | Dark | Light |
|---|---|---|---|
| home-hero | — (`home-hero.jpg` absent) | No | No |
| about-hero | — (`about-hero.jpg` absent) | No | No |
| beejhealth-hero | — (`beejhealth-hero.jpg` absent) | No | No |
| research-hero | — (`research-hero.jpg` absent) | No | No |
| ai-store-hero | — (`ai-store-hero.jpg` absent) | No | No |
| careers-team | — (`careers-team.jpg` absent) | No | No |
| login-bg | — (`login-bg.jpg` absent) | No | No |
| sector-banking | `sector-banking.jpg` | Yes | Yes |
| sector-aviation | `sector-aviation.jpg` | Yes | Yes |
| sector-healthcare | `sector-healthcare.jpg` | Yes | Yes |
| sector-manufacturing | `sector-manufacturing.jpg` | Yes | Yes |
| sector-security | `sector-security.jpg` | Yes | Yes |
| sector-security-surveillance (alias) | `sector-security.jpg` | Yes | Yes |
| sector-smart-city | `sector-smart-city.jpg` | Yes | Yes |
| sector-infrastructure (alias) | `sector-smart-city.jpg` | Yes | Yes |
| sector-events | `sector-events.jpg` | Yes | Yes |
| sector-events-entertainment (alias) | `sector-events.jpg` | Yes | Yes |
| sector-retail | — (`sector-retail.jpg` absent) | No | No |
| sector-agriculture | — (`sector-agriculture.jpg` absent) | No | No |
| gear-camera | — (`gear-camera.jpg` absent) | No | No |
| gear-camera-2 | — (`gear-camera-2.jpg` absent) | No | No |
| gear-board | `gear-board.jpg` | Yes | Yes |
| gear-processor | — (`gear-processor.jpg` absent) | No | No |
| gear-devboard | `gear-devboard.jpg` | Yes | Yes |
| gear-sensor | — (`gear-sensor.jpg` absent) | No | No |
| blog-traffic | `blog-traffic.jpg` | Yes | Yes |
| blog-edge-cloud | `blog-edge-cloud.jpg` | Yes | Yes |
| blog-agriculture | `blog-agriculture.jpg` | Yes | Yes |

The 12 JPG filenames in `assets/img/photos/` match the 12 canonical entries regenerated into `assets/data/local-photos.js`. The three aliases intentionally reuse the corresponding sector JPG, not a different product photo. Gear product slots are unique across all six products; the Multi-Sensor Array uses its own tile until a licensed `gear-sensor.jpg` is supplied.

### Proposal source blocker

`docs/PROPOSAL.md` was not present in the workspace or its parent frontend directory during this audit. Proposal bullets for sections 4.1–4.13, 6, and 7 therefore remain unmapped; no proposal content or bullet status was invented. Provide the file to complete that audit. Photo licensing and other factual approvals remain company inputs as already noted above.
