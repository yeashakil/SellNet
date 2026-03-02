
import React, { useState, useMemo } from 'react';
import { Product, Customer, Sale, SaleItem, CompanySettings } from '../types';

interface SalesProps {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
  onAddCustomer: (customer: Customer) => void;
  viewInvoice: (sale: Sale) => void;
  settings: CompanySettings;
}

const Sales: React.FC<SalesProps> = ({ products, customers, sales, onAddSale, onDeleteSale, onAddCustomer, viewInvoice, settings }) => {
  const [isPOS, setIsPOS] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Customer Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' });

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);
  const grandTotal = subtotal - discount;
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product out of stock!');
      return;
    }
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      setCart(cart.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.unitPrice } : i));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, qty: 1, unitPrice: product.sellingPrice, subtotal: product.sellingPrice }]);
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter(i => i.productId !== id));

  const handleCheckout = () => {
    if (!selectedCustomer) return alert('Select a customer');
    if (cart.length === 0) return alert('Cart is empty');

    const customer = customers.find(c => c.id === selectedCustomer);
    
    const newSale: Sale = {
      id: `INV-${Date.now()}`,
      customerId: selectedCustomer,
      customerName: customer?.name || 'Walk-in',
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount,
      grandTotal,
      paidAmount,
      dueAmount
    };

    onAddSale(newSale);
    setCart([]);
    setSelectedCustomer('');
    setDiscount(0);
    setPaidAmount(0);
    setIsPOS(false);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `CST-${Date.now()}`,
      ...customerForm,
      totalPurchase: 0,
      paidAmount: 0,
      dueAmount: 0
    };
    onAddCustomer(newCust);
    setSelectedCustomer(newCust.id);
    setIsCustomerModalOpen(false);
    setCustomerForm({ name: '', phone: '', address: '' });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteSale(id);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isPOS) {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="relative mb-4">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Search products to add..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => addToCart(p)}
                    className={`p-4 border rounded-xl cursor-pointer hover:border-blue-500 bg-white hover:shadow-md transition-all ${p.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                  >
                    <p className="font-bold text-gray-800 truncate">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.category}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-blue-600 font-bold">{settings.currency}{p.sellingPrice}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">New Sale</h2>
                <div className="flex mt-3 space-x-2">
                  <select 
                    className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={selectedCustomer}
                    onChange={e => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                  <button 
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Add New Customer"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-center mb-3 text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.qty} x {settings.currency}{item.unitPrice}</p>
                    </div>
                    <p className="font-bold px-3 text-gray-800">{settings.currency}{item.subtotal}</p>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center text-gray-400 py-10 italic">Cart is empty</p>}
              </div>

              <div className="p-4 bg-gray-50 rounded-b-xl border-t">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span className="font-bold text-gray-800">{settings.currency}{subtotal}</span></div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-600">Discount:</span>
                    <input type="number" className="w-20 p-1 border border-gray-300 bg-white text-gray-900 rounded text-right focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                  </div>
                  <div className="flex justify-between text-lg font-bold text-blue-700 border-t pt-2">
                    <span>Grand Total:</span>
                    <span>{settings.currency}{grandTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center pt-2">
                    <span className="text-gray-600">Paid Amount:</span>
                    <input type="number" className="w-24 p-1 border border-gray-300 bg-white rounded text-right font-bold text-green-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={paidAmount} onChange={e => setPaidAmount(Number(e.target.value))} />
                  </div>
                  <div className="flex justify-between text-sm font-bold text-red-600">
                    <span>Due Amount:</span>
                    <span>{settings.currency}{dueAmount}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setIsPOS(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors hover:bg-gray-300">Cancel</button>
                  <button onClick={handleCheckout} className="flex-[2] py-3 bg-blue-600 text-white rounded-lg font-bold shadow-blue-200 shadow-lg hover:bg-blue-700 transition-all">Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Customer Modal */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Quick Add Customer</h2>
              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 text-xs">(Optional)</span></label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-gray-400 text-xs">(Optional)</span></label>
                  <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Save & Select</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Recent Sales</h2>
        <button onClick={() => setIsPOS(true)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-colors">
          <i className="fas fa-plus"></i>
          <span>Create New Sale</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Due</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sales.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => viewInvoice(s)}>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{s.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{s.customerName}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(s.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{settings.currency}{s.grandTotal}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">{settings.currency}{s.paidAmount}</td>
                <td className="px-6 py-4 text-red-600 font-semibold">{settings.currency}{s.dueAmount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); viewInvoice(s); }} 
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-2 py-1 rounded"
                    >
                      <i className="fas fa-print mr-1"></i> Print
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, s.id)} 
                      className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded"
                      title="Delete Sale"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && <div className="p-12 text-center text-gray-400">No sales history yet.</div>}
      </div>
    </div>
  );
};

export default Sales;
