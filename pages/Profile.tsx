import React, { useState, useEffect } from 'react';
import { User, Post, Message } from '../types.ts';
import { storage } from '../services/storageService.ts';
import VibeScore from '../components/VibeScore';
import { 
  Settings as SettingsIcon, 
  Edit3, 
  CheckCircle, 
  Users, 
  Heart, 
  Share2, 
  Bookmark, 
  Grid,
  Video as VideoIcon,
  Image as ImageIcon,
  MessageCircle,
  TrendingUp,
  Award,
  Plus,
  Search,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Profile: React.FC<{ user: User, viewUserId: string, onUpdate: (user: User) => void }> = ({ user, viewUserId, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reposts' | 'media' | 'likes' | 'saved' | 'wall' | 'friends'>('posts');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatFriend, setActiveChatFriend] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editBanner, setEditBanner] = useState('');

  const isSelf = viewUserId === user.id;

  useEffect(() => {
    const target = storage.getUsers().find(u => u.id === viewUserId) || user;
    setProfileUser(target);
    setEditName(target.name);
    setEditBio(target.bio);
    setEditAvatar(target.avatar);
    setEditBanner(target.bannerUrl || '');
    
    setFollowersCount(storage.getFollowers(viewUserId).length);

    const all = storage.getPosts();
    let filtered: Post[] = [];
    switch (activeTab) {
      case 'posts': filtered = all.filter(p => p.userId === viewUserId && !p.repostOf && !p.isVibeo); break;
      case 'reposts': filtered = all.filter(p => p.userId === viewUserId && p.repostOf); break;
      case 'media': filtered = all.filter(p => p.userId === viewUserId && p.mediaUrl && !p.isVibeo); break;
      case 'likes': filtered = all.filter(p => p.likes?.includes(viewUserId)); break;
      case 'saved': filtered = all.filter(p => user.savedPosts?.includes(p.id)); break;
      default: filtered = [];
    }
    setProfilePosts(filtered);
  }, [activeTab, viewUserId, user]);

  const toggleFollow = () => {
    if (isSelf) return;
    storage.addFriend(user.id, viewUserId);
    setFollowersCount(storage.getFollowers(viewUserId).length);
  };

  const handleNavigate = (dest: string) => {
    window.dispatchEvent(new CustomEvent('vibeNavigate', { detail: dest }));
  };

  const saveProfile = () => {
      const updated = { ...user, name: editName, bio: editBio, avatar: editAvatar, bannerUrl: editBanner };
      storage.updateUser(updated);
      onUpdate(updated);
      setIsEditing(false);
  };

  const handleAddWallComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    storage.addProfileComment(viewUserId, user.id, commentText);
    setCommentText('');
    const updatedUser = storage.getUsers().find(u => u.id === viewUserId);
    if (updatedUser) setProfileUser(updatedUser);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'avatar') setEditAvatar(base64String);
        else setEditBanner(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profileUser) return null;
  const xpPercent = Math.min((profileUser.xp / (profileUser.level * 1000)) * 100, 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
      {/* Cinematic Banner */}
      <div className="relative h-64 md:h-96 w-full">
        <div className="absolute inset-0 bg-black overflow-hidden">
          {profileUser.bannerUrl ? (
            <img src={profileUser.bannerUrl} className="w-full h-full object-cover opacity-60 scale-105 blur-[2px]" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="atmosphere opacity-20 w-full h-full" />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-10 right-10 flex gap-3 z-30">
            {isSelf ? (
              <>
                <button onClick={() => setIsEditing(true)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 backdrop-blur-3xl transition-all">
                  <Edit3 className="w-6 h-6" />
                </button>
                <button onClick={() => handleNavigate('settings')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 backdrop-blur-3xl transition-all">
                  <SettingsIcon className="w-6 h-6" />
                </button>
              </>
            ) : (
              <button 
                onClick={toggleFollow}
                className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${user.friends.includes(viewUserId) ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-3xl'}`}
              >
                {user.friends.includes(viewUserId) ? 'Abonné' : 'Suivre'}
              </button>
            )}
        </div>
      </div>

      {/* Avatar & Basic Info Overlap */}
      <div className="px-6 md:px-12 -mt-16 md:-mt-24 relative z-20">
         <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-vibe-blue via-vibe-purple to-vibe-pink rounded-[3rem] blur opacity-40 group-hover:opacity-100 transition duration-1000" />
               <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-[2.8rem] bg-black border-[6px] border-[#020617] overflow-hidden shadow-4xl mb-2">
                  <img src={profileUser.avatar} className="w-full h-full object-cover scale-110" />
               </div>
               {profileUser.isCertified && (
                 <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center border-4 border-[#020617] shadow-xl">
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                 </div>
               )}
            </div>
            
            <div className="space-y-2 mb-6 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl md:text-6xl font-black vibe-logo tracking-tighter text-white drop-shadow-2xl">
                    {profileUser.name}
                  </h1>
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400">Lv. {profileUser.level}</span>
               </div>
               <p className="text-slate-400 font-bold tracking-widest opacity-80">@{profileUser.username}</p>
            </div>
         </div>
      </div>

      {/* Profile Content Bento Grid */}
      <div className="px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

        
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 liquid-glass rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Signature Digitale</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                {profileUser.bio || "Aucune signature détectée dans ce flux."}
              </p>
              
              <div className="flex gap-8 pt-4">
                 <div className="space-y-1">
                    <div className="text-2xl font-black text-white">{profileUser.friends?.length || 0}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Abonnements</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-2xl font-black text-white">{followersCount}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Abonnés</div>
                 </div>
              </div>
           </div>

           <VibeScore user={profileUser} compact={true} />

           <div className="p-8 liquid-glass rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Nexus Progression</span>
                  <span className="text-blue-400">{profileUser.xp} / {profileUser.level * 1000} XP</span>
              </div>
              <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-vibe-pink transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    style={{ width: `${xpPercent}%` }}
                  />
              </div>
              <div className="flex justify-center">
                  <button onClick={() => handleNavigate('levelpass')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Détails du Pass Saison 1</button>
              </div>
           </div>
        </div>

        {/* Main Feed Area */}
        <div className="lg:col-span-8 space-y-8">
            <div className="flex bg-[#111216] rounded-2xl p-1 border border-white/5 shadow-inner sticky top-6 z-40 backdrop-blur-3xl overflow-x-auto scrollbar-hide">
              {[
                { id: 'posts', label: 'Signaux', icon: <Grid className="w-4 h-4" /> },
                { id: 'reposts', label: 'Echos', icon: <Share2 className="w-4 h-4" /> },
                { id: 'media', label: 'Reliques', icon: <ImageIcon className="w-4 h-4" /> },
                { id: 'likes', label: 'Résonances', icon: <Heart className="w-4 h-4" /> },
                { id: 'saved', label: 'Archives', icon: <Bookmark className="w-4 h-4" /> },
                { id: 'wall', label: 'Mur', icon: <MessageCircle className="w-4 h-4" /> },
                { id: 'friends', label: 'Amis', icon: <Users className="w-4 h-4" /> }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3 shrink-0 ${activeTab === tab.id ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
               {activeTab === 'friends' ? (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 liquid-glass rounded-[2.5rem] border border-white/5 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-xl font-black text-white vibe-logo tracking-tight">AJOUTER DES AMIS</h3>
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text"
                                    placeholder="Pseudo ou Email..."
                                    value={friendSearchQuery}
                                    onChange={(e) => {
                                        setFriendSearchQuery(e.target.value);
                                        if (e.target.value.length > 1) {
                                            const results = storage.getUsers().filter(u => 
                                                (u.username.toLowerCase().includes(e.target.value.toLowerCase()) || 
                                                u.email.toLowerCase().includes(e.target.value.toLowerCase())) &&
                                                u.id !== user.id
                                            );
                                            setSearchResults(results);
                                        } else {
                                            setSearchResults([]);
                                        }
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-bold"
                                />
                            </div>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                {searchResults.map(result => (
                                    <div key={result.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-3">
                                            <img src={result.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                                            <div>
                                                <div className="text-white font-black text-xs">@{result.username}</div>
                                                <div className="text-slate-500 text-[8px] font-black uppercase tracking-widest leading-none mt-1">Niveau {result.level}</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                storage.addFriend(user.id, result.id);
                                                onUpdate(storage.getCurrentUser()!);
                                                setFriendSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                            className={`p-2 rounded-xl border transition-all ${user.friends.includes(result.id) ? 'bg-white/10 border-white/20 text-slate-400' : 'bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-500/10'}`}
                                        >
                                            {user.friends.includes(result.id) ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Liste d'Amis ({profileUser.friends?.length || 0})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(profileUser.friends || []).map(friendId => {
                                const friend = storage.getUsers().find(u => u.id === friendId);
                                if (!friend) return null;
                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={friendId}
                                        className="p-6 bg-white/[0.02] liquid-glass rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all"
                                    >
                                        <div 
                                            className="flex items-center gap-4 cursor-pointer"
                                            onClick={() => handleNavigate(`profile-${friendId}`)}
                                        >
                                            <div className="relative">
                                                <div className="absolute -inset-1 bg-gradient-to-tr from-vibe-blue to-vibe-pink rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500" />
                                                <img src={friend.avatar} className="relative w-14 h-14 rounded-2xl border border-white/10 object-cover shadow-xl" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-white text-base">@{friend.username}</span>
                                                    {friend.isCertified && <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[6px] text-white">V</div>}
                                                </div>
                                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Score: {friend.vibeScore.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setActiveChatFriend(friend);
                                                    setChatMessages(storage.getMessages(user.id, friend.id));
                                                    setIsChatOpen(true);
                                                }}
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-blue-600 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/10"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleNavigate(`profile-${friendId}`)}
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {(profileUser.friends?.length || 0) === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-600 font-bold text-sm bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5 uppercase tracking-[0.2em]">
                                    Aucun ami détecté dans ce Nexus.
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
               ) : activeTab === 'wall' ? (
                 <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <form onSubmit={handleAddWallComment} className="p-8 liquid-glass rounded-[2.5rem] border border-white/5 space-y-4">
                       <textarea 
                         value={commentText}
                         onChange={(e) => setCommentText(e.target.value)}
                         placeholder="Gravez un message sur ce Nexus..."
                         className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all resize-none h-32"
                       />
                       <div className="flex justify-end">
                          <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-xl hover:bg-blue-500 transition-all">Synchroniser</button>
                       </div>
                    </form>

                    <div className="space-y-6">
                       {profileUser.profileComments?.slice().reverse().map(comment => {
                         const author = storage.getUsers().find(u => u.id === comment.authorId);
                         return (
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             key={comment.id} 
                             className="flex gap-5 p-6 md:p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/5 transition-all"
                           >
                              <img src={author?.avatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg" />
                              <div className="flex-1 space-y-3">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <span className="font-black text-white text-sm">@{author?.username}</span>
                                       {author?.isCertified && <div className="w-3 h-3 bg-blue-500 rounded-lg flex items-center justify-center text-[7px] text-white">V</div>}
                                    </div>
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-slate-300 text-base leading-relaxed font-medium">{comment.content}</p>
                              </div>
                           </motion.div>
                         );
                       })}
                    </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-6">
                    {profilePosts.map(p => <PostEntry key={p.id} post={p} user={user} />)}
                    {profilePosts.length === 0 && (
                        <div className="py-32 text-center space-y-4">
                           <div className="w-20 h-20 bg-white/2 rounded-[2rem] flex items-center justify-center mx-auto border border-white/5 opacity-50">
                              <TrendingUp className="w-10 h-10 text-slate-700" />
                           </div>
                           <p className="text-[10px] text-slate-700 font-black tracking-[0.5em] uppercase">Fréquence de vide</p>
                        </div>
                    )}
                 </div>
               )}
            </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
          {isEditing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-xl liquid-glass rounded-[3rem] p-8 md:p-12 border border-white/10 space-y-8 shadow-5xl"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="vibe-logo text-2xl font-black text-white tracking-widest">ÉDITION NEXUS</h3>
                        <button onClick={() => setIsEditing(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                           <Plus className="w-6 h-6 rotate-45" />
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Nom du Nexus</label>
                           <input value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500 shadow-inner text-lg font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Signature Bio</label>
                           <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500 h-32 resize-none shadow-inner" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 text-center block">Nucléo-Avatar</label>
                              <div className="relative group/avatar cursor-pointer w-32 h-32 mx-auto">
                                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-3xl blur opacity-25 group-hover/avatar:opacity-75 transition duration-500" />
                                 <div className="relative w-full h-full rounded-3xl bg-black border border-white/10 overflow-hidden">
                                     <img src={editAvatar} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500 opacity-60" />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <Plus className="w-8 h-8 text-white drop-shadow-lg" />
                                     </div>
                                     <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'avatar')} />
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 text-center block">Horizon-Banner</label>
                              <div className="relative group/banner cursor-pointer w-full h-32">
                                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-3xl blur opacity-25 group-hover/banner:opacity-75 transition duration-500" />
                                 <div className="relative w-full h-full rounded-3xl bg-black border border-white/10 overflow-hidden">
                                     {editBanner && <img src={editBanner} className="w-full h-full object-cover group-hover/banner:scale-110 transition-transform duration-500 opacity-60" />}
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <Plus className="w-8 h-8 text-white drop-shadow-lg" />
                                     </div>
                                     <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'banner')} />
                                 </div>
                              </div>
                           </div>
                        </div>
                    </div>

                    <button onClick={saveProfile} className="w-full py-6 bg-white text-black rounded-3xl font-black vibe-logo uppercase tracking-[0.3em] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all text-sm">Sauvegarder les Données</button>
                </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* CHAT MODAL */}
      <AnimatePresence>
          {isChatOpen && activeChatFriend && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-2xl h-[80vh] liquid-glass rounded-[3rem] border border-white/10 flex flex-col shadow-6xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-4">
                            <img src={activeChatFriend.avatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                            <div>
                                <h3 className="font-black text-white tracking-tight">CHAT AVEC @{activeChatFriend.username}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">En ligne</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                            <Plus className="w-6 h-6 rotate-45" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                        {chatMessages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                                <MessageCircle className="w-16 h-16 mb-4" />
                                <p className="text-xs font-black uppercase tracking-[0.3em]">Début de la transmission...</p>
                            </div>
                        )}
                        {chatMessages.map(msg => {
                            const isMe = msg.senderId === user.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-br-none shadow-xl' : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-none'}`}>
                                        {msg.content}
                                        <div className={`text-[8px] mt-2 opacity-50 font-black uppercase tracking-widest ${isMe ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Input */}
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!messageText.trim()) return;
                            const newMsg = {
                                id: Math.random().toString(36).substr(2, 9),
                                senderId: user.id,
                                receiverId: activeChatFriend.id,
                                content: messageText,
                                createdAt: Date.now()
                            };
                            storage.sendMessage(newMsg);
                            setChatMessages([...chatMessages, newMsg]);
                            setMessageText('');
                        }}
                        className="p-6 md:p-8 border-t border-white/10 bg-black/40 flex gap-4"
                    >
                        <input 
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                            placeholder="Entrez votre signal..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-bold"
                        />
                        <button type="submit" className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-500 transition-all active:scale-95">
                            <Share2 className="w-6 h-6 rotate-90" />
                        </button>
                    </form>
                </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const PostEntry: React.FC<{ post: Post, user: User }> = ({ post, user }) => {
  const originalPost = post.repostOf ? storage.getPosts().find(p => p.id === post.repostOf) : post;
  if (!originalPost) return null;
  const author = storage.getUsers().find(u => u.id === post.userId);
  const originalAuthor = storage.getUsers().find(u => u.id === originalPost.userId);

  return (
    <div className="p-6 md:p-10 hover:bg-white/[0.03] transition-all cursor-pointer group liquid-glass rounded-[3rem] border border-white/5 hover:border-white/10 shadow-3xl mx-2">
       {post.repostOf && (
         <div className="flex items-center gap-3 mb-6 ml-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
            <Share2 className="w-3 h-3 text-vibe-pink" />
            Propagé par {author?.name}
         </div>
       )}
       <div className="flex gap-6">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-vibe-blue via-vibe-purple to-vibe-pink rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500" />
            <img src={originalAuthor?.avatar} className="relative w-16 h-16 rounded-2xl border border-white/10 object-cover shadow-2xl transition-transform group-hover:scale-105" />
          </div>
          <div className="flex-1 space-y-4 min-w-0">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-black text-white text-lg vibe-logo tracking-tight truncate">{originalAuthor?.name}</span>
                  {originalAuthor?.isCertified && <div className="w-4 h-4 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] text-white">V</div>}
                  <span className="text-slate-500 text-xs truncate font-bold">@{originalAuthor?.username}</span>
                </div>
                <span className="text-vibe-purple text-[10px] font-black uppercase tracking-widest bg-vibe-purple/10 px-3 py-1 rounded-full">{new Date(originalPost.createdAt).toLocaleDateString()}</span>
             </div>
             
             <p className="text-slate-200 text-lg leading-relaxed font-medium tracking-tight whitespace-pre-wrap">{originalPost.content}</p>
             
             {originalPost.mediaUrl && (
               <div className="mt-6 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-5xl bg-black relative">
                  {originalPost.mediaType === 'video' ? (
                     <video src={originalPost.mediaUrl} className="w-full max-h-[500px] object-cover" autoPlay loop muted playsInline />
                  ) : (
                     <img src={originalPost.mediaUrl} className="w-full max-h-[500px] object-cover transition-transform duration-[2s] group-hover:scale-105" />
                  )}
                  {originalPost.isVibeo && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                        <VideoIcon className="w-3 h-3 text-red-500" />
                        Vibeo
                    </div>
                  )}
               </div>
             )}
             
             <div className="flex justify-between items-center pt-8 max-w-sm text-slate-500">
                <button className="flex items-center gap-4 group/btn hover:text-vibe-blue transition-all">
                  <div className="p-4 group-hover/btn:bg-vibe-blue/10 rounded-2xl transition-all shadow-inner"><MessageCircle className="w-5 h-5" /></div>
                  <span className="text-xs font-black tracking-widest">{originalPost.comments?.length || 0}</span>
                </button>
                <button className="flex items-center gap-4 group/btn hover:text-vibe-orange transition-all">
                  <div className="p-4 group-hover/btn:bg-vibe-orange/10 rounded-2xl transition-all shadow-inner"><Share2 className="w-5 h-5" /></div>
                  <span className="text-xs font-black tracking-widest">{originalPost.reposts?.length || 0}</span>
                </button>
                <button className="flex items-center gap-4 group/btn hover:text-vibe-pink transition-all">
                  <div className="p-4 group-hover/btn:bg-vibe-pink/10 rounded-2xl transition-all shadow-inner"><Heart className={`w-5 h-5 ${originalPost.likes?.includes(user.id) ? 'fill-vibe-pink' : ''}`} /></div>
                  <span className="text-xs font-black tracking-widest">{originalPost.likes?.length || 0}</span>
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;
