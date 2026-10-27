/**
 * EZÜST JOYAS - Enterprise Atelier Administration Controller
 * High-performance, reactive controller driving all 9 modules,
 * custom SVG charts, POS terminal, real-time calculations, and CSV exports.
 */

// Global State
let currentView = "dashboard";
let currentInventorySubTab = "current";
let currentSalesSubTab = "pos";
let posCart = []; // Array of { productId, name, sku, priceARS, costARS, image, quantity }

// Utility Formatters
function formatARS(num) {
  const n = Number(num) || 0;
  return "$" + Math.round(n).toLocaleString("es-AR");
}

function formatPercent(num) {
  const n = Number(num) || 0;
  return `${Math.round(n)}%`;
}

function formatDate(isoStr) {
  if (!isoStr) return "-";
  const parts = isoStr.split("T")[0].split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoStr;
}

// ============================================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================================
function showToast(message, type = "success", duration = 3500) {
  const container = document.getElementById("adminToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;

  const iconSvg = type === "success" 
    ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === "danger"
    ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.6rem;">
      <span style="color: ${type === 'danger' ? '#E05353' : type === 'warning' ? '#E5A93C' : '#4E9F76'};">${iconSvg}</span>
      <span style="color: var(--admin-text-main); font-size: 0.86rem; font-weight: 500;">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastSlideOut 0.3s forwards ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================================
// MODAL CONTROLS
// ============================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modals when clicking backdrop
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("admin-modal-backdrop") && e.target.id !== "sidebarBackdrop") {
    e.target.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ESC key to close active modal
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".admin-modal-backdrop.active");
    if (activeModal && activeModal.id !== "sidebarBackdrop") {
      activeModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

// Mobile Sidebar
function toggleSidebar(show) {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const closeBtn = document.getElementById("sidebarCloseBtn");
  
  if (show) {
    sidebar.classList.add("open");
    backdrop.classList.add("active");
    if (closeBtn) closeBtn.style.display = "flex";
  } else {
    sidebar.classList.remove("open");
    backdrop.classList.remove("active");
    if (closeBtn) closeBtn.style.display = "none";
  }
}

// ============================================================================
// NAVIGATION & VIEW SWITCHING
// ============================================================================
function switchView(viewName, subTab = null) {
  currentView = viewName;

  // Toggle active class on sidebar items
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Toggle view containers
  document.querySelectorAll(".admin-view").forEach(view => {
    view.classList.remove("active");
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add("active");
  }

  // Update Breadcrumb
  const breadcrumb = document.getElementById("topbarCurrentViewLabel");
  if (breadcrumb) {
    const titles = {
      dashboard: "Dashboard",
      sales: "Ventas & Caja",
      products: "Productos & Catálogo",
      inventory: "Control de Inventario",
      purchases: "Compras & Proveedores",
      finances: "Finanzas & Balance",
      customers: "Clientes & CRM",
      reports: "Reportes & Excel",
      settings: "Configuración & Auditoría"
    };
    breadcrumb.textContent = titles[viewName] || "Dashboard";
  }

  // Close mobile sidebar if open
  if (window.innerWidth <= 1024) {
    toggleSidebar(false);
  }

  // Handle Subtab if passed
  if (viewName === "sales" && subTab) {
    switchSalesSubTab(subTab);
  } else if (viewName === "inventory" && subTab) {
    switchInventorySubTab(subTab);
  }

  // Render view data
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCurrentView() {
  updateTopbarCashier();
  updateStockAlertBadge();

  switch (currentView) {
    case "dashboard":
      renderDashboard();
      break;
    case "products":
      renderProductsTable();
      break;
    case "inventory":
      renderInventoryCurrentTable();
      renderInventoryKardexTable();
      renderInventoryKPIs();
      break;
    case "sales":
      if (currentSalesSubTab === "pos") {
        renderPosCatalog();
        updatePosCustomerSelect();
      } else if (currentSalesSubTab === "orders") {
        renderOrdersTable();
      } else if (currentSalesSubTab === "cash") {
        renderCashRegister();
      }
      break;
    case "purchases":
      renderSuppliersTable();
      renderPurchasesTable();
      break;
    case "finances":
      renderFinancesView();
      break;
    case "customers":
      renderCustomersTable();
      break;
    case "reports":
      updateReportsMetrics();
      break;
    case "settings":
      renderSettingsAndAudit();
      break;
  }
}

// Update Global Cashier status pill in topbar
function updateTopbarCashier() {
  const cashReg = window.EzustDB ? window.EzustDB.getCashRegister() : null;
  const chip = document.getElementById("topbarCashChip");
  const text = document.getElementById("topbarCashStatusText");
  if (!chip || !text || !cashReg) return;

  if (cashReg.status === "open") {
    chip.style.borderColor = "rgba(78, 159, 118, 0.4)";
    chip.style.background = "rgba(78, 159, 118, 0.08)";
    text.innerHTML = `Caja Abierta: <strong>${formatARS(cashReg.currentCash)}</strong>`;
  } else {
    chip.style.borderColor = "rgba(224, 83, 83, 0.4)";
    chip.style.background = "rgba(224, 83, 83, 0.08)";
    text.innerHTML = `Caja Cerrada`;
  }
}

// Update Badge in Sidebar
function updateStockAlertBadge() {
  if (!window.EzustDB) return;
  const products = window.EzustDB.getProducts();
  const lowStockCount = products.filter(p => (p.stock || 0) <= (p.minStock || 3)).length;
  const badge = document.getElementById("navStockAlertBadge");
  if (badge) {
    badge.textContent = lowStockCount;
    badge.style.display = lowStockCount > 0 ? "inline-block" : "none";
  }
}

// ============================================================================
// 1. DASHBOARD CONTROLLER & SVG CHARTS
// ============================================================================
function renderDashboard() {
  if (!window.EzustDB) return;
  const summary = window.EzustDB.getFinancialSummary(30);

  // Update KPIs
  const elTodayRev = document.getElementById("kpiTodayRevenue");
  const elTodayPill = document.getElementById("kpiTodayCountPill");
  const elMonthlyRev = document.getElementById("kpiMonthlyRevenue");
  const elOrdersPill = document.getElementById("kpiOrdersCountPill");
  const elAvgTicket = document.getElementById("kpiAvgTicketVal");
  const elNetProfit = document.getElementById("kpiNetProfit");
  const elNetMarginPill = document.getElementById("kpiNetMarginPill");
  const elLowStockVal = document.getElementById("kpiLowStockValue");

  if (elTodayRev) elTodayRev.textContent = formatARS(summary.todayRevenue);
  if (elTodayPill) elTodayPill.textContent = `${summary.todaySalesCount} orden${summary.todaySalesCount === 1 ? '' : 'es'}`;
  if (elMonthlyRev) elMonthlyRev.textContent = formatARS(summary.totalRevenue);
  if (elOrdersPill) elOrdersPill.textContent = `${summary.ordersCount} ventas`;
  if (elAvgTicket) elAvgTicket.textContent = formatARS(summary.avgTicket);
  if (elNetProfit) elNetProfit.textContent = formatARS(summary.netProfit);
  if (elNetMarginPill) elNetMarginPill.textContent = `Margen: ${summary.netMarginPercent}%`;
  if (elLowStockVal) elLowStockVal.textContent = summary.lowStockCount;

  // Render Recent Sales Table
  const tbody = document.getElementById("dashboardRecentSalesTbody");
  if (tbody) {
    const sales = window.EzustDB.getSales().slice(0, 5);
    if (sales.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">No hay ventas registradas aún.</td></tr>`;
    } else {
      tbody.innerHTML = sales.map(s => {
        const itemsSummary = s.items.map(it => `${it.quantity}x ${it.name}`).join(", ");
        const statusClass = s.status === "Cobrada" ? "active" : "inactive";
        return `
          <tr>
            <td><strong style="color: var(--admin-gold);">${s.id}</strong></td>
            <td>${formatDate(s.date)} <span style="font-size: 0.72rem; color: var(--admin-text-subtle);">${s.time || ''}</span></td>
            <td>${s.customerName}</td>
            <td style="max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">${itemsSummary}</td>
            <td><span class="status-pill">${s.paymentMethod}</span></td>
            <td><strong>${formatARS(s.total)}</strong></td>
            <td><span class="status-pill ${statusClass}">${s.status}</span></td>
          </tr>
        `;
      }).join("");
    }
  }

  // Draw Interactive SVG Charts
  drawSalesTrendChart();
  drawCategoryDonutChart();
}

// Dynamic SVG Trend Area & Line Chart
function drawSalesTrendChart() {
  const svg = document.getElementById("salesSvgChart");
  if (!svg || !window.EzustDB) return;

  const sales = window.EzustDB.getSales().filter(s => s.status !== "Reembolsado");
  
  // Aggregate sales by date for the last 14 days
  const daysData = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    
    const daySales = sales.filter(s => s.date === dateStr);
    const revenue = daySales.reduce((sum, s) => sum + s.total, 0);
    const cost = daySales.reduce((sum, s) => sum + s.totalCost, 0);

    daysData.push({ date: dateStr, label, revenue, cost });
  }

  const maxVal = Math.max(100000, ...daysData.map(d => Math.max(d.revenue, d.cost)));
  const width = 600;
  const height = 240;
  const padLeft = 55;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getX = idx => padLeft + (idx / (daysData.length - 1)) * chartW;
  const getY = val => padTop + chartH - (val / maxVal) * chartH;

  // Build Revenue Path Points
  const revPoints = daysData.map((d, i) => `${getX(i)},${getY(d.revenue)}`);
  const costPoints = daysData.map((d, i) => `${getX(i)},${getY(d.cost)}`);

  // Area path for Revenue
  const revAreaPath = `M ${getX(0)},${padTop + chartH} L ${revPoints.join(" L ")} L ${getX(daysData.length - 1)},${padTop + chartH} Z`;

  // Grid lines (3 horizontal lines)
  let gridLines = "";
  for (let step = 0; step <= 3; step++) {
    const yVal = (maxVal / 3) * step;
    const yPos = getY(yVal);
    gridLines += `
      <line x1="${padLeft}" y1="${yPos}" x2="${width - padRight}" y2="${yPos}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
      <text x="${padLeft - 8}" y="${yPos + 4}" fill="#7D756C" font-size="10" text-anchor="end" font-family="monospace">$${Math.round(yVal / 1000)}k</text>
    `;
  }

  // X Axis Labels
  let xLabels = "";
  daysData.forEach((d, i) => {
    if (i % 2 === 0 || i === daysData.length - 1) {
      xLabels += `<text x="${getX(i)}" y="${height - 10}" fill="#7D756C" font-size="10" text-anchor="middle">${d.label}</text>`;
    }
  });

  // Interactive Markers with tooltips
  let markers = "";
  daysData.forEach((d, i) => {
    const rx = getX(i);
    const ry = getY(d.revenue);
    if (d.revenue > 0) {
      markers += `
        <circle cx="${rx}" cy="${ry}" r="4" fill="#C8A976" stroke="#0B0A09" stroke-width="2">
          <title>${d.date} &#10;Ventas: $${d.revenue.toLocaleString("es-AR")} &#10;Costo: $${d.cost.toLocaleString("es-AR")}</title>
        </circle>
      `;
    }
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="revGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#C8A976" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#C8A976" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    ${gridLines}
    <path d="${revAreaPath}" fill="url(#revGrad)" />
    <path d="M ${revPoints.join(" L ")}" fill="none" stroke="#C8A976" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M ${costPoints.join(" L ")}" fill="none" stroke="#E05353" stroke-width="2" stroke-linecap="round" stroke-dasharray="4,4" />
    ${markers}
    ${xLabels}
  `;
}

// Category Donut Chart
function drawCategoryDonutChart() {
  const svg = document.getElementById("categorySvgDonut");
  const legend = document.getElementById("categoryChartLegend");
  if (!svg || !window.EzustDB) return;

  const products = window.EzustDB.getProducts();
  const sales = window.EzustDB.getSales().filter(s => s.status !== "Reembolsado");

  // Aggregate by category
  const categories = [
    { key: "anillos", label: "Anillos", color: "#C8A976", count: 0 },
    { key: "aros", label: "Aros", color: "#DFBA73", count: 0 },
    { key: "collares", label: "Collares", color: "#749B86", count: 0 },
    { key: "pulseras", label: "Pulseras", color: "#E05353", count: 0 }
  ];

  // Count from sales or catalog
  sales.forEach(s => {
    s.items.forEach(it => {
      const prod = products.find(p => p.id === it.productId);
      const cat = (prod && prod.category) ? prod.category.toLowerCase() : "anillos";
      const match = categories.find(c => cat.includes(c.key));
      if (match) match.count += it.quantity;
      else categories[0].count += it.quantity;
    });
  });

  const total = categories.reduce((sum, c) => sum + c.count, 0) || 1;

  // Build SVG Donut segments
  let cumulativePercent = 0;
  let paths = "";

  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  categories.forEach(cat => {
    if (cat.count === 0) return;
    const percent = cat.count / total;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    // Radius 35 to 48 (donut ring)
    const rOuter = 44;
    const rInner = 28;

    const pathData = [
      `M ${50 + rOuter * startX} ${50 + rOuter * startY}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${50 + rOuter * endX} ${50 + rOuter * endY}`,
      `L ${50 + rInner * endX} ${50 + rInner * endY}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${50 + rInner * startX} ${50 + rInner * startY}`,
      `Z`
    ].join(" ");

    paths += `<path d="${pathData}" fill="${cat.color}">
      <title>${cat.label}: ${cat.count} u. (${Math.round(percent * 100)}%)</title>
    </path>`;
  });

  svg.innerHTML = `
    ${paths}
    <text x="50" y="48" fill="#F4EDE4" font-size="11" font-weight="700" text-anchor="middle" font-family="'Cinzel', serif">${total}</text>
    <text x="50" y="58" fill="#7D756C" font-size="6" text-anchor="middle">JOYAS</text>
  `;

  // Update Legend
  if (legend) {
    legend.innerHTML = categories.map(c => `
      <div style="display: flex; align-items: center; gap: 0.4rem;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${c.color};"></span>
        <span style="color: var(--admin-text-main);">${c.label} (${Math.round((c.count / total) * 100)}%)</span>
      </div>
    `).join("");
  }
}

// ============================================================================
// 2. PRODUCTS MODULE (CRUD, VARIANTS, MARGINS)
// ============================================================================
function renderProductsTable() {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody || !window.EzustDB) return;

  const search = (document.getElementById("productsSearchInput")?.value || "").toLowerCase().trim();
  const categoryFilter = document.getElementById("productsCategorySelect")?.value || "all";
  const stockFilter = document.getElementById("productsStockFilter")?.value || "all";
  const statusFilter = document.getElementById("productsStatusFilter")?.value || "all";

  let products = window.EzustDB.getProducts();

  // Apply filters
  if (search) {
    products = products.filter(p => 
      (p.name || "").toLowerCase().includes(search) || 
      (p.sku || "").toLowerCase().includes(search) ||
      (p.description || "").toLowerCase().includes(search)
    );
  }

  if (categoryFilter !== "all") {
    products = products.filter(p => (p.category || "").toLowerCase() === categoryFilter.toLowerCase());
  }

  if (stockFilter === "low") {
    products = products.filter(p => (p.stock || 0) <= (p.minStock || 3));
  } else if (stockFilter === "out") {
    products = products.filter(p => (p.stock || 0) === 0);
  }

  if (statusFilter !== "all") {
    const isAct = statusFilter === "active";
    products = products.filter(p => !!p.active === isAct);
  }

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2.5rem;">No se encontraron piezas con los filtros seleccionados.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const price = p.priceARS || 0;
    const cost = p.costARS || 0;
    const profit = price - cost;
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0;
    const isLow = (p.stock || 0) <= (p.minStock || 3);
    const imgSrc = p.image || 'assets/logo-symbol.svg';

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <img src="${imgSrc}" alt="${p.name}" class="product-thumb" onerror="this.src='assets/logo-symbol.svg'">
            <div>
              <div style="font-weight: 600; color: var(--admin-text-main); font-size: 0.9rem;">${p.name}</div>
              <div style="font-size: 0.72rem; color: var(--admin-gold); text-transform: uppercase;">${p.category || 'Joyería'}</div>
            </div>
          </div>
        </td>
        <td><code style="color: var(--admin-text-muted);">${p.sku}</code></td>
        <td>
          <strong style="color: var(--admin-gold-light);">${formatARS(price)}</strong>
          <div style="font-size: 0.7rem; color: var(--admin-text-subtle);">Costo: ${formatARS(cost)}</div>
        </td>
        <td>
          <span style="color: var(--admin-success); font-weight: 600;">+${formatARS(profit)}</span>
          <span style="font-size: 0.72rem; color: var(--admin-text-muted);"> (${margin}%)</span>
        </td>
        <td>
          <span class="status-pill ${isLow ? 'negative' : 'positive'}">
            ${p.stock || 0} unidades
          </span>
          ${isLow ? '<span style="display: block; font-size: 0.68rem; color: var(--admin-danger); margin-top: 2px;">¡Stock Crítico!</span>' : ''}
        </td>
        <td>
          <span class="status-pill ${p.active ? 'active' : 'inactive'}" style="cursor: pointer;" onclick="toggleProductActive('${p.id}')" title="Clic para alternar estado">
            ${p.active ? 'Activo' : 'Pausado'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.4rem;">
            <button class="btn-secondary btn-sm" onclick="openProductModal('${p.id}')" title="Editar Joya">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="btn-danger btn-sm" onclick="deleteProduct('${p.id}')" title="Eliminar Joya">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function openProductModal(productId = null) {
  const form = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalProductTitle");
  if (!form) return;

  form.reset();

  // Dynamic Margin Preview listener
  const priceInput = document.getElementById("prodPrice");
  const costInput = document.getElementById("prodCost");
  const updateMarginPreview = () => {
    const p = Number(priceInput.value) || 0;
    const c = Number(costInput.value) || 0;
    const profit = Math.max(0, p - c);
    const margin = p > 0 ? Math.round((profit / p) * 100) : 0;
    const elProf = document.getElementById("prodProfitARS");
    const elMarg = document.getElementById("prodMarginPercent");
    if (elProf) elProf.textContent = formatARS(profit);
    if (elMarg) elMarg.textContent = `${margin}%`;
  };

  priceInput.oninput = updateMarginPreview;
  costInput.oninput = updateMarginPreview;

  if (productId && window.EzustDB) {
    const prod = window.EzustDB.getProductById(productId);
    if (prod) {
      modalTitle.textContent = "Editar Pieza de Joyería";
      document.getElementById("prodId").value = prod.id;
      document.getElementById("prodName").value = prod.name;
      document.getElementById("prodSku").value = prod.sku || "";
      document.getElementById("prodCategory").value = prod.category || "anillos";
      document.getElementById("prodPrice").value = prod.priceARS || 0;
      document.getElementById("prodCost").value = prod.costARS || 0;
      document.getElementById("prodStock").value = prod.stock || 0;
      document.getElementById("prodMinStock").value = prod.minStock || 3;
      document.getElementById("prodMetals").value = Array.isArray(prod.metals) ? prod.metals.join(", ") : (prod.metals || "");
      document.getElementById("prodSizes").value = Array.isArray(prod.sizes) ? prod.sizes.join(", ") : (prod.sizes || "");
      document.getElementById("prodBadge").value = prod.badge || "";
      document.getElementById("prodImage").value = prod.image || "";
      document.getElementById("prodDescription").value = prod.description || "";
      document.getElementById("prodActive").value = String(prod.active !== false);

      updateMarginPreview();
      openModal("modalProduct");
      return;
    }
  }

  // Create Mode
  modalTitle.textContent = "Nueva Pieza en Atelier";
  document.getElementById("prodId").value = "";
  document.getElementById("prodActive").value = "true";
  updateMarginPreview();
  openModal("modalProduct");
}

function handleProductSubmit(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const id = document.getElementById("prodId").value;
  const name = document.getElementById("prodName").value.trim();
  const sku = document.getElementById("prodSku").value.trim();
  const category = document.getElementById("prodCategory").value;
  const priceARS = Number(document.getElementById("prodPrice").value) || 0;
  const costARS = Number(document.getElementById("prodCost").value) || 0;
  const stock = Number(document.getElementById("prodStock").value) || 0;
  const minStock = Number(document.getElementById("prodMinStock").value) || 3;
  const metalsRaw = document.getElementById("prodMetals").value.trim();
  const sizesRaw = document.getElementById("prodSizes").value.trim();
  const badge = document.getElementById("prodBadge").value.trim();
  const image = document.getElementById("prodImage").value.trim() || "assets/products_hq/ez-real-01_main.jpg";
  const description = document.getElementById("prodDescription").value.trim();
  const active = document.getElementById("prodActive").value === "true";

  const metals = metalsRaw ? metalsRaw.split(",").map(m => m.trim()).filter(Boolean) : ["Plata 925"];
  const sizes = sizesRaw ? sizesRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  const saved = window.EzustDB.saveProduct({
    id: id || undefined,
    name,
    sku,
    category,
    priceARS,
    costARS,
    stock,
    minStock,
    metals,
    sizes,
    badge,
    image,
    description,
    active
  });

  if (saved) {
    showToast(`Pieza "${saved.name}" guardada exitosamente.`);
    closeModal("modalProduct");
    renderProductsTable();
    updateStockAlertBadge();
  } else {
    showToast("Error al guardar la pieza.", "danger");
  }
}

function deleteProduct(productId) {
  if (!confirm("¿Confirma que desea eliminar esta pieza de joyería del catálogo?")) return;
  if (!window.EzustDB) return;

  const success = window.EzustDB.deleteProduct(productId);
  if (success) {
    showToast("Pieza eliminada correctamente.");
    renderProductsTable();
    updateStockAlertBadge();
  } else {
    showToast("No se pudo eliminar la pieza.", "danger");
  }
}

function toggleProductActive(productId) {
  if (!window.EzustDB) return;
  const updated = window.EzustDB.toggleProductStatus(productId);
  if (updated) {
    showToast(`Estado de "${updated.name}" cambiado a ${updated.active ? 'Activo' : 'Pausado'}.`);
    renderProductsTable();
  }
}

// ============================================================================
// 3. INVENTORY MODULE (STOCK CONTROL, KARDEX & ADJUSTMENTS)
// ============================================================================
function switchInventorySubTab(subTab) {
  currentInventorySubTab = subTab;
  const btnCurrent = document.getElementById("tabBtnStockCurrent");
  const btnKardex = document.getElementById("tabBtnStockKardex");
  const contCurrent = document.getElementById("inventoryCurrentContainer");
  const contKardex = document.getElementById("inventoryKardexContainer");

  if (subTab === "current") {
    btnCurrent.classList.add("active");
    btnKardex.classList.remove("active");
    contCurrent.style.display = "block";
    contKardex.style.display = "none";
    renderInventoryCurrentTable();
  } else {
    btnCurrent.classList.remove("active");
    btnKardex.classList.add("active");
    contCurrent.style.display = "none";
    contKardex.style.display = "block";
    renderInventoryKardexTable();
  }
}

function renderInventoryKPIs() {
  if (!window.EzustDB) return;
  const summary = window.EzustDB.getFinancialSummary();

  const elUnits = document.getElementById("invTotalUnits");
  const elCost = document.getElementById("invCostValuation");
  const elRetail = document.getElementById("invRetailValuation");
  const elLow = document.getElementById("invLowStockCount");

  if (elUnits) elUnits.textContent = `${summary.totalStockUnits} u.`;
  if (elCost) elCost.textContent = formatARS(summary.inventoryValuationCost);
  if (elRetail) elRetail.textContent = formatARS(summary.inventoryValuationRetail);
  if (elLow) elLow.textContent = summary.lowStockCount;
}

function renderInventoryCurrentTable() {
  const tbody = document.getElementById("inventoryCurrentTableBody");
  if (!tbody || !window.EzustDB) return;

  const search = (document.getElementById("inventorySearchInput")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("inventoryStatusSelect")?.value || "all";

  let products = window.EzustDB.getProducts();

  if (search) {
    products = products.filter(p => 
      (p.name || "").toLowerCase().includes(search) || 
      (p.sku || "").toLowerCase().includes(search)
    );
  }

  if (statusFilter === "critical") {
    products = products.filter(p => (p.stock || 0) <= 2);
  } else if (statusFilter === "warning") {
    products = products.filter(p => (p.stock || 0) === 3);
  } else if (statusFilter === "good") {
    products = products.filter(p => (p.stock || 0) > 3);
  }

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">No hay registros con los filtros seleccionados.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const stock = p.stock || 0;
    const min = p.minStock || 3;
    const isCritical = stock <= 2;
    const isWarn = stock <= min;
    const valuation = (p.costARS || 0) * stock;

    return `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--admin-text-main);">${p.name}</div>
          <code style="font-size: 0.72rem; color: var(--admin-gold);">${p.sku}</code>
        </td>
        <td style="text-transform: capitalize;">${p.category || 'Joya'}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button class="btn-secondary btn-sm" style="padding: 2px 7px;" onclick="quickAdjustStock('${p.id}', -1)" title="Restar 1">-</button>
            <strong style="font-size: 1rem; color: ${isCritical ? 'var(--admin-danger)' : 'var(--admin-text-main)'};">${stock}</strong>
            <button class="btn-secondary btn-sm" style="padding: 2px 7px;" onclick="quickAdjustStock('${p.id}', 1)" title="Sumar 1">+</button>
          </div>
        </td>
        <td>${min} u.</td>
        <td><strong>${formatARS(valuation)}</strong></td>
        <td>
          <span class="status-pill ${isCritical ? 'negative' : isWarn ? 'warning' : 'positive'}">
            ${isCritical ? 'Crítico' : isWarn ? 'Alerta Reposición' : 'Óptimo'}
          </span>
        </td>
        <td style="text-align: right;">
          <button class="btn-secondary btn-sm" onclick="openStockAdjustModal('${p.id}')">Ajustar</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderInventoryKardexTable() {
  const tbody = document.getElementById("inventoryKardexTableBody");
  if (!tbody || !window.EzustDB) return;

  const logs = window.EzustDB.getInventoryLogs();
  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 2.5rem;">Aún no se han registrado movimientos de inventario.</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(log => {
    const isPositive = log.quantity > 0;
    const pillClass = log.type.includes("ENTRADA") ? "positive" : log.type.includes("SALIDA") ? "negative" : "warning";

    return `
      <tr>
        <td>${log.timestamp}</td>
        <td>
          <div style="font-weight: 500;">${log.productName}</div>
          <code style="font-size: 0.7rem; color: var(--admin-text-subtle);">${log.sku}</code>
        </td>
        <td><span class="status-pill ${pillClass}">${log.type}</span></td>
        <td>
          <strong style="color: ${isPositive ? 'var(--admin-success)' : 'var(--admin-danger)'};">
            ${isPositive ? '+' : ''}${log.quantity} u.
          </strong>
        </td>
        <td>${log.previousStock} &rarr; <strong>${log.newStock} u.</strong></td>
        <td>${log.reason}</td>
        <td><span style="font-size: 0.76rem; color: var(--admin-text-muted);">${log.user}</span></td>
      </tr>
    `;
  }).join("");
}

function quickAdjustStock(productId, delta) {
  if (!window.EzustDB) return;
  const reason = delta > 0 ? "Ingreso rápido +1" : "Salida rápida -1";
  const res = window.EzustDB.adjustStock(productId, delta, reason, delta > 0 ? "AJUSTE_MANUAL" : "SALIDA_AJUSTE");
  if (res.success) {
    showToast(`Stock de "${res.product.name}" actualizado a ${res.product.stock} u.`);
    renderInventoryCurrentTable();
    renderInventoryKardexTable();
    renderInventoryKPIs();
    updateStockAlertBadge();
  }
}

function openStockAdjustModal(productId = null) {
  if (!window.EzustDB) return;
  const select = document.getElementById("stockAdjustSelectProduct");
  const products = window.EzustDB.getProducts();

  select.innerHTML = products.map(p => `
    <option value="${p.id}" ${p.id === productId ? 'selected' : ''}>
      ${p.name} (${p.sku}) - Stock actual: ${p.stock}
    </option>
  `).join("");

  const targetId = productId || (products[0] ? products[0].id : null);
  updateStockAdjustProductInfo(targetId);
  openModal("modalStockAdjust");
}

function updateStockAdjustProductInfo(productId) {
  if (!window.EzustDB) return;
  const prod = window.EzustDB.getProductById(productId);
  const el = document.getElementById("stockAdjustCurrentVal");
  if (el && prod) {
    el.textContent = prod.stock;
  }
}

function handleStockAdjustSubmit(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const productId = document.getElementById("stockAdjustSelectProduct").value;
  const type = document.getElementById("stockAdjustType").value;
  const qty = Number(document.getElementById("stockAdjustQty").value);
  const reason = document.getElementById("stockAdjustReason").value.trim();

  if (isNaN(qty) || qty === 0) {
    showToast("Por favor ingrese una cantidad distinta de cero.", "warning");
    return;
  }

  const res = window.EzustDB.adjustStock(productId, qty, reason, type);
  if (res.success) {
    showToast(`Ajuste de inventario aplicado: ${res.product.name} quedó en ${res.product.stock} u.`);
    closeModal("modalStockAdjust");
    renderInventoryCurrentTable();
    renderInventoryKardexTable();
    renderInventoryKPIs();
    updateStockAlertBadge();
  } else {
    showToast(res.error || "Error al ajustar inventario.", "danger");
  }
}

// ============================================================================
// 4. SALES & CASHIER (POS) CONTROLLER
// ============================================================================
function switchSalesSubTab(subTab) {
  currentSalesSubTab = subTab;
  const btnPos = document.getElementById("salesSubTabPosBtn");
  const btnOrders = document.getElementById("salesSubTabOrdersBtn");
  const btnCash = document.getElementById("salesSubTabCashBtn");

  const contPos = document.getElementById("salesPosContainer");
  const contOrders = document.getElementById("salesOrdersContainer");
  const contCash = document.getElementById("salesCashContainer");

  btnPos.classList.remove("active");
  btnOrders.classList.remove("active");
  btnCash.classList.remove("active");

  contPos.style.display = "none";
  contOrders.style.display = "none";
  contCash.style.display = "none";

  if (subTab === "pos") {
    btnPos.classList.add("active");
    contPos.style.display = "block";
    renderPosCatalog();
    updatePosCustomerSelect();
  } else if (subTab === "orders") {
    btnOrders.classList.add("active");
    contOrders.style.display = "block";
    renderOrdersTable();
  } else if (subTab === "cash") {
    btnCash.classList.add("active");
    contCash.style.display = "block";
    renderCashRegister();
  }
}

function renderPosCatalog() {
  const grid = document.getElementById("posProductsGrid");
  if (!grid || !window.EzustDB) return;

  const search = (document.getElementById("posSearchInput")?.value || "").toLowerCase().trim();
  const category = document.getElementById("posCategorySelect")?.value || "all";

  let products = window.EzustDB.getProducts().filter(p => p.active !== false);

  if (search) {
    products = products.filter(p => 
      (p.name || "").toLowerCase().includes(search) || 
      (p.sku || "").toLowerCase().includes(search)
    );
  }

  if (category !== "all") {
    products = products.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
  }

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--admin-text-muted);">No se encontraron joyas activas.</div>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const isOut = (p.stock || 0) <= 0;
    const imgSrc = p.image || 'assets/logo-symbol.svg';

    return `
      <div class="pos-product-card" onclick="${isOut ? '' : `addToPosCart('${p.id}')`}" style="${isOut ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
        <img src="${imgSrc}" alt="${p.name}" class="pos-product-thumb" onerror="this.src='assets/logo-symbol.svg'">
        <div style="font-weight: 600; color: var(--admin-text-main); font-size: 0.85rem; line-height: 1.25; margin-bottom: 0.35rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.name}</div>
        <div style="font-size: 0.72rem; color: var(--admin-text-subtle); margin-bottom: 0.5rem;">${p.sku}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <strong style="color: var(--admin-gold); font-size: 0.95rem;">${formatARS(p.priceARS)}</strong>
          <span class="status-pill ${isOut ? 'negative' : (p.stock <= p.minStock ? 'warning' : 'positive')}" style="font-size: 0.65rem;">
            ${isOut ? 'Sin stock' : `${p.stock} u.`}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function updatePosCustomerSelect() {
  const select = document.getElementById("posCustomerSelect");
  if (!select || !window.EzustDB) return;

  const customers = window.EzustDB.getCustomers();
  select.innerHTML = `
    <option value="">Cliente Mostrador / Ocasional</option>
    ${customers.map(c => `
      <option value="${c.id}">${c.name} (${c.phone || c.city || c.tier})</option>
    `).join("")}
  `;
}

function addToPosCart(productId) {
  if (!window.EzustDB) return;
  const prod = window.EzustDB.getProductById(productId);
  if (!prod) return;

  if ((prod.stock || 0) <= 0) {
    showToast("Esta joya no cuenta con stock disponible.", "danger");
    return;
  }

  const existing = posCart.find(it => it.productId === productId);
  if (existing) {
    if (existing.quantity >= prod.stock) {
      showToast(`No podés agregar más de ${prod.stock} u. disponibles en stock.`, "warning");
      return;
    }
    existing.quantity += 1;
  } else {
    posCart.push({
      productId: prod.id,
      name: prod.name,
      sku: prod.sku,
      priceARS: prod.priceARS,
      costARS: prod.costARS || 0,
      image: prod.image,
      quantity: 1
    });
  }

  renderPosCart();
  updatePosTotals();
}

function updatePosCartItemQty(productId, delta) {
  const item = posCart.find(it => it.productId === productId);
  if (!item) return;

  const prod = window.EzustDB ? window.EzustDB.getProductById(productId) : null;
  const maxStock = prod ? prod.stock : 999;

  if (delta > 0 && item.quantity >= maxStock) {
    showToast(`Límite de stock físico alcanzado (${maxStock} u.)`, "warning");
    return;
  }

  item.quantity += delta;
  if (item.quantity <= 0) {
    posCart = posCart.filter(it => it.productId !== productId);
  }

  renderPosCart();
  updatePosTotals();
}

function removePosCartItem(productId) {
  posCart = posCart.filter(it => it.productId !== productId);
  renderPosCart();
  updatePosTotals();
}

function clearPosCart() {
  posCart = [];
  renderPosCart();
  updatePosTotals();
}

function renderPosCart() {
  const container = document.getElementById("posCartItemsList");
  if (!container) return;

  if (posCart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--admin-text-muted);">
        Hacé clic en una joya para agregarla a la orden de venta.
      </div>
    `;
    return;
  }

  container.innerHTML = posCart.map(item => `
    <div class="cart-item-row">
      <img src="${item.image || 'assets/logo-symbol.svg'}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='assets/logo-symbol.svg'">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatARS(item.priceARS)} x ${item.quantity} = <strong>${formatARS(item.priceARS * item.quantity)}</strong></div>
      </div>
      <div class="cart-qty-ctrl">
        <button class="cart-qty-btn" onclick="updatePosCartItemQty('${item.productId}', -1)">-</button>
        <span style="font-size: 0.82rem; font-weight: 600; min-width: 14px; text-align: center;">${item.quantity}</span>
        <button class="cart-qty-btn" onclick="updatePosCartItemQty('${item.productId}', 1)">+</button>
      </div>
      <button class="btn-danger btn-sm" style="padding: 4px 6px; margin-left: 0.4rem;" onclick="removePosCartItem('${item.productId}')" title="Quitar">
        &times;
      </button>
    </div>
  `).join("");
}

function updatePosTotals() {
  const subtotal = posCart.reduce((sum, it) => sum + (it.priceARS * it.quantity), 0);
  const discount = Number(document.getElementById("posDiscountInput")?.value) || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const elSub = document.getElementById("posSubtotalDisplay");
  const elDisc = document.getElementById("posDiscountDisplay");
  const elGrand = document.getElementById("posGrandTotalDisplay");

  if (elSub) elSub.textContent = formatARS(subtotal);
  if (elDisc) elDisc.textContent = discount > 0 ? `- ${formatARS(discount)}` : "- $0";
  if (elGrand) elGrand.textContent = formatARS(grandTotal);

  calculatePosChange();
}

function handlePaymentMethodChange() {
  const method = document.getElementById("posPaymentMethodSelect")?.value;
  const cashBox = document.getElementById("posCashChangeBox");
  if (cashBox) {
    cashBox.style.display = method === "Efectivo" ? "grid" : "none";
  }
}

function calculatePosChange() {
  const subtotal = posCart.reduce((sum, it) => sum + (it.priceARS * it.quantity), 0);
  const discount = Number(document.getElementById("posDiscountInput")?.value) || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const tendered = Number(document.getElementById("posCashTenderedInput")?.value) || 0;
  const display = document.getElementById("posCashChangeDisplay");

  if (display) {
    if (tendered > grandTotal) {
      display.value = formatARS(tendered - grandTotal);
      display.style.color = "var(--admin-success)";
    } else if (tendered === grandTotal && tendered > 0) {
      display.value = "$0 (Exacto)";
      display.style.color = "var(--admin-gold)";
    } else {
      display.value = "$0";
      display.style.color = "var(--admin-text-muted)";
    }
  }
}

function processPosSale() {
  if (posCart.length === 0) {
    showToast("Agregá al menos una joya a la orden antes de cobrar.", "warning");
    return;
  }

  if (!window.EzustDB) return;

  const customerSelect = document.getElementById("posCustomerSelect");
  const customerId = customerSelect ? customerSelect.value : null;
  let customerName = "Cliente Mostrador";
  let customerPhone = "";
  let customerEmail = "";

  if (customerId) {
    const cust = window.EzustDB.getCustomers().find(c => c.id === customerId);
    if (cust) {
      customerName = cust.name;
      customerPhone = cust.phone;
      customerEmail = cust.email;
    }
  }

  const paymentMethod = document.getElementById("posPaymentMethodSelect")?.value || "Efectivo";
  const discount = Number(document.getElementById("posDiscountInput")?.value) || 0;

  const sale = window.EzustDB.createSale({
    items: posCart.map(it => ({
      productId: it.productId,
      name: it.name,
      sku: it.sku,
      priceARS: it.priceARS,
      costARS: it.costARS,
      quantity: it.quantity
    })),
    discount,
    paymentMethod,
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    notes: "Venta registrada desde Terminal POS Atelier"
  });

  if (sale) {
    showToast(`Venta #${sale.id} completada exitosamente (${formatARS(sale.total)})!`);
    
    // Clear Cart
    posCart = [];
    document.getElementById("posDiscountInput").value = "0";
    if (document.getElementById("posCashTenderedInput")) {
      document.getElementById("posCashTenderedInput").value = "";
    }
    renderPosCart();
    updatePosTotals();
    renderPosCatalog(); // Refresh remaining stock
    updateTopbarCashier();
    updateStockAlertBadge();

    // Show Printable Receipt Modal
    viewSaleReceipt(sale.id);
  } else {
    showToast("Error al procesar la venta.", "danger");
  }
}

function renderOrdersTable() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody || !window.EzustDB) return;

  const search = (document.getElementById("ordersSearchInput")?.value || "").toLowerCase().trim();
  const paymentFilter = document.getElementById("ordersPaymentFilter")?.value || "all";

  let sales = window.EzustDB.getSales();

  if (search) {
    sales = sales.filter(s => 
      (s.id || "").toLowerCase().includes(search) || 
      (s.customerName || "").toLowerCase().includes(search)
    );
  }

  if (paymentFilter !== "all") {
    sales = sales.filter(s => (s.paymentMethod || "").toLowerCase().includes(paymentFilter.toLowerCase()));
  }

  if (sales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--admin-text-muted); padding: 2.5rem;">No hay ventas registradas.</td></tr>`;
    return;
  }

  tbody.innerHTML = sales.map(s => {
    const isRefunded = s.status === "Reembolsado";
    const statusPill = isRefunded ? "negative" : "active";
    const itemsCount = s.items.reduce((sum, it) => sum + it.quantity, 0);

    return `
      <tr>
        <td><strong style="color: var(--admin-gold);">${s.id}</strong></td>
        <td>${formatDate(s.date)} <span style="font-size: 0.7rem; color: var(--admin-text-subtle);">${s.time || ''}</span></td>
        <td>${s.customerName}</td>
        <td>${itemsCount} pieza${itemsCount === 1 ? '' : 's'}</td>
        <td><span class="status-pill">${s.paymentMethod}</span></td>
        <td><strong>${formatARS(s.total)}</strong></td>
        <td><span class="status-pill ${statusPill}">${s.status}</span></td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.4rem;">
            <button class="btn-secondary btn-sm" onclick="viewSaleReceipt('${s.id}')" title="Ver Comprobante">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </button>
            ${!isRefunded ? `
              <button class="btn-danger btn-sm" onclick="refundSaleOrder('${s.id}')" title="Anular y Reembolsar">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function viewSaleReceipt(orderId) {
  if (!window.EzustDB) return;
  const sale = window.EzustDB.getSales().find(s => s.id === orderId);
  if (!sale) return;

  const settings = window.EzustDB.getSettings();

  document.getElementById("recOrderId").textContent = sale.id;
  document.getElementById("recDateTime").textContent = `${formatDate(sale.date)} ${sale.time || ''}`;
  document.getElementById("recCustomer").textContent = sale.customerName;
  document.getElementById("recSalesperson").textContent = sale.salesperson || "Martín Gallará";
  document.getElementById("recPayment").textContent = sale.paymentMethod;
  document.getElementById("recTotalAmount").textContent = formatARS(sale.total);

  if (settings.receiptFooter) {
    document.getElementById("recFooterText").textContent = settings.receiptFooter;
  }

  const tbody = document.getElementById("recItemsTbody");
  if (tbody) {
    tbody.innerHTML = sale.items.map(it => `
      <tr>
        <td>
          <div style="font-weight: 600;">${it.name}</div>
          <code style="font-size: 0.7rem; color: #7D756C;">${it.sku}</code>
        </td>
        <td style="text-align: center;">${it.quantity}</td>
        <td style="text-align: right; font-weight: 600;">${formatARS(it.priceARS * it.quantity)}</td>
      </tr>
    `).join("");
  }

  openModal("modalReceipt");
}

function refundSaleOrder(orderId) {
  const reason = prompt("Ingrese el motivo de la devolución / reembolso de la orden:", "Cambio de joya o disconformidad");
  if (!reason) return;

  if (!window.EzustDB) return;
  const res = window.EzustDB.refundSale(orderId, reason);
  if (res.success) {
    showToast(`Orden #${orderId} anulada y stock reincorporado.`);
    renderOrdersTable();
    updateTopbarCashier();
    updateStockAlertBadge();
  } else {
    showToast(res.error || "Error al reembolsar.", "danger");
  }
}

// Cash Register (Caja) Logic
function renderCashRegister() {
  if (!window.EzustDB) return;
  const reg = window.EzustDB.getCashRegister();

  const elStatus = document.getElementById("cashStatusDisplay");
  const elOpened = document.getElementById("cashOpenedAtDisplay");
  const elInit = document.getElementById("cashInitialDisplay");
  const elCurrent = document.getElementById("cashCurrentDisplay");

  if (elStatus) elStatus.textContent = reg.status === "open" ? "Abierta" : "Cerrada";
  if (elOpened) elOpened.textContent = reg.openedAt ? `Abierta el ${reg.openedAt}` : "Caja sin abrir";
  if (elInit) elInit.textContent = formatARS(reg.initialCash);
  if (elCurrent) elCurrent.textContent = formatARS(reg.currentCash);

  calculateCashDifference();
}

function calculateCashDifference() {
  if (!window.EzustDB) return;
  const reg = window.EzustDB.getCashRegister();
  const input = document.getElementById("cashPhysicalCountInput");
  const alertBox = document.getElementById("cashDiffAlertBox");
  if (!input || !alertBox) return;

  const physical = Number(input.value);
  if (!input.value) {
    alertBox.style.display = "none";
    return;
  }

  const diff = physical - (reg.currentCash || 0);
  alertBox.style.display = "block";

  if (diff === 0) {
    alertBox.style.background = "var(--admin-success-bg)";
    alertBox.style.color = "var(--admin-success)";
    alertBox.textContent = "✓ Caja Exacta: Coincide 100% con el sistema.";
  } else if (diff > 0) {
    alertBox.style.background = "rgba(78, 159, 118, 0.15)";
    alertBox.style.color = "var(--admin-success)";
    alertBox.textContent = `▲ Sobrante de Caja: +${formatARS(diff)} a favor.`;
  } else {
    alertBox.style.background = "var(--admin-danger-bg)";
    alertBox.style.color = "var(--admin-danger)";
    alertBox.textContent = `▼ Faltante de Caja: ${formatARS(diff)} en contra.`;
  }
}

function submitCloseCashRegister() {
  const physicalInput = document.getElementById("cashPhysicalCountInput");
  const notesInput = document.getElementById("cashClosingNotesInput");
  if (!physicalInput || !window.EzustDB) return;

  const count = Number(physicalInput.value);
  if (isNaN(count)) {
    showToast("Por favor ingrese el conteo físico de billetes.", "warning");
    return;
  }

  const reg = window.EzustDB.closeCashRegister(count, notesInput ? notesInput.value : "");
  showToast(`Caja cerrada. Diferencia registrada: ${formatARS(reg.difference)}.`);
  physicalInput.value = "";
  if (notesInput) notesInput.value = "";
  renderCashRegister();
  updateTopbarCashier();
}

function openReopenCashModal() {
  const initial = prompt("Ingrese el nuevo fondo de caja inicial en efectivo ($ ARS):", "50000");
  if (initial === null) return;
  const amount = Number(initial);
  if (isNaN(amount) || amount < 0) {
    showToast("Monto inválido", "danger");
    return;
  }

  if (!window.EzustDB) return;
  window.EzustDB.openCashRegister(amount, "Apertura de turno");
  showToast(`Caja abierta con fondo inicial de ${formatARS(amount)}.`);
  renderCashRegister();
  updateTopbarCashier();
}

// ============================================================================
// 5. PURCHASES & SUPPLIERS MODULE
// ============================================================================
function renderSuppliersTable() {
  const tbody = document.getElementById("suppliersTableBody");
  if (!tbody || !window.EzustDB) return;

  const suppliers = window.EzustDB.getSuppliers();
  if (suppliers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">No hay proveedores registrados.</td></tr>`;
    return;
  }

  tbody.innerHTML = suppliers.map(s => `
    <tr>
      <td><strong style="color: var(--admin-gold);">${s.name}</strong></td>
      <td>${s.contact || '-'}</td>
      <td>
        <a href="https://wa.me/${(s.phone || '').replace(/[^0-9]/g, '')}" target="_blank" style="color: var(--admin-success); text-decoration: none;">
          ${s.phone || '-'}
        </a>
      </td>
      <td><span class="status-pill">${s.category || 'Orfebrería'}</span></td>
      <td>${s.address || '-'}</td>
      <td style="text-align: right;">
        <button class="btn-secondary btn-sm" onclick="openSupplierModal('${s.id}')">Editar</button>
      </td>
    </tr>
  `).join("");
}

function renderPurchasesTable() {
  const tbody = document.getElementById("purchasesTableBody");
  if (!tbody || !window.EzustDB) return;

  const purchases = window.EzustDB.getPurchases();
  if (purchases.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">No hay compras registradas.</td></tr>`;
    return;
  }

  tbody.innerHTML = purchases.map(p => {
    const itemsSummary = p.items.map(it => `${it.quantity}x ${it.productName || 'Joya'}`).join(", ");
    return `
      <tr>
        <td><strong style="color: var(--admin-gold);">${p.invoiceNumber || p.id}</strong></td>
        <td>${formatDate(p.date)}</td>
        <td>${p.supplierName}</td>
        <td>${itemsSummary}</td>
        <td><strong style="color: var(--admin-danger);">${formatARS(p.total)}</strong></td>
        <td><span class="status-pill positive">${p.status}</span></td>
        <td><span style="font-size: 0.74rem; color: var(--admin-text-muted);">${p.registeredBy}</span></td>
      </tr>
    `;
  }).join("");
}

function openSupplierModal(supplierId = null) {
  const form = document.getElementById("supplierForm");
  const modalTitle = document.getElementById("modalSupplierTitle");
  if (!form) return;
  form.reset();

  if (supplierId && window.EzustDB) {
    const sup = window.EzustDB.getSuppliers().find(s => s.id === supplierId);
    if (sup) {
      modalTitle.textContent = "Editar Proveedor / Taller";
      document.getElementById("supplierId").value = sup.id;
      document.getElementById("supName").value = sup.name;
      document.getElementById("supContact").value = sup.contact || "";
      document.getElementById("supPhone").value = sup.phone || "";
      document.getElementById("supEmail").value = sup.email || "";
      document.getElementById("supCategory").value = sup.category || "";
      document.getElementById("supAddress").value = sup.address || "";
      openModal("modalSupplier");
      return;
    }
  }

  modalTitle.textContent = "Nuevo Proveedor / Taller";
  document.getElementById("supplierId").value = "";
  openModal("modalSupplier");
}

function handleSupplierSubmit(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const id = document.getElementById("supplierId").value;
  const name = document.getElementById("supName").value.trim();
  const contact = document.getElementById("supContact").value.trim();
  const phone = document.getElementById("supPhone").value.trim();
  const email = document.getElementById("supEmail").value.trim();
  const category = document.getElementById("supCategory").value.trim();
  const address = document.getElementById("supAddress").value.trim();

  const saved = window.EzustDB.saveSupplier({ id: id || undefined, name, contact, phone, email, category, address });
  if (saved) {
    showToast(`Proveedor "${saved.name}" guardado.`);
    closeModal("modalSupplier");
    renderSuppliersTable();
  }
}

function openPurchaseModal() {
  if (!window.EzustDB) return;
  const supSelect = document.getElementById("purchaseSupplierSelect");
  const prodSelect = document.getElementById("purchaseProductSelect");

  const suppliers = window.EzustDB.getSuppliers();
  const products = window.EzustDB.getProducts();

  supSelect.innerHTML = suppliers.map(s => `<option value="${s.id}">${s.name} (${s.category})</option>`).join("");
  prodSelect.innerHTML = products.map(p => `<option value="${p.id}" data-cost="${p.costARS || 0}">${p.name} (${p.sku})</option>`).join("");

  prodSelect.onchange = () => {
    const opt = prodSelect.options[prodSelect.selectedIndex];
    const cost = opt.getAttribute("data-cost") || 0;
    document.getElementById("purchaseUnitCost").value = cost;
  };

  if (products[0]) {
    document.getElementById("purchaseUnitCost").value = products[0].costARS || 0;
  }

  openModal("modalPurchase");
}

function handlePurchaseSubmit(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const supplierSelect = document.getElementById("purchaseSupplierSelect");
  const supplierId = supplierSelect.value;
  const supplierName = supplierSelect.options[supplierSelect.selectedIndex].text;
  const invoiceNumber = document.getElementById("purchaseInvoice").value.trim();

  const prodSelect = document.getElementById("purchaseProductSelect");
  const productId = prodSelect.value;
  const prod = window.EzustDB.getProductById(productId);

  const quantity = Number(document.getElementById("purchaseQty").value) || 1;
  const costARS = Number(document.getElementById("purchaseUnitCost").value) || 0;
  const notes = document.getElementById("purchaseNotes").value.trim();

  const purchase = window.EzustDB.createPurchase({
    supplierId,
    supplierName,
    invoiceNumber,
    items: [{
      productId,
      productName: prod ? prod.name : "Joya",
      sku: prod ? prod.sku : "EZ-001",
      quantity,
      costARS
    }],
    notes
  });

  if (purchase) {
    showToast(`Compra #${purchase.id} registrada. Stock actualizado (+${quantity} u.)!`);
    closeModal("modalPurchase");
    renderPurchasesTable();
    updateStockAlertBadge();
  }
}

// ============================================================================
// 6. FINANCES & OPERATING EXPENSES MODULE
// ============================================================================
function renderFinancesView() {
  if (!window.EzustDB) return;
  const summary = window.EzustDB.getFinancialSummary(30);

  const elRev = document.getElementById("finTotalRevenue");
  const elCogs = document.getElementById("finTotalCOGS");
  const elGross = document.getElementById("finGrossProfit");
  const elGrossMargin = document.getElementById("finGrossMarginPercent");
  const elExp = document.getElementById("finOperatingExpenses");
  const elNetBig = document.getElementById("finNetProfitBig");
  const elNetMargin = document.getElementById("finNetMarginPercent");

  if (elRev) elRev.textContent = formatARS(summary.totalRevenue);
  if (elCogs) elCogs.textContent = formatARS(summary.totalCOGS);
  if (elGross) elGross.textContent = formatARS(summary.grossProfit);
  if (elGrossMargin) elGrossMargin.textContent = `${summary.grossMarginPercent}%`;
  if (elExp) elExp.textContent = formatARS(summary.totalOperatingExpenses);
  if (elNetBig) elNetBig.textContent = formatARS(summary.netProfit);
  if (elNetMargin) elNetMargin.textContent = `${summary.netMarginPercent}%`;

  // Render Expenses Table
  const tbody = document.getElementById("expensesTableBody");
  if (tbody) {
    const expenses = window.EzustDB.getExpenses();
    if (expenses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">No hay egresos registrados.</td></tr>`;
    } else {
      tbody.innerHTML = expenses.map(exp => `
        <tr>
          <td>${formatDate(exp.date)}</td>
          <td><span class="status-pill">${exp.category}</span></td>
          <td><strong style="color: var(--admin-text-main);">${exp.concept}</strong></td>
          <td>${exp.recipient || '-'}</td>
          <td>${exp.paymentMethod}</td>
          <td><strong style="color: var(--admin-danger);">${formatARS(exp.amount)}</strong></td>
          <td style="text-align: right;">
            <button class="btn-danger btn-sm" onclick="deleteExpense('${exp.id}')" title="Anular Gasto">&times;</button>
          </td>
        </tr>
      `).join("");
    }
  }
}

function openExpenseModal() {
  const form = document.getElementById("expenseForm");
  if (form) form.reset();
  openModal("modalExpense");
}

function handleExpenseSubmit(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const category = document.getElementById("expCategory").value;
  const amount = Number(document.getElementById("expAmount").value) || 0;
  const concept = document.getElementById("expConcept").value.trim();
  const recipient = document.getElementById("expRecipient").value.trim();
  const paymentMethod = document.getElementById("expPaymentMethod").value;

  const newExp = window.EzustDB.createExpense({
    category,
    amount,
    concept,
    recipient,
    paymentMethod
  });

  if (newExp) {
    showToast(`Gasto de ${formatARS(amount)} registrado.`);
    closeModal("modalExpense");
    renderFinancesView();
    updateTopbarCashier();
  }
}

function deleteExpense(expenseId) {
  if (!confirm("¿Desea anular este gasto registrado?")) return;
  if (!window.EzustDB) return;

  const success = window.EzustDB.deleteExpense(expenseId);
  if (success) {
    showToast("Gasto anulado.");
    renderFinancesView();
  }
}

// ============================================================================
// 7. CUSTOMERS & CRM MODULE
// ============================================================================
function renderCustomersTable() {
  const tbody = document.getElementById("customersTableBody");
  if (!tbody || !window.EzustDB) return;

  const search = (document.getElementById("customersSearchInput")?.value || "").toLowerCase().trim();
  const tierFilter = document.getElementById("customersTierFilter")?.value || "all";

  let customers = window.EzustDB.getCustomers();

  if (search) {
    customers = customers.filter(c => 
      (c.name || "").toLowerCase().includes(search) || 
      (c.phone || "").toLowerCase().includes(search) ||
      (c.city || "").toLowerCase().includes(search)
    );
  }

  if (tierFilter !== "all") {
    customers = customers.filter(c => c.tier === tierFilter);
  }

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--admin-text-muted); padding: 2.5rem;">No se encontraron clientes.</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => {
    const cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(c.name)}%2C%20te%20escribimos%20desde%20Ez%C3%BCst%20Joyas` : '#';

    return `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--admin-text-main);">${c.name}</div>
          <div style="font-size: 0.72rem; color: var(--admin-text-muted);">${c.email || ''}</div>
        </td>
        <td>
          <a href="${waLink}" target="_blank" style="color: var(--admin-success); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${c.phone || 'Sin WhatsApp'}
          </a>
        </td>
        <td>${c.city || 'Arroyito, Cba'}</td>
        <td><span class="status-pill active">${c.tier || 'Cliente'}</span></td>
        <td><strong>${c.ordersCount || 0}</strong></td>
        <td><strong style="color: var(--admin-gold-light);">${formatARS(c.totalSpent)}</strong></td>
        <td>${formatDate(c.lastOrderDate)}</td>
        <td style="text-align: right;">
          <button class="btn-secondary btn-sm" onclick="openCustomerModal('${c.id}')">Editar</button>
        </td>
      </tr>
    `;
  }).join("");
}

function openCustomerModal(customerId = null) {
  const form = document.getElementById("customerForm");
  const modalTitle = document.getElementById("modalCustomerTitle");
  if (!form) return;
  form.reset();

  if (customerId && window.EzustDB) {
    const cust = window.EzustDB.getCustomers().find(c => c.id === customerId);
    if (cust) {
      modalTitle.textContent = "Editar Cliente";
      document.getElementById("custId").value = cust.id;
      document.getElementById("custName").value = cust.name;
      document.getElementById("custPhone").value = cust.phone || "";
      document.getElementById("custEmail").value = cust.email || "";
      document.getElementById("custCity").value = cust.city || "";
      document.getElementById("custTier").value = cust.tier || "Cliente Nuevo";
      document.getElementById("custNotes").value = cust.notes || "";
      openModal("modalCustomer");
      return;
    }
  }

  modalTitle.textContent = "Nuevo Cliente";
  document.getElementById("custId").value = "";
  openModal("modalCustomer");
}

function handleCustomerSubmit(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const id = document.getElementById("custId").value;
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const tier = document.getElementById("custTier").value;
  const notes = document.getElementById("custNotes").value.trim();

  const saved = window.EzustDB.saveCustomer({
    id: id || undefined,
    name,
    phone,
    email,
    city,
    tier,
    notes
  });

  if (saved) {
    showToast(`Cliente "${saved.name}" guardado.`);
    closeModal("modalCustomer");
    renderCustomersTable();
    updatePosCustomerSelect();
  }
}

// ============================================================================
// 8. REPORTS & EXPORTS MODULE (REAL CSV DOWNLOADS WITH UTF-8 BOM)
// ============================================================================
function updateReportsMetrics() {
  if (!window.EzustDB) return;

  const period = document.getElementById("reportsPeriodSelect")?.value || "30";
  const category = document.getElementById("reportsCategorySelect")?.value || "all";
  const payment = document.getElementById("reportsPaymentSelect")?.value || "all";

  let sales = window.EzustDB.getSales().filter(s => s.status !== "Reembolsado");
  const products = window.EzustDB.getProducts();

  // Period Filter
  if (period === "today") {
    const today = new Date().toISOString().split("T")[0];
    sales = sales.filter(s => s.date === today);
  } else if (period !== "all") {
    const days = Number(period) || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    sales = sales.filter(s => s.date >= cutoffStr);
  }

  // Payment Filter
  if (payment !== "all") {
    sales = sales.filter(s => (s.paymentMethod || "").toLowerCase().includes(payment.toLowerCase()));
  }

  // Category Filter
  if (category !== "all") {
    sales = sales.filter(s => {
      return s.items.some(it => {
        const prod = products.find(p => p.id === it.productId);
        return prod && (prod.category || "").toLowerCase() === category.toLowerCase();
      });
    });
  }

  const revenue = sales.reduce((sum, s) => sum + s.total, 0);
  const cost = sales.reduce((sum, s) => sum + s.totalCost, 0);
  const profit = revenue - cost;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
  const units = sales.reduce((sum, s) => sum + s.items.reduce((iSum, it) => iSum + it.quantity, 0), 0);
  const avgTicket = sales.length > 0 ? Math.round(revenue / sales.length) : 0;

  document.getElementById("repFilteredRevenue").textContent = formatARS(revenue);
  document.getElementById("repFilteredOrdersCount").textContent = `${sales.length} órdenes en el período`;
  document.getElementById("repFilteredUnits").textContent = `${units} u.`;
  document.getElementById("repFilteredAvgTicket").textContent = formatARS(avgTicket);
  document.getElementById("repFilteredMargin").textContent = formatARS(profit);
  document.getElementById("repFilteredMarginPercent").textContent = `${margin}%`;
}

// Download helper with UTF-8 BOM so Excel opens accented Spanish cleanly
function triggerCsvDownload(csvContent, filename) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Descargando archivo "${filename}" para Excel`);
}

