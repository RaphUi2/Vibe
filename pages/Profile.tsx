
import React, { useState, useEffect } from 'react';
import { User, Post } from '../types.ts';
import { storage } from '../services/storageService.ts';
import Settings from './Settings';
import Quests from './Quests';
import VibeScore from '../components/VibeScore';

const Profile: React.FC<{ user: User, viewUserId: string, onUpdate: (user: User) => void }> = ({ user, viewUserId, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reposts' | 'media' | 'likes'>('posts');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

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
      case 'posts': filtered = all.filter(p => p.userId === viewUserId && !p.repostOf); break;
      case 'reposts': filtered = all.filter(p => p.userId === viewUserId && p.repostOf); break;
      case 'media': filtered = all.filter(p => p.userId === viewUserId && p.mediaUrl); break;
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

  const saveProfile = () => {
      const updated = { ...user, name: editName, bio: editBio, avatar: editAvatar, bannerUrl: editBanner };
      storage.updateUser(updated);
      onUpdate(updated);
      setIsEditing(false);
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Immersive Header */}
      <div className="relative group/banner">
        <div className="h-40 md:h-56 bg-slate-900 border-b border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
           {profileUser.bannerUrl ? (
             <img src={profileUser.bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110" />
           ) : (
             <div className="w-full h-full bg-[#020617]" />
           )}
        </div>
        
        <div className="px-4 flex justify-between items-end -mt-14 md:-mt-20 mb-4">
           <div className="relative">
              <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] border-[6px] border-[#020617] bg-slate-900 overflow-hidden shadow-2xl ${profileUser.isUltimate ? 'ring-4 ring-blue-500/50' : ''}`}>
                 <img src={profileUser.avatar} className="w-full h-full object-cover" />
              </div>
              {profileUser.isUltimate && (
                <div className="absolute bottom-1 right-1 bg-blue-500 rounded-xl p-1.5 border-4 border-[#020617] shadow-xl">
                   <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                </div>
              )}
           </div>
           
           <div className="flex gap-2 pb-2">
               {isSelf ? (
                   <div className="flex gap-2">
                    <button onClick={() => setActiveTab('quests' as any)} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button onClick={() => setActiveTab('settings' as any)} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button onClick={() => setIsEditing(true)} className="px-5 py-2 rounded-2xl border border-white/20 font-black text-xs text-white hover:bg-white/5 backdrop-blur-md transition-all">Éditer</button>
                   </div>
               ) : (
                   <button 
                    onClick={toggleFollow}
                    className={`px-6 py-2 rounded-2xl font-black text-xs transition-all ${user.friends.includes(viewUserId) ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-lg'}`}
                   >
                     {user.friends.includes(viewUserId) ? 'Suivi' : 'S\'abonner'}
                   </button>
               )}
           </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-white flex items-center gap-2 vibe-logo tracking-tight">
                {profileUser.name}
                {profileUser.isCertified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-500/20">V</div>
                )}
                {profileUser.isUltimate && !profileUser.isCertified && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                )}
            </h2>
            <p className="text-slate-500 text-sm font-bold tracking-wider">@{profileUser.username}</p>
         </div>
         
         <p className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{profileUser.bio || "Signal de bio-signature non identifié."}</p>

         <div className="flex gap-8 text-sm">
            <div className="flex gap-1.5 hover:underline cursor-pointer"><span className="font-black text-white">{profileUser.friends?.length || 0}</span> <span className="text-slate-500">Abonnements</span></div>
            <div className="flex gap-1.5 hover:underline cursor-pointer"><span className="font-black text-white">{followersCount}</span> <span className="text-slate-500">Abonnés</span></div>
         </div>

         <VibeScore user={profileUser} />

         {/* PROGRESS BAR */}
         <div className="p-4 liquid-glass rounded-3xl border border-white/10 space-y-3 shadow-xl">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                   <span className="vibe-logo text-[8px] text-blue-400 font-black tracking-[0.2em] uppercase">Progression</span>
                   <span className="text-lg font-black text-white">Niveau {profileUser.level}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-black bg-white/5 px-2 py-1 rounded-md">{profileUser.xp.toLocaleString()} / {(profileUser.level * 1000).toLocaleString()} XP</span>
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full transition-all duration-1000 ease-out" style={{ width: `${xpPercent}%` }} />
            </div>
         </div>
      </div>

      {/* TABS SLIDER */}
      <div className="mt-8 border-b border-white/5 overflow-x-auto scrollbar-hide flex sticky top-0 bg-[#020617]/90 backdrop-blur-md z-40">
        {[
          { id: 'posts', label: 'Vibe' },
          { id: 'reposts', label: 'Reposts' },
          { id: 'media', label: 'Médias' },
          { id: 'likes', label: 'J\'aime' },
          { id: 'saved', label: 'Sauvegardés' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className="flex-1 min-w-[100px] py-4 text-center relative group transition-all">
            <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>{tab.label}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
          </button>
        ))}
      </div>

      <div className="divide-y divide-white/5">
          {activeTab === 'settings' && isSelf ? (
            <Settings user={user} onUpdate={onUpdate} />
          ) : activeTab === 'quests' && isSelf ? (
            <Quests user={user} />
          ) : (
            <>
              {['posts', 'reposts', 'media', 'likes', 'saved'].includes(activeTab) && (
                <>
                  {profilePosts.map(p => <PostEntry key={p.id} post={p} user={user} />)}
                  {profilePosts.length === 0 && (
                      <div className="py-24 text-center">
                         <div className="w-16 h-16 liquid-glass rounded-full flex items-center justify-center mx-auto mb-4 opacity-10">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                         </div>
                         <p className="vibe-logo text-[10px] text-slate-700 font-black tracking-widest uppercase">Signal vide</p>
                      </div>
                  )}
                </>
              )}
            </>
          )}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
          <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-lg liquid-glass rounded-[3rem] p-8 md:p-10 border border-white/10 space-y-6 shadow-4xl">
                <div className="flex justify-between items-center">
                    <h3 className="vibe-logo text-xl font-black text-white">ÉDITION NEXUS</h3>
                    <button onClick={() => setIsEditing(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="space-y-5">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Nom d'affichage</label>
                       <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nom visible par tous" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Bio-Signature</label>
                       <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Partagez votre fréquence..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 h-24 resize-none shadow-inner" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Avatar</label>
                          <div className="relative group/edit-avatar">
                             <div className="w-full aspect-square rounded-2xl bg-black/40 border border-white/10 overflow-hidden relative">
                                <img src={editAvatar} className="w-full h-full object-cover opacity-50 group-hover/edit-avatar:opacity-30 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <label className="cursor-pointer p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                                   </label>
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Bannière</label>
                          <div className="relative group/edit-banner">
                             <div className="w-full aspect-square rounded-2xl bg-black/40 border border-white/10 overflow-hidden relative">
                                {editBanner ? (
                                   <img src={editBanner} className="w-full h-full object-cover opacity-50 group-hover/edit-banner:opacity-30 transition-opacity" />
                                ) : (
                                   <div className="w-full h-full bg-white/5" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <label className="cursor-pointer p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
                                   </label>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
                <button onClick={saveProfile} className="w-full py-5 bg-white text-black rounded-2xl font-black vibe-logo uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Sauvegarder</button>
            </div>
          </div>
      )}

      {/* PREMIUM MODAL REMOVED - NOW IN STORE */}
    </div>
  );
};

const PostEntry: React.FC<{ post: Post, user: User }> = ({ post, user }) => {
  const originalPost = post.repostOf ? storage.getPosts().find(p => p.id === post.repostOf) : post;
  if (!originalPost) return null;
  const author = storage.getUsers().find(u => u.id === post.userId);
  const originalAuthor = storage.getUsers().find(u => u.id === originalPost.userId);

  return (
    <div className="p-5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
       {post.repostOf && (
         <div className="flex items-center gap-2 mb-2 ml-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reposté
         </div>
       )}
       <div className="flex gap-4">
          <img src={originalAuthor?.avatar} className="w-12 h-12 rounded-full shrink-0 object-cover border border-white/5 shadow-md" />
          <div className="flex-1 space-y-1.5">
             <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm hover:underline">{originalAuthor?.name}</span>
                {originalAuthor?.isCertified && (
                  <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg shadow-blue-500/20">V</div>
                )}
                <span className="text-slate-500 text-xs">@{originalAuthor?.username}</span>
             </div>
             <p className="text-slate-200 text-sm leading-snug">{originalPost.content}</p>
             {originalPost.mediaUrl && (
               <div className="mt-3 rounded-2xl overflow-hidden border border-white/5 shadow-xl bg-black">
                 {originalPost.mediaType === 'video' ? (
                    <video src={originalPost.mediaUrl} className="w-full max-h-80 object-cover" controls muted />
                 ) : (
                    <img src={originalPost.mediaUrl} className="w-full max-h-80 object-cover" />
                 )}
               </div>
             )}
             <div className="flex justify-between items-center pt-3 max-w-sm text-slate-600 font-black text-[10px] tracking-widest">
                <span className="flex items-center gap-1.5 group-hover:text-blue-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {originalPost.comments?.length || 0}</span>
                <span className="flex items-center gap-1.5 group-hover:text-emerald-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> {originalPost.reposts?.length || 0}</span>
                <span className="flex items-center gap-1.5 group-hover:text-rose-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {originalPost.likes?.length || 0}</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;
