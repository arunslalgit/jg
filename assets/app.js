const WA = '31616311063';
const CATS = ['All', 'Earrings', 'Necklaces & Sets', 'Bangles & Bracelets', 'Anklets', 'Rings', 'Head Jewelry'];

const grid = document.getElementById('grid');
const chipsEl = document.getElementById('chips');
const searchEl = document.getElementById('search');
const sortEl = document.getElementById('sort');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');

let activeCat = 'All';
const PAGE = 24;
let limit = PAGE;

function waLink(p) {
  const price = `€${p.price}${p.unit ? ' ' + p.unit : ''}`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Jewelghar, I want to order #${p.num} ${p.name} (${price})`)}`;
}

function priceHtml(p) {
  return `€${p.price}${p.unit ? ` <small>${p.unit}</small>` : ''}`;
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  let items = PRODUCTS.filter(p =>
    (activeCat === 'All' || p.cat === activeCat) &&
    (!q || p.name.toLowerCase().includes(q))
  );
  const sort = sortEl.value;
  if (sort === 'featured') items = [...items].sort((a, b) => (a.sold ? 1 : 0) - (b.sold ? 1 : 0));
  if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
  else if (sort === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name));

  const shown = items.slice(0, limit);
  grid.innerHTML = shown.map(p => `
    <article class="card${p.sold ? ' is-sold' : ''}">
      <div class="card-img" data-id="${p.id}">
        <img src="images/${p.id}.webp" alt="${p.name}" loading="lazy">
        ${p.photos > 1 ? `<img class="alt" data-src="images/${p.id}-2.webp" alt="">` : ''}
        ${p.sold ? '<span class="sold-badge">Sold out</span>' : ''}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="card-row">
          <p class="price">${priceHtml(p)}</p>
          ${p.sold
            ? '<span class="order sold">Sold out</span>'
            : `<a class="order" href="${waLink(p)}" target="_blank" rel="noopener">Order</a>`}
        </div>
      </div>
    </article>`).join('');

  countEl.textContent = `${items.length} piece${items.length === 1 ? '' : 's'}`;
  emptyEl.hidden = items.length > 0;
  const moreBtn = document.getElementById('show-more');
  if (items.length > shown.length) {
    moreBtn.hidden = false;
    moreBtn.textContent = `Show all ${items.length} pieces`;
  } else {
    moreBtn.hidden = true;
  }
}

function renderChips() {
  chipsEl.innerHTML = CATS.map(c => {
    const n = c === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c).length;
    return `<button class="chip${c === activeCat ? ' active' : ''}" data-cat="${c}">${c}<span class="n">${n}</span></button>`;
  }).join('');
}

chipsEl.addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  activeCat = b.dataset.cat;
  limit = PAGE;
  renderChips();
  render();
});
searchEl.addEventListener('input', () => { limit = PAGE; render(); });
document.getElementById('show-more').addEventListener('click', () => {
  limit = Infinity;
  render();
});

/* mobile menu */
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
navToggle.addEventListener('click', () => {
  mobileMenu.hidden = !mobileMenu.hidden;
  navToggle.setAttribute('aria-expanded', String(!mobileMenu.hidden));
});
mobileMenu.addEventListener('click', e => {
  if (e.target.closest('a')) {
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
sortEl.addEventListener('change', render);

/* modal */
const modal = document.getElementById('modal');
const mImg = document.getElementById('modal-img');
const mName = document.getElementById('modal-name');
const mPrice = document.getElementById('modal-price');
const mOrder = document.getElementById('modal-order');

grid.addEventListener('mouseover', e => {
  const alt = e.target.closest('.card')?.querySelector('img.alt[data-src]');
  if (alt) {
    alt.src = alt.dataset.src;
    alt.removeAttribute('data-src');
  }
});

grid.addEventListener('click', e => {
  const imgWrap = e.target.closest('.card-img');
  if (!imgWrap) return;
  const p = PRODUCTS.find(x => x.id === imgWrap.dataset.id);
  if (!p) return;
  openProduct(p);
});

function openProduct(p) {
  history.replaceState(null, '', '#p=' + p.id);
  document.getElementById('modal-num').textContent = '#' + p.num;
  mImg.src = `images/${p.id}.webp`;
  mImg.alt = p.name;
  const thumbs = document.getElementById('modal-thumbs');
  if (p.photos > 1) {
    const srcs = [`images/${p.id}.webp`];
    for (let i = 2; i <= p.photos; i++) srcs.push(`images/${p.id}-${i}.webp`);
    thumbs.innerHTML = srcs.map((s, i) =>
      `<img src="${s}" class="${i === 0 ? 'active' : ''}" alt="${p.name} photo ${i + 1}">`).join('');
    thumbs.hidden = false;
    thumbs.onclick = e => {
      const t = e.target.closest('img');
      if (!t) return;
      mImg.src = t.src;
      thumbs.querySelectorAll('img').forEach(x => x.classList.toggle('active', x === t));
    };
  } else {
    thumbs.hidden = true;
    thumbs.innerHTML = '';
  }
  mName.textContent = p.name;
  mPrice.innerHTML = priceHtml(p);
  if (p.sold) {
    mOrder.textContent = 'Sold out';
    mOrder.classList.add('sold');
    mOrder.removeAttribute('href');
  } else {
    mOrder.textContent = 'Order via WhatsApp';
    mOrder.classList.remove('sold');
    mOrder.href = waLink(p);
  }
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

document.getElementById('ed-cta').addEventListener('click', () => {
  const p = PRODUCTS.find(x => x.id === 'emerald-comet-earrings');
  if (p) openProduct(p);
});
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  history.replaceState(null, '', location.pathname + location.search);
}
modal.addEventListener('click', e => {
  if (e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

/* share */
document.getElementById('modal-share').addEventListener('click', async e => {
  const btn = e.currentTarget;
  const id = location.hash.replace('#p=', '');
  const p = PRODUCTS.find(x => x.id === id);
  const url = `https://www.jewelghar.com/p/${id}.html`;
  const data = { title: p ? `${p.name} — Jewel Ghar Amsterdam` : 'Jewel Ghar Amsterdam', url };
  if (navigator.share) {
    try { await navigator.share(data); } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(url);
      const t = btn.textContent;
      btn.textContent = 'Link copied!';
      setTimeout(() => { btn.textContent = t; }, 1600);
    } catch {}
  }
});

/* deep link: /#p=<id> opens the piece */
(function () {
  const m = location.hash.match(/^#p=([a-z0-9-]+)$/);
  if (!m) return;
  const p = PRODUCTS.find(x => x.id === m[1]);
  if (p) openProduct(p);
})();

document.getElementById('year').textContent = new Date().getFullYear();
renderChips();
render();
