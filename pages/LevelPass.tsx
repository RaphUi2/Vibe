import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Gift, 
  Flame,
  ChevronRight,
  Lock
} from 'lucide-react';

interface Reward {
  type: 'novas' | 'theme' | 'boost_limit' | 'badge' | 'aura_skin' | 'verified' | 'special_gift';
  value: string | number | boolean;
  isUltimatePlus?: boolean;
}

interface DualPassLevel {
  level: number;
  xpRequired: number;
  freeReward: Reward | null;
  ultimateReward: Reward | null;
  name?: string;
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
  
  const getIcon = () => {
    switch (reward.type) {
      case 'novas': return <Star className="w-5 h-5 text-amber-400" fill="currentColor" />;
      case 'theme': return <Zap className="w-5 h-5 text-blue-400" />;
      case 'boost_limit': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'badge': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'verified': return <Crown className="w-5 h-5 text-amber-500" />;
      case 'special_gift': return <Gift className="w-5 h-5 text-vibe-pink" />;
      default: return <Gift className="w-5 h-5 text-white" />;
    }
  };

  const getName = () => {
    switch (reward.type) {
      case 'novas': return `${reward.value} Novas`;
      case 'theme': return 'Nexus Skin';
      case 'boost_limit': return '+1 Slot Boost';
      case 'badge': return 'Insigne Vibe';
      case 'verified': return 'Badge Vérifié';
      case 'special_gift': return 'Cadeau Légendaire';
      default: return 'Récompense';
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative p-5 rounded-[2rem] border backdrop-blur-3xl transition-all duration-500 w-full max-w-[300px] overflow-hidden ${
        isClaimed ? 'bg-[#111216]/60 border-emerald-500/30' : 
        !isUnlocked ? 'bg-[#0f1013]/60 border-white/5 opacity-50' : 
        track === 'free' ? 'bg-white/5 border-white/10 hover:border-white/20' : 
        'bg-indigo-600/10 border-indigo-500/30 hover:border-indigo-400/50 shadow-indigo-500/10 shadow-xl'
      }`}
    >
      {reward.isUltimatePlus && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-600 to-yellow-500 text-[8px] font-black uppercase tracking-widest text-white rounded-bl-xl shadow-lg z-20">U+</div>
      )}

      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
          isClaimed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-black/40 border border-white/5'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
             {track === 'free' ? 'Gratuit' : reward.isUltimatePlus ? 'Ultimate+' : 'Premium'}
          </div>
          <h4 className="text-white font-black text-sm uppercase tracking-tight truncate">{getName()}</h4>
        </div>
        <button 
          onClick={() => onClaim(level, track, reward)}
          disabled={!canClaim}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isClaimed ? 'text-emerald-500 bg-emerald-500/10' : 
            canClaim ? 'bg-white text-black hover:scale-110 shadow-xl' : 
            'bg-white/5 text-slate-700'
          }`}
        >
          {isClaimed ? <ShieldCheck className="w-5 h-5 shadow-glow" /> : !isUnlocked ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>
      
      {!isUnlocked && (
        <div className="mt-4 pt-4 border-t border-white/5">
           <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800" style={{ width: `${(user.level/level)*100}%` }} />
           </div>
        </div>
      )}
    </motion.div>
  );
};

const LevelPassPage: React.FC<{ user: User, onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  const [levels, setLevels] = useState<DualPassLevel[]>([]);

  useEffect(() => {
    const generated: DualPassLevel[] = [];
    const names = ["Départ S1", "Impulsion", "Fréquence", "Éclat", "Nexus", "Vision", "Héritage", "Synthèse", "Apex", "Origines"];
    
    for (let i = 1; i <= 50; i++) {
      const isMajor = i % 5 === 0;
      const isUPlus = i % 10 === 0;
      
      generated.push({
        level: i,
        xpRequired: i * 500,
        name: isMajor ? names[Math.floor(i/5)-1] : undefined,
        freeReward: i % 2 !== 0 || isMajor ? {
          type: isMajor ? 'badge' : 'novas',
          value: isMajor ? `badge_s1_${i}` : i * 50
        } : null,
        ultimateReward: {
          type: isUPlus ? (i === 50 ? 'verified' : 'special_gift') : (i % 5 === 0 ? 'theme' : 'novas'),
          value: isUPlus ? (i === 50 ? true : `gift_${i}`) : (i % 5 === 0 ? `legacy_s1_${i}` : i * 250),
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
      detail: { credits: reward.type === 'novas' ? reward.value : 0, xp: 0, title: 'Récompense Origins S1' } 
    }));
  };

  const buyPremium = (type: 'ultimate' | 'ultimate_plus') => {
    if (type === 'ultimate' && user.isUltimate) return;
    if (type === 'ultimate_plus' && user.isUltimatePlus) return;
    const updatedUser = { 
        ...user, 
        isUltimate: type === 'ultimate' || type === 'ultimate_plus' ? true : user.isUltimate,
        isUltimatePlus: type === 'ultimate_plus' ? true : user.isUltimatePlus
    };
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
    alert(`${type === 'ultimate' ? 'Pass Premium' : 'Pass Ultimate+'} activé pour Origins !`);
  };

  return (
    <div className="relative min-h-screen bg-black text-white pb-60 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.1),_transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-600/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        
        {/* Header Header */}
        <div className="text-center space-y-8 mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] shadow-xl"
          >
            <Trophy className="w-3.5 h-3.5" />
            Saison 1 : Origins
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="vibe-logo text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-4xl">
               VIBE ORIGINS
            </h1>
            <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">Célébration du Nouveau Nexus</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
             {!user.isUltimate && (
               <button onClick={() => buyPremium('ultimate')} className="group relative px-10 py-5 bg-indigo-600 rounded-[2rem] overflow-hidden shadow-2xl hover:scale-105 transition-all">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[size:200%_200%] animate-shimmer" />
                  <div className="relative flex flex-col items-center">
                      <span className="font-black text-xs uppercase tracking-widest">Premium Origins</span>
                      <span className="text-white/60 text-[9px] font-bold mt-1 uppercase tracking-widest tracking-widest">4.99 Novas</span>
                  </div>
               </button>
             )}
             {!user.isUltimatePlus && (
               <button onClick={() => buyPremium('ultimate_plus')} className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-[2rem] overflow-hidden shadow-2xl hover:scale-105 transition-all">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[size:200%_200%] animate-shimmer" />
                  <div className="relative flex flex-col items-center">
                      <span className="font-black text-xs uppercase tracking-widest text-black">Ultimate+ Origins</span>
                      <span className="text-black/60 text-[9px] font-bold mt-1 uppercase tracking-widest">9.99 Novas</span>
                  </div>
               </button>
             )}
          </div>
        </div>

        {/* The Pass Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 z-0" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[6px] bg-blue-600/20 -translate-x-1/2 blur-md z-0" />

          <div className="space-y-24 md:space-y-32">
            {levels.map(lvl => {
              const isActive = user.level === lvl.level;
              const isPast = user.level > lvl.level;
              
              return (
                <div key={lvl.level} className="relative flex items-center justify-between group">
                  
                  {/* Free Lane */}
                  <div className="w-[45%] flex justify-end">
                    {lvl.freeReward ? (
                      <RewardCard reward={lvl.freeReward} level={lvl.level} track="free" user={user} onClaim={handleClaim} />
                    ) : (
                      <div className="w-full max-w-[300px] h-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[2rem] opacity-20" />
                    )}
                  </div>

                  {/* Level Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-20">
                     <motion.div 
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-700 font-black text-sm md:text-xl border-4 ${
                          isActive ? 'bg-blue-600 border-white text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-125' : 
                          isPast ? 'bg-indigo-900/60 border-indigo-500/40 text-indigo-400' : 
                          'bg-[#0a0a0c] border-white/10 text-slate-700'
                        }`}
                     >
                       {lvl.level}
                     </motion.div>
                     {lvl.name && (
                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] drop-shadow-glow">{lvl.name}</span>
                       </div>
                     )}
                  </div>

                  {/* Premium Lane */}
                  <div className="w-[45%] flex justify-start">
                    {lvl.ultimateReward ? (
                      <RewardCard reward={lvl.ultimateReward} level={lvl.level} track="ultimate" user={user} onClaim={handleClaim} />
                    ) : (
                      <div className="w-full max-w-[300px] h-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[2rem] opacity-20" />
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 z-50 pointer-events-none">
          <div className="max-w-xl mx-auto p-6 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-4xl pointer-events-auto flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400">
                 Lv.{user.level}
              </div>
              <div className="flex-1 space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Progression Origins</span>
                    <span>{Math.floor((user.xp / (user.level * 500)) * 100)}%</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-blue-600 shadow-glow" style={{ width: `${Math.min((user.xp / (user.level * 500)) * 100, 100)}%` }} />
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LevelPassPage;
