/* =====================================================
   main.js – Shared utilities across all pages
   ===================================================== */

// ── Page Loader ──
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    }, 600);
});

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ── Mobile nav toggle ──
function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
}

// Close nav when link clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks')?.classList.remove('open');
        document.getElementById('hamburger')?.classList.remove('open');
    });
});

// ── Toast Notifications ──
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 400);
    }, 3600);
}

// ── Auth Helpers ──
function getToken() {
    return localStorage.getItem('cafe_token');
}

function setToken(token) {
    localStorage.setItem('cafe_token', token);
}

function removeToken() {
    localStorage.removeItem('cafe_token');
    localStorage.removeItem('cafe_user');
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('cafe_user'));
    } catch { return null; }
}

function setUser(user) {
    localStorage.setItem('cafe_user', JSON.stringify(user));
}

function isLoggedIn() {
    return !!getToken();
}

// ── Authenticated Fetch ──
async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
}

// ── Format Currency ──
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// ── Fade-in on scroll ──
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card, .feature-card, .testimonial-card, .team-card, .value-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
