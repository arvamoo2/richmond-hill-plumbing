console.log("Richmond Hill Plumbing Pros — Site Loaded.");

// ============================================================
// SMOOTH SCROLL TO QUOTE
// ============================================================

function scrollToQuote() {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================================
// DISPATCH BUTTON — Professional loading state + navigate
// ============================================================

function dispatchAndGo() {
    const btn = document.getElementById('heroDispatchBtn');
    if (!btn || btn.classList.contains('loading')) return; // Prevent double-click

    const label    = btn.querySelector('.dispatch-label');
    const icon     = btn.querySelector('.dispatch-icon');
    const loader   = btn.querySelector('#dispatchLoader');

    // 1. Switch to loading state
    btn.classList.add('loading');
    btn.disabled = true;

    if (label)  label.textContent = 'DISPATCHING...';
    if (icon)   icon.style.display = 'none';
    if (loader) loader.style.display = 'flex';

    // 2. Navigate after a short, professional delay (800ms)
    setTimeout(() => {
        window.location.href = 'dispatch.html';
    }, 800);
}

// ============================================================
// FLIP CARD LOGIC
// ============================================================

function flipCard(card) {
    card.classList.toggle('is-flipped');
}

// ============================================================
// AJAX FORM SUBMISSION (PREVENTS REDIRECT)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // --- Sticky header shadow on scroll ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 4px 30px rgba(26, 58, 110, 0.18)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(26, 58, 110, 0.12)';
            }
        }, { passive: true });
    }

    // --- Active nav link highlighting ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active-link');
        } else {
            link.classList.remove('active-link');
        }
    });

    // --- AJAX Form Submission ---
    const forms = document.querySelectorAll('.custom-contact-form');

    forms.forEach(form => {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Loading state
            submitBtn.innerText = "SENDING...";
            submitBtn.style.opacity = "0.7";
            submitBtn.disabled = true;

            const data = new FormData(event.target);

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // SUCCESS — Show professional confirmation
                    form.innerHTML = `
                        <div style="text-align: center; padding: 50px 20px;">
                            <div style="
                                width: 64px; height: 64px;
                                background: #dcfce7;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin: 0 auto 20px;
                            ">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M6 16l8 8 12-12" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h3 style="
                                color: #ffffff;
                                font-family: 'Barlow Condensed', sans-serif;
                                font-size: 36px;
                                font-weight: 800;
                                letter-spacing: 1px;
                                text-transform: uppercase;
                                margin-bottom: 12px;
                            ">REQUEST RECEIVED!</h3>
                            <p style="
                                color: rgba(255,255,255,0.75);
                                font-size: 1.05rem;
                                line-height: 1.6;
                                max-width: 420px;
                                margin: 0 auto 20px;
                                font-family: 'Nunito Sans', sans-serif;
                            ">Thank you for reaching out. Our dispatch team has your details and will be in touch within 15 minutes.</p>
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                                background: rgba(249, 115, 22, 0.15);
                                border: 1.5px solid rgba(249, 115, 22, 0.4);
                                color: #fbbf24;
                                padding: 8px 20px;
                                border-radius: 100px;
                                font-size: 12px;
                                font-weight: 700;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                font-family: 'Nunito Sans', sans-serif;
                            ">
                                <span style="width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;flex-shrink:0;"></span>
                                DISPATCH TEAM NOTIFIED
                            </div>
                        </div>
                    `;
                } else {
                    // Server-side error
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.opacity = "1";
                    submitBtn.disabled = false;
                    showFormError(form, "There was a problem submitting your request. Please try again or call us directly at 416-721-7325.");
                }
            } catch (error) {
                // Network error
                submitBtn.innerText = originalBtnText;
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
                showFormError(form, "Network error — please check your connection or call us at 416-721-7325.");
            }
        });
    });

    // --- Before/After Slider (if present on work page) ---
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => {
        const container = slider.closest('.image-comparison');
        const beforeImg = container?.querySelector('.img-before');
        const sliderLine = container?.querySelector('.slider-line');
        const sliderIcon = container?.querySelector('.slider-icon');

        if (!container || !beforeImg) return;

        function updateSlider(pos) {
            const rect = container.getBoundingClientRect();
            let pct = ((pos - rect.left) / rect.width) * 100;
            pct = Math.min(Math.max(pct, 2), 98);

            beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            if (sliderLine) sliderLine.style.left = `${pct}%`;
            if (sliderIcon) {
                sliderIcon.style.left = `${pct}%`;
                sliderIcon.style.transform = `translate(-50%, -50%)`;
            }
        }

        slider.addEventListener('input', function () {
            updateSlider(
                container.getBoundingClientRect().left +
                (this.value / 100) * container.getBoundingClientRect().width
            );
        });

        // Mouse drag
        let dragging = false;
        container.addEventListener('mousedown', () => { dragging = true; });
        window.addEventListener('mouseup', () => { dragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (dragging) updateSlider(e.clientX);
        });

        // Touch drag
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            updateSlider(e.touches[0].clientX);
        }, { passive: false });
    });

});

// ============================================================
// HELPER: Show inline form error
// ============================================================

function showFormError(form, message) {
    // Remove any existing error message first
    const existing = form.querySelector('.form-error-msg');
    if (existing) existing.remove();

    const errDiv = document.createElement('div');
    errDiv.className = 'form-error-msg';
    errDiv.style.cssText = `
        background: rgba(220, 38, 38, 0.12);
        border: 1.5px solid rgba(220, 38, 38, 0.35);
        color: #fca5a5;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        margin-bottom: 16px;
        font-family: 'Nunito Sans', sans-serif;
        text-align: center;
    `;
    errDiv.textContent = message;
    form.insertBefore(errDiv, form.firstChild);

    // Auto-remove after 6s
    setTimeout(() => errDiv.remove(), 6000);
}
