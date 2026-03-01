import React from 'react';
import { User } from '../types';

interface VibeScoreProps {
  user: User;
}

const VibeScore: React.FC<VibeScoreProps> = ({ user }) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/5 p-6 shadow-2xl group">
      {/* Animated Background Gradients */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="vibe-logo text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Index</span>
            </div>
            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Vibe Score</h2>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{user.vibeRank || 'Initialisation'}</span>
          </div>
        </div>

        <div className="flex items-end gap-4 mb-8">
          <div className="text-5xl font-black tracking-tighter text-white">
            {user.vibeScore?.toLocaleString() || 0}
          </div>
          <div className="mb-2 flex items-center gap-1 text-emerald-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
            <span className="text-[10px] font-black tracking-widest">OPTIMAL</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MetricItem 
            label="Énergie" 
            value={user.vibeMetrics?.energy || 0} 
            color="bg-emerald-500" 
            icon="⚡"
          />
          <MetricItem 
            label="Flux" 
            value={user.vibeMetrics?.flow || 0} 
            color="bg-blue-500" 
            icon="🌊"
          />
          <MetricItem 
            label="Impact" 
            value={user.vibeMetrics?.impact || 0} 
            color="bg-indigo-500" 
            icon="💫"
          />
        </div>
      </div>
    </div>
  );
};

const MetricItem: React.FC<{ label: string, value: number, color: string, icon: string }> = ({ label, value, color, icon }) => (
  <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/metric">
    <div className="flex items-center justify-between">
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] font-black text-white">{value}%</span>
    </div>
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out group-hover/metric:brightness-125`} 
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default VibeScore;
