
import { saveTheme, loadTheme } from './localStorage.js';

export function initDarkMode() {
    const themeToggle = document.querySelector('.header__theme-toggle');
    const themeIcon = document.querySelector('.header__theme-icon');
    
    if (!themeToggle) return;
    
    const isDarkMode = loadTheme();
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        saveTheme(isDark);
        if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
    });
}
