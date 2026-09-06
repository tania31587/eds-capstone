function decorateProductCard(row) {
  const picture = row.querySelector('picture');
  const heading = row.querySelector('h2, h3, h4');
  const paragraphs = [...row.querySelectorAll('p')];
  const link = row.querySelector('a');

  const card = document.createElement('article');
  card.className = 'category-product-card';

  if (picture) {
    const media = document.createElement('div');
    media.className = 'category-product-card-media';
    media.append(picture);
    card.append(media);
  }

  const content = document.createElement('div');
  content.className = 'category-product-card-content';

  if (heading) {
    content.append(heading);
  }

  paragraphs.forEach((paragraph) => {
    if (!paragraph.contains(link)) {
      content.append(paragraph);
    }
  });

  if (link) {
    link.classList.add('category-product-card-link');
    content.append(link);
  }

  card.append(content);

  return card;
}

export default function decorate(block) {
  const rail = document.createElement('div');
  rail.className = 'category-grid-rail';
  const viewport = document.createElement('div');
  viewport.className = 'category-grid-viewport';
  const list = document.createElement('ul');
  list.className = 'category-grid-list';

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    item.className = 'category-grid-item';
    item.append(decorateProductCard(row));
    list.append(item);
  });

  const scrollCategories = (direction) => {
    const card = list.querySelector('.category-grid-item');
    const amount = card ? card.getBoundingClientRect().width + 24 : viewport.clientWidth;
    viewport.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };
  const previous = document.createElement('button');
  previous.className = 'category-grid-control category-grid-previous';
  previous.type = 'button';
  previous.setAttribute('aria-label', 'Previous categories');
  previous.textContent = '‹';
  previous.addEventListener('click', () => scrollCategories(-1));
  const next = document.createElement('button');
  next.className = 'category-grid-control category-grid-next';
  next.type = 'button';
  next.setAttribute('aria-label', 'Next categories');
  next.textContent = '›';
  next.addEventListener('click', () => scrollCategories(1));
  const updateControls = () => {
    previous.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft + viewport.clientWidth >= list.scrollWidth - 1;
  };
  viewport.append(list);
  rail.append(previous, viewport, next);
  block.replaceChildren(rail);
  viewport.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
}
