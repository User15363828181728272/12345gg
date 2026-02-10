
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Store from './pages/Store';
import Faq from './pages/Faq';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import HowToOrder from './pages/HowToOrder';
import Dashboard from './pages/Dashboard';
import Promo from './pages/Promo';
import Admin from './pages/Admin';
import PterodactylBuy from './pages/PterodactylBuy';
import Discounts from './pages/Discounts';
import CustomerService from './components/CustomerService';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/store" element={<Store />} />
            <Route path="/buy-pterodactyl" element={<PterodactylBuy />} />
            <Route path="/how-to-order" element={<HowToOrder />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dashboard" element={<Dashboard user={{ id: 'guest', username: 'Guest', isAdmin: true }} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
        <CustomerService />
        <Toast />
      </div>
    </Router>
  );
};

export default App;
