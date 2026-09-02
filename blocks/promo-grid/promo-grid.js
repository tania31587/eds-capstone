export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'promo-grid-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const image = row.querySelector('picture');
    const heading = row.querySelector('h2, h3, h4');
    const description = [...row.querySelectorAll('p')]
      .find((paragraph) => !paragraph.querySelector('a'));
    const link = row.querySelector('a');

    const item = document.createElement('li');
    item.className = 'promo-card';

    if (image) {
      const media = document.createElement('div');
      media.className = 'promo-card-media';
      media.append(image);
      item.append(media);
    }

    const content = document.createElement('div');
    content.className = 'promo-card-content';

    if (heading) {
      content.append(heading);
    }

    if (description) {
      content.append(description);
    }

    if (link) {
      link.classList.add('promo-card-link');
      content.append(link);
    }

    item.append(content);
    list.append(item);

    cells.forEach((cell) => cell.remove());
    row.remove();
  });

  block.textContent = '';
  block.append(list);
}
