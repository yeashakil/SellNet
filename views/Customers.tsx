
import React, { useState } from 'react';
import { Customer, CompanySettings } from '../types';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  viewLedger: (c: Customer) => void;
  settings: CompanySettings;
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers, viewLedger, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `CST-${Date.now()}`,
      ...formData,
      totalPurchase: 0,
      paidAmount: 0,
      dueAmount: 0
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Customer Directory</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <i className="fas fa-user-plus"></i>
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl uppercase">
                {c.name.charAt(0)}
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${c.dueAmount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {c.dueAmount > 0 ? 'Due' : 'Clear'}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">{c.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              <i className="fas fa-phone-alt mr-2"></i>
              {c.phone || 'No Phone'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 mb-4">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Purchased</p>
                <p className="font-bold text-gray-800">{settings.currency}{c.totalPurchase}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Balance Due</p>
                <p className="font-bold text-red-600">{settings.currency}{c.dueAmount}</p>
              </div>
            </div>

            <button 
              onClick={() => viewLedger(c)}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-semibold text-sm transition-colors"
            >
              View Ledger History
            </button>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <i className="fas fa-users text-4xl text-gray-200 mb-4"></i>
          <p className="text-gray-400">No customers registered yet.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 text-xs">(Optional)</span></label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-gray-400 text-xs">(Optional)</span></label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
