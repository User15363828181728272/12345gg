
import React, { useState, useEffect } from 'react';
import { PaymentData } from '../types';
import { createDeposit, checkStatus } from '../services/paymentService';
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
  const { clearCart } = useCart();
  
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

    // Validasi minimal nominal Rp 1.000 (Aturan Gateway)
    if (pkg.price < 1000) {
      setError('Minimal deposit adalah Rp 1.000. Silakan pilih paket RAM yang lebih besar atau tambahkan item ke keranjang.');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStatus('Menghubungkan Gateway...');

    try {
      const pData = await createDeposit(pkg.price);
      setPaymentData(pData);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Gagal memuat QRIS. Gateway sedang sibuk atau API Key tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (step === 'payment' && paymentData) {
      interval = setInterval(async () => {
        try {
          const status = await checkStatus(paymentData.orderId);
          const successStates = ['settlement', 'paid', 'success', 'Selesai', 'berhasil', 'success'];
          if (successStates.includes(status.toLowerCase())) {
            clearInterval(interval);
            setStep('creating');
            // Simulasi provisioning server Pterodactyl
            setTimeout(() => {
              setStep('success');
              clearCart();
            }, 4000);
          }
        } catch (e) {}
      }, 5000);

      const helpTimer = setTimeout(() => setShowHelp(true), 45000);
      return () => {
        clearInterval(interval);
        clearTimeout(helpTimer);
      };
    }
  }, [step, paymentData]);

  return (
    <div className="fixed inset-0 z-[2005] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl overflow-y-auto">
      <div className="absolute inset-0" onClick={!loading && step !== 'creating' && step !== 'success' ? onClose : undefined}></div>
      
      <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-reveal my-auto">
        
        {!loading && step !== 'creating' && step !== 'success' && (
          <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        )}

        {/* Progress Stepper */}
        <div className="flex justify-between mb-10 px-2">
          {['Input', 'Bayar', 'Proses'].map((s, idx) => (
            <div key={s} className="flex flex-col items-center space-y-2">
              <div className={`w-10 h-1 rounded-full transition-all duration-700 ${
                (idx === 0 && step === 'details') || (idx === 1 && step === 'payment') || (idx === 2 && step === 'creating') || step === 'success'
                ? 'bg-blue-500 w-12 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'
              }`}></div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40 text-white">{s}</span>
            </div>
          ))}
        </div>

        {step === 'details' && !loading && (
          <div className="space-y-8">
            <header>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Checkout Instance.</h2>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2">Private High-Performance Node</p>
            </header>

            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={formData.serverName} 
                  onChange={e => setFormData({...formData, serverName: e.target.value})} 
                  placeholder="Nama Server (Prefix: MyBot)" 
                  className="w-full bg-zinc-900 border border-white/5 focus:border-blue-500 rounded-2xl px-6 py-4 outline-none transition-all text-white font-bold"
                />
                <input 
                  type="tel" 
                  required 
                  value={formData.whatsapp} 
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})} 
                  placeholder="Nomor WhatsApp (628...)" 
                  className="w-full bg-zinc-900 border border-white/5 focus:border-blue-500 rounded-2xl px-6 py-4 outline-none transition-all text-white font-bold"
                />
              </div>

              <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-500/10 flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-40 text-white">Total Tagihan</p>
                  <p className="text-2xl font-black text-blue-500">Rp {pkg.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black uppercase tracking-widest opacity-40 text-white">Resources</p>
                   <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{pkg.ram}GB RAM / {pkg.disk}GB NVMe</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center">
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                </div>
              )}

              <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
                Lanjutkan & Generate QRIS
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 space-y-8 animate-reveal">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h2 className="text-lg font-black uppercase tracking-widest text-white">{loadingStatus}</h2>
              <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em] text-white">Mohon tunggu sebentar...</p>
            </div>
          </div>
        )}

        {step === 'payment' && paymentData && !loading && (
          <div className="text-center space-y-8 animate-reveal">
            <div className="space-y-2">
               <h2 className="text-2xl font-black tracking-tighter text-white">Scan & Bayar.</h2>
               <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Order Ref: {paymentData.orderId}</p>
            </div>
            
            <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] inline-block border-4 border-white transition-transform hover:scale-105">
              <img src={paymentData.qrCodeUrl} alt="QRIS" className="w-64 h-64 md:w-72 md:h-72 rounded-xl" />
            </div>
            
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-widest opacity-40 text-white">Nominal Yang Harus Dibayar</p>
               <h3 className="text-4xl font-black text-blue-500">Rp {paymentData.amountToPay.toLocaleString()}</h3>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Menunggu Verifikasi Gateway...</p>
              </div>
              
              {showHelp && (
                <a 
                  href={`https://wa.me/${CONTACT_WHATSAPP}?text=Konfirmasi Manual Order: ${paymentData.orderId}`} 
                  target="_blank" 
                  className="px-8 py-3 bg-green-600/10 text-green-500 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all border border-green-500/20"
                >
                  Bantuan Manual? Chat WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {step === 'creating' && (
          <div className="text-center py-20 space-y-8 animate-reveal">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fas fa-server text-blue-500 animate-pulse"></i>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black uppercase tracking-widest text-white">Deploying Instance...</h2>
              <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em] text-white">Alokasi CPU & RAM Sedang Berjalan</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-8 py-10 animate-reveal">
            <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.5)]">
               <i className="fas fa-check text-4xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Provisioned.</h2>
              <p className="text-white/40 text-[11px] mt-2 font-medium">Server Anda telah aktif secara otomatis. Detail login panel telah dikirim ke nomor WhatsApp Anda.</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href={PTERO_DOMAIN} target="_blank" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition shadow-xl">
                Buka Panel Console
              </a>
              <button onClick={onClose} className="w-full py-4 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition">
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
