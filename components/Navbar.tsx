
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CONTACT_WHATSAPP } from '../constants';
import CartModal from './CartModal';
import OrderForm from './OrderForm';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutPkg, setCheckoutPkg] = useState<any>(null);
  
  const location = useLocation();
  const { items, totalPrice } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated navigation links per request
  const navLinks = [
    { name: 'Store', path: '/store' },
    { name: 'Guide', path: '/how-to-order' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
  ];

  const handleCartCheckout = () => {
    setCartOpen(false);
    setCheckoutPkg({
      id: 'cart-checkout',
      ram: items.reduce((s, i) => s + i.ram, 0),
      disk: items.reduce((s, i) => s + i.disk, 0),
      price: totalPrice,
      isCart: true
    });
  };

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenu]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${
        scrolled ? 'py-4' : 'py-8'
      }`}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className={`flex items-center justify-between px-6 md:px-8 py-3 rounded-full border transition-all duration-700 ${
            scrolled 
            ? 'bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl' 
            : 'bg-transparent border-transparent'
          }`}>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] blue-glow">
                <i className="fas fa-bolt text-white text-xs"></i>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Depstore</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-500 ${
                    location.pathname === link.path ? 'text-blue-500' : 'text-white/40'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex px-6 py-2.5 glass-card rounded-full text-[9px] font-black uppercase tracking-widest text-green-500 hover:text-white hover:bg-green-600 border-green-500/20 transition-all"
              >
                Live Agent
              </a>

              <button 
                onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all border-white/5"
              >
                <i className="fas fa-shopping-cart text-white text-[10px]"></i>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {items.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1.5 glass-card rounded-xl border-white/10"
              >
                <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${mobileMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${mobileMenu ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${mobileMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Improved Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[2000] transition-all duration-700 lg:hidden ${
        mobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setMobileMenu(false)}></div>
        
        <div className={`absolute top-0 right-0 w-full md:w-[450px] h-full p-10 flex flex-col transition-transform duration-700 ease-expo transform ${
          mobileMenu ? 'translate-x-0' : 'translate-x-full'
        } bg-zinc-950/50 border-l border-white/5`}>
          
           <div className="flex items-center justify-between mt-4 mb-20">
              <Link to="/" onClick={() => setMobileMenu(false)} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center blue-glow">
                  <i className="fas fa-bolt text-white text-xs"></i>
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Depstore</span>
              </Link>
              <button onClick={() => setMobileMenu(false)} className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-white/40">
                <i className="fas fa-times"></i>
              </button>
           </div>

           <div className="flex flex-col space-y-4">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4 mb-2">Main Menu</p>
             {navLinks.map((link, i) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className={`group flex items-center justify-between p-6 rounded-[2rem] glass-card border-white/5 transition-all duration-500 hover:bg-white/5 ${
                    location.pathname === link.path ? 'border-blue-500/30 bg-blue-500/5' : ''
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className={`text-2xl font-black uppercase tracking-tighter ${
                    location.pathname === link.path ? 'text-blue-500' : 'text-white'
                  }`}>
                    {link.name}
                  </span>
                  <i className={`fas fa-chevron-right text-[10px] transition-transform duration-500 group-hover:translate-x-2 ${
                    location.pathname === link.path ? 'text-blue-500' : 'text-white/20'
                  }`}></i>
                </Link>
             ))}
           </div>

           <div className="mt-auto space-y-4 pt-10 border-t border-white/5">
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}`}
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-green-600 text-white shadow-[0_20px_40px_rgba(22,163,74,0.3)]"
              >
                <div className="flex items-center space-x-4">
                  <i className="fab fa-whatsapp text-2xl"></i>
                  <span className="text-lg font-black uppercase tracking-widest">Live Agent</span>
                </div>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              </a>
              
              <div className="flex justify-between items-center px-6 py-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">© 2025 DEPSTORE CLOUD</p>
                <div className="flex items-center space-x-2">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-green-500">System Online</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <CartModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onCheckout={handleCartCheckout}
      />

      {checkoutPkg && (
        <OrderForm 
          pkg={checkoutPkg} 
          onClose={() => setCheckoutPkg(null)} 
        />
      )}
    </>
  );
};

export default Navbar;
