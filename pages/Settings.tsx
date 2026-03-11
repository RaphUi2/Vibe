
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
    <div className="px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40 relative" style={{ perspective: '1200px' }}>
      <div className="flex flex-col gap-2 relative z-10">
        <h2 className="vibe-logo text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter drop-shadow-xl">PARAMÈTRES</h2>
        <p className="text-blue-400/80 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-md">Configuration Système</p>
      </div>

      {/* Account Section */}
      <section className="space-y-4 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
        <h3 className="vibe-logo text-[10px] text-blue-400 font-black tracking-widest uppercase ml-1 drop-shadow-md">Identité & Statut</h3>
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 p-6 space-y-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-white/30 transition-all duration-500">
          <div className="flex items-center justify-between group">
            <div className="space-y-1">
              <h4 className="font-black text-white text-lg drop-shadow-md group-hover:text-blue-300 transition-colors">Abonnement</h4>
              <p className="text-slate-400 text-xs font-medium">
                {user.isUltimatePlus ? 'Ultimate+' : user.isUltimate ? 'Ultimate' : 'Gratuit'}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black vibe-logo uppercase shadow-lg ${user.isUltimate ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400/50' : 'bg-white/10 text-slate-400 border border-white/10'}`}>
                {user.isUltimate ? 'Actif' : 'Standard'}
            </span>
          </div>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="flex items-center justify-between group">
            <div className="space-y-1">
              <h4 className="font-black text-white text-lg drop-shadow-md group-hover:text-emerald-300 transition-colors">Sauvegarde</h4>
              <p className="text-slate-400 text-xs font-medium">Dernière synchro : {new Date().toLocaleTimeString()}</p>
            </div>
            <span className="text-emerald-400 text-[10px] font-black vibe-logo uppercase px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">Connecté</span>
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section className="space-y-4 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
        <h3 className="vibe-logo text-[10px] text-blue-400 font-black tracking-widest uppercase ml-1 drop-shadow-md">Options de l'Application</h3>
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 p-6 space-y-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-white/30 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-black text-white text-lg drop-shadow-md">Économie d'énergie</h4>
              <p className="text-slate-400 text-xs font-medium">Réduire les animations et effets 3D</p>
            </div>
            <button 
              onClick={() => updateSettings('powerSave', !powerSave)}
              className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner border ${powerSave ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-md ${powerSave ? 'left-8' : 'left-1'}`} />
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-black text-white text-lg drop-shadow-md">Notifications Push</h4>
              <p className="text-slate-400 text-xs font-medium">Recevoir des alertes pour les Novas et Quêtes</p>
            </div>
            <button 
              onClick={() => updateSettings('notifications', !notifications)}
              className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner border ${notifications ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800 border-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-md ${notifications ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-4 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(15px)' }}>
        <h3 className="vibe-logo text-[10px] text-blue-400 font-black tracking-widest uppercase ml-1 drop-shadow-md">Thèmes</h3>
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map(t => {
              const isUnlocked = user.unlockedThemes?.includes(t.id) || t.id === 'default';
              return (
                <button 
                  key={t.id}
                  onClick={() => toggleTheme(t.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${user.activeTheme === t.id ? 'bg-white/10 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'} ${!isUnlocked ? 'opacity-50 grayscale hover:scale-100' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-xl ${t.color} shadow-lg border border-white/20`} />
                    <div className="text-left">
                      <span className={`font-black text-sm block drop-shadow-md ${user.activeTheme === t.id ? 'text-white' : 'text-slate-300'}`}>{t.label}</span>
                      {!isUnlocked && <span className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Verrouillé</span>}
                    </div>
                  </div>
                  {user.activeTheme === t.id && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-white/10">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(5px)' }}>
        <h3 className="vibe-logo text-[10px] text-rose-500 font-black tracking-widest uppercase ml-1 drop-shadow-md">Zone Critique</h3>
        <div className="bg-gradient-to-br from-rose-900/20 to-black/40 rounded-3xl border border-rose-500/30 p-6 space-y-4 shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)] backdrop-blur-xl">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl font-black vibe-logo text-sm uppercase tracking-widest transition-all border border-rose-400/50 shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-[1.02] active:scale-95"
          >
            Déconnexion
          </button>
          <p className="text-center text-[10px] text-rose-500/50 font-black uppercase tracking-widest">Version 4.1.0 • Build 1042</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
