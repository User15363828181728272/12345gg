
import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-8 text-blue-500">Terms of Service</h1>
      <div className="glass p-10 rounded-3xl prose prose-invert max-w-none text-gray-400">
        <p className="mb-4">By using Depstore Cloud, you agree to the following terms:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Illegal activities (DDoS, mining, phishing) are strictly prohibited.</li>
          <li>We are not responsible for data loss. Users are encouraged to take regular backups.</li>
          <li>Refunds are not provided for used service time.</li>
          <li>Accounts found violating terms will be suspended immediately.</li>
        </ul>
        <p>Last updated: June 2024</p>
      </div>
    </div>
  );
};

export default Terms;
