const WA = '31616311063';
const CATS = ['All', 'Earrings', 'Necklaces & Sets', 'Bangles & Bracelets', 'Anklets', 'Rings', 'Head Jewelry'];

const grid = document.getElementById('grid');
const chipsEl = document.getElementById('chips');
const searchEl = document.getElementById('search');
const sortEl = document.getElementById('sort');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');

let activeCat = 'All';

function waLink(name) {
  return `https://wa.me/${WA}?text=${encodeURIComponent('Hi Jewelghar, I want to order ' + name)}`;
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
  if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
  else if (sort === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = items.map(p => `
    <article class="card">
      <div class="card-img" data-id="${p.id}">
        <img src="images/${p.id}.webp" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="card-row">
          <p class="price">${priceHtml(p)}</p>
          <a class="order" href="${waLink(p.name)}" target="_blank" rel="noopener">Order</a>
        </div>
      </div>
    </article>`).join('');

  countEl.textContent = `${items.length} piece${items.length === 1 ? '' : 's'}`;
  emptyEl.hidden = items.length > 0;
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
  renderChips();
  render();
});
searchEl.addEventListener('input', render);
sortEl.addEventListener('change', render);

/* modal */
const modal = document.getElementById('modal');
const mImg = document.getElementById('modal-img');
const mName = document.getElementById('modal-name');
const mPrice = document.getElementById('modal-price');
const mOrder = document.getElementById('modal-order');

grid.addEventListener('click', e => {
  const imgWrap = e.target.closest('.card-img');
  if (!imgWrap) return;
  const p = PRODUCTS.find(x => x.id === imgWrap.dataset.id);
  if (!p) return;
  mImg.src = `images/${p.id}.webp`;
  mImg.alt = p.name;
  mName.textContent = p.name;
  mPrice.innerHTML = priceHtml(p);
  mOrder.href = waLink(p.name);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
});
modal.addEventListener('click', e => {
  if (e.target.hasAttribute('data-close')) {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
renderChips();
render();
