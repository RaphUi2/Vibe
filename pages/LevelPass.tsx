
import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';

interface Reward {
  type: 'novas' | 'theme' | 'boost_limit' | 'badge' | 'aura_skin' | 'verified';
  value: string | number | boolean;
  isUltimatePlus?: boolean;
}

interface DualPassLevel {
  level: number;
  xpRequired: number;
  freeReward: Reward | null;
  ultimateReward: Reward | null;
}

const RewardCard: React.FC<{ reward: Reward, level: number, track: 'free' | 'ultimate', user: User, onClaim: (l: number, t: 'free'|'ultimate', r: Reward) => void }> = ({ reward, level, track, user, onClaim }) => {
  const isUnlocked = user.level >= level;
  const claimId = track === 'free' ? level : level + 1000;
  const isClaimed = user.claimedLevelRewards?.includes(claimId);
  
  let canClaim = isUnlocked && !isClaimed;
  if (track === 'ultimate') {
    if (reward.isUltimatePlus) {
      canClaim = canClaim && !!user.isUltimatePlus;
    } else {
      canClaim = canClaim && !!user.isUltimate;
    }
  }
  
  const bgClass = track === 'free' 
    ? 'bg-slate-800/40 border-slate-700/50' 
    : reward.isUltimatePlus 
      ? 'bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
      : 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]';

  return (
    <div className={`relative w-full max-w-[260px] p-3 md:p-4 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${bgClass} ${!isUnlocked ? 'opacity-60 grayscale' : 'hover:scale-105 hover:-translate-y-1 z-10'}`}>
      {reward.isUltimatePlus && (
        <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg border border-amber-400/50 animate-pulse">
          Ultimate+
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${track === 'free' ? 'bg-slate-700/50' : reward.isUltimatePlus ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {reward.type === 'novas' ? '✨' : reward.type === 'theme' ? '🎨' : reward.type === 'boost_limit' ? '🚀' : reward.type === 'aura_skin' ? '🤖' : reward.type === 'verified' ? '✅' : '💎'}
          </div>
          <div className="flex flex-col">
            <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-tight leading-none mb-1">
              {reward.type === 'novas' ? `${reward.value} Novas` : reward.type === 'theme' ? 'Thème' : reward.type === 'boost_limit' ? '+1 Boost' : reward.type === 'aura_skin' ? 'Skin Aura' : reward.type === 'verified' ? 'Vérifié' : 'Badge VIP'}
            </h4>
            <p className={`text-[9px] uppercase tracking-widest font-bold ${track === 'free' ? 'text-slate-500' : reward.isUltimatePlus ? 'text-amber-400/70' : 'text-blue-400/70'}`}>
              {track === 'free' ? 'Gratuit' : reward.isUltimatePlus ? 'Exclusif U+' : 'Premium'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => onClaim(level, track, reward)}
          disabled={!canClaim}
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isClaimed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : canClaim ? 'bg-white text-black hover:bg-blue-400 hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-110' : 'bg-white/5 text-white/20'}`}
        >
          {isClaimed ? '✓' : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>}
        </button>
      </div>
    </div>
  );
};

const LevelPassPage: React.FC<{ user: User, onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  const [levels, setLevels] = useState<DualPassLevel[]>([]);

  useEffect(() => {
    const generated: DualPassLevel[] = [];
    for (let i = 1; i <= 100; i++) {
      const isMajor = i % 10 === 0;
      const isUPlus = i % 20 === 0;
      
      generated.push({
        level: i,
        xpRequired: i * 1000,
        freeReward: i % 2 !== 0 || isMajor ? {
          type: isMajor ? 'theme' : 'novas',
          value: isMajor ? `theme_s3_${i}` : i * 150
        } : null,
        ultimateReward: {
          type: isUPlus ? 'verified' : (i % 5 === 0 ? 'aura_skin' : 'novas'),
          value: isUPlus ? true : (i % 5 === 0 ? `skin_${i}` : i * 750),
          isUltimatePlus: isUPlus
        }
      });
    }
    setLevels(generated);
  }, []);

  const handleClaim = (level: number, track: 'free' | 'ultimate', reward: Reward) => {
    if (user.level < level) return;
    
    const claimId = track === 'free' ? level : level + 1000;
    if (user.claimedLevelRewards?.includes(claimId)) {
      alert("Cette récompense a déjà été récupérée.");
      return;
    }

    if (track === 'ultimate') {
      if (reward.isUltimatePlus && !user.isUltimatePlus) {
        alert("Ultimate+ requis pour cette récompense exclusive !");
        return;
      }
      if (!reward.isUltimatePlus && !user.isUltimate) {
        alert("Ultimate requis pour cette récompense !");
        return;
      }
    }

    let updatedUser = { ...user };
    if (!updatedUser.claimedLevelRewards) updatedUser.claimedLevelRewards = [];
    updatedUser.claimedLevelRewards.push(claimId);

    if (reward.type === 'novas') {
      updatedUser.credits += reward.value as number;
    } else if (reward.type === 'theme') {
      if (!updatedUser.unlockedThemes.includes(reward.value as string)) {
        updatedUser.unlockedThemes.push(reward.value as string);
      }
    } else if (reward.type === 'boost_limit') {
      updatedUser.boostLimit += reward.value as number;
    } else if (reward.type === 'verified') {
      updatedUser.isVerified = true;
    }

    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
    
    window.dispatchEvent(new CustomEvent('vibeRewardToast', { 
      detail: { credits: reward.type === 'novas' ? reward.value : 0, xp: 0, title: 'Récompense Pass S3' } 
    }));
  };

  const buyPremium = (type: 'ultimate' | 'ultimate_plus') => {
    if (type === 'ultimate' && user.isUltimate) {
        alert("Vous avez déjà le Pass Premium !");
        return;
    }
    if (type === 'ultimate_plus' && user.isUltimatePlus) {
        alert("Vous avez déjà le Pass Ultimate+ !");
        return;
    }
    const updatedUser = { 
        ...user, 
        isUltimate: type === 'ultimate' || type === 'ultimate_plus' ? true : user.isUltimate,
        isUltimatePlus: type === 'ultimate_plus' ? true : user.isUltimatePlus
    };
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
    alert(`${type === 'ultimate' ? 'Pass Premium' : 'Pass Ultimate+'} activé !`);
  };

  return (
    <div className="relative min-h-screen pb-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.1),_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             transform: 'rotateX(60deg) scale(2) translateY(-10%)',
             transformOrigin: 'top center'
           }} 
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-2 md:px-4 py-12">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            Saison 3 : Singularity
          </div>
          <h1 className="vibe-logo text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-2xl tracking-tighter">
            SINGULARITY PASS
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-bold max-w-md mx-auto leading-relaxed">
            L'évolution finale est ici. 100 niveaux de puissance pure.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {!user.isUltimate && (
                <button 
                    onClick={() => buyPremium('ultimate')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all active:scale-95 border border-white/10"
                >
                    <div className="relative flex flex-col items-center">
                        <span className="text-white font-black text-xs uppercase tracking-widest">Pass Premium</span>
                        <span className="text-white/80 text-[10px] font-bold mt-1">4.99€ / Saison</span>
                    </div>
                </button>
            )}
            {!user.isUltimatePlus && (
                <button 
                    onClick={() => buyPremium('ultimate_plus')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all active:scale-95 border border-white/20"
                >
                    <div className="relative flex flex-col items-center">
                        <span className="text-white font-black text-xs uppercase tracking-widest">Pass Ultimate+</span>
                        <span className="text-white/80 text-[10px] font-bold mt-1">9.99€ / Saison</span>
                    </div>
                </button>
            )}
          </div>
        </div>

        <div className="relative mt-10">
          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-amber-500 to-yellow-500 -translate-x-1/2 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] opacity-50" />

          <div className="flex justify-between mb-12 sticky top-20 z-30 px-4 md:px-8">
            <div className="w-[45%] text-right pr-4 md:pr-8">
              <h3 className="vibe-logo text-xl md:text-3xl font-black text-slate-300 tracking-tighter drop-shadow-lg">FREE</h3>
            </div>
            <div className="w-[45%] text-left pl-4 md:pl-8">
              <h3 className="vibe-logo text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 tracking-tighter drop-shadow-lg">ULTIMATE</h3>
            </div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {levels.map(lvl => {
              const isCurrent = user.level === lvl.level;
              const isPassed = user.level > lvl.level;
              
              return (
                <div key={lvl.level} className="relative flex items-center justify-between w-full group">
                  <div className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center z-20 transition-all duration-500 transform rotate-45 ${
                    isCurrent ? 'bg-amber-500 border-4 border-white shadow-[0_0_30px_rgba(245,158,11,0.8)] scale-125' : 
                    isPassed ? 'bg-amber-900 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 
                    'bg-[#020617] border-2 border-slate-700'
                  }`}>
                    <span className={`font-black -rotate-45 ${isCurrent ? 'text-white text-xl md:text-2xl' : isPassed ? 'text-amber-200 text-lg' : 'text-slate-500 text-sm'}`}>
                      {lvl.level}
                    </span>
                  </div>

                  <div className="w-[45%] pr-6 md:pr-12 flex justify-end">
                    {lvl.freeReward ? (
                      <RewardCard reward={lvl.freeReward} level={lvl.level} track="free" user={user} onClaim={handleClaim} />
                    ) : (
                      <div className="w-full max-w-[260px] h-16 border-2 border-dashed border-slate-800 rounded-2xl opacity-30" />
                    )}
                  </div>

                  <div className="w-[45%] pl-6 md:pl-12 flex justify-start">
                    {lvl.ultimateReward ? (
                      <RewardCard reward={lvl.ultimateReward} level={lvl.level} track="ultimate" user={user} onClaim={handleClaim} />
                    ) : (
                      <div className="w-full max-w-[260px] h-16 border-2 border-dashed border-blue-900/30 rounded-2xl opacity-30" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelPassPage;