function exportSalesToCSV() {
  if (!window.EzustDB) return;
  const sales = window.EzustDB.getSales();

  const headers = [
    "Nro Orden",
    "Fecha",
    "Hora",
    "Cliente",
    "Telefono",
    "Articulos",
    "Cantidad Piezas",
    "Subtotal ARS",
    "Descuento ARS",
    "Total Cobrado ARS",
    "Costo Mercaderia ARS",
    "Utilidad Bruta ARS",
    "Margen %",
    "Medio de Pago",
    "Estado",
    "Vendedor"
  ];

  const rows = sales.map(s => {
    const totalQty = s.items.reduce((sum, it) => sum + it.quantity, 0);
    const itemsStr = s.items.map(it => `${it.quantity}x ${it.name} (${it.sku})`).join(" | ");

    return [
      s.id,
      s.date,
      s.time || "",
      `"${(s.customerName || '').replace(/"/g, '""')}"`,
      `"${s.customerPhone || ''}"`,
      `"${itemsStr.replace(/"/g, '""')}"`,
      totalQty,
      s.subtotal,
      s.discount,
      s.total,
      s.totalCost,
      s.profit,
      `${s.marginPercent}%`,
      `"${s.paymentMethod}"`,
      s.status,
      `"${s.salesperson || ''}"`
    ].join(";");
  });

  const csv = [headers.join(";"), ...rows].join("\r\n");
  const dateStr = new Date().toISOString().split("T")[0];
  triggerCsvDownload(csv, `ezust_ventas_${dateStr}.csv`);
}

