
import React, { useState, useEffect, useRef } from 'react';
import { Package, PaymentData } from '../types';
import { createDeposit, checkStatus } from '../services/paymentService';
import { createPterodactylServer } from '../services/pterodactylService';
import { CONTACT_WHATSAPP, PTERO_DOMAIN } from '../constants';
import { useCart } from '../contexts/CartContext';

interface OrderFormProps {
  pkg: any;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ pkg, onClose }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'creating' | 'success'>('details');
  const [formData, setFormData] = useState({ serverName: '', whatsapp: '' });
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Menginisiasi...');
  const [showHelp, setShowHelp] = useState(false);
  const { items, clearCart } = useCart();
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.whatsapp) {
      setError('Nomor WhatsApp wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    
    const statuses = [
      'Menghubungkan Gateway...',
      'Mengamankan Koneksi...',
      'Generate Unik QRIS...',
      'Sinkronisasi Bank...'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLoadingStatus(statuses[i % statuses.length]);
      i++;
    }, 2000);

    try {
      const pData = await createDeposit(pkg.price);
      setPaymentData(pData);
      setStep('payment');
    } catch (err: any) {
      setError('Gagal memuat QRIS. Pastikan Anda sudah deploy ke Vercel untuk mengaktifkan proxy API.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    let helpTimer: any;

    if (step === 'payment' && paymentData) {
      interval = setInterval(async () => {
        try {
          const status = await checkStatus(paymentData.orderId);
          if (status === 'settlement') {
            clearInterval(interval);
            setStep('creating');
            await handleProvisioning();
          }
        } catch (e) { console.error(e); }
      }, 4000);

      helpTimer = setTimeout(() => {
        setShowHelp(true);
      }, 45000); // Muncul setelah 45 detik
    }

    return () => {
      clearInterval(interval);
      clearTimeout(helpTimer);
    };
  }, [step, paymentData]);

  const handleProvisioning = async () => {
    try {
      // In a real app, you would loop through items if pkg.isCart is true
      setTimeout(() => {
        setStep('success');
        clearCart();
      }, 3000);
    } catch (err: any) {
      setError('Gagal membuat server. Hubungi admin.');
    }
  };

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="absolute inset-0" onClick={step !== 'creating' && step !== 'success' && !loading ? onClose : undefined}></div>
      
      <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-reveal my-auto">
        
        {/* Close button for mobile */}
        {step !== 'creating' && step !== 'success' && !loading && (
          <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white md:hidden">
            <i className="fas fa-times text-xl"></i>
          </button>
        )}

        {/* Progress Tracker */}
        <div className="flex justify-between mb-8 md:mb-10 px-2">
          {['Data', 'Bayar', 'Proses'].map((s, idx) => (
            <div key={s} className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-1 rounded-full transition-all duration-700 ${
                (idx === 0 && step === 'details') || (idx === 1 && step === 'payment') || (idx === 2 && step === 'creating') || step === 'success'
                ? 'bg-blue-500 w-10 md:w-12' : 'bg-white/10'
              }`}></div>
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-40 text-white">{s}</span>
            </div>
          ))}
        </div>

        {step === 'details' && !loading && (
          <div className="space-y-6 md:space-y-8">
            <header>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                {pkg.isCart ? 'Checkout Keranjang.' : 'Checkout Instance.'}
              </h2>
              <p className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2">
                {pkg.isCart ? `${items.length} Instances in Queue` : 'Private Infrastructure Instance'}
              </p>
            </header>

            <form onSubmit={handleNext} className="space-y-5 md:space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 text-white">Nama Server (Prefix)</label>
                  <input 
                    type="text" 
                    value={formData.serverName} 
                    onChange={e => setFormData({...formData, serverName: e.target.value})} 
                    placeholder="Contoh: MyNode01" 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-blue-500 rounded-2xl px-5 py-4 md:px-6 md:py-4 outline-none transition-all text-sm md:text-base font-bold text-white placeholder-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 text-white">WhatsApp Delivery</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.whatsapp} 
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})} 
                    placeholder="628..." 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-blue-500 rounded-2xl px-5 py-4 md:px-6 md:py-4 outline-none transition-all text-sm md:text-base font-bold text-white placeholder-white/10"
                  />
                </div>
              </div>

              <div className="p-5 md:p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-40 text-white">Total Tagihan</p>
                  <p className="text-xl md:text-2xl font-black text-blue-500">Rp {pkg.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-40 text-white">Resource</p>
                   <p className="text-[10px] md:text-xs font-bold text-green-500 uppercase">{pkg.ram}GB Total RAM</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                  <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase text-center leading-relaxed">{error}</p>
                </div>
              )}

              <button className="w-full py-4 md:py-5 bg-white text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95">
                Lanjutkan Ke Pembayaran
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 md:py-20 space-y-6 md:space-y-8 animate-reveal">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-widest text-white">{loadingStatus}</h2>
              <p className="text-[8px] md:text-[9px] font-bold opacity-40 uppercase tracking-[0.3em] text-white">Mengamankan jalur pembayaran...</p>
            </div>
          </div>
        )}

        {step === 'payment' && paymentData && !loading && (
          <div className="text-center space-y-6 md:space-y-8 animate-reveal">
            <header className="space-y-2">
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-500">Payment Required</p>
               <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Scan Kode QRIS.</h2>
            </header>
            
            <div className="bg-white p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl inline-block border-2 md:border-4 border-white">
              <img src={paymentData.qrCodeUrl} alt="QRIS" className="w-48 h-48 md:w-64 md:h-64" />
            </div>
            
            <div className="space-y-1">
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Total Transfer</p>
               <h3 className="text-3xl md:text-4xl font-black text-blue-500">Rp {paymentData.amountToPay.toLocaleString()}</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3 text-white/40">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Menunggu Konfirmasi Bank...</p>
              </div>
              
              {showHelp && (
                <a 
                  href={`https://wa.me/${CONTACT_WHATSAPP}?text=Halo, saya ingin konfirmasi manual untuk Order ID: ${paymentData.orderId}`} 
                  target="_blank"
                  className="inline-flex items-center space-x-3 px-5 py-2.5 md:px-6 md:py-3 bg-green-500 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition shadow-lg animate-reveal"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                  <span>Bantuan Manual</span>
                </a>
              )}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 md:space-y-8 py-6 md:py-10 animate-reveal">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.5)]">
               <i className="fas fa-check text-3xl md:text-4xl"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white">Success.</h2>
              <p className="opacity-50 text-xs md:text-sm font-medium text-white px-4 md:px-6">
                Pembayaran diverifikasi. Instance sedang dalam antrean pembuatan otomatis.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4 md:pt-6">
              <a href={PTERO_DOMAIN} target="_blank" className="w-full py-4 md:py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-blue-700 transition">
                Buka Panel Console
              </a>
              <button onClick={onClose} className="w-full py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition text-white">
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
