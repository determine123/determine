/* Calendar uses publication dates already rendered by Jekyll, never synthetic activity. */
(() => {
  function initialize() {
    const calendar = document.querySelector('[data-thought-calendar]');
    if (!calendar || calendar.dataset.ready) return;
    calendar.dataset.ready = 'true';
    const today = new Date(`${calendar.dataset.today}T00:00:00Z`);
    if (!Number.isFinite(today.getTime())) return;
    const records = new Map();
    calendar.querySelectorAll('[data-calendar-records] a[data-date]').forEach(link => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(link.dataset.date)) return;
      const items = records.get(link.dataset.date) || [];
      items.push({title: link.textContent.trim(), href: link.getAttribute('href')});
      records.set(link.dataset.date, items);
    });
    // End on Saturday; leave future cells empty rather than implying future publications.
    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + 6 - end.getUTCDay());
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 363);
    const fragment = document.createDocumentFragment();
    let count = 0;
    for (let i = 0; i < 364; i++) {
      const date = new Date(start);
      date.setUTCDate(date.getUTCDate() + i);
      const key = date.toISOString().slice(0, 10);
      const items = date <= today ? (records.get(key) || []) : [];
      const cell = document.createElement(items.length ? 'a' : 'span');
      cell.className = 'thought-day';
      cell.dataset.count = String(items.length);
      if (items.length) {
        cell.dataset.level = String(Math.min(3, items.length));
        cell.setAttribute('href', items[0].href);
      }
      const label = `${key} · ${items.length} 条记录${items.length ? '：' + items.map(item => item.title).join('；') : ''}`;
      cell.title = label;
      if (items.length) cell.setAttribute('aria-label', label);
      else cell.setAttribute('aria-hidden', 'true');
      if (date > today) cell.style.opacity = '0.25';
      fragment.append(cell);
      count += items.length;
    }
    calendar.querySelector('.thought-calendar-grid').replaceChildren(fragment);
    calendar.querySelector('[data-calendar-caption]').textContent = `${start.toISOString().slice(0, 10)} — ${calendar.dataset.today} · ${count} 条公开记录`;
  }
  initialize();
  document.addEventListener('site:page', initialize);
})();