function exportInventoryToCSV() {
  if (!window.EzustDB) return;
  const products = window.EzustDB.getProducts();

  const headers = [
    "SKU",
    "Nombre Joya",
    "Categoria",
    "Stock Actual",
    "Stock Minimo Alerta",
    "Costo Taller ARS",
    "Precio Venta ARS",
    "Valuacion Costo ARS",
    "Valuacion Venta ARS",
    "Margen %",
    "Estado Tienda",
    "Metales / Gemas"
  ];

  const rows = products.map(p => {
    const stock = p.stock || 0;
    const cost = p.costARS || 0;
    const price = p.priceARS || 0;
    const profit = price - cost;
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0;
    const metals = Array.isArray(p.metals) ? p.metals.join(", ") : (p.metals || "");

    return [
      p.sku,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      stock,
      p.minStock || 3,
      cost,
      price,
      cost * stock,
      price * stock,
      `${margin}%`,
      p.active ? "Activo" : "Pausado",
      `"${metals.replace(/"/g, '""')}"`
    ].join(";");
  });

  const csv = [headers.join(";"), ...rows].join("\r\n");
  const dateStr = new Date().toISOString().split("T")[0];
  triggerCsvDownload(csv, `ezust_inventario_${dateStr}.csv`);
}

function exportFinancesToCSV() {
  if (!window.EzustDB) return;
  const summary = window.EzustDB.getFinancialSummary(30);
  const expenses = window.EzustDB.getExpenses();

  let csv = "ESTADO DE RESULTADOS & BALANCE FINANCIERO - EZUST JOYAS\r\n";
  csv += `Generado el:;${new Date().toLocaleString("es-AR")}\r\n\r\n`;

  csv += "Concepto;Monto ARS;Detalle / %\r\n";
  csv += `Ingresos por Ventas Cobradas;${summary.totalRevenue};100%\r\n`;
  csv += `Costo de Mercaderia Vendida (CMV);${summary.totalCOGS};${Math.round((summary.totalCOGS / (summary.totalRevenue || 1)) * 100)}%\r\n`;
  csv += `Resultado Bruto;${summary.grossProfit};${summary.grossMarginPercent}%\r\n`;
  csv += `Gastos Operativos Showroom & Insumos;${summary.totalOperatingExpenses};${Math.round((summary.totalOperatingExpenses / (summary.totalRevenue || 1)) * 100)}%\r\n`;
  csv += `UTILIDAD NETA ESTIMADA (30d);${summary.netProfit};${summary.netMarginPercent}%\r\n\r\n`;

  csv += "DETALLE DE GASTOS OPERATIVOS\r\n";
  csv += "Fecha;Categoria;Concepto;Destinatario;Medio Pago;Monto ARS\r\n";

  expenses.forEach(e => {
    csv += `${e.date};"${e.category}";"${(e.concept || '').replace(/"/g, '""')}";"${(e.recipient || '').replace(/"/g, '""')}";"${e.paymentMethod}";${e.amount}\r\n`;
  });

  const dateStr = new Date().toISOString().split("T")[0];
  triggerCsvDownload(csv, `ezust_balance_finanzas_${dateStr}.csv`);
}

