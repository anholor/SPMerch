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


/*ВСПЛИВАШКИ*/
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productsContainer');
  if (!productsContainer) return;

  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('closeModal');

  if (!modal || !closeBtn) return;
  
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

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      enableCursorInModal();
    });
  });

closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  const modalAddBtn = document.getElementById('modalAddToCart');

  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      addProductToCart({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        image: currentProduct.image
      });
    });
  }

});

function closeModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}


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

/*ДОБАВЛЯННЯ В КОШИК*/
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

/*ПРИВ'ЯЗКА ДО КНОПКИ*/
function handleAddToCart(btn) {
  const card = btn.closest('.product-card');
  if (!card) return;

  const product = {
    id: card.dataset.id,
    title: card.querySelector('.product-name').innerText,
    price: card.querySelector('.product-price').innerText,
    image: card.querySelector('.product-image').src
  };

  addProductToCart(product);
}

/*CART ICON ANIMATION*/
function animateCartIcon() {
  const icon = document.getElementById('cartIcon');
  if (!icon) return;

  icon.classList.add('added');
  setTimeout(() => icon.classList.remove('added'), 300);
}

document.addEventListener('DOMContentLoaded', updateCartCount);


                                                  /* ОНОВЛЕННЯ ПРИ ЗАВАНТАЖЕНІ */
document.addEventListener('DOMContentLoaded', () => {
  updateUserDropdown();
  initThemeToggle();
  
  document.querySelectorAll('.dropdown-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
});