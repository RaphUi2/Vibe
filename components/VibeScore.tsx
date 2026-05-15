import React from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { Zap, Activity, Target, Shield, Trophy, Star, Crown, Flame } from 'lucide-react';

interface VibeScoreProps {
  user: User;
  compact?: boolean;
}

const VibeScore: React.FC<VibeScoreProps> = ({ user, compact = false }) => {
  const score = user.vibeScore || 0;
  const level = user.level || 1;
  const xp = user.xp || 0;
  const nextLevelXp = level * 1000;
  const progress = (xp / nextLevelXp) * 100;
  const rank = user.vibeRank || 'Néophyte';

  const getRankIcon = () => {
    if (score > 1000000) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (score > 250000) return <Trophy className="w-6 h-6 text-purple-400" />;
    if (score > 50000) return <Star className="w-6 h-6 text-blue-400" />;
    return <Zap className="w-6 h-6 text-slate-400" />;
  };

  const getRankColor = () => {
    if (score > 1000000) return 'from-yellow-400 via-amber-500 to-orange-600';
    if (score > 250000) return 'from-purple-500 via-indigo-500 to-blue-600';
    if (score > 50000) return 'from-blue-400 via-cyan-500 to-teal-500';
    return 'from-slate-400 via-slate-500 to-slate-600';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[#0a0a0c] to-[#121217] border border-white/5 shadow-6xl group ${compact ? 'p-6 h-[420px]' : 'p-6 md:p-8'}`}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
      <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${getRankColor()} blur-[120px] rounded-full opacity-10 -translate-y-1/2 translate-x-1/2`}></div>
      
      <div className={`relative z-10 flex flex-col items-center gap-6`}>
        {/* Main Score Display */}
        <div className="relative shrink-0 group/orb">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-110 opacity-0 group-hover/orb:opacity-100 transition-opacity duration-1000"></div>
            
            <svg className={`${compact ? 'w-40 h-40' : 'w-32 h-32 md:w-48 md:h-48'} transform -rotate-90`}>
                <circle 
                    cx="50%" 
                    cy="50%" 
                    r="45%" 
                    className="stroke-white/5 fill-none" 
                    strokeWidth={compact ? "12" : "8"}
                />
                <motion.circle 
                    cx="50%" 
                    cy="50%" 
                    r="45%" 
                    className={`stroke-current fill-none bg-gradient-to-r ${getRankColor()}`}
                    style={{ stroke: 'url(#scoreGradient)' }}
                    strokeWidth={compact ? "12" : "8"}
                    strokeDasharray="628"
                    initial={{ strokeDashoffset: "628" }}
                    animate={{ strokeDashoffset: 628 * (1 - progress / 100) }}
                    transition={{ duration: 2.5, ease: "circOut" }}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <span className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-black text-slate-500 uppercase tracking-[0.4em] mb-0.5`}>Niveau</span>
                    <span className={`${compact ? 'text-5xl' : 'text-4xl md:text-7xl'} font-black vibe-logo text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]`}>{level}</span>
                    <div className={`mt-2 flex items-center gap-1 ${compact ? 'px-3 py-1' : 'px-2 py-0.5'} bg-white/10 rounded-full border border-white/5`}>
                        <Zap className={`${compact ? 'w-3 h-3' : 'w-2 h-2'} text-yellow-400 fill-current`} />
                        <span className={`${compact ? 'text-[10px]' : 'text-[8px]'} font-black text-white`}>{xp.toLocaleString()}</span>
                    </div>
                </motion.div>
            </div>

            {/* Orbiting Elements */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 pointer-events-none"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            </motion.div>
        </div>

        {/* Info & Metrics */}
        <div className="flex-1 w-full space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${getRankColor()} shadow-2xl shadow-black/50 text-white`}>
                           {getRankIcon()}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-white font-black text-4xl md:text-5xl tracking-tighter uppercase vibe-logo">{rank}</h2>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal Sync : Optimale</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end">
                    <span className={`${compact ? 'text-[18px]' : 'text-[14px]'} font-black text-slate-500 uppercase tracking-[0.4em] mb-1`}>VIBE SCORE</span>
                    <span className={`${compact ? 'text-7xl' : 'text-6xl md:text-9xl'} font-black text-white vibe-logo tracking-widest drop-shadow-glow`}>
                        {score.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Metrics Grid */}
            {!compact && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                      { id: 'energy', label: 'ÉNERGIE', value: user.vibeMetrics?.energy || 0, icon: <Flame className="w-5 h-5" />, color: 'from-orange-500 to-red-600', shadow: 'shadow-red-500/20' },
                      { id: 'flow', label: 'FLUX', value: user.vibeMetrics?.flow || 0, icon: <Activity className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/20' },
                      { id: 'impact', label: 'IMPACT', value: user.vibeMetrics?.impact || 0, icon: <Target className="w-5 h-5" />, color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/20' }
                  ].map(m => (
                      <motion.div 
                          key={m.id}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group/card relative overflow-hidden"
                      >
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.color} blur-[50px] opacity-0 group-hover/card:opacity-10 transition-opacity`}></div>
                          
                          <div className="flex items-center justify-between mb-6">
                              <div className="text-slate-500 group-hover/card:text-white transition-colors">
                                  {m.icon}
                              </div>
                              <span className="text-2xl font-black text-white">{m.value}%</span>
                          </div>
                          
                          <div className="space-y-3">
                              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                                  <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${m.value}%` }}
                                      transition={{ duration: 2, delay: 0.5 }}
                                      className={`h-full rounded-full bg-gradient-to-r ${m.color} ${m.shadow} shadow-lg`}
                                  />
                              </div>
                              <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                          </div>
                      </motion.div>
                  ))}
              </div>
            )}

            {/* Reward Summary / Boost Info */}
            {!compact && (
              <div className="p-1 rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/5">
                  <div className="bg-black/40 backdrop-blur-xl px-8 py-5 rounded-[1.9rem] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                              <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                              <span className="text-white font-bold text-sm">Protection du Nexus Actif</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Multiplicateur XP x{user.isUltimate ? '3' : '2'}</span>
                          </div>
                      </div>
                      <button className="px-6 py-2 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                          Détails
                      </button>
                  </div>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default VibeScore;
