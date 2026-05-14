import React from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { Zap, Activity, Target, Shield } from 'lucide-react';

interface VibeScoreProps {
  user: User;
  compact?: boolean;
}

const VibeScore: React.FC<VibeScoreProps> = ({ user, compact = false }) => {
  const score = user.vibeScore || 0;
  
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/10 shadow-3xl group ${compact ? 'p-4' : 'p-8'}`}>
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                 <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                 <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Resonance</div>
                 <h3 className="text-white font-black uppercase tracking-widest text-xs">Indice de Sync</h3>
              </div>
           </div>
           <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.vibeRank || 'Calcul...'}</span>
           </div>
        </div>

        <div className="flex items-baseline gap-4">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className={`font-black tracking-tighter text-white vibe-logo ${compact ? 'text-3xl' : 'text-5xl'}`}
           >
              {score.toLocaleString()}
           </motion.div>
           <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Zap className="w-3 h-3 fill-emerald-400" />
              <span className="text-[10px] font-black tracking-widest uppercase">Nexus Stable</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
           <MetricBox 
             label="Énergie" 
             value={user.vibeMetrics?.energy || 0} 
             color="from-emerald-600 to-teal-400" 
             icon={<Zap className="w-4 h-4" />}
             compact={compact}
           />
           <MetricBox 
             label="Flux" 
             value={user.vibeMetrics?.flow || 0} 
             color="from-vibe-blue to-cyan-400" 
             icon={<Activity className="w-4 h-4" />}
             compact={compact}
           />
           <MetricBox 
             label="Impact" 
             value={user.vibeMetrics?.impact || 0} 
             color="from-vibe-purple to-pink-500" 
             icon={<Target className="w-4 h-4" />}
             compact={compact}
           />
        </div>
      </div>
    </div>
  );
};

const MetricBox: React.FC<{ label: string, value: number, color: string, icon: React.ReactNode, compact?: boolean }> = ({ label, value, color, icon, compact }) => (
  <div className={`relative group/metric overflow-hidden rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all ${compact ? 'p-3' : 'p-5'}`}>
     <div className="flex items-center justify-between mb-4">
        <div className="text-white opacity-40 group-hover/metric:opacity-100 transition-opacity">
           {icon}
        </div>
        <div className="text-xl font-black text-white">{value}%</div>
     </div>
     <div className="space-y-2">
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${value}%` }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className={`h-full bg-gradient-to-r ${color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`} 
           />
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</div>
     </div>
  </div>
);

export default VibeScore;
