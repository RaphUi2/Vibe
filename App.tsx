
import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService.ts';
import { User, Post } from './types.ts';
import { gemini } from './services/geminiService.ts';
import Home from './pages/Home.tsx';
import AIHub from './pages/AIHub.tsx';
import Login from './pages/Login.tsx';
import Profile from './pages/Profile.tsx';
import Games from './pages/Games.tsx';
import Boutique from './pages/Boutique.tsx';
import LevelPassPage from './pages/LevelPass.tsx';
import Quests from './pages/Quests.tsx';
import Settings from './pages/Settings.tsx';
import Boost from './pages/Boost.tsx';
import Logo from './components/Logo.tsx';
import AILogo from './components/AILogo.tsx';
import Vibeos from './pages/Vibeos.tsx';
import Plus from './pages/Plus.tsx';
import { AnimatePresence, motion } from 'motion/react';
import { Home as HomeIcon, Video, Zap, ShieldCheck, Menu, User as UserIcon, Plus as PlusIcon } from 'lucide-react';

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

    const handleNavigate = (e: any) => {
      setActiveTab(e.detail);
    };

    window.addEventListener('vibeUserUpdated', handleUserUpdate);
    window.addEventListener('vibeRewardToast', handleReward);
    window.addEventListener('vibeOpenProfile', handleOpenProfile);
    window.addEventListener('vibeQuestCompleted', handleQuestCompleted);
    window.addEventListener('vibeNavigate', handleNavigate);
    return () => {
      window.removeEventListener('vibeUserUpdated', handleUserUpdate);
      window.removeEventListener('vibeRewardToast', handleReward);
      window.removeEventListener('vibeOpenProfile', handleOpenProfile);
      window.removeEventListener('vibeQuestCompleted', handleQuestCompleted);
      window.removeEventListener('vibeNavigate', handleNavigate);
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

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 atmosphere opacity-30"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>
           <Logo size="lg" className="animate-float" />
        </div>
        <div className="flex flex-col items-center gap-4">
           <h1 className="vibe-logo text-4xl md:text-6xl font-black text-white tracking-[0.5em] uppercase">VIBEA</h1>
           <div className="flex items-center gap-6">
              <div className="h-0.5 w-12 md:w-20 bg-gradient-to-r from-transparent to-vibe-blue" />
              <p className="text-vibe-blue text-[10px] md:text-xs font-black uppercase tracking-[1em] animate-pulse">Synchronisation Nexus</p>
              <div className="h-0.5 w-12 md:w-20 bg-gradient-to-l from-transparent to-vibe-blue" />
           </div>
        </div>
        <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ duration: 2, ease: "easeInOut" }}
             className="h-full bg-gradient-to-r from-vibe-blue via-vibe-purple to-vibe-pink"
           />
        </div>
      </motion.div>
    </div>
  );
  if (!currentUser) return <Login onLogin={handleLogin} />;

  const handleProfileNav = () => {
      setViewingProfileId(null);
      setActiveTab('profile');
  };

  const navItems = [
    { id: 'home', label: 'ACCUEIL', icon: <HomeIcon className="w-6 h-6" /> },
    { id: 'vibeos', label: 'VIBEOS', icon: <Video className="w-6 h-6" /> },
    { id: 'ia', label: 'VIBEA AI', icon: <Zap className="w-6 h-6" /> },
    { id: 'levelpass', label: 'LE PASS', icon: <ShieldCheck className="w-6 h-6" /> },
    { id: 'plus', label: 'MENU', icon: <Menu className="w-6 h-6" /> },
    { id: 'profile', label: 'PROFIL', icon: <UserIcon className="w-6 h-6" /> },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home user={currentUser} onUpdate={setCurrentUser} />;
      case 'ia': return <AIHub user={currentUser} />;
      case 'vibeos': return <Vibeos user={currentUser} />;
      case 'plus': return <Plus user={currentUser} />;
      case 'profile': return (
          <Profile 
            user={currentUser} 
            viewUserId={viewingProfileId || currentUser.id} 
            onUpdate={(u) => setCurrentUser(u)} 
          />
      );
      case 'store': return <Boutique user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'games': return <Games user={currentUser} />;
      case 'levelpass': return <LevelPassPage user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'quests': return <Quests user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'settings': return <Settings user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      case 'boost': return <Boost user={currentUser} onUpdate={(u) => setCurrentUser(u)} />;
      default: return <Home user={currentUser} onUpdate={setCurrentUser} />;
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden vibe-gradient-bg text-slate-100">
      <div className="absolute inset-0 atmosphere"></div>
      
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
        <aside className="hidden lg:flex flex-col w-[275px] sticky top-0 h-screen border-r border-white/5 px-4 py-8 z-[50]">
          <div className="flex items-center gap-4 px-3 mb-12">
            <Logo size="md" className="drop-shadow-glow" />
            <div className="flex flex-col">
              <span className="vibe-logo text-3xl font-black text-white tracking-widest leading-none">VIBE</span>
              <span className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase mt-1">Nexus Platform</span>
            </div>
          </div>
          
          <nav className="flex-1 space-y-3">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ x: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'font-black text-white bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <motion.div 
                  animate={activeTab === item.id ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] } : {}}
                  className={`${activeTab === item.id ? 'logo-vibe-text drop-shadow-[0_0_10px_rgba(138,43,226,0.5)]' : 'group-hover:text-vibe-pink'} transition-colors`}
                >
                  {item.icon}
                </motion.div>
                <span className="text-xl hidden xl:block">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto p-3 space-y-4">
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-vibe-blue via-vibe-purple to-vibe-pink text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-white/10"
            >
              Post
            </button>
            
            <button 
              onClick={handleProfileNav}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/10"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-vibe-blue to-vibe-pink">
                <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover border border-black/20" />
              </div>
              <div className="hidden xl:block">
                <div className="font-black text-white text-sm">@{currentUser.username}</div>
                <div className="text-vibe-purple text-[10px] font-black uppercase tracking-widest">Niveau {currentUser.level}</div>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 border-x border-white/5 relative overflow-y-auto custom-scrollbar pb-24 lg:pb-0 z-10">
          {renderPage()}
        </main>

        {/* Right Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[350px] sticky top-0 h-screen px-6 py-12 space-y-6 overflow-y-auto z-[50]">
          <div className="relative group pt-8">
            <div className="absolute inset-y-0 left-4 top-8 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500 group-focus-within:text-vibe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Chercher sur Vibe" 
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-vibe-blue/50 focus:bg-white/10 transition-all outline-none"
            />
          </div>

          <div className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
            <h3 className="p-6 text-xl font-black text-white tracking-tight border-b border-white/10">Tendances</h3>
            {storage.getTrends().map(trend => (
              <button key={trend.id} className="w-full p-6 text-left hover:bg-white/5 transition-all border-b border-white/10 last:border-0 group">
                <div className="text-slate-500 text-xs font-bold group-hover:text-vibe-blue transition-colors">{trend.category} · Trending</div>
                <div className="text-white font-black text-lg group-hover:translate-x-1 transition-transform">{trend.hashtag}</div>
                <div className="text-slate-500 text-xs font-bold">{trend.count} posts</div>
              </button>
            ))}
          </div>

          <div className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
            <h3 className="p-6 text-xl font-black text-white tracking-tight border-b border-white/10">Suggestions</h3>
            {storage.getUsers().slice(0, 3).map(u => (
              <div key={u.id} className="flex items-center justify-between p-6 border-b border-white/10 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-vibe-blue to-vibe-pink overflow-hidden">
                    <img src={u.avatar} className="w-10 h-10 rounded-full object-cover border border-black/20" />
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">@{u.username}</div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Niveau {u.level}</div>
                  </div>
                </div>
                <button className="px-5 py-2 bg-white text-black hover:bg-vibe-blue hover:text-white rounded-full text-xs font-black transition-all">Suivre</button>
              </div>
            ))}
          </div>
        </aside>

        {/* Bottom Navigation (Mobile) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-3xl border-t border-white/10 px-4 py-3 pb-8 flex justify-between items-center shadow-4xl">
          {navItems.map((btn: any) => {
            const isProfile = btn.id === 'profile';
            const avatar = isProfile ? currentUser.avatar : null;
            const isAI = btn.id === 'ia';
            
            // Re-mapping icons for mobile nav to match the original structure's icon paths if needed, 
            // but let's stick to the ones defined in App.tsx or use the component versions
            return (
              <motion.button 
                key={btn.id} 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  if (btn.id === 'profile') {
                    handleProfileNav();
                  } else {
                    setActiveTab(btn.id as any);
                  }
                }} 
                className={`flex flex-col items-center justify-center transition-all flex-1 ${activeTab === btn.id && (btn.id !== 'profile' || !viewingProfileId) ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                {avatar ? (
                  <motion.div 
                    animate={activeTab === 'profile' && !viewingProfileId ? { scale: 1.1 } : {}}
                    className={`relative p-0.5 rounded-xl ${activeTab === 'profile' && !viewingProfileId ? 'bg-gradient-to-tr from-vibe-blue to-vibe-pink' : 'bg-white/5'}`}
                  >
                    <img src={avatar as string} className="w-7 h-7 rounded-xl border border-black/20 transition-all object-cover" />
                  </motion.div>
                ) : isAI ? (
                  <motion.div 
                    animate={activeTab === btn.id ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
                    className={`p-1 rounded-lg transition-all ${activeTab === btn.id ? 'bg-white shadow-vibe-blue shadow-lg' : 'bg-white/5'}`}
                  >
                     <AILogo size="sm" />
                  </motion.div>
                ) : (
                  <motion.div 
                    animate={activeTab === btn.id ? { scale: [1, 1.2, 1] } : {}}
                    className={`p-1.5 rounded-lg transition-all ${activeTab === btn.id ? 'bg-white text-black shadow-vibe-blue shadow-lg' : 'text-white'}`}
                  >
                     <div className="w-5 h-5 flex items-center justify-center">
                        {btn.icon}
                     </div>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Floating Post Button (Mobile) */}
        <div className="lg:hidden fixed bottom-28 right-6 z-[200]">
           <button 
             onClick={() => setIsPostModalOpen(true)}
             className="w-12 h-12 bg-gradient-to-tr from-vibe-blue to-vibe-pink text-white rounded-2xl flex items-center justify-center shadow-4xl animate-bounce-slow"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
           </button>
        </div>
      </div>

      {isPostModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 md:pt-24 p-4 md:p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto">
           <div className="w-full max-w-xl liquid-glass rounded-[3rem] p-6 md:p-10 border border-white/10 shadow-5xl relative mb-10 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vibe-blue via-vibe-purple to-vibe-pink"></div>
              <div className="flex justify-between items-center mb-10">
                  <button onClick={() => setIsPostModalOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="vibe-logo text-xl font-black text-white tracking-widest uppercase">Nouveau Signal</div>
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
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiTools, setShowAiTools] = useState(false);

  useEffect(() => {
    // Removed event listener for header button to simplify
  }, []);

  const handleAiAction = async (type: 'grammar' | 'hashtags' | 'style' | 'image') => {
    if (!content.trim() && type !== 'image') return;
    setAiLoading(true);
    try {
      if (type === 'image') {
        const url = await gemini.generateImage(content || "A futuristic vibe");
        setMediaUrl(url);
        setMediaType('image');
      } else {
        const improved = await gemini.improveContent(content, type);
        if (type === 'hashtags') setContent(prev => `${prev}\n\n${improved}`);
        else setContent(improved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreate = () => {
    if (!content.trim() && !mediaUrl) return;
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
      // Storage limit warning for localStorage
      if (file.size > (type === 'video' ? 200 * 1024 * 1024 : 10 * 1024 * 1024)) {
        alert("Fichier trop lourd (Max 200MB Vidéo / 10MB Image).");
        return;
      }
      
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
      <div className="flex flex-col items-center gap-4 shrink-0">
        <img src={user.avatar} className="w-14 h-14 rounded-full object-cover border border-white/5" />
        <button 
          onClick={() => setShowAiTools(!showAiTools)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showAiTools ? 'bg-blue-600 text-white shadow-lg rotate-45' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          title="Assistant Vibea AI"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      </div>
      <div className="flex-1 space-y-6">
        <div className="relative">
          <textarea 
            autoFocus 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Exprimez votre vision..." 
            className="w-full bg-transparent border-none text-2xl font-semibold min-h-[140px] outline-none text-white resize-none placeholder:text-slate-600 custom-scrollbar" 
          />
          
          <AnimatePresence>
            {showAiTools && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute left-0 -bottom-2 flex flex-wrap gap-2 animate-in fade-in"
              >
                <button 
                  onClick={() => handleAiAction('grammar')}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-all flex items-center gap-2"
                >
                  {aiLoading ? <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : '✨'} Correction
                </button>
                <button 
                  onClick={() => handleAiAction('style')}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition-all flex items-center gap-2"
                >
                   {aiLoading ? <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : '🚀'} Viraliser
                </button>
                <button 
                  onClick={() => handleAiAction('hashtags')}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-2"
                >
                   {aiLoading ? <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : '#'} Hashtags
                </button>
                <button 
                  onClick={() => handleAiAction('image')}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-white/5 hover:bg-amber-500/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-all flex items-center gap-2"
                >
                   {aiLoading ? <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : '🎨'} Générer Image
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {mediaUrl && (
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <button onClick={() => setMediaUrl('')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full text-white z-10 hover:bg-black/80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {mediaType === 'video' ? (
                  <video 
                    src={mediaUrl} 
                    className="w-full max-h-72 object-cover rounded-[1.5rem]" 
                    controls 
                    muted
                    playsInline
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <img src={mediaUrl} className="w-full max-h-72 object-cover" />
                )}
            </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex gap-2">
                <label className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all cursor-pointer flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
                </label>
                <label className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all cursor-pointer flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
                </label>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-[10px] font-black vibe-logo tracking-widest text-slate-500 mr-2">
                  {content.length}/280
               </div>
               <button 
                  onClick={handleCreate}
                  disabled={!content.trim()}
                  className="px-10 py-3 bg-gradient-to-r from-vibe-blue to-vibe-pink text-white rounded-full font-black text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Synchroniser
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
