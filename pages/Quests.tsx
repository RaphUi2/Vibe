import React from 'react';
import { User, Quest } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion } from 'motion/react';
import { 
  Target, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Award,
  ChevronRight,
  Hexagon
} from 'lucide-react';

const Quests: React.FC<{ user: User }> = ({ user }) => {
  const quests = storage.getQuests();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 pb-48 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="space-y-6 text-center">
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-400"
            >
               <Target className="w-3 h-3" />
               Nexus Chronicles
            </motion.div>
            <h1 className="vibe-logo text-5xl md:text-7xl font-black tracking-tighter drop-shadow-3xl">SYSTÈME DE QUÊTES</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-sm mx-auto">Relevez les défis neuronaux pour débloquer votre plein potentiel.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Quêtes Finies" value={user.completedQuests.length} icon={<CheckCircle2 className="w-4 h-4" />} />
            <StatBox label="Novas Gagnées" value={user.completedQuests.length * 100} icon={<Zap className="w-4 h-4" />} />
            <StatBox label="Niveau Nexus" value={user.level} icon={<TrendingUp className="w-4 h-4" />} />
            <StatBox label="Rareté" value="Origins" icon={<Award className="w-4 h-4" />} />
        </div>

        {/* Quests List */}
        <div className="space-y-6">
          {quests.map((quest, idx) => {
            const isCompleted = user.completedQuests.includes(quest.id);
            
            return (
              <motion.div 
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col md:flex-row items-center gap-8 ${
                  isCompleted 
                  ? 'border-emerald-500/20 bg-emerald-500/5 opacity-50' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 shadow-3xl'
                }`}
              >
                <div className="relative shrink-0">
                    <Hexagon className={`w-20 h-20 ${isCompleted ? 'text-emerald-500' : 'text-blue-500'} opacity-20`} />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        {isCompleted ? '✅' : '⚙️'}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      {quest.ultimate && (
                        <span className="px-2 py-0.5 bg-vibe-purple text-white text-[8px] font-black uppercase tracking-widest rounded shadow-vibe-blue/20">Ultimate</span>
                      )}
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{quest.type} core</span>
                   </div>
                   <h3 className={`text-2xl font-black vibe-logo ${isCompleted ? 'text-emerald-500' : 'text-white'}`}>
                      {quest.title}
                   </h3>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-lg">{quest.description}</p>
                </div>

                <div className="flex flex-col items-center gap-3 shrink-0">
                   <div className="flex gap-2">
                       <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 font-black text-xs">+{quest.reward} N</div>
                       <div className="px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-400 font-black text-xs">+{quest.xpReward} XP</div>
                   </div>
                   {!isCompleted && (
                       <button className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl">
                           Mantra Actif <ChevronRight className="w-4 h-4" />
                       </button>
                   )}
                </div>

                {/* Aesthetic flare */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full pointer-events-none transition-all ${isCompleted ? 'bg-emerald-500/10' : 'bg-blue-500/5 group-hover:bg-blue-500/10'}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-10 bg-white/[0.01] rounded-[3rem] border border-white/5 text-center space-y-4">
            <div className="flex items-center justify-center gap-6 opacity-30">
               <div className="h-px w-20 bg-white" />
               <Hexagon className="w-6 h-6" />
               <div className="h-px w-20 bg-white" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Protocoles de Synchronisation Actifs</p>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
              Vos accomplissements sont archivés dans le grand registre du Nexus.
            </p>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string | number, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2 hover:bg-white/[0.04] transition-all">
     <div className="flex items-center justify-between text-slate-500">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
     </div>
     <div className="text-2xl font-black text-white vibe-logo tracking-tight">{value}</div>
  </div>
);

export default Quests;
