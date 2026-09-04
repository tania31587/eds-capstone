export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'related-products-list';

  [...block.children].forEach((row) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const content = document.createElement('div');
    content.className = 'product-card-content';

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
