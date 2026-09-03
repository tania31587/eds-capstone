export default function decorate(block) {
  const rows = [...block.children];

  const picture = rows[0]?.querySelector('picture');
  const titleSource = rows[1]?.querySelector('h1, h2, h3')
    || rows[1]?.firstElementChild;
  const descriptionSource = rows[2]?.querySelector('p')
    || rows[2]?.firstElementChild;
  const ctaSource = rows[3]?.querySelector('a');

  const hero = document.createElement('section');
  hero.className = 'hero-layout';
  hero.setAttribute('aria-labelledby', 'home-hero-title');

  if (picture) {
    const media = document.createElement('div');
    media.className = 'hero-media';
    media.append(picture);
    hero.append(media);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (titleSource) {
    const title = document.createElement('h1');
    title.id = 'home-hero-title';
    title.className = 'hero-title';
    title.textContent = titleSource.textContent.trim();
    content.append(title);
  }

  if (descriptionSource) {
    const description = document.createElement('p');
    description.className = 'hero-description';
    description.textContent = descriptionSource.textContent.trim();
    content.append(description);
  }

  if (ctaSource) {
    const cta = ctaSource.cloneNode(true);
    cta.className = 'hero-cta';
    content.append(cta);
  }

  hero.append(content);

  block.textContent = '';
  block.append(hero);
}
