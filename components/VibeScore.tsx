import React from 'react';
import { User } from '../types';

interface VibeScoreProps {
  user: User;
  compact?: boolean;
}

const VibeScore: React.FC<VibeScoreProps> = ({ user, compact = false }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-950 border border-white/5 shadow-xl group ${compact ? 'p-3' : 'p-4'}`}>
      {/* Animated Background Gradients */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-600/20 blur-[40px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000"></div>
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-indigo-600/10 blur-[40px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
              <span className={`vibe-logo font-black text-slate-500 uppercase tracking-[0.2em] ${compact ? 'text-[6px]' : 'text-[8px]'}`}>Neural Index</span>
            </div>
            <h2 className={`font-black text-white/40 uppercase tracking-widest ${compact ? 'text-[8px]' : 'text-[10px]'}`}>Vibe Score</h2>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            <span className={`font-black text-blue-400 uppercase tracking-widest ${compact ? 'text-[6px]' : 'text-[8px]'}`}>{user.vibeRank || 'Initialisation'}</span>
          </div>
        </div>

        <div className={`flex items-end gap-3 ${compact ? 'mb-2' : 'mb-4'}`}>
          <div className={`font-black tracking-tighter text-white leading-none ${compact ? 'text-xl' : 'text-3xl'}`}>
            {user.vibeScore?.toLocaleString() || 0}
          </div>
          <div className={`flex items-center gap-1 text-emerald-400 ${compact ? 'mb-0.5' : 'mb-1'}`}>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
            <span className={`font-black tracking-widest ${compact ? 'text-[6px]' : 'text-[8px]'}`}>OPTIMAL</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MetricItem 
            label="Énergie" 
            value={user.vibeMetrics?.energy || 0} 
            color="bg-emerald-500" 
            icon="⚡"
            compact={compact}
          />
          <MetricItem 
            label="Flux" 
            value={user.vibeMetrics?.flow || 0} 
            color="bg-blue-500" 
            icon="🌊"
            compact={compact}
          />
          <MetricItem 
            label="Impact" 
            value={user.vibeMetrics?.impact || 0} 
            color="bg-indigo-500" 
            icon="💫"
            compact={compact}
          />
        </div>
      </div>
    </div>
  );
};

const MetricItem: React.FC<{ label: string, value: number, color: string, icon: string, compact?: boolean }> = ({ label, value, color, icon, compact }) => (
  <div className={`flex flex-col gap-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/metric ${compact ? 'p-1.5' : 'p-2'}`}>
    <div className="flex items-center justify-between">
      <span className={compact ? 'text-[8px]' : 'text-[10px]'}>{icon}</span>
      <span className={`font-black text-white ${compact ? 'text-[7px]' : 'text-[9px]'}`}>{value}%</span>
    </div>
    <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out group-hover/metric:brightness-125`} 
        style={{ width: `${value}%` }}
      />
    </div>
    <span className={`font-black text-slate-500 uppercase tracking-widest ${compact ? 'text-[5px]' : 'text-[7px]'}`}>{label}</span>
  </div>
);

export default VibeScore;
