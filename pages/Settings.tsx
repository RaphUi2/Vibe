
import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';

const Settings: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
  const themes = [
    { id: 'default', label: 'Vibe Blue', color: 'bg-blue-500' },
    { id: 'obsidian', label: 'Obsidian Black', color: 'bg-zinc-900' },
    { id: 'neon_pink', label: 'Cyber Pink', color: 'bg-pink-500' },
    { id: 'gold', label: 'Elite Gold', color: 'bg-amber-500' },
    { id: 'cyber_ocean', label: 'Cyber Ocean', color: 'bg-cyan-500' },
    { id: 'ruby', label: 'Crimson Red', color: 'bg-rose-500' },
    { id: 'emerald', label: 'Emerald Matrix', color: 'bg-emerald-500' },
    { id: 'royal', label: 'Royal Purple', color: 'bg-violet-600' },
    { id: 'matrix', label: 'The Matrix', color: 'bg-green-500' },
    { id: 'sunset', label: 'Synthwave Sunset', color: 'bg-orange-500' },
    { id: 'abyss', label: 'Deep Abyss', color: 'bg-indigo-900' },
    { id: 'hologram', label: 'Holographic', color: 'bg-teal-400' },
    { id: 'lava', label: 'Magma Core', color: 'bg-red-600' },
  ];

  const [powerSave, setPowerSave] = useState(user.settings?.powerSave ?? false);
  const [notifications, setNotifications] = useState(user.settings?.notifications ?? true);

  const updateSettings = (key: 'powerSave' | 'notifications', value: boolean) => {
    const updatedSettings = {
      powerSave,
      notifications,
      [key]: value
    };
    
    if (key === 'powerSave') setPowerSave(value);
    if (key === 'notifications') setNotifications(value);

    const updatedUser = { ...user, settings: updatedSettings };
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
  };

  const toggleTheme = (themeId: string) => {
    if (!user.unlockedThemes?.includes(themeId) && themeId !== 'default') {
      alert("Ce thème est verrouillé. Visitez la boutique pour le débloquer !");
      return;
    }
    const updated = { ...user, activeTheme: themeId };
    storage.updateUser(updated);
    onUpdate(updated);
  };

  const handleLogout = () => {
      storage.setCurrentUser(null);
      window.location.reload();
  };

  return (
    <div className="px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-48 relative" style={{ perspective: '2000px' }}>
      <div className="flex flex-col gap-2 relative z-10" style={{ transform: 'translateZ(100px)' }}>
        <h2 className="vibe-logo text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
           PARAMÈTRES
        </h2>
        <div className="flex items-center gap-4">
           <div className="h-1 w-20 bg-vibe-blue rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
           <p className="text-vibe-blue text-[10px] font-black uppercase tracking-[0.5em]">Nexus Core Config v4.2</p>
        </div>
      </div>

      {/* Account Section */}
      <section className="space-y-6 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg) rotateY(-2deg)' }}>
        <h3 className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase ml-2 opacity-50">Noyau d'Identité</h3>
        <div className="liquid-glass rounded-[2rem] border border-white/10 p-8 space-y-8 shadow-4xl hover:border-vibe-blue/30 transition-all duration-700" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-center justify-between group">
            <div className="space-y-2">
              <h4 className="font-black text-white text-xl tracking-tight group-hover:text-vibe-blue transition-colors">Abonnement Spectral</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">
                {user.isUltimatePlus ? 'Vibe Ultimate+' : user.isUltimate ? 'Vibe Ultimate' : 'Initié Standard'}
              </p>
            </div>
            <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${user.isUltimate ? 'bg-gradient-to-r from-vibe-blue to-vibe-purple text-white shadow-vibe-blue/20' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                {user.isUltimate ? 'Séquence Active' : 'Upgrade Requis'}
            </div>
          </div>
          
          <div className="h-px bg-white/5 w-full" />
          
          <div className="flex items-center justify-between group">
            <div className="space-y-2">
              <h4 className="font-black text-white text-xl tracking-tight group-hover:text-vibe-green transition-colors">Nexus Cloud Sync</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">Dernier Upload : {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-vibe-green/5 rounded-2xl border border-vibe-green/20">
               <div className="w-1.5 h-1.5 bg-vibe-green rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
               <span className="text-vibe-green text-[10px] font-black uppercase tracking-widest">Connecté</span>
            </div>
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section className="space-y-6 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-5deg) rotateY(2deg)' }}>
        <h3 className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase ml-2 opacity-50">Interface & Flux</h3>
        <div className="liquid-glass rounded-[2rem] border border-white/10 p-8 space-y-8 shadow-4xl hover:border-vibe-purple/30 transition-all duration-700" style={{ transform: 'translateZ(50px)' }}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-black text-white text-xl tracking-tight">Mode Essence (Éco)</h4>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Optimiser les cycles 3D & Fluence</p>
            </div>
            <button 
              onClick={() => updateSettings('powerSave', !powerSave)}
              className={`w-16 h-8 rounded-full transition-all duration-500 p-1 border shadow-inner ${powerSave ? 'bg-vibe-green/20 border-vibe-green/30' : 'bg-black/40 border-white/10'}`}
            >
              <div className={`w-6 h-6 rounded-xl transition-all duration-500 shadow-xl ${powerSave ? 'translate-x-8 bg-vibe-green rotate-180' : 'translate-x-0 bg-white/20'}`} />
            </button>
          </div>

          <div className="h-px bg-white/5 w-full" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-black text-white text-xl tracking-tight">Résonances Push</h4>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Signaux de Novas & Chroniques</p>
            </div>
            <button 
              onClick={() => updateSettings('notifications', !notifications)}
              className={`w-16 h-8 rounded-full transition-all duration-500 p-1 border shadow-inner ${notifications ? 'bg-vibe-blue/20 border-vibe-blue/30' : 'bg-black/40 border-white/10'}`}
            >
              <div className={`w-6 h-6 rounded-xl transition-all duration-500 shadow-xl ${notifications ? 'translate-x-8 bg-vibe-blue' : 'translate-x-0 bg-white/20'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-6 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}>
        <h3 className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase ml-2 opacity-50">Skins de Réalité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((t, idx) => {
            const isUnlocked = user.unlockedThemes?.includes(t.id) || t.id === 'default';
            return (
              <button 
                key={t.id}
                onClick={() => toggleTheme(t.id)}
                style={{ transform: `translateZ(${idx * 5}px)` }}
                className={`flex items-center justify-between p-6 rounded-3xl transition-all duration-500 border-2 ${user.activeTheme === t.id ? 'bg-white/10 border-vibe-blue shadow-vibe-blue/10' : 'bg-black/60 border-white/5 hover:border-white/20 hover:bg-white/5'} ${!isUnlocked ? 'opacity-30 grayscale saturate-0' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl ${t.color} shadow-2xl relative overflow-hidden group/swatch`}>
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/swatch:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-left space-y-1">
                    <span className={`font-black text-base block uppercase tracking-tighter ${user.activeTheme === t.id ? 'text-white' : 'text-slate-400'}`}>{t.label}</span>
                    {!isUnlocked && <span className="text-[8px] text-vibe-pink font-black uppercase tracking-[0.3em]">Code Lock</span>}
                  </div>
                </div>
                {user.activeTheme === t.id && (
                  <div className="w-10 h-10 rounded-2xl bg-vibe-blue/10 flex items-center justify-center border border-vibe-blue/30 shadow-vibe-blue/20">
                    <svg className="w-6 h-6 text-vibe-blue" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg)' }}>
        <div className="liquid-glass-danger rounded-[2rem] border border-rose-500/20 p-8 space-y-6 shadow-4xl backdrop-blur-3xl">
          <button 
            onClick={handleLogout}
            className="w-full py-5 bg-gradient-to-r from-rose-600 to-rose-400 hover:from-rose-500 hover:to-rose-300 text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-vibe-pink/20 hover:scale-[1.02] active:scale-95 border border-white/10"
          >
            Terminer la Session
          </button>
          <div className="flex flex-col items-center gap-2 opacity-30">
             <p className="text-[10px] text-white font-black uppercase tracking-[0.5em]">VibeOS Revision 5.0.0</p>
             <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Digital Nexus Authority • All rights reserved</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
