/**
 * EZUST JOYAS - Core Application & Interactive Logic
 * Luxury Boutique E-Commerce Engine
 */

// --- Products Database ---
const PRODUCTS_DATA = [
  {
    id: "ez-real-01",
    name: "Set Gargantilla Perlas & Aros Pasantes",
    category: "collares",
    priceARS: 64860,
    installments: "6 cuotas sin interés de $10.810",
    badge: "Bestseller Atelier",
    image: "assets/products_hq/ez-real-01_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-01_detail.jpg",
    metals: ["Plata 925", "Perlas Naturales"],
    description: "Delicada gargantilla con cristales facetados y perla natural central de agua dulce sobre estructura de Plata 925 maciza. Incluye par de aros pasantes de perlas naturales a tono.",
    rating: 5,
    sizes: ["40 cm + 5 cm ext", "45 cm", "50 cm"],
    inStock: true
  },
  {
    id: "ez-real-02",
    name: "Set Gargantilla Cinta Líquida & Argollitas Labradas",
    category: "collares",
    priceARS: 64860,
    installments: "6 cuotas sin interés de $10.810",
    badge: "Elegancia Clásica",
    image: "assets/products_hq/ez-real-02_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-02_detail.jpg",
    metals: ["Plata 925 Maciza"],
    description: "Cadena estilo cinta plana flexible con acabado espejo de máxima pureza. Acompañada por un par de argollitas en Plata Esterlina 925 con textura labrada artesanal.",
    rating: 5,
    sizes: ["42 cm", "45 cm", "50 cm"],
    inStock: true
  },
  {
    id: "ez-real-03",
    name: "Set Pulsera Cristales Noche & Argollas Ovales",
    category: "pulseras",
    priceARS: 65070,
    installments: "6 cuotas sin interés de $10.845",
    badge: "Colección Noche",
    image: "assets/products_hq/ez-real-03_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-03_detail.jpg",
    metals: ["Plata 925", "Cristales Facetados"],
    description: "Pulsera armada con esferas de plata, cristales oscuros tornasolados y eslabón alargado central. Incluye par de argollas ovaladas de línea contemporánea.",
    rating: 5,
    sizes: ["17 cm", "19 cm", "Ajustable"],
    inStock: true
  },
  {
    id: "ez-real-04",
    name: "Set Pulsera Cristal Blanco Iridiscente & Argollas Triples",
    category: "pulseras",
    priceARS: 54060,
    installments: "6 cuotas sin interés de $9.010",
    badge: "Brillo Sutil",
    image: "assets/products_hq/ez-real-04_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-04_detail.jpg",
    metals: ["Plata 925", "Cristales Blancos"],
    description: "Pulsera elastizada con cuentas facetadas de cristal blanco con reflejos opalinos y esfera en plata 925. Acompañada por aros argollas triples envolventes.",
    rating: 5,
    sizes: ["Elastizada Standard", "Elastizada Grande"],
    inStock: true
  },
  {
    id: "ez-real-05",
    name: "Set Anillo Solitario Pavé & Aros Cubic Biselados",
    category: "anillos",
    priceARS: 40200,
    installments: "6 cuotas sin interés de $6.700",
    badge: "Pieza Destacada",
    image: "assets/products_hq/ez-real-05_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-05_detail.jpg",
    metals: ["Plata 925", "Circonias Suizas"],
    description: "Anillo solitario de corte gota con micro pavé en el brazo en Plata 925 maciza. Acompañado por un par de aros pasantes cubic biselados de máxima refracción.",
    rating: 5,
    sizes: ["12", "14", "16", "18", "20"],
    inStock: true
  },
  {
    id: "ez-real-06",
    name: "Set Pulsera Bolitas de Plata con Nácar & Argollas Torzadas",
    category: "pulseras",
    priceARS: 47000,
    installments: "6 cuotas sin interés de $7.833",
    badge: "Alta Joyería",
    image: "assets/products_hq/ez-real-06_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-06_detail.jpg",
    metals: ["Plata 925", "Nácar Natural"],
    description: "Pulsera elastizada de esferas macizas en Plata 925 con centro cuadrado en nácar natural esculpido. Incluye par de argollas finas torzadas estilo cuerda.",
    rating: 5,
    sizes: ["16 cm", "18 cm", "20 cm"],
    inStock: true
  },
  {
    id: "ez-real-07",
    name: "Set Gargantilla Micro Forcet Prisma & Aros Aguja Pavé",
    category: "collares",
    priceARS: 50250,
    installments: "6 cuotas sin interés de $8.375",
    badge: "Diseño de Vanguardia",
    image: "assets/products_hq/ez-real-07_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-07_detail.jpg",
    metals: ["Plata 925", "Circonias Pavé"],
    description: "Cadena ultra fina micro forcet con dije prisma colgante engarzado en pavé brillante. Incluye par de aros colgantes aguja con destello de circonia.",
    rating: 5,
    sizes: ["45 cm + ext", "50 cm"],
    inStock: true
  },
  {
    id: "ez-real-08",
    name: "Set Trilogía Cristales Rubí & Anillo Cadena Infinita",
    category: "pulseras",
    priceARS: 68900,
    installments: "6 cuotas sin interés de $11.483",
    badge: "Edición Especial",
    image: "assets/products_hq/ez-real-08_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-08_detail.jpg",
    metals: ["Plata 925", "Cristales Cherry"],
    description: "Trío de pulseras elastizadas de cuentas facetadas en tonalidades rubí, borgoña y coral con detalles en plata. Acompañado por anillo de eslabones entrelazados en Plata 925.",
    rating: 5,
    sizes: ["Talla Anillo 14", "Talla Anillo 16", "Talla Anillo 18"],
    inStock: true
  },
  {
    id: "ez-real-09",
    name: "Set Trilogía Cristales Minerales & Argollas Bombé",
    category: "aros",
    priceARS: 68900,
    installments: "6 cuotas sin interés de $11.483",
    badge: "Exclusivo Ezust",
    image: "assets/products_hq/ez-real-09_main.jpg",
    hoverImage: "assets/products_hq/details/ez-real-09_detail.jpg",
    metals: ["Plata 925", "Cristales Grafito"],
    description: "Trío de pulseras con cristales minerales facetados en escala tonal esmeralda profunda y grafito. Incluye par de argollas bombé de plata maciza con cierre italiano.",
    rating: 5,
    sizes: ["Única - Set Completo"],
    inStock: true
  }
];

