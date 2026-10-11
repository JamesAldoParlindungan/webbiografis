
/* =========================================
   BEYOND NUMBERS
   Theme Switcher: Light / Dark Mode
========================================= */

(() => {
    "use strict";

    const STORAGE_KEY = "beyond-numbers-theme";
    const root = document.documentElement;

    // -----------------------------------------
    // 1. DETERMINE INITIAL THEME
    // -----------------------------------------

    function getInitialTheme() {
        try {
            const savedTheme = localStorage.getItem(STORAGE_KEY);

            if (savedTheme === "light" || savedTheme === "dark") {
                return savedTheme;
            }
        } catch (error) {
            // Continue with device preference if storage is unavailable.
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    let currentTheme = getInitialTheme();

    // Apply before page rendering to reduce the flash of the wrong theme.
    root.setAttribute("data-theme", currentTheme);


    // -----------------------------------------
    // 2. THEME STYLES
    // -----------------------------------------

    const themeStyles = document.createElement("style");

    themeStyles.textContent = `
        /* Dark theme color palette */
        :root[data-theme="dark"] {
            color-scheme: dark;

            --color-bg: #151D19;
            --color-surface: #1D2822;
            --color-primary: #102A23;
            --color-primary-light: #25483B;
            --color-accent: #D0B578;
            --color-text: #F0EEE7;
            --color-muted: #B0B7AE;
            --color-border: #35443A;
            --color-soft: #243129;

            --bio-ink: #F0EEE7;
            --bio-ink-light: #D6DED5;
            --bio-gold: #D0B578;
            --bio-paper: #151D19;
            --bio-white: #1D2822;
            --bio-muted: #B0B7AE;
            --bio-border: #35443A;
            --bio-soft: #243129;
            --bio-dark: #101713;
        }

        /* Main surfaces */
        :root[data-theme="dark"] body {
            background-color: var(--color-bg);
            color: var(--color-text);
            transition:
                background-color 350ms ease,
                color 350ms ease;
        }

        :root[data-theme="dark"] .site-header {
            background-color: var(--color-bg);
            border-color: var(--color-border);
        }

        :root[data-theme="dark"] .site-footer {
            background-color: var(--color-primary);
            color: var(--color-text);
        }

        /* Typography */
        :root[data-theme="dark"] h1,
        :root[data-theme="dark"] h2,
        :root[data-theme="dark"] h3,
        :root[data-theme="dark"] h4,
        :root[data-theme="dark"] p,
        :root[data-theme="dark"] li,
        :root[data-theme="dark"] strong,
        :root[data-theme="dark"] .nav-link,
        :root[data-theme="dark"] .brand-name,
        :root[data-theme="dark"] .bio-nav-title {
            color: inherit;
        }

        :root[data-theme="dark"] .eyebrow,
        :root[data-theme="dark"] .fact-label,
        :root[data-theme="dark"] .content-year,
        :root[data-theme="dark"] .marker-label,
        :root[data-theme="dark"] .bio-nav-label {
            color: var(--color-accent);
        }

        :root[data-theme="dark"] a {
            color: var(--color-accent);
        }

        :root[data-theme="dark"] .brand,
        :root[data-theme="dark"] .nav-link {
            color: var(--color-text);
        }

        /* Biography sections */
        :root[data-theme="dark"] .bio-introduction,
        :root[data-theme="dark"] .bio-section-soft,
        :root[data-theme="dark"] .bio-section {
            color: var(--color-text);
        }

        :root[data-theme="dark"] .bio-section-soft {
            background-color: var(--color-soft);
        }

        :root[data-theme="dark"] .bio-section-dark {
            background-color: #101713;
            color: var(--color-text);
        }

        :root[data-theme="dark"] .bio-content-block,
        :root[data-theme="dark"] .legacy-card,
        :root[data-theme="dark"] .quick-fact,
        :root[data-theme="dark"] .bio-portrait-frame {
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
        }

        :root[data-theme="dark"] .data-principle,
        :root[data-theme="dark"] .math-display {
            background-color: var(--color-soft);
            border-color: var(--color-border);
            color: var(--color-text);
        }

        :root[data-theme="dark"] .bio-quote {
            color: var(--color-text);
        }

        :root[data-theme="dark"] .bio-breadcrumb {
            color: var(--color-muted);
        }

        :root[data-theme="dark"] .bio-breadcrumb a {
            color: var(--color-accent);
        }

        :root[data-theme="dark"] .bio-navigation {
            border-color: var(--color-border);
        }

        :root[data-theme="dark"] .bio-reflection {
            color: var(--color-text);
        }

        /* Landing page cards and surfaces */
        :root[data-theme="dark"] .figure-card,
        :root[data-theme="dark"] .about-card,
        :root[data-theme="dark"] .hero-card {
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
        }

        /* Theme toggle */
        .theme-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 40px;
            padding: 9px 13px;
            border: 1px solid var(--color-border, #E3E0D7);
            border-radius: 999px;
            background: var(--color-surface, #FFFFFF);
            color: var(--color-text, #252923);
            font: inherit;
            font-size: 0.85rem;
            cursor: pointer;
            transition:
                background-color 250ms ease,
                color 250ms ease,
                border-color 250ms ease,
                transform 250ms ease;
        }

        .theme-toggle:hover {
            transform: translateY(-2px);
            border-color: var(--color-accent, #B69A61);
        }

        .theme-toggle:focus-visible {
            outline: 2px solid var(--color-accent, #B69A61);
            outline-offset: 4px;
        }

        .theme-toggle-icon {
            font-size: 1.05rem;
            line-height: 1;
        }

        @media (prefers-reduced-motion: reduce) {
            :root[data-theme] *,
            :root[data-theme] *::before,
            :root[data-theme] *::after {
                transition-duration: 0.01ms !important;
            }
        }
    `;

    document.head.appendChild(themeStyles);


    // -----------------------------------------
    // 3. CREATE THEME BUTTON
    // -----------------------------------------

    function createThemeButton() {
        const navMenu = document.getElementById("nav-menu");

        if (!navMenu || document.getElementById("theme-toggle")) {
            return;
        }

        const listItem = document.createElement("li");
        listItem.className = "theme-menu-item";

        const button = document.createElement("button");

        button.type = "button";
        button.id = "theme-toggle";
        button.className = "theme-toggle";

        button.innerHTML = `
            <span class="theme-toggle-icon" aria-hidden="true"></span>
            <span class="theme-toggle-label"></span>
        `;

        button.addEventListener("click", toggleTheme);

        listItem.appendChild(button);
        navMenu.appendChild(listItem);

        updateThemeButton();
    }


    // -----------------------------------------
    // 4. UPDATE BUTTON LABEL AND ICON
    // -----------------------------------------

    function updateThemeButton() {
        const button = document.getElementById("theme-toggle");

        if (!button) return;

        const icon = button.querySelector(".theme-toggle-icon");
        const label = button.querySelector(".theme-toggle-label");

        const isDark = currentTheme === "dark";

        icon.textContent = isDark ? "☀" : "☾";
        label.textContent = isDark ? "Light Mode" : "Dark Mode";

        button.setAttribute(
            "aria-label",
            isDark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"
        );

        button.setAttribute("aria-pressed", String(isDark));
        button.title = isDark
            ? "Ganti ke Light Mode"
            : "Ganti ke Dark Mode";
    }


    // -----------------------------------------
    // 5. SWITCH THEME
    // -----------------------------------------

    function applyTheme(theme) {
        currentTheme = theme;

        root.setAttribute("data-theme", theme);

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            // Theme still works for the current page.
        }

        updateThemeButton();
    }

    function toggleTheme() {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);
    }


    // -----------------------------------------
    // 6. FOLLOW DEVICE CHANGES WHEN NO SAVED THEME
    // -----------------------------------------

    const colorScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

    colorScheme.addEventListener?.("change", (event) => {
        let hasSavedTheme = false;

        try {
            hasSavedTheme = localStorage.getItem(STORAGE_KEY) !== null;
        } catch (error) {
            // Ignore unavailable storage.
        }

        if (!hasSavedTheme) {
            applyTheme(event.matches ? "dark" : "light");
        }
    });


    // -----------------------------------------
    // 7. INITIALIZE
    // -----------------------------------------

    function initializeTheme() {
        createThemeButton();
        updateThemeButton();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeTheme, {
            once: true
        });
    } else {
        initializeTheme();
    }

})();
