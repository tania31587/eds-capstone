const CART_KEY = 'greenleaf-cart';
const SHIPPING_KEY = 'greenleaf-shipping';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function priceAsNumber(value) {
  return Number(String(value).replace(/[^0-9.]/g, '')) || 0;
}

function formatPrice(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

export function getItems() {
  return readCart();
}

export function getShipping() {
  try {
    return JSON.parse(localStorage.getItem(SHIPPING_KEY)) || { method: 'standard', cost: 99 };
  } catch {
    return { method: 'standard', cost: 99 };
  }
}

export function getTotals(items = getItems()) {
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = getShipping().cost;
  return {
    quantity,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: getTotals(items) }));
}

export function addItem(product) {
  const items = getItems();
  const existingItem = items.find((item) => item.sku === product.sku);
  if (existingItem) existingItem.quantity += 1;
  else items.push({ ...product, price: priceAsNumber(product.price), quantity: 1 });
  writeCart(items);
}

export function removeItem(sku) {
  writeCart(getItems().filter((item) => item.sku !== sku));
}

export function updateQty(sku, quantity) {
  const items = getItems();
  const item = items.find((cartItem) => cartItem.sku === sku);
  if (!item) return;
  if (quantity < 1) removeItem(sku);
  else {
    item.quantity = quantity;
    writeCart(items);
  }
}

export function updateShipping(shipping) {
  localStorage.setItem(SHIPPING_KEY, JSON.stringify(shipping));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: getTotals() }));
}

export { formatPrice };