// --- Currency Config ---
const CURRENCY_RATES = {
  ARS: { symbol: "$", rate: 1, format: (val) => `$ ${val.toLocaleString("es-AR")}` },
  USD: { symbol: "USD $", rate: 0.00095, format: (val) => `USD $ ${(val * 0.00095).toFixed(0)}` },
  EUR: { symbol: "€", rate: 0.00088, format: (val) => `€ ${(val * 0.00088).toFixed(0)}` }
};

let currentCurrency = "ARS";

// --- State Management ---
let state = {
  cart: JSON.parse(localStorage.getItem("ezust_cart") || localStorage.getItem("eziust_cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("ezust_wishlist") || localStorage.getItem("eziust_wishlist") || "[]"),
  currentCategory: "all",
  currentSort: "featured"
};

// --- DOM Elements ---
document.addEventListener("DOMContentLoaded", () => {
  // Parse category query parameter (e.g. ?category=anillos)
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get("category");
  if (cat) {
    state.currentCategory = cat;
  }

  initHeader();
  initHeroCinematics();
  renderProducts();
  initFilterCategoriesScroll();
  initTestimonialsCarousel();
  initDrawers();
  initModals();
  initRingSizer();
  initCurrencySelector();
  initSearch();
  initNewsletter();
  updateCartBadge();
  updateWishlistBadge();
});

// --- 4K Cinematic Hero & Micro-Interactions (Delicate Diamond Sparkles) ---
function initHeroCinematics() {
  const canvas = document.getElementById("heroSparklesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
  let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = canvas.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.offsetHeight || window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = 36;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 0.8 + 0.6, // Pequeños brillitos (0.6px a 1.4px)
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.03 + 0.015,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.1,
      color: Math.random() > 0.4 ? "245, 225, 185" : "255, 245, 225"
    });
  }

  function renderSparkles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.phase += p.phaseSpeed;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Twinkle pulsation
      const alpha = Math.max(0, Math.sin(p.phase));
      if (alpha <= 0.02) return;

      const glintLen = p.size * (2.8 + alpha * 1.8); // 2px - 5px micro-destello

      // 1. Centro fino nítido (núcleo blanco brillante)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.95)})`;
      ctx.fill();

      // 2. Micro rayos en cruz (destello fino de joya de 4 puntas)
      ctx.strokeStyle = `rgba(${p.color}, ${alpha * 0.75})`;
      ctx.lineWidth = 0.65;

      // Rayo horizontal
      ctx.beginPath();
      ctx.moveTo(p.x - glintLen, p.y);
      ctx.lineTo(p.x + glintLen, p.y);
      ctx.stroke();

      // Rayo vertical
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - glintLen);
      ctx.lineTo(p.x, p.y + glintLen);
      ctx.stroke();
    });

    requestAnimationFrame(renderSparkles);
  }

  renderSparkles();
}

// --- Header Scroll & Mobile Nav ---
function initHeader() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawer = document.getElementById("mobileNavDrawer");
  const mobileClose = document.getElementById("mobileNavClose");
  const overlay = document.getElementById("drawerOverlay");

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener("click", () => {
      mobileDrawer.classList.add("active");
      overlay.classList.add("active");
    });

    mobileClose.addEventListener("click", () => {
      mobileDrawer.classList.remove("active");
      overlay.classList.remove("active");
    });

    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("active");
        overlay.classList.remove("active");
      });
    });
  }
}

