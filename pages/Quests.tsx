import React from 'react';
import { User, Quest } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Quests: React.FC<{ user: User }> = ({ user }) => {
  const quests = storage.getQuests();

  return (
    <div className="px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-48 relative" style={{ perspective: '2000px' }}>
      <div className="text-center space-y-4 relative z-10" style={{ transform: 'translateZ(100px)' }}>
        <h2 className="vibe-logo text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-4xl">QUÊTES</h2>
        <div className="flex items-center justify-center gap-4">
           <div className="h-0.5 w-12 bg-vibe-blue/50" />
           <p className="text-vibe-blue text-[10px] font-black uppercase tracking-[0.5em]">Nexus Chronicles & Missions</p>
           <div className="h-0.5 w-12 bg-vibe-blue/50" />
        </div>
      </div>

      <div className="grid gap-10 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        {quests.map((quest, idx) => {
          const isCompleted = user.completedQuests.includes(quest.id);
          
          return (
            <div 
              key={quest.id}
              style={{ transform: `translateZ(${idx * 20}px) rotateX(${idx % 2 === 0 ? '2deg' : '-2deg'})` }}
              className={`group relative overflow-hidden p-10 rounded-[3.5rem] border transition-all duration-1000 shadow-4xl backdrop-blur-3xl ${
                isCompleted 
                ? 'border-vibe-green/30 bg-vibe-green/5 opacity-60 scale-[0.98]' 
                : 'liquid-glass border-white/10 hover:border-vibe-blue/50 hover:scale-[1.03] transform-gpu'
              }`}
            >
              <div className="flex justify-between items-start mb-8 relative z-20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {quest.ultimate && (
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-vibe-purple to-vibe-blue text-white text-[8px] font-black uppercase tracking-widest shadow-vibe-blue/20">ULTIMATE CORE</span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-white/5 text-slate-500 text-[8px] font-black uppercase tracking-widest border border-white/10">{quest.type}</span>
                  </div>
                  <h3 className={`vibe-logo text-3xl font-black tracking-tight ${isCompleted ? 'text-vibe-green' : 'text-white'}`}>
                    {quest.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium tracking-wide max-w-xl">{quest.description}</p>
                </div>
                
                {isCompleted ? (
                  <div className="bg-vibe-green text-white p-4 rounded-3xl shadow-vibe-green/40 animate-in zoom-in duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-white/5 text-slate-700 p-4 rounded-3xl border border-white/10 shadow-inner group-hover:text-vibe-blue transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 relative z-20">
                <div className="flex items-center gap-3 bg-vibe-blue/5 px-6 py-3 rounded-2xl border border-vibe-blue/20 shadow-inner">
                  <span className="text-vibe-blue font-black text-lg tracking-tighter">+{quest.reward.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-vibe-blue/50 uppercase tracking-widest">N-Pulse</span>
                </div>
                <div className="flex items-center gap-3 bg-vibe-purple/5 px-6 py-3 rounded-2xl border border-vibe-purple/20 shadow-inner">
                  <span className="text-vibe-purple font-black text-lg tracking-tighter">+{quest.xpReward.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-vibe-purple/50 uppercase tracking-widest">X-Core</span>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-vibe-blue/5 blur-[80px] rounded-full group-hover:bg-vibe-blue/10 transition-all duration-1000" />
            </div>
          );
        })}
      </div>

      <div className="liquid-glass rounded-[3rem] p-10 border border-white/5 text-center space-y-4 shadow-4xl relative z-10" style={{ transform: 'translateZ(-50px) rotateX(5deg)' }}>
        <p className="text-[10px] font-black text-vibe-blue uppercase tracking-[0.6em]">Nexus Advisory</p>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-2xl mx-auto opacity-70">
          Les quêtes se régénèrent dynamiquement. Maximisez vos vecteurs de Novas pour une ascension neuronale optimale.
        </p>
      </div>
    </div>
  );
};

export default Quests;
