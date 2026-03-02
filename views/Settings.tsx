
import React, { useState } from 'react';
import { CompanySettings } from '../types';

interface SettingsProps {
  settings: CompanySettings;
  setSettings: React.Dispatch<React.SetStateAction<CompanySettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    alert('Settings updated successfully!');
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-bold mb-8 flex items-center text-gray-800">
        <i className="fas fa-store-alt mr-3 text-blue-600"></i>
        Shop Identity & Configuration
      </h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Business Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.storeName}
              onChange={e => setFormData({...formData, storeName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Contact Phone</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Store Address</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows={3}
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Currency Symbol</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.currency}
              onChange={e => setFormData({...formData, currency: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-100 transition-all"
          >
            Update Business Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