// --- Render Products Catalog ---
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  let filtered = [...PRODUCTS_DATA];

  // Category filter
  if (state.currentCategory !== "all") {
    filtered = filtered.filter(p => p.category === state.currentCategory);
  }

  // Sort filter
  if (state.currentSort === "low-price") {
    filtered.sort((a, b) => a.priceARS - b.priceARS);
  } else if (state.currentSort === "high-price") {
    filtered.sort((a, b) => b.priceARS - a.priceARS);
  }

  const limitAttr = grid.getAttribute("data-limit");
  if (limitAttr) {
    const limitNum = parseInt(limitAttr, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      filtered = filtered.slice(0, limitNum);
    }
  }

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <p style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-muted);">
          No se encontraron joyas en esta categoría seleccionada.
        </p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const isWished = state.wishlist.some(item => item.id === product.id);
    const installmentVal = (product.priceARS / 6).toFixed(0);
    const formattedPrice = CURRENCY_RATES[currentCurrency].format(product.priceARS);

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      ${product.badge ? `<span class="product-badge-tag">${product.badge}</span>` : ""}
      
      <div class="product-media-container" onclick="openQuickView('${product.id}')" style="cursor: pointer;">
        <img src="${product.image}" alt="${product.name}" class="product-img-main" loading="lazy">
        <img src="${product.hoverImage}" alt="${product.name} detalle" class="product-img-hover" loading="lazy">
      </div>

      <div class="product-card-actions">
        <button class="btn-card-quick" onclick="openQuickView('${product.id}')">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Vista Rápida
        </button>
        <button class="btn-card-wish ${isWished ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" title="Guardar en Favoritos">
          <svg width="16" height="16" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="product-info">
        <span class="product-category-sub">${product.category}</span>
        <h3 class="product-title" onclick="openQuickView('${product.id}')" style="cursor: pointer;">${product.name}</h3>
        
        <div class="product-metals-list">
          <span class="metal-dot metal-gold" title="Oro 18K"></span>
          <span class="metal-dot metal-silver" title="Plata 925"></span>
          <span class="metal-label-text">${product.metals.join(" · ")}</span>
        </div>

        <div class="product-pricing">
          <span class="product-price">${formattedPrice}</span>
          <span class="product-installments">6x $ ${Number(installmentVal).toLocaleString("es-AR")} sin interés</span>
        </div>

        <button class="btn-add-bag-card" onclick="addToCart('${product.id}')">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 01-8 0"></path>
          </svg>
          Añadir a la Bolsa
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Synchronize and attach filter buttons click
  document.querySelectorAll(".filter-btn").forEach(btn => {
    if (btn.getAttribute("data-category") === state.currentCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

    btn.onclick = () => {
      const slider = btn.closest(".filter-categories");
      if (slider && slider.dataset.dragged === "true") {
        return;
      }
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentCategory = btn.getAttribute("data-category");
      renderProducts();
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };
  });

  const sortSelect = document.getElementById("catalogSort");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      state.currentSort = e.target.value;
      renderProducts();
    };
  }
}

// --- Horizontal Scroll & Drag for Category Filters ---
function initFilterCategoriesScroll() {
  document.querySelectorAll(".filter-categories").forEach(slider => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;
    const dragThreshold = 5;

    const parent = slider.closest(".filter-categories-wrap") || slider.parentElement;
    const btnLeft = parent ? parent.querySelector(".filter-scroll-left") : null;
    const btnRight = parent ? parent.querySelector(".filter-scroll-right") : null;

    const updateArrows = () => {
      if (!btnLeft && !btnRight) return;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (maxScroll <= 4) {
        if (btnLeft) btnLeft.classList.add("hidden");
        if (btnRight) btnRight.classList.add("hidden");
        return;
      }
      if (btnLeft) {
        if (slider.scrollLeft <= 4) {
          btnLeft.classList.add("hidden");
        } else {
          btnLeft.classList.remove("hidden");
        }
      }
      if (btnRight) {
        if (slider.scrollLeft >= maxScroll - 4) {
          btnRight.classList.add("hidden");
        } else {
          btnRight.classList.remove("hidden");
        }
      }
    };

    // Mouse Drag To Scroll
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      slider.dataset.dragged = "false";
      slider.classList.add("is-dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove("is-dragging");
      setTimeout(() => {
        slider.dataset.dragged = "false";
      }, 60);
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > dragThreshold) {
        hasDragged = true;
        slider.dataset.dragged = "true";
      }
      slider.scrollLeft = scrollLeft - walk;
      updateArrows();
    });

    // Horizontal mouse wheel scrolling
    slider.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && slider.scrollWidth > slider.clientWidth) {
        e.preventDefault();
        slider.scrollLeft += e.deltaY;
        updateArrows();
      }
    }, { passive: false });

    slider.addEventListener("scroll", updateArrows, { passive: true });

    // Arrow controls
    if (btnLeft) {
      btnLeft.addEventListener("click", (e) => {
        e.preventDefault();
        slider.scrollBy({ left: -220, behavior: "smooth" });
      });
    }
    if (btnRight) {
      btnRight.addEventListener("click", (e) => {
        e.preventDefault();
        slider.scrollBy({ left: 220, behavior: "smooth" });
      });
    }

    // Auto-scroll active item into view on load
    const activeBtn = slider.querySelector(".filter-btn.active");
    if (activeBtn) {
      setTimeout(() => {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        updateArrows();
      }, 100);
    } else {
      setTimeout(updateArrows, 100);
    }

    window.addEventListener("resize", updateArrows);
  });
}

