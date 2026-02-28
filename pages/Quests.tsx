import React from 'react';
import { User, Quest } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Quests: React.FC<{ user: User }> = ({ user }) => {
  const quests = storage.getQuests();

  return (
    <div className="px-4 py-8 space-y-10 animate-in fade-in duration-700 pb-40">
      <div className="text-center space-y-2">
        <h2 className="vibe-logo text-4xl font-black text-white uppercase tracking-tighter">QUÊTES</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Accomplissez des missions pour gagner des récompenses</p>
      </div>

      <div className="grid gap-6">
        {quests.map((quest) => {
          const isCompleted = user.completedQuests.includes(quest.id);
          
          return (
            <div 
              key={quest.id}
              className={`relative overflow-hidden p-8 rounded-[3rem] border transition-all duration-500 ${
                isCompleted 
                ? 'border-emerald-500/30 bg-emerald-500/5 opacity-70' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className={`vibe-logo text-xl font-black ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                    {quest.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{quest.description}</p>
                </div>
                {isCompleted ? (
                  <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-white/10 text-slate-400 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20">
                  <span className="text-blue-400 font-black text-xs">+{quest.reward}</span>
                  <span className="text-[10px] font-black text-blue-400/50 uppercase">Crédits</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                  <span className="text-emerald-400 font-black text-xs">+{quest.xpReward}</span>
                  <span className="text-[10px] font-black text-emerald-400/50 uppercase">XP</span>
                </div>
              </div>

              {isCompleted && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="liquid-glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Astuce</p>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Les quêtes sont mises à jour régulièrement. Revenez souvent pour maximiser vos gains de crédits et monter en niveau plus rapidement !
        </p>
      </div>
    </div>
  );
};

export default Quests;
