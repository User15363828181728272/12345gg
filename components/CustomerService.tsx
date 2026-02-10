
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_PACKAGES, CONTACT_WHATSAPP } from '../constants';

const CustomerService: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    {role: 'ai', content: "Selamat datang di Private Concierge Depstore Cloud. Saya asisten cerdas Anda untuk konfigurasi Private Cluster AMD EPYC. Apa yang bisa saya bantu hari ini?"}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n- (.*)/g, '<div class="flex items-start mt-2"><span class="mr-2 text-blue-500">•</span><span>$1</span></div>')
      .replace(/\n\d+\. (.*)/g, '<div class="flex items-start mt-2"><span class="mr-2 text-blue-500 font-bold">1.</span><span>$1</span></div>')
      .split('\n\n').join('<div class="h-4"></div>')
      .split('\n').join('<br/>');
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const model = 'gemini-3-flash-preview';
      
      const systemInstruction = `
        Anda adalah Private Concierge AI profesional untuk Depstore Cloud.
        Informasi Produk Utama:
        - Produk: 100% Private Isolated Instance (bukan shared).
        - Use Case: Bot WhatsApp, Telegram, Discord, Scrapers.
        - Lokasi: Jakarta (JKT-ID-Tier3).
        - Hardware: AMD EPYC C6R12, NVMe Gen 4.
        - Harga:
          ${INITIAL_PACKAGES.map(p => `- ${p.ram}GB: Rp ${p.price.toLocaleString()}`).join('\n')}
        Tone: Eksklusif, sangat cerdas, sangat membantu, teknis tapi ramah.
        Penting: Selalu tekankan kata 'PRIVATE' dan 'ISOLATED'. Jika pengguna bertanya tentang 'Live Agent' manusia, arahkan mereka untuk klik tombol WhatsApp di pojok kanan bawah chat ini.
      `;

      const chatHistory = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const responseStream = await ai.models.generateContentStream({
        model,
        contents: [...chatHistory, { role: 'user', parts: [{ text: userMsg }] }],
        config: { systemInstruction }
      });

      let fullAiResponse = '';
      setMessages(prev => [...prev, { role: 'ai', content: '' }]);

      for await (const chunk of responseStream) {
        fullAiResponse += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullAiResponse;
          return updated;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sinyal concierge terganggu. Silakan hubungi operator kami via WhatsApp: 628824244996." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1001] flex flex-col items-end space-y-4">
      {/* Floating Action Buttons */}
      <div className="flex flex-col space-y-3">
        {/* Direct WhatsApp / Human Live Agent Button */}
        <a 
          href={`https://wa.me/${CONTACT_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-[0_15px_40px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform active:scale-95 group relative"
          title="Chat with Human Agent"
        >
          <i className="fab fa-whatsapp text-2xl"></i>
          <span className="absolute right-16 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            Live Agent (Human)
          </span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black flex items-center justify-center animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        </a>

        {/* AI Concierge Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] transition-all duration-700 transform ${
              isOpen 
              ? 'rotate-[135deg] bg-zinc-900 border border-white/10' 
              : 'bg-white text-black hover:rotate-6 hover:scale-110'
          } group relative`}
          title="Chat with AI Concierge"
        >
          <i className={`fas ${isOpen ? 'fa-plus' : 'fa-robot'} text-xl`}></i>
          {!isOpen && (
            <span className="absolute right-16 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
              AI Concierge
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute bottom-36 right-0 w-[90vw] sm:w-[450px] h-[650px] bg-[#0c0c0e] border border-white/10 rounded-[3rem] flex flex-col overflow-hidden animate-reveal shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                <i className="fas fa-robot text-lg"></i>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Private Concierge</h4>
                <div className="flex items-center space-x-2 mt-1">
                   <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                   <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Neural Mode Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition">
              <i className="fas fa-times text-white/30"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`max-w-[90%] p-6 rounded-[2rem] text-[13px] leading-relaxed shadow-2xl ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'bg-white/[0.04] border border-white/10 text-white/80'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content) }} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/[0.04] border border-white/10 px-6 py-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-white/5 bg-black/60 flex flex-col space-y-4">
            <div className="flex justify-center">
              <a 
                href={`https://wa.me/${CONTACT_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-widest border border-green-500/20 transition-all active:scale-95"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                <span>Hubungi Live Agent (Manusia)</span>
              </a>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanyakan konfigurasi private..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-[1.8rem] pl-8 pr-16 py-5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-white/20"
              />
              <button 
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 transition active:scale-95 shadow-2xl"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerService;
