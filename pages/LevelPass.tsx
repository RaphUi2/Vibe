
import React, { useState, useEffect } from 'react';
import { User, LevelPass } from '../types.ts';
import { storage } from '../services/storageService.ts';

const LevelPassPage: React.FC<{ user: User, onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  const [passes, setPasses] = useState<LevelPass[]>([]);

  useEffect(() => {
    const p: LevelPass[] = [];
    for (let i = 1; i <= 100; i++) {
        p.push({
            level: i,
            xpRequired: (i - 1) * 1000,
            rewardType: i % 5 === 0 ? 'theme' : i % 3 === 0 ? 'boost_limit' : 'credits',
            rewardValue: i % 5 === 0 ? `theme_${i}` : i % 3 === 0 ? 1 : 500 * i,
            isPremium: i % 2 === 0
        });
    }
    setPasses(p);
  }, []);

  const handleClaim = (pass: LevelPass) => {
    if (user.level < pass.level) return;
    if (user.claimedLevelRewards?.includes(pass.level)) {
      alert("Cette récompense a déjà été récupérée.");
      return;
    }
    if (pass.isPremium && !user.isUltimate) {
      alert("Ultimate requis pour cette récompense. Achetez le Pass Premium !");
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
  };

  const buyPremium = () => {
    if (user.isUltimate) {
        alert("Vous avez déjà le Pass Premium !");
        return;
    }
    const updatedUser = { ...user, isUltimate: true };
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
    alert("Pass Premium activé ! Profitez de vos récompenses exclusives.");
  };

  return (
    <div className="px-4 py-8 space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">Saison 1: L'Éveil</div>
        <h2 className="vibe-logo text-6xl font-black text-white uppercase tracking-tighter">LEVEL PASS</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed">100 niveaux de récompenses neuronales.</p>
        
        {!user.isUltimate && (
            <button 
                onClick={buyPremium}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all active:scale-95"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative flex flex-col items-center">
                    <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Débloquer la Voie Premium</span>
                    <span className="text-white/60 text-[10px] font-bold">Seulement 8.00€</span>
                </div>
            </button>
        )}
      </div>

      <div className="space-y-4">
        {passes.map((pass) => {
          const isUnlocked = user.level >= pass.level;
          const isClaimed = user.claimedLevelRewards?.includes(pass.level);
          const canClaim = isUnlocked && !isClaimed && (!pass.isPremium || user.isUltimate);
          
          return (
            <div 
              key={pass.level}
              className={`relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 flex items-center justify-between gap-4 ${
                isUnlocked 
                ? isClaimed 
                  ? 'border-emerald-500/20 bg-emerald-500/5 opacity-80'
                  : 'border-blue-500/40 bg-gradient-to-br from-blue-600/10 to-transparent shadow-xl' 
                : 'bg-white/5 border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${isUnlocked ? 'bg-white text-black' : 'bg-white/10 text-slate-500'}`}>
                    {pass.level}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-xs uppercase tracking-tight">
                      {pass.rewardType === 'theme' ? 'Thème' : pass.rewardType === 'boost_limit' ? 'Boost' : 'Crédits'}
                    </h3>
                    {pass.isPremium && (
                      <span className="text-[6px] font-black bg-blue-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Premium</span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500">
                    {pass.rewardType === 'credits' ? `+${pass.rewardValue} C` : pass.rewardType === 'theme' ? `Sync: ${pass.rewardValue}` : `+${pass.rewardValue} Boost`}
                  </p>
                </div>
              </div>

              <button 
                disabled={!canClaim}
                onClick={() => handleClaim(pass)}
                className={`px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                  canClaim 
                  ? 'bg-white text-black hover:bg-blue-500 hover:text-white' 
                  : isClaimed
                    ? 'text-emerald-500'
                    : 'text-slate-700'
                }`}
              >
                {isClaimed ? '✓' : isUnlocked ? 'Claim' : 'Locked'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPassPage;
