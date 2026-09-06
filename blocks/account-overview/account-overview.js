import { getOrders } from '../../scripts/orders.js';

export default function decorate(block) {
  const orders = getOrders();
  const latestOrder = orders[0];
  const customer = latestOrder?.customer || {};
  const initial = customer.name?.trim().charAt(0).toUpperCase() || 'G';
  const name = customer.name || 'GreenLeaf customer';
  const email = customer.email || 'Place an order to see your account details.';
  const latestOrderLabel = latestOrder ? latestOrder.id : '-';

  block.innerHTML = `<div class="account-overview">
    <h1>My Account</h1>
    <section class="account-profile">
      <span class="account-avatar" aria-hidden="true">${initial}</span>
      <div class="account-user-info"><h2>${name}</h2><p>${email}</p></div>
    </section>
    <div class="account-stats">
      <div class="account-stat-card"><strong>${orders.length}</strong><span>Total Orders</span></div>
      <div class="account-stat-card"><strong>${latestOrderLabel}</strong><span>Latest Order</span></div>
    </div>
    <div class="account-orders-link"><a href="/pages/account-orders">My Orders</a></div>
  </div>`;
}
