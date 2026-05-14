import React, { useState, useEffect, useRef } from 'react';
import { Post, User } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Vibeos: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const refresh = () => {
    const all = storage.getPosts();
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
         <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-5xl animate-bounce">🎬</div>
         <h2 className="vibe-logo text-4xl font-black text-white">VIBEOS SCROLL</h2>
         <p className="text-slate-500 font-bold max-w-xs">Aucun Vibeo pour le moment. Soyez le premier à publier !</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black relative">
      {posts.map(vibeo => (
        <VibeoCard key={vibeo.id} post={vibeo} user={user} refresh={refresh} />
      ))}
    </div>
  );
};

const VibeoCard: React.FC<{ post: Post, user: User, refresh: () => void }> = ({ post, user, refresh }) => {
  const author = storage.getUsers().find(u => u.id === post.userId);
  const liked = post.likes?.includes(user.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isFollowing, setIsFollowing] = useState(user.friends?.includes(post.userId));

  // Intersection Observer for auto-play/pause
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
              videoRef.current.currentTime = 0; // Reset for next watch
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
    setIsFollowing(!isFollowing);
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
      <video 
        ref={videoRef}
        src={post.mediaUrl} 
        className="h-full w-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
        muted={false}
      />
      
      {/* Immersive Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none"></div>
      
      {/* Center Play Icon on Pause */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md scale-110">
            <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}

      {/* Side Actions (TikTok Style) */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20">
        <div className="relative mb-4">
           <img src={author?.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-xl object-cover ring-2 ring-blue-500/50" />
           {!isFollowing && author?.id !== user.id && (
             <button 
              onClick={handleFollow}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-black"
             >
               +
             </button>
           )}
        </div>

        <div className="flex flex-col items-center">
          <button onClick={handleLike} className="group active:scale-125 transition-transform">
            <svg className={`w-9 h-9 transition-colors ${liked ? 'text-red-500 fill-current' : 'text-white'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <span className="text-white text-[11px] font-black mt-1 drop-shadow-lg">{post.likes?.length || 0}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button onClick={() => setShowComments(true)} className="group active:scale-125 transition-transform">
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.5l4.5-.762A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.474 0-2.85-.398-4.03-1.09l-.278-.163-2.603.441.441-2.603-.163-.278A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" /></svg>
          </button>
          <span className="text-white text-[11px] font-black mt-1 drop-shadow-lg">{post.comments?.length || 0}</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="group active:scale-125 transition-transform">
             <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
          </button>
          <span className="text-white text-[11px] font-black mt-1 drop-shadow-lg">Plus</span>
        </div>
      </div>

      {/* Bottom Text Info */}
      <div className="absolute bottom-6 left-4 right-20 z-10 space-y-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('viewProfile', { detail: post.userId }))}>
           <span className="text-white font-black text-lg drop-shadow-md">@{author?.username}</span>
           {author?.isCertified && <span className="text-blue-400 text-xs text-[8px] bg-blue-500/20 px-1 rounded-sm border border-blue-500/30">V</span>}
        </div>
        <p className="text-white text-sm font-medium leading-snug drop-shadow-md max-w-sm line-clamp-2">
          {post.content}
        </p>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <span className="animate-spin text-xs">💿</span>
              <span className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden max-w-[100px]">Original Audio - {author?.name}</span>
           </div>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#020617] w-full h-[60%] rounded-t-[2rem] flex flex-col border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">{post.comments?.length || 0} Commentaires</h3>
              <button onClick={() => setShowComments(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {post.comments?.map(comment => {
                const commentAuthor = storage.getUsers().find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <img src={commentAuthor?.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-slate-400 font-bold text-xs">@{commentAuthor?.username}</span>
                      <p className="text-white text-sm">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
              {(!post.comments || post.comments.length === 0) && (
                <div className="text-center text-slate-500 text-xs py-10">Aucun commentaire pour le moment.</div>
              )}
            </div>
            <form onSubmit={handleAddComment} className="p-4 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button type="submit" disabled={!commentText.trim()} className="p-2 bg-blue-600 text-white rounded-full disabled:opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vibeos;
