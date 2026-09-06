const ORDER_HISTORY_KEY = 'greenleaf-orders';

function readOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export function getOrders() {
  return readOrders();
}

export function saveOrder(order) {
  const orders = readOrders();
  orders.unshift(order);
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
  return order;
}
