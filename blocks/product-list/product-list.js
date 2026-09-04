function toSlug(value = '') {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function productImage(product) {
  return product.image || product.imageurl || product.thumbnail || '';
}

function productLink(product) {
  return product.path || product.url || `/pages/products/${toSlug(product.name)}`;
}

function splitValues(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createProductCard(product) {
  const card = createElement('article', 'product-list-card');
  const imageUrl = productImage(product);

  if (imageUrl) {
    const link = createElement('a', 'product-list-card-media');
    link.href = productLink(product);
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = product.alt || product.name || '';
    image.loading = 'lazy';
    link.append(image);
    card.append(link);
  }

  const content = createElement('div', 'product-list-card-content');
  const title = createElement('h2', 'product-list-card-title');
  const titleLink = document.createElement('a');
  titleLink.href = productLink(product);
  titleLink.textContent = product.name || 'Product';
  title.append(titleLink);
  content.append(title);

  if (product.rating) content.append(createElement('p', 'product-list-rating', `${product.rating} ${product.reviews ? `(${product.reviews})` : ''}`));
  if (product.price) content.append(createElement('p', 'product-list-price', product.price));
  if (product.description) content.append(createElement('p', 'product-list-description', product.description));

  const action = createElement('a', 'product-list-action', 'View Product');
  action.href = productLink(product);
  content.append(action);
  card.append(content);
  return card;
}

function matchesFilters(product, filters) {
  return [...filters.entries()].every(([field, values]) => {
    if (!values.size) return true;
    return splitValues(product[field]).some((value) => values.has(value));
  });
}

function createFilterGroup(label, field, products, filters, onChange) {
  const values = [...new Set(products.flatMap((product) => splitValues(product[field])))].sort();
  if (!values.length) return null;

  const group = createElement('fieldset', 'product-list-filter-group');
  group.append(createElement('legend', '', label));
  values.forEach((value) => {
    const labelElement = createElement('label', 'product-list-filter-option');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = value;
    input.addEventListener('change', () => {
      const selected = filters.get(field) || new Set();
      if (input.checked) selected.add(value);
      else selected.delete(value);
      filters.set(field, selected);
      onChange();
    });
    labelElement.append(input, document.createTextNode(value));
    group.append(labelElement);
  });
  return group;
}

export default async function decorate(block) {
  const source = block.querySelector('a')?.getAttribute('href') || block.textContent.trim() || '/products';
  const sheetUrl = `${source.replace(/\.json$|\/$/, '')}.json`;
  block.replaceChildren(createElement('p', 'product-list-status', 'Loading products...'));

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error(`Unable to load ${sheetUrl}`);
    const { data = [] } = await response.json();
    const category = toSlug(window.location.pathname.split('/').pop());
    const products = data.filter((product) => !category || category === 'shop' || toSlug(product.category) === category);
    const filters = new Map();
    const layout = createElement('div', 'product-list-layout');
    const sidebar = createElement('aside', 'product-list-filters');
    sidebar.append(createElement('h2', '', 'Filters'));
    const results = createElement('div', 'product-list-results');
    const heading = createElement('div', 'product-list-heading');
    const title = createElement('h1', '', category === 'shop' ? 'Shop' : category ? `${category[0].toUpperCase()}${category.slice(1)}` : 'Products');
    const count = createElement('p', 'product-list-count');
    heading.append(title, count);
    const grid = createElement('div', 'product-list-grid');

    const render = () => {
      const visibleProducts = products.filter((product) => matchesFilters(product, filters));
      count.textContent = `${visibleProducts.length} products`;
      grid.replaceChildren(...visibleProducts.map(createProductCard));
      if (!visibleProducts.length) grid.append(createElement('p', 'product-list-empty', 'No products match the selected filters.'));
    };

    [['type', 'Plant type'], ['light', 'Light'], ['size', 'Size'], ['rating', 'Rating']].forEach(([field, label]) => {
      const filter = createFilterGroup(label, field, products, filters, render);
      if (filter) sidebar.append(filter);
    });

    const clearButton = createElement('button', 'product-list-clear', 'Clear filters');
    clearButton.type = 'button';
    clearButton.addEventListener('click', () => {
      filters.clear();
      sidebar.querySelectorAll('input').forEach((input) => { input.checked = false; });
      render();
    });
    sidebar.append(clearButton);
    results.append(heading, grid);
    layout.append(sidebar, results);
    block.replaceChildren(layout);
    render();
  } catch (error) {
    block.replaceChildren(createElement('p', 'product-list-status product-list-error', 'Products are currently unavailable.'));
    // eslint-disable-next-line no-console
    console.error('Product list failed to load', error);
  }
}