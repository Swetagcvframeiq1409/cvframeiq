(() => {
  'use strict';

  const carryoverImages = Array.isArray(window.LIVE_CARRYOVER?.imageAssets) ? window.LIVE_CARRYOVER.imageAssets : [];
  if (window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED === true) {
    carryoverImages.forEach((asset) => {
      const image = window.SITE_IMAGES?.[asset.slot];
      if (image) image.alt = asset.alt;
    });
  }
  const livePhotoSlots = new Set(carryoverImages.map((asset) => asset.slot));

  const FALLBACK_SELECTORS = [
    '.photo-frame__fallback',
    '.gear-product-card__fallback',
    '.blog-card__art-fallback',
    '.ba-cover__fallback',
    '.bh-hero__fallback',
    '.rs-hero__fallback',
    '.sc-image-tile__fallback',
    '.sc-detail-hero__fallback'
  ].join(',');
  const iconsReady = window.ICONS && typeof window.iconClass === 'function'
    ? Promise.resolve()
    : new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }));

  function createTile(frame, photo, icon) {
    const tile = document.createElement('span');
    tile.className = 'photo-frame__tile';
    tile.setAttribute('role', 'img');
    tile.setAttribute('aria-label', photo.alt);
    tile.innerHTML = `<i class="${window.iconClass(icon)}" aria-hidden="true"></i>`;
    frame.prepend(tile);
    return tile;
  }

  window.initPhotos = async function initPhotos(root = document) {
    await Promise.all([window.LOCAL_PHOTOS_READY, iconsReady]);
    const frames = root.matches?.('[data-photo]') ? [root] : [];
    frames.push(...root.querySelectorAll('[data-photo]'));

    frames.forEach((frame) => {
      if (frame.dataset.photoInitialized === 'true') return;
      const slot = frame.dataset.photo;
      const photo = window.SITE_IMAGES?.[slot];
      const icon = window.PHOTO_ICONS?.[slot];
      if (!photo || !icon || !window.ICONS?.[icon]) {
        console.error(`Photo data or fallback icon is unavailable for slot "${slot}".`);
        return;
      }

      frame.dataset.photoInitialized = 'true';
      frame.dataset.photoSource = 'tile';
      frame.dataset.photoSettled = 'true';
      frame.classList.add('photo-frame');
      frame.style.minHeight = '0';
      frame.style.aspectRatio = `${photo.width} / ${photo.height}`;
      frame.querySelectorAll(FALLBACK_SELECTORS).forEach((fallback) => fallback.remove());

      const tile = createTile(frame, photo, icon);
      const image = frame.querySelector('img') || document.createElement('img');
      image.alt = photo.alt;
      image.width = photo.width;
      image.height = photo.height;
      image.loading = frame.dataset.photoLoading === 'eager' ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.style.objectFit = 'cover';
      image.hidden = true;
      if (!image.parentElement) frame.append(image);

      const localPhotos = Array.isArray(window.LOCAL_PHOTOS) ? window.LOCAL_PHOTOS : [];
      const localSlot = photo.localSlot || slot;
      const localAvailable = localPhotos.includes(localSlot)
        && (!livePhotoSlots.has(localSlot) || window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED === true);
      const remoteEnabled = window.IMAGE_CONFIG?.USE_TEMP_REMOTE === true;

      const trySource = (source) => new Promise((resolve) => {
        const handleLoad = () => {
          image.removeEventListener('load', handleLoad);
          image.removeEventListener('error', handleError);
          image.hidden = false;
          tile.hidden = true;
          frame.dataset.photoSource = source;
          frame.dataset.photoSettled = 'true';
          frame.classList.add('has-photo');
          resolve(true);
        };
        const handleError = () => {
          image.removeEventListener('load', handleLoad);
          image.removeEventListener('error', handleError);
          image.removeAttribute('src');
          resolve(false);
        };
        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);
        image.src = window.getImage(slot, source);
      });

      (async () => {
        if (localAvailable && await trySource('local')) return;
        if (remoteEnabled) {
          if (await trySource('temp')) return;
          if (await trySource('picsum')) return;
        }
        image.removeAttribute('src');
        image.hidden = true;
        tile.hidden = false;
        frame.classList.remove('has-photo');
        frame.dataset.photoSource = 'tile';
        frame.dataset.photoSettled = 'true';
      })();
    });
  };

  window.initPhotos();
})();
