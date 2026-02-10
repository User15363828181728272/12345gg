
import React, { useState } from 'react';
import { createDeposit, checkStatus } from '../services/paymentService';
import { useLanguage } from '../contexts/LanguageContext';

const ExtendModal: React.FC<{ server: any, onClose: () => void, onSuccess: () => void }> = ({ server, onClose, onSuccess }) => {
  const [step, setStep] = useState<'options' | 'payment' | 'success'>('options');
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { t } = useLanguage();

  const handlePay = async () => {
    setLoading(true);
    try {
      // Rp 2000 per 5 days
      const price = (days / 5) * 2000;
      const data = await createDeposit(price);
      setPaymentData(data);
      setStep('payment');
      
      // Start polling
      const poll = setInterval(async () => {
        const status = await checkStatus(data.orderId);
        if (status === 'settlement') {
          clearInterval(poll);
          setStep('success');
          onSuccess();
        }
      }, 5000);
    } catch (e) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md glass p-10 rounded-[40px] relative border border-white/5">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <i className="fas fa-times"></i>
        </button>

        {step === 'options' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase text-center">{t('extend')} RAM</h2>
            <div className="glass p-6 rounded-3xl space-y-4">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest text-center">Select Duration</label>
              <div className="grid grid-cols-2 gap-4">
                {[5, 10, 15, 20].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDays(d)}
                    className={`py-4 rounded-2xl font-black transition ${days === d ? 'bg-blue-600 text-white' : 'glass hover:bg-white/5'}`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
              <p className="text-center text-xs font-bold text-gray-500 pt-4">{t('max30Days')}</p>
            </div>
            <div className="flex justify-between items-center px-4">
              <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total Cost</span>
              <span className="text-2xl font-black text-blue-500">Rp {((days/5)*2000).toLocaleString()}</span>
            </div>
            <button 
              onClick={handlePay}
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : t('payNow')}
            </button>
          </div>
        )}

        {step === 'payment' && paymentData && (
          <div className="text-center space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest">Scan QRIS</h2>
            <div className="bg-white p-4 rounded-3xl inline-block mx-auto">
               <img src={paymentData.qrCodeUrl} className="w-64 h-64" alt="QRIS" />
            </div>
            <div className="glass p-4 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase font-black mb-1">Pay Exactly</p>
              <p className="text-2xl font-black text-blue-500">Rp {paymentData.amountToPay.toLocaleString()}</p>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold animate-pulse">Waiting for system confirmation...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
               <i className="fas fa-check text-3xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-black uppercase">Extended!</h2>
            <p className="text-gray-400">RAM has been renewed for {days} days.</p>
            <button onClick={onClose} className="w-full py-4 bg-white text-black font-black rounded-2xl">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtendModal;
