
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

  const navLinks = [
    { name: 'Store', path: '/store' },
    { name: 'Order Guide', path: '/how-to-order' },
    { name: 'Discounts', path: '/discounts' },
    { name: 'Dashboard', path: '/dashboard' },
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

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${
        scrolled ? 'py-4' : 'py-8'
      }`}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className={`flex items-center justify-between px-8 py-3 rounded-full border transition-all duration-700 ${
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

            <div className="hidden md:flex items-center space-x-10">
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
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] font-black uppercase tracking-[0.2em] transition-all text-green-500 hover:text-green-400"
              >
                Live Agent
              </a>
            </div>

            <div className="flex items-center space-x-4">
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

              <Link 
                to="/admin" 
                className="hidden sm:flex px-6 py-2.5 glass-card rounded-full text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white border-white/5"
              >
                Admin
              </Link>

              <button 
                onClick={() => setMobileMenu(true)}
                className="md:hidden flex flex-col space-y-1 w-5 items-end py-2"
              >
                <span className="h-0.5 w-full bg-white rounded-full"></span>
                <span className="h-0.5 w-3/4 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[2000] transition-all duration-500 md:hidden ${
        mobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setMobileMenu(false)}></div>
        <div className={`absolute top-0 right-0 w-[80%] h-full p-12 transition-transform duration-700 transform ${
          mobileMenu ? 'translate-x-0' : 'translate-x-full'
        } bg-zinc-950`}>
           <div className="flex flex-col space-y-10 mt-20">
             {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className="text-3xl font-black uppercase tracking-tighter text-white hover:text-blue-500 transition-colors"
                >
                  {link.name}
                </Link>
             ))}
             <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}`}
                className="text-3xl font-black uppercase tracking-tighter text-green-500 hover:text-green-400"
              >
                Live Agent
              </a>
           </div>
           <button onClick={() => setMobileMenu(false)} className="absolute top-8 right-8 text-xl opacity-30 text-white"><i className="fas fa-times"></i></button>
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
