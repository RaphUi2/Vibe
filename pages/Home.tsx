
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, Comment, AIService, Story, Note } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { gemini } from '../services/geminiService.ts';
import Boost from './Boost';
import VibeScore from '../components/VibeScore';
import Logo from '../components/Logo';

const StoriesBar: React.FC<{ user: User, refresh: () => void }> = ({ user, refresh }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [viewingStoryUser, setViewingStoryUser] = useState<string | null>(null);

  useEffect(() => {
    const allStories = storage.getStories();
    const allNotes = storage.getNotes();
    setStories(allStories.filter(s => s.userId === user.id || user.friends.includes(s.userId)));
    setNotes(allNotes.filter(n => n.userId === user.id || user.friends.includes(n.userId)));
  }, [user]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    storage.addNote({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      content: noteText.substring(0, 60),
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    setNoteText('');
    setIsAddingNote(false);
    refresh();
  };

  const handleAddStory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const isVideo = file.type.startsWith('video/');
      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 60) {
            alert("La vidéo de la story ne doit pas dépasser 60 secondes.");
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            storage.addStory({
              id: Math.random().toString(36).substr(2, 9),
              userId: user.id,
              mediaUrl: reader.result as string,
              mediaType: 'video',
              createdAt: Date.now(),
              expiresAt: Date.now() + 24 * 60 * 60 * 1000,
              viewers: []
            });
            refresh();
          };
          reader.readAsDataURL(file);
        };
        video.src = URL.createObjectURL(file);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          storage.addStory({
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            mediaUrl: reader.result as string,
            mediaType: 'image',
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            viewers: []
          });
          refresh();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const usersWithStoriesOrNotes = Array.from(new Set([...stories.map(s => s.userId), ...notes.map(n => n.userId), user.id]));

  const handleStoryClick = (uid: string) => {
    const userStories = stories.filter(s => s.userId === uid);
    if (userStories.length > 0) {
      setViewingStoryUser(uid);
      setViewingStoryIndex(0);
    }
  };

  const closeStory = () => {
    setViewingStoryUser(null);
    setViewingStoryIndex(null);
  };

  const nextStory = () => {
    if (viewingStoryUser && viewingStoryIndex !== null) {
      const userStories = stories.filter(s => s.userId === viewingStoryUser);
      if (viewingStoryIndex < userStories.length - 1) {
        setViewingStoryIndex(viewingStoryIndex + 1);
      } else {
        closeStory();
      }
    }
  };

  return (
    <>
    <div className="w-full overflow-x-auto scrollbar-hide py-4 px-2 border-b border-white/5">
      <div className="flex gap-4 px-2">
        {/* Current User */}
        <div className="flex flex-col items-center gap-1 min-w-[72px] relative">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-slate-700 to-slate-500 cursor-pointer" onClick={handleAddStory}>
              <div className="w-full h-full bg-black rounded-full p-[2px]">
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <button 
              onClick={() => setIsAddingNote(true)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-black shadow-lg z-10"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </button>
            {notes.find(n => n.userId === user.id) && !isAddingNote && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-xl max-w-[100px] truncate z-20">
                {notes.find(n => n.userId === user.id)?.content}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
              </div>
            )}
            {isAddingNote && (
              <form onSubmit={handleAddNote} className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
                <input 
                  autoFocus
                  type="text" 
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onBlur={() => setIsAddingNote(false)}
                  placeholder="Note..."
                  maxLength={60}
                  className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-2xl shadow-xl w-24 outline-none"
                />
              </form>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center">Votre story</span>
        </div>

        {/* Friends */}
        {usersWithStoriesOrNotes.filter(id => id !== user.id).map(uid => {
          const u = storage.getUsers().find(x => x.id === uid);
          if (!u) return null;
          const hasStory = stories.some(s => s.userId === uid);
          const userNote = notes.find(n => n.userId === uid);
          
          return (
            <div key={uid} className="flex flex-col items-center gap-1 min-w-[72px] relative cursor-pointer" onClick={() => handleStoryClick(uid)}>
              <div className="relative">
                <div className={`w-16 h-16 rounded-full p-[2px] ${hasStory ? 'bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500' : 'bg-transparent'} cursor-pointer`}>
                  <div className="w-full h-full bg-black rounded-full p-[2px]">
                    <img src={u.avatar} className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                {userNote && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-xl max-w-[100px] truncate z-20">
                    {userNote.content}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 backdrop-blur-md border-b border-r border-white/20 rotate-45"></div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-white font-medium truncate w-full text-center">{u.username}</span>
            </div>
          );
        })}
      </div>
    </div>

    {viewingStoryUser && viewingStoryIndex !== null && (
      <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center animate-in fade-in duration-300">
        <div className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-[2rem] overflow-hidden bg-zinc-900">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
            {stories.filter(s => s.userId === viewingStoryUser).map((s, i) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className={`h-full bg-white ${i === viewingStoryIndex ? 'w-full animate-[progress_5s_linear]' : i < viewingStoryIndex ? 'w-full' : 'w-0'}`} onAnimationEnd={nextStory} />
              </div>
            ))}
          </div>

          {/* User Info */}
          <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
              <img src={storage.getUsers().find(u => u.id === viewingStoryUser)?.avatar} className="w-8 h-8 rounded-full border border-white/20" />
              <span className="text-white font-bold text-sm drop-shadow-md">{storage.getUsers().find(u => u.id === viewingStoryUser)?.username}</span>
            </div>
            <button onClick={closeStory} className="text-white p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Story Content */}
          <div className="w-full h-full" onClick={nextStory}>
            {stories.filter(s => s.userId === viewingStoryUser)[viewingStoryIndex].mediaType === 'video' ? (
              <video src={stories.filter(s => s.userId === viewingStoryUser)[viewingStoryIndex].mediaUrl} className="w-full h-full object-cover" autoPlay playsInline onEnded={nextStory} />
            ) : (
              <img src={stories.filter(s => s.userId === viewingStoryUser)[viewingStoryIndex].mediaUrl} className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};
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
    <div className="mb-8 animate-in slide-in-from-top-4 duration-700 max-w-2xl mx-auto w-full">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-vibe-blue via-vibe-purple to-vibe-orange rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        
        <div className="relative liquid-glass rounded-[2.5rem] p-6 border border-white/10 shadow-4xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-vibe-blue to-vibe-purple rounded-xl flex items-center justify-center shadow-2xl">
                    <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="vibe-logo text-sm font-black text-white tracking-[0.2em] uppercase opacity-80">Aura Pro</h3>
             </div>
             
             <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                {[
                  { id: AIService.CHAT, icon: '💬', label: 'Chat' },
                  { id: AIService.SEARCH, icon: '🔍', label: 'Search' },
                  { id: AIService.IMAGE_GEN, icon: '🎨', label: 'VibeGen' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setActiveMode(m.id)}
                    className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all ${activeMode === m.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="text-xs">{m.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{m.label}</span>
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
              placeholder={activeMode === AIService.CHAT ? "Demandez n'importe quoi..." : activeMode === AIService.SEARCH ? "Explorez le Web..." : "Imaginez un visuel..."}
              className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-vibe-blue/20 transition-all placeholder:text-slate-700 pr-16"
             />
             <button 
              onClick={handleAuraAction}
              disabled={loading || !input.trim()}
              className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl flex items-center justify-center transition-all ${loading || !input.trim() ? 'opacity-30' : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-xl'}`}
             >
               {loading ? (
                 <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
               ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
               )}
             </button>
          </div>

          {result && (
            <div className="mt-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 animate-in zoom-in-95 slide-in-from-top-4 duration-500 relative group/res">
               <button onClick={() => setResult(null)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover/res:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               
               {result.type === 'image' ? (
                  <div className="relative group">
                    <img src={result.mediaUrl} className="w-full rounded-2xl border border-white/10 shadow-5xl transition-transform group-hover:scale-[1.01] duration-700" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <button className="bg-white text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">Enregistrer</button>
                    </div>
                  </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-vibe-blue animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Réponse d'Aura</span>
                   </div>
                   <p className="text-sm font-medium text-slate-100 leading-relaxed tracking-wide">{result.text}</p>
                   {result.grounding?.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {result.grounding.map((g: any, i: number) => (
                          <a key={i} href={g.uri} target="_blank" className="px-3 py-1 bg-vibe-blue/10 border border-vibe-blue/20 rounded-full text-[8px] font-black uppercase text-vibe-blue hover:bg-vibe-blue hover:text-white transition-all transform hover:-translate-y-0.5">{g.title}</a>
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

const Home: React.FC<{ user: User, initialFeedType?: 'for-you' | 'following' }> = ({ user, initialFeedType = 'for-you' }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedType, setFeedType] = useState<'for-you' | 'following'>(initialFeedType);
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
    <div className="flex flex-col w-full animate-in fade-in duration-700 h-full">
      {/* Search & Header - Balanced Glassmorphism */}
      <div className="sticky top-0 z-[500] bg-black/40 backdrop-blur-3xl border-b border-white/5 p-4 space-y-4">
        <div className="relative group max-w-2xl mx-auto">
           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <input 
            type="text" 
            placeholder="Rechercher dans Vibe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16181c] border border-transparent rounded-full pl-12 pr-12 py-3 text-sm font-medium text-white focus:outline-none focus:bg-transparent focus:border-blue-500/50 transition-all placeholder:text-slate-500 shadow-sm"
           />
           {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           )}
        </div>

        <div className="flex justify-center">
          <div className="flex bg-[#16181c]/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
               {[
                 { id: 'for-you', label: 'Pour vous' },
                 { id: 'following', label: 'Suivis' }
               ].map((tab, idx) => (
                 <button 
                  key={tab.id}
                  onClick={() => setFeedType(tab.id as any)}
                  className={`px-10 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
                    feedType === tab.id 
                    ? 'bg-white text-black shadow-xl' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                 >
                   {tab.label}
                 </button>
               ))}
          </div>
        </div>
      </div>

      <div className="px-2 md:px-0 divide-y divide-white/5 pb-24">
        {feedType === 'for-you' && !searchQuery && <StoriesBar user={user} refresh={refresh} />}
        <div className="p-4 space-y-6">
          {feedType === 'for-you' && !searchQuery && (
            <>
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
    <div className="p-4 md:p-8 hover:bg-white/[0.04] transition-all cursor-pointer group mb-4 liquid-glass rounded-[2rem] border border-white/5 hover:border-vibe-blue/30 shadow-2xl" onClick={() => {}}>
      {post.repostOf && (
        <div className="flex items-center gap-2 mb-4 ml-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
           <svg className="w-3.5 h-3.5 logo-vibe-text" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           {author?.name} a propagé le signal
        </div>
      )}
      
      <div className="flex gap-6">
        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-vibe-blue via-vibe-purple to-vibe-pink overflow-hidden w-14 h-14 shrink-0 transition-transform group-hover:scale-105 duration-500">
          <img 
              src={originalAuthor?.avatar} 
              className="w-full h-full rounded-full border border-black/20 object-cover" 
              onClick={(e) => openProfile(e, originalAuthor!.id)}
          />
        </div>
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span 
                  className="font-black text-white hover:text-vibe-blue transition-colors truncate vibe-logo text-sm flex items-center gap-2" 
                  onClick={(e) => openProfile(e, originalAuthor!.id)}
              >
                  {originalAuthor?.name}
                  {originalAuthor?.isCertified && (
                    <div className="w-4 h-4 bg-gradient-to-tr from-vibe-blue to-vibe-purple rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg animate-pulse">V</div>
                  )}
              </span>
              <span className="text-slate-500 text-xs truncate font-medium">@{originalAuthor?.username}</span>
              <span className="text-slate-800 text-[10px]">•</span>
              <span className="text-vibe-purple text-[10px] font-black uppercase tracking-widest">{Math.floor((Date.now() - originalPost.createdAt) / 60000)}m</span>
            </div>
            <button onClick={handleSave} className={`p-2.5 rounded-2xl transition-all ${saved ? 'text-vibe-orange bg-vibe-orange/10 shadow-lg shadow-vibe-orange/20' : 'text-slate-600 hover:text-white hover:bg-white/10'}`}>
               <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </button>
          </div>
          
          <p className="text-slate-100 text-[16px] leading-relaxed whitespace-pre-wrap font-medium tracking-tight overflow-hidden text-ellipsis">{originalPost.content}</p>

          {originalPost.mediaUrl && (
            <div className="mt-4 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.5)] bg-black/40 min-h-[100px] flex items-center justify-center relative group/media">
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity z-10"></div>
               {originalPost.mediaType === 'video' ? (
                 <video 
                  src={originalPost.mediaUrl} 
                  className="w-full max-h-[600px] object-cover" 
                  autoPlay
                  loop
                  muted 
                  playsInline
                 />
               ) : (
                 <img src={originalPost.mediaUrl} className="w-full max-h-[600px] object-cover transition-transform duration-1000 group-hover:scale-[1.05]" />
               )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-8 text-slate-500 max-w-md">
            <button onClick={(e) => { e.stopPropagation(); setCommenting(!commenting); }} className="flex items-center gap-3 group hover:text-vibe-blue transition-all">
              <div className="p-3 group-hover:bg-vibe-blue/10 rounded-2xl transition-all shadow-sm group-hover:shadow-vibe-blue/20"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
              <span className="text-[10px] font-black uppercase tracking-widest">{originalPost.comments?.length || 0}</span>
            </button>
            <button onClick={handleRepost} className={`flex items-center gap-3 group transition-all ${reposted ? 'text-vibe-orange' : 'hover:text-vibe-orange'}`}>
              <div className="p-3 group-hover:bg-vibe-orange/10 rounded-2xl transition-all shadow-sm group-hover:shadow-vibe-orange/20"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>
              <span className="text-[10px] font-black uppercase tracking-widest">{originalPost.reposts?.length || 0}</span>
            </button>
            <button onClick={handleLike} className={`flex items-center gap-3 group transition-all ${liked ? 'text-vibe-pink' : 'hover:text-vibe-pink'}`}>
              <div className="p-3 group-hover:bg-vibe-pink/10 rounded-2xl transition-all shadow-sm group-hover:shadow-vibe-pink/20"><svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
              <span className="text-[10px] font-black uppercase tracking-widest">{originalPost.likes?.length || 0}</span>
            </button>
            <button 
              onClick={handleBoost} 
              className={`flex items-center gap-3 group transition-all ${boosted ? 'text-vibe-blue' : 'hover:text-vibe-blue'} ${isBoosting ? 'animate-boost' : ''} ${boosted ? 'animate-boost-pulse' : ''}`}
            >
              <div className="p-3 group-hover:bg-vibe-blue/10 rounded-2xl transition-all shadow-sm group-hover:shadow-vibe-blue/20">
                <svg className="w-5 h-5" fill={boosted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{originalPost.boosts?.length || 0}</span>
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
