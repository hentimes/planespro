// =========================================
// ANIMACIONES Y FUNCIONALIDADES HERO
// =========================================
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.step, .caso-card, .testimonio-card, .asesor-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initializeNewHeroFeatures() {
    const calculatorSlider = document.getElementById('current-payment');
    if (calculatorSlider) {
        calculateSavings();
        calculatorSlider.addEventListener('input', calculateSavings);
    }
    initializeLogosCarousel();
    initializeUrgencyBanner();
}

function calculateSavings() {
    const currentPayment = document.getElementById('current-payment');
    const paymentDisplay = document.getElementById('payment-display');
    const potentialSavings = document.getElementById('potential-savings');
    const annualSavings = document.getElementById('annual-savings');
    if (!currentPayment) return;
    const payment = parseInt(currentPayment.value);
    paymentDisplay.textContent = `$${payment.toLocaleString('es-CL')}`;
    let savingsPercentage;
    if (payment <= 80000) savingsPercentage = 0.15;
    else if (payment <= 150000) savingsPercentage = 0.25;
    else if (payment <= 250000) savingsPercentage = 0.30;
    else savingsPercentage = 0.35;
    const monthlySavings = Math.round(payment * savingsPercentage);
    potentialSavings.textContent = `$${monthlySavings.toLocaleString('es-CL')}`;
    annualSavings.textContent = `$${(monthlySavings * 12).toLocaleString('es-CL')}`;
}

function initializeLogosCarousel() { /* ... Lógica del carrusel de logos ... */ }
function initializeUrgencyBanner() { /* ... Lógica del banner de urgencia ... */ }
