import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function updateCopyrightYear(container) {
  const currentYear = String(new Date().getFullYear());

  container.querySelectorAll('p').forEach((paragraph) => {
    if (paragraph.textContent.includes('{year}')) {
      paragraph.textContent = paragraph.textContent.replace(
        '{year}',
        currentYear,
      );
    }
  });
}

function isDefaultAdobeFooter(fragment) {
  return fragment.textContent.includes('Adobe. All rights reserved.');
}

function createAuthoredFooter(fragment) {
  const source = fragment.querySelector('.default-content-wrapper');
  const content = document.createElement('div');
  content.className = 'footer-content';
  if (!source) return content;

  const elements = [...source.children];
  const brand = document.createElement('section');
  brand.className = 'footer-brand';
  const firstList = elements.findIndex((element) => element.tagName === 'UL');
  elements
    .slice(
      0,
      firstList < 0 ? elements.length : firstList - 1,
    )
    .forEach((element) => {
      brand.append(element);
    });
  if (brand.children.length) content.append(brand);

  for (let index = Math.max(0, firstList - 1); index < elements.length; index += 1) {
    const heading = elements[index];
    const list = elements[index + 1];
    if (heading?.tagName === 'P' && list?.tagName === 'UL') {
      const section = document.createElement('section');
      const title = document.createElement('h2');
      title.textContent = heading.textContent;
      section.append(title, list);
      content.append(section);
      index += 1;
    } else if (heading?.tagName === 'P') {
      const copyright = document.createElement('p');
      copyright.className = 'footer-copyright';
      copyright.textContent = heading.textContent;
      content.append(copyright);
    }
  }
  return content;
}

function createStorefrontFooter() {
  const content = document.createElement('div');
  content.className = 'storefront-footer';
  content.innerHTML = `
    <div class="storefront-footer-main">
      <section class="storefront-footer-contact">
        <h2>Contact us</h2>
        <a href="mailto:hello@greenleafstore.com">hello@greenleafstore.com</a>
        <a href="tel:+14081234567">+1 (408) 123 4567</a>
      </section>
      <section><h3>Categories</h3><a href="/pages/category/plants">Plants</a><a href="/pages/category/seeds">Seeds</a><a href="/pages/category/shop">Shop all</a></section>
      <section><h3>Company</h3><a href="/">About</a><a href="/">Stories</a><a href="/">Careers</a><a href="/">Stores</a></section>
      <section><h3>Help &amp; Support</h3><a href="/">FAQs</a><a href="/">Contact us</a><a href="/">Returns</a><a href="/">Shipping</a></section>
      <section><h3>Follow us</h3><a href="https://twitter.com/">Twitter</a><a href="https://instagram.com/">Instagram</a><a href="https://facebook.com/">Facebook</a><a href="https://linkedin.com/">LinkedIn</a></section>
    </div>
    <div class="storefront-footer-bottom">
      <div class="storefront-footer-social" aria-label="Social media"><a href="https://facebook.com/">Facebook</a><a href="https://x.com/">X</a><a href="https://instagram.com/">Instagram</a><a href="https://youtube.com/">YouTube</a></div>
      <p>Copyright © {year} GreenLeaf Store</p>
      <div class="storefront-footer-payments" aria-label="Accepted payment methods"><span>VISA</span><span>AMEX</span><span>Mastercard</span><span>PayPal</span><span>G Pay</span></div>
    </div>`;
  return content;
}

export default async function decorate(block) {
  const footerMetadata = getMetadata('footer');
  const footerPath = footerMetadata
    ? new URL(footerMetadata, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath, { includeFragments: false });

  block.textContent = '';

  const footerContent = isDefaultAdobeFooter(fragment)
    ? createStorefrontFooter()
    : createAuthoredFooter(fragment);

  footerContent.querySelectorAll('a').forEach((link) => {
    const url = new URL(link.href, window.location.origin);

    if (url.origin !== window.location.origin) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });

  updateCopyrightYear(footerContent);
  block.append(footerContent);
}
