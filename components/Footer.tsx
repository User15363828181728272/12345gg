
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_TELEGRAM, CONTACT_WHATSAPP } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-20 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <i className="fas fa-cloud text-black text-[10px]"></i>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white">Depstore</span>
            </div>
            <p className="text-[#a1a1a6] text-xs leading-relaxed max-w-xs">
              Premium high-performance cloud solutions for specialized bot hosting in Indonesia.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Service</h4>
            <ul className="space-y-3 text-[11px] text-[#a1a1a6]">
              <li><Link to="/" className="hover:text-white transition">Nodes Indonesia</Link></li>
              <li><Link to="/" className="hover:text-white transition">Network Specs</Link></li>
              <li><Link to="/" className="hover:text-white transition">DDoS Mitigation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-3 text-[11px] text-[#a1a1a6]">
              <li><Link to="/faq" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/how-to-order" className="hover:text-white transition">Buying Guide</Link></li>
              <li><a href={`https://wa.me/${CONTACT_WHATSAPP}`} className="hover:text-white transition">Live Agent</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Social</h4>
            <ul className="space-y-3 text-[11px] text-[#a1a1a6]">
              <li><a href={`https://t.me/${CONTACT_TELEGRAM.replace('@','')}`} className="hover:text-white transition">Telegram</a></li>
              <li><a href={`https://wa.me/${CONTACT_WHATSAPP}`} className="hover:text-white transition">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium text-[#6e6e73]">
          <p>© 2025 Depstore Cloud. Built for stability.</p>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
