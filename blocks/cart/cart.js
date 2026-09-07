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
    message.innerHTML = 'Your cart is empty.<br><a href="/pages/category/shop">Continue Shopping</a>';
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
      details.innerHTML = `<h2>${item.name}</h2><p>${formatPrice(item.price)} each</p>`;
      const quantity = document.createElement('div');
      quantity.className = 'cart-item-quantity';
      quantity.setAttribute('aria-label', `Quantity for ${item.name}`);
      const decrease = document.createElement('button');
      decrease.type = 'button';
      decrease.textContent = '−';
      decrease.setAttribute('aria-label', `Remove one ${item.name}`);
      const value = document.createElement('span');
      value.textContent = item.quantity;
      const increase = document.createElement('button');
      increase.type = 'button';
      increase.textContent = '+';
      increase.setAttribute('aria-label', `Add one ${item.name}`);
      decrease.addEventListener('click', () => {
        if (item.quantity === 1) removeItem(item.sku);
        else updateQty(item.sku, item.quantity - 1);
        renderCart(block);
      });
      increase.addEventListener('click', () => {
        updateQty(item.sku, item.quantity + 1);
        renderCart(block);
      });
      quantity.append(decrease, value, increase);
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
      row.append(details, quantity, lineTotal, remove);
      content.append(row);
    });
  }

  if (items.length) {
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
  } else {
    cart.classList.add('cart-layout-empty');
    cart.append(content);
  }
  block.replaceChildren(cart);
}

export default function decorate(block) {
  renderCart(block);
  window.addEventListener('cart:updated', () => renderCart(block));
}
