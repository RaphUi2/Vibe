import React, { useState, useEffect } from 'react';
import { User, Post } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  Info, 
  ShieldAlert, 
  Flame,
  ArrowUpRight
} from 'lucide-react';

const Boost: React.FC<{ user: User }> = ({ user }) => {
  const [boostedPosts, setBoostedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'trending' | 'rules'>('trending');

  useEffect(() => {
    const all = storage.getWeeklyBoostedPosts();
    setBoostedPosts(all);
  }, []);

  const limit = user.isUltimate ? 10 : 3;
  const remaining = limit - (user.dailyBoostsCount || 0);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 pb-48 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-vibe-blue/20 rounded-2xl flex items-center justify-center border border-vibe-blue/30 shadow-glow">
                    <Zap className="w-6 h-6 text-vibe-blue fill-vibe-blue" />
                </div>
                <div>
                   <h1 className="vibe-logo text-4xl md:text-6xl font-black tracking-tighter">NEXUS BOOST</h1>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Amplification Active</span>
                   </div>
                </div>
            </div>
        </div>

        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
               whileHover={{ y: -5 }}
               className="p-8 liquid-glass rounded-[2.5rem] border border-blue-500/20 space-y-4 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Énergie de Boost</div>
               <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white vibe-logo">{remaining}</span>
                  <span className="text-sm font-bold text-slate-600 uppercase">/ {limit} unités</span>
               </div>
               <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(remaining/limit)*100}%` }}
                    className="h-full bg-blue-600 shadow-glow" 
                  />
               </div>
            </motion.div>

            <motion.div 
               whileHover={{ y: -5 }}
               className="p-8 liquid-glass rounded-[2.5rem] border border-purple-500/20 space-y-4 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coût Nexus</div>
               <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white vibe-logo">{user.isUltimate ? '100' : '250'}</span>
                  <span className="text-sm font-bold text-slate-600 uppercase">Novas / pulse</span>
               </div>
               <div className="flex items-center gap-2 text-purple-400 font-bold text-[10px] uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full w-fit border border-purple-500/20">
                  <Flame className="w-3 h-3" />
                  {user.isUltimate ? 'Priorité Ultimate Active' : 'Tarif Standard'}
               </div>
            </motion.div>
        </div>

        {/* Global Navigation */}
        <div className="flex bg-[#111216] rounded-2xl p-1 border border-white/5 shadow-inner">
            <button 
                onClick={() => setActiveTab('trending')}
                className={`flex-1 py-4 text-center rounded-xl transition-all flex items-center justify-center gap-3 ${activeTab === 'trending' ? 'bg-white text-black font-black' : 'text-slate-500 hover:text-white font-bold'}`}
            >
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-black">Top Tendances</span>
            </button>
            <button 
                onClick={() => setActiveTab('rules')}
                className={`flex-1 py-4 text-center rounded-xl transition-all flex items-center justify-center gap-3 ${activeTab === 'rules' ? 'bg-white text-black font-black' : 'text-slate-500 hover:text-white font-bold'}`}
            >
                <Info className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-black">Protocoles</span>
            </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'trending' ? (
            <motion.div 
                key="trending"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
              {boostedPosts.length > 0 ? (
                boostedPosts.map(post => <BoostedCard key={post.id} post={post} />)
              ) : (
                <div className="py-40 text-center space-y-6">
                   <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto opacity-20 border border-white/10 shadow-inner">
                      <Zap className="w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                       <p className="text-[10px] text-slate-700 font-black tracking-[0.5em] uppercase">Vidé de fréquence</p>
                       <p className="text-slate-500 text-sm font-medium">Aucun signal boosté dans ce segment temporel.</p>
                   </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
               key="rules"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="p-10 liquid-glass rounded-[3rem] border border-white/10 space-y-12 shadow-4xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                   <ShieldAlert className="w-64 h-64" />
               </div>

               <div className="space-y-8 relative z-10">
                  <h3 className="text-3xl font-black text-white vibe-logo tracking-tighter">PROTOCOLES D'AMPLIFICATION</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <RuleItem 
                        num="01" 
                        title="Priorité Globale" 
                        text="Le Boost place instantanément votre création en tête du flux mondial des utilisateurs."
                     />
                     <RuleItem 
                        num="02" 
                        title="Gain de Résonance" 
                        text="Chaque pulse injecté rapporte un bonus massif de +500 XP pour votre ascension."
                     />
                     <RuleItem 
                        num="03" 
                        title="Avantages Nexus" 
                        text="Les membres Ultimate bénéficient de 10 pulses par jour et d'un coût réduit."
                     />
                     <RuleItem 
                        num="04" 
                        title="Reset Temporel" 
                        text="Votre réservoir de boost se régénère à minuit selon le cycle solaire du Nexus."
                     />
                  </div>
               </div>

               <div className="p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-center relative z-10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Dominez le flux avec intelligence et vision.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RuleItem: React.FC<{ num: string, title: string, text: string }> = ({ num, title, text }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-3">
            <span className="text-blue-500 font-black italic tracking-widest text-lg">{num}.</span>
            <h4 className="font-black text-white uppercase text-xs tracking-widest">{title}</h4>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">{text}</p>
    </div>
);

const BoostedCard: React.FC<{ post: Post }> = ({ post }) => {
  const author = storage.getUsers().find(u => u.id === post.userId);
  
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="p-8 liquid-glass rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-2xl"
    >
       <div className="absolute top-6 right-8">
          <div className="flex items-center gap-2 bg-blue-600/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-glow">
             <ArrowUpRight className="w-3 h-3 text-blue-400" />
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{post.boosts?.length || 0} Pulse</span>
          </div>
       </div>

       <div className="flex gap-6">
          <div className="relative">
            <img src={author?.avatar} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-xl group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex-1 space-y-4">
             <div className="flex flex-col">
                <span className="font-black text-white text-lg tracking-tight">{author?.name}</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">@{author?.username}</span>
             </div>
             <p className="text-slate-300 text-base leading-relaxed font-medium line-clamp-3 group-hover:text-white transition-colors">{post.content}</p>
             
             {post.mediaUrl && (
               <div className="aspect-video mt-4 rounded-3xl overflow-hidden border border-white/5 bg-black/40 group-hover:border-white/20 transition-all relative">
                  {post.mediaType === 'video' ? (
                    <video src={post.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted />
                  ) : (
                    <img src={post.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
             )}
          </div>
       </div>
    </motion.div>
  );
};

export default Boost;
