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
      alert("Novas insuffisants pour cette mise à niveau.");
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
    { id: 'neon_pink', label: 'Cyber Pink', cost: 500, color: 'bg-pink-500' },
    { id: 'gold', label: 'Elite Gold', cost: 2000, color: 'bg-amber-500' },
    { id: 'emerald', label: 'Digital Green', cost: 1000, color: 'bg-emerald-500' },
    { id: 'ruby', label: 'Crimson Red', cost: 1000, color: 'bg-rose-500' },
    { id: 'cyber_ocean', label: 'Cyber Ocean', cost: 1500, color: 'bg-blue-500' },
  ];

  const buyTheme = (themeId: string, cost: number) => {
    if (user.unlockedThemes?.includes(themeId)) {
      const updatedUser = { ...user, activeTheme: themeId };
      storage.updateUser(updatedUser);
      onUpdate(updatedUser);
      return;
    }
    if (user.credits < cost) {
      alert("Novas insuffisants pour ce thème.");
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
    <div className="min-h-screen bg-[#020617] animate-in fade-in duration-700 pb-40 relative" style={{ perspective: '1200px' }}>
      {/* Hero Section */}
      <div className="px-6 py-20 border-b border-white/5 text-center relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <h2 className="vibe-logo text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase tracking-tighter leading-none drop-shadow-2xl">THE VAULT</h2>
          <p className="text-blue-400/80 text-[10px] font-black uppercase tracking-[0.5em] drop-shadow-md">Upgrade your neural presence</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
        {/* Memberships */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h3 className="vibe-logo text-xs font-black text-blue-400 uppercase tracking-[0.3em] drop-shadow-md">Memberships</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Real Money Ultimate Card */}
            <div className={`group relative p-10 rounded-[3rem] border transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl ${user.isUltimate ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-indigo-900/20 scale-[0.98]' : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02]'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-300/50">⚡</div>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-black rounded-full tracking-widest uppercase shadow-lg border border-blue-400/50">Best Value</span>
              </div>
              <div className="space-y-3 mb-8">
                <h4 className="vibe-logo text-3xl font-black text-white tracking-tight drop-shadow-md">ULTIMATE PRO</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Accès complet à Aura Pro, 10 boosts quotidiens et badge certifié.</p>
                <div className="pt-2 flex items-baseline gap-2">
                   <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-md">8.00€</span>
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">une seule fois</span>
                </div>
              </div>
              {!user.isUltimate ? (
                <button 
                  onClick={() => buyMembership('real_money')} 
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] border border-blue-400/50 hover:scale-[1.02] active:scale-95"
                >
                  Activer Ultimate
                </button>
              ) : (
                <div className="w-full py-5 bg-blue-500/20 text-blue-400 rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest text-center border border-blue-500/30 shadow-inner">
                  Déjà Actif
                </div>
              )}
            </div>

            {/* Novas Ultimate Card */}
            <div className={`group relative p-10 rounded-[3rem] border transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl ${user.isUltimate ? 'border-slate-700/50 bg-slate-800/20 scale-[0.98]' : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-slate-400/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02]'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-600/50">💎</div>
              </div>
              <div className="space-y-3 mb-8">
                <h4 className="vibe-logo text-3xl font-black text-white tracking-tight drop-shadow-md">ULTIMATE</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Les mêmes avantages, payables avec vos Novas durement gagnés.</p>
                <div className="pt-2 flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white drop-shadow-md">10K</span>
                   <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Novas</span>
                </div>
              </div>
              {!user.isUltimate ? (
                <button 
                  onClick={() => buyMembership('ultimate')} 
                  className="w-full py-5 bg-white/10 text-white rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  Acheter (10K N)
                </button>
              ) : (
                <div className="w-full py-5 bg-slate-800/50 text-slate-500 rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest text-center border border-slate-700/50 shadow-inner">
                  Déjà Actif
                </div>
              )}
            </div>

            {/* Ultimate+ Card */}
            <div className={`group relative p-10 rounded-[3rem] border transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl ${user.isUltimatePlus ? 'border-fuchsia-500/50 bg-gradient-to-br from-fuchsia-500/20 to-purple-900/20 scale-[0.98]' : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-fuchsia-400/50 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:scale-[1.02]'}`}>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-fuchsia-500/20 blur-[30px] rounded-full group-hover:bg-fuchsia-500/40 transition-all duration-700"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(217,70,239,0.5)] border border-fuchsia-400/50">👑</div>
                <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[8px] font-black rounded-full tracking-widest uppercase shadow-lg border border-fuchsia-400/50 animate-pulse">Exclusif</span>
              </div>
              <div className="space-y-3 mb-8 relative z-10">
                <h4 className="vibe-logo text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 tracking-tight drop-shadow-md">ULTIMATE+</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Le statut ultime. 25 boosts/jour, accès anticipé, badge exclusif.</p>
                <div className="pt-2 flex items-baseline gap-2">
                   <span className="text-3xl font-black text-fuchsia-400 drop-shadow-md">50K</span>
                   <span className="text-[10px] text-fuchsia-400/70 font-black uppercase tracking-widest">Novas</span>
                </div>
              </div>
              {!user.isUltimatePlus ? (
                <button 
                  onClick={() => buyMembership('ultimate_plus')} 
                  className="w-full py-5 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest hover:from-fuchsia-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] border border-fuchsia-400/50 relative z-10 hover:scale-[1.02] active:scale-95"
                >
                  Acheter (50K N)
                </button>
              ) : (
                <div className="w-full py-5 bg-fuchsia-500/20 text-fuchsia-400 rounded-[2rem] font-black vibe-logo text-[10px] uppercase tracking-widest text-center border border-fuchsia-500/30 shadow-inner relative z-10">
                  Déjà Actif
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Themes */}
        <section className="space-y-10 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
          <div className="flex items-center gap-4">
            <h3 className="vibe-logo text-xs font-black text-fuchsia-400 uppercase tracking-[0.3em] drop-shadow-md">Aesthetics</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-500/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {themes.map(theme => {
              const isUnlocked = user.unlockedThemes?.includes(theme.id);
              const isActive = user.activeTheme === theme.id;
              
              return (
                <div key={theme.id} className={`group relative p-6 rounded-[2.5rem] border transition-all duration-500 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center text-center ${isActive ? 'border-fuchsia-500/50 bg-gradient-to-b from-fuchsia-500/10 to-purple-900/20 scale-[0.98]' : 'bg-gradient-to-b from-white/10 to-white/5 border-white/20 hover:border-fuchsia-400/50 hover:shadow-[0_0_25px_rgba(217,70,239,0.2)] hover:scale-[1.05]'}`}>
                  <div className={`w-16 h-16 rounded-2xl ${theme.color} mb-6 shadow-2xl border-2 border-white/20 group-hover:scale-110 transition-transform duration-500`} />
                  <h4 className="font-black text-white text-sm mb-2 drop-shadow-md">{theme.label}</h4>
                  
                  <div className="mt-auto pt-4 w-full">
                    {isUnlocked ? (
                      <button 
                        onClick={() => buyTheme(theme.id, theme.cost)}
                        className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                      >
                        {isActive ? 'Actif' : 'Équiper'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => buyTheme(theme.id, theme.cost)}
                        className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:from-fuchsia-500 hover:to-purple-500 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] border border-fuchsia-400/50 hover:scale-[1.02] active:scale-95"
                      >
                        {theme.cost} N
                      </button>
                    )}
                  </div>
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