function exportQuickReport() {
  exportSalesToCSV();
}

// ============================================================================
// 9. SETTINGS, SECURITY, AUDIT & BACKUP
// ============================================================================
function renderSettingsAndAudit() {
  if (!window.EzustDB) return;
  const settings = window.EzustDB.getSettings();
  const session = window.EzustDB.getSession();

  if (document.getElementById("cfgStoreName")) document.getElementById("cfgStoreName").value = settings.storeName || "EZÜST JOYAS";
  if (document.getElementById("cfgSubtitle")) document.getElementById("cfgSubtitle").value = settings.subtitle || "Atelier de Joyas en Plata 925 & Oro 18K";
  if (document.getElementById("cfgCuit")) document.getElementById("cfgCuit").value = settings.cuit || "27-39281742-4";
  if (document.getElementById("cfgAddress")) document.getElementById("cfgAddress").value = settings.address || "Mariano Moreno 450, Arroyito, Córdoba";
  if (document.getElementById("cfgPhone")) document.getElementById("cfgPhone").value = settings.phone || "+54 9 3576 41-5867";
  if (document.getElementById("cfgReceiptFooter")) document.getElementById("cfgReceiptFooter").value = settings.receiptFooter || "¡Gracias por elegir Ezüst Joyas!";

  // Session
  if (document.getElementById("sessionRoleSelect")) {
    document.getElementById("sessionRoleSelect").value = session.role || "Administrador";
  }

  // Audit Logs
  const tbody = document.getElementById("auditLogTableBody");
  if (tbody) {
    const logs = window.EzustDB.getAuditLogs();
    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">No hay registros de auditoría.</td></tr>`;
    } else {
      tbody.innerHTML = logs.map(l => `
        <tr>
          <td><span style="font-family: monospace; font-size: 0.76rem; color: var(--admin-text-muted);">${l.timestamp}</span></td>
          <td><strong>${l.user}</strong></td>
          <td><span class="status-pill active">${l.action}</span></td>
          <td style="color: var(--admin-text-main); font-size: 0.84rem;">${l.details}</td>
        </tr>
      `).join("");
    }
  }
}

