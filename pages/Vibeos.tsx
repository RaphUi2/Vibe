import React, { useState, useEffect, useRef } from 'react';
import { Post, User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Sparkles, Heart, MessageCircle, Share2, MoreHorizontal, X, Plus, Send, Zap } from 'lucide-react';
import { gemini } from '../services/geminiService.ts';

const Vibeos: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showAiCreator, setShowAiCreator] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    const all = storage.getPosts();
    // Prioritize official Vibe account posts if any
    setPosts(all.filter(p => p.mediaType === 'video'));
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
  }, []);

  if (posts.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center p-10 space-y-6 bg-black">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-32 h-32 bg-blue-500/10 rounded-[3rem] flex items-center justify-center text-6xl animate-pulse shadow-[0_0_80px_rgba(59,130,246,0.3)] border border-blue-500/20"
         >
           🎬
         </motion.div>
         <div className="space-y-2">
            <h2 className="vibe-logo text-5xl font-black text-white tracking-widest">VIBEOS</h2>
            <p className="text-blue-400 text-xs font-black uppercase tracking-[0.6em]">Nexus Transmission</p>
         </div>
         <p className="text-slate-500 font-bold max-w-xs text-sm leading-relaxed">Le flux est actuellement silencieux. Initiez la première transmission visuelle.</p>
         <button 
           onClick={() => setShowAiCreator(true)}
           className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-transform"
         >
           Générer avec l'IA
         </button>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black relative">
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="vibe-logo text-2xl font-black text-white tracking-[0.5em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
          >
            VIBEOS
          </motion.h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2"></div>
      </div>

      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4">
         <motion.button 
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           whileHover={{ scale: 1.1, rotate: 5 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setShowAiCreator(true)}
           className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 border border-white/20 text-white rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300"
           title="Générer avec l'IA"
         >
            <Sparkles className="w-7 h-7" />
         </motion.button>
         <motion.button 
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.1 }}
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => window.dispatchEvent(new CustomEvent('vibeOpenPostModal'))}
           className="w-14 h-14 bg-white/10 backdrop-blur-3xl border border-white/20 text-white rounded-2xl flex items-center justify-center shadow-4xl hover:bg-white hover:text-black transition-all duration-300"
         >
            <Plus className="w-7 h-7" />
         </motion.button>
      </div>

      {posts.map(vibeo => (
        <VibeoCard key={vibeo.id} post={vibeo} user={user} refresh={refresh} />
      ))}

      <AnimatePresence>
        {showAiCreator && (
          <AiVideoCreator user={user} onClose={() => setShowAiCreator(false)} onCreated={refresh} />
        )}
      </AnimatePresence>
    </div>
  );
};

