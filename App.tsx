
import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService.ts';
import { User, Post } from './types.ts';
import Home from './pages/Home.tsx';
import AIHub from './pages/AIHub.tsx';
import Login from './pages/Login.tsx';
import Profile from './pages/Profile.tsx';
import Games from './pages/Games.tsx';
import Store from './pages/Store.tsx';
import LevelPassPage from './pages/LevelPass.tsx';
import Logo from './components/Logo.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'ia' | 'profile' | 'store' | 'games' | 'vibeos' | 'levelpass' | 'coming-soon'>('home');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [rewardToast, setRewardToast] = useState<{credits: number, xp: number, title?: string} | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  useEffect(() => {
    storage.initialize();
    const u = storage.getCurrentUser();
    setCurrentUser(u);
    setLoading(false);

    const handleUserUpdate = (e: any) => setCurrentUser(e.detail);
    const handleReward = (e: any) => {
      setRewardToast(e.detail);
      setTimeout(() => setRewardToast(null), 3000);
    };
    const handleOpenProfile = (e: any) => {
        setViewingProfileId(e.detail);
        setActiveTab('profile');
    };
    const handleQuestCompleted = (e: any) => {
      const quest = e.detail;
      setRewardToast({ credits: quest.reward, xp: quest.xpReward, title: `Quête: ${quest.title}` });
      setTimeout(() => setRewardToast(null), 4000);
    };

    window.addEventListener('vibeUserUpdated', handleUserUpdate);
    window.addEventListener('vibeRewardToast', handleReward);
    window.addEventListener('vibeOpenProfile', handleOpenProfile);
    window.addEventListener('vibeQuestCompleted', handleQuestCompleted);
    return () => {
      window.removeEventListener('vibeUserUpdated', handleUserUpdate);
      window.removeEventListener('vibeRewardToast', handleReward);
      window.removeEventListener('vibeOpenProfile', handleOpenProfile);
      window.removeEventListener('vibeQuestCompleted', handleQuestCompleted);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      document.body.className = `theme-${currentUser.activeTheme} theme-bg-gradient`;
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    setActiveTab('home');
  };

  if (loading) return <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500 font-black tracking-[1em] animate-pulse">VIBE INITIALIZING</div>;
  if (!currentUser) return <Login onLogin={handleLogin} />;

  const handleProfileNav = () => {
      setViewingProfileId(null);
      setActiveTab('profile');
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-pulse-blue pointer-events-none opacity-10"></div>

      <header className="z-[600] h-16 px-4 md:px-10 flex items-center justify-between bg-[#020617] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer group hover:scale-105 transition-all" onClick={() => setActiveTab('home')}>
            <Logo size="sm" />
          </div>
          <h1 className="vibe-logo text-base font-black tracking-tighter hidden sm:block">
              {activeTab === 'home' ? 'Accueil' : activeTab === 'vibeos' ? 'Vibeos' : activeTab.toUpperCase()}
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2.5 liquid-glass px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
              <div className="flex flex-col items-end">
                <span className="font-black text-blue-400 text-[10px] leading-none">{currentUser.credits.toLocaleString()} <span className="text-[8px] opacity-50">C</span></span>
                <div className="h-1 w-12 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(currentUser.xp / (currentUser.level * 1000)) * 100}%` }} />
                </div>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <span className="font-black text-white text-[9px] px-1.5 py-0.5 bg-blue-600 rounded-md shadow-blue-500/20">Lvl.{currentUser.level}</span>
           </div>
        </div>
      </header>

      {rewardToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] liquid-glass px-6 py-3 rounded-2xl border border-blue-500/40 flex items-center gap-6 animate-in slide-in-from-top-4 shadow-4xl backdrop-blur-3xl">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{rewardToast.title || 'Récompense'}</span>
              <div className="flex gap-4">
                 <span className="text-blue-400 font-black text-xs">+{rewardToast.credits} Crédits</span>
                 <span className="text-emerald-400 font-black text-xs">+{rewardToast.xp} XP</span>
              </div>
           </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        <div className="max-w-2xl mx-auto">
          {activeTab === 'home' && <Home user={currentUser} />}
          {activeTab === 'ia' && <AIHub user={currentUser} />}
          {activeTab === 'vibeos' && <Home user={currentUser} initialFeedType="vibeos" />}
          {activeTab === 'profile' && (
              <Profile 
                user={currentUser} 
                viewUserId={viewingProfileId || currentUser.id} 
                onUpdate={(u) => setCurrentUser(u)} 
              />
          )}
          {activeTab === 'store' && <Store user={currentUser} onUpdate={(u) => setCurrentUser(u)} />}
          {activeTab === 'games' && <Games user={currentUser} />}
          {activeTab === 'levelpass' && <LevelPassPage user={currentUser} onUpdate={(u) => setCurrentUser(u)} />}
          {activeTab === 'coming-soon' && (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center p-10 space-y-6">
               <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-5xl animate-bounce">🎬</div>
               <h2 className="vibe-logo text-4xl font-black text-white">VIBEOS SCROLL</h2>
               <p className="text-slate-500 font-bold max-w-xs">Le flux vidéo immersif arrive bientôt dans le Nexus. Préparez vos meilleurs Vibeos !</p>
               <button onClick={() => setActiveTab('home')} className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest">Retour à l'accueil</button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button - Shrunk */}
      {activeTab === 'home' && (
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="fixed bottom-28 right-6 md:right-12 w-12 h-12 liquid-glass text-blue-400 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[650] border border-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
      )}

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg h-16 liquid-glass rounded-[2rem] flex items-center justify-around z-[550] px-2 shadow-4xl border border-white/10">
        {[
          { id: 'home', label: 'Accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { id: 'coming-soon', label: 'Vibeos', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'ia', label: 'Aura', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { id: 'games', label: 'Jeux', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
          { id: 'store', label: 'Shop', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
          { id: 'levelpass', label: 'Pass', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
          { id: 'profile', label: 'Profil', avatar: currentUser.avatar }
        ].map(btn => (
          <button 
            key={btn.id} 
            onClick={(e) => {
              e.preventDefault();
              if (btn.id === 'profile') {
                handleProfileNav();
              } else {
                setActiveTab(btn.id as any);
              }
            }} 
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === btn.id && (btn.id !== 'profile' || !viewingProfileId) ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
          >
            {btn.avatar ? (
              <img src={btn.avatar} className={`w-7 h-7 rounded-full border-2 transition-all object-cover ${activeTab === 'profile' && !viewingProfileId ? 'border-blue-400' : 'border-white/10'}`} />
            ) : (
              <div className={`p-1 rounded-xl ${activeTab === btn.id ? 'bg-blue-400/10' : ''}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={btn.icon} /></svg>
              </div>
            )}
            <span className="text-[8px] font-black uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}
      </nav>

      {isPostModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 md:pt-24 p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
           <div className="w-full max-w-xl liquid-glass rounded-[3rem] p-6 md:p-8 border border-white/10 shadow-4xl relative mb-10">
              <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 font-bold hover:text-white px-4">Fermer</button>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('vibeTriggerPost'))} 
                    className="px-8 py-2.5 bg-blue-500 text-white rounded-full font-black text-sm shadow-lg hover:bg-blue-400"
                  >
                    Publier
                  </button>
              </div>
              <PostCreator user={currentUser} onCreated={() => { setIsPostModalOpen(false); window.dispatchEvent(new CustomEvent('refreshFeed')); }} />
           </div>
        </div>
      )}
    </div>
  );
};

const PostCreator: React.FC<{ user: User, onCreated: () => void }> = ({ user, onCreated }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    const handleTrigger = () => handleCreate();
    window.addEventListener('vibeTriggerPost', handleTrigger);
    return () => window.removeEventListener('vibeTriggerPost', handleTrigger);
  }, [content, mediaUrl, mediaType]);

  const handleCreate = () => {
    if (!content.trim()) return;
    storage.addPost({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      content,
      mediaType: mediaUrl ? mediaType : undefined,
      mediaUrl: mediaUrl || undefined,
      createdAt: Date.now(),
      likes: [], boosts: [], reposts: [],
      comments: [],
      views: 0,
      savedBy: []
    });
    onCreated();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setMediaType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex gap-4">
      <img src={user.avatar} className="w-14 h-14 rounded-full shrink-0 object-cover border border-white/5" />
      <div className="flex-1 space-y-6">
        <textarea 
          autoFocus 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Quoi de neuf ?" 
          className="w-full bg-transparent border-none text-2xl font-semibold min-h-[140px] outline-none text-white resize-none placeholder:text-slate-600" 
        />
        
        {mediaUrl && (
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <button onClick={() => setMediaUrl('')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full text-white z-10 hover:bg-black/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {mediaType === 'video' ? (
                  <video src={mediaUrl} className="w-full max-h-72 object-cover" controls />
                ) : (
                  <img src={mediaUrl} className="w-full max-h-72 object-cover" />
                )}
            </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex gap-4">
                <label className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all cursor-pointer flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
                </label>
                <label className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all cursor-pointer flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Vidéo</span>
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
                </label>
            </div>
            <div className="text-[10px] font-black vibe-logo tracking-widest text-slate-500">
                {content.length}/280
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
