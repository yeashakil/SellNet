
import React, { useMemo } from 'react';
import { Sale, Product, CompanySettings } from '../types';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
  settings: CompanySettings;
}

const Reports: React.FC<ReportsProps> = ({ sales, products, settings }) => {
  const summary = useMemo(() => {
    let totalSales = 0;
    let totalCost = 0;
    let totalDiscount = 0;
    let totalPaid = 0;
    let totalDue = 0;

    sales.forEach(s => {
      totalSales += s.grandTotal + s.discount;
      totalDiscount += s.discount;
      totalPaid += s.paidAmount;
      totalDue += s.dueAmount;
      
      s.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          totalCost += prod.buyingPrice * item.qty;
        }
      });
    });

    const netProfit = (totalSales - totalDiscount) - totalCost;

    return { totalSales, totalCost, totalDiscount, totalPaid, totalDue, netProfit };
  }, [sales, products]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Gross Sales</p>
          <h2 className="text-3xl font-black text-gray-800">{settings.currency}{summary.totalSales.toLocaleString()}</h2>
          <div className="mt-4 flex items-center text-xs text-gray-400">
            <i className="fas fa-info-circle mr-2"></i> Total sales before discounts
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total COGS (Cost)</p>
          <h2 className="text-3xl font-black text-blue-600">{settings.currency}{summary.totalCost.toLocaleString()}</h2>
          <div className="mt-4 flex items-center text-xs text-gray-400">
            <i className="fas fa-info-circle mr-2"></i> Cost of Goods Sold
          </div>
        </div>

        <div className={`p-6 rounded-xl border shadow-sm ${summary.netProfit >= 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          <p className="text-white opacity-80 text-sm font-bold uppercase tracking-wider mb-2">Net Business Profit</p>
          <h2 className="text-3xl font-black">{settings.currency}{summary.netProfit.toLocaleString()}</h2>
          <div className="mt-4 flex items-center text-xs text-white opacity-70">
            <i className="fas fa-chart-line mr-2"></i> Total Profit - Discounts
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-bold text-gray-800">Financial Ledger Summary</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-gray-600">Total Discounts Given</span>
            <span className="font-bold text-red-600">-{settings.currency}{summary.totalDiscount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-gray-600">Total Cash Received</span>
            <span className="font-bold text-green-600">{settings.currency}{summary.totalPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dashed">
            <span className="text-gray-600">Outstanding Receivables (Dues)</span>
            <span className="font-bold text-amber-600">{settings.currency}{summary.totalDue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
