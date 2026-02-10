
import React from 'react';

const Faq: React.FC = () => {
  const items = [
    { q: "Seberapa cepat pembuatan server?", a: "Instan. Setelah pembayaran QRIS Anda terkonfirmasi oleh sistem (rata-rata 2-10 detik), alokasi resource RAM dan CPU AMD EPYC akan langsung aktif di Panel Pterodactyl secara otomatis." },
    { q: "Metode pembayaran apa yang didukung?", a: "Kami mendukung seluruh aplikasi pembayaran berbasis QRIS termasuk GoPay, OVO, DANA, ShopeePay, serta seluruh aplikasi Mobile Banking (BCA, Mandiri, BNI, dll)." },
    { q: "Apakah resource ini benar-benar terisolasi?", a: "Ya. Berbeda dengan shared hosting biasa, Depstore Cloud mengalokasikan thread CPU dan blok RAM khusus (isolated thread) untuk menjamin stabilitas bot tanpa gangguan dari pengguna lain." },
    { q: "Di mana lokasi server utama?", a: "Node utama kami beroperasi di Tier-3 Data Center Jakarta (JKT-ID) untuk memberikan latensi terendah (sub-5ms) bagi pengguna di wilayah Indonesia." }
  ];

  return (
    <div className="min-h-screen bg-black pt-48 pb-40">
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-24 space-y-6 animate-reveal">
           <div className="flex items-center justify-center space-x-5">
              <span className="h-[2px] w-12 bg-blue-600"></span>
              <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Help & Support</span>
              <span className="h-[2px] w-12 bg-blue-600"></span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">FAQ.</h1>
           <p className="text-white/40 text-lg md:text-xl font-medium tracking-tight">Semua yang perlu Anda ketahui tentang ekosistem Depstore Cloud.</p>
        </header>

        <div className="space-y-6 animate-reveal" style={{ animationDelay: '0.2s' }}>
          {items.map((item, i) => (
            <details key={i} className="glass-card rounded-[3rem] group overflow-hidden border-white/5 transition-all duration-500 open:bg-white/[0.04]">
              <summary className="p-10 cursor-pointer list-none flex items-center justify-between group-hover:bg-white/[0.02] transition-colors">
                <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-blue-500 transition-colors uppercase pr-10">{item.q}</span>
                <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center border-white/10 group-open:rotate-180 transition-transform duration-500">
                  <i className="fas fa-chevron-down text-xs text-blue-500"></i>
                </div>
              </summary>
              <div className="px-10 pb-12">
                <div className="h-[1px] w-full bg-white/5 mb-8"></div>
                <p className="text-white/40 text-lg md:text-xl leading-relaxed font-medium">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
        
        <div className="mt-24 p-12 glass-card rounded-[4rem] text-center border-white/10 border-dashed animate-reveal" style={{ animationDelay: '0.4s' }}>
           <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Punya Pertanyaan Lain?</h3>
           <p className="text-white/40 mb-10 font-medium">Operator kami tersedia 24/7 untuk membantu kebutuhan infrastruktur Anda.</p>
           <a href="https://wa.me/628824244996" target="_blank" className="inline-flex items-center space-x-4 px-12 py-5 btn-premium rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95">
              <i className="fab fa-whatsapp text-lg"></i>
              <span>Hubungi Concierge</span>
           </a>
        </div>
      </div>
    </div>
  );
};

export default Faq;
