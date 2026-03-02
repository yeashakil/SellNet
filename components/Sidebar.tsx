
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  storeName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, storeName }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: View.PRODUCTS, label: 'Inventory', icon: 'fa-boxes' },
    { id: View.SALES, label: 'Sales & POS', icon: 'fa-shopping-cart' },
    { id: View.CUSTOMERS, label: 'Customers', icon: 'fa-users' },
    { id: View.REPORTS, label: 'Reports', icon: 'fa-file-invoice-dollar' },
    { id: View.SETTINGS, label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col">
      <div className="p-6 flex items-center space-x-3 bg-slate-950">
        <i className="fas fa-store text-blue-400 text-2xl"></i>
        <span className="text-xl font-bold tracking-wider uppercase truncate">{storeName}</span>
      </div>
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === item.id || (activeView === View.INVOICE_VIEW && item.id === View.SALES) || (activeView === View.LEDGER_VIEW && item.id === View.CUSTOMERS)
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-slate-400">System Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
