export default function decorate(block) {
  const items = [...block.children].map((row, index) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || `System ${index + 1}`;
    const detail = cells[1]?.innerHTML || '';
    const metric = cells[2]?.textContent.trim() || String(index + 1).padStart(2, '0');

    const item = document.createElement('li');
    item.innerHTML = `
      <span class="system-map-index">${metric}</span>
      <div>
        <h3>${title}</h3>
        <div class="system-map-detail">${detail}</div>
      </div>
    `;
    return item;
  });

  const list = document.createElement('ol');
  list.append(...items);
  block.replaceChildren(list);
}
