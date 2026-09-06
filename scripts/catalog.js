const CATALOG_ENDPOINT = '/products.json?limit=5000';

let catalogPromise;

export function createSlug(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parsePrice(value) {
  const parsedPrice = Number(
    String(value || '').replace(/[^\d.]/g, ''),
  );

  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(parsePrice(value));
}

function getField(row, fieldName) {
  if (!row) {
    return '';
  }

  const matchingKey = Object.keys(row).find(
    (key) => key.toLowerCase() === fieldName.toLowerCase(),
  );

  return matchingKey ? row[matchingKey] : '';
}

function normalizeProduct(row) {
  const name = getField(row, 'Name');
  const category = getField(row, 'Category');

  return {
    name,
    slug: createSlug(name),
    category,
    categorySlug: createSlug(category),
    image: getField(row, 'Image'),
    alt: getField(row, 'Alt') || name,
    price: parsePrice(getField(row, 'Price')),
    priceLabel: getField(row, 'Price'),
    description: getField(row, 'Description'),
    rating: getField(row, 'Rating'),
    reviews: getField(row, 'Reviews'),
    type: getField(row, 'Type'),
    light: getField(row, 'Light'),
    size: getField(row, 'Size'),
    path: getField(row, 'Path'),
  };
}

export async function getCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(CATALOG_ENDPOINT)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Unable to load product catalog: ${response.status}`,
          );
        }

        return response.json();
      })
      .then((payload) => {
        const rows = Array.isArray(payload.data)
          ? payload.data
          : [];

        return rows
          .map(normalizeProduct)
          .filter((product) => product.name);
      })
      .catch((error) => {
        catalogPromise = undefined;
        throw error;
      });
  }

  return catalogPromise;
}

export async function getProductBySlug(slug) {
  const products = await getCatalog();
  const normalizedSlug = createSlug(slug);

  return products.find(
    (product) => product.slug === normalizedSlug,
  );
}

export async function getProductsByCategory(category) {
  const products = await getCatalog();
  const normalizedCategory = createSlug(category);

  return products.filter(
    (product) => product.categorySlug === normalizedCategory,
  );
}

export async function getRelatedProducts(
  currentProduct,
  maximumProducts = 4,
) {
  const products = await getProductsByCategory(
    currentProduct.category,
  );

  return products
    .filter((product) => product.slug !== currentProduct.slug)
    .slice(0, maximumProducts);
}

export function getProductUrl(product) {
  if (product.path) {
    return product.path;
  }

  return `/pages/product-detail?slug=${encodeURIComponent(
    product.slug,
  )}`;
}

export function getCategoryUrl(category) {
  return `/pages/categories?category=${encodeURIComponent(
    category,
  )}`;
}
