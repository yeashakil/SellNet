
export interface Product {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalPurchase: number;
  paidAmount: number;
  dueAmount: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CompanySettings {
  storeName: string;
  phone: string;
  address: string;
  currency: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  SALES = 'SALES',
  CUSTOMERS = 'CUSTOMERS',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  INVOICE_VIEW = 'INVOICE_VIEW',
  LEDGER_VIEW = 'LEDGER_VIEW'
}
