
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const WelcomeToast: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAction = () => {
    // Navigate to RAM store
    navigate('/store');
    onClose();
  };

  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-96 z-[100] animate-[slideUp_0.5s_ease-out]">
      <div className="glass p-6 rounded-[32px] border border-blue-500/30 bg-[#050505] shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <i className="fas fa-times"></i>
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center blue-glow">
            <i className="fas fa-star text-white text-xl"></i>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">Top Choice RAM</h4>
            <p className="text-gray-400 text-xs mt-1">
              Dapatkan RAM 5GB Premium hanya Rp 12.000 untuk 30 Hari!
            </p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button onClick={handleAction} className="flex-1 bg-white text-black py-2 rounded-xl text-center text-xs font-bold hover:bg-blue-600 hover:text-white transition">Ambil Promo</button>
          <button onClick={onClose} className="flex-1 glass py-2 rounded-xl text-xs font-bold hover:bg-white/5 transition">Tutup</button>
        </div>
        <div className="mt-3 text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest">
           {t('botOnly')}
        </div>
      </div>
    </div>
  );
};

export default WelcomeToast;
