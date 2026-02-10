
import React, { useState, useEffect } from 'react';
import { INITIAL_PACKAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface DiscountItem {
  id: string;
  title: string;
  description: string;
  badge: string;
}

interface DiscountsData {
  activeDiscounts: DiscountItem[];
  footerNote: string;
}

const Discounts: React.FC = () => {
  const { t } = useLanguage();
  const [discountData, setDiscountData] = useState<DiscountsData | null>(null);

  useEffect(() => {
    fetch('/discounts.json')
      .then(res => res.json())
      .then(data => setDiscountData(data))
      .catch(err => console.error("Gagal memuat diskon:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">RAM <span className="text-blue-500">Specials</span></h1>
        <p className="text-gray-500">Penawaran terbatas untuk infrastruktur private isolated RAM Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {discountData?.activeDiscounts.map((item) => (
            <div key={item.id} className="glass p-8 rounded-[40px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                {item.badge}
              </div>
              <h2 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">{item.title}</h2>
              <p className="text-gray-400 leading-relaxed font-medium">{item.description}</p>
            </div>
          ))}
          {!discountData && <div className="animate-pulse glass h-40 rounded-[40px] bg-white/5"></div>}
        </div>

        <div className="space-y-10">
          <div className="glass p-10 rounded-[40px] border border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-black uppercase mb-8 tracking-tight text-white flex items-center">
              <i className="fas fa-tag text-blue-500 mr-4"></i>
              Harga Standar RAM
            </h3>
            <div className="space-y-4">
              {INITIAL_PACKAGES.slice(0, 6).map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-5 glass bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/5">
                  <span className="font-bold text-lg text-white">{pkg.ram}GB RAM</span>
                  <div className="text-right">
                    <span className="block font-black text-blue-400">Rp {pkg.price.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">30 Days Service</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-10 glass bg-blue-600 text-white rounded-[40px] shadow-2xl shadow-blue-500/20">
             <h4 className="font-black uppercase text-sm mb-4 tracking-[0.3em]">Customer Success</h4>
             <p className="text-sm font-medium leading-relaxed mb-8 opacity-90">
               {discountData?.footerNote || "Hubungi kami untuk penawaran khusus perusahaan."}
             </p>
             <a href="https://wa.me/628824244996" className="inline-block px-10 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition shadow-lg">Chat Admin</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts;
