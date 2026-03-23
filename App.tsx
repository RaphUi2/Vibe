
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
import Quests from './pages/Quests.tsx';
import Settings from './pages/Settings.tsx';
import Boost from './pages/Boost.tsx';
import Logo from './components/Logo.tsx';
import Vibeos from './pages/Vibeos.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'ia' | 'profile' | 'plus' | 'games' | 'vibeos' | 'levelpass' | 'coming-soon' | 'store' | 'quests' | 'settings' | 'boost'>('home');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [rewardToast, setRewardToast] = useState<{credits: number, xp: number, title?: string} | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // Reset credits once as requested
  useEffect(() => {
    if (currentUser && !localStorage.getItem('vibe_credits_reset_v3')) {
      storage.resetCredits(currentUser.id);
      localStorage.setItem('vibe_credits_reset_v3', 'true');
    }
  }, [currentUser]);

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
      document.body.className = `theme-${currentUser.activeTheme} theme-bg-gradient ${currentUser.settings?.powerSave ? 'power-save' : ''}`;
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

  const navItems = [
    { id: 'home', label: 'Accueil', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'vibeos', label: 'Vibeos', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { id: 'ia', label: 'Aura IA', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { id: 'games', label: 'Jeux', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg> },
    { id: 'levelpass', label: 'Pass', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { id: 'plus', label: 'Plus', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
    { id: 'profile', label: 'Profil', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home user={currentUser} onUpdate={setCurrentUser} />;
      case 'ia': return <AIHub user={currentUser} onUpdate={setCurrentUser} />;
      case 'vibeos': return <Vibeos user={currentUser} />;
      case 'profile': return (
          <Profile 
            user={currentUser} 
            viewUserId={viewingProfileId || currentUser.id} 
            onUpdate={(u) => setCurrentUser(u)} 
          />
      );
      case 'store': return <Store user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'games': return <Games user={currentUser} />;
      case 'levelpass': return <LevelPassPage user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'quests': return <Quests user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'settings': return <Settings user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'boost': return <Boost user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      default: return <Home user={currentUser} onUpdate={setCurrentUser} />;
    }
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-pulse-blue pointer-events-none opacity-10"></div>

      {rewardToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] liquid-glass px-6 py-3 rounded-2xl border border-blue-500/40 flex items-center gap-6 animate-in slide-in-from-top-4 shadow-4xl backdrop-blur-3xl">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{rewardToast.title || 'Récompense'}</span>
              <div className="flex gap-4">
                 <span className="text-blue-400 font-black text-xs">+{rewardToast.credits} Novas</span>
                 <span className="text-emerald-400 font-black text-xs">+{rewardToast.xp} XP</span>
              </div>
           </div>
        </div>
      )}
      <div className="max-w-[1300px] mx-auto flex h-full">
        
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[275px] sticky top-0 h-screen border-r border-black/5 dark:border-white/10 px-4 py-4">
          <div className="p-3 mb-4">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-black/10 dark:shadow-white/5 font-black text-white dark:text-black">𝕏</div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 p-3 rounded-full transition-all duration-200 ${activeTab === item.id ? 'font-black text-black dark:text-white bg-black/5 dark:bg-white/10' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {item.icon}
                <span className="text-xl hidden xl:block">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto p-3">
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-black text-lg shadow-lg shadow-blue-500/20 transition-all"
            >
              Poster
            </button>
            
            <button 
              onClick={handleProfileNav}
              className="mt-6 w-full flex items-center gap-3 p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
            >
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10" />
              <div className="hidden xl:block">
                <div className="font-black text-black dark:text-white text-sm">@{currentUser.username}</div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Niveau {currentUser.level}</div>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 border-r border-black/5 dark:border-white/10 relative overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
          {renderPage()}
          
          {/* Plus Menu Overlay */}
          {activeTab === 'plus' && (
            <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-[#1B1D22] border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="vibe-logo text-2xl font-black text-black dark:text-white tracking-tighter">PLUS</h3>
                  <button onClick={() => setActiveTab('home')} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'settings', label: 'Paramètres', icon: '⚙️', color: 'bg-slate-500' },
                    { id: 'quests', label: 'Quêtes', icon: '🎯', color: 'bg-blue-500' },
                    { id: 'store', label: 'Boutique', icon: '🛒', color: 'bg-emerald-500' },
                    { id: 'boost', label: 'Boost', icon: '🚀', color: 'bg-purple-500' }
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:scale-105 transition-all border border-transparent hover:border-blue-500/30 group"
                    >
                      <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:rotate-12 transition-transform`}>{item.icon}</div>
                      <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[350px] sticky top-0 h-screen px-6 py-4 space-y-6 overflow-y-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Chercher sur Vibe" 
              className="w-full bg-slate-100 dark:bg-[#202327] border-none rounded-full pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="bg-slate-50 dark:bg-[#16181C] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
            <h3 className="p-4 text-xl font-black text-black dark:text-white tracking-tight">Tendances pour vous</h3>
            {storage.getTrends().map(trend => (
              <button key={trend.id} className="w-full p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-all border-t border-black/5 dark:border-white/5">
                <div className="text-slate-500 text-xs font-bold">{trend.category} · Tendances</div>
                <div className="text-black dark:text-white font-black">{trend.hashtag}</div>
                <div className="text-slate-500 text-xs font-bold">{trend.count}</div>
              </button>
            ))}
            <button className="w-full p-4 text-left text-blue-500 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all">Voir plus</button>
          </div>

          <div className="bg-slate-50 dark:bg-[#16181C] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
            <h3 className="p-4 text-xl font-black text-black dark:text-white tracking-tight">Suggestions</h3>
            {storage.getUsers().slice(0, 3).map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-black dark:text-white font-black text-sm">@{u.username}</div>
                    <div className="text-slate-500 text-xs font-bold">Niveau {u.level}</div>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-black">Suivre</button>
              </div>
            ))}
            <button className="w-full p-4 text-left text-blue-500 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all">Voir plus</button>
          </div>
        </aside>

        {/* Bottom Navigation (Mobile) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-4 py-3 pb-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          {[
            { id: 'home', label: 'Accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'vibeos', label: 'Vibeos', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'ia', label: 'Aura', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'games', label: 'Jeux', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
            { id: 'levelpass', label: 'Pass', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
            { id: 'plus', label: 'Plus', icon: 'M4 6h16M4 12h16M4 18h16' },
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
            </button>
          ))}
        </nav>
      </div>

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
      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 60) {
            alert("La vidéo ne doit pas dépasser 60 secondes.");
            return;
          }
          if (video.videoWidth > video.videoHeight) {
            alert("La vidéo doit être au format vertical (ex: 9:16).");
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setMediaUrl(reader.result as string);
            setMediaType(type);
          };
          reader.readAsDataURL(file);
        };
        video.src = URL.createObjectURL(file);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaUrl(reader.result as string);
          setMediaType(type);
        };
        reader.readAsDataURL(file);
      }
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
