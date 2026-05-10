/* =====================================================
   cart.js – Shopping Cart Logic
   ===================================================== */

let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('webcafe_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    createCartUI();
    updateCartIcon();
    renderCartItems();
}

// Add item to cart
window.addToCart = function(id, name, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), image, quantity: 1 });
    }
    saveCart();
    updateCartIcon();
    renderCartItems();
    showToast(`${name} added to cart! 🛒`, 'success');
    
    // Optional: open cart when item is added
    // document.getElementById('cartSidebar').classList.add('open');
};

// Remove item from cart
window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartIcon();
    renderCartItems();
};

// Update quantity
window.updateQuantity = function(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartIcon();
            renderCartItems();
        }
    }
};

// Save to localStorage
function saveCart() {
    localStorage.setItem('webcafe_cart', JSON.stringify(cart));
}

// Update the cart badge count
function updateCartIcon() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = totalItems;
        if (totalItems > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Open/Close Cart Sidebar
window.toggleCart = function() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }
};

// Create the Cart UI dynamically if it doesn't exist
function createCartUI() {
    if (document.getElementById('cartSidebar')) return;

    // Cart Overlay
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cartOverlay';
    overlay.onclick = toggleCart;

    // Cart Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'cart-sidebar';
    sidebar.id = 'cartSidebar';

    sidebar.innerHTML = `
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button class="cart-close" onclick="toggleCart()">✕</button>
        </div>
        <div class="cart-body" id="cartBody">
            <!-- Items will be rendered here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cartTotalAmount">$0.00</span>
            </div>
            <button class="btn btn-primary btn-full checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);
}

// Render Cart Items
function renderCartItems() {
    const cartBody = document.getElementById('cartBody');
    const totalAmount = document.getElementById('cartTotalAmount');
    if (!cartBody) return;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <button class="btn btn-outline btn-sm" onclick="toggleCart(); window.location.href='/menu.html'">Browse Menu</button>
            </div>
        `;
        totalAmount.textContent = '$0.00';
        return;
    }

    let total = 0;
    cartBody.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
            </div>
        `;
    }).join('');

    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Placeholder checkout function
window.checkout = function() {
    if (cart.length === 0) return;
    showToast('Redirecting to secure checkout...', 'info');
    setTimeout(() => {
        cart = [];
        saveCart();
        toggleCart();
        renderCartItems();
        updateCartIcon();
        showToast('Order placed successfully! 🎉', 'success');
    }, 1500);
}

document.addEventListener('DOMContentLoaded', initCart);
