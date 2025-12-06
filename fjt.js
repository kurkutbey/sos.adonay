document.addEventListener('DOMContentLoaded', () => {

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const productGrid = $('#productGrid');
  const modal = $('#modal');
  const modalGalleryImg = $('#modalGalleryImg');
  const productTitle = $('#productTitle');
  const productPrice = $('#productPrice');
  const productDesc = $('#productDesc');
  const productCode = $('#productCode');
  const qtyInput = $('#qty');
  const modalAdd = $('#modalAdd');
  const closeModalBtn = $('#closeModal');

  const offcart = $('#offcart');
  const cartItemsEl = $('#cartItems');
  const cartTotalEl = $('#cartTotal');
  const openCartBtn = $('#openCart');
  const closeCartBtn = $('#closeCart');
  const clearCartBtn = $('#clearCart');
  const checkoutBtn = $('#checkout');
  const cartCount = $('#cartCount');

  const qInput = $('#q');
  const favOnly = $('#favOnly');
  const newOnly = $('#newOnly');

  // PRODUCTS
  const products = [
    {
      id: 1,
      title: 'کت مشکی مینیمال',
      price: 59,
      img: '../frosh/2f4ecda518463716238bf45fca1bcea3.jpg',
      desc: 'کاپشن گرم و شیک از برند آدیداس',
      tags: ['new']
    },
    {
      id: 2,
      title: 'کفش استریت',
      price: 89,
      img: '../frosh/2f4ecda518463716238bf45fca1bcea3.jpg',
      desc: 'کفش راحت و شیک',
      tags: ['new']
    },
    {
      id: 3,
      title: 'کلاه فلت',
      price: 29,
      img: '../frosh/2f4ecda518463716238bf45fca1bcea3.jpg',
      desc: 'کلاه فلت کلاسیک',
      tags: []
    },
    {
      id: 4,
      title: 'تی‌شرت سفید',
      price: 39,
      img: '../frosh/2f4ecda518463716238bf45fca1bcea3.jpg',
      desc: 'تی‌شرت نخی ساده',
      tags: []
    }
  ];

  let cart = JSON.parse(localStorage.getItem('adn_cart') || '[]');

  function saveCart() {
    localStorage.setItem('adn_cart', JSON.stringify(cart));
  }

  function formatPrice(n) {
    return '$' + Number(n).toFixed(2);
  }

  // ********************
  // Render Products
  // ********************
  function renderProducts() {

    const q = qInput.value.trim().toLowerCase();
    productGrid.innerHTML = '';

    const filtered = products.filter(p => {

      if (favOnly.checked && !p.tags.includes('popular')) return false;
      if (newOnly.checked && !p.tags.includes('new')) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;

      return true;
    });

    filtered.forEach(p => {
      const a = document.createElement('article');
      a.className = 'card';
      a.dataset.id = p.id;
      a.innerHTML = `
        <div class="img"><img src="${p.img}" alt="${p.title}"></div>

        <div class="meta">
          <h3>${p.title}</h3>

          <div class="price-row">
            <div>
              <div class="price">${formatPrice(p.price)}</div>
              <div class="small muted">کد: BW-00${p.id}</div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn viewBtn">مشاهده</button>
              <button class="btn addBtn">افزودن</button>
            </div>
          </div>
        </div>
      `;
      productGrid.appendChild(a);
    });

    // Add to Cart Button
    $$('.addBtn').forEach(btn => btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const id = Number(card.dataset.id);
      const p = products.find(x => x.id === id);
      addToCart({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });
      openCart();
    }));

    // View Button
    $$('.viewBtn').forEach(btn => btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const id = Number(card.dataset.id);
      const p = products.find(x => x.id === id);
      openModal(p);
    }));
  }

  // ********************
  // MODAL
  // ********************
  function openModal(p) {
    modalGalleryImg.src = p.img;
    productTitle.textContent = p.title;
    productPrice.textContent = formatPrice(p.price);
    productDesc.textContent = p.desc;
    productCode.textContent = 'کد: BW-00' + p.id;

    qtyInput.value = 1;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    modalAdd.onclick = () => {
      addToCart({
        id: p.id,
        title: p.title,
        price: p.price,
        img: p.img,
        qty: Number(qtyInput.value)
      });

      closeModal();
      openCart();
    };
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ********************
  // CART FUNCTIONS
  // ********************
  function addToCart(item) {
    const found = cart.find(c => c.id === item.id);
    if (found) found.qty += item.qty;
    else cart.push({ ...item });

    saveCart();
    renderCart();
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((it, idx) => {
      total += it.price * it.qty;
      count += it.qty;

      const row = document.createElement('div');
      row.className = 'cart-item';

      row.innerHTML = `
        <div style="flex:1;display:flex;gap:12px;align-items:center">
          <div class="thumb"><img src="${it.img}" alt=""></div>

          <div>
            <div style="font-weight:700">${it.title}</div>
            <div class="small muted">${it.qty} × ${formatPrice(it.price)}</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn" data-idx="${idx}" onclick="window._adn_remove(${idx})">حذف</button>
        </div>
      `;

      cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = formatPrice(total);
    cartCount.textContent = count;
  }

  window._adn_remove = (idx) => {
    cart.splice(idx, 1);
    saveCart();
    renderCart();
  };

  // OPEN/CLOSE CART
  function openCart() {
    offcart.classList.add('open');
    offcart.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    offcart.classList.remove('open');
    offcart.setAttribute('aria-hidden', 'true');
  }

  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);

  clearCartBtn.addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
  });

  checkoutBtn.addEventListener('click', () => {
    alert('درگاه پرداخت شبیه‌سازی شده — این فقط یک دمو است.');
  });

  // SEARCH + FILTERS
  qInput.addEventListener('input', renderProducts);
  favOnly.addEventListener('change', renderProducts);
  newOnly.addEventListener('change', renderProducts);

  // Mobile nav
  $('#hamb').addEventListener('click', () => {
    const nav = document.querySelector('nav.main-nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  renderProducts();
  renderCart();

});