// --- Testimonials Horizontal Carousel ---
function initTestimonialsCarousel() {
  const track = document.getElementById("testimonialsTrack");
  const prevBtn = document.getElementById("testiPrevBtn");
  const nextBtn = document.getElementById("testiNextBtn");
  const dotsContainer = document.getElementById("testimonialsDots");

  if (!track) return;

  const cards = track.querySelectorAll(".testimonial-card");
  const dots = dotsContainer ? dotsContainer.querySelectorAll(".testi-dot") : [];

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  const updateControls = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (prevBtn) {
      if (track.scrollLeft <= 8) {
        prevBtn.classList.add("hidden");
      } else {
        prevBtn.classList.remove("hidden");
      }
    }
    if (nextBtn) {
      if (track.scrollLeft >= maxScroll - 8) {
        nextBtn.classList.add("hidden");
      } else {
        nextBtn.classList.remove("hidden");
      }
    }

    // Update active dot
    if (dots.length > 0 && cards.length > 0) {
      const cardWidth = cards[0].offsetWidth + 20;
      const activeIndex = Math.min(
        dots.length - 1,
        Math.max(0, Math.round(track.scrollLeft / cardWidth))
      );
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }
  };

  // Drag to scroll
  track.addEventListener("mousedown", (e) => {
    isDown = true;
    hasDragged = false;
    track.classList.add("is-dragging");
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 4) hasDragged = true;
    track.scrollLeft = scrollLeft - walk;
    updateControls();
  });

  track.addEventListener("scroll", updateControls, { passive: true });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 280;
      track.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 280;
      track.scrollBy({ left: cardWidth, behavior: "smooth" });
    });
  }

  // Dots click navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      if (cards[idx]) {
        cards[idx].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }
    });
  });

  setTimeout(updateControls, 100);
  window.addEventListener("resize", updateControls);
}

// --- Cart & Wishlist Drawers ---
function initDrawers() {
  const overlay = document.getElementById("drawerOverlay");
  const cartDrawer = document.getElementById("cartDrawer");
  const wishlistDrawer = document.getElementById("wishlistDrawer");

  const openCartBtn = document.getElementById("cartBtn");
  const closeCartBtn = document.getElementById("cartCloseBtn");
  const openWishBtn = document.getElementById("wishlistBtn");
  const closeWishBtn = document.getElementById("wishlistCloseBtn");

  if (openCartBtn && cartDrawer) {
    openCartBtn.onclick = () => openDrawer(cartDrawer);
    closeCartBtn.onclick = () => closeDrawer(cartDrawer);
  }

  if (openWishBtn && wishlistDrawer) {
    openWishBtn.onclick = () => openDrawer(wishlistDrawer);
    closeWishBtn.onclick = () => closeDrawer(wishlistDrawer);
  }

  if (overlay) {
    overlay.onclick = () => {
      document.querySelectorAll(".side-drawer, .modal-overlay, .search-modal, .mobile-nav-drawer").forEach(el => {
        el.classList.remove("active");
      });
      overlay.classList.remove("active");
    };
  }

  renderCart();
  renderWishlist();
}

function openDrawer(drawer) {
  const overlay = document.getElementById("drawerOverlay");
  drawer.classList.add("active");
  overlay.classList.add("active");
}

function closeDrawer(drawer) {
  const overlay = document.getElementById("drawerOverlay");
  drawer.classList.remove("active");
  overlay.classList.remove("active");
}

// --- Cart Functions ---
function addToCart(productId, metal = null, size = null) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const chosenMetal = metal || product.metals[0];
  const chosenSize = size || (product.sizes ? product.sizes[0] : "Única");

  const existing = state.cart.find(
    item => item.id === productId && item.metal === chosenMetal && item.size === chosenSize
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      priceARS: product.priceARS,
      image: product.image,
      metal: chosenMetal,
      size: chosenSize,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  updateCartBadge();
  showToast("Joya agregada", `${product.name} se sumó a tu bolsa de compra.`);

  // Auto open cart drawer
  const cartDrawer = document.getElementById("cartDrawer");
  if (cartDrawer) openDrawer(cartDrawer);
}

