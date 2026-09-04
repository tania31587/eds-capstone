export default function decorate(block) {
  const images = [...block.querySelectorAll('picture')];

  if (!images.length) {
    return;
  }

  const gallery = document.createElement('div');
  gallery.className = 'product-gallery';

  const thumbs = document.createElement('div');
  thumbs.className = 'product-gallery-thumbs';

  const main = document.createElement('div');
  main.className = 'product-gallery-main';

  const activeImage = images[0].cloneNode(true);

  main.append(activeImage);

  images.forEach((picture) => {
    const thumb = picture.cloneNode(true);

    thumb.addEventListener('click', () => {
      main.innerHTML = '';
      main.append(picture.cloneNode(true));
    });

    thumbs.append(thumb);
  });

  gallery.append(thumbs);
  gallery.append(main);

  block.textContent = '';
  block.append(gallery);
}
