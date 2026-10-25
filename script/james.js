/* ============================================================
   JAMES ALDO PARLINDUNGAN — BRUTALIST INTERACTIONS
   Preloader cepat | Custom cursor magnetik | Scroll behaviors
   ============================================================ */
(function () {
    "use strict";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------------------------------------------------------
       1. PRELOADER — singkat, brutal, langsung geser ke atas
       --------------------------------------------------------- */
    const preloader = document.createElement("div");
    preloader.id = "preloader";
    preloader.innerHTML = `
        <div class="pre-logo">JAMES<span>.</span>ALDO</div>
        <div class="pre-bar"><i id="pre-fill"></i></div>
        <div class="pre-pct" id="pre-pct">0%</div>
        <div class="pre-tag">LOADING_PORTFOLIO.EXE</div>`;
    document.body.prepend(preloader);

    const preFill = preloader.querySelector("#pre-fill");
    const prePct  = preloader.querySelector("#pre-pct");
    let pct = 0;
    const startTime = performance.now();
    const MIN_TIME = 850;   // durasi minimum (terasa "loading")
    const MAX_TIME = 2200;  // batas maksimum jika assets lambat

    function setPct(v) {
        pct = Math.min(100, Math.round(v));
        preFill.style.width = pct + "%";
        prePct.textContent = pct + "%";
    }

    const tick = setInterval(() => {
        // naik cepat di awal, melambat mendekati 90
        setPct(pct + (pct < 70 ? 12 : pct < 90 ? 4 : 1.5));
        if (pct >= 100) finish();
    }, 60);

    function finish() {
        clearInterval(tick);
        setPct(100);
        const elapsed = performance.now() - startTime;
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            preloader.classList.add("done");
            document.body.classList.add("loaded");
            preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
            startHeroWords();
        }, wait + 120);
    }
    // safety: paksa selesai jika terlalu lama
    setTimeout(finish, MAX_TIME);
    window.addEventListener("load", () => { if (pct < 100) setPct(95); });

    /* ---------------------------------------------------------
       2. CUSTOM CURSOR — dot + ring, membesar di elemen interaktif
       --------------------------------------------------------- */
    if (isFinePointer && !prefersReduced) {
        const dot = document.createElement("div");
        dot.className = "cursor-dot";
        const ring = document.createElement("div");
        ring.className = "cursor-ring";
        ring.innerHTML = '<span class="cursor-label">LIHAT</span>';
        document.body.append(dot, ring);

        let mx = innerWidth / 2, my = innerHeight / 2;
        let rx = mx, ry = my; // posisi ring (lerp)

        window.addEventListener("mousemove", (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
        }, { passive: true });

        (function loop() {
            rx += (mx - rx) * 0.16;   // ring mengejar dengan delay halus
            ry += (my - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
            requestAnimationFrame(loop);
        })();

        // elemen yang bikin cursor MEMBESAR
        const HOVER_SEL = "a, button, li, article, figure, h2, h3, #profil figcaption";
        document.addEventListener("mouseover", (e) => {
            const t = e.target.closest(HOVER_SEL);
            if (!t) return;
            ring.classList.add("is-hover");
            // khusus area "lihat" (gambar profil / cards besar)
            if (e.target.closest("#profil figure, #prestasi article")) {
                ring.classList.add("is-view");
            }
        });
        document.addEventListener("mouseout", (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest(HOVER_SEL)) {
                ring.classList.remove("is-hover", "is-view");
            }
        });

        // efek magnet ringan pada CTA hero
        document.querySelectorAll("#profil a, header nav > a").forEach((el) => {
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
            });
            el.addEventListener("mouseleave", () => { el.style.transform = ""; });
        });
    }

    /* ---------------------------------------------------------
       3. HERO — animasi kata per kata (dipanggil setelah preloader)
       --------------------------------------------------------- */
    const heroTitle = document.querySelector("#profil h1");
    let wordsArmed = false;

    function armHeroWords() {
        if (!heroTitle || wordsArmed) return;
        wordsArmed = true;
        const words = heroTitle.textContent.trim().split(/\s+/);
        heroTitle.innerHTML = words.map((w, i) =>
            `<span class="word"><span style="animation-delay:${0.08 * i + 0.1}s">${w}</span></span>`
        ).join(" ");
    }

    function startHeroWords() {
        if (prefersReduced) return;
        armHeroWords(); // animasi CSS langsung jalan begitu kelas .loaded
    }
    if (prefersReduced) armHeroWords();

    /* ---------------------------------------------------------
       4. SCROLL PROGRESS BAR + HEADER STATE (bukan fade!)
       --------------------------------------------------------- */
    const progress = document.createElement("div");
    progress.id = "scroll-progress";
    document.body.appendChild(progress);
    const header = document.querySelector("header");

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
            header.classList.toggle("scrolled", h.scrollTop > 10);
            updateActiveNav();
            ticking = false;
        });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------------------------------------------------------
       5. NAV AKTIF — highlight link sesuai section yang terlihat
       --------------------------------------------------------- */
    const navLinks = [...document.querySelectorAll("header nav ul li a")];
    const sectionMap = new Map(
        navLinks.map((a) => [a.getAttribute("href").slice(1), a])
    );
    const observed = [...sectionMap.keys()]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (en.isIntersecting) {
                navLinks.forEach((l) => l.classList.remove("active"));
                const link = sectionMap.get(en.target.id);
                if (link) link.classList.add("active");
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });
    observed.forEach((s) => sectionObserver.observe(s));

    function updateActiveNav() { /* dipegang observer; scroll hanya untuk bar & header */ }

    /* ---------------------------------------------------------
       6. REVEAL SAAT SCROLL — hanya SLIDE (tanpa fade opacity)
       --------------------------------------------------------- */
    if (!prefersReduced) {
        const targets = document.querySelectorAll(
            "section > p, section > h2, section > article, #profil figure, #profil > div"
        );
        targets.forEach((t) => t.classList.add("reveal"));
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) {
                    en.target.classList.add("in");
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12 });
        targets.forEach((t) => io.observe(t));
    }

    /* ---------------------------------------------------------
       7. MARQUEE — strip berjalan brutal (disisipkan setelah hero)
       --------------------------------------------------------- */
    const phrases = [
        "DATA SCIENCE", "PYTHON", "SQL", "MACHINE LEARNING",
        "PCA", "GPR", "DJANGO", "PANDAS", "NUMPY", "ANALISIS DATA", "★"
    ];
    const marquee = document.createElement("div");
    marquee.className = "marquee";
    marquee.setAttribute("aria-hidden", "true");
    const seq = phrases.map((p) => `<span>${p}</span>`).join("");
    marquee.innerHTML = `<div class="marquee-track">${seq}${seq}</div>`;
    const hero = document.querySelector("#profil");
    hero.insertAdjacentElement("afterend", marquee);

    /* ---------------------------------------------------------
       8. NOMOR SECTION OTOMATIS — isi data-index di tiap h2
       --------------------------------------------------------- */
    const sections = [...document.querySelectorAll("main section")];
    sections.forEach((s, i) => {
        const h2 = s.querySelector("h2");
        if (h2) h2.setAttribute("data-index", "0" + (i + 1) + " /");
    });

    /* ---------------------------------------------------------
       9. EASTER EGG — ketik "DATA" untuk mode chaos 🌈
       --------------------------------------------------------- */
    let buffer = "";
    window.addEventListener("keydown", (e) => {
        if (e.key.length !== 1) return;
        buffer = (buffer + e.key.toUpperCase()).slice(-4);
        if (buffer === "DATA") {
            document.documentElement.style.setProperty("--acid", "#00e5ff");
            document.documentElement.style.setProperty("--pink", "#c8ff00");
            setTimeout(() => {
                document.documentElement.style.setProperty("--acid", "#c8ff00");
                document.documentElement.style.setProperty("--pink", "#ff2e88");
            }, 2500);
        }
    });

    /* ---------------------------------------------------------
       10. SMOOTH ANCHOR — offset rapi ke sticky nav
       --------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 84;
            window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
        });
    });

    onScroll();
})();