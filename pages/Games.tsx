import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trophy, Play, Star, ChevronRight, Lock, Zap, MousePointer2, Target, Calculator, Palette, Timer, Brain, Disc, Gamepad2, Rocket, Bird } from 'lucide-react';

const Games: React.FC<{ user: User }> = ({ user }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showUltimateModal, setShowUltimateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('free');

  const games = storage.getGames();

  const categories = [
    { id: 'free', label: 'GRATUIT', icon: <Zap className="w-4 h-4" /> },
    { id: 'ultimate', label: 'PRO', icon: <Lock className="w-4 h-4" /> },
    { id: 'ultimate_plus', label: 'ELITE', icon: <Lock className="w-4 h-4" /> },
  ];

  const handleGameSelect = (gameId: string, tier: string) => {
    if (tier === 'ultimate' && !user.isUltimate) { setShowUltimateModal(true); return; }
    if (tier === 'ultimate_plus' && !user.isUltimatePlus) { alert("Accès Elite requis"); return; }
    setActiveGame(gameId);
  };

  const filteredGames = games.filter(g => 
    g.tier === activeCategory && 
    (g.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black animate-in fade-in duration-700 pb-32">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-[100] bg-black/60 backdrop-blur-3xl border-b border-white/5 p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
              <h2 className="vibe-logo text-2xl md:text-3xl font-black text-white tracking-[0.3em] uppercase">VIBE PLAY</h2>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Servers Live</span>
              </div>
          </div>

          <div className="relative group max-w-2xl mx-auto w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Chercher une expérience..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16181c] border border-transparent rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest border ${activeCategory === cat.id ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-white/5 text-slate-500 border-white/5'}`}
                >
                    {cat.icon}
                    {cat.label}
                </button>
              ))}
          </div>
      </div>

      {/* Playable Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 p-4 md:p-8">
          {filteredGames.map(game => (
            <motion.div 
              key={game.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameSelect(game.id, game.tier)}
              className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                
                <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-6xl drop-shadow-glow">
                    {game.icon}
                </div>

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                   {game.tier !== 'free' && (
                     <div className="p-1 px-2 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 border border-white/10">
                        <Lock className="w-2.5 h-2.5 text-blue-400" />
                        {game.tier === 'ultimate' ? 'PRO' : 'ELITE'}
                     </div>
                   )}
                   <div className="p-1 px-2 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black text-white flex items-center gap-1">
                       <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                       {game.rating}
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                   <h4 className="text-white font-black text-[12px] md:text-sm uppercase tracking-tighter truncate">{game.name}</h4>
                   <div className="flex items-center justify-between mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{game.players} JOUEURS</span>
                      <ChevronRight className="w-3 h-3 text-white" />
                   </div>
                </div>
            </motion.div>
          ))}
      </div>

      <AnimatePresence>
        {activeGame && (
          <GameModal gameId={activeGame} user={user} onClose={() => setActiveGame(null)} />
        )}
        {showUltimateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
             <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-[3rem] p-10 text-center shadow-6xl relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl rotate-12">👑</div>
                <h3 className="text-3xl font-black text-white vibe-logo mb-4 mt-4">ACCÈS BLOQUÉ</h3>
                <p className="text-slate-500 font-bold mb-8">Ce fragment de réalité nécessite une synchronisation Ultimate.</p>
                <div className="space-y-3">
                    <button 
                      onClick={() => { setShowUltimateModal(false); window.dispatchEvent(new CustomEvent('vibeNavigate', { detail: 'store' })); }}
                      className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                    >
                        Devenir Ultime
                    </button>
                    <button onClick={() => setShowUltimateModal(false)} className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors">Plus tard</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GameModal: React.FC<{ gameId: string, user: User, onClose: () => void }> = ({ gameId, user, onClose }) => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'over'>('lobby');
  const gameInfo = storage.getGames().find(g => g.id === gameId);

  const startPlaying = () => {
    setGameState('playing');
    setScore(0);
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState('over');
    const credits = Math.floor(finalScore / 10);
    const xp = Math.floor(finalScore / 5);
    storage.addReward(user.id, credits, xp, `game-${gameId}-${Date.now()}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col pt-safe"
    >
      <div className="flex items-center justify-between p-6 bg-black/40 backdrop-blur-md border-b border-white/5">
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10">
              <XIcon />
          </button>
          <div className="flex flex-col items-center">
              <h3 className="vibe-logo text-lg font-black text-white tracking-widest">{gameInfo?.name}</h3>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Transmission en cours...</span>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
              {score}
          </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
          {gameState === 'lobby' && (
              <div className="text-center space-y-12 animate-in zoom-in-95 duration-500">
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[3rem] flex items-center justify-center text-8xl shadow-6xl border border-white/5 ring-4 ring-white/5">
                      {gameInfo?.icon}
                  </div>
                  <div className="space-y-3 px-10">
                      <h2 className="text-4xl font-black text-white vibe-logo tracking-tighter">{gameInfo?.name}</h2>
                      <p className="text-slate-500 font-bold max-w-sm mx-auto">{gameInfo?.desc}</p>
                  </div>
                  <button 
                    onClick={startPlaying}
                    className="px-12 py-5 bg-white text-black rounded-3xl font-black uppercase text-sm tracking-[0.3em] shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
                  >
                      Initier la Sync
                  </button>
              </div>
          )}

          {gameState === 'playing' && (
              <GameRouter gameId={gameId} onScore={setScore} onGameOver={handleGameOver} />
          )}

          {gameState === 'over' && (
              <div className="text-center space-y-8 animate-in zoom-in-95">
                  <div className="text-slate-500 font-black uppercase tracking-[0.4em]">Signal Interrompu</div>
                  <div className="text-9xl font-black text-white vibe-logo tracking-widest drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">{score}</div>
                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-blue-400 font-black text-xl mb-1">+{Math.floor(score/10)}</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase">NOVAS</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-purple-400 font-black text-xl mb-1">+{Math.floor(score/5)}</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase">XP</div>
                      </div>
                  </div>
                  <div className="space-y-3 px-10">
                    <button 
                        onClick={startPlaying}
                        className="w-full py-5 bg-white text-black rounded-3xl font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:scale-105 transition-all"
                    >
                        Rejouer
                    </button>
                    <button onClick={onClose} className="w-full py-5 bg-white/5 text-slate-400 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Quitter le Nexus</button>
                  </div>
              </div>
          )}
      </div>
    </motion.div>
  );
};

// --- MINI GAMES ROUTER ---
const GameRouter: React.FC<{ gameId: string, onScore: (s: number) => void, onGameOver: (s: number) => void }> = ({ gameId, onScore, onGameOver }) => {
  switch (gameId) {
    case 'clicker': return <ClickerGame onScore={onScore} onGameOver={onGameOver} />;
    case 'aim': return <AimTrainerGame onScore={onScore} onGameOver={onGameOver} />;
    case 'math': return <MathGame onScore={onScore} onGameOver={onGameOver} />;
    case 'color': return <ColorGame onScore={onScore} onGameOver={onGameOver} />;
    case 'tap': return <TapGame onScore={onScore} onGameOver={onGameOver} />;
    case 'memory': return <MemoryGame onScore={onScore} onGameOver={onGameOver} />;
    case 'bricks': return <BricksGame onScore={onScore} onGameOver={onGameOver} />;
    case 'flappy': return <BirdGame onScore={onScore} onGameOver={onGameOver} />;
    case 'jump': return <JumpGame onScore={onScore} onGameOver={onGameOver} />;
    case 'snake': return <SnakeGame onScore={onScore} onGameOver={onGameOver} />;
    default: 
        return (
            <div className="text-center p-10 space-y-6">
                <div className="text-6xl animate-bounce">🚧</div>
                <h3 className="text-white font-black text-2xl vibe-logo">Zone en Construction</h3>
                <p className="text-slate-500">Cette dimension du Nexus est en cours de stabilisation.</p>
                <button onClick={() => onGameOver(Math.floor(Math.random() * 200))} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl">Simuler Fin</button>
            </div>
        );
  }
};

// Simplified Mini Game Implementations for Demo
const ClickerGame: React.FC<any> = ({ onScore, onGameOver }) => {
    const [count, setCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    useEffect(() => {
        const t = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(t);
    }, []);
    useEffect(() => { if(timeLeft === 0) onGameOver(count * 10); }, [timeLeft]);
    return (
        <div className="flex flex-col items-center gap-10">
            <div className="text-7xl font-black text-white">{timeLeft}s</div>
            <button onClick={() => { setCount(c => c+1); onScore((count+1)*10); }} className="w-64 h-64 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-7xl shadow-6xl border-8 border-white/10 active:scale-90 transition-transform">⚡</button>
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Cliquez le plus vite !</p>
        </div>
    );
};

const AimTrainerGame: React.FC<any> = ({ onScore, onGameOver }) => {
    const [target, setTarget] = useState({ x: 50, y: 50 });
    const [hit, setHit] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    useEffect(() => {
        const t = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(t);
    }, []);
    useEffect(() => { if(timeLeft === 0) onGameOver(hit * 100); }, [timeLeft]);
    const moveTarget = () => {
        setTarget({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        setHit(h => h + 1);
        onScore((hit + 1) * 100);
    };
    return (
        <div className="w-full h-full relative cursor-crosshair">
            <div className="absolute top-10 left-1/2 -track-x-1/2 text-white font-black text-4xl">{timeLeft}s</div>
            <button onClick={moveTarget} style={{ left: `${target.x}%`, top: `${target.y}%` }} className="absolute w-16 h-16 bg-red-500 rounded-full border-4 border-white shadow-2xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">🎯</button>
        </div>
    );
};

const MathGame: React.FC<any> = ({ onScore, onGameOver }) => {
    const [nums, setNums] = useState({ a: 8, b: 7 });
    const [ans, setAns] = useState('');
    const [correct, setCorrect] = useState(0);
    useEffect(() => {
        if (parseInt(ans) === nums.a + nums.b) {
            setCorrect(c => c + 1);
            onScore((correct + 1) * 50);
            setNums({ a: Math.floor(Math.random() * 30), b: Math.floor(Math.random() * 30) });
            setAns('');
        }
    }, [ans]);
    return (
        <div className="text-center space-y-10 px-10">
            <h2 className="text-8xl font-black text-white vibe-logo">{nums.a} + {nums.b}</h2>
            <input autoFocus type="number" value={ans} onChange={e => setAns(e.target.value)} className="w-full bg-white/10 border-none rounded-3xl p-8 text-center text-6xl text-white outline-none ring-4 ring-white/5" placeholder="?" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">Résolvez pour avancer</p>
        </div>
    );
};

const ColorGame: React.FC<any> = ({ onScore, onGameOver }) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
    const [target, setTarget] = useState(0);
    const [score, setScore] = useState(0);
    return (
        <div className="text-center space-y-12">
            <div className={`w-40 h-40 mx-auto rounded-[3rem] ${colors[target]} shadow-6xl border-8 border-white/20`} />
            <div className="grid grid-cols-2 gap-4 p-4">
                {colors.map((c, i) => (
                    <button key={i} onClick={() => {
                        if(i === target) { setScore(s => s+1); onScore((score+1)*80); setTarget(Math.floor(Math.random()*4)); }
                        else onGameOver(score*80);
                    }} className={`w-32 h-32 rounded-3xl ${c} hover:scale-105 transition-transform`} />
                ))}
            </div>
        </div>
    );
};

const MemoryGame: React.FC<any> = ({ onScore, onGameOver }) => (
    <div className="text-center space-y-8">
        <Brain className="w-32 h-32 text-blue-400 mx-auto animate-pulse" />
        <h3 className="text-white font-black text-3xl vibe-logo">MEMOIRE SYNC</h3>
        <button onClick={() => onGameOver(Math.floor(Math.random()*300))} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest">Lancer le Test</button>
    </div>
);

const BricksGame: React.FC<any> = ({ onScore, onGameOver }) => (
    <div className="text-center space-y-8">
        <Disc className="w-32 h-32 text-orange-400 mx-auto animate-spin-slow" />
        <h3 className="text-white font-black text-3xl vibe-logo">CYBER DISQUES</h3>
        <button onClick={() => onGameOver(Math.floor(Math.random()*400))} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest">Démarrer</button>
    </div>
);

const BirdGame: React.FC<any> = ({ onScore, onGameOver }) => (
    <div className="text-center space-y-8">
        <Bird className="w-32 h-32 text-yellow-400 mx-auto animate-bounce" />
        <h3 className="text-white font-black text-3xl vibe-logo">VIBE WINGS</h3>
        <button onClick={() => onGameOver(Math.floor(Math.random()*150))} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest">Voler !</button>
    </div>
);

const JumpGame: React.FC<any> = ({ onScore, onGameOver }) => (
    <div className="text-center space-y-8">
        <Rocket className="w-32 h-32 text-cyan-400 mx-auto animate-pulse" />
        <h3 className="text-white font-black text-3xl vibe-logo">NEON LAUNCH</h3>
        <button onClick={() => onGameOver(Math.floor(Math.random()*500))} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest">Décollage</button>
    </div>
);

const TapGame: React.FC<any> = ({ onScore, onGameOver }) => (
    <div className="text-center space-y-8">
        <MousePointer2 className="w-32 h-32 text-purple-400 mx-auto" />
        <h3 className="text-white font-black text-3xl vibe-logo">SYNC RHYTHM</h3>
        <button onClick={() => onGameOver(Math.floor(Math.random()*250))} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest">Connecter</button>
    </div>
);

const SnakeGame: React.FC<any> = ({ onScore, onGameOver }) => (
    <div className="text-center space-y-8">
        <div className="text-9xl">🐍</div>
        <h3 className="text-white font-black text-3xl vibe-logo">NEURAL SNAKE</h3>
        <button onClick={() => onGameOver(Math.floor(Math.random()*350))} className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest">Initier</button>
    </div>
);

const XIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
);

export default Games;
