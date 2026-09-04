function createPromoCard(row) {
  const cells = [...row.children];

  const picture = row.querySelector('picture');
  const headingSource = row.querySelector('h2, h3, h4')
    || cells[1]?.firstElementChild;
  const descriptionSource = cells[2]?.firstElementChild;
  const linkSource = row.querySelector('a');

  const card = document.createElement('article');
  card.className = 'promo-card';

  if (picture) {
    const media = document.createElement('div');
    media.className = 'promo-card-media';
    media.append(picture);
    card.append(media);
  }

  const content = document.createElement('div');
  content.className = 'promo-card-content';

  if (headingSource) {
    const heading = document.createElement('h3');
    heading.className = 'promo-card-title';

    const cleanTitle = headingSource.textContent
      .replace(/^#+\s*/, '')
      .trim();

    heading.textContent = cleanTitle;
    content.append(heading);
  }

  if (descriptionSource) {
    const description = document.createElement('p');
    description.className = 'promo-card-description';
    description.textContent = descriptionSource.textContent.trim();
    content.append(description);
  }

  if (linkSource) {
    const link = linkSource.cloneNode(true);
    link.className = 'promo-card-link';
    content.append(link);
  }

  card.append(content);

  return card;
}

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'promo-grid-layout';

  [...block.children].forEach((row) => {
    grid.append(createPromoCard(row));
  });

  block.textContent = '';
  block.append(grid);
}
