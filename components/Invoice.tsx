
import React from 'react';
import { Sale, CompanySettings } from '../types';

interface InvoiceProps {
  sale: Sale;
  settings: CompanySettings;
}

const Invoice: React.FC<InvoiceProps> = ({ sale, settings }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="no-print mb-6 space-x-4">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center"
        >
          <i className="fas fa-print mr-2"></i> Print Invoice
        </button>
      </div>

      {/* A4 Invoice Sheet */}
      <div className="bg-white w-[210mm] min-h-[297mm] p-[20mm] shadow-lg border border-gray-100 font-serif text-gray-900" id="invoice-sheet">
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-blue-600 mb-2 uppercase">{settings.storeName}</h1>
            <p className="text-sm text-gray-600 max-w-xs">{settings.address}</p>
            <p className="text-sm text-gray-600">Phone: {settings.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-4">Invoice</h2>
            <div className="text-sm">
              <p><span className="font-bold">Invoice #:</span> {sale.id}</p>
              <p><span className="font-bold">Date:</span> {new Date(sale.date).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mb-10 flex justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Bill To:</h3>
            <p className="font-bold text-lg">{sale.customerName}</p>
            <p className="text-sm text-gray-600">ID: {sale.customerId}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Payment Status:</h3>
            <p className={`font-bold uppercase ${sale.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {sale.dueAmount > 0 ? 'Partial / Unpaid' : 'Full Payment'}
            </p>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-10">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b-2 border-gray-300 font-bold uppercase text-xs">Description</th>
              <th className="p-3 border-b-2 border-gray-300 font-bold uppercase text-xs text-center">Qty</th>
              <th className="p-3 border-b-2 border-gray-300 font-bold uppercase text-xs text-right">Unit Price</th>
              <th className="p-3 border-b-2 border-gray-300 font-bold uppercase text-xs text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-center">{item.qty}</td>
                <td className="p-3 text-right">{settings.currency}{item.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-right font-bold">{settings.currency}{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-bold">{settings.currency}{sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-bold text-red-600">-{settings.currency}{sale.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t-2 border-gray-800 pt-3 text-blue-700">
              <span>Grand Total:</span>
              <span>{settings.currency}{sale.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-700 pt-2">
              <span>Paid Amount:</span>
              <span className="font-bold">{settings.currency}{sale.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600 font-bold border-t border-dashed pt-2">
              <span>Balance Due:</span>
              <span>{settings.currency}{sale.dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t pt-10 text-center text-gray-400 text-xs italic">
          <p>Thank you for your business! This is a computer-generated invoice.</p>
          <p className="mt-2 font-bold uppercase text-gray-500">Sell Net BD v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
