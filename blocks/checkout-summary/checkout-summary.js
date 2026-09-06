import {
  clearCart, formatPrice, getItems, getShipping, getTotals, updateShipping,
} from '../../scripts/cart.js';
import { saveOrder } from '../../scripts/orders.js';

function createInput(labelText, type, name) {
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.required = true;
  label.append(input);
  return label;
}

function createShippingForm(onChange, onSubmit) {
  const shipping = getShipping();
  const form = document.createElement('form');
  form.className = 'checkout-shipping-form';
  form.innerHTML = '<h2>Shipping Address</h2>';
  form.append(
    createInput('Full name', 'text', 'name'),
    createInput('Email', 'email', 'email'),
    createInput('Address', 'text', 'address'),
    createInput('City', 'text', 'city'),
    createInput('Postal code', 'text', 'postal-code'),
  );
  const methods = document.createElement('fieldset');
  methods.innerHTML = '<legend>Shipping method</legend>';
  [['standard', 'Standard delivery (3-5 days)', 99], ['express', 'Express delivery (1-2 days)', 199]].forEach(([method, labelText, cost]) => {
    const option = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'shipping-method';
    input.value = method;
    input.checked = shipping.method === method;
    input.addEventListener('change', () => {
      updateShipping({ method, cost });
      onChange();
    });
    option.append(input, document.createTextNode(`${labelText} - ${formatPrice(cost)}`));
    methods.append(option);
  });
  form.append(methods);
  const submit = document.createElement('button');
  submit.className = 'checkout-place-order';
  submit.type = 'submit';
  submit.textContent = 'Place Order';
  form.append(submit);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    onSubmit(new FormData(form));
  });
  return form;
}

export default function decorate(block) {
  const render = () => {
    const items = getItems();
    if (!items.length) {
      block.innerHTML = '<p class="checkout-empty">Your cart is empty. <a href="/pages/category/shop">Continue shopping</a></p>';
      return;
    }
    const totals = getTotals(items);
    const checkout = document.createElement('div');
    checkout.className = 'checkout-summary-layout';
    const heading = document.createElement('h1');
    heading.textContent = 'Checkout';
    const summary = document.createElement('div');
    summary.className = 'checkout-order-summary';
    summary.innerHTML = '<h2>Order Summary</h2>';
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
    total.innerHTML = `Shipping <span>${formatPrice(totals.shipping)}</span><strong>Total ${formatPrice(totals.total)}</strong>`;
    const note = document.createElement('p');
    note.className = 'checkout-summary-note';
    note.textContent = 'This is a demo checkout. No payment will be collected.';
    summary.append(list, total, note);
    const placeOrder = (formData) => {
      const orderNumber = `GL-${Date.now().toString().slice(-6)}`;
      const order = saveOrder({
        id: orderNumber,
        customer: {
          name: formData.get('name'),
          email: formData.get('email'),
        },
        items: items.map((item) => ({ ...item })),
        total: totals.total,
        placedAt: new Date().toISOString(),
        status: 'Order placed',
      });
      sessionStorage.setItem('greenleaf-order-success', JSON.stringify({
        name: order.customer.name,
        orderNumber: order.id,
      }));
      clearCart();
      window.location.assign('/');
    };
    checkout.append(heading, createShippingForm(render, placeOrder), summary);
    block.replaceChildren(checkout);
  };

  render();
}
