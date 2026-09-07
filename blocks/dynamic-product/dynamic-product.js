import { addItem } from '../../scripts/cart.js';
import createCardAddButton from '../../scripts/product-card.js';
import {
  formatPrice,
  getCategoryUrl,
  getProductBySlug,
  getProductUrl,
  getRelatedProducts,
} from '../../scripts/catalog.js';

function createProductSku(product) {
  if (product.sku) {
    return product.sku;
  }

  return `PRODUCT-${product.slug.toUpperCase()}`;
}

function showCartToast(productName) {
  document.querySelector('.dynamic-cart-toast')?.remove();

  const toast = document.createElement('div');

  toast.className = 'dynamic-cart-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = `${productName} added to cart`;

  document.body.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2500);
}

function createProductMedia(product) {
  const media = document.createElement('div');

  media.className = 'dynamic-product-media';

  if (!product.image) {
    const placeholder = document.createElement('div');

    placeholder.className = 'dynamic-product-image-placeholder';
    placeholder.textContent = 'Product image unavailable';

    media.append(placeholder);

    return media;
  }

  const image = document.createElement('img');

  image.src = product.image;
  image.alt = product.alt || product.name;
  image.width = 800;
  image.height = 1000;
  image.loading = 'eager';

  media.append(image);

  return media;
}

function createProductRating(product) {
  const ratingContainer = document.createElement('div');

  ratingContainer.className = 'dynamic-product-rating';

  const stars = document.createElement('span');

  stars.className = 'dynamic-product-rating-stars';
  stars.textContent = product.rating || 'Not yet rated';

  const ratingLabel = product.rating
    ? `${product.rating} rating for ${product.name}`
    : `${product.name} is not yet rated`;

  stars.setAttribute('aria-label', ratingLabel);

  const reviews = document.createElement('span');

  reviews.className = 'dynamic-product-reviews';
  reviews.textContent = product.reviews || '';

  ratingContainer.append(stars);

  if (product.reviews) {
    ratingContainer.append(reviews);
  }

  return ratingContainer;
}

function createProductFeatures(product) {
  const list = document.createElement('ul');

  list.className = 'dynamic-product-features';

  const values = [
    product.type,
    product.light,
    product.size,
  ];

  values
    .filter((value) => (
      value
      && String(value).toLowerCase() !== 'not applicable'
    ))
    .forEach((value) => {
      const item = document.createElement('li');

      item.textContent = value;
      list.append(item);
    });

  return list;
}

function createAddToCartButton(product) {
  const button = document.createElement('button');

  button.className = 'dynamic-product-add-to-cart';
  button.type = 'button';
  button.textContent = 'Add to Cart';

  button.setAttribute(
    'aria-label',
    `Add ${product.name} to cart`,
  );

  button.addEventListener('click', () => {
    addItem({
      sku: createProductSku(product),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      productUrl: getProductUrl(product),
    });

    showCartToast(product.name);

    button.textContent = 'Added to Cart';
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = 'Add to Cart';
      button.disabled = false;
    }, 1800);
  });

  return button;
}

function createProductDetails(product) {
  const details = document.createElement('div');

  details.className = 'dynamic-product-details';

  const category = document.createElement('a');

  category.className = 'dynamic-product-category';
  category.href = getCategoryUrl(product.category);
  category.textContent = product.category;

  const title = document.createElement('h1');

  title.className = 'dynamic-product-title';
  title.textContent = product.name;

  const rating = createProductRating(product);

  const sku = document.createElement('p');

  sku.className = 'dynamic-product-sku';
  sku.textContent = createProductSku(product);

  const price = document.createElement('p');

  price.className = 'dynamic-product-price';
  price.textContent = formatPrice(product.price);

  const description = document.createElement('p');

  description.className = 'dynamic-product-description';
  description.textContent = product.description
    || `${product.name} from the GreenLeaf product collection.`;

  const features = createProductFeatures(product);

  const availability = document.createElement('p');

  availability.className = 'dynamic-product-stock';
  availability.textContent = 'In Stock';

  const addToCart = createAddToCartButton(product);

  details.append(
    category,
    title,
    rating,
    sku,
    price,
    description,
  );

  if (features.children.length) {
    details.append(features);
  }

  details.append(
    availability,
    addToCart,
  );

  return details;
}

function createAboutSection(product) {
  const section = document.createElement('section');

  section.className = 'dynamic-product-about';

  const heading = document.createElement('h2');

  heading.textContent = `About ${product.name}`;

  const description = document.createElement('p');

  description.textContent = product.longDescription
    || product.description
    || `${product.name} is part of the GreenLeaf collection.`;

  section.append(
    heading,
    description,
  );

  return section;
}

