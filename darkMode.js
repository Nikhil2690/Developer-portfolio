document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const html = document.documentElement;

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme - Default to DARK mode
    if (savedTheme === 'light') {
        // Only use light mode if explicitly saved as light
        body.classList.remove('dark-mode');
        html.setAttribute('data-theme', 'light');
    } else {
        // Default to dark mode (if no saved theme or saved as dark)
        body.classList.add('dark-mode');
        html.setAttribute('data-theme', 'dark');
    }

    function toggleDarkMode() {
        const isDarkMode = body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            body.classList.remove('dark-mode');
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        
        // Add smooth transition effect
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    // Toggle dark mode on button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.add('dark-mode');
                html.setAttribute('data-theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                html.setAttribute('data-theme', 'light');
            }
        }
    });
});