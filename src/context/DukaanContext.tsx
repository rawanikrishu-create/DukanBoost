import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  BusinessCategory,
  Customer,
  Product,
  Sale,
  Offer,
  ShopProfile,
  AttentionAction,
  PaymentMethod,
} from '../types';
import {
  INITIAL_SHOP_PROFILE,
  INITIAL_CUSTOMERS,
  GROCERY_PRODUCTS,
  CATEGORY_CATALOGS,
  INITIAL_SALES,
  INITIAL_OFFERS,
  FREQUENT_COMBOS,
  getRelativeTimeString,
} from '../data/mockData';

const STORAGE_KEY = 'dukaanboost_app_state_v1';

const sanitizeProducts = (loaded: any): Product[] => {
  if (!Array.isArray(loaded) || loaded.length === 0) return GROCERY_PRODUCTS;
  const cleaned = loaded.filter((p) => p && typeof p === 'object' && p.id && p.name).map((p) => ({
    ...p,
    price: typeof p.price === 'number' && !isNaN(p.price) ? p.price : 50,
    stock: typeof p.stock === 'number' && !isNaN(p.stock) ? p.stock : 20,
    unitsSold: typeof p.unitsSold === 'number' && !isNaN(p.unitsSold) ? p.unitsSold : 0,
    status: p.status || 'normal',
    unit: p.unit || 'pcs',
    minStockThreshold: typeof p.minStockThreshold === 'number' ? p.minStockThreshold : 10,
    dailyAverageSales: typeof p.dailyAverageSales === 'number' ? p.dailyAverageSales : 1.5,
    estimatedDaysRemaining: typeof p.estimatedDaysRemaining === 'number' ? p.estimatedDaysRemaining : 10,
  }));
  return cleaned.length > 0 ? cleaned : GROCERY_PRODUCTS;
};

const sanitizeCustomers = (loaded: any): Customer[] => {
  if (!Array.isArray(loaded) || loaded.length === 0) return INITIAL_CUSTOMERS;
  const cleaned = loaded.filter((c) => c && typeof c === 'object' && c.id && c.name).map((c) => ({
    ...c,
    phone: typeof c.phone === 'string' ? c.phone : '+91 98000 00000',
    whatsapp: typeof c.whatsapp === 'string' ? c.whatsapp : '+919800000000',
    frequentlyPurchasedProducts: Array.isArray(c.frequentlyPurchasedProducts) ? c.frequentlyPurchasedProducts : [],
    status: c.status || 'regular',
    totalOrders: typeof c.totalOrders === 'number' ? c.totalOrders : 1,
    totalSpending: typeof c.totalSpending === 'number' ? c.totalSpending : 100,
    averagePurchaseIntervalDays: typeof c.averagePurchaseIntervalDays === 'number' ? c.averagePurchaseIntervalDays : 7,
  }));
  return cleaned.length > 0 ? cleaned : INITIAL_CUSTOMERS;
};

export type ActiveView =
  | 'dashboard'
  | 'customers'
  | 'products'
  | 'sales'
  | 'engagement'
  | 'offers'
  | 'insights'
  | 'market'
  | 'settings';

