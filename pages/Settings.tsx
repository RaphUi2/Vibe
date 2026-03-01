
import React from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';

const Settings: React.FC<{ user: User, onUpdate: (user: User) => void }> = ({ user, onUpdate }) => {
  const themes = [
    { id: 'default', label: 'Vibe Blue', color: 'bg-blue-500' },
    { id: 'neon_pink', label: 'Cyber Pink', color: 'bg-pink-500' },
    { id: 'gold', label: 'Elite Gold', color: 'bg-amber-500' },
    { id: 'cyber_ocean', label: 'Cyber Ocean', color: 'bg-cyan-500' },
    { id: 'ruby', label: 'Crimson Red', color: 'bg-rose-500' },
    { id: 'emerald', label: 'Emerald Matrix', color: 'bg-emerald-500' },
  ];

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
    <div className="px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40">
      <div className="flex flex-col gap-2">
        <h2 className="vibe-logo text-3xl font-black text-white tracking-tighter">PARAMÈTRES</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">Configuration de votre compte</p>
      </div>

      {/* Account Section */}
      <section className="space-y-4">
        <h3 className="vibe-logo text-[10px] text-blue-400 font-black tracking-widest uppercase ml-1">Identité & Statut</h3>
        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-black text-white text-lg">Abonnement</h4>
              <p className="text-slate-500 text-xs">
                {user.isUltimatePlus ? 'Ultimate+' : user.isUltimate ? 'Ultimate' : 'Gratuit'}
              </p>
            </div>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black vibe-logo uppercase ${user.isUltimate ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                {user.isUltimate ? 'Actif' : 'Standard'}
            </span>
          </div>
          
          <div className="w-full h-px bg-white/5" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-black text-white text-lg">Sauvegarde</h4>
              <p className="text-slate-500 text-xs">Dernière synchronisation : {new Date().toLocaleTimeString()}</p>
            </div>
            <span className="text-emerald-400 text-[10px] font-black vibe-logo uppercase">Connecté</span>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-4">
        <h3 className="vibe-logo text-[10px] text-blue-400 font-black tracking-widest uppercase ml-1">Thèmes</h3>
        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6">
          <div className="grid grid-cols-1 gap-4">
            {themes.map(t => {
              const isUnlocked = user.unlockedThemes?.includes(t.id) || t.id === 'default';
              return (
                <button 
                  key={t.id}
                  onClick={() => toggleTheme(t.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${user.activeTheme === t.id ? 'bg-white/10 border-blue-500' : 'bg-black/20 border-white/5 hover:border-white/20'} ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full ${t.color} shadow-lg`} />
                    <div className="text-left">
                      <span className={`font-black text-sm block ${user.activeTheme === t.id ? 'text-white' : 'text-slate-400'}`}>{t.label}</span>
                      {!isUnlocked && <span className="text-[8px] text-rose-500 font-black uppercase">Verrouillé</span>}
                    </div>
                  </div>
                  {user.activeTheme === t.id && (
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                  )}
                  {!isUnlocked && (
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Update Log */}
      <section className="space-y-4">
        <h3 className="vibe-logo text-[10px] text-blue-400 font-black tracking-widest uppercase ml-1">Journal des mises à jour</h3>
        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 space-y-4">
           <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black text-white vibe-logo">v3.1.0 - L'Éveil du Nexus</span>
                 <span className="text-[8px] font-bold text-blue-400 uppercase">Nouveau</span>
              </div>
              <ul className="text-[10px] text-slate-500 space-y-1 font-medium list-disc ml-4">
                 <li>**Refonte VibeGames** : Interface style Roblox avec catégories et recherche.</li>
                 <li>**Mur de Profil** : Laissez des messages sur les profils de vos amis.</li>
                 <li>**Quêtes de Profil** : Accès rapide aux quêtes depuis votre profil.</li>
                 <li>**Certification Officielle** : Badge "V" pour les comptes vérifiés.</li>
                 <li>**Nouveaux Jeux** : Ajout de 10 jeux gratuits et 10 jeux Ultimate.</li>
                 <li>**Boost Animé** : Effets visuels améliorés pour le boost de post.</li>
                 <li>**Aura v3.0** : Redesign complet de l'IA Aura avec de nouveaux modes.</li>
                 <li>**Level Pass** : Nouveau système de progression avec récompenses.</li>
                 <li>**Thèmes Corrigés** : Les thèmes sont désormais fonctionnels et dynamiques.</li>
              </ul>
           </div>
           <div className="w-px h-full bg-white/5" />
           <div className="space-y-2 opacity-50">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black text-white vibe-logo">v2.6.0 - Refonte Visuelle</span>
                 <span className="text-[8px] font-bold text-slate-500 uppercase">Ancien</span>
              </div>
              <ul className="text-[10px] text-slate-600 space-y-1 font-medium list-disc ml-4">
                 <li>Suppression définitive des messages de retraite de Vibeos.</li>
                 <li>Nouvelle identité visuelle : Retrait des termes "Nexus" et "Flux".</li>
                 <li>**Boutique dédiée** : Centralisation des abonnements et thèmes.</li>
              </ul>
           </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <h3 className="vibe-logo text-[10px] text-rose-500 font-black tracking-widest uppercase ml-1">Zone Critique</h3>
        <div className="bg-white/5 rounded-[2rem] border border-rose-500/20 p-6 space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl font-black vibe-logo text-xs uppercase tracking-widest transition-all border border-rose-500/30"
          >
            Déconnexion
          </button>
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Version 2.6.0 • Build 901</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
