import {
  formatPrice,
  getCategoryUrl,
  getProductUrl,
  getProductsByCategory,
} from '../../scripts/catalog.js';
import createCardAddButton from '../../scripts/product-card.js';

const PRODUCTS_PER_PAGE = 20;

function splitValues(value = '') {
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function matchesFilters(product, filters) {
  return [...filters.entries()].every(([field, values]) => (
    field === 'price'
      ? (!values.min || product.price >= values.min) && (!values.max || product.price <= values.max)
      : !values.size || splitValues(product[field]).some((value) => values.has(value))
  ));
}

function createPriceFilter(products, filters, onChange) {
  const prices = products.map((product) => product.price).filter(Number.isFinite);
  const group = document.createElement('fieldset');
  group.className = 'dynamic-category-filter-group dynamic-category-price-filter';
  group.innerHTML = `<legend>Price range</legend><div><input type="number" min="${Math.min(...prices)}" placeholder="Min" aria-label="Minimum price"><span>to</span><input type="number" max="${Math.max(...prices)}" placeholder="Max" aria-label="Maximum price"></div>`;
  const [minimum, maximum] = group.querySelectorAll('input');
  const selected = filters.get('price') || {};
  minimum.value = selected.min || '';
  maximum.value = selected.max || '';
  [minimum, maximum].forEach((input) => input.addEventListener('change', () => {
    filters.set('price', { min: Number(minimum.value) || 0, max: Number(maximum.value) || 0 });
    onChange();
  }));
  return group;
}

function createFilterGroup(label, field, products, filters, onChange) {
  const values = [...new Set(products.flatMap((product) => splitValues(product[field])))].sort();
  if (!values.length) return null;

  const group = document.createElement('fieldset');
  group.className = 'dynamic-category-filter-group';
  const legend = document.createElement('legend');
  legend.textContent = label;
  group.append(legend);

  values.forEach((value) => {
    const option = document.createElement('label');
    option.className = 'dynamic-category-filter-option';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = value;
    input.checked = filters.get(field)?.has(value) || false;
    input.addEventListener('change', () => {
      const selected = filters.get(field) || new Set();
      if (input.checked) selected.add(value);
      else selected.delete(value);
      filters.set(field, selected);
      onChange();
    });
    option.append(input, document.createTextNode(value));
    group.append(option);
  });
  return group;
}

function createProductCard(product) {
  const item = document.createElement('li');
  item.className = 'dynamic-category-item';

  const card = document.createElement('article');
  card.className = 'catalog-product-card';

  const productUrl = getProductUrl(product);

  const mediaLink = document.createElement('a');
  mediaLink.className = 'catalog-product-media';
  mediaLink.href = productUrl;
  mediaLink.setAttribute(
    'aria-label',
    `View ${product.name}`,
  );

  if (product.image) {
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.alt || product.name;
    image.loading = 'lazy';
    image.width = 600;
    image.height = 750;
    mediaLink.append(image);
  }

  const content = document.createElement('div');
  content.className = 'catalog-product-content';

  const category = document.createElement('a');
  category.className = 'catalog-product-category';
  category.href = getCategoryUrl(product.category);
  category.textContent = product.category;

  const title = document.createElement('h2');
  title.className = 'catalog-product-title';

  const titleLink = document.createElement('a');
  titleLink.href = productUrl;
  titleLink.textContent = product.name;
  title.append(titleLink);

  const ratingRow = document.createElement('div');
  ratingRow.className = 'catalog-product-rating';

  const rating = document.createElement('span');
  rating.textContent = product.rating || 'Not yet rated';
  rating.setAttribute(
    'aria-label',
    `${product.rating || 'No rating'} for ${product.name}`,
  );

  const reviews = document.createElement('span');
  reviews.textContent = product.reviews || '';

  ratingRow.append(rating, reviews);

  const price = document.createElement('p');
  price.className = 'catalog-product-price';
  price.textContent = formatPrice(product.price);

  const description = document.createElement('p');
  description.className = 'catalog-product-description';
  description.textContent = product.description;

  const attributes = document.createElement('ul');
  attributes.className = 'catalog-product-attributes';

  [
    product.type,
    product.light,
    product.size,
  ].filter(Boolean).forEach((attribute) => {
    const attributeItem = document.createElement('li');
    attributeItem.textContent = attribute;
    attributes.append(attributeItem);
  });

  const link = document.createElement('a');
  link.className = 'catalog-product-link';
  link.href = productUrl;
  link.textContent = 'View product';

  const actions = document.createElement('div');
  actions.className = 'catalog-product-actions';
  actions.append(link, createCardAddButton({ ...product, productUrl }, 'catalog-product-add-to-cart'));

  content.append(
    category,
    title,
    ratingRow,
    price,
    description,
    attributes,
    actions,
  );

  card.append(mediaLink, content);
  item.append(card);

  return item;
}

function createPagination({
  totalProducts,
  currentPage,
  category,
  onPageChange,
}) {
  const pageCount = Math.ceil(
    totalProducts / PRODUCTS_PER_PAGE,
  );

  if (pageCount <= 1) {
    return null;
  }

  const navigation = document.createElement('nav');
  navigation.className = 'catalog-pagination';
  navigation.setAttribute('aria-label', 'Product pages');

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.textContent = 'Previous';
  previous.disabled = currentPage === 1;

  previous.addEventListener('click', () => {
    onPageChange(currentPage - 1);
  });

  const status = document.createElement('span');
  status.textContent = `Page ${currentPage} of ${pageCount}`;

  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next';
  next.disabled = currentPage === pageCount;

  next.addEventListener('click', () => {
    onPageChange(currentPage + 1);
  });

  navigation.append(previous, status, next);
  navigation.dataset.category = category;

  return navigation;
}

function showError(block, message) {
  block.textContent = '';

  const error = document.createElement('div');
  error.className = 'dynamic-category-error';
  error.setAttribute('role', 'alert');

  const title = document.createElement('h2');
  title.textContent = 'Products could not be loaded';

  const description = document.createElement('p');
  description.textContent = message;

  error.append(title, description);
  block.append(error);
}

function updatePageUrl(category, page) {
  const url = new URL(window.location.href);

  url.searchParams.set('category', category);

  if (page > 1) {
    url.searchParams.set('page', String(page));
  } else {
    url.searchParams.delete('page');
  }

  window.history.replaceState({}, '', url);
}

function renderProducts(block, products, category, page, filters = new Map()) {
  block.textContent = '';

  const visibleProducts = products.filter((product) => matchesFilters(product, filters));

  const validPage = Math.max(
    1,
    Math.min(
      page,
      Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE) || 1,
    ),
  );

  updatePageUrl(category, validPage);

  const header = document.createElement('header');
  header.className = 'dynamic-category-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'dynamic-category-eyebrow';
  // eyebrow.textContent = 'Shop collection';

  const heading = document.createElement('h1');
  heading.textContent = category;

  const count = document.createElement('p');
  count.className = 'dynamic-category-count';
  count.textContent = `${visibleProducts.length} products`;

  header.append(heading, count);

  const start = (validPage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = visibleProducts.slice(
    start,
    start + PRODUCTS_PER_PAGE,
  );

  const list = document.createElement('ul');
  list.className = 'dynamic-category-grid';

  pageProducts.forEach((product) => {
    list.append(createProductCard(product));
  });

  if (!pageProducts.length) {
    const empty = document.createElement('p');
    empty.className = 'dynamic-category-empty';
    empty.textContent = 'No products match the selected filters.';
    list.append(empty);
  }

  const pagination = createPagination({
    totalProducts: visibleProducts.length,
    currentPage: validPage,
    category,
    onPageChange: (newPage) => {
      renderProducts(
        block,
        products,
        category,
        newPage,
        filters,
      );

      block.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    },
  });

  const sidebar = document.createElement('aside');
  sidebar.className = 'dynamic-category-filters';
  const filterHeading = document.createElement('h2');
  filterHeading.textContent = 'Filters';
  sidebar.append(filterHeading);
  const render = () => renderProducts(block, products, category, 1, filters);
  [['type', 'Plant type'], ['light', 'Light'], ['size', 'Size'], ['rating', 'Rating']].forEach(([field, label]) => {
    const group = createFilterGroup(label, field, products, filters, render);
    if (group) sidebar.append(group);
  });
  sidebar.append(createPriceFilter(products, filters, render));
  const clear = document.createElement('button');
  clear.className = 'dynamic-category-clear';
  clear.type = 'button';
  clear.textContent = 'Clear filters';
  clear.addEventListener('click', () => {
    filters.clear();
    render();
  });
  sidebar.append(clear);

  const results = document.createElement('div');
  results.className = 'dynamic-category-results';
  results.append(header, list);
  const layout = document.createElement('div');
  layout.className = 'dynamic-category-layout';
  layout.append(sidebar, results);
  block.append(layout);

  if (pagination) {
    results.append(pagination);
  }
}

export default async function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || 'Plants';
  const requestedPage = Number.parseInt(
    params.get('page'),
    10,
  );

  block.textContent = '';
  block.setAttribute('aria-busy', 'true');

  const loading = document.createElement('p');
  loading.className = 'dynamic-category-loading';
  loading.textContent = 'Loading products…';
  block.append(loading);

  try {
    const products = await getProductsByCategory(category);

    if (!products.length) {
      showError(
        block,
        `No products were found in the ${category} category.`,
      );
      return;
    }

    renderProducts(
      block,
      products,
      category,
      Number.isFinite(requestedPage) ? requestedPage : 1,
    );
  } catch (error) {
    showError(
      block,
      'Check that the products spreadsheet is previewed and published.',
    );
  } finally {
    block.removeAttribute('aria-busy');
  }
}
