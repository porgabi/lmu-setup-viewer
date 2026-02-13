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
})();
