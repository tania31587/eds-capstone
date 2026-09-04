export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'related-products-list';

  [...block.children].forEach((row) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const picture = row.querySelector('picture');
    const content = document.createElement('div');
    content.className = 'product-card-content';

    if (picture) {
      const media = document.createElement('div');
      media.className = 'product-card-media';
      media.append(picture);
      card.append(media);
    }

    [...row.children].forEach((cell) => {
      while (cell.firstElementChild) content.append(cell.firstElementChild);
    });

    if (content.childElementCount) {
      card.append(content);
      list.append(card);
    }
  });

  block.replaceChildren(list);
}
