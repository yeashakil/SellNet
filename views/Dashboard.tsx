
import React, { useMemo } from 'react';
import { Product, Customer, Sale, CompanySettings } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface DashboardProps {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  settings: CompanySettings;
}

const Dashboard: React.FC<DashboardProps> = ({ products, customers, sales, settings }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const month = new Date().toISOString().slice(0, 7);

    const todaySales = sales.filter(s => s.date.startsWith(today)).reduce((sum, s) => sum + s.grandTotal, 0);
    const monthlySales = sales.filter(s => s.date.startsWith(month)).reduce((sum, s) => sum + s.grandTotal, 0);
    const totalDue = customers.reduce((sum, c) => sum + c.dueAmount, 0);
    
    // Simple profit calc: (SalePrice - BuyPrice) * qty for each sale
    let monthlyProfit = 0;
    sales.filter(s => s.date.startsWith(month)).forEach(s => {
      s.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          monthlyProfit += (product.sellingPrice - product.buyingPrice) * item.qty;
        }
      });
      monthlyProfit -= s.discount;
    });

    return { todaySales, monthlySales, totalDue, monthlyProfit };
  }, [sales, customers, products]);

  const chartData = useMemo(() => {
    // Last 7 days sales
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const daySales = sales.filter(s => s.date.startsWith(dateStr)).reduce((sum, s) => sum + s.grandTotal, 0);
      data.push({ name: dateStr.split('-').slice(1).join('/'), sales: daySales });
    }
    return data;
  }, [sales]);

  const Cards = [
    { label: 'Total Products', val: products.length, icon: 'fa-boxes', color: 'bg-blue-500' },
    { label: 'Total Customers', val: customers.length, icon: 'fa-users', color: 'bg-purple-500' },
    { label: 'Today Sales', val: `${settings.currency}${stats.todaySales.toLocaleString()}`, icon: 'fa-calendar-day', color: 'bg-green-500' },
    { label: 'Monthly Profit', val: `${settings.currency}${stats.monthlyProfit.toLocaleString()}`, icon: 'fa-chart-line', color: 'bg-amber-500' },
    { label: 'Total Due', val: `${settings.currency}${stats.totalDue.toLocaleString()}`, icon: 'fa-hand-holding-usd', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${card.color} text-white p-3 rounded-lg`}>
              <i className={`fas ${card.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-gray-800">{card.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Sales Trend (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Inventory Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-400">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 font-medium text-gray-700">{p.name}</td>
                    <td className="py-4 text-gray-600">{p.stock}</td>
                    <td className="py-4">
                      {p.stock <= 5 ? (
                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">Low Stock</span>
                      ) : (
                        <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Healthy</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
