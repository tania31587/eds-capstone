const orders = [{
  id: 'GL-10024', date: '5 Sep 2026', status: 'Delivered', total: '₹498', items: 2,
}];

export default function decorate(block) {
  const accountOrders = document.createElement('div');
  accountOrders.className = 'account-orders';
  accountOrders.innerHTML = '<h1>Orders</h1><div class="account-orders-list"></div>';
  const list = accountOrders.querySelector('.account-orders-list');
  orders.forEach((order) => {
    const row = document.createElement('article');
    row.innerHTML = `<strong>${order.id}</strong><span>${order.date}</span><span>${order.items} items</span><span>${order.status}</span><strong>${order.total}</strong>`;
    list.append(row);
  });
  block.replaceChildren(accountOrders);
}
