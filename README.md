# FrameIQ website

This is the static rebuild of cvframeiq.com. It's plain HTML, CSS and JavaScript. There's no build step, no framework and no backend, so you can open it, edit it and host it anywhere.

It's currently a review build. A few things on it are placeholders or carried over from the old site and still need the company's confirmation. They're listed at the bottom.

## Running it

The easiest way is VS Code with the Live Server extension: right-click `index.html` and choose "Open with Live Server".

If you don't use VS Code, run `python -m http.server 8000` in this folder and open http://localhost:8000.

Opening `index.html` straight from the file system mostly works, but the browser blocks the photo list, so every photo shows as an icon tile.

## What's where

- `index.html` is the home page.
- `pages/` has every other page. `pages/sectors/` has one page per sector.
- `404.html` is the not-found page.
- `assets/css/` holds the styles. `tokens.css` has the colours, fonts and spacing, and `pages/` has the page-specific files.
- `assets/js/` holds the scripts. `components.js` draws the shared header, footer and chat button. `main.js` handles the theme, menus and small effects. Page scripts are in `pages/`.
- `assets/data/` holds the content the pages read from, such as sectors, products, hardware, blog posts and the site settings in `site-data.js`.
- `assets/fonts/` has the self-hosted fonts and icon font.
- `assets/img/photos/` has the local photos.
- `scripts/update-photos.ps1` refreshes the photo list (see below).
- `sitemap.xml`, `robots.txt` and `site.webmanifest` are the usual SEO files.

## Design rules we're following

- No SVG files or inline SVG anywhere. Icons come from the bundled Bootstrap Icons font.
- No text written over photos.
- The logo is a temporary text wordmark made in CSS. There's no favicon on purpose.
- No cookie banner.
- Both a dark and a light theme, from 320px up to wide desktop screens.

## Motion

- `assets/css/motion.css` contains motion styles; `assets/js/motion.js` adds reveal behavior and page transitions.
- Motion timing and easing tokens are in `assets/css/tokens.css`: `--ease-*`, `--dur-*`, `--duration-*`, `--transition-*` and `--stagger`.
- Add `data-reveal` to an element to reveal it as it enters the viewport. Remove the `js-motion` class from the `<html>` element to disable the motion styles and keep content visible.

## Photos

Photos live in `assets/img/photos/`. Each file is named after a slot in `assets/data/images.js`, for example `sector-banking.jpg`. Use JPGs around 1600 x 900 and keep them under 300 KB.

After adding or removing a photo, run this from the project folder:

`powershell -ExecutionPolicy Bypass -File scripts\update-photos.ps1`

Then hard-refresh the browser with Ctrl+F5. The script writes `assets/data/local-photos.js`, which lists the photos that exist. A slot with no photo shows a plain icon tile, so nothing breaks.

### Photo credits

Fill this in before launch. Every photo needs its source and licence on record.

| File | Source link | Photographer | Licence |
|---|---|---|---|
| gear-devboard.jpg | to add | to add | to add |
| sector-aviation.jpg | to add | to add | to add |
| sector-banking.jpg | to add | to add | to add |
| sector-events.jpg | to add | to add | to add |
| sector-healthcare.jpg | to add | to add | to add |
| sector-manufacturing.jpg | to add | to add | to add |
| sector-security.jpg | to add | to add | to add |
| sector-smart-city.jpg | to add | to add | to add |

Update this table whenever the photo folder changes. Slots without a photo yet: home, about, BeejHealth, research, AI Store, careers and login heroes, retail, agriculture, and the camera, processor and sensor products on Gear.

## Settings you can flip

- `SITE_URL`, `SITE_CONTACT` (phone, email, address, hours, registration) and `FORM_ENDPOINT` are in `assets/data/site-data.js`.
- `FORM_ENDPOINT` is empty for now, so forms open an email draft and offer a "copy my message" button instead of sending anything. Put the real form endpoint there when the company has one.
- `SHOW_UNCONFIRMED` in `assets/data/live-carryover.js` shows or hides the content carried over from the old site (figures, testimonials, ratings, blog posts, hours). `SHOW_REVIEW_BANNER` in the same file shows a note about that content. It's off.
- `SHOW_DRAFT` in `assets/data/company-data.js` and `assets/data/legal.js` shows the draft sections and the "pending approval" legal pages.
- `USE_TEMP_REMOTE` in `assets/data/images.js` stays `false`. All photos are local.

## Before launch

- Replace the placeholder domain (`example.invalid`) in `site-data.js`, `robots.txt` and `sitemap.xml` once the final address is agreed.
- Check every item carried over from the old site with the company. This covers the accuracy and speed figures, testimonials, star ratings, the "within 24 hours" reply promise, opening hours, registration details and the three blog posts. The blog dates (January and February 2025) are earlier than the incorporation date on the old About page (5 June 2025), so someone needs to confirm them.
- Turn off `SHOW_UNCONFIRMED` and `SHOW_DRAFT` unless the company has approved the content they control.
- Fill in the photo credit table above and replace any photo we can't clear.
- Replace the temporary logo if the company supplies final brand assets. Add a social preview image if one is provided.

## Still needed from the company

- Team names and roles
- Final legal text (privacy, terms, security, cookies)
- The form endpoint, WhatsApp number and calendar booking link
- Product prices and approved product photos
- Whether the registration number should read CIN or LLPIN
- Scope, availability and pricing for PCB Guardian, PPE Safety and AutoLabel
- Approved wording for clients, press boilerplate and brand assets
- Approval for the Responsible AI, partner and reseller wording
