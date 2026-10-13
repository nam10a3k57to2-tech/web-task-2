const AUTH_STORAGE_KEY = 'mgmt_current_user';

function navigateTo(viewId) {
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        }
    }
}

function getCurrentUser() {
    try {
        const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error('Failed to parse stored user:', e);
        return null;
    }
}

function updateAuthUI() {
    const user = getCurrentUser();
    const guestItems = document.querySelectorAll('.guest-item');
    const authItems = document.querySelectorAll('.auth-item');

    if (user) {
        guestItems.forEach(item => item.classList.add('d-none'));
        authItems.forEach(item => item.classList.remove('d-none'));
    } else {
        guestItems.forEach(item => item.classList.remove('d-none'));
        authItems.forEach(item => item.classList.add('d-none'));
    }
}

function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('passwordInput');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
        showToast('Vui lòng điền đầy đủ email và mật khẩu!', 'danger');
        return;
    }

    const userData = {
        email: email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));

    updateAuthUI();

    showToast(`Đăng nhập thành công! Xin chào ${email}`, 'success');

    const form = document.getElementById('loginForm');
    if (form) form.reset();

    setTimeout(() => {
        navigateTo('home');
    }, 700);
}

function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    updateAuthUI();

    showToast('Đăng xuất thành công!', 'info');

    setTimeout(() => {
        navigateTo('index');
    }, 400);
}

function togglePassword() {
    const pwdInput = document.getElementById('passwordInput');
    const toggleBtn = document.querySelector('.password-toggle');

    if (!pwdInput) return;

    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        if (toggleBtn) toggleBtn.textContent = 'Ẩn';
    } else {
        pwdInput.type = 'password';
        if (toggleBtn) toggleBtn.textContent = 'Hiện';
    }
}

function showToast(message, type = 'success') {
    const toastEl = document.getElementById('appToast');
    const toastMessage = document.getElementById('appToastMessage');
    const toastIcon = document.getElementById('appToastIcon');

    if (!toastEl) return;

    toastEl.className = 'toast align-items-center text-white border-0 shadow';
    if (type === 'success') {
        toastEl.classList.add('bg-success');
        if (toastIcon) toastIcon.className = 'bi bi-check-circle-fill me-2';
    } else if (type === 'danger') {
        toastEl.classList.add('bg-danger');
        if (toastIcon) toastIcon.className = 'bi bi-exclamation-triangle-fill me-2';
    } else if (type === 'info') {
        toastEl.classList.add('bg-primary');
        if (toastIcon) toastIcon.className = 'bi bi-info-circle-fill me-2';
    } else {
        toastEl.classList.add('bg-dark');
        if (toastIcon) toastIcon.className = 'bi bi-bell-fill me-2';
    }

    if (toastMessage) toastMessage.textContent = message;

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

function showCourseDetails(title, description) {
    const titleEl = document.getElementById('modalCourseTitle');
    const descEl = document.getElementById('modalCourseDesc');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;

    const modalEl = document.getElementById('courseModal');
    if (modalEl) {
        const courseModal = new bootstrap.Modal(modalEl);
        courseModal.show();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    navigateTo('index');
});
