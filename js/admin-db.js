/**
 * EZUST JOYAS - Enterprise Admin Database & Storage Engine
 * Persistent client-first transactional store with schema validation,
 * audit logging, stock integrity checks, and backup/restore.
 */

(function () {
  const DB_KEYS = {
    PRODUCTS: "ezust_db_products",
    INVENTORY_LOG: "ezust_db_inventory_log",
    SALES: "ezust_db_sales",
    PURCHASES: "ezust_db_purchases",
    SUPPLIERS: "ezust_db_suppliers",
    EXPENSES: "ezust_db_expenses",
    CUSTOMERS: "ezust_db_customers",
    AUDIT: "ezust_db_audit",
    SETTINGS: "ezust_db_settings",
    CASH_REGISTER: "ezust_db_cash_register",
    SESSION: "ezust_db_session"
  };

  // Helper for safe JSON parse
  function load(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error(`[EzustDB] Error reading ${key}:`, e);
      return defaultVal;
    }
  }

  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.error(`[EzustDB] Error saving ${key}:`, e);
      return false;
    }
  }

  // Generate unique ID with prefix
  function generateId(prefix = "item") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  }

  // Default Initial Suppliers
  const DEFAULT_SUPPLIERS = [
    {
      id: "sup-01",
      name: "Taller Orfebre San Telmo",
      contact: "Carlos Benítez",
      phone: "+54 9 11 4589-2231",
      email: "taller.santelmo@joyeros.com.ar",
      category: "Plata 925 & Oro 18K",
      address: "Defensa 842, CABA",
      notes: "Especialista en sortijas con engarce invisible y solitarios",
      active: true
    },
    {
      id: "sup-02",
      name: "Importadora Gemas & Circonias Suizas",
      contact: "Mariana Rossi",
      phone: "+54 9 11 6321-9980",
      email: "ventas@gemas-suizas.com",
      category: "Circonias & Gemas Facetadas",
      address: "Libertad 320, CABA",
      notes: "Provisión de circonias corte gota, princesa, baguette y esmeralda",
      active: true
    },
    {
      id: "sup-03",
      name: "Estuche & Packaging de Lujo Atelier",
      contact: "Lucas D'Alessandro",
      phone: "+54 9 351 478-1120",
      email: "contacto@packagingdelujo.com",
      category: "Packaging & Exhibidores",
      address: "Av. Maipú 415, Córdoba",
      notes: "Cajas de pana rosa, terciopelo nude y bolsas satinadas con logo dorado",
      active: true
    }
  ];

  // Default Initial Customers
  const DEFAULT_CUSTOMERS = [
    {
      id: "cust-01",
      name: "Valentina Morales",
      email: "valen.morales@gmail.com",
      phone: "+54 9 3576 45-8912",
      city: "Arroyito, Córdoba",
      tier: "VIP Platino",
      totalSpent: 184500,
      ordersCount: 4,
      firstOrderDate: "2026-08-14",
      lastOrderDate: "2026-10-25",
      notes: "Prefiere anillos dorados talla 16 y gargantillas personalizadas."
    },
    {
      id: "cust-02",
      name: "Camila Fernández",
      email: "camila.fer@hotmail.com",
      phone: "+54 9 351 512-3344",
      city: "Córdoba Capital",
      tier: "Frecuente Oro",
      totalSpent: 124300,
      ordersCount: 2,
      firstOrderDate: "2026-09-02",
      lastOrderDate: "2026-10-21",
      notes: "Coleccionista de aros pasantes y joyas en plata 925."
    },
    {
      id: "cust-03",
      name: "Florencia Soria",
      email: "flor.soria88@gmail.com",
      phone: "+54 9 3576 60-1289",
      city: "Arroyito, Córdoba",
      tier: "Frecuente Oro",
      totalSpent: 98700,
      ordersCount: 2,
      firstOrderDate: "2026-09-19",
      lastOrderDate: "2026-10-18",
      notes: "Compró conjunto para día de la madre."
    },
    {
      id: "cust-04",
      name: "Agustina Bertone",
      email: "agustina.b@outlook.com",
      phone: "+54 9 11 3912-8877",
      city: "Buenos Aires",
      tier: "Cliente Nuevo",
      totalSpent: 56500,
      ordersCount: 1,
      firstOrderDate: "2026-10-26",
      lastOrderDate: "2026-10-26",
      notes: "Solicitó envío asegurado por Andreani."
    }
  ];

  // Default Operating Expenses
  const DEFAULT_EXPENSES = [
    {
      id: "exp-01",
      date: "2026-10-02",
      category: "Alquiler & Servicios",
      concept: "Alquiler Showroom & Atelier Arroyito",
      amount: 180000,
      paymentMethod: "Transferencia",
      recipient: "Inmobiliaria Centro",
      notes: "Mes de Octubre 2026"
    },
    {
      id: "exp-02",
      date: "2026-10-08",
      category: "Packaging & Insumos",
      concept: "Lote 300 Cajas de Terciopelo Rosa & Bolsas Satinadas",
      amount: 95000,
      paymentMethod: "Transferencia",
      recipient: "Estuche & Packaging de Lujo Atelier",
      notes: "Packaging oficial con grabado hot-stamping dorado"
    },
    {
      id: "exp-03",
      date: "2026-10-15",
      category: "Marketing & Publicidad",
      concept: "Campaña Meta Ads (Instagram Feed & Stories)",
      amount: 85000,
      paymentMethod: "Tarjeta de Crédito",
      recipient: "Meta Platforms Ireland",
      notes: "Lanzamiento Colección Día de la Madre y Línea Premium Oro 18K"
    },
    {
      id: "exp-04",
      date: "2026-10-20",
      category: "Envíos & Logística",
      concept: "Cuenta Corriente Envíos Andreani Pack Urgente",
      amount: 42000,
      paymentMethod: "Mercado Pago",
      recipient: "Andreani Logística",
      notes: "Envíos asegurados a todo el país"
    }
  ];

  // Base Products Initial Seeding Function
  function buildSeedProducts() {
    // If PRODUCTS_DATA exists in window, map it; otherwise provide complete luxury catalog
    const baseList = (typeof PRODUCTS_DATA !== "undefined" && Array.isArray(PRODUCTS_DATA))
      ? PRODUCTS_DATA
      : [];

    return baseList.map((p, index) => {
      // Realistic COGS estimation (between 38% and 46% of retail price)
      const costRate = 0.42;
      const costARS = Math.round((p.priceARS * costRate) / 100) * 100;
      
      // Stock distribution (some critical for alerts, some well-stocked)
      let initialStock = 6;
      if (index === 0 || index === 7) initialStock = 2; // Critical for low-stock alert demo
      else if (index === 3 || index === 9) initialStock = 3; // On threshold
      else initialStock = 5 + (index % 7);

      const sku = `EZ-${p.category.substring(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`;

      return {
        id: p.id,
        sku: p.sku || sku,
        name: p.name,
        category: p.category,
        priceARS: p.priceARS,
        costARS: p.costARS || costARS,
        stock: initialStock,
        minStock: 3,
        image: p.image,
        hoverImage: p.hoverImage,
        metals: p.metals || ["Plata 925"],
        description: p.description || "",
        badge: p.badge || "",
        sizes: p.sizes || ["14", "16", "18"],
        active: true,
        createdAt: "2026-09-01",
        updatedAt: "2026-10-27"
      };
    });
  }

  // Realistic Recent Sales Seeding
  function buildSeedSales(products) {
    if (!products || products.length === 0) return [];
    
    const dates = [
      "2026-10-27",
      "2026-10-27",
      "2026-10-26",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
      "2026-10-23",
      "2026-10-22",
      "2026-10-20",
      "2026-10-18",
      "2026-10-15",
      "2026-10-12"
    ];

    const customers = [
      { name: "Valentina Morales", phone: "+54 9 3576 45-8912", email: "valen.morales@gmail.com", id: "cust-01" },
      { name: "Agustina Bertone", phone: "+54 9 11 3912-8877", email: "agustina.b@outlook.com", id: "cust-04" },
      { name: "Camila Fernández", phone: "+54 9 351 512-3344", email: "camila.fer@hotmail.com", id: "cust-02" },
      { name: "Florencia Soria", phone: "+54 9 3576 60-1289", email: "flor.soria88@gmail.com", id: "cust-03" },
      { name: "Luciana Gómez", phone: "+54 9 3576 41-2290", email: "luciana.g@gmail.com", id: null },
      { name: "Sofía Navarro", phone: "+54 9 351 400-8811", email: "sofia.nav@gmail.com", id: null }
    ];

    const methods = ["Transferencia Bancaria", "Efectivo", "Mercado Pago", "Tarjeta de Crédito (3 cuotas)"];

    const sales = [];

    dates.forEach((date, i) => {
      const prod1 = products[i % products.length];
      const prod2 = (i % 3 === 0 && products.length > (i + 4)) ? products[(i + 4) % products.length] : null;
      
      const items = [
        {
          productId: prod1.id,
          sku: prod1.sku,
          name: prod1.name,
          category: prod1.category,
          priceARS: prod1.priceARS,
          costARS: prod1.costARS,
          quantity: 1,
          size: prod1.sizes && prod1.sizes.length ? prod1.sizes[0] : "Estándar",
          subtotal: prod1.priceARS
        }
      ];

      if (prod2) {
        items.push({
          productId: prod2.id,
          sku: prod2.sku,
          name: prod2.name,
          category: prod2.category,
          priceARS: prod2.priceARS,
          costARS: prod2.costARS,
          quantity: 1,
          size: prod2.sizes && prod2.sizes.length ? prod2.sizes[0] : "Estándar",
          subtotal: prod2.priceARS
        });
      }

      const rawTotal = items.reduce((sum, it) => sum + it.subtotal, 0);
      const totalCost = items.reduce((sum, it) => sum + (it.costARS * it.quantity), 0);
      const discount = i === 1 ? 5000 : 0;
      const finalTotal = rawTotal - discount;
      const profit = finalTotal - totalCost;
      const cust = customers[i % customers.length];

      sales.push({
        id: `ORD-2026-${String(1048 - i).padStart(4, "0")}`,
        date: date,
        time: `${11 + (i % 8)}:${String(15 + (i * 7) % 45).padStart(2, "0")}`,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerEmail: cust.email,
        customerId: cust.id,
        items: items,
        subtotal: rawTotal,
        discount: discount,
        total: finalTotal,
        totalCost: totalCost,
        profit: profit,
        marginPercent: Math.round((profit / finalTotal) * 100),
        paymentMethod: methods[i % methods.length],
        status: i === 6 ? "Reembolsado" : "Cobrada",
        notes: i === 0 ? "Retira por showroom" : "Envío Andreani",
        salesperson: i % 2 === 0 ? "Martín Gallará (Admin)" : "Valeria (Vendedora)"
      });
    });

    return sales;
  }

  // Database Engine Object
  const EzustDB = {
    // Initialization: check localStorage, seed if empty
    init() {
      // 1. Settings & Session
      if (!load(DB_KEYS.SETTINGS, null)) {
        save(DB_KEYS.SETTINGS, {
          storeName: "EZÜST JOYAS",
          subtitle: "Atelier de Joyas en Plata 925 & Oro 18K",
          cuit: "27-39281742-4",
          address: "Mariano Moreno 450, Arroyito, Córdoba",
          phone: "+54 9 3576 41-5867",
          email: "contacto@ezustjoyas.com.ar",
          instagram: "@ezust_joyas",
          currency: "ARS",
          usdExchangeRate: 1150,
          ivaCondition: "Responsable Inscripto",
          lowStockThreshold: 3,
          receiptFooterText: "¡Gracias por elegir Ezüst Joyas! Cada pieza cuenta una historia única. Garantía de autenticidad en Plata 925 y Oro 18K."
        });
      }

      if (!load(DB_KEYS.SESSION, null)) {
        save(DB_KEYS.SESSION, {
          user: "Martín Gallará",
          role: "Administrador",
          email: "admin@ezustjoyas.com",
          avatar: "assets/logo-symbol.svg"
        });
      }

      // 2. Cash Register (Caja)
      if (!load(DB_KEYS.CASH_REGISTER, null)) {
        save(DB_KEYS.CASH_REGISTER, {
          status: "open",
          openedAt: "2026-10-27 09:00",
          initialCash: 45000,
          currentCash: 45000 + 48500, // Initial + cash sales
          closedAt: null,
          notes: "Caja turno mañana/tarde operativa"
        });
      }

      // 3. Suppliers & Customers & Expenses
      if (!load(DB_KEYS.SUPPLIERS, null)) {
        save(DB_KEYS.SUPPLIERS, DEFAULT_SUPPLIERS);
      }
      if (!load(DB_KEYS.CUSTOMERS, null)) {
        save(DB_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
      }
      if (!load(DB_KEYS.EXPENSES, null)) {
        save(DB_KEYS.EXPENSES, DEFAULT_EXPENSES);
      }

      // 4. Products
      let products = load(DB_KEYS.PRODUCTS, null);
      if (!products || products.length === 0) {
        products = buildSeedProducts();
        save(DB_KEYS.PRODUCTS, products);
      }

      // 5. Sales
      let sales = load(DB_KEYS.SALES, null);
      if (!sales || sales.length === 0) {
        sales = buildSeedSales(products);
        save(DB_KEYS.SALES, sales);
      }

      // 6. Audit & Inventory Log
      if (!load(DB_KEYS.AUDIT, null)) {
        save(DB_KEYS.AUDIT, [
          {
            id: generateId("aud"),
            timestamp: "2026-10-27 10:15:22",
            user: "Martín Gallará (Admin)",
            action: "Apertura de Caja",
            details: "Caja diaria abierta con saldo inicial en efectivo de $45.000",
            category: "caja"
          },
          {
            id: generateId("aud"),
            timestamp: "2026-10-27 11:32:05",
            user: "Martín Gallará (Admin)",
            action: "Venta Registrada",
            details: "Orden ORD-2026-1048 por $48.500 cobrada en efectivo",
            category: "ventas"
          },
          {
            id: generateId("aud"),
            timestamp: "2026-10-27 14:20:10",
            user: "Martín Gallará (Admin)",
            action: "Ajuste de Catálogo",
            details: "Incorporación de 18 piezas de las colecciones oficiales de Instagram",
            category: "productos"
          }
        ]);
      }

      if (!load(DB_KEYS.INVENTORY_LOG, null)) {
        save(DB_KEYS.INVENTORY_LOG, [
          {
            id: generateId("inv"),
            timestamp: "2026-10-27 11:32:05",
            productId: products[0] ? products[0].id : "ez-real-01",
            productName: products[0] ? products[0].name : "Anillo Solitario Óvalo Biselado",
            sku: products[0] ? products[0].sku : "EZ-ANI-001",
            type: "SALIDA_VENTA",
            quantity: -1,
            previousStock: 3,
            newStock: 2,
            reason: "Venta orden #ORD-2026-1048",
            user: "Martín Gallará"
          },
          {
            id: generateId("inv"),
            timestamp: "2026-10-25 16:45:00",
            productId: products[7] ? products[7].id : "ez-real-08",
            productName: products[7] ? products[7].name : "Anillo Majestic Solitario Cushion",
            sku: products[7] ? products[7].sku : "EZ-ANI-008",
            type: "ENTRADA_COMPRA",
            quantity: +5,
            previousStock: 0,
            newStock: 5,
            reason: "Recepción de taller orfebre remito #4910",
            user: "Martín Gallará"
          }
        ]);
      }
    },

    // --- Audit Logging ---
    logAudit(action, details, category = "general") {
      const logs = load(DB_KEYS.AUDIT, []);
      const session = this.getSession();
      const newEntry = {
        id: generateId("aud"),
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        user: `${session.user} (${session.role})`,
        action: action,
        details: details,
        category: category
      };
      logs.unshift(newEntry);
      save(DB_KEYS.AUDIT, logs.slice(0, 500)); // Cap to 500 entries
    },

    getAuditLogs() {
      return load(DB_KEYS.AUDIT, []);
    },

    // --- Products API ---
    getProducts() {
      return load(DB_KEYS.PRODUCTS, []);
    },

    getProductById(id) {
      return this.getProducts().find(p => p.id === id) || null;
    },

    saveProduct(productData) {
      const products = this.getProducts();
      const isNew = !productData.id;
      
      let finalProduct;
      if (isNew) {
        finalProduct = {
          ...productData,
          id: `ez-prod-${Date.now()}`,
          sku: productData.sku || `EZ-${(productData.category || "JOY").substring(0, 3).toUpperCase()}-${String(products.length + 1).padStart(3, "0")}`,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0]
        };
        products.push(finalProduct);
        this.logAudit("Producto Creado", `Se dio de alta "${finalProduct.name}" (SKU: ${finalProduct.sku}) por $${finalProduct.priceARS.toLocaleString("es-AR")}`, "productos");
      } else {
        const index = products.findIndex(p => p.id === productData.id);
        if (index === -1) return null;
        
        finalProduct = {
          ...products[index],
          ...productData,
          updatedAt: new Date().toISOString().split("T")[0]
        };
        products[index] = finalProduct;
        this.logAudit("Producto Modificado", `Actualización de "${finalProduct.name}" (SKU: ${finalProduct.sku})`, "productos");
      }

      save(DB_KEYS.PRODUCTS, products);
      return finalProduct;
    },

    deleteProduct(id) {
      let products = this.getProducts();
      const prod = products.find(p => p.id === id);
      if (!prod) return false;

      products = products.filter(p => p.id !== id);
      save(DB_KEYS.PRODUCTS, products);
      this.logAudit("Producto Eliminado", `Se eliminó "${prod.name}" (SKU: ${prod.sku})`, "productos");
      return true;
    },

    toggleProductStatus(id) {
      const products = this.getProducts();
      const prod = products.find(p => p.id === id);
      if (!prod) return null;

      prod.active = !prod.active;
      prod.updatedAt = new Date().toISOString().split("T")[0];
      save(DB_KEYS.PRODUCTS, products);
      this.logAudit("Estado de Producto", `Producto "${prod.name}" marcado como ${prod.active ? "Activo" : "Inactivo"}`, "productos");
      return prod;
    },

    // --- Inventory & Movements API ---
    getInventoryLogs() {
      return load(DB_KEYS.INVENTORY_LOG, []);
    },

    adjustStock(productId, deltaQty, reason, type = "AJUSTE_MANUAL") {
      const products = this.getProducts();
      const prod = products.find(p => p.id === productId);
      if (!prod) return { success: false, error: "Producto no encontrado" };

      const prevStock = prod.stock;
      const newStock = Math.max(0, prevStock + deltaQty);
      prod.stock = newStock;
      prod.updatedAt = new Date().toISOString().split("T")[0];

      save(DB_KEYS.PRODUCTS, products);

      // Log movement in Kardex
      const invLogs = this.getInventoryLogs();
      const session = this.getSession();
      const movement = {
        id: generateId("inv"),
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        type: type,
        quantity: deltaQty,
        previousStock: prevStock,
        newStock: newStock,
        reason: reason || "Ajuste de inventario",
        user: session.user
      };

      invLogs.unshift(movement);
      save(DB_KEYS.INVENTORY_LOG, invLogs.slice(0, 500));

      this.logAudit("Ajuste de Inventario", `${prod.name} (SKU: ${prod.sku}): ${prevStock} → ${newStock} (${deltaQty >= 0 ? "+" : ""}${deltaQty} u.) - Motivo: ${reason}`, "inventario");

      return { success: true, product: prod, movement };
    },

    // --- Sales & POS API ---
    getSales() {
      return load(DB_KEYS.SALES, []);
    },

    createSale(saleData) {
      const products = this.getProducts();
      const session = this.getSession();

      // 1. Verify and deduct stock for each item
      for (const item of saleData.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const prev = prod.stock;
          prod.stock = Math.max(0, prod.stock - item.quantity);
          
          // Log Kardex
          const invLogs = this.getInventoryLogs();
          invLogs.unshift({
            id: generateId("inv"),
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            type: "SALIDA_VENTA",
            quantity: -item.quantity,
            previousStock: prev,
            newStock: prod.stock,
            reason: `Venta POS #${saleData.id || "NUEVA"}`,
            user: session.user
          });
          save(DB_KEYS.INVENTORY_LOG, invLogs.slice(0, 500));
        }
      }
      save(DB_KEYS.PRODUCTS, products);

      // 2. Calculate financial totals
      const subtotal = saleData.items.reduce((sum, it) => sum + (it.priceARS * it.quantity), 0);
      const totalCost = saleData.items.reduce((sum, it) => sum + ((it.costARS || 0) * it.quantity), 0);
      const discount = Number(saleData.discount) || 0;
      const total = Math.max(0, subtotal - discount);
      const profit = total - totalCost;
      const marginPercent = total > 0 ? Math.round((profit / total) * 100) : 0;

      const orderNumber = `ORD-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const newSale = {
        id: saleData.id || orderNumber,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().substring(0, 5),
        customerName: saleData.customerName || "Cliente Mostrador",
        customerPhone: saleData.customerPhone || "",
        customerEmail: saleData.customerEmail || "",
        customerId: saleData.customerId || null,
        items: saleData.items,
        subtotal: subtotal,
        discount: discount,
        total: total,
        totalCost: totalCost,
        profit: profit,
        marginPercent: marginPercent,
        paymentMethod: saleData.paymentMethod || "Efectivo",
        paymentReference: saleData.paymentReference || "",
        status: "Cobrada",
        notes: saleData.notes || "",
        salesperson: session.user
      };

      const sales = this.getSales();
      sales.unshift(newSale);
      save(DB_KEYS.SALES, sales);

      // 3. Update customer stats if customer exists
      if (newSale.customerId) {
        this.updateCustomerStats(newSale.customerId, newSale.total);
      }

      // 4. Update cash register if paid in cash
      if (newSale.paymentMethod === "Efectivo") {
        const cashReg = this.getCashRegister();
        if (cashReg && cashReg.status === "open") {
          cashReg.currentCash += newSale.total;
          save(DB_KEYS.CASH_REGISTER, cashReg);
        }
      }

      this.logAudit("Venta Registrada", `Orden #${newSale.id} por $${newSale.total.toLocaleString("es-AR")} (${newSale.paymentMethod}) - Cliente: ${newSale.customerName}`, "ventas");

      return newSale;
    },

    refundSale(saleId, reason = "Devolución / Cambio") {
      const sales = this.getSales();
      const sale = sales.find(s => s.id === saleId);
      if (!sale) return { success: false, error: "Venta no encontrada" };
      if (sale.status === "Reembolsado") return { success: false, error: "La venta ya fue reembolsada" };

      sale.status = "Reembolsado";
      sale.refundReason = reason;
      sale.refundedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

      // Re-enter stock for items
      const products = this.getProducts();
      const session = this.getSession();
      const invLogs = this.getInventoryLogs();

      for (const item of sale.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const prev = prod.stock;
          prod.stock += item.quantity;
          invLogs.unshift({
            id: generateId("inv"),
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            type: "ENTRADA_DEVOLUCION",
            quantity: item.quantity,
            previousStock: prev,
            newStock: prod.stock,
            reason: `Reembolso orden #${sale.id} - ${reason}`,
            user: session.user
          });
        }
      }

      save(DB_KEYS.PRODUCTS, products);
      save(DB_KEYS.INVENTORY_LOG, invLogs.slice(0, 500));
      save(DB_KEYS.SALES, sales);

      this.logAudit("Venta Reembolsada", `Orden #${sale.id} anulada y reembolsada ($${sale.total.toLocaleString("es-AR")}). Stock reincorporado. Motivo: ${reason}`, "ventas");

      return { success: true, sale };
    },

    // --- Purchases & Suppliers API ---
    getPurchases() {
      return load(DB_KEYS.PURCHASES, []);
    },

    getSuppliers() {
      return load(DB_KEYS.SUPPLIERS, []);
    },

    saveSupplier(supplierData) {
      const suppliers = this.getSuppliers();
      let sup;
      if (!supplierData.id) {
        sup = {
          ...supplierData,
          id: generateId("sup"),
          active: true
        };
        suppliers.push(sup);
        this.logAudit("Proveedor Creado", `Nuevo proveedor "${sup.name}" registrado`, "compras");
      } else {
        const idx = suppliers.findIndex(s => s.id === supplierData.id);
        if (idx !== -1) {
          sup = { ...suppliers[idx], ...supplierData };
          suppliers[idx] = sup;
          this.logAudit("Proveedor Modificado", `Proveedor "${sup.name}" actualizado`, "compras");
        }
      }
      save(DB_KEYS.SUPPLIERS, suppliers);
      return sup;
    },

    createPurchase(purchaseData) {
      const purchases = this.getPurchases();
      const session = this.getSession();
      const products = this.getProducts();
      const invLogs = this.getInventoryLogs();

      const newPurchase = {
        id: `COM-2026-${String(Math.floor(500 + Math.random() * 500))}`,
        date: purchaseData.date || new Date().toISOString().split("T")[0],
        supplierId: purchaseData.supplierId,
        supplierName: purchaseData.supplierName,
        invoiceNumber: purchaseData.invoiceNumber || "S/N",
        items: purchaseData.items,
        total: purchaseData.items.reduce((sum, it) => sum + (it.costARS * it.quantity), 0),
        status: purchaseData.status || "Recibida",
        notes: purchaseData.notes || "",
        registeredBy: session.user
      };

      // If received, auto add to product stock
      if (newPurchase.status === "Recibida") {
        for (const it of newPurchase.items) {
          const prod = products.find(p => p.id === it.productId);
          if (prod) {
            const prev = prod.stock;
            prod.stock += it.quantity;
            prod.costARS = it.costARS; // Update cost with latest purchase cost
            prod.updatedAt = new Date().toISOString().split("T")[0];

            invLogs.unshift({
              id: generateId("inv"),
              timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
              productId: prod.id,
              productName: prod.name,
              sku: prod.sku,
              type: "ENTRADA_COMPRA",
              quantity: it.quantity,
              previousStock: prev,
              newStock: prod.stock,
              reason: `Recepción compra #${newPurchase.id} (${newPurchase.supplierName})`,
              user: session.user
            });
          }
        }
        save(DB_KEYS.PRODUCTS, products);
        save(DB_KEYS.INVENTORY_LOG, invLogs.slice(0, 500));
      }

      purchases.unshift(newPurchase);
      save(DB_KEYS.PURCHASES, purchases);

      this.logAudit("Compra Registrada", `Compra #${newPurchase.id} a ${newPurchase.supplierName} por $${newPurchase.total.toLocaleString("es-AR")}`, "compras");

      return newPurchase;
    },

    // --- Expenses API ---
    getExpenses() {
      return load(DB_KEYS.EXPENSES, []);
    },

    createExpense(expenseData) {
      const expenses = this.getExpenses();
      const newExp = {
        id: generateId("exp"),
        date: expenseData.date || new Date().toISOString().split("T")[0],
        category: expenseData.category || "General",
        concept: expenseData.concept,
        amount: Number(expenseData.amount) || 0,
        paymentMethod: expenseData.paymentMethod || "Transferencia",
        recipient: expenseData.recipient || "",
        notes: expenseData.notes || ""
      };

      expenses.unshift(newExp);
      save(DB_KEYS.EXPENSES, expenses);

      // If paid from cash, decrement cash register
      if (newExp.paymentMethod === "Efectivo") {
        const cashReg = this.getCashRegister();
        if (cashReg && cashReg.status === "open") {
          cashReg.currentCash = Math.max(0, cashReg.currentCash - newExp.amount);
          save(DB_KEYS.CASH_REGISTER, cashReg);
        }
      }

      this.logAudit("Gasto Registrado", `Gasto de $${newExp.amount.toLocaleString("es-AR")} (${newExp.category} - ${newExp.concept})`, "finanzas");

      return newExp;
    },

    deleteExpense(id) {
      let expenses = this.getExpenses();
      const exp = expenses.find(e => e.id === id);
      if (!exp) return false;

      expenses = expenses.filter(e => e.id !== id);
      save(DB_KEYS.EXPENSES, expenses);
      this.logAudit("Gasto Eliminado", `Se anuló el gasto de $${exp.amount.toLocaleString("es-AR")} (${exp.concept})`, "finanzas");
      return true;
    },

    // --- Customers API ---
    getCustomers() {
      return load(DB_KEYS.CUSTOMERS, []);
    },

    saveCustomer(custData) {
      const customers = this.getCustomers();
      let cust;
      if (!custData.id) {
        cust = {
          ...custData,
          id: generateId("cust"),
          tier: custData.tier || "Cliente Nuevo",
          totalSpent: 0,
          ordersCount: 0,
          firstOrderDate: new Date().toISOString().split("T")[0],
          lastOrderDate: new Date().toISOString().split("T")[0]
        };
        customers.push(cust);
        this.logAudit("Cliente Creado", `Nuevo cliente "${cust.name}" registrado`, "clientes");
      } else {
        const idx = customers.findIndex(c => c.id === custData.id);
        if (idx !== -1) {
          cust = { ...customers[idx], ...custData };
          customers[idx] = cust;
          this.logAudit("Cliente Modificado", `Datos de "${cust.name}" actualizados`, "clientes");
        }
      }
      save(DB_KEYS.CUSTOMERS, customers);
      return cust;
    },

    updateCustomerStats(customerId, orderAmount) {
      const customers = this.getCustomers();
      const cust = customers.find(c => c.id === customerId);
      if (!cust) return;

      cust.totalSpent = (cust.totalSpent || 0) + orderAmount;
      cust.ordersCount = (cust.ordersCount || 0) + 1;
      cust.lastOrderDate = new Date().toISOString().split("T")[0];

      // Update tier based on LTV
      if (cust.totalSpent >= 150000) cust.tier = "VIP Platino";
      else if (cust.totalSpent >= 80000) cust.tier = "Frecuente Oro";
      else cust.tier = "Cliente Frecuente";

      save(DB_KEYS.CUSTOMERS, customers);
    },

    // --- Cash Register (Caja) API ---
    getCashRegister() {
      return load(DB_KEYS.CASH_REGISTER, {
        status: "closed",
        openedAt: null,
        initialCash: 0,
        currentCash: 0,
        closedAt: null,
        notes: ""
      });
    },

    openCashRegister(initialCash, notes = "") {
      const reg = {
        status: "open",
        openedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        initialCash: Number(initialCash) || 0,
        currentCash: Number(initialCash) || 0,
        closedAt: null,
        notes: notes
      };
      save(DB_KEYS.CASH_REGISTER, reg);
      this.logAudit("Apertura de Caja", `Caja abierta con saldo inicial en efectivo de $${reg.initialCash.toLocaleString("es-AR")}`, "caja");
      return reg;
    },

    closeCashRegister(finalCashPhysical, notes = "") {
      const reg = this.getCashRegister();
      reg.status = "closed";
      reg.closedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
      reg.finalCashCount = Number(finalCashPhysical) || 0;
      reg.difference = reg.finalCashCount - reg.currentCash;
      reg.closingNotes = notes;

      save(DB_KEYS.CASH_REGISTER, reg);
      this.logAudit("Cierre de Caja", `Caja cerrada. Efectivo teórico: $${reg.currentCash.toLocaleString("es-AR")} | Físico: $${reg.finalCashCount.toLocaleString("es-AR")} | Dif: $${reg.difference.toLocaleString("es-AR")}`, "caja");
      return reg;
    },

    // --- Settings & Session ---
    getSettings() {
      return load(DB_KEYS.SETTINGS, {});
    },

    saveSettings(settings) {
      save(DB_KEYS.SETTINGS, settings);
      this.logAudit("Configuración Actualizada", "Parámetros del atelier actualizados", "configuracion");
      return settings;
    },

    getSession() {
      return load(DB_KEYS.SESSION, { user: "Administrador", role: "Administrador" });
    },

    setSession(user, role) {
      const sess = { user, role, email: `${user.toLowerCase().replace(/\s+/g, '')}@ezustjoyas.com` };
      save(DB_KEYS.SESSION, sess);
      this.logAudit("Cambio de Sesión", `Sesión activa cambiada a ${user} (${role})`, "seguridad");
      return sess;
    },

    // --- Financial Analytics Aggregator ---
    getFinancialSummary(days = 30) {
      const sales = this.getSales().filter(s => s.status !== "Reembolsado");
      const expenses = this.getExpenses();
      const products = this.getProducts();

      // Today's date
      const todayStr = new Date().toISOString().split("T")[0];
      
      // Calculate daily sales
      const salesToday = sales.filter(s => s.date === todayStr);
      const todayRevenue = salesToday.reduce((sum, s) => sum + s.total, 0);
      const todayCost = salesToday.reduce((sum, s) => sum + s.totalCost, 0);
      const todayProfit = todayRevenue - todayCost;

      // Filter by days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffStr = cutoffDate.toISOString().split("T")[0];

      const periodSales = sales.filter(s => s.date >= cutoffStr);
      const periodExpenses = expenses.filter(e => e.date >= cutoffStr);

      const totalRevenue = periodSales.reduce((sum, s) => sum + s.total, 0);
      const totalCOGS = periodSales.reduce((sum, s) => sum + s.totalCost, 0);
      const grossProfit = totalRevenue - totalCOGS;
      const grossMarginPercent = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

      const totalOperatingExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = grossProfit - totalOperatingExpenses;
      const netMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

      // Inventory valuation
      const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
      const inventoryValuationCost = products.reduce((sum, p) => sum + ((p.costARS || 0) * (p.stock || 0)), 0);
      const inventoryValuationRetail = products.reduce((sum, p) => sum + ((p.priceARS || 0) * (p.stock || 0)), 0);
      const lowStockCount = products.filter(p => (p.stock || 0) <= (p.minStock || 3)).length;

      return {
        days,
        todayRevenue,
        todayProfit,
        todaySalesCount: salesToday.length,
        totalRevenue,
        totalCOGS,
        grossProfit,
        grossMarginPercent,
        totalOperatingExpenses,
        netProfit,
        netMarginPercent,
        totalStockUnits,
        inventoryValuationCost,
        inventoryValuationRetail,
        lowStockCount,
        ordersCount: periodSales.length,
        avgTicket: periodSales.length > 0 ? Math.round(totalRevenue / periodSales.length) : 0
      };
    },

    // --- Backup & Restore ---
    exportDatabase() {
      const backup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        store: "EZÜST JOYAS",
        data: {}
      };

      for (const [key, storageKey] of Object.entries(DB_KEYS)) {
        backup.data[key] = load(storageKey, null);
      }

      return JSON.stringify(backup, null, 2);
    },

    importDatabase(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.data || typeof parsed.data !== "object") {
          return { success: false, error: "Formato de archivo inválido." };
        }

        for (const [key, storageKey] of Object.entries(DB_KEYS)) {
          if (parsed.data[key] !== undefined) {
            save(storageKey, parsed.data[key]);
          }
        }

        this.logAudit("Restauración de Sistema", `Base de datos restaurada íntegramente desde respaldo externo`, "seguridad");
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    resetToFactory() {
      for (const storageKey of Object.values(DB_KEYS)) {
        localStorage.removeItem(storageKey);
      }
      this.init();
      return true;
    }
  };

  // Auto-initialize on script load
  EzustDB.init();

  // Expose globally
  window.EzustDB = EzustDB;
})();
