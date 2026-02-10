
import React, { useState, useEffect } from 'react';
import PackageCard from '../components/PackageCard';
import OrderForm from '../components/OrderForm';
import { Package } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { dbService } from '../services/databaseService';

const PterodactylBuy: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const data = await dbService.getPackages();
    setPackages(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Buy <span className="text-blue-500">Pterodactyl</span></h1>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
           <span className="px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">{t('period30')}</span>
           <span className="px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-gray-400 border border-white/10">{t('botOnly')}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {packages.map((pkg) => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              onSelect={() => setSelectedPackage(pkg)} 
            />
          ))}
        </div>
      )}

      {selectedPackage && (
        <OrderForm 
          pkg={selectedPackage} 
          onClose={() => setSelectedPackage(null)} 
        />
      )}
    </div>
  );
};

export default PterodactylBuy;
