
import { allProducts } from './products.js';
import { renderProducts } from './modal.js';

let filteredProducts = [...allProducts];
let currentPage = 1;
const itemsPerPage = 8;

export function initFilters() {
    const searchInput = document.querySelector('[data-search]');
    const sortSelect = document.querySelector('[data-sort]');
    const filterGroups = document.querySelectorAll('[data-filter-group]');
    const loadMoreBtn = document.querySelector('[data-load-more]');
    
    // Первичный рендер
    renderFilteredProducts();
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    filterGroups.forEach(group => {
        group.addEventListener('click', (e) => {
            if (e.target.classList.contains('filters__tag')) {
                group.querySelectorAll('.filters__tag').forEach(tag => {
                    tag.classList.remove('filters__tag--active');
                });
                e.target.classList.add('filters__tag--active');
                applyFilters();
            }
        });
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderFilteredProducts();
        });
    }
}

function applyFilters() {
    const searchTerm = document.querySelector('[data-search]')?.value.toLowerCase() || '';
    const sortBy = document.querySelector('[data-sort]')?.value || 'default';
    const activeCategory = document.querySelector('[data-filter-group="category"] .filters__tag--active')?.dataset.filter || 'all';
    const activeAllergen = document.querySelector('[data-filter-group="allergen"] .filters__tag--active')?.dataset.filter || null;
    
    filteredProducts = allProducts.filter(product => {
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) return false;
        if (activeCategory !== 'all' && product.category !== activeCategory) return false;
        
        if (activeAllergen) {
            if (activeAllergen === 'gluten-free' && product.allergens.includes('gluten')) return false;
            if (activeAllergen === 'lactose-free' && product.allergens.includes('lactose')) return false;
            if (activeAllergen === 'vegan' && !product.vegan) return false;
        }
        
        return true;
    });
    
    sortProducts(sortBy);
    currentPage = 1;
    renderFilteredProducts();
}

function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.popular - a.popular);
            break;
        case 'new':
            filteredProducts.sort((a, b) => b.new - a.new);
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
}

function renderFilteredProducts() {
    const productsGrid = document.querySelector('[data-products-grid]');
    const loadMoreContainer = document.querySelector('[data-load-more]');
    
    if (!productsGrid) return;
    
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    renderProducts(productsToShow, productsGrid);
    
    if (loadMoreContainer) {
        loadMoreContainer.style.display = endIndex < filteredProducts.length ? 'block' : 'none';
    }
}

export function getPopularProducts() {
    return allProducts.filter(product => product.popular).slice(0, 4);
}
