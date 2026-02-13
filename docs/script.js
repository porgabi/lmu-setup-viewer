(() => {
  const previewCarousel = document.getElementById('preview-carousel');
  const previewPrev = document.getElementById('preview-prev');
  const previewNext = document.getElementById('preview-next');

  const updatePreviewNavState = () => {
    if (!previewCarousel || !previewPrev || !previewNext) return;
    const maxScrollLeft = Math.max(0, previewCarousel.scrollWidth - previewCarousel.clientWidth);
    previewPrev.disabled = previewCarousel.scrollLeft <= 4;
    previewNext.disabled = previewCarousel.scrollLeft >= maxScrollLeft - 4;
  };

  const scrollPreview = (direction) => {
    if (!previewCarousel) return;
    const amount = Math.max(220, Math.round(previewCarousel.clientWidth * 0.72));
    previewCarousel.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  if (previewCarousel && previewPrev && previewNext) {
    previewPrev.addEventListener('click', () => scrollPreview(-1));
    previewNext.addEventListener('click', () => scrollPreview(1));
    previewCarousel.addEventListener('scroll', updatePreviewNavState, { passive: true });
    window.addEventListener('resize', updatePreviewNavState);
    updatePreviewNavState();
  }

  const scrollTopButton = document.getElementById('scroll-top-button');
  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const shotButtons = Array.from(document.querySelectorAll('.shot-button'));
  const lightbox = document.getElementById('preview-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxStrip = document.getElementById('lightbox-strip');
  const prevButton = document.getElementById('lightbox-prev');
  const nextButton = document.getElementById('lightbox-next');
  const closeButtons = Array.from(document.querySelectorAll('[data-lightbox-close]'));

  if (!shotButtons.length || !lightbox || !lightboxImage || !lightboxStrip || !prevButton || !nextButton) {
    return;
  }

  const shots = shotButtons.map((button) => {
    const image = button.querySelector('img');
    return {
      src: image?.getAttribute('src') || '',
      alt: image?.getAttribute('alt') || 'LMU Setup Viewer screenshot',
    };
  });

  let activeIndex = 0;
  let wheelCooldown = false;
  const thumbButtons = [];

  const setActiveThumb = (index) => {
    thumbButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === index);
    });
    const activeThumb = thumbButtons[index];
    activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const renderShot = (index) => {
    const normalizedIndex = (index + shots.length) % shots.length;
    activeIndex = normalizedIndex;
    lightboxImage.src = shots[normalizedIndex].src;
    lightboxImage.alt = shots[normalizedIndex].alt;
    setActiveThumb(normalizedIndex);
  };

  const openLightbox = (index) => {
    renderShot(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const stepShot = (step) => {
    renderShot(activeIndex + step);
  };

  shots.forEach((shot, index) => {
    const thumbButton = document.createElement('button');
    thumbButton.type = 'button';
    thumbButton.className = 'lightbox-thumb';
    thumbButton.setAttribute('aria-label', `Show screenshot ${index + 1}`);
    const thumbImage = document.createElement('img');
    thumbImage.src = shot.src;
    thumbImage.alt = shot.alt;
    thumbImage.loading = 'lazy';
    thumbButton.appendChild(thumbImage);
    thumbButton.addEventListener('click', () => renderShot(index));
    lightboxStrip.appendChild(thumbButton);
    thumbButtons.push(thumbButton);
  });

  shotButtons.forEach((button, index) => {
    button.addEventListener('click', () => openLightbox(index));
  });

  prevButton.addEventListener('click', () => stepShot(-1));
  nextButton.addEventListener('click', () => stepShot(1));
  closeButtons.forEach((button) => button.addEventListener('click', closeLightbox));

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (event.key === 'ArrowLeft') {
      stepShot(-1);
    }
    if (event.key === 'ArrowRight') {
      stepShot(1);
    }
  });

  lightbox.addEventListener(
    'wheel',
    (event) => {
      if (lightbox.hidden) return;
      event.preventDefault();
      if (wheelCooldown) return;
      wheelCooldown = true;
      setTimeout(() => {
        wheelCooldown = false;
      }, 180);
      if (event.deltaY > 0) {
        stepShot(1);
      } else if (event.deltaY < 0) {
        stepShot(-1);
      }
    },
    { passive: false }
  );

  const spotlightButtons = Array.from(document.querySelectorAll('.spotlight-button'));
  const spotlightLightbox = document.getElementById('spotlight-lightbox');
  const spotlightLightboxVideo = document.getElementById('spotlight-lightbox-video');
  const spotlightLightboxStrip = document.getElementById('spotlight-lightbox-strip');
  const spotlightLightboxTitle = document.getElementById('spotlight-lightbox-title');
  const spotlightLightboxCaption = document.getElementById('spotlight-lightbox-caption');
  const spotlightPrevButton = document.getElementById('spotlight-lightbox-prev');
  const spotlightNextButton = document.getElementById('spotlight-lightbox-next');
  const spotlightCloseButtons = Array.from(document.querySelectorAll('[data-spotlight-lightbox-close]'));

  if (
    !spotlightButtons.length ||
    !spotlightLightbox ||
    !spotlightLightboxVideo ||
    !spotlightLightboxStrip ||
    !spotlightLightboxTitle ||
    !spotlightLightboxCaption ||
    !spotlightPrevButton ||
    !spotlightNextButton
  ) {
    return;
  }

  const spotlightItems = spotlightButtons.map((button, index) => {
    const video = button.querySelector('video');
    const card = button.closest('.spotlight-card');
    const title = card?.querySelector('h3')?.textContent?.trim() || `Spotlight ${index + 1}`;
    const caption = card?.querySelector('p')?.textContent?.trim() || '';
    return {
      src: video?.getAttribute('src') || '',
      label: button.getAttribute('aria-label') || `Spotlight video ${index + 1}`,
      title,
      caption,
    };
  });

  let spotlightActiveIndex = 0;
  let spotlightWheelCooldown = false;
  const spotlightThumbButtons = [];

  const setActiveSpotlightThumb = (index) => {
    spotlightThumbButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === index);
    });
    const activeThumb = spotlightThumbButtons[index];
    activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const renderSpotlight = (index) => {
    const normalizedIndex = (index + spotlightItems.length) % spotlightItems.length;
    spotlightActiveIndex = normalizedIndex;
    const spotlightItem = spotlightItems[normalizedIndex];
    if (spotlightLightboxVideo.getAttribute('src') !== spotlightItem.src) {
      spotlightLightboxVideo.setAttribute('src', spotlightItem.src);
    }
    spotlightLightboxVideo.setAttribute('aria-label', spotlightItem.label);
    spotlightLightboxTitle.textContent = spotlightItem.title;
    spotlightLightboxCaption.textContent = spotlightItem.caption;
    setActiveSpotlightThumb(normalizedIndex);
    const playPromise = spotlightLightboxVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  const openSpotlightLightbox = (index) => {
    renderSpotlight(index);
    spotlightLightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeSpotlightLightbox = () => {
    spotlightLightbox.hidden = true;
    spotlightLightboxVideo.pause();
    document.body.style.overflow = '';
  };

  const stepSpotlight = (step) => {
    renderSpotlight(spotlightActiveIndex + step);
  };

  spotlightItems.forEach((spotlightItem, index) => {
    const thumbButton = document.createElement('button');
    thumbButton.type = 'button';
    thumbButton.className = 'lightbox-thumb';
    thumbButton.setAttribute('aria-label', `Show spotlight video ${index + 1}`);

    const thumbVideo = document.createElement('video');
    thumbVideo.src = spotlightItem.src;
    thumbVideo.muted = true;
    thumbVideo.loop = true;
    thumbVideo.playsInline = true;
    thumbVideo.preload = 'metadata';
    thumbVideo.setAttribute('aria-hidden', 'true');

    thumbButton.appendChild(thumbVideo);
    thumbButton.addEventListener('click', () => renderSpotlight(index));
    spotlightLightboxStrip.appendChild(thumbButton);
    spotlightThumbButtons.push(thumbButton);
  });

  spotlightButtons.forEach((button, index) => {
    button.addEventListener('click', () => openSpotlightLightbox(index));
  });

  spotlightPrevButton.addEventListener('click', () => stepSpotlight(-1));
  spotlightNextButton.addEventListener('click', () => stepSpotlight(1));
  spotlightCloseButtons.forEach((button) => button.addEventListener('click', closeSpotlightLightbox));

  document.addEventListener('keydown', (event) => {
    if (spotlightLightbox.hidden) return;
    if (event.key === 'Escape') {
      closeSpotlightLightbox();
      return;
    }
    if (event.key === 'ArrowLeft') {
      stepSpotlight(-1);
    }
    if (event.key === 'ArrowRight') {
      stepSpotlight(1);
    }
  });

  spotlightLightbox.addEventListener(
    'wheel',
    (event) => {
      if (spotlightLightbox.hidden) return;
      event.preventDefault();
      if (spotlightWheelCooldown) return;
      spotlightWheelCooldown = true;
      setTimeout(() => {
        spotlightWheelCooldown = false;
      }, 180);
      if (event.deltaY > 0) {
        stepSpotlight(1);
      } else if (event.deltaY < 0) {
        stepSpotlight(-1);
      }
    },
    { passive: false }
  );
})();
