import React from 'react';
import { User } from '../types';

interface VibeScoreProps {
  user: User;
}

const VibeScore: React.FC<VibeScoreProps> = ({ user }) => {
  return (
    <div className="bg-white/5 rounded-[2rem] p-5 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
      
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs">✦</span>
            <h2 className="vibe-logo text-[10px] font-black text-slate-400 tracking-widest uppercase">Vibe Score</h2>
          </div>
          <div className="text-3xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            {user.vibeScore || 0}
          </div>
          <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest opacity-80 truncate max-w-[120px]">
            {user.vibeRank || 'Calcul...'}
          </p>
        </div>

        <div className="flex gap-3">
          <MetricCircle 
            value={user.vibeMetrics?.energy || 0} 
            icon="⚡" 
            color="border-emerald-500/30 text-emerald-400" 
          />
          <MetricCircle 
            value={user.vibeMetrics?.flow || 0} 
            icon="🌊" 
            color="border-blue-500/30 text-blue-400" 
          />
          <MetricCircle 
            value={user.vibeMetrics?.impact || 0} 
            icon="💫" 
            color="border-pink-500/30 text-pink-400" 
          />
        </div>
      </div>
    </div>
  );
};

const MetricCircle: React.FC<{ value: number, icon: string, color: string }> = ({ value, icon, color }) => (
  <div className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center bg-black/40 backdrop-blur-md ${color} transition-transform hover:scale-110 cursor-default`}>
    <span className="text-[8px] leading-none mb-0.5">{icon}</span>
    <span className="text-[8px] font-black leading-none">{value}%</span>
  </div>
);

export default VibeScore;
