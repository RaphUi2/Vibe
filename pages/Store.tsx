import React from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { THEMES } from '../constants.ts';

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
    <div className="min-h-screen animate-in fade-in duration-1000 pb-48 relative overflow-hidden" style={{ perspective: '3000px' }}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-black">
         <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-vibe-blue/10 blur-[150px] rounded-full animate-pulse-slow translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 left-0 w-[70vw] h-[70vh] bg-vibe-purple/10 blur-[130px] rounded-full animate-pulse-slow -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Hero Section */}
      <div className="px-6 py-24 text-center relative z-10" style={{ transform: 'translateZ(100px)' }}>
        <div className="relative z-10 space-y-4">
          <h2 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none vibe-logo drop-shadow-4xl animate-in slide-in-from-top-12 duration-1000">
             LA VOÛTE
          </h2>
          <div className="flex items-center justify-center gap-6 opacity-60">
             <div className="h-px w-12 bg-vibe-blue" />
             <p className="text-vibe-blue text-[10px] font-black uppercase tracking-[0.8em]">Neural Expansion Interface</p>
             <div className="h-px w-12 bg-vibe-blue" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-32 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        {/* Memberships */}
        <section className="space-y-12">
          <div className="flex items-center gap-6" style={{ transform: 'translateZ(50px)' }}>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">Programmes Nexus</h3>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Real Money Ultimate Card */}
            <div 
              style={{ transform: 'rotateY(-10deg) translateZ(50px)' }}
              className={`group relative p-12 rounded-[3.5rem] border transition-all duration-1000 shadow-4xl backdrop-blur-3xl ${user.isUltimate ? 'border-vibe-blue/30 bg-vibe-blue/5 scale-[0.98]' : 'liquid-glass border-white/10 hover:border-vibe-blue/50 hover:scale-[1.05]'}`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-vibe-blue to-vibe-purple rounded-3xl flex items-center justify-center text-3xl shadow-vibe-blue/40 border border-white/20 animate-pulse">⚡</div>
                <div className="px-4 py-1.5 bg-vibe-blue text-white text-[8px] font-black rounded-full tracking-widest uppercase shadow-vibe-blue/50 animate-bounce">TOP VALUE</div>
              </div>
              <div className="space-y-4 mb-10">
                <h4 className="text-4xl font-black text-white tracking-tighter vibe-logo">ULTIMATE PRO</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Séquenceur de Vibe complet, 15 boosts photoniques/jour & Badge Elite.</p>
                <div className="pt-4 flex items-baseline gap-2">
                   <span className="text-4xl font-black text-vibe-blue drop-shadow-vibe-blue/20">8.00€</span>
                   <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Single Pulse</span>
                </div>
              </div>
              {!user.isUltimate ? (
                <button 
                  onClick={() => buyMembership('real_money')} 
                  className="w-full py-6 bg-vibe-blue text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-vibe-blue-light transition-all shadow-vibe-blue/40 hover:shadow-vibe-blue/60 group-hover:scale-105 active:scale-95 transform-gpu"
                >
                  Démarrer la Séquence
                </button>
              ) : (
                <div className="w-full py-6 bg-vibe-blue/10 text-vibe-blue rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-center border border-vibe-blue-light/20 shadow-inner">
                  Séquence Active
                </div>
              )}
            </div>

            {/* Novas Ultimate Card */}
            <div 
              style={{ transform: 'translateZ(20px)' }}
              className={`group relative p-12 rounded-[3.5rem] border transition-all duration-1000 shadow-4xl backdrop-blur-3xl ${user.isUltimate ? 'border-white/5 bg-white/2 scale-[0.98]' : 'liquid-glass border-white/10 hover:border-white/30 hover:scale-[1.05]'}`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-3xl border border-white/10 shadow-inner">💎</div>
              </div>
              <div className="space-y-4 mb-10">
                <h4 className="text-4xl font-black text-white tracking-tighter vibe-logo">ULTIMATE</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Accès standard aux architectures Pro via Novas spectrales.</p>
                <div className="pt-4 flex items-baseline gap-2">
                   <span className="text-4xl font-black text-white drop-shadow-lg">10K</span>
                   <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Novas</span>
                </div>
              </div>
              {!user.isUltimate ? (
                <button 
                  onClick={() => buyMembership('ultimate')} 
                  className="w-full py-6 bg-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10 shadow-xl group-hover:scale-105 active:scale-95"
                >
                  Compiler (10K)
                </button>
              ) : (
                <div className="w-full py-6 bg-white/5 text-slate-600 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-center border border-white/5 shadow-inner">
                  Compilé
                </div>
              )}
            </div>

            {/* Ultimate+ Card */}
            <div 
              style={{ transform: 'rotateY(10deg) translateZ(50px)' }}
              className={`group relative p-12 rounded-[3.5rem] border transition-all duration-1000 shadow-4xl backdrop-blur-3xl ${user.isUltimatePlus ? 'border-vibe-pink/30 bg-vibe-pink/5 scale-[0.98]' : 'liquid-glass border-white/10 hover:border-vibe-pink/50 hover:scale-[1.05]'}`}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-vibe-pink/10 blur-[60px] rounded-full group-hover:bg-vibe-pink/20 transition-all duration-1000" />
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-vibe-pink to-vibe-orange rounded-3xl flex items-center justify-center text-3xl shadow-vibe-pink/40 border border-white/20 animate-pulse">👑</div>
                <div className="px-4 py-1.5 bg-vibe-pink text-white text-[8px] font-black rounded-full tracking-widest uppercase shadow-vibe-pink/50 animate-pulse">ULTRA RARE</div>
              </div>
              <div className="space-y-4 mb-10 relative z-10">
                <h4 className="text-4xl font-black text-vibe-pink tracking-tighter vibe-logo underline decoration-vibe-pink/20">ULTIMATE+</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Statut Souverain du Nexus. 30 boosts/jour, Early Accès & Aura Unique.</p>
                <div className="pt-4 flex items-baseline gap-2">
                   <span className="text-4xl font-black text-vibe-pink drop-shadow-vibe-pink/20">50K</span>
                   <span className="text-[10px] text-vibe-pink/60 font-black uppercase tracking-widest">Novas</span>
                </div>
              </div>
              {!user.isUltimatePlus ? (
                <button 
                  onClick={() => buyMembership('ultimate_plus')} 
                  className="w-full py-6 bg-vibe-pink text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-vibe-pink-light transition-all shadow-vibe-pink/40 hover:shadow-vibe-pink/60 group-hover:scale-105 active:scale-95 transform-gpu relative z-10"
                >
                  Invoquer le Statut
                </button>
              ) : (
                <div className="w-full py-6 bg-vibe-pink/10 text-vibe-pink rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-center border border-vibe-pink/20 shadow-inner relative z-10">
                  Statut Souverain
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Aesthetics */}
        <section className="space-y-12 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(80px)' }}>
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">Modules Esthétiques</h3>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {THEMES.map((theme, idx) => {
              const isUnlocked = user.unlockedThemes?.includes(theme.id);
              const isActive = user.activeTheme === theme.id;
              
              return (
                <div 
                  key={theme.id} 
                  style={{ transform: `translateZ(${idx * 5}px)` }}
                  className={`group relative p-8 rounded-[3rem] border transition-all duration-700 shadow-4xl backdrop-blur-3xl flex flex-col items-center text-center ${isActive ? 'border-vibe-blue/30 bg-vibe-blue/5 scale-[0.98]' : 'liquid-glass border-white/10 hover:border-white/30 hover:scale-[1.1] transform-gpu'}`}
                >
                  <div className={`w-20 h-20 rounded-[1.5rem] ${theme.color} mb-8 shadow-4xl border-2 border-white/20 group-hover:rotate-12 transition-transform duration-700 relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent animate-pulse-slow" />
                  </div>
                  <h4 className="font-black text-white text-[11px] uppercase tracking-[0.2em] mb-4 drop-shadow-lg">{theme.label}</h4>
                  
                  <div className="mt-auto w-full pt-4">
                    {isUnlocked ? (
                      <button 
                        onClick={() => buyTheme(theme.id, theme.cost)}
                        className={`w-full py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shadow-xl ${isActive ? 'bg-vibe-blue/20 text-vibe-blue border border-vibe-blue/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'}`}
                      >
                        {isActive ? 'INSTALLÉ' : 'ÉQUIPER'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => buyTheme(theme.id, theme.cost)}
                        className="w-full py-3 bg-white text-black rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-vibe-blue hover:text-white transition-all shadow-4xl hover:shadow-vibe-blue/40 border border-white/20 transform-gpu active:scale-95"
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
