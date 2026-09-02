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

export default async function decorate(block) {
  const footerMetadata = getMetadata('footer');
  const footerPath = footerMetadata
    ? new URL(footerMetadata, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const footerContent = document.createElement('div');
  footerContent.className = 'footer-content';

  while (fragment.firstElementChild) {
    footerContent.append(fragment.firstElementChild);
  }

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
