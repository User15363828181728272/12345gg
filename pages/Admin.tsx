
import React, { useState, useEffect } from 'react';
import { Package, Promo } from '../types';
import { getTotalServersCount } from '../services/pterodactylService';
import { dbService } from '../services/databaseService';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'promos' | 'status' | 'packages' | 'config'>('promos');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoContent, setPromoContent] = useState('');
  const [promos, setPromos] = useState<Promo[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [totalRAMs, setTotalRAMs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'syncing'>('syncing');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setDbStatus('syncing');
    try {
      const [pteroCount, dbPackages, dbPromos] = await Promise.all([
        getTotalServersCount(),
        dbService.getPackages(),
        dbService.getPromos()
      ]);
      setTotalRAMs(pteroCount);
      setPackages(dbPackages);
      setPromos(dbPromos);
      setDbStatus('connected');
    } catch (e) {
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePostPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo = {
      title: promoTitle,
      content: promoContent,
      date: new Date().toLocaleDateString()
    };
    
    setLoading(true);
    try {
      await dbService.addPromo(newPromo);
      setPromoTitle('');
      setPromoContent('');
      await loadAllData();
      alert('Promotion published globally!');
    } catch (e) {
      alert('Failed to save to database.');
    } finally {
      setLoading(false);
    }
  };

  const deletePromo = async (id: string) => {
    if(!confirm("Hapus promo ini secara global?")) return;
    setLoading(true);
    await dbService.deletePromo(id);
    await loadAllData();
    setLoading(false);
  };

  const updatePackagePrice = async (id: string, newPrice: number) => {
    setLoading(true);
    await dbService.updatePackage(id, { price: newPrice });
    await loadAllData();
    setLoading(false);
  };

  const toggleDiscount = async (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    
    setLoading(true);
    const newTop = !pkg.isTop;
    await dbService.updatePackage(id, { isTop: newTop });
    await loadAllData();
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center shadow-xl">
            <i className="fas fa-user-shield text-2xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Depstore <span className="text-blue-500">Central</span></h1>
            <div className="flex items-center space-x-2 mt-1">
               <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
               <p className="text-gray-400 font-medium text-[10px] uppercase tracking-widest">
                  {dbStatus === 'connected' ? 'Cloud Synchronized' : 'Database Offline'}
               </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="glass px-6 py-3 rounded-2xl border-white/5 flex flex-col items-center min-w-[150px]">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Active Servers</p>
              <div className="flex items-center space-x-2">
                <p className="text-xl font-black">{loading ? '...' : totalRAMs}</p>
                <button onClick={loadAllData} className="text-blue-500 hover:text-white transition"><i className={`fas fa-sync-alt text-xs ${loading ? 'animate-spin' : ''}`}></i></button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-2">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 ml-4">Management Menu</p>
          <button 
            onClick={() => setActiveTab('promos')}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'promos' ? 'bg-blue-600 text-white blue-glow shadow-blue-500/20' : 'glass text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <i className="fas fa-bullhorn w-5"></i>
            <span className="font-bold text-sm uppercase tracking-widest text-left">Promotions</span>
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'packages' ? 'bg-blue-600 text-white blue-glow shadow-blue-500/20' : 'glass text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <i className="fas fa-tags w-5"></i>
            <span className="font-bold text-sm uppercase tracking-widest text-left">Global Pricing</span>
          </button>
        </aside>

        <main className="lg:col-span-3">
          {activeTab === 'promos' && (
            <div className="space-y-10 animate-fadeIn text-white">
              <div className="glass p-10 rounded-[50px] border border-blue-500/10">
                <h2 className="text-2xl font-black uppercase mb-8">Post Global Promotion</h2>
                <form onSubmit={handlePostPromo} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Promo Title</label>
                    <input 
                      type="text" 
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      className="w-full glass bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition text-white"
                      placeholder="Special RAM 5GB Discount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Content Details</label>
                    <textarea 
                      rows={4}
                      value={promoContent}
                      onChange={(e) => setPromoContent(e.target.value)}
                      className="w-full glass bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition text-white"
                      placeholder="Describe your offer..."
                      required
                    />
                  </div>
                  <button disabled={loading} className="px-10 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition blue-glow text-white">
                    {loading ? 'Publishing...' : 'Publish Announcement'}
                  </button>
                </form>
              </div>

              <div className="glass p-10 rounded-[50px]">
                <h2 className="text-2xl font-black uppercase mb-8">Manage Active Promos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promos.map(promo => (
                    <div key={promo.id} className="glass bg-white/2 p-6 rounded-3xl flex items-center justify-between group border border-white/5 hover:border-white/10 transition">
                      <div className="max-w-[80%]">
                        <h4 className="font-bold text-white text-sm truncate">{promo.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{promo.date}</p>
                      </div>
                      <button onClick={() => deletePromo(promo.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="glass p-10 rounded-[50px] space-y-8 animate-fadeIn text-white">
               <h2 className="text-2xl font-black uppercase mb-8">Global RAM Pricing</h2>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                       <th className="pb-4">RAM Capacity</th>
                       <th className="pb-4">Price (IDR)</th>
                       <th className="pb-4">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {packages.map(pkg => (
                       <tr key={pkg.id}>
                         <td className="py-4 font-black">{pkg.ram}GB RAM</td>
                         <td className="py-4">
                            <input 
                              type="number"
                              defaultValue={pkg.price}
                              onBlur={(e) => updatePackagePrice(pkg.id, parseInt(e.target.value))}
                              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition text-white w-32"
                            />
                         </td>
                         <td className="py-4">
                            <button 
                              onClick={() => toggleDiscount(pkg.id)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${pkg.isTop ? 'bg-red-500/10 text-red-500' : 'bg-blue-600 text-white'}`}
                            >
                              {pkg.isTop ? 'Hapus Diskon' : 'Aktifkan Diskon'}
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               <p className="text-xs text-gray-500 italic">* Perubahan harga di sini akan langsung sinkron ke SEMUA pelanggan.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
