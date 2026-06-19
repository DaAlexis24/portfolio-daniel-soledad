function initHeader() {
    const darkToggle = document.getElementById('darkToggle');
    const darkToggleMobile = document.getElementById('darkToggleMobile');
    const openMenu = document.getElementById('openMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menu = document.getElementById('menu');
    let isMobileMenuOpen = false;
    
    function syncDarkModeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        const sunIcons = document.querySelectorAll('#sun, .mobile-sun');
        const moonIcons = document.querySelectorAll('#moon, .mobile-moon');
        
        if (isDark) {
            sunIcons.forEach(icon => icon.classList.remove('hidden'));
            moonIcons.forEach(icon => icon.classList.add('hidden'));
            document.getElementById('dayText')?.classList.remove('hidden');
            document.getElementById('nightText')?.classList.add('hidden');
        } else {
            moonIcons.forEach(icon => icon.classList.remove('hidden'));
            sunIcons.forEach(icon => icon.classList.add('hidden'));
            document.getElementById('dayText')?.classList.add('hidden');
            document.getElementById('nightText')?.classList.remove('hidden');
        }
    }
    
    function toggleDarkMode() {
        const html = document.documentElement;
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        syncDarkModeIcons();
    }
    
    function openMobileMenu() {
        menu?.classList.remove('hidden');
        openMenu?.classList.add('hidden');
        closeMenu?.classList.remove('hidden', 'flex');
        closeMenu?.classList.add('flex');
        document.body.style.overflow = 'hidden';
        isMobileMenuOpen = true;
    }
    
    function closeMobileMenu() {
        menu?.classList.add('hidden');
        closeMenu?.classList.add('hidden');
        closeMenu?.classList.remove('flex');
        openMenu?.classList.remove('hidden');
        document.body.style.overflow = '';
        isMobileMenuOpen = false;
    }
    
    // Event listeners
    darkToggle?.addEventListener('click', toggleDarkMode);
    darkToggleMobile?.addEventListener('click', toggleDarkMode);
    openMenu?.addEventListener('click', openMobileMenu);
    closeMenu?.addEventListener('click', closeMobileMenu);
    
    menu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 640) closeMobileMenu();
        });
    });
    
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen && menu && !menu.contains(e.target) && !openMenu?.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 640) closeMobileMenu();
    });
    
    syncDarkModeIcons();
    window.closeMobileMenu = closeMobileMenu;
}

document.addEventListener('astro:page-load', initHeader);
