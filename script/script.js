/*ПРОГРЕС-БАР*/
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = progress + '%';
});

/*НАВ СКРОЛЛ*/
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/*АНІМАЦІЇ*/
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

/*КУРСОР*/
const cursor = document.getElementById('cursor');
const trails = [];
const trailCount = 5;

for(let i = 0; i < trailCount; i++){
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  document.body.appendChild(trail);
  trails.push({el: trail, x: 0, y: 0});
}

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor(){
  cursor.style.top = mouseY + 'px';
  cursor.style.left = mouseX + 'px';

  trails.forEach((trail, i) => {
    trail.x += (mouseX - trail.x) * (0.3 - i * 0.04);
    trail.y += (mouseY - trail.y) * (0.3 - i * 0.04);
    trail.el.style.top = trail.y + 'px';
    trail.el.style.left = trail.x + 'px';
  });

  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('button, .nav-icons span, .logo, nav li, .cover, .product').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

/*ПІДПИСКА*/
function subscribe() {
  const email = document.getElementById('email');
  if (!email || !email.value) return;

  alert('Дякуємо за підписку!');
  email.value = '';
}

/*КОШИК*/
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  countEl.innerText = total;
}

/*УЛЮБЛЕНЕ*/
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavCount();
}

function updateFavCount() {
  const countEl = document.getElementById('favCount');
  if (!countEl) return;

  const favorites = getFavorites();
  countEl.innerText = favorites.length;
}

/*ДОДАВАННЯ В КОШИК*/
function addProductToCart(product) {
  let cart = getCart();

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  animateCartIcon();
}

/*ДОДАВАННЯ В УЛЮБЛЕНЕ*/
function addToFavorites(button) {
  const card = button.closest('.product-card');

  const product = {
    id: card.dataset.id,
    name: card.querySelector('.product-name')?.innerText || '',
    price: card.querySelector('.product-price')?.innerText || '',
    image: card.querySelector('.product-image')?.src || '',
    category: card.querySelector('.product-category')?.innerText || ''
  };

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.some(item => item.id === product.id)) return;

  favorites.push(product);
  saveFavorites(favorites);
  animateFavIcon();
  alert('Товар додано до улюбленого!');
}

/*ПРИВ'ЯЗКА ДО КНОПКИ КОШИКА*/
function handleAddToCart(btn) {
  const card = btn.closest('.product-card') || btn.closest('.product');
  if (!card) return;

  const product = {
    id: card.dataset.id || Date.now().toString(),
    title: card.querySelector('.product-name')?.innerText || card.querySelector('h3')?.innerText || '',
    price: card.querySelector('.product-price')?.innerText || card.querySelector('.price')?.innerText || '',
    image: card.querySelector('.product-image')?.src || card.querySelector('img')?.src || ''
  };

  addProductToCart(product);
}

/*ПРИВ'ЯЗКА ДО КНОПКИ УЛЮБЛЕНОГО*/
function handleAddToFavorites(btn) {
  const card = btn.closest('.product-card') || btn.closest('.product');
  if (!card) return;

  const product = {
    id: card.dataset.id || Date.now().toString(),
    title: card.querySelector('.product-name')?.innerText || card.querySelector('h3')?.innerText || '',
    price: card.querySelector('.product-price')?.innerText || card.querySelector('.price')?.innerText || '',
    category: card.querySelector('.product-category')?.innerText || 'МЕРЧ',
    image: card.querySelector('.product-image')?.src || card.querySelector('img')?.src || ''
  };

  addToFavorites(product);
}

/*АНІМАЦІЯ ІКОНКИ КОШИКА*/
function animateCartIcon() {
  const icon = document.getElementById('cartIcon');
  if (!icon) return;

  icon.classList.add('added');
  setTimeout(() => icon.classList.remove('added'), 300);
}

/*АНІМАЦІЯ ІКОНКИ УЛЮБЛЕНОГО*/
function animateFavIcon() {
  const icon = document.getElementById('favIcon');
  if (!icon) return;

  icon.classList.add('added');
  setTimeout(() => icon.classList.remove('added'), 300);
}

/*АНІМАЦІЯ КНОПКИ*/
function animateBtn(btn) {
  btn.classList.add('added');
  setTimeout(() => btn.classList.remove('added'), 400);
  
  if (btn.classList.contains('cartIc')) {
    handleAddToCart(btn);
  } else if (btn.classList.contains('favIc')) {
    handleAddToFavorites(btn);
  }
}

/*ІНІЦІАЛІЗАЦІЯ*/
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateFavCount();
});

let selectedSize = null;
let currentProduct = null;

document.addEventListener('click', (e) => {
  if (e.target.closest('.size-btn')) {
    const btn = e.target.closest('.size-btn');
    
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    
    btn.classList.add('selected');
    selectedSize = btn.dataset.size;
  }
});

document.querySelectorAll('.product-card .view-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    const card = btn.closest('.product-card');
    if (!card) return;

    currentProduct = {
      id: card.dataset.id,
      title: card.querySelector('.product-name')?.innerText || '',
      price: card.querySelector('.product-price')?.innerText || '',
      category: card.querySelector('.product-category')?.innerText || '',
      image: card.querySelector('.product-image')?.src || ''
    };

    document.getElementById('modalTitle').innerText = currentProduct.title;
    document.getElementById('modalPrice').innerText = currentProduct.price;
    document.getElementById('modalCategory').innerText = currentProduct.category;
    document.getElementById('modalImage').src = currentProduct.image;

    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    selectedSize = null;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  });
});

document.getElementById('closeModal')?.addEventListener('click', closeModal);
document.getElementById('productModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('productModal')) closeModal();
});

function closeModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  selectedSize = null;
}

function addToCartFromModal() {
  if (!currentProduct) return;
  
  const categoryLower = currentProduct.category?.toLowerCase() || '';
  if (categoryLower.includes('одяг') || currentProduct.title.toLowerCase().includes('hoodie') || 
      currentProduct.title.toLowerCase().includes('shirt') || currentProduct.title.toLowerCase().includes('tee')) {
    if (!selectedSize) {
      alert('Будь ласка, оберіть розмір!');
      return;
    }
  }
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === currentProduct.id && item.size === selectedSize);
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ 
      ...currentProduct, 
      qty: 1,
      size: selectedSize || 'ONE SIZE'
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  alert(`Товар додано до кошика${selectedSize ? ` (Розмір: ${selectedSize})` : ''}!`);
  closeModal();
}

function addToFavoritesFromModal() {
  if (!currentProduct) return;
  
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const existing = favorites.find(item => item.id === currentProduct.id);
  
  if (existing) {
    alert('Цей товар вже у вашому списку улюбленого!');
    return;
  }
  
  favorites.push(currentProduct);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavCount();
  
  alert('Товар додано до улюбленого!');
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.innerText = total;
}

function updateFavCount() {
  const countEl = document.getElementById('favCount');
  if (!countEl) return;
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  countEl.innerText = favorites.length;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateFavCount();
});
