import React from 'react';
import { User } from '../types';

interface VibeScoreProps {
  user: User;
}

const VibeScore: React.FC<VibeScoreProps> = ({ user }) => {
  return (
    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 shadow-4xl backdrop-blur-xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-xl">✦</span>
          <h2 className="vibe-logo text-xl font-black text-white tracking-tight">Ton Vibe Score</h2>
        </div>

        <div className="text-center space-y-2">
          <div className="text-7xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent animate-pulse duration-[4000ms]">
            {user.vibeScore || 0}
          </div>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest opacity-80">
            {user.vibeRank || 'Calcul du signal en cours...'}
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <MetricCircle 
            value={user.vibeMetrics?.energy || 0} 
            icon="⚡" 
            color="border-emerald-500/50 text-emerald-400" 
            glow="shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          />
          <MetricCircle 
            value={user.vibeMetrics?.flow || 0} 
            icon="🌊" 
            color="border-blue-500/50 text-blue-400" 
            glow="shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          />
          <MetricCircle 
            value={user.vibeMetrics?.impact || 0} 
            icon="💫" 
            color="border-pink-500/50 text-pink-400" 
            glow="shadow-[0_0_15px_rgba(236,72,153,0.2)]"
          />
        </div>
      </div>
    </div>
  );
};

const MetricCircle: React.FC<{ value: number, icon: string, color: string, glow: string }> = ({ value, icon, color, glow }) => (
  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-black/40 backdrop-blur-md ${color} ${glow} transition-transform hover:scale-110 cursor-default`}>
    <div className="flex items-center gap-1">
      <span className="text-[10px]">{icon}</span>
      <span className="text-[10px] font-black">{value}%</span>
    </div>
  </div>
);

export default VibeScore;
