const profileDropdowns = document.querySelectorAll('.nav-dropdown details');

profileDropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector('summary');

    dropdown.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', String(dropdown.open));
    });

    dropdown.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dropdown.open) {
            dropdown.open = false;
            summary.focus();
        }
    });
});

document.addEventListener('click', (event) => {
    profileDropdowns.forEach((dropdown) => {
        if (event.target instanceof Node && !dropdown.contains(event.target)) {
            dropdown.open = false;
        }
    });
});
