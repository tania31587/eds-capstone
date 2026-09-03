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
  const list = document.createElement('ul');
  list.className = 'category-grid-list';

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    item.className = 'category-grid-item';
    item.append(decorateProductCard(row));
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
