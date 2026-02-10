
import React from 'react';

const HowToOrder: React.FC = () => {
  const steps = [
    { title: 'Choose Package', desc: 'Select your desired RAM and CPU capacity from our landing page.', icon: 'fa-box-open' },
    { title: 'Enter Details', desc: 'Provide your server name and WhatsApp number for delivery.', icon: 'fa-edit' },
    { title: 'Scan QRIS', desc: 'Scan the automatically generated QR code with any e-wallet app.', icon: 'fa-qrcode' },
    { title: 'Auto Deploy', desc: 'Our system detects payment and creates your server in seconds.', icon: 'fa-rocket' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 uppercase">How to <span className="text-blue-500">Order</span></h1>
        <p className="text-gray-500">Deployment made simple, faster than ever.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative group">
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-14 left-[80%] w-full h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent z-0"></div>
            )}
            <div className="glass p-8 rounded-3xl relative z-10 hover:border-blue-500/30 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <i className={`fas ${step.icon} text-white`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 glass p-10 rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-black mb-4">Need <span className="text-blue-500">Video Guide?</span></h2>
          <p className="text-gray-400 mb-6">Watch our 1-minute tutorial on how to use Depstore Cloud for the first time.</p>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
            <i className="fas fa-play mr-2"></i> Watch Tutorial
          </button>
        </div>
        <div className="flex-1 w-full aspect-video glass rounded-3xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 group cursor-pointer">
          <i className="fas fa-play text-5xl text-blue-500 group-hover:scale-125 transition duration-500"></i>
        </div>
      </div>
    </div>
  );
};

export default HowToOrder;
