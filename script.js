
// =====================================
// FOODIX - CYBERPUNK 3D WEBSITE
// =====================================


// 1. MOBILE NAVIGATION

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    hamburger.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});


// 2. 3D CIRCLE CAROUSEL

const carousel = document.getElementById("carousel");
const carouselCards = document.querySelectorAll(".carousel-card");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const carouselNumber = document.getElementById("carouselNumber");
const carouselProgress = document.getElementById("carouselProgress");

let currentIndex = 0;
const totalCards = carouselCards.length;

let radius = 0;
let autoPlay;

function setupCarousel() {
    const cardWidth = window.innerWidth < 700 ? 155 : 190;

    radius = Math.round(
        (cardWidth / 2) /
        Math.tan(Math.PI / totalCards)
    ) + 65;

    carouselCards.forEach((card, index) => {
        const angle = index * (360 / totalCards);

        card.style.transform =
            `rotateY(${angle}deg) translateZ(${radius}px)`;
    });

    updateCarousel();
}

function updateCarousel() {
    const angle = currentIndex * (360 / totalCards);

    carousel.style.transform = `rotateY(${-angle}deg)`;

    carouselNumber.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ${String(totalCards).padStart(2, "0")}`;

    carouselProgress.style.width =
        `${((currentIndex + 1) / totalCards) * 100}%`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
}

nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoPlay();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    restartAutoPlay();
});

function startAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 3500);
}

function restartAutoPlay() {
    startAutoPlay();
}

setupCarousel();
startAutoPlay();

window.addEventListener("resize", setupCarousel);


// 3. CAROUSEL TOUCH SWIPE

let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 40) {
        nextSlide();
        restartAutoPlay();
    }

    if (touchEndX - touchStartX > 40) {
        prevSlide();
        restartAutoPlay();
    }
}, { passive: true });


// 4. MENU FILTER

const filterButtons = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".food-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        foodCards.forEach(card => {

            const category = card.dataset.category;

            const show =
                filter === "all" || category === filter;

            card.classList.toggle("hide", !show);

            if (show) {
                card.classList.remove("visible");
                requestAnimationFrame(() => {
                    card.classList.add("visible");
                });
            }
        });
    });
});


// 5. SHOPPING CART

let cart = [];

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");

function formatPrice(price) {
    return price.toLocaleString("uz-UZ") + " so'm";
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function addToCart(name, price) {

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
    showToast("✓ " + name + " ADDED!");
}

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        addToCart(name, price);

        button.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1000);
    });
});

function updateCart() {

    cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Savatchangiz hozircha bo\'sh.</p>';
    } else {

        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div>
                    <h4>${escapeHTML(item.name)}</h4>
                    <p>${formatPrice(item.price)} × ${item.quantity}</p>
                </div>

                <button class="remove-item" data-index="${index}" aria-label="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join("");
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartTotal.textContent = formatPrice(total);
}

function escapeHTML(value) {
    return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

cartItems.addEventListener("click", event => {

    const removeButton = event.target.closest(".remove-item");

    if (!removeButton) return;

    const index = Number(removeButton.dataset.index);

    cart.splice(index, 1);

    updateCart();
    showToast("PRODUCT REMOVED");
});


// OPEN AND CLOSE CART

cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("open");
});

closeCart.addEventListener("click", () => {
    cartOverlay.classList.remove("open");
});

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("open");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        cartOverlay.classList.remove("open");
    }
});


// 6. CHECKOUT

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {
        showToast("YOUR CART IS EMPTY!");
        return;
    }

    const orderText = cart.map(item =>
        `${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join("\n");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "FOODIX ORDER\n\n" +
        orderText +
        "\n\nTOTAL: " + formatPrice(total) +
        "\n\nDemo buyurtma tayyor! Haqiqiy buyurtma uchun backend yoki Telegram bot ulash kerak."
    );
});


// 7. SCROLL REVEAL ANIMATION

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


// 8. MOUSE GLOW EFFECT

const cursorGlow = document.getElementById("cursorGlow");

if (window.matchMedia("(pointer: fine)").matches) {

    document.addEventListener("mousemove", event => {

        cursorGlow.style.left = event.clientX + "px";
        cursorGlow.style.top = event.clientY + "px";

    });

}


// 9. HERO 3D PARALLAX

const heroProduct = document.getElementById("heroProduct");
const heroVisual = document.querySelector(".hero-visual");

if (window.matchMedia("(pointer: fine)").matches) {

    heroVisual.addEventListener("mousemove", event => {

        const rect = heroVisual.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateY = (x / rect.width - 0.5) * 20;
        const rotateX = (0.5 - y / rect.height) * 20;

        heroProduct.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;

    });

    heroVisual.addEventListener("mouseleave", () => {
        heroProduct.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });

}


// 10. 3D FOOD CARD TILT

const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

if (supportsFinePointer) {

    document.querySelectorAll(".food-card").forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = (x / rect.width - 0.5) * 8;
            const rotateX = (0.5 - y / rect.height) * 8;

            card.style.transform =
                `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });

}


// 11. NAVBAR SCROLL EFFECT

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 60) {
        navbar.style.background = "rgba(9,9,20,.97)";
        navbar.style.boxShadow = "0 8px 30px #0005";
    } else {
        navbar.style.background = "rgba(9,9,20,.83)";
        navbar.style.boxShadow = "none";
    }

});


// 12. START MESSAGE

console.log("%c FOODIX SYSTEM ONLINE ", 
    "background:#a855f7;color:white;padding:12px;font-size:16px;font-weight:bold;");

console.log("Welcome to the Future of Fast Food!");

