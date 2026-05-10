/* =====================================================
   admin.js – Admin panel logic
   ===================================================== */

let menuItems = [];
let editingId = null;
let deletingId = null;

// ── Initialize on page load ──
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        showDashboard();
        loadDashboardData();
    } else {
        showLogin();
    }
});

// ── Auth: Login ──
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    const text = document.getElementById('loginBtnText');

    btn.disabled = true;
    text.textContent = 'Signing in...';

    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            setToken(data.token);
            setUser(data.user);
            showToast('Welcome back, ' + data.user.name + '! ☕', 'success');
            showDashboard();
            loadDashboardData();
        } else {
            showToast(data.message || 'Invalid credentials.', 'error');
            btn.disabled = false;
            text.textContent = 'Sign In →';
        }
    } catch (err) {
        showToast('Server error. Is the server running?', 'error');
        btn.disabled = false;
        text.textContent = 'Sign In →';
    }
}

// ── Auth: Logout ──
function handleLogout() {
    removeToken();
    showToast('Logged out successfully.', 'info');
    setTimeout(showLogin, 600);
}

// ── Show Login ──
function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboardPage').style.display = 'none';
}

// ── Show Dashboard ──
function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';

    const user = getUser();
    if (user) {
        document.getElementById('adminName').textContent = user.name;
        document.getElementById('adminInitial').textContent = user.name.charAt(0).toUpperCase();
    }
}

// ── Load Dashboard Data ──
async function loadDashboardData() {
    await Promise.all([loadStats(), loadMenuItems()]);
}

// ── Load Stats ──
async function loadStats() {
    try {
        const res = await authFetch(`${API_BASE}/api/admin/stats`);
        if (res.status === 401) { handleLogout(); return; }
        const data = await res.json();

        if (data.success) {
            const { totalMenuItems, availableItems, categoryCounts, totalUsers } = data.stats;
            animateCounter('statTotal', totalMenuItems);
            animateCounter('statAvailable', availableItems);
            animateCounter('statCategories', categoryCounts.length);
            animateCounter('statUsers', totalUsers);
        }
    } catch (err) {
        console.error('Could not load stats:', err);
    }
}

// ── Counter animation ──
function animateCounter(elId, target) {
    const el = document.getElementById(elId);
    if (!el) return;
    let current = 0;
    const steps = 30;
    const increment = target / steps;
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) { el.textContent = target; clearInterval(interval); }
        else { el.textContent = Math.floor(current); }
    }, 30);
}

// ── Load Menu Items ──
async function loadMenuItems() {
    try {
        const res = await authFetch(`${API_BASE}/api/menu`);
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        menuItems = data.data;
        renderTable();
    } catch (err) {
        document.getElementById('menuTableBody').innerHTML = `
      <tr><td colspan="6">
        <div class="table-empty"><div class="icon">⚠️</div><p>Failed to load menu items.</p></div>
      </td></tr>`;
    }
}

// ── Render Table ──
function renderTable() {
    const tbody = document.getElementById('menuTableBody');

    if (menuItems.length === 0) {
        tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="table-empty"><div class="icon">☕</div><p>No menu items yet. Add your first item!</p></div>
      </td></tr>`;
        return;
    }

    const categoryEmojis = { Coffee: '☕', Desserts: '🍰', Drinks: '🧋', Snacks: '🥐', Specials: '⭐' };

    tbody.innerHTML = menuItems.map(item => `
    <tr>
      <td>
        <img
          src="${item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'}"
          class="item-img-preview"
          alt="${item.name}"
          onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'"
        />
      </td>
      <td class="item-name-cell">
        <strong>${item.name}</strong>
        <span>${item.description.substring(0, 50)}...</span>
      </td>
      <td>
        <span class="tag tag-primary">
          ${categoryEmojis[item.category] || ''} ${item.category}
        </span>
      </td>
      <td class="price-cell">${formatPrice(item.price)}</td>
      <td>
        <span style="
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          background: ${item.available ? 'rgba(46,158,90,0.12)' : 'rgba(200,50,50,0.12)'};
          color: ${item.available ? '#6ee89a' : '#e87a7a'};
          border: 1px solid ${item.available ? 'rgba(46,158,90,0.3)' : 'rgba(200,50,50,0.3)'};
        ">
          ${item.available ? '✓ Available' : '✗ Hidden'}
        </span>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openEditModal('${item._id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="openDeleteModal('${item._id}', '${item.name.replace(/'/g, "\\'")}')">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Modal Helpers ──
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});

// ── Open Add Modal ──
function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemSubmitBtn').textContent = 'Add Item';
    document.getElementById('itemForm').reset();
    document.getElementById('editItemId').value = '';
    document.getElementById('itemAvailable').checked = true;
    openModal('itemModal');
}

// ── Open Edit Modal ──
function openEditModal(id) {
    const item = menuItems.find(i => i._id === id);
    if (!item) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemSubmitBtn').textContent = 'Save Changes';
    document.getElementById('editItemId').value = id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemAvailable').checked = item.available;

    openModal('itemModal');
}

// ── Handle Item Submit (Add / Edit) ──
async function handleItemSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('itemSubmitBtn');
    const isEdit = !!editingId;

    const payload = {
        name: document.getElementById('itemName').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
        price: parseFloat(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value.trim(),
        available: document.getElementById('itemAvailable').checked
    };

    submitBtn.disabled = true;
    submitBtn.textContent = isEdit ? 'Saving...' : 'Adding...';

    try {
        const url = isEdit ? `${API_BASE}/api/menu/${editingId}` : `${API_BASE}/api/menu`;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await authFetch(url, {
            method,
            body: JSON.stringify(payload)
        });

        if (res.status === 401) { handleLogout(); return; }

        const data = await res.json();

        if (data.success) {
            showToast(isEdit ? '✅ Item updated!' : '✅ Item added!', 'success');
            closeModal('itemModal');
            await loadDashboardData();
        } else {
            showToast(data.message || 'Operation failed.', 'error');
        }
    } catch (err) {
        showToast('Network error. Please try again.', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Item';
}

// ── Open Delete Modal ──
function openDeleteModal(id, name) {
    deletingId = id;
    document.getElementById('deleteItemName').textContent =
        `Are you sure you want to delete "${name}"? This cannot be undone.`;

    document.getElementById('confirmDeleteBtn').onclick = () => confirmDelete();
    openModal('deleteModal');
}

// ── Confirm Delete ──
async function confirmDelete() {
    if (!deletingId) return;

    const btn = document.getElementById('confirmDeleteBtn');
    btn.textContent = 'Deleting...';
    btn.disabled = true;

    try {
        const res = await authFetch(`${API_BASE}/api/menu/${deletingId}`, { method: 'DELETE' });
        if (res.status === 401) { handleLogout(); return; }

        const data = await res.json();

        if (data.success) {
            showToast('🗑️ Item deleted.', 'success');
            closeModal('deleteModal');
            await loadDashboardData();
        } else {
            showToast(data.message || 'Delete failed.', 'error');
        }
    } catch (err) {
        showToast('Network error.', 'error');
    }

    btn.textContent = 'Delete';
    btn.disabled = false;
    deletingId = null;
}
