import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(event) {
  if (event.code === 'Escape') {
    const nav = document.getElementById('nav');
    const button = document.querySelector('.nav-hamburger button');

    nav.setAttribute('aria-expanded', 'false');
    button?.setAttribute('aria-label', 'Open navigation');
  }
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? forceExpanded
    : nav.getAttribute('aria-expanded') !== 'true';

  const button = nav.querySelector('.nav-hamburger button');

  nav.setAttribute('aria-expanded', String(expanded));
  button?.setAttribute(
    'aria-label',
    expanded ? 'Close navigation' : 'Open navigation',
  );

  document.body.style.overflowY = expanded && !isDesktop.matches
    ? 'hidden'
    : '';
}

function createCartLink(tools) {
  let cartLink = tools.querySelector('a[href="/cart"]');

  if (!cartLink) {
    cartLink = document.createElement('a');
    cartLink.href = '/cart';
    cartLink.textContent = 'Cart';
    tools.append(cartLink);
  }

  cartLink.classList.add('nav-cart');
  cartLink.setAttribute('aria-label', 'Shopping cart, 0 items');

  if (!cartLink.querySelector('.nav-cart-count')) {
    const count = document.createElement('span');
    count.className = 'nav-cart-count';
    count.dataset.cartCount = '';
    count.textContent = '0';
    count.setAttribute('aria-hidden', 'true');
    cartLink.append(count);
  }
}

export default async function decorate(block) {
  const navMetadata = getMetadata('nav');
  const navPath = navMetadata
    ? new URL(navMetadata, window.location).pathname
    : '/nav';

  const fragment = await loadFragment(navPath);
  const sections = [...fragment.children];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.setAttribute('aria-expanded', 'false');

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';

  const hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.innerHTML = '<span></span>';

  hamburgerButton.addEventListener('click', () => toggleMenu(nav));
  hamburger.append(hamburgerButton);

  const brand = sections[0] || document.createElement('div');
  brand.classList.add('nav-brand');

  const navigation = sections[1] || document.createElement('div');
  navigation.classList.add('nav-sections');

  const tools = sections[2] || document.createElement('div');
  tools.classList.add('nav-tools');

  const brandLink = brand.querySelector('a');

  if (brandLink) {
    brandLink.classList.add('nav-logo');
    brandLink.setAttribute('aria-label', 'GreenLeaf Store home');
  }

  createCartLink(tools);

  nav.append(hamburger, brand, navigation, tools);

  nav.addEventListener('keydown', closeOnEscape);

  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, false);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);

  block.textContent = '';
  block.append(wrapper);
}