function updateCartQty(index, delta) {
  if (state.cart[index]) {
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
    renderCart();
    updateCartBadge();
  }
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem("ezust_cart", JSON.stringify(state.cart));
}

function updateCartBadge() {
  const count = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById("cartCount");
  if (badge) badge.innerText = count;
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const subtotalElem = document.getElementById("cartSubtotal");
  const shippingFill = document.getElementById("shippingFill");
  const shippingText = document.getElementById("shippingText");
  const checkoutBtn = document.getElementById("checkoutWhatsappBtn");

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-drawer-state">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 01-8 0"></path>
        </svg>
        <h4>Tu bolsa de compras está vacía</h4>
        <p>Descubrí piezas únicas creadas para acompañar tus mejores momentos.</p>
        <button class="btn-luxury btn-primary" onclick="closeDrawer(document.getElementById('cartDrawer'))" style="margin: 0 auto;">
          Explorar Colección
        </button>
      </div>
    `;
    if (subtotalElem) subtotalElem.innerText = CURRENCY_RATES[currentCurrency].format(0);
    if (shippingFill) shippingFill.style.width = "0%";
    if (shippingText) shippingText.innerHTML = `<span>Envío asegurado sin cargo</span> <strong>Faltan $ 120.000</strong>`;
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  if (checkoutBtn) checkoutBtn.style.display = "flex";

  let totalARS = 0;
  container.innerHTML = "";

  state.cart.forEach((item, index) => {
    const itemTotal = item.priceARS * item.quantity;
    totalARS += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item-card";
    itemEl.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">${item.metal} · Medida: ${item.size}</div>
        <div class="cart-item-price">${CURRENCY_RATES[currentCurrency].format(item.priceARS)}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem(${index})" title="Eliminar">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;
    container.appendChild(itemEl);
  });

  if (subtotalElem) {
    subtotalElem.innerText = CURRENCY_RATES[currentCurrency].format(totalARS);
  }

  if (shippingText) {
    shippingText.innerHTML = `<span>✦ Envíos asegurados a todo el país por Andreani y Correo Argentino</span>`;
  }
  if (shippingFill) shippingFill.style.width = "100%";

  // Set WhatsApp Checkout Link
  if (checkoutBtn) {
    let msg = `Hola Ezust Joyas! ✨ Me gustaría encargar las siguientes piezas de su Atelier:\n\n`;
    state.cart.forEach(item => {
      msg += `• ${item.name} (${item.metal}, Talla ${item.size}) x${item.quantity} - $${(item.priceARS * item.quantity).toLocaleString("es-AR")}\n`;
    });
    msg += `\nTotal: $${totalARS.toLocaleString("es-AR")} ARS\n\n¿Tienen disponibilidad y asesoría de envío? Muchas gracias!`;

    checkoutBtn.href = `https://wa.me/5493576415867?text=${encodeURIComponent(msg)}`;
  }
}

// --- Wishlist Functions ---
function toggleWishlist(productId) {
  const index = state.wishlist.findIndex(item => item.id === productId);
  const product = PRODUCTS_DATA.find(p => p.id === productId);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast("Removido", `${product.name} fue quitado de tus favoritos.`);
  } else {
    state.wishlist.push(product);
    showToast("Guardado", `${product.name} fue agregado a tu lista de deseos.`);
  }

  localStorage.setItem("ezust_wishlist", JSON.stringify(state.wishlist));
  updateWishlistBadge();
  renderWishlist();
  renderProducts();
}

function updateWishlistBadge() {
  const count = state.wishlist.length;
  const badge = document.getElementById("wishlistCount");
  if (badge) badge.innerText = count;
}

function renderWishlist() {
  const container = document.getElementById("wishlistItemsContainer");
  if (!container) return;

  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-drawer-state">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
        </svg>
        <h4>Tu lista de deseos está vacía</h4>
        <p>Guardá tus joyas preferidas para revisitarlas en cualquier momento.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  state.wishlist.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item-card";
    itemEl.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">${CURRENCY_RATES[currentCurrency].format(item.priceARS)}</div>
        <button class="btn-luxury btn-primary" onclick="addToCart('${item.id}'); toggleWishlist('${item.id}');" style="padding: 0.4rem 0.8rem; font-size: 0.65rem; margin-top: 0.5rem;">
          Mover a la Bolsa
        </button>
      </div>
      <button class="cart-item-remove" onclick="toggleWishlist('${item.id}')" title="Quitar">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    container.appendChild(itemEl);
  });
}

// --- Fullscreen Luxury Sliding Product Canvas (SPA) ---
let currentSheetMetal = "";
let currentSheetSize = "";

