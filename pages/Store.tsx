import React from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Store: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
  const buyMembership = (type: 'ultimate' | 'ultimate_plus') => {
    const cost = type === 'ultimate' ? 10000 : 50000;
    if (user.credits < cost) {
      alert("Crédits insuffisants pour cette mise à niveau.");
      return;
    }

    const updatedUser = { ...user };
    if (type === 'ultimate') {
      updatedUser.isUltimate = true;
      updatedUser.boostLimit = 10;
    } else {
      updatedUser.isUltimate = true;
      updatedUser.isUltimatePlus = true;
      updatedUser.boostLimit = 25;
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
  ];

  const buyTheme = (themeId: string, cost: number) => {
    if (user.unlockedThemes?.includes(themeId)) return;
    if (user.credits < cost) {
      alert("Crédits insuffisants pour ce thème.");
      return;
    }

    const updatedUser = { ...user };
    updatedUser.unlockedThemes = [...(user.unlockedThemes || ['default']), themeId];
    updatedUser.credits -= cost;
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
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Ultimate Card */}
            <div className={`group relative p-12 rounded-[3.5rem] border transition-all duration-500 ${user.isUltimate ? 'border-emerald-500/30 bg-emerald-500/5' : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}>
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-4xl shadow-2xl">💎</div>
                {user.isUltimate && (
                  <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black rounded-full tracking-widest uppercase">Active</span>
                )}
              </div>
              <div className="space-y-4 mb-10">
                <h4 className="vibe-logo text-4xl font-black text-white tracking-tight">ULTIMATE</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Unlock advanced AI models, 10 daily boosts, and the exclusive Ultimate badge for your profile.</p>
                <div className="flex items-center gap-2 pt-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">10,000 Credits</span>
                </div>
              </div>
              {!user.isUltimate && (
                <button 
                  onClick={() => buyMembership('ultimate')} 
                  className="w-full py-6 bg-white text-black rounded-[2rem] font-black vibe-logo text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                >
                  UPGRADE NOW
                </button>
              )}
            </div>

            {/* Ultimate+ Card */}
            <div className={`group relative p-12 rounded-[3.5rem] border transition-all duration-500 ${user.isUltimatePlus ? 'border-purple-500/30 bg-purple-500/5' : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}>
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-4xl shadow-2xl">👑</div>
                {user.isUltimatePlus && (
                  <span className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[9px] font-black rounded-full tracking-widest uppercase">Active</span>
                )}
              </div>
              <div className="space-y-4 mb-10">
                <h4 className="vibe-logo text-4xl font-black text-white tracking-tight">ULTIMATE+</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">The pinnacle. Pro AI models, 25 daily boosts, and the verified certification badge.</p>
                <div className="flex items-center gap-2 pt-2">
                   <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">50,000 Credits</span>
                </div>
              </div>
              {!user.isUltimatePlus && (
                <button 
                  onClick={() => buyMembership('ultimate_plus')} 
                  className="w-full py-6 bg-purple-600 text-white rounded-[2rem] font-black vibe-logo text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                >
                  GET CERTIFIED
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
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${t.color} shadow-2xl border-2 border-white/10`} />
                    <div>
                      <p className="font-black text-white text-lg tracking-tight">{t.label}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{isUnlocked ? 'Unlocked' : `${t.cost} C`}</p>
                    </div>
                  </div>
                  {!isUnlocked && (
                    <button 
                      onClick={() => buyTheme(t.id, t.cost)}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Buy
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
