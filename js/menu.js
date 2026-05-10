let allItems = [];
let currentCategory = 'all';
let searchQuery = '';

async function loadMenuItems() {
    try {
        const data = MockAPI.getMenu();
        if (!data.success) throw new Error(data.message);
        allItems = data.data;
        renderMenu();
    } catch (err) {
        console.error('Failed to load menu:', err);
        document.getElementById('menuGrid').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">⚠️</div>
        <h3>Could not load menu</h3>
        <p>Something went wrong loading the menu items.</p>
      </div>`;
    }
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderMenu();
}

function filterItems() {
    searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById('menuGrid');
    const countEl = document.getElementById('menuCount');

    let filtered = allItems;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (searchQuery) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery)
        );
    }

    if (countEl) {
        const total = filtered.length;
        countEl.innerHTML = total === 0
            ? 'No items found'
            : `Showing <span>${total}</span> item${total !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">🔍</div>
        <h3>No items found</h3>
        <p>Try a different category or search term.</p>
      </div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => buildMenuCard(item)).join('');

    grid.querySelectorAll('.menu-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });
}

function buildMenuCard(item) {
    const badgeClass = `badge-${item.category.toLowerCase()}`;
    const imgSrc = item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
    const categoryEmojis = {
        Coffee: '☕',
        Desserts: '🍰',
        Drinks: '🧋',
        Snacks: '🥐',
        Specials: '⭐'
    };

    return `
    <div class="menu-card">
      <div class="menu-card-img-wrapper">
        <img
          class="menu-card-img"
          src="${imgSrc}"
          alt="${item.name}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'"
        />
        <span class="menu-card-badge ${badgeClass}">
          ${categoryEmojis[item.category] || ''} ${item.category}
        </span>
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-title">${item.name}</h3>
        <p class="menu-card-desc">${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatPrice(item.price)}</span>
          <button class="btn btn-outline btn-sm" onclick="addToCart('${item._id}', '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${imgSrc}')">
            Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', loadMenuItems);
