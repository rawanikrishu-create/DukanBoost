export type BusinessCategory =
  | 'Grocery'
  | 'Medical'
  | 'Electronics'
  | 'Textile & Clothing'
  | 'General Store'
  | 'Other';

export interface ShopProfile {
  shopName: string;
  ownerName: string;
  phone: string;
  location: string;
  category: BusinessCategory;
  approxCustomers: string;
  hasDigitalRecords: boolean;
  isSetupComplete: boolean;
  createdAt: string;
}

export type CustomerStatus = 'regular' | 'inactive' | 'new';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  joiningDate: string; // ISO date string or 'January 2026'
  lastPurchaseDate: string; // ISO date string
  lastPurchaseRelative: string; // e.g. '3 days ago'
  totalOrders: number;
  totalSpending: number;
  averagePurchaseIntervalDays: number;
  frequentlyPurchasedProducts: string[];
  status: CustomerStatus;
  notes?: string;
}

export type ProductStatus = 'fast_moving' | 'normal' | 'slow_moving';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice?: number;
  stock: number;
  unitsSold: number;
  status: ProductStatus;
  unit: string; // 'pack', 'kg', 'ltr', 'pcs', 'bottle', 'strip'
  minStockThreshold: number;
  dailyAverageSales: number;
  estimatedDaysRemaining: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'paid_upi' | 'paid_cash' | 'paid_card' | 'udhaar_due';

export interface Sale {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  totalAmount: number;
  date: string; // ISO date string
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Offer {
  id: string;
  title: string;
  productId: string;
  productName: string;
  discountValue: string; // e.g., '10% OFF' or '₹50 OFF' or 'Buy 2 Get 1'
  targetAudience: 'regular' | 'inactive' | 'related' | 'all';
  message: string;
  validUntil: string;
  status: 'draft' | 'active' | 'sent';
  sentCount: number;
  createdAt: string;
}

export interface AttentionAction {
  id: string;
  title: string;
  subtitle: string;
  why: string;
  actionText: string;
  actionType:
    | 'view_inactive_customers'
    | 'check_stock'
    | 'create_offer'
    | 'welcome_new'
    | 'promote_combo';
  targetId?: string;
  badgeLabel?: string;
  impact: string;
}

export interface ComboInsight {
  productA: string;
  productB: string;
  frequency: number;
  recommendation: string;
}
