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
      case 'novas': return <Star className="w-4 h-4 text-amber-400" fill="currentColor" />;
      case 'theme': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'boost_limit': return <Flame className="w-4 h-4 text-rose-500" />;
      case 'badge': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'verified': return <Crown className="w-4 h-4 text-amber-500" />;
      case 'special_gift': return <Gift className="w-4 h-4 text-vibe-pink" />;
      default: return <Gift className="w-4 h-4 text-white" />;
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
      whileHover={{ y: -2 }}
      className={`relative p-3 rounded-2xl border backdrop-blur-3xl transition-all duration-300 w-full overflow-hidden ${
        isClaimed ? 'bg-emerald-500/5 border-emerald-500/20' : 
        !isUnlocked ? 'bg-white/[0.02] border-white/5 opacity-50' : 
        track === 'free' ? 'bg-white/5 border-white/10' : 
        'bg-blue-600/10 border-blue-500/20 shadow-blue-500/5 shadow-lg'
      }`}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
          isClaimed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-black/40 border-white/5'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
             {track === 'free' ? 'Gratuit' : reward.isUltimatePlus ? 'Ultimate+' : 'Ultimate'}
          </div>
          <h4 className="text-white font-black text-[10px] uppercase tracking-tight truncate">{getName()}</h4>
        </div>
        <button 
          onClick={() => onClaim(level, track, reward)}
          disabled={!canClaim}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            isClaimed ? 'text-emerald-500 bg-emerald-500/10' : 
            canClaim ? 'bg-white text-black hover:scale-110 shadow-xl' : 
            'bg-white/5 text-slate-700'
          }`}
        >
          {isClaimed ? <ShieldCheck className="w-4 h-4 shadow-glow" /> : !isUnlocked ? <Lock className="w-3 h-3" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
};

const LevelPassPage: React.FC<{ user: User, onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  const [levels, setLevels] = useState<DualPassLevel[]>([]);

  useEffect(() => {
    const generated: DualPassLevel[] = [];
    const names = ["Départ S1", "Impulsion", "Fréquence", "Éclat", "Nexus", "Vision", "Héritage", "Synthèse", "Apex", "Origines"];
    for (let i = 1; i <= 30; i++) {
        const isMajor = i % 5 === 0;
        generated.push({
            level: i,
            xpRequired: i * 500,
            name: isMajor ? names[Math.floor(i/5)-1] : undefined,
            freeReward: i % 2 !== 0 ? { type: 'novas', value: i * 100 } : null,
            ultimateReward: { type: i % 5 === 0 ? 'theme' : 'novas', value: i % 5 === 0 ? `skin_${i}` : i * 500 }
        });
    }
    setLevels(generated);
  }, []);

  const handleClaim = (level: number, track: 'free' | 'ultimate', reward: Reward) => {
    if (user.level < level) return;
    const claimId = track === 'free' ? level : level + 1000;
    if (user.claimedLevelRewards?.includes(claimId)) return;
    // Logic for claim...
    const updated = { ...user, claimedLevelRewards: [...(user.user_metadata?.claimedLevelRewards || []), claimId] };
    if (reward.type === 'novas') updated.credits += (reward.value as number);
    storage.updateUser(updated);
    onUpdate(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
       {/* Hero compact */}
       <div className="pt-20 pb-12 px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-widest">
            <Trophy className="w-3 h-3" /> Origins S1
          </div>
          <h1 className="vibe-logo text-4xl md:text-7xl font-black uppercase tracking-tighter">Pass Origins</h1>
       </div>

       <div className="max-w-xl mx-auto px-4 space-y-6">
          {levels.map(lvl => (
            <div key={lvl.level} className="relative glass-premium p-4 md:p-6 rounded-[2rem] border border-white/5 space-y-4">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${user.level >= lvl.level ? 'bg-blue-600' : 'bg-white/5 text-slate-500'} border border-white/10`}>
                        {lvl.level}
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{lvl.name || `Palier ${lvl.level}`}</h4>
                        <div className="h-1 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: user.level >= lvl.level ? '100%' : (user.level === lvl.level - 1 ? '40%' : '0%') }}></div>
                        </div>
                     </div>
                  </div>
                  {user.level >= lvl.level && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RewardCard reward={lvl.freeReward || { type: 'novas', value: 0 }} level={lvl.level} track="free" user={user} onClaim={handleClaim} />
                  <RewardCard reward={lvl.ultimateReward || { type: 'novas', value: 0 }} level={lvl.level} track="ultimate" user={user} onClaim={handleClaim} />
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default LevelPassPage;
