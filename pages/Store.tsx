import React from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Store: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
  const buyMembership = (type: 'ultimate' | 'ultimate_plus' | 'real_money') => {
    if (type === 'real_money') {
        const updatedUser = { ...user, isUltimate: true, boostLimit: Math.max(user.boostLimit, 10) };
        storage.updateUser(updatedUser);
        onUpdate(updatedUser);
        alert("Ultimate activé via paiement sécurisé !");
        return;
    }

    const cost = type === 'ultimate' ? 10000 : 50000;
    if (user.credits < cost) {
      alert("Crédits insuffisants pour cette mise à niveau.");
      return;
    }

    const updatedUser = { ...user };
    if (type === 'ultimate') {
      updatedUser.isUltimate = true;
      updatedUser.boostLimit = Math.max(user.boostLimit, 10);
    } else {
      updatedUser.isUltimate = true;
      updatedUser.isUltimatePlus = true;
      updatedUser.boostLimit = Math.max(user.boostLimit, 25);
    }
    updatedUser.credits -= cost;
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
  };

  const themes = [
    { id: 'neon', label: 'Cyber Pink', cost: 500, color: 'bg-pink-500' },
    { id: 'gold', label: 'Elite Gold', cost: 2000, color: 'bg-amber-500' },
    { id: 'matrix', label: 'Digital Green', cost: 1000, color: 'bg-emerald-500' },
    { id: 'ruby', label: 'Crimson Red', cost: 1000, color: 'bg-rose-500' },
    { id: 'cyber_ocean', label: 'Cyber Ocean', cost: 1500, color: 'bg-blue-500' },
    { id: 'neon_pink', label: 'Neon Pink', cost: 1500, color: 'bg-fuchsia-500' },
    { id: 'emerald', label: 'Emerald', cost: 1500, color: 'bg-emerald-400' },
  ];

  const buyTheme = (themeId: string, cost: number) => {
    if (user.unlockedThemes?.includes(themeId)) {
      const updatedUser = { ...user, activeTheme: themeId };
      storage.updateUser(updatedUser);
      onUpdate(updatedUser);
      return;
    }
    if (user.credits < cost) {
      alert("Crédits insuffisants pour ce thème.");
      return;
    }

    const updatedUser = { ...user };
    updatedUser.unlockedThemes = [...(user.unlockedThemes || ['default']), themeId];
    updatedUser.credits -= cost;
    updatedUser.activeTheme = themeId;
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
  };

  return (
    <div className="min-h-screen bg-[#020617] animate-in fade-in duration-700 pb-40">
      {/* Hero Section */}
      <div className="px-6 py-20 border-b border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <h2 className="vibe-logo text-7xl font-black text-white uppercase tracking-tighter leading-none">THE VAULT</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Upgrade your neural presence</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* Memberships */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h3 className="vibe-logo text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Memberships</h3>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Real Money Ultimate Card */}
            <div className={`group relative p-10 rounded-[3.5rem] border transition-all duration-500 ${user.isUltimate ? 'border-blue-500/30 bg-blue-500/5' : 'bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20 hover:border-blue-500/40'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">⚡</div>
                <span className="px-3 py-1 bg-blue-500 text-white text-[8px] font-black rounded-md tracking-widest uppercase">Best Value</span>
              </div>
              <div className="space-y-3 mb-8">
                <h4 className="vibe-logo text-3xl font-black text-white tracking-tight">ULTIMATE PRO</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Accès complet à Aura Pro, 10 boosts quotidiens et badge certifié.</p>
                <div className="pt-2">
                   <span className="text-2xl font-black text-white">8.00€</span>
                   <span className="text-[10px] text-slate-500 ml-2">une seule fois</span>
                </div>
              </div>
              {!user.isUltimate ? (
                <button 
                  onClick={() => buyMembership('real_money')} 
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl"
                >
                  ACHETER MAINTENANT
                </button>
              ) : (
                <div className="w-full py-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-[2rem] font-black text-[10px] text-center uppercase tracking-widest">DÉBLOQUÉ</div>
              )}
            </div>

            {/* Ultimate Card (Credits) */}
            <div className={`group relative p-10 rounded-[3.5rem] border transition-all duration-500 ${user.isUltimate ? 'border-emerald-500/30 bg-emerald-500/5' : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">💎</div>
              </div>
              <div className="space-y-3 mb-8">
                <h4 className="vibe-logo text-3xl font-black text-white tracking-tight">ULTIMATE</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Débloquez les modèles AI avancés et 10 boosts quotidiens via vos crédits.</p>
                <div className="pt-2">
                   <span className="text-2xl font-black text-white">10,000</span>
                   <span className="text-[10px] text-slate-500 ml-2 uppercase tracking-widest">Crédits</span>
                </div>
              </div>
              {!user.isUltimate && (
                <button 
                  onClick={() => buyMembership('ultimate')} 
                  className="w-full py-5 bg-white text-black rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  UPGRADE
                </button>
              )}
            </div>

            {/* Ultimate+ Card */}
            <div className={`group relative p-10 rounded-[3.5rem] border transition-all duration-500 ${user.isUltimatePlus ? 'border-purple-500/30 bg-purple-500/5' : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">👑</div>
              </div>
              <div className="space-y-3 mb-8">
                <h4 className="vibe-logo text-3xl font-black text-white tracking-tight">ULTIMATE+</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Le summum du Nexus. Modèles Pro+, 25 boosts et certification Elite.</p>
                <div className="pt-2">
                   <span className="text-2xl font-black text-white">50,000</span>
                   <span className="text-[10px] text-slate-500 ml-2 uppercase tracking-widest">Crédits</span>
                </div>
              </div>
              {!user.isUltimatePlus && (
                <button 
                  onClick={() => buyMembership('ultimate_plus')} 
                  className="w-full py-5 bg-purple-600 text-white rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest hover:bg-purple-500 transition-all shadow-xl"
                >
                  GET ELITE
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Themes */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h3 className="vibe-logo text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Neural Themes</h3>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {themes.map(t => {
              const isUnlocked = user.unlockedThemes?.includes(t.id);
              return (
                <div key={t.id} className={`p-8 rounded-[2.5rem] border flex items-center justify-between transition-all duration-300 ${isUnlocked ? 'border-emerald-500/20 bg-emerald-500/5' : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${t.color} shadow-2xl border-2 border-white/10`} />
                    <div>
                      <p className="font-black text-white text-lg tracking-tight">{t.label}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{isUnlocked ? (user.activeTheme === t.id ? 'Active' : 'Unlocked') : `${t.cost} C`}</p>
                    </div>
                  </div>
                  {(!isUnlocked || user.activeTheme !== t.id) && (
                    <button 
                      onClick={() => buyTheme(t.id, t.cost)}
                      className={`px-8 py-4 border rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isUnlocked ? 'bg-blue-500 border-blue-400 text-white hover:bg-blue-400' : 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black'}`}
                    >
                      {isUnlocked ? 'Apply' : 'Buy'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Store;
