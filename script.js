const BULAN = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER'];

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kategoriLabel = c => c ? String(c).charAt(0).toUpperCase() + String(c).slice(1) : '';

function keTanggal(iso) {
  const teks = String(iso || '');
  let d = new Date(teks);
  if (isNaN(d) && /^\d{4}-\d{2}-\d{2}$/.test(teks)) d = new Date(teks + 'T00:00:00');
  return isNaN(d) ? null : d;
}
function tanggalPanjang(iso) {
  const d = keTanggal(iso);
  if (!d) return String(iso || '');
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
function tanggalPendek(iso) {
  const d = keTanggal(iso);
  if (!d) return String(iso || '');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${String(d.getFullYear()).slice(-2)}`;
}

/* ---------- data tulisan ---------- */
let ARTIKEL = {};

async function muatTulisan() {
  const res = await fetch('content/posts.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('content/posts.json tidak bisa dibaca');
  const daftar = await res.json();
  const urut = daftar.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  urut.forEach(p => { ARTIKEL[p.id] = p; });
  return urut;
}

function kartuUtama(p) {
  const tag = esc(String(p.category || '').toUpperCase());
  const gambar = p.cover
    ? `<div class="feature-image"><img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy"><span class="image-tag">${tag}</span></div>`
    : `<div class="feature-image feature-image-empty"><span class="image-tag">${tag}</span></div>`;
  return `<a class="feature-card" href="#artikel" data-article="${esc(p.id)}">
      ${gambar}
      <div class="feature-meta"><span>${tanggalPanjang(p.date)}</span><span>${esc(p.readingTime || 3)} MENIT BACA</span></div>
      <h3>${esc(p.title)}</h3><p>${esc(p.excerpt || (p.body && p.body[0]) || '')}</p>
      <span class="card-arrow">Baca cerita <span>↗</span></span>
    </a>`;
}

function barisArsip(p) {
  return `<a class="archive-row" href="#artikel" data-article="${esc(p.id)}">
      <span class="archive-date">${tanggalPendek(p.date)}</span>
      <span class="archive-title">${esc(p.title)}</span>
      <span class="archive-category">${esc(kategoriLabel(p.category))}</span>
      <span class="archive-arrow">↗</span>
    </a>`;
}

function render(daftar) {
  const grid = document.querySelector('.featured-grid');
  if (grid) grid.innerHTML = daftar.slice(0, 3).map(kartuUtama).join('');

  const arsip = document.querySelector('#archive-list');
  if (arsip) arsip.innerHTML = daftar.map(barisArsip).join('');

  const kosong = document.querySelector('#empty-state');
  if (kosong) kosong.hidden = daftar.length > 0;
}

/* ---------- dialog artikel ---------- */
function bukaArtikel(id) {
  const article = ARTIKEL[id];
  if (!article) return;
  const dialog = document.querySelector('.article-dialog');
  dialog.querySelector('.article-category').textContent = String(article.category || '').toUpperCase();
  dialog.querySelector('h2').textContent = article.title;
  dialog.querySelector('.article-date').textContent = `${tanggalPanjang(article.date)} · ${article.readingTime || 3} MENIT BACA`;
  dialog.querySelector('.article-body').innerHTML = (article.body || []).map(t => `<p>${esc(t)}</p>`).join('');
  dialog.showModal();
}

document.addEventListener('click', e => {
  const pemicu = e.target.closest('[data-article]');
  if (pemicu) {
    e.preventDefault();
    bukaArtikel(pemicu.dataset.article);
  }
});

document.querySelector('.article-close').addEventListener('click', () => document.querySelector('.article-dialog').close());
document.querySelector('.article-dialog').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});

/* ---------- galeri ---------- */
document.querySelectorAll('.photo').forEach(photo => photo.addEventListener('click', () => {
  const box = document.querySelector('.lightbox');
  box.querySelector('img').src = photo.dataset.photo;
  box.querySelector('img').alt = photo.dataset.caption;
  box.querySelector('p').textContent = photo.dataset.caption;
  box.showModal();
}));
document.querySelector('.lightbox-close').addEventListener('click', () => document.querySelector('.lightbox').close());
document.querySelector('.lightbox').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});

/* ---------- pencarian ---------- */
const search = document.querySelector('#search');
search.addEventListener('input', () => {
  const query = search.value.toLocaleLowerCase('id');
  let visible = 0;
  document.querySelectorAll('.archive-row').forEach(row => {
    const match = row.textContent.toLocaleLowerCase('id').includes(query);
    row.hidden = !match;
    if (match) visible++;
  });
  document.querySelector('#empty-state').hidden = visible > 0;
});

/* ---------- menu seluler ---------- */
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => {
  const open = document.querySelector('.site-header').classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.site-header').classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- jalan ---------- */
muatTulisan()
  .then(render)
  .catch(err => {
    console.error('Gagal memuat tulisan:', err);
    const pesan = '<p class="empty-state">Tulisan gagal dimuat. Muat ulang halaman, atau periksa file content/posts.json.</p>';
    const arsip = document.querySelector('#archive-list');
    if (arsip) arsip.innerHTML = pesan;
    const grid = document.querySelector('.featured-grid');
    if (grid) grid.innerHTML = pesan;
  });