function initModals() {
  const quickOverlay = document.getElementById("quickViewOverlay");
  const quickClose = document.getElementById("quickViewClose");

  if (quickClose && quickOverlay) {
    quickClose.onclick = () => quickOverlay.classList.remove("active");
  }

  // Fullscreen Product Sheet Close
  const sheetCanvas = document.getElementById("productFullscreenCanvas");
  const sheetClose = document.getElementById("productSheetCloseBtn");
  const sheetBack = document.getElementById("productSheetBackBtn");

  if (sheetClose && sheetCanvas) {
    sheetClose.onclick = () => closeProductSheet();
  }
  if (sheetBack && sheetCanvas) {
    sheetBack.onclick = () => closeProductSheet();
  }

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductSheet();
      document.querySelectorAll(".modal-overlay, .side-drawer, .search-modal, .mobile-nav-drawer").forEach(el => {
        el.classList.remove("active");
      });
      const drawerOverlay = document.getElementById("drawerOverlay");
      if (drawerOverlay) drawerOverlay.classList.remove("active");
    }
  });
}

function openProductSheet(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const canvas = document.getElementById("productFullscreenCanvas");
  const container = document.getElementById("productSheetBody");

  if (!canvas || !container) return;

  currentSheetMetal = product.metals[0];
  currentSheetSize = product.sizes ? product.sizes[0] : "Única";

  const isWished = state.wishlist.some(item => item.id === product.id);
  const formattedPrice = CURRENCY_RATES[currentCurrency].format(product.priceARS);
  const installmentVal = (product.priceARS / 6).toFixed(0);
  const cashPriceARS = Math.round(product.priceARS * 0.85);
  const formattedCashPrice = CURRENCY_RATES[currentCurrency] 
    ? (currentCurrency === "ARS" ? `$ ${cashPriceARS.toLocaleString("es-AR")}` : CURRENCY_RATES[currentCurrency].format(cashPriceARS))
    : `$ ${cashPriceARS.toLocaleString("es-AR")}`;

  const isRingOrHasSizes = product.category === "anillos" || (product.sizes && product.sizes.some(s => s.toLowerCase().includes("talla") || !isNaN(s)));

  container.innerHTML = `
    <div class="sheet-product-layout container">
      <!-- Left Column: Gallery & Zoom -->
      <div class="sheet-gallery-col">
        <div class="sheet-main-image-frame" id="sheetMainImgFrame">
          <img id="sheetMainImg" src="${product.image}" alt="${product.name}" class="sheet-main-img">
        </div>
      </div>

      <!-- Right Column: Editorial Data & Calibrator -->
      <div class="sheet-info-col">
        <div class="sheet-tag-row">
          <span class="sheet-cat-tag">${product.category.toUpperCase()}</span>
          <span class="sheet-guarantee-pill">✦ GARANTÍA OFICIAL ESCRITA</span>
          ${product.badge ? `<span class="sheet-guarantee-pill" style="background: rgba(230,202,158,0.2); border-color: var(--gold-bright); color: #FFF;">${product.badge}</span>` : ''}
        </div>

        <h1 class="sheet-product-title">${product.name}</h1>

        <div class="sheet-pricing-block">
          <div class="sheet-price-main">${formattedPrice}</div>
          <div class="sheet-installments-pill">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            <div>
              <span class="sheet-inst-title">Hasta <strong>6 cuotas sin interés</strong> de <strong>$ ${Number(installmentVal).toLocaleString("es-AR")}</strong></span>
              <span class="sheet-inst-cards">Con todas las tarjetas bancarias (Visa, Mastercard, Cabal, Amex)</span>
            </div>
          </div>
          <div class="sheet-cash-discount">
            <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <div>
              <span><strong>${formattedCashPrice}</strong> con <strong>15% OFF EXTRA</strong></span>
              <span class="sheet-cash-sub">Abonando con Transferencia Bancaria</span>
            </div>
          </div>
        </div>

        <p class="sheet-product-desc">${product.description}</p>

        <!-- Metal Selection -->
        <div class="sheet-option-group">
          <label class="sheet-opt-label">Metal Noble & Acabado:</label>
          <div class="sheet-choices-row" id="sheetMetalChoices">
            ${product.metals.map((m, idx) => `
              <button type="button" class="sheet-choice-btn ${idx === 0 ? 'active' : ''}" onclick="selectSheetMetal(this, '${m}')">
                ${m}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Size Selection & Embedded Sizer Toggle -->
        ${product.sizes ? `
          <div class="sheet-option-group">
            <div class="sheet-opt-header">
              <label class="sheet-opt-label">Medida / Talla Seleccionada:</label>
              ${isRingOrHasSizes ? `
                <button type="button" class="sheet-open-sizer-btn" onclick="toggleEmbeddedSizer()">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  <span>Calibrar Medida Digital</span>
                </button>
              ` : ''}
            </div>
            <div class="sheet-choices-row" id="sheetSizeChoices">
              ${product.sizes.map((s, idx) => `
                <button type="button" class="sheet-choice-btn ${idx === 0 ? 'active' : ''}" onclick="selectSheetSize(this, '${s}')">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Embedded Interactive Digital Sizer (Right inside Product View) -->
        <div class="embedded-ring-sizer-box ${isRingOrHasSizes ? 'active' : ''}" id="embeddedRingSizer">
          <div class="embedded-sizer-header">
            <h5>✦ Calibrador Digital de Tallas de Anillo</h5>
            <button type="button" onclick="toggleEmbeddedSizer()" class="sizer-collapse-btn">Ocultar ✕</button>
          </div>
          <p class="sizer-hint">Deslizá el control para comparar el diámetro con un anillo que te quede cómodo:</p>
          
          <div class="embedded-sizer-flex">
            <div class="embedded-sizer-controls">
              <input type="range" min="10" max="24" step="2" value="14" class="luxury-range" id="sheetRingSlider" oninput="updateSheetRingSize(this.value)" aria-label="Calibrar medida">
              <div class="embedded-sizer-output">
                <span class="sizer-talla">Talla: <strong id="sheetRingNum">Nº 14</strong></span>
                <span class="sizer-mm">Diámetro: <strong id="sheetRingMm">17.2 mm</strong></span>
              </div>
            </div>
            <div class="embedded-sizer-visual">
              <div class="embedded-ring-circle" id="sheetRingCircle" style="width: 58px; height: 58px;"></div>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="sheet-actions-group">
          <button type="button" class="btn-luxury btn-primary sheet-btn-add" onclick="addCurrentSheetToCart('${product.id}')">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span>Añadir a la Bolsa de Compras</span>
          </button>
          
          <a href="#" id="sheetWhatsappInquiryBtn" target="_blank" rel="noopener" class="btn-luxury btn-whatsapp-sheet">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.53 3.99c-.19 0-.42.07-.64.31-.22.24-.85.83-.85 2.03 0 1.2.88 2.36 1 2.53.13.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.17.21-.57.21-1.06.15-1.17-.06-.1-.23-.17-.48-.29-.25-.13-1.45-.72-1.68-.8-.22-.08-.39-.13-.55.12-.16.25-.63.8-.78.96-.14.16-.29.18-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.55-1.33-.76-1.82-.2-.48-.41-.42-.56-.43l-.48-.01z"/></svg>
            <span>Comprar / Consultar por WhatsApp</span>
          </a>
        </div>

        <!-- Assurance Badges -->
        <div class="sheet-assurance-grid">
          <div class="assurance-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>Envíos asegurados a todo el país</span>
          </div>
          <div class="assurance-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Garantía de pureza de metales</span>
          </div>
          <div class="assurance-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Atelier Belgrano 1047, Arroyito</span>
          </div>
        </div>

      </div>
    </div>
  `;

  updateSheetWhatsappLink(product);
  canvas.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Alias for backwards compatibility
function openQuickView(productId) {
  openProductSheet(productId);
}

function closeProductSheet() {
  const canvas = document.getElementById("productFullscreenCanvas");
  if (canvas) {
    canvas.classList.remove("active");
  }
  document.body.style.overflow = "";
}

function switchSheetImage(src, btn) {
  const mainImg = document.getElementById("sheetMainImg");
  if (mainImg) mainImg.src = src;
  document.querySelectorAll(".sheet-thumb-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

function selectSheetMetal(btn, metal) {
  currentSheetMetal = metal;
  document.querySelectorAll("#sheetMetalChoices .sheet-choice-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function selectSheetSize(btn, size) {
  currentSheetSize = size;
  document.querySelectorAll("#sheetSizeChoices .sheet-choice-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function toggleEmbeddedSizer() {
  const sizer = document.getElementById("embeddedRingSizer");
  if (sizer) sizer.classList.toggle("active");
}

function updateSheetRingSize(val) {
  const ringSizesMap = {
    10: { mm: 15.9, px: 46 },
    12: { mm: 16.5, px: 52 },
    14: { mm: 17.2, px: 58 },
    16: { mm: 17.8, px: 64 },
    18: { mm: 18.5, px: 70 },
    20: { mm: 19.1, px: 76 },
    22: { mm: 19.7, px: 82 },
    24: { mm: 20.4, px: 88 }
  };

  const data = ringSizesMap[val] || { mm: 17.2, px: 58 };
  const numElem = document.getElementById("sheetRingNum");
  const mmElem = document.getElementById("sheetRingMm");
  const circleElem = document.getElementById("sheetRingCircle");

  if (numElem) numElem.innerText = `Nº ${val}`;
  if (mmElem) mmElem.innerText = `${data.mm} mm`;
  if (circleElem) {
    circleElem.style.width = `${data.px}px`;
    circleElem.style.height = `${data.px}px`;
  }

  // Auto select matching size button if available
  document.querySelectorAll("#sheetSizeChoices .sheet-choice-btn").forEach(btn => {
    if (btn.innerText.trim() === String(val) || btn.innerText.includes(String(val))) {
      selectSheetSize(btn, btn.innerText.trim());
    }
  });
}

function updateSheetWhatsappLink(product) {
  const btn = document.getElementById("sheetWhatsappInquiryBtn");
  if (!btn) return;

  const msg = `Hola Ezust Joyas! ✨ Me enamoré de la pieza: *${product.name}* ($${product.priceARS.toLocaleString("es-AR")} ARS). Quisiera consultar disponibilidad y coordinar la compra.`;
  btn.href = `https://wa.me/5493576415867?text=${encodeURIComponent(msg)}`;
}

function addCurrentSheetToCart(productId) {
  addToCart(productId, currentSheetMetal, currentSheetSize);
  closeProductSheet();
  const cartDrawer = document.getElementById("cartDrawer");
  if (cartDrawer) openDrawer(cartDrawer);
}

function initRingSizer() {
  // Maintained for global sizers if any
}

// --- Custom Luxury Currency Selector ---
function initCurrencySelector() {
  const dropdown = document.getElementById("currencyDropdown");
  const trigger = document.getElementById("currencyTrigger");
  const label = document.getElementById("currentCurrencyLabel");
  const items = document.querySelectorAll(".currency-menu-item");

  if (!dropdown || !trigger) return;

  trigger.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  };

  items.forEach(item => {
    item.onclick = (e) => {
      e.stopPropagation();
      const code = item.getAttribute("data-currency");
      if (!code || !CURRENCY_RATES[code]) return;

      currentCurrency = code;
      if (label) label.innerText = code;

      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      dropdown.classList.remove("active");

      // Re-render prices across the catalog, cart, and wishlist
      renderProducts();
      renderCart();
      renderWishlist();

      showToast("Moneda Actualizada", `Precios expresados en ${code} (${CURRENCY_RATES[code].symbol})`);
    };
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdown.classList.remove("active");
    }
  });
}

