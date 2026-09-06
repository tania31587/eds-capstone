import {
  formatPrice,
  getCategoryUrl,
  getProductUrl,
  getProductsByCategory,
} from '../../scripts/catalog.js';

const PRODUCTS_PER_PAGE = 20;

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

  content.append(
    category,
    title,
    ratingRow,
    price,
    description,
    attributes,
    link,
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

function renderProducts(block, products, category, page) {
  block.textContent = '';

  const validPage = Math.max(
    1,
    Math.min(
      page,
      Math.ceil(products.length / PRODUCTS_PER_PAGE) || 1,
    ),
  );

  updatePageUrl(category, validPage);

  const header = document.createElement('header');
  header.className = 'dynamic-category-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'dynamic-category-eyebrow';
  eyebrow.textContent = 'Shop collection';

  const heading = document.createElement('h1');
  heading.textContent = category;

  const count = document.createElement('p');
  count.className = 'dynamic-category-count';
  count.textContent = `${products.length} products`;

  header.append(eyebrow, heading, count);

  const start = (validPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = products.slice(
    start,
    start + PRODUCTS_PER_PAGE,
  );

  const list = document.createElement('ul');
  list.className = 'dynamic-category-grid';

  visibleProducts.forEach((product) => {
    list.append(createProductCard(product));
  });

  const pagination = createPagination({
    totalProducts: products.length,
    currentPage: validPage,
    category,
    onPageChange: (newPage) => {
      renderProducts(
        block,
        products,
        category,
        newPage,
      );

      block.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    },
  });

  block.append(header, list);

  if (pagination) {
    block.append(pagination);
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
