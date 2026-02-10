
import React, { useState, useEffect } from 'react';
import { Package } from '../types';
import { dbService } from '../services/databaseService';
import PackageCard from '../components/PackageCard';
import OrderForm from '../components/OrderForm';

const Store: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getPackages().then((pkgs) => {
      setPackages(pkgs);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-40 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-24 space-y-6 text-center md:text-left animate-reveal">
          <div className="flex items-center justify-center md:justify-start space-x-5">
            <span className="h-[2px] w-12 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
            <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em]">Infrastructure Inventory</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            Scale Your <br className="hidden md:block"/> Performance.
          </h2>
          <p className="text-white/40 text-lg md:text-2xl font-medium tracking-tight max-w-2xl">
            Choose your isolated RAM capacity. Every instance is <br className="hidden md:block"/> 
            automatically provisioned on our Jakarta cluster.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-reveal">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">Scanning Available Nodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onSelect={() => setSelectedPackage(pkg)} 
              />
            ))}
          </div>
        )}
      </div>

      {selectedPackage && (
        <OrderForm 
          pkg={selectedPackage} 
          onClose={() => setSelectedPackage(null)} 
        />
      )}
    </div>
  );
};

export default Store;
