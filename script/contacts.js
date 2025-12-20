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

  document.querySelectorAll('button, .nav-icons span, .logo, nav li, .contact-card, .social-card, .social, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* ЛІЧИЛЬНИКИ */
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

/* ФОРМА КОНТАКТІВ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toISOString()
    };

    messages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    alert('Дякуємо за ваше повідомлення!\n\nМи зв\'яжемося з вами найближчим часом.');
    
    contactForm.reset();
  });
}

/* ІНІЦІАЛІЗАЦІЯ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateFavCount();
});