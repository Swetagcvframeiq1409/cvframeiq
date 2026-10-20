# Proposal audit

## Source status

The requested source, `docs/PROPOSAL.md`, is not present in the workspace. The section and bullet text for 4.1–4.13, 6, and 7 therefore cannot be read or matched to implementation without inventing requirements. Each requested section is recorded below as **Needs company input** until the proposal text is supplied.

| Proposal section | Status | Implementing file |
|---|---|---|
| 4.1 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.2 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.3 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.4 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.5 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.6 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.7 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.8 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.9 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.10 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.11 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.12 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 4.13 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 6 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |
| 7 | Needs company input — source text unavailable | `docs/PROPOSAL.md` (not present; no mapping possible) |

## Phase 3B implementation checks

The rows below record the independently verifiable Phase 3B work in this request; they are not substituted for the missing proposal bullets.

| Requirement | Status | Implementing file(s) |
|---|---|---|
| Header, mobile drawer, and footer use the CSS camera-frame mark and `FrameIQ` wordmark; no live PNG logo is used | Done | `assets/js/components.js`, `assets/css/components.css`, `README.md`; removed live PNG asset |
| Desktop dropdowns are positioned relative to each nav item, align left by default, right-align Resources and Company, and remeasure overflow after resize/font load | Done | `assets/js/components.js`, `assets/js/main.js`, `assets/css/components.css` |
| Solutions dropdown is two columns with All sectors spanning the top row; Escape, outside click, focus, and keyboard navigation are supported | Done | `assets/js/components.js`, `assets/js/main.js`, `assets/css/components.css` |
| Research Agentic CV / Traditional CV toggle changes comparison content | Done | `assets/js/pages/research.js` |
| Sticky CTA hides near footer and while mobile forms are visible | Done | `assets/js/components.js`, `assets/css/components.css` |
| Gear and AI Store initial skeletons, reduced-motion-aware page fade, and small muted text contrast | Done | `pages/gear.html`, `pages/ai-store.html`, `assets/js/main.js`, `assets/css/components.css`, `assets/css/tokens.css` |
| Sector photo slots reflect Infrastructure, Security & Surveillance, and Events & Entertainment while resolving to their existing local photo files | Done | `assets/data/sectors.js`, `assets/data/images.js`, `assets/js/photos.js`, `assets/data/local-photos.js` |
| Product photo slots are unique; the Multi-Sensor Array does not reuse the Jetson board image | Done | `assets/data/hardware.js`, `assets/data/images.js` |

## Missing and Partial items

### Missing

- None identified in the verifiable Phase 3B requirements.

### Partial

- The proposal-specific audit is blocked: `docs/PROPOSAL.md` was not found, so bullets and implementing files for sections 4.1–4.13, 6, and 7 remain unmapped.

## Needs company input

- Supply the exact `docs/PROPOSAL.md` text to complete the bullet-by-bullet audit.
- Confirm company registration wording and claims, photo source/licensing, and remaining factual or production data called out in `docs/QA-REPORT.md`.
