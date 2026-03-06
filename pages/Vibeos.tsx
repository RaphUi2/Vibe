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

  // Intersection Observer for auto-play/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

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
    <div className="h-full w-full snap-start relative bg-black flex items-center justify-center overflow-hidden group">
      <video 
        ref={videoRef}
        src={post.mediaUrl} 
        className="h-full w-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
      
      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-md animate-in zoom-in duration-200">
            <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1">
          <button onClick={handleLike} className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-all border border-white/10">
            <svg className="w-6 h-6" fill={liked ? '#f43f5e' : 'none'} stroke={liked ? '#f43f5e' : 'white'} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <span className="text-white font-bold text-xs drop-shadow-md">{post.likes?.length || 0}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => setShowComments(true)} className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-all border border-white/10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
          <span className="text-white font-bold text-xs drop-shadow-md">{post.comments?.length || 0}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-all border border-white/10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
          <span className="text-white font-bold text-xs drop-shadow-md">Partager</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <div className="flex items-center gap-3 mb-3">
          <img src={author?.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover" />
          <span className="text-white font-black text-sm drop-shadow-md">@{author?.username}</span>
          <button className="px-3 py-1 bg-transparent border border-white text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Suivre</button>
        </div>
        <p className="text-white text-sm font-medium drop-shadow-md line-clamp-2">{post.content}</p>
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
