
import React, { useState, useEffect } from 'react';
import { Promo as PromoType } from '../types';
import { dbService } from '../services/databaseService';

const Promo: React.FC = () => {
  const [promos, setPromos] = useState<PromoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    setLoading(true);
    const data = await dbService.getPromos();
    setPromos(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black pt-48 pb-40">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center mb-24 space-y-6 animate-reveal">
          <div className="flex items-center justify-center space-x-5">
             <span className="h-[2px] w-12 bg-blue-600"></span>
             <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Global Announcements</span>
             <span className="h-[2px] w-12 bg-blue-600"></span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">Special <br/> Offers.</h1>
          <p className="text-white/40 text-lg md:text-xl font-medium tracking-tight max-w-2xl mx-auto">
             Penawaran terbatas dan pembaruan sistem eksklusif dari Depstore Cloud.
          </p>
        </header>
        
        <div className="space-y-10">
          {loading ? (
            <div className="text-center py-32 glass-card rounded-[4rem] border-white/5">
               <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-6"></i>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Scanning Promotions...</p>
            </div>
          ) : promos.length === 0 ? (
            <div className="text-center py-32 glass-card rounded-[4rem] border-white/5 border-dashed">
               <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs">Belum ada promo aktif saat ini.</p>
            </div>
          ) : (
            promos.map((promo, idx) => (
              <div 
                key={promo.id} 
                className="glass-card p-12 md:p-16 rounded-[4rem] relative overflow-hidden group border-white/5 hover:border-blue-500/30 transition-all duration-700 animate-reveal"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-colors"></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                   <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest px-4 py-1.5 glass-card rounded-full border-white/10">{promo.date}</span>
                         <span className="h-[1px] w-8 bg-white/10"></span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase group-hover:text-blue-500 transition-colors">{promo.title}</h3>
                      <p className="text-white/40 leading-relaxed text-lg font-medium max-w-3xl">{promo.content}</p>
                   </div>
                   <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:blue-glow transition-all">
                         <i className="fas fa-bolt text-2xl text-blue-500"></i>
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Promo;
