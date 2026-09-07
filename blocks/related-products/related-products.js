import createCardAddButton from '../../scripts/product-card.js';

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
      const textElements = [...content.children].filter((element) => element.textContent.trim());
      const title = textElements.shift();
      if (title) title.classList.add('product-card-title');
      textElements.forEach((element) => {
        const text = element.textContent.trim();
        if (/^[★☆]/.test(text)) element.classList.add('product-card-rating');
        else if (/^(₹|\$|€|£)\s?\d/.test(text)) element.classList.add('product-card-price');
        else if (!element.querySelector('a')) element.classList.add('product-card-description');
      });
      const action = content.querySelector('a');
      if (action && action.closest('p')) {
        action.classList.add('product-card-link');
        const actions = document.createElement('div');
        actions.className = 'product-card-actions';
        actions.append(action, createCardAddButton({
          name: title.textContent.trim(),
          price: content.querySelector('.product-card-price')?.textContent.trim() || 0,
          image: picture?.querySelector('img')?.src,
          productUrl: action.href,
        }));
        content.append(actions);
      }
      card.append(content);
      list.append(card);
    }
  });

  block.replaceChildren(list);
}
