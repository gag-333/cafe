let menuItems = [];
let editingId = null;
let deletingId = null;

document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        showDashboard();
        loadDashboardData();
    } else {
        showLogin();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    const text = document.getElementById('loginBtnText');

    btn.disabled = true;
    text.textContent = 'Signing in...';

    const data = MockAPI.login(email, password);

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
}

function handleLogout() {
    removeToken();
    showToast('Logged out successfully.', 'info');
    setTimeout(showLogin, 600);
}

function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboardPage').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';

    const user = getUser();
    if (user) {
        document.getElementById('adminName').textContent = user.name;
        document.getElementById('adminInitial').textContent = user.name.charAt(0).toUpperCase();
    }
}

async function loadDashboardData() {
    loadStats();
    loadMenuItems();
}

function loadStats() {
    const data = MockAPI.getStats();
    if (data.success) {
        const { totalMenuItems, availableItems, categoryCounts, totalUsers } = data.stats;
        animateCounter('statTotal', totalMenuItems);
        animateCounter('statAvailable', availableItems);
        animateCounter('statCategories', categoryCounts.length);
        animateCounter('statUsers', totalUsers);
    }
}

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

function loadMenuItems() {
    const data = MockAPI.getAllMenu();
    if (!data.success) {
        document.getElementById('menuTableBody').innerHTML = `
      <tr><td colspan="6">
        <div class="table-empty"><div class="icon">⚠️</div><p>Failed to load menu items.</p></div>
      </td></tr>`;
        return;
    }
    menuItems = data.data;
    renderTable();
}

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

function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});

function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemSubmitBtn').textContent = 'Add Item';
    document.getElementById('itemForm').reset();
    document.getElementById('editItemId').value = '';
    document.getElementById('itemAvailable').checked = true;
    openModal('itemModal');
}

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

    const data = isEdit
        ? MockAPI.updateItem(editingId, payload)
        : MockAPI.addItem(payload);

    if (data.success) {
        showToast(isEdit ? '✅ Item updated!' : '✅ Item added!', 'success');
        closeModal('itemModal');
        loadDashboardData();
    } else {
        showToast(data.message || 'Operation failed.', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Item';
}

function openDeleteModal(id, name) {
    deletingId = id;
    document.getElementById('deleteItemName').textContent =
        `Are you sure you want to delete "${name}"? This cannot be undone.`;

    document.getElementById('confirmDeleteBtn').onclick = () => confirmDelete();
    openModal('deleteModal');
}

async function confirmDelete() {
    if (!deletingId) return;

    const btn = document.getElementById('confirmDeleteBtn');
    btn.textContent = 'Deleting...';
    btn.disabled = true;

    const data = MockAPI.deleteItem(deletingId);

    if (data.success) {
        showToast('🗑️ Item deleted.', 'success');
        closeModal('deleteModal');
        loadDashboardData();
    } else {
        showToast(data.message || 'Delete failed.', 'error');
    }

    btn.textContent = 'Delete';
    btn.disabled = false;
    deletingId = null;
}
