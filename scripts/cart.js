const CART_KEY = 'greenleaf-cart';

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

export function getTotals(items = getItems()) {
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { quantity, subtotal, total: subtotal };
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

export { formatPrice };
