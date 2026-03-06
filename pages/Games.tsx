import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Games: React.FC<{ user: User }> = ({ user }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showUltimateModal, setShowUltimateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const games = [
    // FREE GAMES (10)
    { id: 'clicker', name: 'Synth Clicker', icon: '⚡', color: 'from-blue-600 to-cyan-400', desc: 'Générez des crédits via impulsions neuronales.', difficulty: 'Easy', tier: 'free', players: '1.2k', rating: '94%', image: 'https://picsum.photos/seed/clicker/800/600' },
    { id: 'snake', name: 'Neural Snake', icon: '🐍', color: 'from-emerald-600 to-teal-400', desc: 'Collectez des fragments de données sans collision.', difficulty: 'Medium', tier: 'free', players: '850', rating: '88%', image: 'https://picsum.photos/seed/snake/800/600' },
    { id: 'runner', name: 'Nexus Runner', icon: '🏃', color: 'from-orange-600 to-amber-400', desc: 'Évitez les obstacles dans le tunnel du Nexus.', difficulty: 'Medium', tier: 'free', players: '3.4k', rating: '92%', image: 'https://picsum.photos/seed/runner/800/600' },
    { id: 'jump', name: 'Neon Jump', icon: '🚀', color: 'from-cyan-600 to-blue-400', desc: 'Sautez de plateforme en plateforme.', difficulty: 'Easy', tier: 'free', players: '1.5k', rating: '90%', image: 'https://picsum.photos/seed/jump/800/600' },
    { id: 'dodge', name: 'Data Dodge', icon: '🛡️', color: 'from-yellow-600 to-amber-400', desc: 'Esquivez les pare-feux du Nexus.', difficulty: 'Medium', tier: 'free', players: '2.3k', rating: '93%', image: 'https://picsum.photos/seed/dodge/800/600' },
    { id: 'quiz', name: 'Vibe Quiz', icon: '❓', color: 'from-pink-600 to-rose-400', desc: 'Testez vos connaissances sur le Nexus.', difficulty: 'Easy', tier: 'free', players: '900', rating: '85%', image: 'https://picsum.photos/seed/quiz/800/600' },
    { id: 'stack', name: 'Block Stack', icon: '🧱', color: 'from-indigo-600 to-purple-400', desc: 'Empilez les blocs de données.', difficulty: 'Easy', tier: 'free', players: '1.1k', rating: '87%', image: 'https://picsum.photos/seed/stack/800/600' },
    { id: 'aim', name: 'Aim Trainer', icon: '🎯', color: 'from-red-600 to-rose-400', desc: 'Améliorez vos réflexes.', difficulty: 'Hard', tier: 'free', players: '2.5k', rating: '91%', image: 'https://picsum.photos/seed/aim/800/600' },
    { id: 'color', name: 'Color Match', icon: '🎨', color: 'from-teal-600 to-emerald-400', desc: 'Associez les couleurs du Nexus.', difficulty: 'Medium', tier: 'free', players: '1.4k', rating: '89%', image: 'https://picsum.photos/seed/color/800/600' },
    { id: 'tap', name: 'Fast Tap', icon: '👆', color: 'from-purple-600 to-fuchsia-400', desc: 'Tapez le plus vite possible.', difficulty: 'Easy', tier: 'free', players: '3.1k', rating: '95%', image: 'https://picsum.photos/seed/tap/800/600' },
    { id: 'memory', name: 'Neuro Memory', icon: '🧠', color: 'from-blue-500 to-indigo-400', desc: 'Testez votre mémoire visuelle.', difficulty: 'Medium', tier: 'free', players: '1.8k', rating: '92%', image: 'https://picsum.photos/seed/memory/800/600' },
    { id: 'bricks', name: 'Cyber Bricks', icon: '🧱', color: 'from-orange-500 to-red-400', desc: 'Cassez les briques du Nexus.', difficulty: 'Easy', tier: 'free', players: '2.2k', rating: '90%', image: 'https://picsum.photos/seed/bricks/800/600' },
    { id: 'flappy', name: 'Vibe Bird', icon: '🐦', color: 'from-yellow-500 to-orange-400', desc: 'Volez à travers les serveurs.', difficulty: 'Hard', tier: 'free', players: '4.5k', rating: '88%', image: 'https://picsum.photos/seed/flappy/800/600' },
    { id: 'tetris', name: 'Nexus Blocks', icon: '🧊', color: 'from-indigo-500 to-blue-400', desc: 'Alignez les blocs de données.', difficulty: 'Hard', tier: 'free', players: '3.9k', rating: '94%', image: 'https://picsum.photos/seed/tetris/800/600' },

    // ULTIMATE GAMES (5)
    { id: 'matrix', name: 'Memory Matrix', icon: '💠', color: 'from-purple-600 to-indigo-600', desc: 'Répétez la séquence de synchronisation Aura.', difficulty: 'Hard', tier: 'ultimate', players: '420', rating: '91%', image: 'https://picsum.photos/seed/matrix/800/600' },
    { id: 'math', name: 'Fast Math', icon: '🧮', color: 'from-rose-600 to-pink-600', desc: 'Résolvez les équations du Nexus.', difficulty: 'Medium', tier: 'ultimate', players: '2.1k', rating: '96%', image: 'https://picsum.photos/seed/math/800/600' },
    { id: 'battle', name: 'Aura Battle', icon: '⚔️', color: 'from-indigo-600 to-blue-600', desc: 'Combattez dans l\'arène Aura.', difficulty: 'Hard', tier: 'ultimate', players: '5.6k', rating: '98%', image: 'https://picsum.photos/seed/battle/800/600' },
    { id: 'tower', name: 'Aura Tower', icon: '🏰', color: 'from-violet-600 to-purple-600', desc: 'Construisez la plus haute tour.', difficulty: 'Hard', tier: 'ultimate', players: '1.1k', rating: '89%', image: 'https://picsum.photos/seed/tower/800/600' },
    { id: 'space', name: 'Space Void', icon: '🌌', color: 'from-slate-800 to-slate-600', desc: 'Explorez le vide spatial.', difficulty: 'Medium', tier: 'ultimate', players: '750', rating: '92%', image: 'https://picsum.photos/seed/space/800/600' },

    // ULTIMATE+ GAMES (5)
    { id: 'god', name: 'Nexus God', icon: '👑', color: 'from-amber-500 to-yellow-400', desc: 'Devenez le dieu du Nexus.', difficulty: 'Expert', tier: 'ultimate_plus', players: '150', rating: '99%', image: 'https://picsum.photos/seed/god/800/600' },
    { id: 'hack', name: 'Core Hacker', icon: '💻', color: 'from-lime-500 to-green-400', desc: 'Hackez le noyau central.', difficulty: 'Hard', tier: 'ultimate_plus', players: '300', rating: '97%', image: 'https://picsum.photos/seed/hack/800/600' },
    { id: 'time', name: 'Time Warp', icon: '⏳', color: 'from-cyan-500 to-blue-400', desc: 'Manipulez le temps.', difficulty: 'Expert', tier: 'ultimate_plus', players: '220', rating: '94%', image: 'https://picsum.photos/seed/time/800/600' },
    { id: 'void', name: 'Void Walker', icon: '🚶', color: 'from-black to-slate-800', desc: 'Marchez dans le néant.', difficulty: 'Hard', tier: 'ultimate_plus', players: '180', rating: '96%', image: 'https://picsum.photos/seed/void/800/600' },
    { id: 'infinity', name: 'Infinity Loop', icon: '♾️', color: 'from-fuchsia-500 to-pink-400', desc: 'Boucle infinie de données.', difficulty: 'Expert', tier: 'ultimate_plus', players: '400', rating: '98%', image: 'https://picsum.photos/seed/infinity/800/600' },
    
    // COMING SOON
    { id: 'racer', name: 'Vibe Racer', icon: '🏎️', color: 'from-slate-700 to-slate-500', desc: 'Course de vitesse.', difficulty: 'Medium', tier: 'free', players: '0', rating: 'N/A', comingSoon: true, image: 'https://picsum.photos/seed/racer/800/600' },
    { id: 'rpg', name: 'Nexus RPG', icon: '🛡️', color: 'from-slate-700 to-slate-500', desc: 'Aventure épique.', difficulty: 'Hard', tier: 'ultimate', players: '0', rating: 'N/A', comingSoon: true, image: 'https://picsum.photos/seed/rpg/800/600' },
  ];

  const categories = [
    { id: 'free', label: 'Jeux Gratuits' },
    { id: 'ultimate', label: 'Ultimate Access' },
    { id: 'ultimate_plus', label: 'Ultimate+ Elite' },
  ];

  const handleGameSelect = (game: any) => {
    if (game.comingSoon) {
      alert("Ce jeu arrive bientôt dans le Nexus ! Restez à l'écoute.");
      return;
    }
    if (game.tier === 'ultimate' && !user.isUltimate) {
      setShowUltimateModal(true);
      return;
    }
    if (game.tier === 'ultimate_plus' && !user.isUltimatePlus) {
      alert("Ultimate+ requis pour ce jeu.");
      return;
    }
    setActiveGame(game.id);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F5] dark:bg-[#111216] animate-in fade-in duration-700 pb-32">
      {/* Roblox-style Top Bar */}
      <div className="sticky top-0 z-[100] bg-white dark:bg-[#1B1D22] border-b border-black/5 dark:border-white/5 px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">Découvrir</h2>
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
               {categories.map(cat => (
                 <button key={cat.id} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors whitespace-nowrap">{cat.label}</button>
               ))}
            </div>
         </div>
         <div className="relative w-full md:w-96 mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Rechercher un jeu dans le Nexus..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#25272D] border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 shadow-inner"
            />
         </div>
      </div>

      {/* Hero Banner - Roblox Style */}
      <div className="px-6 py-8">
         <div className="max-w-7xl mx-auto">
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl group cursor-pointer">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/games/1200/400')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               
               <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md">Nouveau</span>
                        <span className="text-white/80 text-xs font-bold">Jeu de la semaine</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-white mb-2">Nexus Runner 2.0</h2>
                     <p className="text-white/70 font-medium max-w-md hidden md:block">La suite très attendue avec de nouveaux niveaux, des graphismes améliorés et un mode multijoueur.</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 shrink-0">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                     Jouer
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Game Sections */}
        {categories.map(category => {
          const categoryGames = games.filter(g => 
            g.tier === category.id && 
            (g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.desc.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          if (categoryGames.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">{category.label}</h3>
                 <button className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors">Voir tout</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {categoryGames.map(game => (
                  <div 
                    key={game.id}
                    onClick={() => handleGameSelect(game)}
                    className="group cursor-pointer flex flex-col gap-3"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#25272D] shadow-sm group-hover:shadow-xl transition-all duration-300">
                       <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                       <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                         {game.icon}
                       </div>
                       
                       {/* Badges */}
                       <div className="absolute top-2 left-2 flex flex-col gap-1">
                         {game.tier === 'ultimate' && (
                           <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-[8px] font-black text-white uppercase tracking-widest shadow-sm">Pro</span>
                         )}
                         {game.tier === 'ultimate_plus' && (
                           <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-[8px] font-black text-white uppercase tracking-widest shadow-sm">Elite</span>
                         )}
                         {game.comingSoon && (
                           <span className="px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded text-[8px] font-black text-white uppercase tracking-widest shadow-sm">Bientôt</span>
                         )}
                       </div>
                       
                       {/* Rating */}
                       <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1">
                          <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="text-[9px] font-bold text-white">{game.rating}</span>
                       </div>
                    </div>
                    
                    <div>
                       <h4 className="font-bold text-black dark:text-white text-sm truncate group-hover:underline">{game.name}</h4>
                       <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{game.players} joueurs</span>
                          <span className={`text-[10px] font-bold ${
                            game.difficulty === 'Easy' ? 'text-emerald-500' : 
                            game.difficulty === 'Medium' ? 'text-amber-500' : 
                            game.difficulty === 'Hard' ? 'text-rose-500' : 'text-purple-500'
                          }`}>{game.difficulty}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ultimate Modal */}
      {showUltimateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1B1D22] border border-black/10 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-orange-500/20">
              👑
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white mb-2">Ultimate Requis</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Ce jeu est réservé aux membres Ultimate. Mettez à niveau votre compte pour y accéder.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowUltimateModal(false); window.dispatchEvent(new CustomEvent('vibeNavigate', { detail: 'store' })); }}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
              >
                Découvrir Ultimate
              </button>
              <button 
                onClick={() => setShowUltimateModal(false)}
                className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Engine Overlay */}
      {activeGame && (
        <GameEngine gameId={activeGame} onExit={() => setActiveGame(null)} userId={user.id} />
      )}
    </div>
  );
};

// --- GAME ENGINE & CLICKER GAME (Simplified for UI focus) ---

const GameEngine: React.FC<{ gameId: string, onExit: () => void, userId: string }> = ({ gameId, onExit, userId }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameOver(true);
    const creditsEarned = Math.floor(finalScore / 10);
    const xpEarned = Math.floor(finalScore / 5);
    storage.addReward(userId, creditsEarned, xpEarned);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in">
      <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <button onClick={onExit} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
          <span className="text-white font-black tracking-widest uppercase text-sm">Score: {score}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {gameId === 'clicker' ? (
          <ClickerGame onGameOver={handleGameOver} />
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl animate-bounce">🎮</div>
            <h2 className="text-3xl font-black text-white">Jeu en développement</h2>
            <p className="text-white/50 max-w-sm mx-auto">L'interface du jeu {gameId} est en cours de création.</p>
            <button onClick={() => handleGameOver(Math.floor(Math.random() * 500))} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-colors">
              Simuler Fin de Partie
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl">
              <h2 className="text-4xl font-black text-white mb-2">PARTIE TERMINÉE</h2>
              <p className="text-white/50 font-medium mb-8 uppercase tracking-widest">Score Final</p>
              
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500 mb-10">
                {score}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="text-yellow-400 font-black text-xl mb-1">+{Math.floor(score / 10)}</div>
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Crédits</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="text-blue-400 font-black text-xl mb-1">+{Math.floor(score / 5)}</div>
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">XP</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => { setGameOver(false); setScore(0); }} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                  Rejouer
                </button>
                <button onClick={onExit} className="w-full py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                  Quitter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClickerGame: React.FC<{ onGameOver: (score: number) => void }> = ({ onGameOver }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onGameOver(clicks * 10);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, clicks]);

  const handleClick = () => {
    if (!isActive && timeLeft === 10) setIsActive(true);
    if (isActive) setClicks(clicks + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-md px-6">
      <div className="flex justify-between w-full">
        <div className="text-center">
          <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">Temps</div>
          <div className="text-4xl font-black text-white">{timeLeft}s</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">Clics</div>
          <div className="text-4xl font-black text-blue-400">{clicks}</div>
        </div>
      </div>
      
      <button 
        onClick={handleClick}
        className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_100px_rgba(37,99,235,0.4)] flex items-center justify-center active:scale-95 transition-transform border-4 border-white/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></div>
        <span className="text-6xl select-none">⚡</span>
      </button>
      
      {!isActive && timeLeft === 10 && (
        <p className="text-white/50 font-bold uppercase tracking-widest animate-pulse">Cliquez pour commencer</p>
      )}
    </div>
  );
};

export default Games;
