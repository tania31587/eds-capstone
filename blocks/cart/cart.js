import {
  formatPrice, getItems, getTotals, removeItem, updateQty,
} from '../../scripts/cart.js';

const CART_KEY = 'greenleaf-cart';

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return [];
  }

  return JSON.parse(cart);
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart(block) {
  const items = getItems();
  const cart = document.createElement('div');
  cart.className = 'cart-layout';
  const content = document.createElement('div');
  content.className = 'cart-items';
  const heading = document.createElement('h1');
  heading.textContent = 'Your Cart';
  content.append(heading);

  if (!items.length) {
    const message = document.createElement('p');
    message.textContent = 'Your cart is empty.';
    content.append(message);
  } else {
    items.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'cart-item';
      if (item.image) {
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        row.append(image);
      }
      const details = document.createElement('div');
      details.className = 'cart-item-details';
      details.innerHTML = `<h2>${item.name}</h2><p>${formatPrice(item.price)}</p>`;
      const unitPrice = document.createElement('p');
      unitPrice.className = 'cart-item-unit-price';
      unitPrice.textContent = formatPrice(item.price);
      const quantity = document.createElement('input');
      quantity.className = 'cart-item-quantity';
      quantity.type = 'number';
      quantity.min = '1';
      quantity.value = item.quantity;
      quantity.setAttribute('aria-label', `Quantity for ${item.name}`);
      quantity.addEventListener('change', () => {
        updateQty(item.sku, Number(quantity.value));
        renderCart(block);
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        removeItem(item.sku);
        renderCart(block);
      });
      remove.setAttribute('aria-label', `Remove ${item.name} from cart`);
      const lineTotal = document.createElement('strong');
      lineTotal.className = 'cart-item-total';
      lineTotal.textContent = formatPrice(item.price * item.quantity);
      row.append(details, unitPrice, quantity, lineTotal, remove);
      content.append(row);
    });
  }

  const totals = getTotals(items);
  const summary = document.createElement('aside');
  summary.className = 'cart-summary';
  summary.innerHTML = `<h2>Order Summary</h2><p><span>Subtotal</span><strong>${formatPrice(totals.subtotal)}</strong></p><p><span>Discount</span><span>₹0</span></p><p><span>Shipping</span><span>${formatPrice(totals.shipping)}</span></p><p class="cart-total"><span>Total</span><strong>${formatPrice(totals.total)}</strong></p>`;
  const continueShopping = document.createElement('a');
  continueShopping.className = 'cart-continue-shopping';
  continueShopping.href = '/pages/category/shop';
  continueShopping.textContent = 'Continue Shopping';
  const checkout = document.createElement('a');
  checkout.className = 'cart-checkout';
  checkout.href = '/pages/checkout';
  checkout.textContent = 'Proceed to Checkout';
  summary.append(continueShopping, checkout);
  cart.append(content, summary);
  block.replaceChildren(cart);
}

export default function decorate(block) {
  renderCart(block);
  window.addEventListener('cart:updated', () => renderCart(block));
}
