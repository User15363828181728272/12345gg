
import React from 'react';
import { useCart } from '../contexts/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeFromCart, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2002] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-reveal overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 relative shadow-[0_50px_100px_rgba(0,0,0,0.9)] my-auto">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 glass-card rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/10 border-white/5"
        >
          <i className="fas fa-times text-base md:text-lg"></i>
        </button>

        <header className="mb-8 md:mb-12">
          <div className="flex items-center space-x-4 mb-4">
             <span className="h-[1px] w-6 md:w-8 bg-blue-600"></span>
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Inventory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Keranjang.</h2>
        </header>

        <div className="max-h-[350px] md:max-h-[450px] overflow-y-auto custom-scrollbar space-y-3 md:space-y-4 mb-8 md:mb-12 pr-2">
          {items.length === 0 ? (
            <div className="py-16 md:py-24 text-center glass-card rounded-[2.5rem] md:rounded-[3rem] border-white/5 border-dashed">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fas fa-shopping-basket text-white/10 text-xl md:text-2xl"></i>
              </div>
              <p className="text-[10px] md:text-sm font-black opacity-30 uppercase tracking-[0.3em] text-white">Keranjang Kosong</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center space-x-4 md:space-x-6">
                   <div className="w-10 h-10 md:w-14 md:h-14 glass-card rounded-xl md:rounded-2xl flex items-center justify-center text-blue-500 border-white/10 group-hover:blue-glow transition-all">
                      <i className="fas fa-microchip text-sm md:text-base"></i>
                   </div>
                   <div>
                      <h4 className="font-black text-sm md:text-xl text-white uppercase tracking-tight">{item.ram}GB Node</h4>
                      <p className="text-[8px] md:text-[10px] uppercase font-black text-blue-500/60 tracking-[0.2em] mt-0.5">{item.disk}GB NVMe</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4 md:space-x-8">
                  <span className="font-black text-sm md:text-xl text-white">Rp {item.price.toLocaleString()}</span>
                  <button 
                    onClick={() => removeFromCart(item.cartId)} 
                    className="w-8 h-8 md:w-10 md:h-10 glass-card rounded-lg md:rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all border-white/5 flex items-center justify-center"
                  >
                    <i className="fas fa-trash-alt text-[10px] md:text-xs"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-8 md:space-y-10">
            <div className="flex justify-between items-center border-t border-white/5 pt-8 md:pt-10">
              <div className="space-y-1">
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-white block">Total Settlement</span>
                 <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">Rp {totalPrice.toLocaleString()}</span>
              </div>
              <div className="text-right hidden sm:block">
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 block">Status</span>
                 <span className="text-[10px] md:text-xs font-bold text-green-500 uppercase flex items-center justify-end">
                    Ready <i className="fas fa-check-circle ml-2"></i>
                 </span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-5 md:py-7 btn-premium rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] shadow-[0_20px_60px_-10px_rgba(37,99,235,0.6)] hover:scale-[1.02] transition-all active:scale-95"
            >
              Check Out Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
