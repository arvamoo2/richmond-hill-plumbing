/* ═══════════════════════════════════════════════════════════
   RICHMOND HILL PLUMBING PROS — main.js  v2.0
   ═══════════════════════════════════════════════════════════ */

console.log("Richmond Hill Plumbing Pros — Site Ready.");

// ─────────────────────────────────────────────────────────
// SCROLL TO QUOTE
// ─────────────────────────────────────────────────────────

function scrollToQuote() {
    const el = document.getElementById('quote');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─────────────────────────────────────────────────────────
// DISPATCH BUTTON — professional loading state + navigate
// ─────────────────────────────────────────────────────────

function dispatchAndGo() {
    const btn    = document.getElementById('heroDispatchBtn');
    if (!btn || btn.classList.contains('loading')) return;

    const label  = btn.querySelector('.dispatch-label');
    const icon   = btn.querySelector('.dispatch-icon');
    const loader = btn.querySelector('#dispatchLoader');

    btn.classList.add('loading');
    btn.disabled = true;
    if (label)  label.textContent = 'DISPATCHING…';
    if (icon)   icon.style.display = 'none';
    if (loader) loader.style.display = 'flex';

    setTimeout(() => { window.location.href = 'dispatch.html'; }, 820);
}

// ─────────────────────────────────────────────────────────
// FLIP CARD
// ─────────────────────────────────────────────────────────

function flipCard(card) {
    card.classList.toggle('is-flipped');
}

// ─────────────────────────────────────────────────────────
// DOM READY
// ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

    /* ── 1. Header scroll shadow ─────────────────────── */
    const header = document.getElementById('site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 12);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── 2. Active nav link ──────────────────────────── */
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        a.classList.toggle('active-link', href === page);
    });

    /* ── 3. Scroll reveal (IntersectionObserver) ─────── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Un-observe once revealed (fire once, stay visible)
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,      // 10% of element in view triggers it
            rootMargin: '0px 0px -40px 0px'  // slightly before bottom edge
        }
    );

    // Observe section-level elements
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Observe staggered children — we use a second observer so their
    // parent section being visible doesn't race with the child delay
    const childObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    childObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.reveal-child').forEach(el => {
        childObserver.observe(el);
    });

    /* ── 4. Hero parallax ────────────────────────────── */
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        let ticking = false;
        const applyParallax = () => {
            const scrollY = window.scrollY;
            // Move bg layer upward at ~30% of scroll speed for a subtle depth effect
            heroBg.style.transform = `translateY(${scrollY * 0.28}px)`;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(applyParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── 5. AJAX Form Submission ─────────────────────── */
    document.querySelectorAll('.custom-contact-form').forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn      = form.querySelector('button[type="submit"]');
            const originalText   = submitBtn.innerText;

            // Loading state
            submitBtn.innerText   = 'SENDING…';
            submitBtn.style.opacity = '0.75';
            submitBtn.disabled    = true;

            const data = new FormData(e.target);

            try {
                const res = await fetch(e.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    // ✅ Success — replace form with branded confirmation
                    form.innerHTML = `
                        <div style="text-align:center;padding:52px 20px;">
                            <div style="
                                width:68px;height:68px;
                                background:#dcfce7;border-radius:50%;
                                display:flex;align-items:center;justify-content:center;
                                margin:0 auto 22px;
                            ">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M5 16l9 9L27 8"
                                          stroke="#16a34a" stroke-width="3.5"
                                          stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h3 style="
                                color:#ffffff;
                                font-family:'Barlow Condensed',sans-serif;
                                font-size:40px;font-weight:800;
                                letter-spacing:1px;text-transform:uppercase;
                                margin:0 0 14px;
                            ">REQUEST RECEIVED!</h3>
                            <p style="
                                color:rgba(255,255,255,0.72);
                                font-family:'Nunito Sans',sans-serif;
                                font-size:1.05rem;line-height:1.65;
                                max-width:420px;margin:0 auto 26px;
                            ">Thank you for reaching out. Our dispatch team has your details and will be in contact within <strong style="color:#f97316;">15 minutes</strong>.</p>
                            <div style="
                                display:inline-flex;align-items:center;gap:9px;
                                background:rgba(249,115,22,0.14);
                                border:1.5px solid rgba(249,115,22,0.4);
                                color:#fbbf24;padding:8px 22px;border-radius:100px;
                                font-family:'Nunito Sans',sans-serif;
                                font-size:11.5px;font-weight:800;
                                letter-spacing:2px;text-transform:uppercase;
                            ">
                                <span style="width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;flex-shrink:0;"></span>
                                DISPATCH TEAM NOTIFIED
                            </div>
                        </div>
                    `;
                } else {
                    // Server error
                    submitBtn.innerText     = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled      = false;
                    showFormError(form, 'There was a problem submitting your request. Please try again or call us directly at 289-588-6513.');
                }
            } catch (err) {
                // Network error
                submitBtn.innerText     = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled      = false;
                showFormError(form, 'Network error — please check your connection or call us at 289-588-6513.');
            }
        });
    });

    /* ── 6. Before/After Slider ──────────────────────── */
    document.querySelectorAll('.comparison-slider').forEach(slider => {
        const container = slider.closest('.image-comparison');
        const beforeImg = container?.querySelector('.img-before');
        const line      = container?.querySelector('.slider-line');
        const icon      = container?.querySelector('.slider-icon');
        if (!container || !beforeImg) return;

        function moveTo(clientX) {
            const rect = container.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.min(Math.max(pct, 2), 98);
            beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            if (line)  { line.style.left = `${pct}%`; }
            if (icon)  { icon.style.left = `${pct}%`; icon.style.transform = 'translate(-50%,-50%)'; }
        }

        // Range input fallback
        slider.addEventListener('input', function () {
            const rect = container.getBoundingClientRect();
            moveTo(rect.left + (this.value / 100) * rect.width);
        });

        // Mouse drag
        let dragging = false;
        container.addEventListener('mousedown', () => { dragging = true; });
        window.addEventListener('mouseup',   () => { dragging = false; });
        window.addEventListener('mousemove', (e) => { if (dragging) moveTo(e.clientX); });

        // Touch drag
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            moveTo(e.touches[0].clientX);
        }, { passive: false });
    });

});

// ─────────────────────────────────────────────────────────
// HELPER: inline form error message
// ─────────────────────────────────────────────────────────

function showFormError(form, message) {
    const existing = form.querySelector('.form-error-msg');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'form-error-msg';
    div.style.cssText = `
        background: rgba(220,38,38,0.12);
        border: 1.5px solid rgba(220,38,38,0.35);
        color: #fca5a5;
        padding: 13px 18px;
        border-radius: 9px;
        font-size: 0.9rem;
        margin-bottom: 18px;
        font-family: 'Nunito Sans', sans-serif;
        text-align: center;
        line-height: 1.5;
    `;
    div.textContent = message;
    form.insertBefore(div, form.firstChild);
    setTimeout(() => div.remove(), 7000);
}
