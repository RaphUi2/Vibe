
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, Comment, AIService } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { gemini } from '../services/geminiService.ts';
import Boost from './Boost';
import VibeScore from '../components/VibeScore';
import Logo from '../components/Logo';

const AuraProWidget: React.FC<{ user: User }> = ({ user }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeMode, setActiveMode] = useState<AIService>(AIService.CHAT);

  const handleAuraAction = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeMode === AIService.CHAT) {
        res = await gemini.chat(input);
        setResult({ text: res, type: 'text' });
        storage.addReward(user.id, 5, 20);
      } else if (activeMode === AIService.SEARCH) {
        const searchRes = await gemini.search(input);
        setResult({ ...searchRes, type: 'search' });
        storage.addReward(user.id, 10, 30);
      } else if (activeMode === AIService.IMAGE_GEN) {
        if (!user.isUltimate) {
          alert("Ultimate requis pour la génération d'images.");
          setLoading(false);
          return;
        }
        res = await gemini.generateImage(input);
        setResult({ mediaUrl: res, type: 'image' });
        storage.addReward(user.id, -500, 50);
      }
      setInput('');
    } catch (err: any) {
      alert("Erreur Aura: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 animate-in slide-in-from-top-4 duration-700">
      <div className="relative group">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
        
        <div className="relative liquid-glass rounded-[3rem] p-8 border border-white/10 shadow-4xl overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
             <div className="w-32 h-32 bg-blue-500/30 blur-3xl rounded-full animate-neural-pulse"></div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
             <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 relative z-10">
                     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                   <h3 className="vibe-logo text-xl font-black text-white tracking-tighter">AURA INTELLIGENCE</h3>
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Nexus Core v3.0 • Synchronisé</span>
                   </div>
                </div>
             </div>
             
             <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                {[
                  { id: AIService.CHAT, icon: '💬', label: 'Chat' },
                  { id: AIService.SEARCH, icon: '🔍', label: 'Search' },
                  { id: AIService.IMAGE_GEN, icon: '🎨', label: 'Art' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setActiveMode(m.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeMode === m.id ? 'bg-white text-black shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="text-sm">{m.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{m.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="relative">
             <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuraAction()}
              placeholder={activeMode === AIService.CHAT ? "Posez une question à Aura..." : activeMode === AIService.SEARCH ? "Recherche Nexus en temps réel..." : "Décrivez l'image à générer..."}
              className="w-full bg-black/60 border border-white/10 rounded-[2rem] px-8 py-5 text-white font-bold text-base focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 pr-20 shadow-inner"
             />
             <button 
              onClick={handleAuraAction}
              disabled={loading || !input.trim()}
              className={`absolute right-3 top-3 bottom-3 w-14 rounded-2xl flex items-center justify-center transition-all ${loading || !input.trim() ? 'text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-90'}`}
             >
               {loading ? (
                 <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
               ) : (
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
               )}
             </button>
          </div>

          {result && (
            <div className="mt-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 animate-in zoom-in-95 duration-500 relative backdrop-blur-3xl">
               <button onClick={() => setResult(null)} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-slate-500 hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
               {result.type === 'image' ? (
                 <div className="space-y-4">
                    <img src={result.mediaUrl} className="w-full rounded-2xl border border-white/10 shadow-4xl" />
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">Télécharger l'œuvre</button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Réponse Aura</span>
                   </div>
                   <p className="text-base font-medium text-slate-200 leading-relaxed">{result.text}</p>
                   {result.grounding?.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {result.grounding.map((g: any, i: number) => (
                          <a key={i} href={g.uri} target="_blank" className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/20 transition-all">{g.title}</a>
                        ))}
                     </div>
                   )}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<{ user: User, initialFeedType?: 'for-you' | 'following' | 'vibeos' }> = ({ user, initialFeedType = 'for-you' }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedType, setFeedType] = useState<'for-you' | 'following' | 'vibeos'>(initialFeedType);
  const [searchQuery, setSearchQuery] = useState('');

  const refresh = () => {
    let all = storage.getPosts();
    
    if (searchQuery) {
      all = all.filter(p => 
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        storage.getUsers().find(u => u.id === p.userId)?.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (feedType === 'following') {
      all = all.filter(p => user.friends.includes(p.userId) || p.userId === user.id);
    } else if (feedType === 'vibeos') {
      all = all.filter(p => p.mediaType === 'video');
    }
    setPosts(all);
  };

  useEffect(() => {
    refresh();
    const handleRef = () => refresh();
    window.addEventListener('refreshFeed', handleRef);
    window.addEventListener('vibeUserUpdated', handleRef);
    return () => {
      window.removeEventListener('refreshFeed', handleRef);
      window.removeEventListener('vibeUserUpdated', handleRef);
    };
  }, [feedType, searchQuery, user.friends]);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-700">
      {/* Search & Header - Fixed at top like Twitter */}
      <div className="sticky top-0 z-[500] bg-[#020617] border-b border-white/5 p-4 space-y-4">
        <div className="relative group">
           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <input 
            type="text" 
            placeholder="Rechercher dans Vibe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
           />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
           {[
             { id: 'for-you', label: 'Pour vous' },
             { id: 'following', label: 'Suivis' },
             { id: 'vibeos', label: 'Vibeos' }
           ].map(tab => (
             <button 
              key={tab.id}
              onClick={() => setFeedType(tab.id as any)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${feedType === tab.id ? 'bg-white text-black shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="px-2 md:px-0 divide-y divide-white/5 pb-24">
        <div className="p-4 space-y-6">
          {feedType === 'for-you' && !searchQuery && (
            <>
              <AuraProWidget user={user} />
              <VibeScore user={user} />
            </>
          )}
          {posts.map(post => <PostCard key={post.id} post={post} user={user} refresh={refresh} />)}
          {posts.length === 0 && (
            <div className="py-32 text-center space-y-4">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
               </div>
               <p className="vibe-logo text-xs text-slate-700 font-black tracking-widest uppercase">Signal Nexus vide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post, user: User, refresh: () => void }> = ({ post, user, refresh }) => {
  const [commenting, setCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isBoosting, setIsBoosting] = useState(false);
  
  const originalPost = post.repostOf ? storage.getPosts().find(p => p.id === post.repostOf) : post;
  if (!originalPost) return null;

  const author = storage.getUsers().find(x => x.id === post.userId);
  const originalAuthor = post.repostOf ? storage.getUsers().find(x => x.id === originalPost?.userId) : author;

  const liked = originalPost?.likes?.includes(user.id);
  const boosted = originalPost?.boosts?.includes(user.id) || false;
  const reposted = originalPost?.reposts?.includes(user.id) || false;
  const saved = user.savedPosts?.includes(originalPost.id) || false;

  const openProfile = (e: React.MouseEvent, uid: string) => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('vibeOpenProfile', { detail: uid }));
  };

  const handleLike = (e: React.MouseEvent) => { e.stopPropagation(); storage.toggleLike(originalPost!.id, user.id); refresh(); };
  const handleSave = (e: React.MouseEvent) => { e.stopPropagation(); storage.toggleSave(originalPost!.id, user.id); refresh(); };
  
  const handleBoost = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    if (isBoosting) return; // Prevent double-clicks
    
    setIsBoosting(true);
    const result = storage.toggleBoost(originalPost!.id, user.id);
    
    if (result.success) {
      // Refresh immediately to show the new count/state
      refresh();
      // Keep the animation state for a bit
      setTimeout(() => {
        setIsBoosting(false);
      }, 500);
    } else {
      setIsBoosting(false);
      if (result.message) alert(result.message);
    }
  };

  const handleRepost = (e: React.MouseEvent) => { e.stopPropagation(); storage.toggleRepost(originalPost!.id, user.id); refresh(); };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    storage.addComment(originalPost!.id, {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      content: commentText,
      createdAt: Date.now()
    });
    setCommentText('');
    refresh();
  };
  
  return (
    <div className="p-4 md:p-6 hover:bg-white/[0.03] transition-all cursor-pointer group mb-1" onClick={() => {}}>
      {post.repostOf && (
        <div className="flex items-center gap-2 mb-3 ml-12 text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">
           <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           {author?.name} a partagé
        </div>
      )}
      
      <div className="flex gap-4">
        <img 
            src={originalAuthor?.avatar} 
            className="w-12 h-12 rounded-full border border-white/5 shrink-0 object-cover hover:opacity-80 transition-opacity shadow-md" 
            onClick={(e) => openProfile(e, originalAuthor!.id)}
        />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-0.5">
              <span 
                  className="font-black text-white hover:underline truncate vibe-logo text-sm flex items-center gap-1" 
                  onClick={(e) => openProfile(e, originalAuthor!.id)}
              >
                  {originalAuthor?.name}
                  {originalAuthor?.isCertified && (
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg shadow-blue-500/20">V</div>
                  )}
              </span>
              <span className="text-slate-500 text-xs truncate">@{originalAuthor?.username}</span>
              <span className="text-slate-700 text-[10px]">•</span>
              <span className="text-slate-600 text-[10px] font-bold uppercase">{Math.floor((Date.now() - originalPost.createdAt) / 60000)}m</span>
            </div>
            <button onClick={handleSave} className={`p-2 rounded-xl transition-all ${saved ? 'text-blue-400 bg-blue-400/10' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}>
               <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </button>
          </div>
          
          <p className="text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap">{originalPost.content}</p>

          {originalPost.mediaUrl && (
            <div className="mt-4 rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black min-h-[100px] flex items-center justify-center">
               {originalPost.mediaType === 'video' ? (
                 <video 
                  src={originalPost.mediaUrl} 
                  className="w-full max-h-[500px] object-cover" 
                  controls 
                  playsInline
                  muted 
                 />
               ) : (
                 <img src={originalPost.mediaUrl} className="w-full max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
               )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-5 text-slate-500 max-w-sm">
            <button onClick={(e) => { e.stopPropagation(); setCommenting(!commenting); }} className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
              <div className="p-2.5 group-hover:bg-blue-400/10 rounded-full transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
              <span className="text-xs font-black">{originalPost.comments?.length || 0}</span>
            </button>
            <button onClick={handleRepost} className={`flex items-center gap-2 group transition-all ${reposted ? 'text-emerald-500' : 'hover:text-emerald-500'}`}>
              <div className="p-2.5 group-hover:bg-emerald-500/10 rounded-full transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
              <span className="text-xs font-black">{originalPost.reposts?.length || 0}</span>
            </button>
            <button onClick={handleLike} className={`flex items-center gap-2 group transition-all ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}>
              <div className="p-2.5 group-hover:bg-rose-500/10 rounded-full transition-all"><svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
              <span className="text-xs font-black">{originalPost.likes?.length || 0}</span>
            </button>
            <button 
              onClick={handleBoost} 
              className={`flex items-center gap-2 group transition-all ${boosted ? 'text-blue-400' : 'hover:text-blue-400'} ${isBoosting ? 'animate-boost' : ''} ${boosted ? 'animate-boost-pulse' : ''}`}
            >
              <div className="p-2.5 group-hover:bg-blue-400/10 rounded-full transition-all">
                <svg className="w-5 h-5" fill={boosted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-black">{originalPost.boosts?.length || 0}</span>
            </button>
          </div>

          {commenting && (
            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
               <form onSubmit={handleAddComment} className="flex gap-3">
                  <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/5" />
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Votre réponse..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 font-black text-[10px] uppercase tracking-widest hover:text-white">Répondre</button>
                  </div>
               </form>
               
               <div className="space-y-3 pl-11">
                  {originalPost.comments?.slice().reverse().map(c => {
                    const cAuthor = storage.getUsers().find(u => u.id === c.userId);
                    return (
                      <div key={c.id} className="flex gap-3">
                         <img src={cAuthor?.avatar} className="w-6 h-6 rounded-full border border-white/5" />
                         <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[10px] font-black text-white">{cAuthor?.name}</span>
                               <span className="text-[8px] text-slate-500">@{cAuthor?.username}</span>
                            </div>
                            <p className="text-xs text-slate-300">{c.content}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Home;
