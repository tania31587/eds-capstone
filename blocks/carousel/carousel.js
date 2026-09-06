function createControl(direction, onClick) {
  const button = document.createElement('button');
  button.className = `carousel-control carousel-${direction}`;
  button.type = 'button';
  button.setAttribute('aria-label', `${direction === 'previous' ? 'Previous' : 'Next'} slide`);
  button.textContent = direction === 'previous' ? '‹' : '›';
  button.addEventListener('click', onClick);
  return button;
}

export default function decorate(block) {
  const rows = [...block.children];
  const carousel = document.createElement('div');
  carousel.className = 'carousel-layout';
  carousel.setAttribute('aria-roledescription', 'carousel');
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  const track = document.createElement('div');
  track.className = 'carousel-track';
  const pagination = document.createElement('div');
  pagination.className = 'carousel-pagination';
  pagination.setAttribute('aria-label', 'Choose slide');
  let activeIndex = 0;

  const slides = rows.map((row, index) => {
    const cells = [...row.children];
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${rows.length}`);
    const picture = row.querySelector('picture');
    if (picture) {
      const media = document.createElement('div');
      media.className = 'carousel-media';
      media.append(picture);
      slide.append(media);
    }

    const content = document.createElement('div');
    content.className = 'carousel-content';
    const title = cells[1]?.querySelector('h1, h2, h3, h4, h5, h6') || cells[1]?.firstElementChild;
    const description = cells[2]?.querySelector('p') || cells[2]?.firstElementChild;
    const link = cells[3]?.querySelector('a') || row.querySelector('a');
    if (title) content.append(title);
    if (description) content.append(description);
    if (link) {
      link.classList.add('carousel-cta');
      content.append(link);
    }
    slide.append(content);
    return slide;
  });

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex)));
    [...pagination.children].forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === activeIndex));
    });
  }

  slides.forEach((slide, index) => {
    track.append(slide);
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    pagination.append(dot);
  });

  viewport.append(track);
  carousel.append(viewport);
  if (slides.length > 1) {
    carousel.append(
      createControl('previous', () => showSlide(activeIndex - 1)),
      createControl('next', () => showSlide(activeIndex + 1)),
      pagination,
    );
  }
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
    if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
  });
  carousel.tabIndex = 0;
  block.replaceChildren(carousel);
  showSlide(0);
}
