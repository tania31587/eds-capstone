import createCardAddButton from '../../scripts/product-card.js';

export default function decorate(block) {
  const picture = block.querySelector('picture');
  const heading = block.querySelector('h2, h3, h4');
  const paragraphs = [...block.querySelectorAll('p')];
  const link = block.querySelector('a');

  const card = document.createElement('article');
  card.className = 'product-card';

  if (picture) {
    const media = document.createElement('div');
    media.className = 'product-card-media';
    media.append(picture);
    card.append(media);
  }

  const content = document.createElement('div');
  content.className = 'product-card-content';

  if (heading) {
    heading.classList.add('product-card-title');
    content.append(heading);
  }

  const price = paragraphs.find((paragraph) => (
    paragraph.textContent.trim().startsWith('₹')
    || paragraph.textContent.trim().startsWith('$')
  ));

  const description = paragraphs.find((paragraph) => (
    paragraph !== price && !paragraph.contains(link)
  ));

  if (price) {
    price.classList.add('product-card-price');
    content.append(price);
  }

  if (description) {
    description.classList.add('product-card-description');
    content.append(description);
  }

  if (link) {
    link.classList.add('product-card-link');
    const actions = document.createElement('div');
    actions.className = 'product-card-actions';
    actions.append(link, createCardAddButton({
      name: heading?.textContent.trim() || 'Product',
      price: price?.textContent.trim() || 0,
      image: picture?.querySelector('img')?.src,
      productUrl: link.href,
    }));
    content.append(actions);
  }

  card.append(content);

  block.textContent = '';
  block.append(card);
}
