export default function decorate(block) {
  const section = block.closest('.section');

  const gallery = section.querySelector('.product-gallery');
  const details = section.querySelector('.product-details');

  if (!gallery || !details) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'product-pdp-layout';

  gallery.parentElement.insertBefore(wrapper, gallery);

  wrapper.append(gallery);
  wrapper.append(details);
}
