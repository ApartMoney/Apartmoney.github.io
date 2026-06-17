(function () {
  const yearLinks = Array.from(document.querySelectorAll('.remote-year'));
  const eraButtons = document.querySelectorAll('.remote-era');
  const events = Array.from(document.querySelectorAll('.event[data-year]'));

  let lockedHref = null;
  let lockTimer = null;

  function setActiveByHref(href) {
    yearLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
  }

  function jumpTo(id, sourceLink) {
    const el = document.getElementById(id);
    if (!el) return;
    if (sourceLink) {
      lockedHref = sourceLink.getAttribute('href');
      setActiveByHref(lockedHref);
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { lockedHref = null; updateActive(); }, 900);
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (el.classList.contains('event')) {
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    }
  }

  yearLinks.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    jumpTo(a.getAttribute('href').slice(1), a);
  }));
  eraButtons.forEach(btn => btn.addEventListener('click', () => jumpTo(btn.dataset.target)));

  function absTop(el) {
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function updateActive() {
    if (lockedHref) return;
    const probe = window.scrollY + window.innerHeight / 3;
    let curEl = null;
    let curTop = -Infinity;
    for (const ev of events) {
      const t = absTop(ev);
      if (t <= probe && t > curTop) { curEl = ev; curTop = t; }
    }
    if (!curEl) {
      yearLinks.forEach(a => a.classList.remove('active'));
      return;
    }
    const curId = curEl.id;
    const curYear = curEl.dataset.year;
    let match = curId ? yearLinks.find(a => a.getAttribute('href') === '#' + curId) : null;
    if (!match) match = yearLinks.find(a => a.dataset.year === curYear);
    yearLinks.forEach(a => a.classList.toggle('active', a === match));
  }

  let p = false;
  window.addEventListener('scroll', () => {
    if (p) return;
    p = true;
    requestAnimationFrame(() => { updateActive(); p = false; });
  });
  updateActive();

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const i = yearLinks.findIndex(a => a.classList.contains('active'));
    if (e.key === 'j' && i < yearLinks.length - 1) { e.preventDefault(); yearLinks[i + 1].click(); }
    else if (e.key === 'k' && i > 0) { e.preventDefault(); yearLinks[i - 1].click(); }
  });

  let remote = document.getElementById('remote');
  if (!remote) {
    remote = document.querySelector('aside.remote');
    if (remote && !remote.id) remote.id = 'remote';
  }

  let toggle = document.getElementById('remoteToggle');
  if (remote && !toggle) {
    toggle = document.createElement('button');
    toggle.id = 'remoteToggle';
    toggle.className = 'remote-toggle';
    toggle.setAttribute('aria-label', '연도 점프 메뉴');
    toggle.textContent = '📅';
    document.body.appendChild(toggle);
  }

  let backdrop = document.querySelector('.remote-backdrop');
  if (remote && !backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'remote-backdrop';
    document.body.appendChild(backdrop);
  }

  function openRemote() {
    if (!remote) return;
    remote.classList.add('show');
    if (backdrop) backdrop.classList.add('show');
  }
  function closeRemote() {
    if (!remote) return;
    remote.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      remote.classList.contains('show') ? closeRemote() : openRemote();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeRemote);

  yearLinks.forEach(a => a.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 640px)').matches) closeRemote();
  }));
  eraButtons.forEach(btn => btn.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 640px)').matches) closeRemote();
  }));
})();
