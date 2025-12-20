/* ПРОГРЕС-БАР */
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = progress + '%';
});

/* КУРСОР */
const cursor = document.getElementById('cursor');
if (cursor) {
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor(){
    cursor.style.top = mouseY + 'px';
    cursor.style.left = mouseX + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('button, .nav-icons span, .logo, nav li, .favorite-card, .social').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* ФУНКЦІЇ УЛЮБЛЕНОГО */
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavCount();
  renderFavorites();
}

function updateFavCount() {
  const countEl = document.getElementById('favCount');
  if (!countEl) return;

  const favorites = getFavorites();
  countEl.innerText = favorites.length;
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.innerText = total;
}

function parsePrice(priceStr) {
  return parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
}

function renderFavorites() {
  const favorites = getFavorites();
  const favoritesGrid = document.getElementById('favoritesGrid');
  const emptyFavorites = document.getElementById('emptyFavorites');
  const totalFavorites = document.getElementById('totalFavorites');

  if (!favoritesGrid) return;

  if (favorites.length === 0) {
    if (emptyFavorites) emptyFavorites.style.display = 'block';
    if (favoritesGrid) favoritesGrid.style.display = 'none';
    if (totalFavorites) totalFavorites.innerText = '0';
    return;
  }

  if (emptyFavorites) emptyFavorites.style.display = 'none';
  favoritesGrid.style.display = 'grid';
  if (totalFavorites) totalFavorites.innerText = favorites.length;

  favoritesGrid.innerHTML = favorites.map(item => `
    <div class="favorite-card" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="favorite-image">
      
      <div class="favorite-info">
        <p class="favorite-category">МЕРЧ</p>
        <h3 class="favorite-name">${item.title}</h3>
        <p class="favorite-price">${item.price}</p>
        
        <div class="favorite-actions">
          <button class="add-to-cart-btn" onclick="addToCartFromFav('${item.id}')">
            <span>В КОШИК</span>
          </button>
          <button class="remove-fav-btn" onclick="removeFromFavorites('${item.id}')">
            <span>ВИДАЛИТИ</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');


  
  document.querySelectorAll('.favorite-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

function addToCartFromFav(id) {
  const favorites = getFavorites();
  const item = favorites.find(f => f.id === id);
  
  if (!item) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(c => c.id === id);
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Анімація іконки кошика
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.classList.add('added');
    setTimeout(() => cartIcon.classList.remove('added'), 300);
  }
  
  alert('Товар додано до кошика!');
}

function removeFromFavorites(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(item => item.id !== id);
  saveFavorites(favorites);
  
  // Анімація видалення
  const itemEl = document.querySelector(`.favorite-card[data-id="${id}"]`);
  if (itemEl) {
    itemEl.style.opacity = '0';
    itemEl.style.transform = 'translateX(-100%)';
    setTimeout(() => renderFavorites(), 300);
  }
}

function clearAllFavorites() {
  if (!confirm('Ви впевнені, що хочете видалити всі товари з улюбленого?')) return;
  
  localStorage.removeItem('favorites');
  updateFavCount();
  renderFavorites();
}

/* ІНІЦІАЛІЗАЦІЯ */
document.addEventListener('DOMContentLoaded', () => {
  updateFavCount();
  updateCartCount();
  renderFavorites();
});