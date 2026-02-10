
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTotalServersCount } from '../services/pterodactylService';

const Landing: React.FC = () => {
  const [activeServers, setActiveServers] = useState<number>(0);
  const [typedText, setTypedText] = useState('');
  const fullText = "The next generation of isolated private infrastructure.";

  useEffect(() => {
    getTotalServersCount().then(setActiveServers);
    
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Lighting */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square bg-blue-600/10 blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square bg-blue-500/5 blur-[180px] rounded-full"></div>
      </div>

      <section className="container mx-auto px-6 pt-48 md:pt-64 pb-32 flex flex-col items-center text-center">
        <div className="space-y-12 max-w-6xl w-full animate-reveal">
          <div className="inline-flex items-center space-x-4 px-6 py-2.5 rounded-full glass-card border-white/5 bg-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Elite Private Cluster Online
            </span>
          </div>
          
          <h1 className="text-6xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-white">
            depstore<br className="hidden md:block"/> Cloud.
          </h1>
          
          <div className="h-12 flex items-center justify-center">
            <p className="text-white/40 text-sm md:text-xl font-medium tracking-tight max-w-2xl">
              {typedText}<span className="text-blue-500 font-bold animate-pulse">_</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link to="/store" className="w-full sm:w-auto px-16 py-6 rounded-3xl btn-premium text-xs">
              Start Building
            </Link>
            <Link to="/how-to-order" className="w-full sm:w-auto px-16 py-6 glass-card rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] text-white border-white/10 hover:bg-white/5">
              Documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 glass-card p-12 md:p-20 rounded-[4rem] flex flex-col justify-end min-h-[450px]">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20 mb-10 blue-glow">
              <i className="fas fa-shield-halved text-3xl text-blue-500"></i>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">True Isolation.</h3>
              <p className="text-white/40 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                Experience consistent sub-5ms latency and 100% resource dedication. No shared cores, no compromises.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 glass-card p-12 md:p-16 rounded-[4rem] flex flex-col justify-between group">
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Global Cluster</span>
                <h3 className="text-3xl font-black tracking-tight text-white">Jakarta JKT-ID <br/> Tier-3 Stack</h3>
            </div>
            <div className="mt-12 space-y-6">
               <div className="flex items-center justify-between text-white/40 border-b border-white/5 pb-4">
                 <span className="text-xs font-bold uppercase tracking-widest">Network Speed</span>
                 <span className="text-xs font-black text-white">10 Gbps</span>
               </div>
               <div className="flex items-center justify-between text-white/40">
                 <span className="text-xs font-bold uppercase tracking-widest">DDoS Protection</span>
                 <span className="text-xs font-black text-white">Enterprise</span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
