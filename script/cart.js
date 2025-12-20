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

document.querySelectorAll('button, .nav-icons span, .logo, nav li, .cart-item, .social').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});


function updateFavCount() {
  const countEl = document.getElementById('favCount');
  if (!countEl) return;

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  countEl.innerText = favorites.length;
}

/* ФУНКЦІЇ КОШИКА */
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  countEl.innerText = total;
}

function parsePrice(priceStr) {
  return parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartContainer = document.querySelector('.cart-container');

  if (!cartItems) return;

  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartContainer) cartContainer.style.display = 'none';
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  if (cartContainer) cartContainer.style.display = 'grid';

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="item-image">
      
      <div class="item-details">
        <h3 class="item-name">${item.title}</h3>
        <p class="item-category">МЕРЧ</p>
        <p class="item-price">${item.price}</p>
        
        <div class="quantity-control">
          <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">
            <span>−</span>
          </button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">
            <span>+</span>
          </button>
        </div>
      </div>
      
      <div class="item-actions">
        <div class="item-total">${parsePrice(item.price) * item.qty} ₴</div>
        <button class="remove-btn" onclick="removeItem('${item.id}')">
          <span>ВИДАЛИТИ</span>
        </button>
      </div>
    </div>
  `).join('');

  updateSummary();
  
  // Додаємо курсор ефект для нових елементів
  document.querySelectorAll('.cart-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

function changeQuantity(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeItem(id);
    return;
  }

  saveCart(cart);
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  
  // Анімація видалення
  const itemEl = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (itemEl) {
    itemEl.style.opacity = '0';
    itemEl.style.transform = 'translateX(-100%)';
    setTimeout(() => renderCart(), 300);
  }
}

function updateSummary() {
  const cart = getCart();
  
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
  const shipping = subtotal > 0 ? 'Безкоштовно' : '0 ₴';
  const total = subtotal;

  const totalItemsEl = document.getElementById('totalItems');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('total');

  if (totalItemsEl) totalItemsEl.innerText = totalItems;
  if (subtotalEl) subtotalEl.innerText = subtotal + ' ₴';
  if (shippingEl) shippingEl.innerText = shipping;
  if (totalEl) totalEl.innerText = total + ' ₴';
}

function applyPromo() {
  const promoInput = document.getElementById('promoCode');
  if (!promoInput || !promoInput.value) return;

  const code = promoInput.value.toUpperCase();
  
  // Приклад промокодів
  const validCodes = {
    'SILENT10': 10,
    'MERCH15': 15,
    'PLANET20': 20
  };

  if (validCodes[code]) {
    alert(`Промокод застосовано! Знижка: ${validCodes[code]}%`);
    promoInput.value = '';
    // Тут можна додати логіку застосування знижки
  } else {
    alert('Невірний промокод');
    promoInput.value = '';
  }
}

function checkout() {
  const cart = getCart();
  
  if (cart.length === 0) {
    alert('Ваш кошик порожній!');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.qty), 0);
  
  alert(`Дякуємо за замовлення!\nЗагальна сума: ${total} ₴\n\nНаша команда зв'яжеться з вами найближчим часом.`);
  
  // Очищення кошика після замовлення
  localStorage.removeItem('cart');
  renderCart();
  updateCartCount();
}

/* ІНІЦІАЛІЗАЦІЯ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
  updateFavCount();
});

/* ІКОНКА КОШИКА - ПЕРЕХІД НА СТОРІНКУ */
const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
  cartIcon.style.cursor = 'none';
}