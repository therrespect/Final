
import { saveCart, loadCart } from './localStorage.js';
import { showToast } from './modal.js';

export let cart = loadCart();

export function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    saveCart(cart);
    updateCartCount();
    showToast(`«${product.name}» добавлен в корзину`);
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

export function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartCount();
        renderCart();
    }
}

export function updateCartCount() {
    const countElements = document.querySelectorAll('[data-cart-count]');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    countElements.forEach(el => {
        el.textContent = totalCount;
    });
}

export function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function getCartWeight() {
    return cart.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
}

export function renderCart() {
    const cartItemsContainer = document.querySelector('[data-cart-items]');
    const cartEmpty = document.querySelector('[data-cart-empty]');
    const cartContent = document.querySelector('[data-cart-content]');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-cart-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item__image">
            <div class="cart-item__body">
                <h3 class="cart-item__title">${item.name}</h3>
                <p class="cart-item__weight">${item.weight} г</p>
                <div class="cart-item__controls">
                    <div class="cart-item__quantity">
                        <button class="cart-item__quantity-btn" data-action="decrease">-</button>
                        <input type="number" class="cart-item__quantity-input" value="${item.quantity}" min="1">
                        <button class="cart-item__quantity-btn" data-action="increase">+</button>
                    </div>
                    <div class="cart-item__price">${item.price * item.quantity} ₽</div>
                    <button class="cart-item__remove" data-action="remove">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartItemsContainer.querySelectorAll('[data-action="increase"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('[data-cart-item-id]').dataset.cartItemId);
            const item = cart.find(item => item.id === itemId);
            if (item) updateQuantity(itemId, item.quantity + 1);
        });
    });
    
    cartItemsContainer.querySelectorAll('[data-action="decrease"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('[data-cart-item-id]').dataset.cartItemId);
            const item = cart.find(item => item.id === itemId);
            if (item) updateQuantity(itemId, item.quantity - 1);
        });
    });
    
    cartItemsContainer.querySelectorAll('[data-action="remove"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('[data-cart-item-id]').dataset.cartItemId);
            removeFromCart(itemId);
        });
    });
    
    updateCartSummary();
}

function updateCartSummary() {
    const itemsCountEl = document.querySelector('[data-cart-items-count]');
    const totalWeightEl = document.querySelector('[data-cart-total-weight]');
    const totalPriceEl = document.querySelector('[data-cart-total-price]');
    
    if (itemsCountEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        itemsCountEl.textContent = `${totalItems} шт`;
    }
    
    if (totalWeightEl) {
        totalWeightEl.textContent = `${(getCartWeight() / 1000).toFixed(2)} кг`;
    }
    
    if (totalPriceEl) {
        totalPriceEl.textContent = `${getCartTotal()} ₽`;
    }
}

export function checkout(formData) {
    alert(`🎉 Заказ оформлен!

💰 Сумма: ${getCartTotal()} ₽
⚖️ Вес: ${(getCartWeight() / 1000).toFixed(2)} кг
👤 ${formData.name}
📞 ${formData.phone}
📅 ${formData.date} ${formData.time}

✅ Мы свяжемся с вами!`);
    
    cart = [];
    saveCart(cart);
    updateCartCount();
    renderCart();
}

export function initCart() {
    updateCartCount();
    renderCart();
}
