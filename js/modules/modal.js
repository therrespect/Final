let activeModal = null;

export function initModals() {
    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-modal-close')) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
            closeModal();
        }
    });
}

export function openModal(modalName, content = '') {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    if (!modal) return;
    
    const modalBody = modal.querySelector('[data-modal-body]');
    if (modalBody) {
        modalBody.innerHTML = content;
    }
    
    modal.classList.add('modal--active');
    activeModal = modal;
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    if (!activeModal) return;
    
    activeModal.classList.remove('modal--active');
    document.body.style.overflow = '';
    activeModal = null;
}

export function showToast(message, type = 'success', duration = 3000) {
    const container = document.querySelector('[data-toasts]');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast--error' : ''}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('toast--show'), 10);
    setTimeout(() => {
        toast.classList.remove('toast--show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

export function showQuickView(product) {
    // Определяем префикс пути
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isInPages ? '../' : '';
    
    const content = `
        <div class="quick-view">
            <img src="${prefix}${product.image}" alt="${product.name}" class="quick-view__image">
            <div class="quick-view__info">
                <h2 class="quick-view__title">${product.name}</h2>
                <p class="quick-view__description">${product.description}</p>
                <div class="quick-view__meta">
                    <span>Вес: ${product.weight} г</span>
                    ${product.vegan ? '<span>🌱 Веганский</span>' : ''}
                </div>
                <div class="quick-view__price">${product.price} ₽</div>
                <button class="button button--primary quick-view__button" onclick="addProductToCart(${product.id})">В корзину</button>
            </div>
        </div>
    `;
    
    openModal('quick-view', content);
}

export function renderProducts(products, container) {
    if (!container || !products) return;
    
    // Определяем, находимся ли мы в папке /pages/
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isInPages ? '../' : '';
    
    container.innerHTML = products.map(product => {
        const badges = [];
        if (product.popular) {
            badges.push(`<span class="product-card__badge product-card__badge--popular">Хит</span>`);
        }
        if (product.new) {
            badges.push(`<span class="product-card__badge product-card__badge--new">Новинка</span>`);
        }
        
        return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-card__image-wrapper">
                <img src="${prefix}${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
                <div class="product-card__badges">
                    ${badges.join('')}
                </div>
            </div>
            <div class="product-card__body">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <div class="product-card__meta">
                    <span class="product-card__weight">${product.weight} г</span>
                    <span class="product-card__price">${product.price} ₽</span>
                </div>
                <div class="product-card__footer">
                    <button class="button button--primary product-card__button" onclick="addProductToCart(${product.id})">
                        В корзину
                    </button>
                    <button class="button button--secondary product-card__button product-card__button--quick" onclick="showQuickViewProduct(${product.id})">
    👁️
</button>
                </div>
            </div>
        </article>
    `}).join('');
}