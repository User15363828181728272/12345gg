
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { getClientServers } from '../services/pterodactylService';
import { useLanguage } from '../contexts/LanguageContext';
import ExtendModal from '../components/ExtendModal';
import { PTERO_DOMAIN } from '../constants';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [extendingServer, setExtendingServer] = useState<any | null>(null);
  const { t } = useLanguage();

  const fetchServers = async () => {
    setLoading(true);
    const data = await getClientServers();
    setServers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-40 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 animate-reveal">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
               <span className="h-[2px] w-12 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
               <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Central Network Control</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white">Depstore Cloud.</h1>
            <p className="text-white/40 text-lg md:text-2xl font-medium tracking-tight max-w-3xl leading-relaxed">
              Infrastruktur Private terisolasi dengan performa AMD EPYC Gen-4. <br className="hidden md:block" />
              Kelola node Anda dengan latensi rendah dan keamanan tingkat enterprise.
            </p>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={fetchServers} className="glass-card px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border-white/5 hover:bg-white/10 flex items-center">
               <i className={`fas fa-sync-alt mr-3 text-blue-500 ${loading ? 'animate-spin' : ''}`}></i>
               Sinkronisasi Node
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-8 animate-reveal">
            <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[80px] -z-10"></div>
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center font-black text-3xl text-white blue-glow mb-8 shadow-2xl">
                {user.username[0].toUpperCase()}
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{user.username}</h3>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mb-10">Operator ID: {user.id.slice(-8)}</p>
              
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>Aktif Node</span>
                  <span className="text-white">{servers.length}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>Region</span>
                  <span className="text-blue-500">Jakarta JKT-ID</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6">Status Sistem</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-white/40 uppercase">Network</span>
                     <span className="text-[9px] font-black text-green-500 uppercase">Optimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-white/40 uppercase">API Gateway</span>
                     <span className="text-[9px] font-black text-green-500 uppercase">Online</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 animate-reveal" style={{ animationDelay: '0.2s' }}>
            {loading && servers.length === 0 ? (
              <div className="h-64 glass-card rounded-[3.5rem] flex flex-col items-center justify-center border-white/5">
                <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-6"></i>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Menghubungkan ke Cluster...</p>
              </div>
            ) : servers.length === 0 ? (
              <div className="glass-card p-24 rounded-[4rem] text-center border-dashed border-white/10 flex flex-col items-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                   <i className="fas fa-server text-white/10 text-3xl"></i>
                </div>
                <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Instance Kosong.</h2>
                <p className="text-white/30 text-sm font-medium mb-10 max-w-sm">Belum ada resource private yang dialokasikan untuk akun ini.</p>
                <Link to="/store" className="inline-block px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                  Deploy RAM Sekarang
                </Link>
              </div>
            ) : (
              servers.map(server => (
                <div key={server.id} className="glass-card p-10 rounded-[4rem] group border-white/5 hover:border-blue-500/30 transition-all duration-700 hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-8">
                      <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-blue-500 text-2xl border-white/10 group-hover:blue-glow group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                        <i className="fas fa-microchip"></i>
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-white group-hover:text-blue-500 transition-colors duration-500">{server.name}</h3>
                        <div className="flex items-center space-x-6 mt-2">
                          <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Alokasi: {server.limits.memory}MB</span>
                          <span className="text-[10px] text-green-500 uppercase font-black tracking-widest flex items-center">
                             <span className="w-2 h-2 rounded-full bg-green-500 mr-2.5 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> 
                             {server.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right px-8 border-r border-white/10">
                         <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Masa Aktif</p>
                         <p className="text-xl font-black text-white">{server.daysRemaining} Hari</p>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setExtendingServer(server)}
                          className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-xl active:scale-95"
                        >
                          Perpanjang
                        </button>
                        <a 
                          href={`${PTERO_DOMAIN}/server/${server.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border-white/10 group/link"
                        >
                          <i className="fas fa-external-link-alt text-white/20 group-hover/link:text-white transition-colors"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {extendingServer && (
        <ExtendModal 
          server={extendingServer} 
          onClose={() => setExtendingServer(null)} 
          onSuccess={fetchServers}
        />
      )}
    </div>
  );
};

export default Dashboard;
