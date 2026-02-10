
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-8 text-blue-500">Privacy Policy</h1>
      <div className="glass p-10 rounded-3xl text-gray-400">
        <p className="mb-4">Depstore Cloud values your privacy. We collect minimal data required to provide our services:</p>
        <div className="space-y-4">
          <div className="glass bg-white/5 p-4 rounded-xl">
            <h3 className="text-white font-bold mb-2">Registration Data</h3>
            <p>We only store your username and an encrypted version of your password.</p>
          </div>
          <div className="glass bg-white/5 p-4 rounded-xl">
            <h3 className="text-white font-bold mb-2">WhatsApp Information</h3>
            <p>Your WhatsApp number is used solely for sending deployment credentials and renewal reminders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
