
import React, { useState, useEffect, useMemo } from 'react';
import { View, Product, Customer, Sale, LedgerEntry, CompanySettings } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import Sales from './views/Sales';
import Customers from './views/Customers';
import Reports from './views/Reports';
import Settings from './views/Settings';
import Invoice from './components/Invoice';
import Ledger from './views/Ledger';

const STORAGE_KEYS = {
  PRODUCTS: 'sw_products',
  CUSTOMERS: 'sw_customers',
  SALES: 'sw_sales',
  LEDGER: 'sw_ledger',
  SETTINGS: 'sw_settings'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [settings, setSettings] = useState<CompanySettings>({
    storeName: 'Sell Net BD',
    phone: '+880123456789',
    address: 'Dhaka, Bangladesh',
    currency: '৳'
  });

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Load Data
  useEffect(() => {
    const p = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const c = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    const s = localStorage.getItem(STORAGE_KEYS.SALES);
    const l = localStorage.getItem(STORAGE_KEYS.LEDGER);
    const st = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (p) setProducts(JSON.parse(p));
    if (c) setCustomers(JSON.parse(c));
    if (s) setSales(JSON.parse(s));
    if (l) setLedger(JSON.parse(l));
    if (st) setSettings(JSON.parse(st));
  }, []);

  // Save Data - Triggers whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledger));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [products, customers, sales, ledger, settings]);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleAddSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    
    // Update Stock
    setProducts(prev => prev.map(p => {
      const item = sale.items.find(i => i.productId === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    }));

    // Update Customer Stats
    setCustomers(prev => prev.map(c => {
      if (c.id === sale.customerId) {
        return {
          ...c,
          totalPurchase: c.totalPurchase + sale.grandTotal,
          paidAmount: c.paidAmount + sale.paidAmount,
          dueAmount: c.dueAmount + sale.dueAmount
        };
      }
      return c;
    }));

    // Add to Ledger
    const newLedgerEntry: LedgerEntry = {
      id: `LGR-${Date.now()}`,
      customerId: sale.customerId,
      date: sale.date,
      description: `Sale #${sale.id}`,
      debit: sale.grandTotal,
      credit: sale.paidAmount,
      balance: 0 
    };
    setLedger(prev => [...prev, newLedgerEntry]);

    setSelectedSale(sale);
    setCurrentView(View.INVOICE_VIEW);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই প্রোডাক্টটি ডিলিট করতে চান? এটি ইনভেন্টরি থেকে চিরতরে মুছে যাবে।')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleDeleteSale = (saleId: string) => {
    const saleToDelete = sales.find(s => s.id === saleId);
    if (!saleToDelete) return;

    if (!window.confirm(`আপনি কি এই মেমো #${saleToDelete.id} ডিলিট করতে চান? এটি স্টক ফিরিয়ে দিবে এবং কাস্টমারের বকেয়া হিসাব আপডেট করবে।`)) return;

    // 1. Revert Product Stock
    setProducts(currentProducts => currentProducts.map(p => {
      const item = saleToDelete.items.find(i => i.productId === p.id);
      return item ? { ...p, stock: p.stock + item.qty } : p;
    }));

    // 2. Revert Customer Balance
    setCustomers(currentCustomers => currentCustomers.map(c => {
      if (c.id === saleToDelete.customerId) {
        return {
          ...c,
          totalPurchase: Math.max(0, c.totalPurchase - saleToDelete.grandTotal),
          paidAmount: Math.max(0, c.paidAmount - saleToDelete.paidAmount),
          dueAmount: Math.max(0, c.dueAmount - saleToDelete.dueAmount)
        };
      }
      return c;
    }));

    // 3. Remove from Ledger
    setLedger(currentLedger => currentLedger.filter(l => l.description !== `Sale #${saleToDelete.id}`));

    // 4. Remove Sale Record
    setSales(currentSales => currentSales.filter(s => s.id !== saleId));
    
    // Close views if they were related to the deleted sale
    if (selectedSale?.id === saleId) {
      setSelectedSale(null);
      setCurrentView(View.SALES);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard products={products} customers={customers} sales={sales} settings={settings} />;
      case View.PRODUCTS:
        return <Inventory products={products} setProducts={setProducts} onDeleteProduct={handleDeleteProduct} settings={settings} />;
      case View.SALES:
        return (
          <Sales 
            products={products} 
            customers={customers} 
            onAddSale={handleAddSale} 
            onDeleteSale={handleDeleteSale}
            onAddCustomer={handleAddCustomer}
            settings={settings} 
            sales={sales} 
            viewInvoice={(s) => { setSelectedSale(s); setCurrentView(View.INVOICE_VIEW); }} 
          />
        );
      case View.CUSTOMERS:
        return <Customers customers={customers} setCustomers={setCustomers} viewLedger={(c) => { setSelectedCustomer(c); setCurrentView(View.LEDGER_VIEW); }} settings={settings} />;
      case View.REPORTS:
        return <Reports sales={sales} products={products} settings={settings} />;
      case View.SETTINGS:
        return <Settings settings={settings} setSettings={setSettings} />;
      case View.INVOICE_VIEW:
        return selectedSale ? (
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setCurrentView(View.SALES)}
              className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded no-print flex items-center transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Sales
            </button>
            <Invoice sale={selectedSale} settings={settings} />
          </div>
        ) : null;
      case View.LEDGER_VIEW:
        return selectedCustomer ? (
          <Ledger customer={selectedCustomer} ledgerEntries={ledger.filter(l => l.customerId === selectedCustomer.id)} onBack={() => setCurrentView(View.CUSTOMERS)} settings={settings} />
        ) : null;
      default:
        return <Dashboard products={products} customers={customers} sales={sales} settings={settings} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="no-print w-64 fixed inset-y-0 z-50">
        <Sidebar activeView={currentView} setView={setCurrentView} storeName={settings.storeName} />
      </div>
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <header className="flex justify-between items-center mb-8 no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {currentView.replace('_', ' ')}
            </h1>
            <p className="text-sm text-gray-500">Managing {settings.storeName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">|</span>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-gray-400">Store Manager</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