function createSpecificationRow(label, value) {
  if (
    !value
    || String(value).toLowerCase() === 'not applicable'
  ) {
    return null;
  }

  const row = document.createElement('div');

  row.className = 'dynamic-product-spec-row';

  const term = document.createElement('dt');

  term.textContent = label;

  const description = document.createElement('dd');

  description.textContent = value;

  row.append(
    term,
    description,
  );

  return row;
}

function createProductSpecifications(product) {
  const section = document.createElement('section');

  section.className = 'dynamic-product-specs';

  const heading = document.createElement('h2');

  heading.textContent = 'Product Specifications';

  const specifications = document.createElement('dl');

  const specificationData = [
    ['Product SKU', createProductSku(product)],
    ['Category', product.category],
    ['Type', product.type],
    ['Light', product.light],
    ['Size', product.size],
  ];

  specificationData.forEach(([label, value]) => {
    const row = createSpecificationRow(label, value);

    if (row) {
      specifications.append(row);
    }
  });

  section.append(
    heading,
    specifications,
  );

  return section;
}

function createRelatedProductCard(product) {
  const item = document.createElement('li');

  item.className = 'dynamic-related-product-item';

  const card = document.createElement('article');

  card.className = [
    'product-card',
    'dynamic-related-product-card',
  ].join(' ');

  const productUrl = getProductUrl(product);

  const mediaLink = document.createElement('a');

  mediaLink.className = 'product-card-media';
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
    image.width = 500;
    image.height = 625;

    mediaLink.append(image);
  }

  const content = document.createElement('div');

  content.className = 'product-card-content';

  const title = document.createElement('h3');

  title.className = 'product-card-title';

  const titleLink = document.createElement('a');

  titleLink.href = productUrl;
  titleLink.textContent = product.name;

  title.append(titleLink);

  const rating = createProductRating(product);

  const price = document.createElement('p');

  price.className = 'product-card-price';
  price.textContent = formatPrice(product.price);

  const description = document.createElement('p');

  description.className = 'product-card-description';
  description.textContent = product.description || '';

  const viewProduct = document.createElement('a');

  viewProduct.className = 'product-card-link';
  viewProduct.href = productUrl;
  viewProduct.textContent = 'View Product';

  content.append(
    title,
    rating,
    price,
  );

  if (product.description) {
    content.append(description);
  }

  const actions = document.createElement('div');
  actions.className = 'dynamic-related-product-actions';
  actions.append(viewProduct, createCardAddButton({
    ...product,
    sku: createProductSku(product),
    productUrl,
  }, 'dynamic-related-product-add-to-cart'));
  content.append(actions);

  card.append(
    mediaLink,
    content,
  );

  item.append(card);

  return item;
}

async function createRelatedProductsSection(product) {
  const section = document.createElement('section');

  section.className = 'dynamic-related-products';

  const heading = document.createElement('h2');

  heading.textContent = 'Related Products';

  const relatedProducts = await getRelatedProducts(
    product,
    4,
  );

  if (!relatedProducts.length) {
    const emptyMessage = document.createElement('p');

    emptyMessage.className = 'dynamic-related-products-empty';

    emptyMessage.textContent = (
      'No related products are currently available.'
    );

    section.append(
      heading,
      emptyMessage,
    );

    return section;
  }

  const list = document.createElement('ul');

  list.className = 'dynamic-related-products-list';

  relatedProducts.forEach((relatedProduct) => {
    list.append(
      createRelatedProductCard(relatedProduct),
    );
  });

  section.append(
    heading,
    list,
  );

  return section;
}

function getMetadataAttributeValue(selector, attribute) {
  const pattern = attribute === 'property'
    ? /\[property="(.+)"\]/
    : /\[name="(.+)"\]/;

  return selector.match(pattern)?.[1];
}

function updateMetadataTag(
  selector,
  attribute,
  content,
) {
  let metadata = document.querySelector(selector);

  if (!metadata) {
    const attributeValue = getMetadataAttributeValue(
      selector,
      attribute,
    );

    if (!attributeValue) {
      return;
    }

    metadata = document.createElement('meta');

    metadata.setAttribute(
      attribute,
      attributeValue,
    );

    document.head.append(metadata);
  }

  metadata.content = content;
}

