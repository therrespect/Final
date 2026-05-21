
// ГАРАНТИРОВАННОЕ СКРЫТИЕ ПРЕЛОАДЕРА
(function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('loader--hidden');
        setTimeout(() => loader.remove(), 500);
    }
})();

// Импорт
import { initCart } from './modules/cart.js';
import { initFilters, getPopularProducts } from './modules/filters.js';
import { initMenu } from './modules/menu.js';
import { initDarkMode } from './modules/darkMode.js';
import { initModals, renderProducts } from './modules/modal.js';
import { allProducts } from './modules/products.js';

console.log('🍞 Main.js загружен');

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    try {
        initMenu();
        initDarkMode();
        initModals();
        initCart();
        
        // КАТАЛОГ: сразу рендерим товары
        const productsGrid = document.querySelector('[data-products-grid]');
        if (productsGrid) {
            console.log('📦 Каталог найден');
            renderProducts(allProducts.slice(0, 12), productsGrid);
            initFilters();
        }
        
        // ХИТЫ НЕДЕЛИ
        const weeklyProducts = document.querySelector('[data-weekly-products]');
        if (weeklyProducts) {
            renderProducts(getPopularProducts(), weeklyProducts);
        }
        
        initReviewsSlider();
        initScrollAnimations();
        initForms();
    } catch(e) {
        console.error('❌ Ошибка:', e);
    }
});

// Слайдер
function initReviewsSlider() {
    const slider = document.querySelector('[data-reviews-slider]');
    if (!slider) return;
    
    const track = slider.querySelector('[data-reviews-track]');
    const prevBtn = slider.querySelector('[data-reviews-prev]');
    const nextBtn = slider.querySelector('[data-reviews-next]');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cards = track.querySelectorAll('.review-card');
    const totalCards = cards.length;
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        updateSlider();
    });
    
    setInterval(() => nextBtn.click(), 5000);
}

// Анимации
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Формы
function initForms() {
    const orderForm = document.querySelector('[data-order-form]');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(orderForm);
            const data = Object.fromEntries(formData);
            
            if (!data.name || !data.phone || !data.date || !data.time) {
                alert('Заполните все поля!');
                return;
            }
            
            import('./modules/cart.js').then(m => m.checkout(data));
        });
    }
    
    const contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = contactForm.querySelector('#contact-email').value;
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Некорректный email!');
                return;
            }
            
            contactForm.style.display = 'none';
            document.querySelector('[data-contact-success]').style.display = 'block';
            alert('Сообщение отправлено!');
        });
    }
}

// Глобальные функции
window.addProductToCart = async (id) => {
    const [cart, products] = await Promise.all([
        import('./modules/cart.js'),
        import('./modules/products.js')
    ]);
    const product = products.allProducts.find(p => p.id === id);
    if (product) cart.addToCart(product);
};

window.showQuickViewProduct = async (id) => {
    const [modal, products] = await Promise.all([
        import('./modules/modal.js'),
        import('./modules/products.js')
    ]);
    const product = products.allProducts.find(p => p.id === id);
    if (product) modal.showQuickView(product);
};