function saveStoreSettings(e) {
  e.preventDefault();
  if (!window.EzustDB) return;

  const storeName = document.getElementById("cfgStoreName").value.trim();
  const subtitle = document.getElementById("cfgSubtitle").value.trim();
  const cuit = document.getElementById("cfgCuit").value.trim();
  const address = document.getElementById("cfgAddress").value.trim();
  const phone = document.getElementById("cfgPhone").value.trim();
  const receiptFooter = document.getElementById("cfgReceiptFooter").value.trim();

  window.EzustDB.saveSettings({
    storeName,
    subtitle,
    cuit,
    address,
    phone,
    receiptFooter
  });

  showToast("Datos y parámetros del Atelier guardados.");
}

function handleSessionRoleChange(role) {
  if (!window.EzustDB) return;

  const names = {
    Administrador: "Martín Gallará",
    Vendedora: "Valeria",
    Contador: "Estudio Contable"
  };

  const user = names[role] || "Usuario";
  window.EzustDB.setSession(user, role);

  const sidebarUser = document.getElementById("sidebarUserName");
  const sidebarRole = document.getElementById("sidebarUserRole");
  const sidebarAvatar = document.getElementById("sidebarAvatar");

  if (sidebarUser) sidebarUser.textContent = user;
  if (sidebarRole) sidebarRole.textContent = role;
  if (sidebarAvatar) sidebarAvatar.textContent = user.substring(0, 2).toUpperCase();

  showToast(`Sesión cambiada a ${user} (${role})`);
  renderSettingsAndAudit();
}

