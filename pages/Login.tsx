
import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storageService';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const users = storage.getUsers();
      if (isLogin) {
        const user = users.find(u => u.email === identifier || u.username === identifier.replace('@', ''));
        if (user) {
          storage.setCurrentUser(user);
          onLogin(user);
        } else {
          alert("Identifiant introuvable.");
        }
      } else {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: username.toLowerCase().replace(/\s/g, '_').replace('@', ''),
          name: name || 'Utilisateur Vibe',
          bio: 'Nouveau membre de la communauté Vibe.',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || identifier}`,
          email: identifier,
          credits: 1000,
          xp: 0,
          level: 1,
          activeTheme: 'default',
          isInfinite: false,
          isUltimate: false,
          isUltimatePlus: false,
          lastBoosts: [],
          friends: [],
          savedPosts: [],
          unlockedThemes: ['default'],
          completedQuests: [],
          boostLimit: 3,
          dailyBoostsCount: 0,
          lastBoostReset: new Date().setHours(0, 0, 0, 0),
          vibeScore: 0,
          vibeRank: 'Nouveau Créateur',
          vibeMetrics: { energy: 0, flow: 0, impact: 0 }
        };
        storage.saveUsers([...users, newUser]);
        storage.setCurrentUser(newUser);
        onLogin(newUser);
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8 space-y-3">
           <div className="flex items-center justify-center mx-auto animate-bounce duration-[3000ms]">
              <Logo size="md" />
           </div>
           <h1 className="vibe-logo text-5xl font-black text-white tracking-tighter leading-none">VIBE</h1>
           <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[9px]">Rejoignez l'expérience v2.6</p>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-4xl backdrop-blur-[32px] space-y-6">
           <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
              >
                Connexion
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
              >
                Inscription
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                   <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 text-sm"
                    placeholder="Nom complet"
                    required
                   />
                   <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 text-sm"
                    placeholder="@pseudo"
                    required
                   />
                </div>
              )}
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 text-sm"
                placeholder={isLogin ? "Pseudo ou Email" : "Email de contact"}
                required
              />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 text-sm"
                placeholder="Mot de passe"
                required
              />

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black rounded-2xl font-black vibe-logo text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full" />
                    <span>CHARGEMENT...</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'SE CONNECTER' : 'CRÉER MON COMPTE'}</span>
                )}
              </button>
           </form>

           <p className="text-center text-[8px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
              En vous connectant, vous acceptez les conditions d'utilisation de Vibe.
           </p>
        </div>

        <div className="mt-8 text-center">
           <p className="text-slate-700 text-[7px] font-black uppercase tracking-[0.5em]">Vibe Network • Build 2.6.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
