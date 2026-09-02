export default function decorate(block) {
  const picture = block.querySelector('picture');
  const heading = block.querySelector('h1, h2');
  const paragraphs = [...block.querySelectorAll('p')];
  const cta = block.querySelector('a');

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

  if (heading) {
    heading.id = 'home-hero-title';
    content.append(heading);
  }

  const subtitle = paragraphs.find((paragraph) => !paragraph.contains(cta));

  if (subtitle) {
    subtitle.classList.add('hero-subtitle');
    content.append(subtitle);
  }

  if (cta) {
    cta.classList.add('hero-cta');
    content.append(cta);
  }

  hero.append(content);

  block.textContent = '';
  block.append(hero);
}
