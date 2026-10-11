
/* =========================================
   BEYOND NUMBERS
   Interactive Website & Motion Effects
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Aktifkan enhancement hanya ketika JavaScript berjalan
    body.classList.add("js-enabled");


    /* =========================================
       1. INJECT INTERACTION STYLES
    ========================================= */

    const motionStyles = document.createElement("style");

    motionStyles.textContent = `
        /* Reading progress */
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 3px;
            background: var(--color-accent, #B69A61);
            z-index: 10000;
            pointer-events: none;
            transition: width 80ms linear;
        }

        /* Reveal animation */
        .js-enabled .js-reveal {
            opacity: 0;
            transform: translateY(28px);
            transition:
                opacity 700ms ease,
                transform 700ms cubic-bezier(.2, .65, .3, 1);
            transition-delay: var(--reveal-delay, 0ms);
        }

        .js-enabled .js-reveal.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Hero entrance */
        .js-enabled .bio-hero-content > *,
        .js-enabled .bio-portrait {
            animation: heroEntrance 800ms both;
        }

        .js-enabled .bio-hero-content > *:nth-child(1) {
            animation-delay: 80ms;
        }

        .js-enabled .bio-hero-content > *:nth-child(2) {
            animation-delay: 160ms;
        }

        .js-enabled .bio-hero-content > *:nth-child(3) {
            animation-delay: 240ms;
        }

        .js-enabled .bio-hero-content > *:nth-child(4) {
            animation-delay: 320ms;
        }

        .js-enabled .bio-portrait {
            animation-delay: 200ms;
        }

        @keyframes heroEntrance {
            from {
                opacity: 0;
                transform: translateY(22px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Interactive cards */
        .legacy-card,
        .bio-content-block,
        .quick-fact {
            transition:
                transform 300ms ease,
                box-shadow 300ms ease,
                border-color 300ms ease;
        }

        .legacy-card:hover,
        .bio-content-block:hover {
            transform: translateY(-4px);
        }

        .bio-portrait-frame img {
            transition: transform 700ms ease;
        }

        .bio-portrait-frame:hover img {
            transform: scale(1.035);
        }

        /* Header */
        .site-header {
            transition:
                box-shadow 300ms ease,
                background-color 300ms ease;
        }

        .site-header.is-scrolled {
            box-shadow: 0 5px 24px rgba(25, 59, 50, 0.08);
        }

        /* Floating back-to-top button */
        .floating-top {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 999;
            width: 46px;
            height: 46px;
            display: grid;
            place-items: center;
            border: 1px solid var(--color-border, #E3E0D7);
            border-radius: 50%;
            background: var(--color-primary, #193B32);
            color: white;
            font-size: 21px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(12px);
            transition:
                opacity 250ms ease,
                transform 250ms ease,
                visibility 250ms ease,
                background-color 250ms ease;
        }

        .floating-top.is-visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .floating-top:hover {
            background: var(--color-primary-light, #285347);
        }

        .floating-top:focus-visible,
        .menu-toggle:focus-visible,
        a:focus-visible {
            outline: 2px solid var(--color-accent, #B69A61);
            outline-offset: 4px;
        }

        /* Mobile navigation */
        @media (max-width: 900px) {
            .nav-menu.is-open {
                animation: menuEntrance 250ms ease both;
            }

            @keyframes menuEntrance {
                from {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        }

        /* Respect accessibility preferences */
        @media (prefers-reduced-motion: reduce) {
            .js-enabled *,
            .js-enabled *::before,
            .js-enabled *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                scroll-behavior: auto !important;
                transition-duration: 0.01ms !important;
            }

            .js-enabled .js-reveal {
                opacity: 1;
                transform: none;
            }
        }
    `;

    document.head.appendChild(motionStyles);


    /* =========================================
       2. MOBILE NAVIGATION
    ========================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Buka menu navigasi" : "Tutup menu navigasi"
            );

            navMenu.classList.toggle("is-open", !isOpen);
        });

        // Tutup menu setelah memilih tautan
        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Tutup menu menggunakan tombol Escape
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Tutup menu ketika pengguna mengeklik area di luar navigasi
        document.addEventListener("click", (event) => {
            if (
                !menuToggle.contains(event.target) &&
                !navMenu.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Tutup menu ketika kembali ke tampilan desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }


    /* =========================================
       3. SCROLL REVEAL ANIMATIONS
    ========================================= */

    const revealTargets = [
        ".bio-introduction",
        ".bio-section-heading",
        ".bio-content-block",
        ".bio-two-column",
        ".legacy-card",
        ".bio-quote",
        ".bio-reflection",
        ".bio-navigation",
        ".section-heading",
        ".figure-card",
        ".about-content",
        ".about-visual",
        ".about-card",
        ".hero-content",
        ".hero-visual"
    ];

    const revealElements = document.querySelectorAll(
        revealTargets.join(", ")
    );

    revealElements.forEach((element, index) => {
        element.classList.add("js-reveal");

        // Kartu ditampilkan dengan jeda pendek
        if (
            element.classList.contains("legacy-card") ||
            element.classList.contains("figure-card")
        ) {
            const delay = (index % 3) * 100;
            element.style.setProperty("--reveal-delay", `${delay}ms`);
        }
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }


    /* =========================================
       4. READING PROGRESS BAR
    ========================================= */

    const progressBar = document.createElement("div");

    progressBar.className = "reading-progress";
    progressBar.setAttribute("aria-hidden", "true");

    document.body.appendChild(progressBar);

    let scrollTicking = false;

    function updateScrollEffects() {
        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress =
            scrollableHeight > 0
                ? (scrollTop / scrollableHeight) * 100
                : 0;

        progressBar.style.width = `${Math.min(progress, 100)}%`;

        const header = document.querySelector(".site-header");

        if (header) {
            header.classList.toggle("is-scrolled", scrollTop > 20);
        }

        if (floatingTop) {
            floatingTop.classList.toggle("is-visible", scrollTop > 400);
        }

        scrollTicking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateScrollEffects);
                scrollTicking = true;
            }
        },
        { passive: true }
    );


    /* =========================================
       5. FLOATING BACK TO TOP
    ========================================= */

    const floatingTop = document.createElement("button");

    floatingTop.className = "floating-top";
    floatingTop.type = "button";
    floatingTop.setAttribute("aria-label", "Kembali ke bagian atas");
    floatingTop.setAttribute("title", "Kembali ke atas");
    floatingTop.innerHTML = "↑";

    document.body.appendChild(floatingTop);

    floatingTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    });


    /* =========================================
       6. SMOOTH SCROLL FOR INTERNAL LINKS
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Perbarui hash tanpa memicu lompatan halaman
            if (window.location.hash !== targetId) {
                history.pushState(null, "", targetId);
            }
        });
    });


    /* =========================================
       7. CURRENT YEAR IN FOOTER
    ========================================= */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================================
       8. ACTIVE NAVIGATION STATE
    ========================================= */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".nav-menu .nav-link").forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) return;

        const [filePart, hashPart] = href.split("#");
        const targetPage = (filePart || "index.html").toLowerCase();

        // Tandai halaman profil yang sedang dibuka
        if (
            targetPage === currentPage &&
            !hashPart &&
            currentPage !== "index.html"
        ) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });


    /* =========================================
       9. IMAGE LOADING ENHANCEMENT
    ========================================= */

    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("image-load-error");
        }, { once: true });

        image.addEventListener("load", () => {
            image.classList.add("image-loaded");
        }, { once: true });

        if (image.complete && image.naturalWidth > 0) {
            image.classList.add("image-loaded");
        }
    });


    /* =========================================
       10. INITIALIZE SCROLL STATE
    ========================================= */

    updateScrollEffects();

    console.info("Beyond Numbers: interactions initialized.");
});
