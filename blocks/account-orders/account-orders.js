import { formatPrice } from '../../scripts/cart.js';
import { getOrders } from '../../scripts/orders.js';

function formatOrderDate(placedAt) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(placedAt));
}

export default function decorate(block) {
  const orders = getOrders();
  const accountOrders = document.createElement('div');
  accountOrders.className = 'account-orders';
  accountOrders.innerHTML = '<h1>My Orders</h1><div class="account-orders-list"></div>';
  const list = accountOrders.querySelector('.account-orders-list');
  if (!orders.length) {
    list.innerHTML = '<p class="account-orders-empty">You haven\'t placed any orders yet.<br><a href="/pages/category/shop">Continue Shopping</a></p>';
  } else {
    orders.forEach((order) => {
      const row = document.createElement('article');
      row.innerHTML = `<div class="account-order-left"><h2>${order.id}</h2><p>${formatOrderDate(order.placedAt)} · ${order.items.length} item${order.items.length === 1 ? '' : 's'}</p></div><div class="account-order-right"><strong class="account-order-total">${formatPrice(order.total)}</strong><span class="account-order-status">${order.status}</span></div>`;
      list.append(row);
    });
  }
  block.replaceChildren(accountOrders);
}
