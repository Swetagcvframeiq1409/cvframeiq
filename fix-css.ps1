$heroCSS = @'

/* ── NEW HERO (redesign) ── */

/* layout */
.home-hero {
  position: relative;
  min-height: calc(100svh - var(--header-h, 74px));
  padding-top: clamp(64px, 8vw, 96px);
  padding-bottom: 0;
  overflow: hidden;
  background: #08090d;
  /* faint dotted grid */
  background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* two-col grid */
.home-hero__grid {
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: 56px;
  align-items: center;
  min-height: 640px;
  padding-bottom: clamp(48px, 6vw, 80px);
}

/* glow orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: heroOrbDrift 14s ease-in-out infinite alternate;
}
.hero-orb--a {
  width: 520px; height: 520px;
  top: -120px; left: -80px;
  background: radial-gradient(circle, rgba(101,66,200,.28), transparent 70%);
  animation-duration: 16s;
}
.hero-orb--b {
  width: 400px; height: 400px;
  bottom: 60px; right: -60px;
  background: radial-gradient(circle, rgba(101,66,200,.18), transparent 70%);
  animation-duration: 20s;
  animation-direction: alternate-reverse;
}
@keyframes heroOrbDrift {
  from { transform: translate(0, 0); }
  to   { transform: translate(40px, 30px); }
}

/* eyebrow pill */
.hero-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border: 1px solid rgba(101,66,200,.45);
  border-radius: 999px;
  background: rgba(101,66,200,.1);
  color: #c5b5ff;
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

/* pulsing dot */
.hero-eyebrow-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #a78bfa;
  box-shadow: 0 0 0 0 rgba(167,139,250,.6);
  animation: heroDotPulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes heroDotPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,.6); }
  50%      { box-shadow: 0 0 0 6px rgba(167,139,250,0); }
}

