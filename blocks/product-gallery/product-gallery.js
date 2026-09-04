function setActiveThumbnail(thumbnails, activeThumbnail) {
  thumbnails.forEach((thumbnail) => {
    thumbnail.classList.toggle(
      'is-active',
      thumbnail === activeThumbnail,
    );
  });
}

export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];

  if (!pictures.length) {
    return;
  }

  const gallery = document.createElement('div');
  gallery.className = 'product-gallery-layout';

  const thumbnails = document.createElement('div');
  thumbnails.className = 'product-gallery-thumbnails';
  thumbnails.setAttribute('aria-label', 'Product images');

  const main = document.createElement('div');
  main.className = 'product-gallery-main';

  const mainPicture = pictures[0].cloneNode(true);
  main.append(mainPicture);

  const thumbnailButtons = pictures.map((picture, index) => {
    const button = document.createElement('button');
    button.className = 'product-gallery-thumbnail';
    button.type = 'button';
    button.setAttribute(
      'aria-label',
      `View product image ${index + 1}`,
    );

    const thumbnailPicture = picture.cloneNode(true);
    button.append(thumbnailPicture);

    button.addEventListener('click', () => {
      main.replaceChildren(picture.cloneNode(true));
      setActiveThumbnail(thumbnailButtons, button);
    });

    thumbnails.append(button);
    return button;
  });

  setActiveThumbnail(thumbnailButtons, thumbnailButtons[0]);

  gallery.append(thumbnails, main);

  block.textContent = '';
  block.append(gallery);

  const section = block.closest('.section');

  if (section) {
    section.classList.add('pdp-top-section');
  }
}
