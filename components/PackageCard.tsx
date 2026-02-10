
import React from 'react';
import { Package } from '../types';
import { useCart } from '../contexts/CartContext';

interface PackageCardProps {
  pkg: Package;
  onSelect: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(pkg);
  };

  return (
    <div 
      className={`relative p-10 rounded-[3rem] glass-card flex flex-col justify-between min-h-[520px] overflow-hidden group ${
        pkg.isTop ? 'border-blue-500/30' : 'border-white/5'
      }`}
      onClick={onSelect}
    >
      {pkg.isTop && (
        <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-bl-3xl blue-glow">
          Premium
        </div>
      )}

      <div>
        <header className="mb-10">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Private Instance</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-7xl font-black tracking-tighter leading-none text-white">{pkg.ram}</h3>
            <span className="text-xl font-bold uppercase text-white/20">GB</span>
          </div>
        </header>

        <div className="space-y-6 pt-10 border-t border-white/5">
          <div className="flex justify-between items-center group/item">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/item:text-blue-500 transition-colors">Storage</span>
            <span className="text-xs font-bold text-white/60">{pkg.disk} GB NVMe</span>
          </div>
          <div className="flex justify-between items-center group/item">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/item:text-blue-500 transition-colors">Cores</span>
            <span className="text-xs font-bold text-white/60">Isolated Thread</span>
          </div>
          <div className="flex justify-between items-center group/item">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/item:text-blue-500 transition-colors">Bandwidth</span>
            <span className="text-xs font-bold text-white/60">Unlimited</span>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Total Subscription</p>
          <div className="text-3xl font-black tracking-tight text-white">
            Rp {pkg.price.toLocaleString()}
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          <button 
            onClick={onSelect}
            className="col-span-4 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-blue-600 hover:text-white active:scale-95 shadow-2xl"
          >
            Deploy
          </button>
          <button 
            onClick={handleAddToCart}
            className="py-5 glass-card rounded-2xl font-black text-[10px] transition-all border-white/5 hover:bg-white/10 flex items-center justify-center text-white"
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
