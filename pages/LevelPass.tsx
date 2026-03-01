
import React, { useState, useEffect } from 'react';
import { User, LevelPass } from '../types.ts';
import { storage } from '../services/storageService.ts';

const LevelPassPage: React.FC<{ user: User, onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  const [passes, setPasses] = useState<LevelPass[]>([]);

  useEffect(() => {
    const p: LevelPass[] = [
      { level: 1, xpRequired: 0, rewardType: 'credits', rewardValue: 500, isPremium: false },
      { level: 2, xpRequired: 1000, rewardType: 'credits', rewardValue: 1000, isPremium: false },
      { level: 3, xpRequired: 2000, rewardType: 'theme', rewardValue: 'neon_pink', isPremium: true },
      { level: 4, xpRequired: 3000, rewardType: 'credits', rewardValue: 1500, isPremium: false },
      { level: 5, xpRequired: 4000, rewardType: 'badge', rewardValue: 'Débutant', isPremium: false },
      { level: 6, xpRequired: 5000, rewardType: 'boost_limit', rewardValue: 1, isPremium: true },
      { level: 7, xpRequired: 6000, rewardType: 'credits', rewardValue: 2000, isPremium: false },
      { level: 8, xpRequired: 7000, rewardType: 'theme', rewardValue: 'cyber_ocean', isPremium: true },
      { level: 9, xpRequired: 8000, rewardType: 'credits', rewardValue: 2500, isPremium: false },
      { level: 10, xpRequired: 9000, rewardType: 'badge', rewardValue: 'Vétéran', isPremium: true },
    ];
    setPasses(p);
  }, []);

  const handleClaim = (pass: LevelPass) => {
    if (user.level < pass.level) return;
    if (user.claimedLevelRewards?.includes(pass.level)) {
      alert("Cette récompense a déjà été récupérée.");
      return;
    }
    if (pass.isPremium && !user.isUltimate) {
      alert("Ultimate requis pour cette récompense.");
      return;
    }

    // Logic to claim reward
    let updatedUser = { ...user };
    if (!updatedUser.claimedLevelRewards) updatedUser.claimedLevelRewards = [];
    updatedUser.claimedLevelRewards.push(pass.level);

    if (pass.rewardType === 'credits') {
      updatedUser.credits += pass.rewardValue as number;
    } else if (pass.rewardType === 'theme') {
      if (!updatedUser.unlockedThemes.includes(pass.rewardValue as string)) {
        updatedUser.unlockedThemes.push(pass.rewardValue as string);
      }
    } else if (pass.rewardType === 'boost_limit') {
      updatedUser.boostLimit += pass.rewardValue as number;
    }

    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
    alert(`Récompense récupérée : ${pass.rewardValue} ${pass.rewardType}`);
  };

  return (
    <div className="px-4 py-8 space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">Saison 1: L'Éveil</div>
        <h2 className="vibe-logo text-5xl font-black text-white uppercase tracking-tighter">LEVEL PASS</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Montez en niveau pour débloquer des récompenses exclusives et des thèmes rares.</p>
      </div>

      <div className="space-y-6">
        {passes.map((pass) => {
          const isUnlocked = user.level >= pass.level;
          const isClaimed = user.claimedLevelRewards?.includes(pass.level);
          const canClaim = isUnlocked && !isClaimed && (!pass.isPremium || user.isUltimate);
          
          return (
            <div 
              key={pass.level}
              className={`relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                isUnlocked 
                ? isClaimed 
                  ? 'border-emerald-500/20 bg-emerald-500/5 opacity-80'
                  : 'border-blue-500/40 bg-gradient-to-br from-blue-600/10 to-transparent shadow-2xl shadow-blue-500/5' 
                : 'bg-white/5 border-white/5 opacity-40 grayscale'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black relative z-10 ${isUnlocked ? 'bg-white text-black shadow-2xl' : 'bg-white/10 text-slate-500'}`}>
                    {pass.level}
                  </div>
                  {isUnlocked && <div className="absolute -inset-2 bg-blue-500/30 blur-xl rounded-full animate-pulse"></div>}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-base uppercase tracking-tight">
                      {pass.rewardType === 'theme' ? 'Thème Exclusif' : pass.rewardType === 'badge' ? 'Badge de Rang' : pass.rewardType === 'boost_limit' ? 'Limite de Boost' : 'Crédits Vibe'}
                    </h3>
                    {pass.isPremium && (
                      <div className="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[7px] font-black rounded-md uppercase tracking-widest shadow-lg">Ultimate</div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                    {pass.rewardType === 'credits' ? (
                      <span className="text-blue-400">+{pass.rewardValue} Crédits</span>
                    ) : pass.rewardType === 'theme' ? (
                      <span className="text-emerald-400">Thème: {pass.rewardValue}</span>
                    ) : (
                      <span>{pass.rewardValue} {pass.rewardType}</span>
                    )}
                  </p>
                </div>
              </div>

              <button 
                disabled={!canClaim}
                onClick={() => handleClaim(pass)}
                className={`px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                  canClaim 
                  ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-2xl hover:shadow-white/20' 
                  : isClaimed
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                    : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                }`}
              >
                {isClaimed ? 'Récupéré' : isUnlocked ? 'Récupérer' : 'Verrouillé'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPassPage;
