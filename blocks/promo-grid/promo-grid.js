export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'promo-grid-wrapper';

  [...block.children].forEach((row) => {
    const card = document.createElement('div');
    card.className = 'promo-card';

    [...row.children].forEach((cell) => {
      card.append(cell.cloneNode(true));
    });

    wrapper.append(card);
  });

  block.textContent = '';
  block.append(wrapper);
}
