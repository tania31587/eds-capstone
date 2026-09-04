function classifyContent(element, text) {
  if (/^(₹|\$|€|£)\s?\d/.test(text)) element.classList.add('product-details-price');
  if (/^sku[:\s]|^[A-Z]+-[A-Z0-9-]+$/i.test(text)) element.classList.add('product-details-sku');
  if (/^[★☆]+/.test(text)) element.classList.add('product-details-rating');
  if (/reviews?$/i.test(text)) element.classList.add('product-details-reviews');
  if (/^in stock$/i.test(text)) element.classList.add('product-details-stock');
}

export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'product-details-content';
  let titleFound = false;

  [...block.children].forEach((row) => {
    const text = row.textContent.trim();
    const link = row.querySelector('a');
    if (!text) return;

    if (link && /cart/i.test(text)) {
      link.classList.add('product-details-link');
      content.append(link);
      return;
    }

    const element = row.firstElementChild?.cloneNode(true) || document.createElement('p');
    if (!row.firstElementChild) element.textContent = text;

    if (!titleFound && /^h[1-6]$/.test(element.tagName.toLowerCase())) {
      element.classList.add('product-details-title');
      titleFound = true;
    } else {
      classifyContent(element, text);
    }
    content.append(element);
  });

  block.replaceChildren(content);
}
