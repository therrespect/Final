
export function initMenu() {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    
    if (!burger || !nav) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('header__burger--active');
        nav.classList.toggle('header__nav--active');
    });
    
    nav.querySelectorAll('.header__menu-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('header__burger--active');
            nav.classList.remove('header__nav--active');
        });
    });
}