const AiVideoCreator: React.FC<{ user: User, onClose: () => void, onCreated: () => void }> = ({ user, onClose, onCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('Cyberpunk');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // Simulation of AI Video Generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const sampleVideos = [
        'https://assets.mixkit.co/videos/preview/mixkit-city-at-night-with-neon-lights-2189-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-teal-and-pink-colors-1100-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-colorful-liquid-paints-swirling-together-1087-large.mp4'
      ];
      const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

      storage.addPost({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        content: `IA Gen: ${prompt} #VibeAI #Generated`,
        mediaType: 'video',
        mediaUrl: randomVideo,
        createdAt: Date.now(),
        likes: [], boosts: [], reposts: [],
        comments: [],
        views: 0,
        savedBy: []
      });
      
      storage.addReward(user.id, -200, 500, `ai-video-${Date.now()}`);
      onCreated();
      onClose();
    } catch (err) {
      alert("Erreur de génération: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg liquid-glass rounded-[3rem] p-10 border border-white/10 shadow-5xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
                <h3 className="text-2xl font-black text-white vibe-logo tracking-widest">AI VIDEO GEN</h3>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Nexus Visual Engine</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </button>
        </div>

        <div className="space-y-6">
            <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez votre vision universelle..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-bold text-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black text-slate-500">200 NOVAS</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {['Cyberpunk', 'Abstrait', 'Nature', 'Spatial'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${style === s ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || user.credits < 200}
              className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${loading || !prompt.trim() || user.credits < 200 ? 'bg-white/5 text-slate-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl hover:scale-[1.02] active:scale-95'}`}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Générer la Transmission
                    </>
                )}
            </button>
            {user.credits < 200 && <p className="text-center text-red-400 text-[10px] font-black uppercase">Fonds insuffisants dans le Nexus</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

const VibeoCard: React.FC<{ post: Post, user: User, refresh: () => void }> = ({ post, user, refresh }) => {
  const author = storage.getUsers().find(u => u.id === post.userId);
  const liked = post.likes?.includes(user.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isFollowing, setIsFollowing] = useState(user.friends?.includes(post.userId) || false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.8 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleLike(post.id, user.id);
    refresh();
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    storage.addFriend(user.id, post.userId);
    const updatedUser = storage.getCurrentUser();
    setIsFollowing(updatedUser?.friends?.includes(post.userId) || false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    storage.addComment(post.id, {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      content: commentText,
      createdAt: Date.now()
    });
    setCommentText('');
    refresh();
  };

  return (
    <div className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      {post.mediaUrl ? (
        <video 
          ref={videoRef}
          src={post.mediaUrl} 
          className="h-full w-full object-cover"
          loop
          playsInline
          onClick={togglePlay}
          muted={false}
          onError={(e) => {
            console.error("Video load error", e);
            // Hide the video element on error to avoid the broken source message
            if (videoRef.current) videoRef.current.style.display = 'none';
          }}
        />
      ) : (
        <div className="h-full w-full bg-slate-900 flex items-center justify-center">
           <Video className="w-20 h-20 text-slate-700 animate-pulse" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md"
          >
            <div className="w-10 h-10 text-white/90 fill-current">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </motion.div>
        </div>
      )}

      <div className="absolute right-5 bottom-32 flex flex-col items-center gap-6 z-20">
        <div className="relative mb-4 group cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('viewProfile', { detail: post.userId }))}>
           <motion.div 
             whileHover={{ scale: 1.1 }}
             className="relative p-0.5 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"
           >
              <img src={author?.avatar} className="w-14 h-14 rounded-full border-2 border-black shadow-2xl object-cover" />
           </motion.div>
           {!isFollowing && author?.id !== user.id && (
             <button 
              onClick={handleFollow}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm border-2 border-black shadow-lg hover:scale-110 active:scale-90 transition-transform"
             >
               +
             </button>
           )}
        </div>

        <div className="flex flex-col items-center">
          <motion.button 
            whileTap={{ scale: 1.5 }}
            onClick={handleLike} 
            className="group"
          >
            <Heart className={`w-10 h-10 transition-all ${liked ? 'text-red-500 fill-current' : 'text-white'}`} />
          </motion.button>
          <span className="text-white text-xs font-black mt-1 drop-shadow-lg">{post.likes?.length || 0}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.button 
            whileTap={{ scale: 1.5 }}
            onClick={() => setShowComments(true)} 
            className="group"
          >
            <MessageCircle className="w-10 h-10 text-white hover:text-blue-400 transition-colors" />
          </motion.button>
          <span className="text-white text-xs font-black mt-1 drop-shadow-lg">{post.comments?.length || 0}</span>
        </div>

        <div className="flex flex-col items-center">
          <motion.button 
            whileTap={{ scale: 1.5 }}
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: `Vibeo par @${author?.username}`,
                  text: post.content,
                  url: window.location.href
                });
              }
            }}
            className="group"
          >
             <Share2 className="w-10 h-10 text-white hover:text-emerald-400 transition-colors" />
          </motion.button>
          <span className="text-white text-[10px] font-black mt-1 drop-shadow-lg uppercase tracking-widest hidden sm:block">Partage</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="group opacity-60 hover:opacity-100 transition-opacity">
             <MoreHorizontal className="w-10 h-10 text-white" />
          </button>
        </div>

        {post.userId === user.id && (
          <div className="flex flex-col items-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Supprimer ce Vibeo ?")) {
                  storage.deletePost(post.id);
                  refresh();
                }
              }}
              className="group opacity-60 hover:opacity-100 transition-all hover:text-red-500"
            >
              <X className="w-10 h-10" />
            </button>
            <span className="text-white text-[8px] font-black mt-1 drop-shadow-lg uppercase tracking-widest">Delete</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-6 right-24 z-10 space-y-4 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('viewProfile', { detail: post.userId }))}>
           <span className="text-white font-black text-xl drop-shadow-xl vibe-logo tracking-widest">@{author?.username}</span>
           {author?.isCertified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg">V</div>}
        </div>
        <p className="text-white text-base font-medium leading-relaxed drop-shadow-xl max-w-sm line-clamp-3 pointer-events-auto">
          {post.content}
        </p>
        <div className="flex items-center gap-3 pointer-events-auto">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
              <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden max-w-[150px]">Nexus Audio Original - {author?.name}</span>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-end"
          >
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-[#020617] w-full h-[70%] rounded-t-[3rem] flex flex-col border-t border-white/10 shadow-6xl relative"
            >
                <div className="p-1.5 w-12 bg-white/20 rounded-full mx-auto my-4" />
                <div className="px-8 pb-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-white font-black text-sm uppercase tracking-[0.3em]">{post.comments?.length || 0} Commentaires</h3>
                  <button onClick={() => setShowComments(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {post.comments?.map(comment => {
                    const commentAuthor = storage.getUsers().find(u => u.id === comment.userId);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={comment.id} 
                        className="flex gap-4"
                      >
                        <img src={commentAuthor?.avatar} className="w-10 h-10 rounded-full object-cover border border-white/5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-white font-black text-xs">@{commentAuthor?.username}</span>
                             <span className="text-[8px] text-slate-500 font-black uppercase">{Math.floor((Date.now() - comment.createdAt) / 60000)}m</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                          <div className="flex gap-4 pt-1">
                             <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Répondre</button>
                             <button className="text-[10px] font-black text-slate-500 hover:text-red-500 uppercase tracking-widest flex items-center gap-1"><Heart className="w-3 h-3" /> Like</button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {(!post.comments || post.comments.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                      <MessageCircle className="w-16 h-16 mb-4" />
                      <p className="vibe-logo text-xs font-black uppercase tracking-widest">Le vide intersidéral</p>
                    </div>
                  )}
                </div>
                <div className="p-8 pb-12 border-t border-white/5 bg-black/20">
                    <form onSubmit={handleAddComment} className="flex gap-4 items-center">
                      <div className="relative flex-1">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Établir la connexion..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-slate-700"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                            <span className="text-xl grayscale hover:grayscale-0 cursor-pointer transition-all">🔥</span>
                            <span className="text-xl grayscale hover:grayscale-0 cursor-pointer transition-all">❤️</span>
                        </div>
                      </div>
                      <button type="submit" disabled={!commentText.trim()} className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center disabled:opacity-20 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                        <Send className="w-6 h-6" />
                      </button>
                    </form>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vibeos;
