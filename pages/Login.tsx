
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

const Login: React.FC<{ setUser: (user: User | null) => void }> = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin credentials check as per user request
    if (username === 'DEPAN' && password === 'DEPANADM') {
      setUser({ id: 'admin-1', username: 'DEPAN', isAdmin: true });
    } else {
      setUser({ id: Date.now().toString(), username, isAdmin: false });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-blue-600/10 blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3">Welcome <span className="text-blue-500">Back</span></h1>
          <p className="text-gray-500">Login to manage your WhatsApp bot nodes.</p>
        </div>

        <div className="glass p-10 rounded-[50px] border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Username</label>
              <div className="relative">
                <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:border-blue-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition blue-glow shadow-xl shadow-blue-500/20">
              Sign In to Cloud
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-10">
            Don't have an account? <Link to="/register" className="text-blue-500 font-bold ml-1 hover:underline">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
