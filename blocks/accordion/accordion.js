export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    const [question, answer] = row.children;
    if (!question || !answer) return;

    const panelId = `accordion-panel-${index + 1}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'accordion-trigger';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);
    button.append(...question.childNodes);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.id = panelId;
    panel.hidden = true;
    panel.append(...answer.childNodes);

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      panel.hidden = isExpanded;
    });

    row.replaceChildren(button, panel);
  });
}
