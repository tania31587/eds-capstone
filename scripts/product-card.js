import {
  addItem, getItems, removeItem, updateQty,
} from './cart.js';
import { createSlug, parsePrice } from './catalog.js';

function createQuantityControl(product, className) {
  const quantity = getItems().find((item) => item.sku === product.sku)?.quantity || 1;
  const control = document.createElement('div');
  control.className = `${className}-quantity product-card-quantity`;
  control.setAttribute('aria-label', `Quantity for ${product.name}`);
  const decrease = document.createElement('button');
  decrease.type = 'button';
  decrease.textContent = '−';
  decrease.setAttribute('aria-label', `Remove one ${product.name}`);
  const value = document.createElement('span');
  value.textContent = quantity;
  const increase = document.createElement('button');
  increase.type = 'button';
  increase.textContent = '+';
  increase.setAttribute('aria-label', `Add one ${product.name}`);
  decrease.addEventListener('click', () => {
    const currentQuantity = Number(value.textContent);
    if (currentQuantity === 1) {
      removeItem(product.sku);
      // eslint-disable-next-line no-use-before-define
      control.replaceWith(createAddButton(product, className));
      return;
    }
    const nextQuantity = currentQuantity - 1;
    updateQty(product.sku, nextQuantity);
    value.textContent = nextQuantity;
  });
  increase.addEventListener('click', () => {
    const nextQuantity = Number(value.textContent) + 1;
    updateQty(product.sku, nextQuantity);
    value.textContent = nextQuantity;
  });
  control.append(decrease, value, increase);
  return control;
}

function createAddButton(product, className) {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = 'Add to Cart';
  button.setAttribute('aria-label', `Add ${product.name} to cart`);
  button.addEventListener('click', () => {
    addItem({
      sku: product.sku,
      name: product.name,
      price: parsePrice(product.price),
      image: product.image || '',
      productUrl: product.productUrl || '',
    });
    button.replaceWith(createQuantityControl(product, className));
  });
  return button;
}

export default function createCardAddButton(product, className = 'product-card-add-to-cart') {
  const productWithSku = {
    ...product,
    sku: product.sku || createSlug(product.name),
  };
  if (getItems().some((item) => item.sku === productWithSku.sku)) {
    return createQuantityControl(productWithSku, className);
  }
  return createAddButton(productWithSku, className);
}
