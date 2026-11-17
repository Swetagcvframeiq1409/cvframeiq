(function(){
  var section = document.getElementById('about-www');
  if (!section) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = matchMedia('(pointer: fine)');
  var hoverHover = matchMedia('(hover: hover)');
  var hoverNone = matchMedia('(hover: none)');
  var pointerCoarse = matchMedia('(pointer: coarse)');
  var ticking = false;
  var follower = null;
  var followerX = 0, followerY = 0;
  var targetX = 0, targetY = 0;
  var followerHost = section.querySelector('.about-www__stage');

  // The pointer follower is a desktop-only, fine-pointer affordance. It must
  // never be created on touch or narrow viewports, and must be removed when the
  // viewport is resized below 768px (recreated when it grows back above it).
  function shouldFollow() {
    return finePointer.matches && hoverHover.matches && !reduce.matches &&
      !hoverNone.matches && !pointerCoarse.matches &&
      !(navigator.maxTouchPoints > 0) && window.innerWidth >= 768;
  }
  function removeFollower() {
    if (follower && follower.parentNode) follower.parentNode.removeChild(follower);
    follower = null;
  }
  function syncFollower() {
    if (shouldFollow()) {
      if (!follower && followerHost) {
        follower = document.createElement('div');
        follower.className = 'about-www__follower';
        follower.setAttribute('aria-hidden', 'true');
        followerHost.appendChild(follower);
      }
    } else {
      removeFollower();
    }
  }
  syncFollower();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

  function update() {
    ticking = false;
    if (reduce.matches) return;

    var hh = 76; // header height in px
    var stage = section.querySelector('.about-www__stage');
    var pinHeight = stage ? stage.offsetHeight : window.innerHeight - hh;
    var run = section.offsetHeight - pinHeight;
    var rect = section.getBoundingClientRect();
    var p = clamp((hh - rect.top) / run, 0, 1);

    // Update CSS custom property for progress-driven CSS
    section.style.setProperty('--p', p.toFixed(4));

    // Phase mapping per spec
    // 0.00-0.20: orb idle, rings pulse
    // 0.20-0.38: orb scale 1→1.4, saturate 1→0.35, brightness 1→0.55, eye turns grey, rings expand+fade
    // 0.38-0.50: orb fades to 0, circles fade in
    // 0.50-0.62: orb gone, circles visible, text fades in together
    // 0.62-0.78: hold
    // 0.78-1.00: stack translates up, next section enters

    // Orb scale: 1 → 1.4 at p=0.2-0.38, then fade
    var discScale = 1;
    var discFilter = 'saturate(1) brightness(1)';
    var discOpacity = 1;
    var eyeBg = '#fff';

    if (p > 0.20) {
      var t = clamp((p - 0.20) / 0.18, 0, 1);
      var eased = easeOutCubic(t);
      discScale = lerp(1, 1.4, eased);
      discFilter = 'saturate(' + lerp(1, 0.35, eased) + ') brightness(' + lerp(1, 0.55, eased) + ')';
      eyeBg = lerpColor('#fff', '#9a9aa6', eased);
    }
    if (p > 0.38) {
      var t = clamp((p - 0.38) / 0.12, 0, 1);
      discOpacity = 1 - t;
      discScale = lerp(1.4, 1.5, t);
    }

    // Rings: expand and fade 0.20-0.50
    var ringScale = 1;
    var ringOpacity = 1;
    if (p > 0.20) {
      var t = clamp((p - 0.20) / 0.30, 0, 1);
      ringScale = lerp(1, 2.2, t);
      ringOpacity = 1 - t;
    }

    // Circles: fade in 0.38-0.50, then hold
    var circOpacity = 0;
    var circY = 0;
    if (p > 0.38) {
      var t = clamp((p - 0.38) / 0.12, 0, 1);
      circOpacity = t;
    }
    if (p > 0.78) {
      var t = clamp((p - 0.78) / 0.22, 0, 1);
      circY = -t * 120; // translate up
    }

    // Text: fade in 0.50-0.62
    var textOpacity = 0;
    if (p > 0.50) {
      var t = clamp((p - 0.50) / 0.12, 0, 1);
      textOpacity = t;
    }

    // Apply via CSS custom properties
    section.style.setProperty('--disc-s', discScale.toFixed(3));
    section.style.setProperty('--disc-filter', discFilter);
    section.style.setProperty('--disc-o', discOpacity.toFixed(3));
    section.style.setProperty('--eye-bg', eyeBg);
    section.style.setProperty('--ring-s', ringScale.toFixed(3));
    section.style.setProperty('--ring-o', ringOpacity.toFixed(3));
    section.style.setProperty('--circ-o', circOpacity.toFixed(3));
    section.style.setProperty('--circ-y', circY.toFixed(1) + 'px');
    section.style.setProperty('--text-o', textOpacity.toFixed(3));

    // Pointer follower
    if (follower) {
      var stageRect = stage.getBoundingClientRect();
      var relX = targetX - stageRect.left - stageRect.width / 2;
      var relY = targetY - stageRect.top - stageRect.height / 2;
      var maxR = Math.min(stageRect.width, stageRect.height) / 2 - 40;
      var dist = Math.hypot(relX, relY);
      if (dist > maxR) { relX = relX / dist * maxR; relY = relY / dist * maxR; }
      followerX = lerp(followerX, relX, 0.15);
      followerY = lerp(followerY, relY, 0.15);
      follower.style.transform = 'translate(' + (stageRect.width/2 + followerX - 11) + 'px, ' + (stageRect.height/2 + followerY - 11) + 'px)';
    }

    // Schedule next frame if needed
    if (p > 0 && p < 1) req();
  }

  function lerpColor(a, b, t) {
    var ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
    var br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
    var r = Math.round(ar + (br - ar) * t).toString(16).padStart(2,'0');
    var g = Math.round(ag + (bg - ag) * t).toString(16).padStart(2,'0');
    var b_ = Math.round(ab + (bb - ab) * t).toString(16).padStart(2,'0');
    return '#' + r + g + b_;
  }

  function onMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
  }

  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { syncFollower(); req(); }, { passive: true });
  addEventListener('mousemove', onMouseMove, { passive: true });
  addEventListener('pageshow', function () { syncFollower(); req(); });
  if (finePointer.addEventListener) finePointer.addEventListener('change', syncFollower);
  if (hoverHover.addEventListener) hoverHover.addEventListener('change', syncFollower);

  // Initial
  update();
})();