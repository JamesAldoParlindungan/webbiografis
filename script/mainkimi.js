/* ==========================================================================
   KIMI THORA REFOLINO — PORTFOLIO INTERACTIONS
   File: script/mainkimi.js

   Fitur:
   01. Loader singkat + transisi antar halaman (panel tirai)
   02. Kursor bulat: membesar saat dekat / di atas objek, label kontekstual
   03. Magnetic buttons (elemen tertarik ke kursor saat didekati)
   04. Tilt 3D + spotlight pada kartu
   05. Text scramble (hover link/tombol, judul saat masuk viewport)
   06. Scrollspy, progress bar, HUD bagian aktif
   07. Shortcut keyboard: J/K pindah bagian, C ganti warna aksen
   08. Ticker marquee, jam WIB, parallax foto hero
   09. Burst kotak saat klik, menu mobile, easter egg (Konami)
   Catatan: tidak ada efek fade/reveal saat scroll.
   ========================================================================== */

(function () {
    'use strict';

    var doc = document;
    var root = doc.documentElement;
    var body = doc.body;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
    function make(tag, cls) { var n = doc.createElement(tag); if (cls) n.className = cls; return n; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function pad(n, l) { return String(n).padStart(l, '0'); }

    /* ======================================================================
       00. PALET WARNA AKSEN (tekan C)
       ====================================================================== */
    var PALETTES = [
        { name: 'ACID', a: '#d4ff1a', b: '#ff3d71' },
        { name: 'ORANGE', a: '#ff6a1f', b: '#00e5ff' },
        { name: 'CYAN', a: '#00e5ff', b: '#ff3d71' },
        { name: 'PINK', a: '#ff4fa3', b: '#d4ff1a' },
        { name: 'MINT', a: '#6dffb0', b: '#ff5a36' }
    ];
    var paletteIndex = 0;
    try { paletteIndex = parseInt(localStorage.getItem('kt-palette') || '0', 10) || 0; } catch (e) { }
    paletteIndex = clamp(paletteIndex, 0, PALETTES.length - 1);

    function applyPalette(i) {
        var p = PALETTES[i];
        root.style.setProperty('--accent', p.a);
        root.style.setProperty('--accent-2', p.b);
        try { localStorage.setItem('kt-palette', String(i)); } catch (e) { }
    }
    applyPalette(paletteIndex);

    /* ======================================================================
       01. LOADER & TRANSISI HALAMAN
       ====================================================================== */
    var loader = (function buildLoader() {
        var el = make('div');
        el.id = 'page-loader';
        el.setAttribute('data-state', 'cover');
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML =
            '<div class="loader-panels">' +
            '<i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i><i style="--i:4"></i>' +
            '</div>' +
            '<div class="loader-content">' +
            '<span class="loader-label">KT—PORTFOLIO / LOADING</span>' +
            '<strong class="loader-count">000</strong>' +
            '<div class="loader-bar"><span></span></div>' +
            '</div>';
        body.appendChild(el);
        body.classList.add('loader-ready', 'is-loading');
        return el;
    })();

    var loaderCount = $('.loader-count', loader);
    var loaderBar = $('.loader-bar span', loader);

    function setCount(v) {
        loaderCount.textContent = pad(v, 3);
        loaderBar.style.transform = 'scaleX(' + (v / 100) + ')';
    }

    function runIntro() {
        var duration = reduceMotion ? 0 : 650;
        var start = performance.now();
        var loaded = doc.readyState === 'complete';
        if (!loaded) window.addEventListener('load', function () { loaded = true; }, { once: true });
        setTimeout(function () { loaded = true; }, 1800);

        function tick(now) {
            var t = duration ? clamp((now - start) / duration, 0, 1) : 1;
            var eased = 1 - Math.pow(1 - t, 3);
            var v = Math.round(eased * 100);
            if (!(t >= 1 && loaded)) v = Math.min(v, 99);
            setCount(v);
            if (v < 100) { requestAnimationFrame(tick); } else { finishIntro(); }
        }
        requestAnimationFrame(tick);
    }

    function finishIntro() {
        setTimeout(function () {
            loader.setAttribute('data-state', 'leave');
            body.classList.remove('is-loading');
            body.classList.add('is-ready');
            setTimeout(function () {
                loader.setAttribute('data-state', 'idle');
                afterIntro();
            }, 900);
        }, 110);
    }

    function leaveTo(url) {
        loader.setAttribute('data-state', 'idle');
        void loader.offsetWidth; // flush style supaya transisi jalan
        setCount(0);
        body.classList.add('is-loading');
        loader.setAttribute('data-state', 'enter');

        var start = performance.now();
        (function tick(now) {
            var t = clamp((now - start) / 520, 0, 1);
            setCount(Math.round(t * 100));
            if (t < 1) requestAnimationFrame(tick);
        })(start);

        setTimeout(function () { window.location.href = url; }, reduceMotion ? 0 : 620);
    }

    function initPageTransitions() {
        doc.addEventListener('click', function (e) {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a) return;
            var href = a.getAttribute('href');
            if (!href || href.charAt(0) === '#') return;
            if (a.target && a.target !== '_self') return;
            if (a.hasAttribute('download')) return;
            var url;
            try { url = new URL(a.href, location.href); } catch (err) { return; }
            if (url.origin !== location.origin) return;
            if (url.pathname === location.pathname && url.search === location.search) return;
            e.preventDefault();
            leaveTo(url.href);
        });

        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                loader.setAttribute('data-state', 'idle');
                body.classList.remove('is-loading');
            }
        });
    }

    /* ======================================================================
       02. KURSOR BULAT
       ====================================================================== */
    var INTERACTIVE = 'a, button, [role="button"], .skill-list li, .education-tags span, .profile-tags span, .project-tags span';
    var CARDS = '.project-card, .publication-card, .skill-card, .education-card, .interest-card, .contact-item, .profile-image-frame, .about-aside';
    var MAGNETS = '.button, .back-home, .brand, .project-link, .publication-link, .footer-home, .contact-item';

    var CURSOR_LABELS = [
        ['.project-card', 'BACA'],
        ['.project-link', 'BUKA'],
        ['.publication-card', 'JURNAL'],
        ['.publication-link', 'TAUTAN'],
        ['.skill-card', 'STACK'],
        ['.interest-card', 'MINAT'],
        ['.education-card', 'KISAH'],
        ['.profile-image-frame', 'HALO!'],
        ['.contact-item', 'KONTAK'],
        ['.button-primary', 'KLIK'],
        ['.back-home', 'BALIK'],
        ['.about-aside', 'INFO'],
        ['.hud-swatch', 'WARNA'],
        ['.footer-brand', 'ATAS']
    ];

    function assignCursorLabels() {
        CURSOR_LABELS.forEach(function (pair) {
            $$(pair[0]).forEach(function (n) { if (!n.dataset.cursor) n.dataset.cursor = pair[1]; });
        });
    }

    function initCursor() {
        if (!finePointer) return;
        root.classList.add('has-cursor');

        var dot = make('div', 'cursor-dot');
        var ring = make('div', 'cursor-ring');
        dot.innerHTML = '<span class="cursor-shape"></span>';
        ring.innerHTML = '<span class="cursor-shape"><b class="cursor-label"></b></span>';
        body.appendChild(ring);
        body.appendChild(dot);

        var label = $('.cursor-label', ring);
        var mx = innerWidth / 2, my = innerHeight / 2;
        var rx = mx, ry = my;
        var pullX = 0, pullY = 0;
        var near = 1, nearTarget = 1;
        var visible = false;
        var grown = false;

        var magnets = $$(MAGNETS);

        window.addEventListener('pointermove', function (e) {
            if (e.pointerType === 'touch') return;
            mx = e.clientX; my = e.clientY;
            if (!visible) {
                visible = true;
                rx = mx; ry = my;
                root.classList.add('cursor-visible');
            }
        }, { passive: true });

        root.addEventListener('mouseleave', function () { visible = false; root.classList.remove('cursor-visible'); });
        root.addEventListener('mouseenter', function () { visible = true; root.classList.add('cursor-visible'); });
        window.addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
        window.addEventListener('pointerup', function () { ring.classList.remove('is-down'); });

        doc.addEventListener('pointerover', function (e) {
            var t = e.target;
            if (!(t instanceof Element)) return;
            var lab = t.closest('[data-cursor]');
            var hov = t.closest(INTERACTIVE);
            var card = t.closest(CARDS);

            ring.classList.remove('is-hover', 'is-label', 'is-card');
            label.textContent = '';
            grown = false;

            if (lab && lab.dataset.cursor) {
                label.textContent = lab.dataset.cursor;
                ring.classList.add('is-label');
                grown = true;
            } else if (hov) {
                ring.classList.add('is-hover');
                grown = true;
            } else if (card) {
                ring.classList.add('is-card');
                grown = true;
            }
        });

        var cache = new WeakMap();
        function setMagnet(m, ox, oy) {
            var key = ox.toFixed(1) + ',' + oy.toFixed(1);
            if (cache.get(m) === key) return;
            cache.set(m, key);
            m._ox = ox; m._oy = oy;
            m.style.setProperty('--mx', ox.toFixed(1) + 'px');
            m.style.setProperty('--my', oy.toFixed(1) + 'px');
        }

        function proximity() {
            var R = 140, best = 0, bx = 0, by = 0;
            magnets.forEach(function (m) {
                var r = m.getBoundingClientRect();
                if (r.bottom < -R || r.top > innerHeight + R || r.right < -R || r.left > innerWidth + R) {
                    if (m._ox || m._oy) setMagnet(m, 0, 0);
                    return;
                }
                var cx = r.left + r.width / 2 - (m._ox || 0);
                var cy = r.top + r.height / 2 - (m._oy || 0);
                var dx = mx - cx, dy = my - cy;
                var ex = Math.max(Math.abs(dx) - r.width / 2, 0);
                var ey = Math.max(Math.abs(dy) - r.height / 2, 0);
                var d = Math.hypot(ex, ey);

                if (d < R) {
                    var s = 1 - d / R;
                    var big = m.classList.contains('contact-item') ? 6 : 12;
                    setMagnet(m, clamp(dx * 0.2 * s, -big, big), clamp(dy * 0.28 * s, -big, big));
                    if (s > best) { best = s; bx = cx - mx; by = cy - my; }
                } else if (m._ox || m._oy) {
                    setMagnet(m, 0, 0);
                }
            });

            nearTarget = grown ? 1 : 1 + best * 0.9;
            pullX = bx * 0.3 * best;
            pullY = by * 0.3 * best;
        }

        function frame() {
            if (visible) proximity();
            rx = lerp(rx, mx + pullX, 0.2);
            ry = lerp(ry, my + pullY, 0.2);
            near = lerp(near, nearTarget, 0.15);
            dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
            ring.style.transform = 'translate3d(' + rx.toFixed(2) + 'px,' + ry.toFixed(2) + 'px,0)';
            ring.style.setProperty('--near', near.toFixed(3));
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    /* ======================================================================
       03. TILT + SPOTLIGHT KARTU
       ====================================================================== */
    function initCards() {
        var strong = $$('.project-card, .skill-card, .interest-card');
        var soft = $$('.education-card, .publication-card');
        strong.forEach(function (c) { c.dataset.tilt = c.dataset.tilt || '6'; });
        soft.forEach(function (c) { c.dataset.tilt = c.dataset.tilt || '1.6'; });

        strong.concat(soft).forEach(function (c) {
            var amt = parseFloat(c.dataset.tilt) || 5;
            c.addEventListener('pointermove', function (e) {
                if (e.pointerType === 'touch') return;
                var r = c.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width;
                var py = (e.clientY - r.top) / r.height;
                c.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
                c.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
                if (!reduceMotion) {
                    c.style.setProperty('--rx', ((0.5 - py) * amt).toFixed(2) + 'deg');
                    c.style.setProperty('--ry', ((px - 0.5) * amt * 1.4).toFixed(2) + 'deg');
                }
            });
            c.addEventListener('pointerleave', function () {
                c.style.setProperty('--rx', '0deg');
                c.style.setProperty('--ry', '0deg');
            });
        });
    }

    /* ======================================================================
       04. TEXT SCRAMBLE
       ====================================================================== */
    var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*+=<>/';

    function textNodeOf(el) {
        var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                var p = n.parentElement;
                if (p && p.closest('[aria-hidden], .nav-number, .contact-label')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        return walker.nextNode();
    }

    function scramble(node, duration) {
        if (!node || reduceMotion) return;
        if (node._final === undefined) node._final = node.nodeValue;
        var final = node._final;
        var chars = final.split('');
        cancelAnimationFrame(node._raf);
        var start = performance.now();
        duration = duration || 420;

        (function step(now) {
            var p = clamp((now - start) / duration, 0, 1);
            var reveal = Math.floor(p * chars.length);
            var out = '';
            for (var i = 0; i < chars.length; i++) {
                var c = chars[i];
                out += (i < reveal || /\s/.test(c)) ? c : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
            }
            node.nodeValue = out;
            if (p < 1) { node._raf = requestAnimationFrame(step); } else { node.nodeValue = final; }
        })(start);
    }

    function initScramble() {
        var hoverTargets = $$('.sidebar-navigation a, .button, .project-link, .publication-link, .back-home, .footer-home, .contact-item');
        hoverTargets.forEach(function (el) {
            var node = textNodeOf(el);
            if (!node) return;
            el.addEventListener('mouseenter', function () { scramble(node, 380); });
            el.addEventListener('focus', function () { scramble(node, 380); });
        });

        if (!('IntersectionObserver' in window) || reduceMotion) return;
        var seen = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                seen.unobserve(en.target);
                var node = textNodeOf(en.target);
                scramble(node, en.target.matches('h2') ? 650 : 450);
            });
        }, { threshold: 0.6 });

        $$('.section-heading h2, .section-number, .interest-block > h3').forEach(function (el) { seen.observe(el); });
    }

    /* ======================================================================
       05. SCROLLSPY, PROGRESS, HUD
       ====================================================================== */
    var spy = { sections: [], links: [], map: [], current: 0, hud: null };

    function initSpy() {
        spy.sections = $$('main .section');
        spy.links = $$('.sidebar-navigation a[href^="#"]');
        spy.map = spy.sections.map(function (s) {
            return spy.links.findIndex(function (l) { return l.getAttribute('href') === '#' + s.id; });
        });

        var progress = make('div', 'scroll-progress');
        progress.setAttribute('aria-hidden', 'true');
        body.appendChild(progress);

        var hud = make('div', 'hud');
        hud.setAttribute('aria-hidden', 'true');
        hud.innerHTML =
            '<span class="hud-index">01/' + pad(spy.sections.length, 2) + '</span>' +
            '<span class="hud-name">PROFIL</span>' +
            '<span class="hud-pct">0%</span>' +
            '<button type="button" class="hud-swatch" aria-label="Ganti warna aksen" tabindex="-1"></button>' +
            '<span class="hud-hint">J / K pindah bagian &nbsp;·&nbsp; C ganti warna</span>';
        body.appendChild(hud);
        spy.hud = hud;

        $('.hud-swatch', hud).addEventListener('click', cyclePalette);

        function setActive(i) {
            spy.current = i;
            var li = spy.map[i];
            spy.links.forEach(function (l, j) { l.classList.toggle('is-active', j === li); });
            if (li > -1 && spy.links[li]) {
                var name = spy.links[li].textContent.replace(/^\s*\d+\s*/, '').trim().toUpperCase();
                $('.hud-name', hud).textContent = name;
                try { spy.links[li].scrollIntoView({ block: 'nearest' }); } catch (e) { }
            }
            $('.hud-index', hud).textContent = pad(i + 1, 2) + '/' + pad(spy.sections.length, 2);
        }
        setActive(0);

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) setActive(spy.sections.indexOf(en.target));
                });
            }, { rootMargin: '-40% 0px -55% 0px' });
            spy.sections.forEach(function (s) { io.observe(s); });
        }

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var max = doc.documentElement.scrollHeight - innerHeight;
                var p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
                root.style.setProperty('--p', p.toFixed(4));
                $('.hud-pct', hud).textContent = Math.round(p * 100) + '%';
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
    }

    function goToSection(i) {
        i = clamp(i, 0, spy.sections.length - 1);
        spy.sections[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    /* ======================================================================
       06. TOAST, PALET, KEYBOARD
       ====================================================================== */
    var toastEl, toastTimer;
    function toast(msg) {
        if (!toastEl) {
            toastEl = make('div', 'toast');
            toastEl.setAttribute('role', 'status');
            body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        toastEl.classList.add('is-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 1500);
    }

    function cyclePalette() {
        paletteIndex = (paletteIndex + 1) % PALETTES.length;
        applyPalette(paletteIndex);
        toast('WARNA // ' + PALETTES[paletteIndex].name);
    }

    var KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var konamiPos = 0;

    function initKeyboard() {
        doc.addEventListener('keydown', function (e) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            var tag = (e.target && e.target.tagName) || '';
            if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;

            var k = e.key;

            // Konami
            if (k === KONAMI[konamiPos] || k.toLowerCase() === KONAMI[konamiPos]) {
                konamiPos++;
                if (konamiPos === KONAMI.length) {
                    konamiPos = 0;
                    body.classList.add('is-glitch');
                    toast('GLITCH MODE // ON');
                    setTimeout(function () { body.classList.remove('is-glitch'); }, 2200);
                }
            } else {
                konamiPos = (k === KONAMI[0]) ? 1 : 0;
            }

            var lower = k.toLowerCase();
            if (lower === 'j') { goToSection(spy.current + 1); }
            else if (lower === 'k') { goToSection(spy.current - 1); }
            else if (lower === 'c') { cyclePalette(); }
            else if (k === 'Escape') { closeMenu(); }
        });
    }

    /* ======================================================================
       07. MENU MOBILE
       ====================================================================== */
    var sidebar = $('#sidebar');
    var menuBtn;

    function closeMenu() {
        if (!sidebar || !menuBtn) return;
        sidebar.classList.remove('is-open');
        body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    function initMenu() {
        if (!sidebar) return;
        menuBtn = make('button', 'menu-toggle');
        menuBtn.type = 'button';
        menuBtn.setAttribute('aria-label', 'Buka navigasi');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<span></span><span></span><span></span>';
        var backdrop = make('div', 'sidebar-backdrop');
        body.appendChild(backdrop);
        body.appendChild(menuBtn);

        menuBtn.addEventListener('click', function () {
            var open = !sidebar.classList.contains('is-open');
            sidebar.classList.toggle('is-open', open);
            body.classList.toggle('menu-open', open);
            menuBtn.setAttribute('aria-expanded', String(open));
        });
        backdrop.addEventListener('click', closeMenu);
        $$('.sidebar-navigation a').forEach(function (a) { a.addEventListener('click', closeMenu); });
        window.addEventListener('resize', function () { if (innerWidth > 1024) closeMenu(); });
    }

    /* ======================================================================
       08. EXTRAS: TICKER, JAM, PARALLAX, BURST, TAB TITLE
       ====================================================================== */
    function initTicker() {
        var main = $('#main-content');
        if (!main) return;
        var items = ['DATA SCIENCE', 'MACHINE LEARNING', 'DEEP LEARNING', 'NLP', 'SCIENTIFIC RESEARCH', 'OPEN TO COLLABORATION'];
        var seq = items.map(function (t) { return '<span>' + t + '</span><i>✶</i>'; }).join('');
        var ticker = make('div', 'ticker');
        ticker.setAttribute('aria-hidden', 'true');
        ticker.innerHTML = '<div class="ticker-track">' + new Array(5).join(seq) + '</div>';
        main.insertBefore(ticker, main.firstChild);
    }

    function initClock() {
        var footer = $('.sidebar-footer');
        if (!footer) return;
        var clock = make('div', 'sidebar-clock');
        clock.setAttribute('aria-hidden', 'true');
        var p = $('p', footer);
        footer.insertBefore(clock, p);

        var fmt;
        try {
            fmt = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        } catch (e) { fmt = null; }

        function tick() {
            var d = new Date();
            var t = fmt ? fmt.format(d).replace(/\./g, ':') : d.toTimeString().slice(0, 8);
            clock.textContent = 'WIB ' + t;
        }
        tick();
        setInterval(tick, 1000);
    }

    function initParallax() {
        var visual = $('.profile-visual');
        if (!visual || !finePointer || reduceMotion) return;
        var section = $('.profile-section');
        (section || visual).addEventListener('pointermove', function (e) {
            var r = visual.getBoundingClientRect();
            var px = clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2), -1, 1);
            var py = clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2), -1, 1);
            visual.style.setProperty('--px', px.toFixed(3));
            visual.style.setProperty('--py', py.toFixed(3));
        });
    }

    function initBurst() {
        if (reduceMotion) return;
        var colors = function () {
            var cs = getComputedStyle(root);
            return [cs.getPropertyValue('--accent').trim(), cs.getPropertyValue('--accent-2').trim(), cs.getPropertyValue('--ink').trim()];
        };
        window.addEventListener('pointerdown', function (e) {
            if (e.button !== 0) return;
            var cols = colors();
            for (var i = 0; i < 9; i++) {
                var s = make('span', 'burst');
                s.style.background = cols[i % cols.length];
                s.style.border = '2px solid #0b0b0b';
                body.appendChild(s);
                var ang = (Math.PI * 2 * i) / 9 + Math.random() * 0.6;
                var dist = 36 + Math.random() * 46;
                var x = e.clientX - 6, y = e.clientY - 6;
                var anim = s.animate([
                    { transform: 'translate(' + x + 'px,' + y + 'px) rotate(0deg) scale(1)' },
                    { transform: 'translate(' + (x + Math.cos(ang) * dist) + 'px,' + (y + Math.sin(ang) * dist) + 'px) rotate(' + (Math.random() * 280 - 140) + 'deg) scale(0)' }
                ], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
                anim.onfinish = (function (n) { return function () { n.remove(); }; })(s);
            }
        });
    }

    function initTabTitle() {
        var original = doc.title;
        doc.addEventListener('visibilitychange', function () {
            doc.title = doc.hidden ? '← Balik lagi dong ✶' : original;
        });
    }

    /* ======================================================================
       INIT
       ====================================================================== */
    function init() {
        initPageTransitions();
        initTicker();
        initMenu();
        assignCursorLabels();
        initSpy();
        initCards();
        initScramble();
        initCursor();
        initKeyboard();
        initClock();
        initParallax();
        initBurst();
        initTabTitle();
        runIntro();
    }

    function afterIntro() {
        // Jika URL membawa hash, pastikan posisi sudah tepat setelah loader selesai
        if (location.hash) {
            var target = $(location.hash);
            if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }

    init();
})();