// --- Header Inline Live Search ---
function initSearch() {
  const searchWrap = document.getElementById("headerSearchWrap");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("headerSearchInput");
  const closeBtn = document.getElementById("headerSearchCloseBtn");
  const resultsDropdown = document.getElementById("headerSearchResults");

  if (!searchWrap || !searchBtn) return;

  function openSearch() {
    searchWrap.classList.add("active");
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    searchWrap.classList.remove("active");
    if (resultsDropdown) resultsDropdown.classList.remove("active");
    if (searchInput) searchInput.value = "";
  }

  searchBtn.onclick = (e) => {
    e.stopPropagation();
    openSearch();
  };

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeSearch();
    };
  }

  if (searchInput && resultsDropdown) {
    searchInput.onclick = (e) => e.stopPropagation();

    searchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q.length < 2) {
        resultsDropdown.innerHTML = "";
        resultsDropdown.classList.remove("active");
        return;
      }

      const matches = PRODUCTS_DATA.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.metals.some(m => m.toLowerCase().includes(q))
      );

      resultsDropdown.classList.add("active");

      if (matches.length === 0) {
        resultsDropdown.innerHTML = `
          <div class="search-no-results">
            No encontramos joyas para "${q}".
          </div>
        `;
        return;
      }

      resultsDropdown.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="closeHeaderSearch(); openProductSheet('${p.id}');">
          <img src="${p.image}" alt="${p.name}" class="search-result-thumb">
          <div class="search-result-info">
            <span class="search-result-title">${p.name}</span>
            <span class="search-result-price">${CURRENCY_RATES[currentCurrency].format(p.priceARS)} · ${p.category}</span>
          </div>
        </div>
      `).join('');
    };
  }

  document.addEventListener("click", (e) => {
    if (searchWrap && !searchWrap.contains(e.target)) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
    }
  });
}

function closeHeaderSearch() {
  const searchWrap = document.getElementById("headerSearchWrap");
  const resultsDropdown = document.getElementById("headerSearchResults");
  const searchInput = document.getElementById("headerSearchInput");
  if (searchWrap) searchWrap.classList.remove("active");
  if (resultsDropdown) resultsDropdown.classList.remove("active");
  if (searchInput) searchInput.value = "";
}

// --- VIP Newsletter ---
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("newsletterEmail");
    if (!input || !input.value) return;

    showToast("¡Bienvenida al Círculo!", "Te enviamos tu código exclusivo de 10% OFF: EZUST-VIP10");
    input.value = "";
  };
}

// --- Toast Notifications System ---
function showToast(title, description) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "luxury-toast";
  toast.innerHTML = `
    <div class="toast-icon">✦</div>
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${description}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-30px)";
    toast.style.transition = "all 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
