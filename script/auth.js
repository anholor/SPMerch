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

  document.querySelectorAll('button, .nav-icons span, .logo, nav li, a, input, .password-toggle, .dropdown-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* КОШИК - ЛІЧИЛЬНИК */
function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.innerText = total;
}

document.addEventListener('DOMContentLoaded', updateCartCount);

/* ПЕРЕМИКАЧ ПАРОЛЯ */
function togglePassword(fieldId = 'password') {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  field.type = field.type === 'password' ? 'text' : 'password';
}

/* СИЛА ПАРОЛЯ */
const passwordInput = document.getElementById('password');
if (passwordInput && document.getElementById('passwordStrength')) {
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;

    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthFill.className = 'strength-fill';
    
    if (strength === 0) {
      strengthFill.style.width = '0%';
      strengthText.innerText = '';
    } else if (strength <= 2) {
      strengthFill.classList.add('weak');
      strengthText.innerText = 'Слабкий пароль';
    } else if (strength === 3) {
      strengthFill.classList.add('medium');
      strengthText.innerText = 'Середній пароль';
    } else {
      strengthFill.classList.add('strong');
      strengthText.innerText = 'Сильний пароль';
    }
  });
}

/* РЕЄСТРАЦІЯ */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    if (!terms) {
      alert('Будь ласка, погодьтесь з умовами використання');
      return;
    }

    if (password !== confirmPassword) {
      alert('Паролі не співпадають!');
      return;
    }

    if (password.length < 8) {
      alert('Пароль повинен містити мінімум 8 символів');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
      alert('Користувач з таким email вже існує!');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
      orders: [],
      addresses: [],
      favorites: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Реєстрація успішна! Тепер ви можете увійти.');
    window.location.href = 'login.html';
  });
}

/* ВХІД */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Невірний email або пароль!');
      return;
    }

    const sessionData = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      loginTime: new Date().toISOString()
    };

    if (remember) {
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    }

    alert(`Вітаємо, ${user.firstName}!`);
    window.location.href = 'profile.html';
  });
}

/* ВИХІД */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    alert('Ви вийшли з акаунту');
    window.location.href = 'index.html';
  });
}