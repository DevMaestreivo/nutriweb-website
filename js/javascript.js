/**********************************************
 * SECTION 1 — FILTER REVIEWS
 **********************************************/
const filterButtons = document.querySelectorAll('.filter-btn');
const reviewCards = document.querySelectorAll('.review-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        reviewCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/**********************************************
 * SECTION 2 — LOAD MORE BUTTON
 **********************************************/
const loadMoreBtn = document.querySelector('.btn-load-more');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        alert('Load more reviews functionality - connect to your backend');
    });
}

/**********************************************
 * SECTION 3 — MOBILE NAVBAR TOGGLE
 **********************************************/
const mobileToggle = document.querySelector('.mobile-toggle');
const navbarLinks = document.querySelector('.navbar-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navbarLinks.classList.toggle('active');
    });
}

/**********************************************
 * SECTION 4 — PACKAGE & PROMO CODE SYSTEM
 **********************************************/

// Package data
const packages = {
    'standard': { name: 'الباقة الأساسية', price: 599 },
    'pro': { name: 'باقة PRO', price: 749 },
    'vip': { name: 'الباقة المميزة VIP', price: 899 }
};

// Promo codes
const promoCodes = {
    'PRO30': { discount: 30, description: 'خصم 30% لباقة PRO', applicable: ['pro'] },
    'VIP25': { discount: 25, description: 'خصم 25% للباقة VIP', applicable: ['vip'] },
    'STANDARD35': { discount: 35, description: 'خصم 35% للباقة STANDARD', applicable: ['standard'] }
};

// Global variables
let selectedPackage = 'pro';
let appliedDiscount = null;

// Elements
const promoInput = document.getElementById('promoInput');
const applyBtn = document.getElementById('applyBtn');
const message = document.getElementById('message');
const btnText = applyBtn.querySelector('.btn-text');
const codesGrid = document.getElementById('codesGrid');

// Initialize
document.addEventListener('DOMContentLoaded', () => updateAvailableCodes());

// Select package
function selectPackage(packageType) {
    selectedPackage = packageType;

    document.querySelectorAll('.package-option').forEach(option => {
        option.classList.remove('selected');
    });

    document.querySelector(`[data-package="${packageType}"]`).classList.add('selected');

    clearDiscount();
    updateAvailableCodes();
}

// Update available promo codes
function updateAvailableCodes() {
    codesGrid.innerHTML = '';

    Object.entries(promoCodes).forEach(([code, data]) => {
        const applicable = data.applicable.includes(selectedPackage);

        const card = document.createElement('div');
        card.className = `code-card ${!applicable ? 'disabled' : ''}`;
        card.innerHTML = `
            <div class="code-name">${code}</div>
            <div class="code-discount">${data.discount}% خصم</div>
            <div class="code-description">${data.description}</div>
        `;

        if (applicable) card.onclick = () => applyCode(code);

        codesGrid.appendChild(card);
    });
}

// Apply promo code
function applyPromoCode() {
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
        showMessage('يرجى إدخال كود الخصم', 'error');
        return;
    }

    btnText.innerHTML = '<div class="loading"></div>';
    applyBtn.disabled = true;

    setTimeout(() => {
        if (promoCodes[code]) {
            const promo = promoCodes[code];

            if (promo.applicable.includes(selectedPackage)) {
                showMessage(`تم تطبيق الكود! خصم ${promo.discount}%`, 'success');
                applyDiscount(promo.discount, code);
            } else {
                showMessage('هذا الكود غير صالح لهذه الباقة', 'error');
            }
        } else {
            showMessage('كود الخصم غير صحيح', 'error');
        }

        btnText.textContent = 'تطبيق';
        applyBtn.disabled = false;
    }, 1200);
}

// Apply discount
function applyDiscount(percent, code) {
    const price = packages[selectedPackage].price;
    const amount = Math.round(price * (percent / 100));
    const final = price - amount;

    appliedDiscount = {
        code: code,
        percentage: percent,
        amount: amount,
        finalPrice: final,
        originalPrice: price
    };

    updatePackageCardDiscount();

    sessionStorage.setItem(
        'appliedDiscount',
        JSON.stringify({
            package: selectedPackage,
            ...appliedDiscount,
            timestamp: Date.now()
        })
    );
}

// Update package UI discount display
function updatePackageCardDiscount() {
    if (!appliedDiscount) return;

    const el = document.getElementById(`discount-${selectedPackage}`);
    if (el) {
        el.querySelector('.original-price').textContent = `${appliedDiscount.originalPrice} جنيه`;
        el.querySelector('.discounted-price').textContent = `${appliedDiscount.finalPrice} جنيه`;
        el.querySelector('.discount-amount').textContent = `خصم ${appliedDiscount.amount} جنيه`;
        el.classList.add('show');
    }
}

// Clear discount
function clearDiscount() {
    appliedDiscount = null;
    sessionStorage.removeItem('appliedDiscount');

    document.querySelectorAll('.price-discount').forEach(el => el.classList.remove('show'));
}

// Apply code from clicking card
function applyCode(code) {
    promoInput.value = code;
    applyPromoCode();
}

// WhatsApp message with selection
function contactWithCurrentSelection() {
    let msg = `السلام عليكم، اريد الاشتراك ب${packages[selectedPackage].name} بسعر ${packages[selectedPackage].price} جنيه`;

    if (appliedDiscount) {
        msg += `\n\nتم تطبيق كود الخصم: ${appliedDiscount.code}
السعر الأصلي: ${appliedDiscount.originalPrice} جنيه
السعر بعد الخصم: ${appliedDiscount.finalPrice} جنيه`;
    }

    window.open(`https://wa.me/201093191277?text=${encodeURIComponent(msg)}`, '_blank');
}

/**********************************************
 * SECTION 5 — INPUT FORMATTING & AUTO-LOAD
 **********************************************/
applyBtn.addEventListener('click', applyPromoCode);

promoInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') applyPromoCode();
});

promoInput.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
});

// Restore discount on page load
window.addEventListener('load', () => {
    const saved = sessionStorage.getItem('appliedDiscount');
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        const hours = (Date.now() - data.timestamp) / 3600000;

        if (hours < 24) {
            selectedPackage = data.package;
            appliedDiscount = data;

            selectPackage(selectedPackage);
            promoInput.value = data.code;
            updatePackageCardDiscount();

            showMessage(`الكود ${data.code} مطبق بالفعل`, 'success');
        } else {
            sessionStorage.removeItem('appliedDiscount');
        }
    } catch {
        sessionStorage.removeItem('appliedDiscount');
    }
});

/**********************************************
 * SECTION 6 — MESSAGE ALERTS
 **********************************************/
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.classList.add('show');

    setTimeout(() => message.classList.remove('show'), 5000);
}
function contactPackage(packageType) {
    const packageData = packages[packageType];
    let message = `السلام عليكم، أريد الاستفسار عن ${packageData.name} بسعر ${packageData.price} جنيه شهرياً`;

    const storedDiscount = sessionStorage.getItem('appliedDiscount');
    if (storedDiscount) {
        const discountData = JSON.parse(storedDiscount);
        if (discountData.package === packageType) {
            message += `\n\nتم تطبيق كود الخصم: ${discountData.code}`;
            message += `\nالسعر الأصلي: ${discountData.originalPrice} جنيه`;
            message += `\nالسعر بعد الخصم: ${discountData.finalPrice} جنيه`;
            message += `\nمقدار الخصم: ${discountData.amount} جنيه (${discountData.percentage}%)`;
        }
    }

    const phoneNumber = '201093191277';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
