
import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const Toast: React.FC = () => {
  const { lastAddedItem, setLastAddedItem } = useCart();

  useEffect(() => {
    if (lastAddedItem) {
      const timer = setTimeout(() => {
        setLastAddedItem(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, setLastAddedItem]);

  if (!lastAddedItem) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] animate-[slideDown_0.5s_cubic-bezier(0.16,1,0.3,1)] w-full max-w-xs px-4">
      <div className="bg-white text-black dark:bg-zinc-900 dark:text-white px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center space-x-4 border border-white/10 backdrop-blur-xl">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
          <i className="fas fa-check text-white text-xs"></i>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none mb-1">Berhasil</p>
          <p className="text-xs font-bold leading-tight">
            {lastAddedItem} ditambahkan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
