
import React, { useMemo } from 'react';
import { Customer, LedgerEntry, CompanySettings } from '../types';

interface LedgerProps {
  customer: Customer;
  ledgerEntries: LedgerEntry[];
  onBack: () => void;
  settings: CompanySettings;
}

const Ledger: React.FC<LedgerProps> = ({ customer, ledgerEntries, onBack, settings }) => {
  const calculatedLedger = useMemo(() => {
    let balance = 0;
    return ledgerEntries.map(entry => {
      balance = balance + entry.debit - entry.credit;
      return { ...entry, balance };
    }).reverse(); // Latest on top
  }, [ledgerEntries]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8 no-print">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <i className="fas fa-arrow-left text-xl text-gray-600"></i>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customer Ledger</h2>
          <p className="text-sm text-gray-500">Transaction history for {customer.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Purchase</p>
          <p className="text-2xl font-black text-gray-800">{settings.currency}{customer.totalPurchase.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Paid</p>
          <p className="text-2xl font-black text-green-600">{settings.currency}{customer.paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Current Balance Due</p>
          <p className="text-2xl font-black text-red-600">{settings.currency}{customer.dueAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold">Transaction Breakdown</h3>
          <button onClick={() => window.print()} className="text-blue-600 font-bold no-print"><i className="fas fa-print mr-1"></i> Print Ledger</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Debit (+)</th>
                <th className="px-6 py-4">Credit (-)</th>
                <th className="px-6 py-4">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {calculatedLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{entry.description}</td>
                  <td className="px-6 py-4 text-red-600 font-semibold">{entry.debit > 0 ? `+${settings.currency}${entry.debit}` : '-'}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{entry.credit > 0 ? `-${settings.currency}${entry.credit}` : '-'}</td>
                  <td className="px-6 py-4 font-black">{settings.currency}{entry.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {calculatedLedger.length === 0 && (
            <div className="p-12 text-center text-gray-400">No transactions recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ledger;
