
const STORAGE_KEYS = {
    CART: 'bakery_cart',
    THEME: 'bakery_theme'
};

export function saveCart(cart) {
    try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch(e) {
        console.warn('Ошибка сохранения корзины:', e);
    }
}

export function loadCart() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        return saved ? JSON.parse(saved) : [];
    } catch(e) {
        console.warn('Ошибка загрузки корзины:', e);
        return [];
    }
}

export function saveTheme(isDark) {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
    } catch(e) {
        console.warn('Ошибка сохранения темы:', e);
    }
}

export function loadTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        return saved ? JSON.parse(saved) : false;
    } catch(e) {
        console.warn('Ошибка загрузки темы:', e);
        return false;
    }
}
