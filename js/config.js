const API_BASE = '';

const STATIC_MENU = [
  {
    _id: '1', name: 'Classic Espresso', category: 'Coffee', price: 3.50,
    description: 'Rich and bold single-origin espresso shot with a velvety crema. The purist\'s choice for a perfect morning wake-up.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80', available: true
  },
  {
    _id: '2', name: 'Caramel Latte', category: 'Coffee', price: 5.25,
    description: 'Smooth espresso blended with steamed milk and a drizzle of house-made caramel sauce. Sweet and satisfying.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80', available: true
  },
  {
    _id: '3', name: 'Cold Brew', category: 'Coffee', price: 4.75,
    description: 'Slow-steeped for 18 hours in cold water for a smooth, low-acid concentrate. Served over ice for maximum refreshment.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80', available: true
  },
  {
    _id: '4', name: 'Matcha Flat White', category: 'Coffee', price: 5.50,
    description: 'Premium ceremonial-grade matcha whisked into velvety steamed oat milk. Earthy, creamy, and totally irresistible.',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&q=80', available: true
  },
  {
    _id: '5', name: 'Vanilla Cappuccino', category: 'Coffee', price: 4.95,
    description: 'Classic cappuccino with equal parts espresso, steamed milk, and foam, finished with a hint of vanilla.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80', available: true
  },
  {
    _id: '6', name: 'New York Cheesecake', category: 'Desserts', price: 6.50,
    description: 'Thick, creamy classic cheesecake on a buttery graham cracker crust. Topped with a fresh berry compote.',
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&q=80', available: true
  },
  {
    _id: '7', name: 'Tiramisu', category: 'Desserts', price: 7.00,
    description: 'Authentic Italian tiramisu with espresso-soaked ladyfingers, mascarpone cream, and a dusting of cocoa powder.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80', available: true
  },
  {
    _id: '8', name: 'Belgian Waffle', category: 'Desserts', price: 5.75,
    description: 'Light and crispy Belgian waffle served warm with fresh strawberries, whipped cream, and a drizzle of maple syrup.',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&q=80', available: true
  },
  {
    _id: '9', name: 'Chocolate Lava Cake', category: 'Desserts', price: 7.50,
    description: 'Warm dark chocolate cake with a molten centre, served with vanilla bean ice cream and chocolate drizzle.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80', available: true
  },
  {
    _id: '10', name: 'Mango Smoothie', category: 'Drinks', price: 5.00,
    description: 'Fresh mango blended with tropical pineapple and coconut milk for a refreshing summer sipper. Vitamin-packed goodness.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80', available: true
  },
  {
    _id: '11', name: 'Berry Lemonade', category: 'Drinks', price: 4.50,
    description: 'Freshly squeezed lemonade muddled with mixed berries and a sprig of mint. The perfect sweet-tart balance.',
    image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600&q=80', available: true
  },
  {
    _id: '12', name: 'Bubble Tea', category: 'Drinks', price: 5.50,
    description: 'Classic Taiwanese milk tea with chewy tapioca pearls. Available in taro, matcha, or original black tea flavours.',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&q=80', available: true
  },
  {
    _id: '13', name: 'Avocado Toast', category: 'Snacks', price: 6.00,
    description: 'Toasted sourdough topped with smashed avocado, cherry tomatoes, everything bagel seasoning, and a poached egg.',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&q=80', available: true
  },
  {
    _id: '14', name: 'Butter Croissant', category: 'Snacks', price: 3.25,
    description: 'Freshly baked all-butter croissant with 72 flaky layers. Golden on the outside, pillowy soft on the inside.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80', available: true
  },
  {
    _id: '15', name: 'Cheese Panini', category: 'Snacks', price: 5.50,
    description: 'Grilled sourdough panini with aged cheddar, mozzarella, tomato, and basil pesto. Served with a side salad.',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80', available: true
  },
  {
    _id: '16', name: 'Barista\'s Special Latte', category: 'Specials', price: 6.75,
    description: 'Our barista\'s weekly rotating creation. This week: brown butter toffee latte with oat milk and smoked sea salt.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80', available: true
  },
  {
    _id: '17', name: 'Seasonal Affogato', category: 'Specials', price: 6.25,
    description: 'A double shot of espresso poured over house-made gelato. This season: salted caramel and vanilla bean swirl.',
    image: 'https://images.unsplash.com/photo-1592658590280-3b8a88929de1?w=600&q=80', available: true
  },
  {
    _id: '18', name: 'Iced Cortado', category: 'Coffee', price: 4.25,
    description: 'Equal parts espresso and cold-frothed milk served over a single large ice cube. Bold flavour, silky texture.',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600&q=80', available: true
  }
];

const STORAGE_KEY = 'webcafe_menu_items';

function _getMenuData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  const copy = STATIC_MENU.map(i => ({ ...i }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  return copy;
}

function _saveMenuData(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const MockAPI = {
  getMenu() {
    const items = _getMenuData().filter(i => i.available);
    return { success: true, data: items };
  },

  getAllMenu() {
    return { success: true, data: _getMenuData() };
  },

  getStats() {
    const all = _getMenuData();
    const available = all.filter(i => i.available);
    const cats = [...new Set(all.map(i => i.category))];
    return {
      success: true,
      stats: {
        totalMenuItems: all.length,
        availableItems: available.length,
        categoryCounts: cats,
        totalUsers: 1
      }
    };
  },

  addItem(payload) {
    const items = _getMenuData();
    const newItem = { ...payload, _id: Date.now().toString(), available: payload.available !== false };
    items.push(newItem);
    _saveMenuData(items);
    return { success: true, data: newItem };
  },

  updateItem(id, payload) {
    const items = _getMenuData();
    const idx = items.findIndex(i => i._id === id);
    if (idx === -1) return { success: false, message: 'Item not found.' };
    items[idx] = { ...items[idx], ...payload };
    _saveMenuData(items);
    return { success: true, data: items[idx] };
  },

  deleteItem(id) {
    const items = _getMenuData();
    const idx = items.findIndex(i => i._id === id);
    if (idx === -1) return { success: false, message: 'Item not found.' };
    items.splice(idx, 1);
    _saveMenuData(items);
    return { success: true };
  },

  login(email, password) {
    if (email === 'admin@webcafe.com' && password === 'admin123') {
      return { success: true, token: 'static-demo-token', user: { name: 'Admin', email } };
    }
    return { success: false, message: 'Invalid credentials. Use admin@webcafe.com / admin123' };
  }
};