function updateProductMetadata(product) {
  const description = product.description
    || `Shop ${product.name} from GreenLeaf Store.`;

  const productUrl = new URL(
    getProductUrl(product),
    window.location.origin,
  ).href;

  document.title = `${product.name} | GreenLeaf Store`;

  updateMetadataTag(
    'meta[name="description"]',
    'name',
    description,
  );

  updateMetadataTag(
    'meta[property="og:title"]',
    'property',
    product.name,
  );

  updateMetadataTag(
    'meta[property="og:description"]',
    'property',
    description,
  );

  updateMetadataTag(
    'meta[property="og:url"]',
    'property',
    productUrl,
  );

  if (product.image) {
    const imageUrl = new URL(
      product.image,
      window.location.origin,
    ).href;

    updateMetadataTag(
      'meta[property="og:image"]',
      'property',
      imageUrl,
    );
  }
}

function getNumericRating(rating) {
  if (!rating) {
    return 0;
  }

  const filledStars = (
    String(rating).match(/★/g) || []
  ).length;

  return filledStars;
}

function getReviewCount(reviews) {
  const reviewCount = Number.parseInt(
    String(reviews || ''),
    10,
  );

  return Number.isFinite(reviewCount)
    ? reviewCount
    : 0;
}

function createProductStructuredData(product) {
  document.querySelector(
    '#dynamic-product-structured-data',
  )?.remove();

  const script = document.createElement('script');

  script.id = 'dynamic-product-structured-data';
  script.type = 'application/ld+json';

  const productUrl = new URL(
    getProductUrl(product),
    window.location.origin,
  ).href;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: createProductSku(product),
    category: product.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: productUrl,
    },
  };

  if (product.image) {
    structuredData.image = new URL(
      product.image,
      window.location.origin,
    ).href;
  }

  const numericRating = getNumericRating(
    product.rating,
  );

  const reviewCount = getReviewCount(
    product.reviews,
  );

  if (numericRating && reviewCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: numericRating,
      reviewCount,
    };
  }

  script.textContent = JSON.stringify(
    structuredData,
  );

  document.head.append(script);
}

function showProductNotFound(block, slug) {
  block.textContent = '';

  const container = document.createElement('div');

  container.className = 'dynamic-product-not-found';

  const heading = document.createElement('h1');

  heading.textContent = 'Product not found';

  const message = document.createElement('p');

  if (slug) {
    message.textContent = `No product matches "${slug}".`;
  } else {
    message.textContent = (
      'A product slug was not supplied in the page URL.'
    );
  }

  const link = document.createElement('a');

  link.href = getCategoryUrl('Plants');
  link.textContent = 'Browse products';

  container.append(
    heading,
    message,
    link,
  );

  block.append(container);
}

function showProductError(block) {
  block.textContent = '';

  const container = document.createElement('div');

  container.className = 'dynamic-product-not-found';
  container.setAttribute('role', 'alert');

  const heading = document.createElement('h1');

  heading.textContent = 'Product could not be loaded';

  const message = document.createElement('p');

  message.textContent = (
    'Check that the products spreadsheet has been '
    + 'previewed and published.'
  );

  const retryButton = document.createElement('button');

  retryButton.className = 'dynamic-product-retry';
  retryButton.type = 'button';
  retryButton.textContent = 'Try again';

  retryButton.addEventListener('click', () => {
    window.location.reload();
  });

  const categoryLink = document.createElement('a');

  categoryLink.href = getCategoryUrl('Plants');
  categoryLink.textContent = 'Browse products';

  container.append(
    heading,
    message,
    retryButton,
    categoryLink,
  );

  block.append(container);
}

export default async function decorate(block) {
  const params = new URLSearchParams(
    window.location.search,
  );

  const slug = params.get('slug')?.trim();

  block.textContent = '';
  block.setAttribute('aria-busy', 'true');

  const loading = document.createElement('p');

  loading.className = 'dynamic-product-loading';
  loading.textContent = 'Loading product…';

  block.append(loading);

  if (!slug) {
    showProductNotFound(block, '');
    block.removeAttribute('aria-busy');
    return;
  }

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      showProductNotFound(block, slug);
      return;
    }

    updateProductMetadata(product);
    createProductStructuredData(product);

    const layout = document.createElement('div');

    layout.className = 'dynamic-product-layout';

    const media = createProductMedia(product);
    const details = createProductDetails(product);

    layout.append(
      media,
      details,
    );

    const aboutSection = createAboutSection(product);

    const specifications = createProductSpecifications(
      product,
    );

    const relatedProducts = (
      await createRelatedProductsSection(product)
    );

    block.textContent = '';

    block.append(
      layout,
      aboutSection,
      specifications,
      relatedProducts,
    );
  } catch (error) {
    showProductError(block);
  } finally {
    block.removeAttribute('aria-busy');
  }
}
