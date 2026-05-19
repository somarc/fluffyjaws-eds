export default function decorate(block) {
  const rows = [...block.children];
  const eyebrow = rows[0]?.textContent.trim();
  const title = rows[1]?.textContent.trim();
  const body = rows[2]?.innerHTML;

  block.innerHTML = `
    <div class="callout-band-copy">
      ${eyebrow ? `<p class="callout-band-eyebrow">${eyebrow}</p>` : ''}
      ${title ? `<h2>${title}</h2>` : ''}
      ${body ? `<div>${body}</div>` : ''}
    </div>
    <div class="callout-band-panel" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>
  `;
}
