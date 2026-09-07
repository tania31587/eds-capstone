import createCardAddButton from '../../scripts/product-card.js';

function createControl(direction, onClick) {
  const button = document.createElement('button');
  button.className = `product-carousel-control product-carousel-${direction}`;
  button.type = 'button';
  button.setAttribute('aria-label', `${direction === 'previous' ? 'Previous' : 'Next'} products`);
  button.textContent = direction === 'previous' ? '‹' : '›';
  button.addEventListener('click', onClick);
  return button;
}

export default function decorate(block) {
  const viewport = document.createElement('div');
  viewport.className = 'product-carousel-viewport';
  const track = document.createElement('div');
  track.className = 'product-carousel-track';
  const scrollProducts = (direction) => {
    const card = track.querySelector('.product-carousel-card');
    const amount = card ? card.getBoundingClientRect().width + 24 : viewport.clientWidth;
    const maximum = viewport.scrollWidth - viewport.clientWidth;
    const left = Math.max(0, Math.min(maximum, viewport.scrollLeft + (direction * amount)));
    viewport.scrollLeft = left;
  };
  const previous = createControl('previous', () => scrollProducts(-1));
  const next = createControl('next', () => scrollProducts(1));
  const updateControls = () => {
    previous.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft + viewport.clientWidth >= track.scrollWidth - 1;
  };

  [...block.children].forEach((row) => {
    const card = document.createElement('article');
    card.className = 'product-carousel-card';
    const picture = row.querySelector('picture');
    if (picture) {
      const media = document.createElement('div');
      media.className = 'product-carousel-media';
      media.append(picture);
      card.append(media);
    }
    const content = document.createElement('div');
    content.className = 'product-carousel-content';
    [...row.children].forEach((cell) => {
      [...cell.children].forEach((element) => content.append(element));
    });
    const link = content.querySelector('a');
    if (link) {
      const productName = content.querySelector('h2, h3, h4')?.textContent.trim() || 'Product';
      const price = [...content.querySelectorAll('p')].find((paragraph) => /^(₹|\$|€|£)\s?\d/.test(paragraph.textContent.trim()));
      const actions = document.createElement('div');
      actions.className = 'product-carousel-actions';
      actions.append(link, createCardAddButton({
        name: productName,
        price: price?.textContent.trim() || 0,
        image: picture?.querySelector('img')?.src,
        productUrl: link.href,
      }, 'product-carousel-add-to-cart'));
      content.append(actions);
    }
    card.append(content);
    track.append(card);
  });

  viewport.append(track);
  block.replaceChildren(previous, viewport, next);
  viewport.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  const observer = new ResizeObserver(updateControls);
  observer.observe(viewport);
  requestAnimationFrame(updateControls);
}
