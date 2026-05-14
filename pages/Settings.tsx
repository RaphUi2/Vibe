
import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';

const Settings: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
  const [powerSave, setPowerSave] = useState(user.settings?.powerSave ?? false);
  const [notifications, setNotifications] = useState(user.settings?.notifications ?? true);
  const [aiEnhance, setAiEnhance] = useState(true);
  const [hdStream, setHdStream] = useState(true);
  const [soundImmersion, setSoundImmersion] = useState(true);

  const updateSettings = (key: string, value: boolean) => {
    const updatedSettings = {
      powerSave,
      notifications,
      aiEnhance,
      hdStream,
      soundImmersion,
      [key]: value
    };
    
    if (key === 'powerSave') setPowerSave(value);
    if (key === 'notifications') setNotifications(value);
    if (key === 'aiEnhance') setAiEnhance(value);
    if (key === 'hdStream') setHdStream(value);
    if (key === 'soundImmersion') setSoundImmersion(value);

    const updatedUser = { ...user, settings: updatedSettings };
    storage.updateUser(updatedUser);
    onUpdate(updatedUser);
  };

  const handleLogout = () => {
      storage.setCurrentUser(null);
      window.location.reload();
  };

  return (
    <div className="px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-48 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col gap-2 relative z-10">
        <h2 className="vibe-logo text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
           PARAMÈTRES
        </h2>
        <div className="flex items-center gap-4">
           <div className="h-1 w-20 bg-vibe-blue rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
           <p className="text-vibe-blue text-[10px] font-black uppercase tracking-[0.5em]">Nexus Core Config v5.0 (Vibea)</p>
        </div>
      </div>

      {/* Account Section */}
      <section className="space-y-6 relative z-10">
        <h3 className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase ml-2 opacity-50">Noyau d'Identité</h3>
        <div className="liquid-glass rounded-[2rem] border border-white/10 p-8 space-y-8 shadow-4xl hover:border-vibe-blue/30 transition-all duration-700">
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

      {/* Advanced Options Section */}
      <section className="space-y-6 relative z-10">
        <h3 className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase ml-2 opacity-50">Flux & Immersion</h3>
        <div className="liquid-glass rounded-[3rem] border border-white/10 p-8 space-y-8 shadow-4xl hover:border-vibe-purple/30 transition-all duration-700">
          <SettingToggle 
            label="Amélioration IA (Vibea)" 
            desc="Traitement temps réel par Vibea AI 3 pour vos posts"
            active={aiEnhance}
            onToggle={() => updateSettings('aiEnhance', !aiEnhance)}
            color="bg-blue-600"
          />
          <div className="h-px bg-white/5 w-full" />
          <SettingToggle 
            label="Flux de données HD" 
            desc="Qualité vidéo maximale pour les Vibeos"
            active={hdStream}
            onToggle={() => updateSettings('hdStream', !hdStream)}
            color="bg-purple-600"
          />
          <div className="h-px bg-white/5 w-full" />
          <SettingToggle 
            label="Immersion Sonore Nexus" 
            desc="Spatialisation audio 3D et filtres adaptatifs"
            active={soundImmersion}
            onToggle={() => updateSettings('soundImmersion', !soundImmersion)}
            color="bg-pink-600"
          />
          <div className="h-px bg-white/5 w-full" />
          <SettingToggle 
            label="Résonances Push" 
            desc="Signaux prioritaires et notifications instantanées"
            active={notifications}
            onToggle={() => updateSettings('notifications', !notifications)}
            color="bg-emerald-600"
          />
          <div className="h-px bg-white/5 w-full" />
          <SettingToggle 
            label="Mode Essence (Éco)" 
            desc="Optimisation des cycles et économie d'énergie"
            active={powerSave}
            onToggle={() => updateSettings('powerSave', !powerSave)}
            color="bg-amber-600"
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6 relative z-10">
        <div className="p-8 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/20 space-y-6 shadow-4xl backdrop-blur-3xl">
          <button 
            onClick={handleLogout}
            className="w-full py-6 bg-gradient-to-r from-rose-600 to-rose-400 hover:from-rose-500 hover:to-rose-300 text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 border border-white/10"
          >
            Terminer la Session
          </button>
        </div>
      </section>
    </div>
  );
};

const SettingToggle: React.FC<{ label: string, desc: string, active: boolean, onToggle: () => void, color: string }> = ({ label, desc, active, onToggle, color }) => (
  <div className="flex items-center justify-between group">
    <div className="space-y-2">
      <h4 className="font-black text-white text-xl tracking-tight group-hover:text-white/80 transition-colors">{label}</h4>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{desc}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-16 h-8 rounded-full transition-all duration-500 p-1 border shadow-inner ${active ? `${color}/20 border-${color}/30` : 'bg-black/40 border-white/10'}`}
    >
      <div className={`w-6 h-6 rounded-xl transition-all duration-500 shadow-xl ${active ? `translate-x-8 ${color} rotate-180` : 'translate-x-0 bg-white/20'}`} />
    </button>
  </div>
);

export default Settings;