function downloadDatabaseBackup() {
  if (!window.EzustDB) return;
  const jsonStr = window.EzustDB.exportDatabase();
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `ezust_joyas_backup_${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Copia de seguridad descargada exitosamente.");
}

function handleRestoreBackupFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const content = event.target.result;
    if (!window.EzustDB) return;

    const res = window.EzustDB.importDatabase(content);
    if (res.success) {
      alert("Base de datos restaurada correctamente. La página se actualizará ahora.");
      location.reload();
    } else {
      alert("Error al restaurar: " + (res.error || "Archivo no compatible."));
    }
  };
  reader.readAsText(file);
}

function confirmResetDatabase() {
  const confirmation = confirm("ADVERTENCIA: Esta acción borrará todas las ventas, productos modificados y registros, reestableciendo los datos originales de fábrica. ¿Desea continuar?");
  if (!confirmation) return;

  if (window.EzustDB) {
    window.EzustDB.resetToFactory();
    alert("Datos de fábrica restablecidos.");
    location.reload();
  }
}

// ============================================================================
// INITIALIZATION ON PAGE LOAD
// ============================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Update Topbar and Session
  if (window.EzustDB) {
    const session = window.EzustDB.getSession();
    const sidebarUser = document.getElementById("sidebarUserName");
    const sidebarRole = document.getElementById("sidebarUserRole");
    const sidebarAvatar = document.getElementById("sidebarAvatar");

    if (sidebarUser) sidebarUser.textContent = session.user;
    if (sidebarRole) sidebarRole.textContent = session.role;
    if (sidebarAvatar) sidebarAvatar.textContent = session.user.substring(0, 2).toUpperCase();
  }

  // Initial View
  switchView("dashboard");
});
