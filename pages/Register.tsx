
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

const Register: React.FC<{ setUser: (user: User | null) => void }> = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ id: Date.now().toString(), username, isAdmin: false, whatsapp });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute -bottom-20 -right-20 w-full max-w-lg aspect-square bg-blue-600/10 blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3">Join the <span className="text-blue-500">Cloud</span></h1>
          <p className="text-gray-500">Deploy high-performance servers instantly</p>
        </div>

        <div className="glass p-8 rounded-[40px] border border-white/10">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition"
                placeholder="depstore_user"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">WhatsApp Number</label>
              <input 
                type="tel" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition"
                placeholder="628..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition blue-glow">
              Register Now
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-blue-500 font-bold ml-1">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
