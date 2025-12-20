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

  document.querySelectorAll('button, .nav-icons span, .logo, nav li, .menu-item, .social, input, .dropdown-item, .address-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* ЛІЧИЛЬНИК */
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

/* ПЕРЕВІРКА АВТОРИЗАЦІЇ */
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
  
  if (!currentUser) {
    alert('Будь ласка, увійдіть в акаунт');
    window.location.href = 'login.html';
    return null;
  }
  
  return currentUser;
}

/* ОТРИМАННЯ ДАНИХ КОРИСТУВАЧА */
function getCurrentUserData() {
  const currentUser = checkAuth();
  if (!currentUser) return null;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.find(u => u.id === currentUser.userId);
}

/* ЗБЕРЕЖЕННЯ ДАНИХ КОРИСТУВАЧА */
function saveUserData(userData) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const index = users.findIndex(u => u.id === userData.id);
  
  if (index !== -1) {
    users[index] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
}

/* ЗАВАНТАЖЕННЯ ПРОФІЛЮ */
function loadProfile() {
  const userData = getCurrentUserData();
  if (!userData) return;

  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const birthdateInput = document.getElementById('birthdate');
  const ordersCount = document.getElementById('ordersCount');
  const favoritesCount = document.getElementById('favoritesCount');

  if (profileName) profileName.innerText = `${userData.firstName} ${userData.lastName}`;
  if (profileEmail) profileEmail.innerText = userData.email;
  if (firstNameInput) firstNameInput.value = userData.firstName;
  if (lastNameInput) lastNameInput.value = userData.lastName;
  if (emailInput) emailInput.value = userData.email;
  if (phoneInput) phoneInput.value = userData.phone || '';
  if (birthdateInput) birthdateInput.value = userData.birthdate || '';
  if (ordersCount) ordersCount.innerText = userData.orders?.length || 0;
  if (favoritesCount) favoritesCount.innerText = userData.favorites?.length || 0;
}

/* ЗБЕРЕЖЕННЯ ОСОБИСТИХ ДАНИХ */
const personalForm = document.getElementById('personalForm');
if (personalForm) {
  personalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = getCurrentUserData();
    if (!userData) return;

    userData.firstName = document.getElementById('firstName').value;
    userData.lastName = document.getElementById('lastName').value;
    userData.email = document.getElementById('email').value;
    userData.phone = document.getElementById('phone').value;
    userData.birthdate = document.getElementById('birthdate').value;

    if (saveUserData(userData)) {
      const currentSession = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
      currentSession.firstName = userData.firstName;
      currentSession.lastName = userData.lastName;
      currentSession.email = userData.email;
      
      if (localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(currentSession));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentSession));
      }

      alert('Дані успішно збережено!');
      loadProfile();
    } else {
      alert('Помилка при збереженні даних');
    }
  });
}

/* МЕНЮ ТАБІВ */
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');

menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetTab = item.dataset.tab;
    
    menuItems.forEach(mi => mi.classList.remove('active'));
    contentSections.forEach(cs => cs.classList.remove('active'));
    
    item.classList.add('active');
    const targetSection = document.getElementById(targetTab);
    if (targetSection) targetSection.classList.add('active');
  });
});

/* АДРЕСИ */
const addNewAddress = document.querySelector('.address-card.add-new');
const addressForm = document.getElementById('addressForm');

if (addNewAddress) {
  addNewAddress.addEventListener('click', () => {
    if (addressForm) {
      addressForm.style.display = addressForm.style.display === 'none' ? 'block' : 'none';
    }
  });
}

function closeAddressForm() {
  const addressForm = document.getElementById('addressForm');
  if (addressForm) addressForm.style.display = 'none';
}

const newAddressForm = document.getElementById('newAddressForm');
if (newAddressForm) {
  newAddressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Адреса успішно збережена!');
    closeAddressForm();
  });
}

/* ЗМІНА ПАРОЛЯ */
const securityForm = document.getElementById('securityForm');
if (securityForm) {
  securityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = getCurrentUserData();
    if (!userData) return;

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (currentPassword !== userData.password) {
      alert('Невірний поточний пароль!');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('Нові паролі не співпадають!');
      return;
    }

    if (newPassword.length < 8) {
      alert('Новий пароль повинен містити мінімум 8 символів');
      return;
    }

    userData.password = newPassword;

    if (saveUserData(userData)) {
      alert('Пароль успішно змінено!');
      securityForm.reset();
    } else {
      alert('Помилка при зміні пароля');
    }
  });
}

/* ВИДАЛЕННЯ АКАУНТУ */
const deleteBtn = document.querySelector('.delete-btn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    const confirm = window.confirm('Ви впевнені, що хочете видалити акаунт? Цю дію неможливо відмінити!');
    
    if (confirm) {
      const secondConfirm = window.confirm('Остання перевірка! Всі ваші дані будуть втрачені назавжди!');
      
      if (secondConfirm) {
        const userData = getCurrentUserData();
        if (!userData) return;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== userData.id);
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');

        alert('Акаунт видалено');
        window.location.href = 'index.html';
      }
    }
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


/* АВАТАР */
const avatarUpload = document.getElementById('avatarUpload');
if (avatarUpload) {
  avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const avatarImg = document.getElementById('avatarImg');
      if (avatarImg) {
        avatarImg.src = event.target.result;
        
        const userData = getCurrentUserData();
        if (userData) {
          userData.avatar = event.target.result;
          saveUserData(userData);
        }
      }
    };
    reader.readAsDataURL(file);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadProfile();
  updateCartCount();
  updateFavCount();
  initThemeToggle();
});