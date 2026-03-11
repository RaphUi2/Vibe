import React from 'react';
import { User, Quest } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Quests: React.FC<{ user: User }> = ({ user }) => {
  const quests = storage.getQuests();

  return (
    <div className="px-4 py-8 space-y-10 animate-in fade-in duration-700 pb-40 relative" style={{ perspective: '1200px' }}>
      <div className="text-center space-y-2 relative z-10">
        <h2 className="vibe-logo text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter drop-shadow-xl">QUÊTES</h2>
        <p className="text-blue-400/80 text-[10px] font-black uppercase tracking-widest drop-shadow-md">Accomplissez des missions pour gagner des récompenses</p>
      </div>

      <div className="grid gap-6 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
        {quests.map((quest) => {
          const isCompleted = user.completedQuests.includes(quest.id);
          
          return (
            <div 
              key={quest.id}
              className={`relative overflow-hidden p-8 rounded-[3rem] border transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
                isCompleted 
                ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 opacity-80 scale-[0.98]' 
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02]'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    {quest.ultimate && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg border border-fuchsia-400/50">Ultimate</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[8px] font-black uppercase tracking-widest border border-white/5">{quest.type}</span>
                  </div>
                  <h3 className={`vibe-logo text-2xl font-black drop-shadow-md ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                    {quest.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{quest.description}</p>
                </div>
                {isCompleted ? (
                  <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-300/50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-black/40 text-slate-500 p-3 rounded-full border border-white/10 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-blue-600/10 px-4 py-2.5 rounded-2xl border border-blue-400/30 shadow-inner">
                  <span className="text-blue-400 font-black text-sm drop-shadow-md">+{quest.reward.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-blue-400/70 uppercase tracking-widest">Novas</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-inner">
                  <span className="text-emerald-400 font-black text-sm drop-shadow-md">+{quest.xpReward.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-emerald-400/70 uppercase tracking-widest">XP</span>
                </div>
              </div>

              {isCompleted && (
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 blur-[60px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-white/10 to-transparent p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4 shadow-2xl backdrop-blur-md relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(5px)' }}>
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest drop-shadow-md">Astuce du Nexus</p>
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          Les quêtes sont mises à jour régulièrement. Revenez souvent pour maximiser vos gains de Novas et monter en niveau plus rapidement !
        </p>
      </div>
    </div>
  );
};

export default Quests;
