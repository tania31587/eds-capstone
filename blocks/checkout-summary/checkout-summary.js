import { formatPrice, getItems, getTotals } from '../../scripts/cart.js';

export default function decorate(block) {
  const items = getItems();
  const totals = getTotals(items);
  const checkout = document.createElement('div');
  checkout.className = 'checkout-summary-layout';
  const heading = document.createElement('h1');
  heading.textContent = 'Checkout';
  checkout.append(heading);
  const list = document.createElement('div');
  list.className = 'checkout-summary-items';
  items.forEach((item) => {
    const row = document.createElement('p');
    row.textContent = `${item.name} x ${item.quantity}`;
    const price = document.createElement('strong');
    price.textContent = formatPrice(item.price * item.quantity);
    row.append(price);
    list.append(row);
  });
  const total = document.createElement('p');
  total.className = 'checkout-summary-total';
  total.innerHTML = `Estimated total <strong>${formatPrice(totals.total)}</strong>`;
  const nextSteps = document.createElement('p');
  nextSteps.className = 'checkout-summary-note';
  nextSteps.textContent = 'This is a demo checkout. No payment will be collected.';
  checkout.append(list, total, nextSteps);
  block.replaceChildren(checkout);
}