interface DukaanContextType {
  shopProfile: ShopProfile;
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  offers: Offer[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Modals
  isRecordSaleModalOpen: boolean;
  setIsRecordSaleModalOpen: (open: boolean) => void;
  isAddCustomerModalOpen: boolean;
  setIsAddCustomerModalOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  lastCompletedSale: Sale | null;
  isWhatsAppModalOpen: boolean;
  whatsAppData: { customerName: string; phone: string; message: string; targetId?: string } | null;
  isDirectWhatsAppModalOpen: boolean;
  setIsDirectWhatsAppModalOpen: (open: boolean) => void;
  directWhatsAppInitialData: { name?: string; phone?: string; message?: string } | null;
  openDirectWhatsAppModal: (initialData?: { name?: string; phone?: string; message?: string }) => void;
  closeDirectWhatsAppModal: () => void;

  // Actions
  recordSale: (data: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Sale;
  addCustomer: (data: {
    name: string;
    phone: string;
    status?: 'regular' | 'inactive' | 'new';
    notes?: string;
  }) => Customer;
  addProduct: (data: {
    name: string;
    category: string;
    price: number;
    costPrice?: number;
    stock: number;
    unit: string;
  }) => Product;
  updateProductStock: (productId: string, newStock: number) => void;
  quickAddStock: (productId: string, addQuantity: number) => void;
  createOffer: (data: {
    title: string;
    productId: string;
    discountValue: string;
    targetAudience: 'regular' | 'inactive' | 'related' | 'all';
    message: string;
    validUntil: string;
  }) => Offer;
  openWhatsAppComposer: (data: {
    customerName: string;
    phone: string;
    message: string;
    targetId?: string;
  }) => void;
  closeWhatsAppComposer: () => void;
  updateShopProfile: (updates: Partial<ShopProfile>) => void;
  switchCategory: (category: BusinessCategory) => void;
  resetToDemoData: (category?: BusinessCategory) => void;

  // Analytics & Derived
  todaySalesTotal: number;
  todayOrdersCount: number;
  todayReturningCount: number;
  todayNewCount: number;
  inactiveCustomersCount: number;
  regularCustomersCount: number;
  newCustomersCount: number;
  lowStockProducts: Product[];
  fastMovingProducts: Product[];
  slowMovingProducts: Product[];
  attentionActions: AttentionAction[];
  weeklySalesTotal: number;
  monthlySalesTotal: number;
}

const DukaanContext = createContext<DukaanContextType | undefined>(undefined);

export const DukaanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or Fallback
  const [shopProfile, setShopProfile] = useState<ShopProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : INITIAL_SHOP_PROFILE;
    } catch {
      return INITIAL_SHOP_PROFILE;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customers`);
      return saved ? sanitizeCustomers(JSON.parse(saved)) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
      return saved ? sanitizeProducts(JSON.parse(saved)) : GROCERY_PRODUCTS;
    } catch {
      return GROCERY_PRODUCTS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sales`);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  // UI state
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isRecordSaleModalOpen, setIsRecordSaleModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppData, setWhatsAppModalData] = useState<{
    customerName: string;
    phone: string;
    message: string;
    targetId?: string;
  } | null>(null);
  const [isDirectWhatsAppModalOpen, setIsDirectWhatsAppModalOpen] = useState(false);
  const [directWhatsAppInitialData, setDirectWhatsAppInitialData] = useState<{
    name?: string;
    phone?: string;
    message?: string;
  } | null>(null);

  const openDirectWhatsAppModal = (initialData?: { name?: string; phone?: string; message?: string }) => {
    setDirectWhatsAppInitialData(initialData || null);
    setIsDirectWhatsAppModalOpen(true);
  };

  const closeDirectWhatsAppModal = () => {
    setIsDirectWhatsAppModalOpen(false);
    setDirectWhatsAppInitialData(null);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(shopProfile));
    } catch (e) {
      console.warn('Failed saving profile', e);
    }
  }, [shopProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
    } catch (e) {
      console.warn('Failed saving customers', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed saving products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sales`, JSON.stringify(sales));
    } catch (e) {
      console.warn('Failed saving sales', e);
    }
  }, [sales]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
    } catch (e) {
      console.warn('Failed saving offers', e);
    }
  }, [offers]);

  // Derived Analytics
  // Baseline simulated "today" anchor date is 2026-09-26
  const todayDateStr = '2026-09-26';

  const todaySales = useMemo(() => {
    return sales.filter((s) => s.date.startsWith(todayDateStr));
  }, [sales]);

  const todaySalesTotal = useMemo(() => {
    return todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  }, [todaySales]);

  const todayOrdersCount = todaySales.length;

  const { todayReturningCount, todayNewCount } = useMemo(() => {
    let returning = 0;
    let newCust = 0;
    todaySales.forEach((s) => {
      const cust = customers.find((c) => c.id === s.customerId);
      if (cust && cust.status === 'new') {
        newCust++;
      } else {
        returning++;
      }
    });
    return { todayReturningCount: returning, todayNewCount: newCust };
  }, [todaySales, customers]);

  const weeklySalesTotal = useMemo(() => {
    // past 7 days sales
    return sales.reduce((acc, s) => acc + s.totalAmount, 0);
  }, [sales]);

  const monthlySalesTotal = useMemo(() => {
    return weeklySalesTotal * 3.8;
  }, [weeklySalesTotal]);

  const inactiveCustomersCount = useMemo(() => {
    return customers.filter((c) => c.status === 'inactive').length;
  }, [customers]);

  const regularCustomersCount = useMemo(() => {
    return customers.filter((c) => c.status === 'regular').length;
  }, [customers]);

  const newCustomersCount = useMemo(() => {
    return customers.filter((c) => c.status === 'new').length;
  }, [customers]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStockThreshold || p.estimatedDaysRemaining <= 3);
  }, [products]);

  const fastMovingProducts = useMemo(() => {
    return products.filter((p) => p.status === 'fast_moving');
  }, [products]);

  const slowMovingProducts = useMemo(() => {
    return products.filter((p) => p.status === 'slow_moving');
  }, [products]);

  // Dynamic "What needs your attention?" / "Today's Actions"
  const attentionActions: AttentionAction[] = useMemo(() => {
    const actions: AttentionAction[] = [];

    // 1. Inactive customers alert
    const inactiveList = customers.filter((c) => c.status === 'inactive');
    if (inactiveList.length > 0) {
      actions.push({
        id: 'action-inactive',
        title: `${inactiveList.length} customers haven't returned`,
        subtitle: 'These customers usually shop every 10–20 days and are past their cycle.',
        why: 'Regular customers who stop visiting often switch to competitors or forget routine refills.',
        actionText: 'View Customers',
        actionType: 'view_inactive_customers',
        impact: 'Potential ₹12,000+ repeat sales recovery',
        badgeLabel: 'Retention',
      });
    }

    // 2. Fast selling product low stock alert
    const criticalStock = products.find(
      (p) => p && p.status === 'fast_moving' && p.stock <= (p.minStockThreshold ?? 10),
    );
    if (criticalStock) {
      const daysLeft = typeof criticalStock.estimatedDaysRemaining === 'number'
        ? criticalStock.estimatedDaysRemaining.toFixed(1)
        : '1.5';
      const dailyAvg = typeof criticalStock.dailyAverageSales === 'number'
        ? criticalStock.dailyAverageSales.toFixed(1)
        : '1.5';
      actions.push({
        id: 'action-stock',
        title: `${criticalStock.name} is selling fast`,
        subtitle: `Only ${criticalStock.stock} ${criticalStock.unit} remaining (${daysLeft} days of stock left).`,
        why: `Daily sales average is ${dailyAvg} units. Stock will run out in less than 48 hours.`,
        actionText: 'Check Stock',
        actionType: 'check_stock',
        targetId: criticalStock.id,
        impact: 'Avoid lost morning sales',
        badgeLabel: 'Stock Alert',
      });
    } else if (lowStockProducts.length > 0) {
      const item = lowStockProducts[0];
      actions.push({
        id: 'action-stock-gen',
        title: `${item.name} stock running low`,
        subtitle: `Current stock: ${item.stock} ${item.unit}. Reorder threshold reached.`,
        why: 'Replenishing before running out prevents customer dissatisfaction.',
        actionText: 'Check Stock',
        actionType: 'check_stock',
        targetId: item.id,
        impact: 'Stock Alert',
        badgeLabel: 'Restock',
      });
    }

    // 3. Product combination / Related interest offer
    const topCombo = FREQUENT_COMBOS[0];
    actions.push({
      id: 'action-combo',
      title: '8 customers may be interested in your combo offer',
      subtitle: `Customers frequently buy ${topCombo.productA} and ${topCombo.productB} together.`,
      why: 'Suggesting paired staples increases basket size by an average of ₹45 to ₹80 per transaction.',
      actionText: 'Create Offer',
      actionType: 'promote_combo',
      impact: '+18% average bill value',
      badgeLabel: 'Smart Upsell',
    });

    // 4. Welcome new customers
    const recentNew = customers.filter((c) => c.status === 'new');
    if (recentNew.length > 0) {
      actions.push({
        id: 'action-new',
        title: `${recentNew.length} new customers made their first purchase`,
        subtitle: 'A simple thank-you message on WhatsApp converts new buyers into regulars.',
        why: 'First-time shoppers who receive a friendly follow-up are 3.2x more likely to return within 7 days.',
        actionText: 'Send Welcome Note',
        actionType: 'welcome_new',
        impact: 'Build lasting trust',
        badgeLabel: 'Loyalty',
      });
    }

    return actions;
  }, [customers, products, lowStockProducts]);

  // Actions
  const recordSale = (data: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Sale => {
    // Generate new bill
    const billNum = `INV-${1050 + sales.length + 1}`;
    const nowIso = new Date('2026-09-26T10:00:00').toISOString();

    // Calculate line items and total
    let totalAmt = 0;
    const saleItems = data.items.map((it) => {
      const pr = products.find((p) => p.id === it.productId);
      const unitPrice = pr ? pr.price : 50;
      const lineTotal = unitPrice * it.quantity;
      totalAmt += lineTotal;
      return {
        productId: it.productId,
        productName: pr ? pr.name : 'Item',
        quantity: it.quantity,
        unitPrice,
        total: lineTotal,
      };
    });

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      billNumber: billNum,
      customerId: data.customerId || `cust-${Date.now()}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone || '+91 98000 00000',
      items: saleItems,
      totalAmount: totalAmt,
      date: nowIso,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    };

    // 1. Update sales state
    setSales((prev) => [newSale, ...prev]);

    // 2. Decrement inventory and update units sold
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItem = saleItems.find((it) => it.productId === prod.id);
        if (!matchingItem) return prod;

        const newStock = Math.max(0, prod.stock - matchingItem.quantity);
        const newUnitsSold = prod.unitsSold + matchingItem.quantity;
        const newStatus =
          newUnitsSold > 60 ? 'fast_moving' : newUnitsSold < 10 ? 'slow_moving' : 'normal';
        const newEstimatedDays =
          prod.dailyAverageSales > 0
            ? Math.round((newStock / prod.dailyAverageSales) * 10) / 10
            : 15;

        return {
          ...prod,
          stock: newStock,
          unitsSold: newUnitsSold,
          status: newStatus,
          estimatedDaysRemaining: newEstimatedDays,
        };
      }),
    );

    // 3. Update customer stats or create new customer
    setCustomers((prev) => {
      const existingIdx = prev.findIndex((c) => {
        if (!c) return false;
        if (data.customerId && c.id === data.customerId) return true;
        const cleanExistingPhone = (c.phone || '').replace(/[^0-9]/g, '');
        const cleanIncomingPhone = (data.customerPhone || '').replace(/[^0-9]/g, '');
        if (cleanIncomingPhone.length >= 10 && cleanExistingPhone.length >= 10) {
          if (cleanExistingPhone.slice(-10) === cleanIncomingPhone.slice(-10)) return true;
        }
        if (
          c.name &&
          data.customerName &&
          c.name.trim().toLowerCase() === data.customerName.trim().toLowerCase()
        ) {
          return true;
        }
        return false;
      });

      const purchasedProductNames = saleItems.map((si) => si.productName);

      if (existingIdx >= 0) {
        const old = prev[existingIdx];
        const oldFreq = Array.isArray(old.frequentlyPurchasedProducts) ? old.frequentlyPurchasedProducts : [];
        const updatedFreq = Array.from(
          new Set([...purchasedProductNames, ...oldFreq]),
        ).slice(0, 4);

        const updatedCustomer: Customer = {
          ...old,
          lastPurchaseDate: nowIso,
          lastPurchaseRelative: 'Today',
          totalOrders: (old.totalOrders || 0) + 1,
          totalSpending: (old.totalSpending || 0) + totalAmt,
          status: 'regular', // Customer just bought today, so active & regular!
          frequentlyPurchasedProducts: updatedFreq,
        };

        const updatedList = [...prev];
        updatedList[existingIdx] = updatedCustomer;
        return updatedList;
      } else {
        // Create new customer record
        const newCust: Customer = {
          id: newSale.customerId,
          name: data.customerName,
          phone: data.customerPhone || '+91 98000 00000',
          whatsapp: data.customerPhone ? data.customerPhone.replace(/[^0-9+]/g, '') : '+919800000000',
          joiningDate: 'September 2026',
          lastPurchaseDate: nowIso,
          lastPurchaseRelative: 'Today',
          totalOrders: 1,
          totalSpending: totalAmt,
          averagePurchaseIntervalDays: 7,
          frequentlyPurchasedProducts: purchasedProductNames.slice(0, 3),
          status: 'new',
          notes: 'Added via Quick Sale',
        };
        return [newCust, ...prev];
      }
    });

    setLastCompletedSale(newSale);
    setIsReceiptModalOpen(true);
    return newSale;
  };

  const addCustomer = (data: {
    name: string;
    phone: string;
    status?: 'regular' | 'inactive' | 'new';
    notes?: string;
  }): Customer => {
    const cleanDigits = data.phone.replace(/[^0-9]/g, '');
    const cleanPhone = cleanDigits.length >= 10 ? `+91 ${cleanDigits.slice(-10)}` : data.phone;
    const whatsapp = `+91${cleanDigits.slice(-10)}`;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      phone: cleanPhone,
      whatsapp,
      joiningDate: 'September 2026',
      lastPurchaseDate: '2026-09-26T09:00:00',
      lastPurchaseRelative: 'Just now',
      totalOrders: 0,
      totalSpending: 0,
      averagePurchaseIntervalDays: 7,
      frequentlyPurchasedProducts: [],
      status: data.status || 'new',
      notes: data.notes || '',
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const addProduct = (data: {
    name: string;
    category: string;
    price: number;
    costPrice?: number;
    stock: number;
    unit: string;
  }): Product => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: data.name.trim(),
      category: data.category.trim(),
      price: data.price,
      costPrice: data.costPrice || Math.round(data.price * 0.85),
      stock: data.stock,
      unitsSold: 0,
      status: 'normal',
      unit: data.unit || 'pcs',
      minStockThreshold: 10,
      dailyAverageSales: 1.5,
      estimatedDaysRemaining: data.stock > 0 ? Math.round(data.stock / 1.5) : 0,
    };

    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const estDays =
          p.dailyAverageSales > 0 ? Math.round((newStock / p.dailyAverageSales) * 10) / 10 : 15;
        return {
          ...p,
          stock: newStock,
          estimatedDaysRemaining: estDays,
        };
      }),
    );
  };

  const quickAddStock = (productId: string, addQuantity: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newStock = p.stock + addQuantity;
        const estDays =
          p.dailyAverageSales > 0 ? Math.round((newStock / p.dailyAverageSales) * 10) / 10 : 15;
        return {
          ...p,
          stock: newStock,
          estimatedDaysRemaining: estDays,
        };
      }),
    );
  };

  const createOffer = (data: {
    title: string;
    productId: string;
    discountValue: string;
    targetAudience: 'regular' | 'inactive' | 'related' | 'all';
    message: string;
    validUntil: string;
  }): Offer => {
    const prod = products.find((p) => p.id === data.productId);
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      title: data.title,
      productId: data.productId,
      productName: prod ? prod.name : 'Store Items',
      discountValue: data.discountValue,
      targetAudience: data.targetAudience,
      message: data.message,
      validUntil: data.validUntil,
      status: 'active',
      sentCount: 0,
      createdAt: '2026-09-26',
    };

    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const openWhatsAppComposer = (data: {
    customerName: string;
    phone: string;
    message: string;
    targetId?: string;
  }) => {
    // Fill placeholders
    const personalized = data.message
      .replace(/{customer_name}/g, data.customerName)
      .replace(/{shop_name}/g, shopProfile.shopName);

    setWhatsAppModalData({
      customerName: data.customerName,
      phone: data.phone,
      message: personalized,
      targetId: data.targetId,
    });
    setIsWhatsAppModalOpen(true);
  };

  const closeWhatsAppComposer = () => {
    setIsWhatsAppModalOpen(false);
    setWhatsAppModalData(null);
  };

  const updateShopProfile = (updates: Partial<ShopProfile>) => {
    setShopProfile((prev) => ({ ...prev, ...updates }));
  };

  const switchCategory = (category: BusinessCategory) => {
    const catData = CATEGORY_CATALOGS[category] || CATEGORY_CATALOGS.Grocery;
    setShopProfile((prev) => ({
      ...prev,
      category,
      shopName: prev.shopName === INITIAL_SHOP_PROFILE.shopName ? catData.defaultShop : prev.shopName,
    }));
    setProducts(catData.products);
  };

  const resetToDemoData = (category?: BusinessCategory) => {
    const cat = category || 'Grocery';
    const catData = CATEGORY_CATALOGS[cat];
    const newProfile: ShopProfile = {
      ...INITIAL_SHOP_PROFILE,
      category: cat,
      shopName: catData.defaultShop,
    };
    setShopProfile(newProfile);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(catData.products);
    setSales(INITIAL_SALES);
    setOffers(INITIAL_OFFERS);
  };

  return (
    <DukaanContext.Provider
      value={{
        shopProfile,
        customers,
        products,
        sales,
        offers,
        activeView,
        setActiveView,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedProductId,
        setSelectedProductId,
        isRecordSaleModalOpen,
        setIsRecordSaleModalOpen,
        isAddCustomerModalOpen,
        setIsAddCustomerModalOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        lastCompletedSale,
        isWhatsAppModalOpen,
        whatsAppData,
        isDirectWhatsAppModalOpen,
        setIsDirectWhatsAppModalOpen,
        directWhatsAppInitialData,
        openDirectWhatsAppModal,
        closeDirectWhatsAppModal,
        recordSale,
        addCustomer,
        addProduct,
        updateProductStock,
        quickAddStock,
        createOffer,
        openWhatsAppComposer,
        closeWhatsAppComposer,
        updateShopProfile,
        switchCategory,
        resetToDemoData,
        todaySalesTotal,
        todayOrdersCount,
        todayReturningCount,
        todayNewCount,
        inactiveCustomersCount,
        regularCustomersCount,
        newCustomersCount,
        lowStockProducts,
        fastMovingProducts,
        slowMovingProducts,
        attentionActions,
        weeklySalesTotal,
        monthlySalesTotal,
      }}
    >
      {children}
    </DukaanContext.Provider>
  );
};

export const useDukaan = (): DukaanContextType => {
  const context = useContext(DukaanContext);
  if (!context) {
    throw new Error('useDukaan must be used within a DukaanProvider');
  }
  return context;
};
