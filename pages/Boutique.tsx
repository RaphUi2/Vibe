import React from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { THEMES } from '../constants.ts';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Zap, Crown, Sparkles, CreditCard, ShieldCheck, Trophy, Layers, Target, Package, ArrowRight } from 'lucide-react';

const Boutique: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
  const buyMembership = (type: 'ultimate' | 'ultimate_plus' | 'real_money') => {
    if (type === 'real_money') {
        const updatedUser = { ...user, isUltimate: true, boostLimit: Math.max(user.boostLimit, 10) };
        storage.updateUser(updatedUser);
        onUpdate(updatedUser);
        alert("Séquence Ultimate activée !");
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
      alert("Novas insuffisants pour ce skin.");
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
    <div className="min-h-screen bg-black text-white pb-40 overflow-x-hidden selection:bg-blue-500/30">
      {/* Immersive Header */}
      <div className="relative h-[60vh] md:h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-blue-600/10 via-transparent to-transparent"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 space-y-8"
          >
              <div className="flex items-center justify-center gap-3">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Nexus Mall v4.0</span>
                  <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
              </div>
              
              <h1 className="text-7xl md:text-[14rem] font-black leading-none tracking-tighter vibe-logo uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">
                  BOUTIQUE
              </h1>
              
              <p className="max-w-2xl mx-auto text-slate-500 font-bold text-sm md:text-lg uppercase tracking-widest leading-relaxed px-6">
                Améliorez votre résonance avec des items de classe légendaire et des packs de synchronisation neuronale.
              </p>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
          
          {/* Memberships - Redesigned to be much cooler */}
          <section className="space-y-12">
              <div className="flex items-center gap-4 px-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">HIÉRARCHIE DU NEXUS</h3>
                  <div className="flex-1 h-px bg-white/5"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pro Membership */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="glass-premium rounded-[3rem] p-8 md:p-12 relative overflow-hidden group border border-white/5"
                  >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
                      <div className="relative z-10 space-y-8">
                          <div className="flex items-center justify-between">
                              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                                  <Zap className="w-6 h-6 fill-current" />
                              </div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type-S</span>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-4xl font-black vibe-logo uppercase tracking-tighter">ULTIMATE</h4>
                              <p className="text-slate-500 text-xs font-bold leading-relaxed">Boostez votre influence : 10 Boosts/jour, Badge Pro & Accès aux zones restreintes.</p>
                          </div>
                          <div className="pt-4 flex items-end gap-2">
                              <span className="text-5xl font-black text-white">10K</span>
                              <span className="text-[10px] font-black text-blue-500 uppercase pb-1.5 underline decoration-2">NOVAS</span>
                          </div>
                          <button 
                            onClick={() => buyMembership('ultimate')}
                            className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all ${user.isUltimate ? 'bg-white/5 text-slate-600 cursor-default' : 'bg-white text-black hover:bg-blue-500 hover:text-white shadow-6xl shadow-white/5'}`}
                          >
                              {user.isUltimate ? 'SYNC ACTIVE' : 'INITIER'}
                          </button>
                      </div>
                  </motion.div>

                  {/* Ultimate+ Membership (ELITE) */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="holographic rounded-[3rem] p-8 md:p-12 relative overflow-hidden group ring-1 ring-white/10"
                  >
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>
                      <div className="relative z-10 space-y-8">
                          <div className="flex items-center justify-between">
                              <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                                  <Crown className="w-6 h-6 fill-current" />
                              </div>
                              <div className="px-3 py-1 bg-purple-500 text-white text-[8px] font-black rounded-full animate-pulse uppercase tracking-widest">ELITE STATUS</div>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-4xl font-black vibe-logo uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ULTIMATE+</h4>
                              <p className="text-white/60 text-xs font-bold leading-relaxed">Contrôle total : 25 Boosts/jour, Skin Exclusif, Avatar Animé & Priorité IA.</p>
                          </div>
                          <div className="pt-4 flex items-end gap-2">
                              <span className="text-5xl font-black text-white">50K</span>
                              <span className="text-[10px] font-black text-purple-400 uppercase pb-1.5 underline decoration-2">NOVAS</span>
                          </div>
                          <button 
                             onClick={() => buyMembership('ultimate_plus')}
                             className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all ${user.isUltimatePlus ? 'bg-purple-500/10 text-purple-400 cursor-default border border-purple-500/20' : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/20'}`}
                          >
                              {user.isUltimatePlus ? 'STATUS ELITE' : 'INVOQUER'}
                          </button>
                      </div>
                  </motion.div>

                  {/* Real Money Pass */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="glass-premium rounded-[3rem] p-8 md:p-12 relative overflow-hidden group border border-white/5 bg-gradient-to-br from-blue-600/10 tracking-widest"
                  >
                      <div className="relative z-10 space-y-8">
                          <div className="flex items-center justify-between">
                              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                  <CreditCard className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] font-black text-emerald-500 uppercase">Instant Boost</span>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-4xl font-black vibe-logo uppercase tracking-tighter">PREMIUM PASS</h4>
                              <p className="text-slate-500 text-xs font-bold leading-relaxed">Déblocage instantané de l'Ultimate Pro via transaction sécurisée.</p>
                          </div>
                          <div className="pt-4 flex items-end gap-2 text-emerald-400">
                              <span className="text-5xl font-black drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">8.99€</span>
                          </div>
                          <button 
                             onClick={() => buyMembership('real_money')}
                             className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                          >
                              {user.isUltimate ? 'DÉJÀ ACTIF' : 'ACTIVER'}
                          </button>
                      </div>
                  </motion.div>
              </div>
          </section>

          {/* Novas Packs */}
          <section className="space-y-12">
              <div className="flex items-center gap-4 px-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">RECHARGE DE CRÉDITS</h3>
                  <div className="flex-1 h-px bg-white/5"></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { amount: '2,500', price: '2.49€', icon: '✨', color: 'blue' },
                    { amount: '6,000', price: '5.99€', icon: '🌀', color: 'purple' },
                    { amount: '15,000', price: '12.99€', icon: '💎', color: 'emerald' },
                    { amount: '40,000', price: '29.99€', icon: '👑', color: 'yellow' },
                ].map((pack, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="glass-premium p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4 border border-white/5 group cursor-pointer hover:border-white/10 transition-all"
                    >
                        <div className="text-6xl group-hover:rotate-12 transition-transform duration-500">{pack.icon}</div>
                        <h4 className="text-3xl font-black text-white">{pack.amount}</h4>
                        <div className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl group-hover:bg-white text-[10px] font-black text-slate-500 group-hover:text-black transition-all">
                             {pack.price}
                        </div>
                    </motion.div>
                ))}
              </div>
          </section>

          {/* Aesthetic Themes */}
          <section className="space-y-12">
               <div className="flex items-center gap-4 px-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">MODULES ESTHÉTIQUES</h3>
                  <div className="flex-1 h-px bg-white/5"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {THEMES.map(theme => {
                      const unlocked = user.unlockedThemes?.includes(theme.id);
                      const active = user.activeTheme === theme.id;
                      return (
                        <motion.div 
                          key={theme.id}
                          whileHover={{ y: -5 }}
                          className={`glass-premium p-6 rounded-[2.5rem] flex flex-col items-center gap-4 text-center border ${active ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl ${theme.color} border-2 border-white/20 shadow-2xl relative overflow-hidden group-hover:rotate-12 transition-transform`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                            </div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/80">{theme.label}</h5>
                            
                            <button 
                              onClick={() => buyTheme(theme.id, theme.cost)}
                              className={`w-full py-2.5 rounded-xl border font-black text-[9px] transition-all px-2 ${unlocked ? (active ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-white/10 text-white border-white/10 hover:bg-white/20') : 'bg-white text-black border-white hover:bg-black hover:text-white'}`}
                            >
                                {unlocked ? (active ? 'ACTIVE' : 'EQUIP') : `${theme.cost} N`}
                            </button>
                        </motion.div>
                      );
                  })}
              </div>
          </section>
      </div>

      {/* Floating Balance */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 glass-premium px-8 py-4 rounded-full flex items-center gap-6 shadow-6xl border border-white/10 backdrop-blur-2xl">
          <div className="flex items-center gap-3 border-r border-white/10 pr-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xs shadow-glow">N</div>
              <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tes Novas</span>
                  <span className="text-xl font-black text-white">{user.credits?.toLocaleString()}</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)]">S</div>
              <div className="flex flex-col">
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Statut</span>
                  <span className="text-[10px] font-black text-white uppercase">{user.isUltimatePlus ? 'ELITE' : (user.isUltimate ? 'PRO' : 'SYNC')}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Boutique;