/* headline */
.hero-headline {
  margin: 0 0 20px;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(2.75rem, 5.2vw, 5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -.02em;
}
.hero-line { display: block; }
.hero-line--accent {
  background: linear-gradient(110deg, #c5b5ff 10%, #6542c8 80%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* subtitle */
.hero-subtitle {
  font-size: 18px;
  color: rgba(255,255,255,.72);
  line-height: 1.65;
  max-width: 56ch;
  margin: 0 0 24px;
}

/* chips — reuse existing .home-chips */

/* buttons */
.home-button--primary {
  background: #6542c8;
  color: #fff;
  min-height: 48px;
  padding: 0 10px 0 20px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: .92rem;
  text-decoration: none;
  transition: background .22s ease, box-shadow .22s ease;
}
.home-button--primary:hover {
  background: #7a56d8;
  box-shadow: 0 8px 28px rgba(101,66,200,.38);
}
.home-button--primary .home-arrow-square { background: rgba(255,255,255,.18); color: #fff; }

/* outline button — keep existing .home-button--outline, just add icon gap */
.home-button--outline {
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: .92rem;
}

/* stats strip */
.hero-stats {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  margin-top: 28px;
  padding: 20px 28px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 18px;
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.hero-stats__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}
.hero-stats__item strong {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 700;
  color: #fff;
  line-height: 1;
  white-space: nowrap;
}
.hero-stat-suffix {
  background: linear-gradient(110deg, #a78bfa, #6542c8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-stat-prefix { color: #fff; }
.hero-stats__item > span:last-child {
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(255,255,255,.55);
}
.hero-stats__divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,.12);
  margin: 0 8px;
}

/* caption */
.hero-caption {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(255,255,255,.38);
}

/* image stack */
.hero-img-stack {
  position: relative;
  /* tilt origin */
  transform-style: preserve-3d;
  will-change: transform;
}
.hero-img-main {
  display: block;
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 0 60px rgba(101,66,200,.35), 0 24px 60px rgba(0,0,0,.4);
}
.hero-img-secondary {
  position: absolute;
  bottom: -10%;
  left: -8%;
  width: 45%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 12px 36px rgba(0,0,0,.45);
}

/* corner brackets on image stack */
.hero-bracket {
  position: absolute;
  width: 22px; height: 22px;
  border-color: rgba(167,139,250,.7);
  border-style: solid;
  pointer-events: none;
  z-index: 2;
}
.hero-bracket--tl { top: 12px;  left: 12px;  border-width: 2px 0 0 2px; }
.hero-bracket--tr { top: 12px;  right: 12px; border-width: 2px 2px 0 0; }
.hero-bracket--bl { bottom: 12px; left: 12px;  border-width: 0 0 2px 2px; }
.hero-bracket--br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }

/* marquee label */
.hero-marquee-label {
  text-align: center;
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,.38);
  margin: 0 0 10px;
}

/* marquee edge fades */
.home-marquee {
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

/* entrance animation — only when JS adds hero-js-ready to section */
.home-hero.hero-js-ready .hero-reveal {
  opacity: 0;
  transform: translateY(24px);
  animation: heroReveal .7s cubic-bezier(.22,1,.36,1) forwards;
  animation-delay: calc(var(--ri, 0) * 80ms);
}
@keyframes heroReveal {
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .home-hero.hero-js-ready .hero-reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .hero-orb { animation: none; }
  .hero-eyebrow-dot { animation: none; }
}

/* ── DESKTOP ≥1100px ── */
@media (min-width: 1100px) {
  .home-hero__grid { grid-template-columns: 55fr 45fr; }
}

/* ── TABLET 768–1099px ── */
@media (max-width: 1099px) {
  .home-hero__grid { grid-template-columns: 1fr 1fr; gap: 40px; }
  .hero-headline { font-size: clamp(2.4rem, 4.5vw, 3.5rem); }
}

/* ── MOBILE <768px ── */
@media (max-width: 767px) {
  .home-hero { padding-top: 48px; }
  .home-hero__grid {
    grid-template-columns: 1fr;
    gap: 0;
    min-height: auto;
    padding-bottom: 0;
    text-align: center;
  }
  .hero-eyebrow-pill { justify-content: center; width: 100%; }
  .hero-headline { font-size: clamp(2.25rem, 10vw, 3rem); }
  .hero-subtitle { font-size: 16px; max-width: 100%; }
  .home-chips { justify-content: center; }
  .home-actions {
    flex-direction: column;
    gap: 10px;
  }
  .home-actions .home-button {
    width: 100%;
    min-height: 52px;
    justify-content: center;
  }
  /* stats: 2x2 grid */
  .hero-stats {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 0;
    padding: 16px;
    margin-top: 24px;
  }
  .hero-stats__divider:nth-child(2) { display: none; } /* hide col dividers */
  .hero-stats__divider:nth-child(4) { display: none; }
  .hero-stats__divider:nth-child(6) {
    /* horizontal divider between rows */
    grid-column: 1 / -1;
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }
  .hero-stats__item { padding: 8px 4px; }
  .hero-caption { text-align: center; }
  /* image stack: main only, 16/10, below copy */
  .hero-img-stack {
    margin-top: 32px;
    margin-bottom: 0;
  }
  .hero-img-main { aspect-ratio: 16/10; border-radius: 16px; }
  .hero-img-secondary { display: none; }
  .hero-bracket { display: none; }
}

/* no horizontal scroll at 320px */
@media (max-width: 480px) {
  .frameiq-home .home-container { width: calc(100% - 32px); }
  .hero-stats { padding: 12px 8px; }
}

/* ── REMOVE old vision frame rules (kept for safety, override to none) ── */
.home-vision { display: none !important; }
'@

$cssFile = 'd:\CVFrameIQ\Frontend-UI\FrameIQ-Frontend\frameiq-site\assets\css\home.css'
$existing = Get-Content $cssFile -Raw -Encoding UTF8

# Strip old hero/vision/metrics CSS blocks by removing from "/* ── Hero ──" to end of metrics block
# We'll append the new block and add a suppression for old metrics band
$append = "`n`n/* ── OLD METRICS BAND suppressed — stats now in hero ── */`n.home-metrics-band { display: none !important; }`n" + $heroCSS

Add-Content $cssFile $append -Encoding UTF8
Write-Host "CSS appended OK"
