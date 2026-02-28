
import React, { useState, useEffect } from 'react';
import { User, Post } from '../types.ts';
import { storage } from '../services/storageService.ts';

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
    <div className="flex flex-col w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="vibe-logo text-4xl font-black text-white tracking-tighter cyber-glow">NEXUS BOOST</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Amplification de Signal Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="liquid-glass p-6 rounded-[2rem] border border-blue-500/20 flex flex-col items-center justify-center text-center space-y-2">
           <span className="vibe-logo text-[8px] font-black text-slate-500 uppercase tracking-widest">Boosts Restants</span>
           <span className="text-3xl font-black text-blue-400">{remaining} <span className="text-xs opacity-50">/ {limit}</span></span>
        </div>
        <div className="liquid-glass p-6 rounded-[2rem] border border-purple-500/20 flex flex-col items-center justify-center text-center space-y-2">
           <span className="vibe-logo text-[8px] font-black text-slate-500 uppercase tracking-widest">Coût Unitaire</span>
           <span className="text-3xl font-black text-purple-400">{user.isUltimate ? '100' : '250'} <span className="text-xs opacity-50">C</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex liquid-glass rounded-full p-1 border border-white/10 max-w-sm mx-auto w-full">
        <button 
          onClick={() => setActiveTab('trending')}
          className={`flex-1 py-3 px-6 text-center rounded-full transition-all ${activeTab === 'trending' ? 'bg-white text-black font-black' : 'text-slate-500 hover:text-white font-bold'}`}
        >
          <span className="text-[10px] uppercase tracking-widest vibe-logo">Tendances</span>
        </button>
        <button 
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-3 px-6 text-center rounded-full transition-all ${activeTab === 'rules' ? 'bg-white text-black font-black' : 'text-slate-500 hover:text-white font-bold'}`}
        >
          <span className="text-[10px] uppercase tracking-widest vibe-logo">Règles</span>
        </button>
      </div>

      {activeTab === 'trending' ? (
        <div className="space-y-4 pb-20">
          {boostedPosts.length > 0 ? (
            boostedPosts.map(post => (
              <BoostedCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <p className="vibe-logo text-xs text-slate-700 font-black tracking-widest uppercase">Aucune amplification détectée</p>
            </div>
          )}
        </div>
      ) : (
        <div className="liquid-glass rounded-[3rem] p-8 border border-white/10 space-y-8 animate-in slide-in-from-bottom-4">
           <div className="space-y-6">
              <h3 className="vibe-logo text-xl font-black text-white">PROTOCOLE D'AMPLIFICATION</h3>
              <div className="space-y-4 text-sm text-slate-300 font-medium leading-relaxed">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 font-black">1</div>
                    <p>Le Boost propulse votre diffusion en haut du Nexus Global pour une visibilité maximale.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 font-black">2</div>
                    <p>Chaque boost coûte de l'énergie (Crédits) et rapporte un bonus massif d'XP (+500).</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 font-black">3</div>
                    <p>Les membres <span className="text-blue-400 font-black">ULTIMATE</span> bénéficient d'une limite étendue (10/jour) et d'un coût réduit (100 C).</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 font-black">4</div>
                    <p>La limite se réinitialise chaque jour à minuit (Heure du Nexus).</p>
                 </div>
              </div>
           </div>
           
           <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">Utilisez le boost avec sagesse pour dominer le flux.</p>
           </div>
        </div>
      )}
    </div>
  );
};

const BoostedCard: React.FC<{ post: Post }> = ({ post }) => {
  const author = storage.getUsers().find(u => u.id === post.userId);
  
  return (
    <div className="liquid-glass p-5 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
             <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             <span className="text-[9px] font-black text-blue-400 uppercase">{post.boosts?.length || 0}</span>
          </div>
       </div>

       <div className="flex gap-4">
          <img src={author?.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" />
          <div className="flex-1 space-y-2">
             <div className="flex flex-col">
                <span className="font-black text-white text-sm">{author?.name}</span>
                <span className="text-slate-500 text-[10px]">@{author?.username}</span>
             </div>
             <p className="text-slate-200 text-sm line-clamp-2">{post.content}</p>
             {post.mediaUrl && (
               <div className="h-32 rounded-2xl overflow-hidden border border-white/5 bg-black">
                  {post.mediaType === 'video' ? (
                    <video src={post.mediaUrl} className="w-full h-full object-cover opacity-60" muted />
                  ) : (
                    <img src={post.mediaUrl} className="w-full h-full object-cover opacity-60" />
                  )}
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Boost;
