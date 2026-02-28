
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Games: React.FC<{ user: User }> = ({ user }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showUltimateModal, setShowUltimateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const games = [
    { id: 'clicker', name: 'Synth Clicker', icon: '⚡', color: 'bg-blue-600', accent: 'text-blue-400', desc: 'Générez des crédits via impulsions neuronales.', difficulty: 'Easy', premium: false, players: '1.2k', rating: '94%' },
    { id: 'snake', name: 'Neural Snake', icon: '🐍', color: 'bg-emerald-600', accent: 'text-emerald-400', desc: 'Collectez des fragments de données sans collision.', difficulty: 'Medium', premium: true, players: '850', rating: '88%' },
    { id: 'matrix', name: 'Memory Matrix', icon: '💠', color: 'bg-purple-600', accent: 'text-purple-400', desc: 'Répétez la séquence de synchronisation Aura.', difficulty: 'Hard', premium: true, players: '420', rating: '91%' },
    { id: 'math', name: 'Fast Math', icon: '🧮', color: 'bg-rose-600', accent: 'text-rose-400', desc: 'Résolvez les équations du Nexus en temps record.', difficulty: 'Medium', premium: true, players: '2.1k', rating: '96%' },
    { id: 'runner', name: 'Nexus Runner', icon: '🏃', color: 'bg-orange-600', accent: 'text-orange-400', desc: 'Évitez les obstacles dans le tunnel du Nexus.', difficulty: 'Medium', premium: false, players: '3.4k', rating: '92%', comingSoon: true },
    { id: 'battle', name: 'Aura Battle', icon: '⚔️', color: 'bg-indigo-600', accent: 'text-indigo-400', desc: 'Combattez d\'autres utilisateurs dans l\'arène Aura.', difficulty: 'Hard', premium: true, players: '5.6k', rating: '98%', comingSoon: true },
    { id: 'jump', name: 'Neon Jump', icon: '🚀', color: 'bg-cyan-600', accent: 'text-cyan-400', desc: 'Sautez de plateforme en plateforme.', difficulty: 'Easy', premium: false, players: '1.5k', rating: '90%', comingSoon: true },
    { id: 'dodge', name: 'Data Dodge', icon: '🛡️', color: 'bg-yellow-600', accent: 'text-yellow-400', desc: 'Esquivez les pare-feux du Nexus.', difficulty: 'Medium', premium: false, players: '2.3k', rating: '93%', comingSoon: true },
    { id: 'quiz', name: 'Vibe Quiz', icon: '❓', color: 'bg-pink-600', accent: 'text-pink-400', desc: 'Testez vos connaissances sur le Nexus.', difficulty: 'Easy', premium: false, players: '900', rating: '85%', comingSoon: true },
    { id: 'tower', name: 'Aura Tower', icon: '🏰', color: 'bg-violet-600', accent: 'text-violet-400', desc: 'Construisez la plus haute tour de données.', difficulty: 'Hard', premium: true, players: '1.1k', rating: '89%', comingSoon: true },
  ];

  const categories = [
    { id: 'recommended', label: 'Recommended for You' },
    { id: 'popular', label: 'Popular' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'new', label: 'New' },
  ];

  const handleGameSelect = (game: any) => {
    if (game.comingSoon) return;
    if (game.premium && !user.isUltimate) {
      setShowUltimateModal(true);
      return;
    }
    setActiveGame(game.id);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F5] dark:bg-[#111216] animate-in fade-in duration-700 pb-32">
      {/* Roblox-style Top Bar */}
      <div className="sticky top-0 z-[100] bg-white dark:bg-[#1B1D22] border-b border-black/5 dark:border-white/5 px-6 py-3 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-black dark:text-white tracking-tight">Discover</h2>
            <div className="hidden md:flex items-center gap-4">
               {categories.map(cat => (
                 <button key={cat.id} className="text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white transition-colors">{cat.label}</button>
               ))}
            </div>
         </div>
         <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search Games" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#25272D] border-none rounded-lg px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
            />
         </div>
      </div>

      {/* Hero Banner - Roblox Style */}
      <div className="px-6 py-8">
         <div className="max-w-7xl mx-auto">
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl group cursor-pointer">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/games/1200/400')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-8 left-8 space-y-2">
                  <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black rounded-md uppercase tracking-widest">Featured</span>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">SYNTH CLICKER 2.0</h1>
                  <p className="text-white/80 text-sm font-bold max-w-md">The biggest update yet! New neurons, faster sync, and bigger rewards.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Games Grid - Roblox Style */}
      <div className="px-6 py-4 max-w-7xl mx-auto space-y-12">
         {categories.map(cat => (
           <div key={cat.id} className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-black dark:text-white">{cat.label}</h3>
                 <button className="text-xs font-bold text-blue-500 hover:underline">See All</button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                 {games.filter(g => searchQuery ? g.name.toLowerCase().includes(searchQuery.toLowerCase()) : true).map(game => (
                   <div 
                    key={game.id} 
                    onClick={() => handleGameSelect(game)}
                    className="group cursor-pointer space-y-2"
                   >
                      <div className={`aspect-square rounded-xl ${game.color} flex items-center justify-center text-4xl shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                         {game.icon}
                         {game.premium && (
                           <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center shadow-lg">
                              <span className="text-[8px]">💎</span>
                           </div>
                         )}
                         {game.comingSoon && (
                           <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="text-[8px] font-black text-white uppercase tracking-widest rotate-[-12deg] border border-white/20 px-1.5 py-0.5">Soon</span>
                           </div>
                         )}
                      </div>
                      <div className="space-y-0.5">
                         <h4 className="font-black text-[11px] text-black dark:text-white truncate group-hover:text-blue-500 transition-colors">{game.name}</h4>
                         <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-500">
                            <div className="flex items-center gap-1">
                               <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                               {game.players}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                               <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                               {game.rating}
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      {showUltimateModal && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-slate-900 rounded-[4rem] p-16 border border-white/10 text-center space-y-12 shadow-4xl">
              <div className="w-28 h-28 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center text-6xl mx-auto shadow-2xl">💎</div>
              <div className="space-y-4">
                 <h3 className="vibe-logo text-4xl font-black text-white uppercase tracking-tighter">ULTIMATE ACCESS</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">This protocol requires an active Ultimate synchronization to proceed.</p>
              </div>
              <button 
                onClick={() => setShowUltimateModal(false)}
                className="w-full py-6 bg-white text-black rounded-full font-black vibe-logo text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
              >
                ACKNOWLEDGE
              </button>
           </div>
        </div>
      )}

      {activeGame && (
        <GameEngine id={activeGame} user={user} onClose={() => setActiveGame(null)} />
      )}
    </div>
  );
};

const GameEngine: React.FC<{ id: string, user: User, onClose: () => void }> = ({ id, user, onClose }) => {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  // Logic for different games
  const renderGame = () => {
    switch (id) {
      case 'snake': return <SnakeGame onScore={(s) => setScore(s)} onEnd={() => setGameState('end')} isPlaying={gameState === 'playing'} />;
      case 'matrix': return <MemoryGame onScore={(s) => setScore(s)} onEnd={() => setGameState('end')} isPlaying={gameState === 'playing'} />;
      case 'math': return <MathGame onScore={(s) => setScore(s)} onEnd={() => setGameState('end')} isPlaying={gameState === 'playing'} />;
      default: return <ClickerGame onScore={(s) => setScore(s)} isPlaying={gameState === 'playing'} />;
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
        const interval = setInterval(() => {
            // Passive XP for playing
            storage.addReward(user.id, 0, 5);
            setEarnedXp(prev => prev + 5);
        }, 10000);
        return () => clearInterval(interval);
    }
  }, [gameState, user.id]);

  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      storage.addReward(user.id, 5, 20);
      setEarnedCredits(prev => prev + 5);
      setEarnedXp(prev => prev + 20);
    }
  }, [score, user.id]);

  return (
    <div className="fixed inset-0 z-[1200] bg-[#020617] flex items-center justify-center animate-in fade-in duration-500 p-2 md:p-6">
      <div className="w-full h-full max-w-5xl mx-auto flex flex-col p-4 md:p-8 gap-6 bg-slate-950 rounded-[2rem] border border-white/5 shadow-4xl">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-2xl">
                {id === 'snake' ? '🐍' : id === 'matrix' ? '💠' : id === 'math' ? '🧮' : '⚡'}
              </div>
              <div>
                <h3 className="vibe-logo text-xl md:text-3xl font-black text-white tracking-tighter">{id.toUpperCase()} PROTOCOL</h3>
                <div className="flex items-center gap-3 mt-0.5">
                   <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Active Link: @{user.username}</span>
                   <div className="w-0.5 h-0.5 bg-white/20 rounded-full"></div>
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latency: 14ms</span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-500 transition-all group">
             <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Game Canvas / Area */}
        <div className="flex-1 relative bg-slate-900/50 rounded-[2rem] border border-white/5 shadow-inner overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.05),transparent_70%)] pointer-events-none"></div>
            
            {gameState === 'start' && (
                <div className="text-center space-y-8 animate-in zoom-in duration-500 relative z-10">
                    <div className="space-y-3">
                       <p className="vibe-logo text-[10px] text-slate-500 tracking-[0.5em] uppercase">Establishing Neural Link</p>
                       <div className="w-32 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-1/3 animate-[loading_2s_infinite]"></div>
                       </div>
                    </div>
                    <button 
                        onClick={() => setGameState('playing')}
                        className="px-12 py-5 bg-white text-black rounded-2xl font-black vibe-logo text-xl shadow-4xl hover:scale-105 active:scale-95 transition-all"
                    >
                        INITIALIZE
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                {renderGame()}
              </div>
            )}

            {gameState === 'end' && (
                <div className="text-center space-y-8 animate-in fade-in duration-500 relative z-10">
                    <h4 className="vibe-logo text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">LINK SEVERED</h4>
                    <div className="space-y-2">
                       <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[8px]">Final Synchronization Score</p>
                       <p className="text-8xl font-black text-white leading-none tracking-tighter">{score}</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => { setScore(0); setGameState('playing'); }} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black vibe-logo text-[10px] uppercase tracking-widest transition-all hover:bg-blue-500 shadow-2xl">Retry Link</button>
                        <button onClick={onClose} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black vibe-logo text-[10px] uppercase tracking-widest transition-all hover:bg-white/10">Terminate</button>
                    </div>
                </div>
            )}
        </div>

        {/* Real-time Stats Footer */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1">
                <span className="vibe-logo text-[8px] text-slate-500 uppercase tracking-widest">Score</span>
                <span className="text-2xl font-black text-white tracking-tighter">{score}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1">
                <span className="vibe-logo text-[8px] text-slate-500 uppercase tracking-widest">XP Sync</span>
                <span className="text-2xl font-black text-indigo-400 tracking-tighter">+{earnedXp}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1">
                <span className="vibe-logo text-[8px] text-slate-500 uppercase tracking-widest">Credits</span>
                <span className="text-2xl font-black text-blue-500 tracking-tighter">+{earnedCredits}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

/* --- MINI GAMES IMPLEMENTATIONS --- */

const SnakeGame: React.FC<{ onScore: (s: number) => void, onEnd: () => void, isPlaying: boolean }> = ({ onScore, onEnd, isPlaying }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [dir, setDir] = useState({ x: 0, y: -1 });
    const [localScore, setLocalScore] = useState(0);

    useEffect(() => {
        if (!isPlaying) return;
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
            if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
            if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
            if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
        };
        window.addEventListener('keydown', handleKeys);
        const interval = setInterval(moveSnake, 120);
        return () => { window.removeEventListener('keydown', handleKeys); clearInterval(interval); };
    }, [isPlaying, snake, dir]);

    const moveSnake = () => {
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 12 || snake.find(s => s.x === head.x && s.y === head.y)) {
            onEnd(); return;
        }
        const newSnake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
            setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 12) });
            setLocalScore(s => { const ns = s + 1; onScore(ns); return ns; });
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
             <div className="grid grid-cols-20 grid-rows-12 gap-1 bg-black/40 p-2 rounded-2xl border border-white/5 w-full max-w-[800px] aspect-video">
                {Array.from({ length: 12 * 20 }).map((_, i) => {
                    const x = i % 20; const y = Math.floor(i / 20);
                    const isSnake = snake.some(s => s.x === x && s.y === y);
                    const isFood = food.x === x && food.y === y;
                    return (
                        <div key={i} className={`rounded-sm transition-all duration-300 ${isSnake ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : isFood ? 'bg-rose-500 animate-pulse' : 'bg-white/2'}`}></div>
                    );
                })}
             </div>
             <div className="absolute bottom-4 text-slate-600 vibe-logo text-[8px] font-black uppercase tracking-[0.3em]">Utilisez les flèches du clavier pour naviguer</div>
        </div>
    );
};

const MemoryGame: React.FC<{ onScore: (s: number) => void, onEnd: () => void, isPlaying: boolean }> = ({ onScore, onEnd, isPlaying }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [userInput, setUserInput] = useState<number[]>([]);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isPlaying && sequence.length === 0) startRound();
    }, [isPlaying]);

    const startRound = () => {
        const next = Math.floor(Math.random() * 4);
        const newSeq = [...sequence, next];
        setSequence(newSeq);
        showSequence(newSeq);
    };

    const showSequence = async (seq: number[]) => {
        setIsShowing(true);
        for (const val of seq) {
            setActiveButton(val);
            await new Promise(r => setTimeout(r, 600));
            setActiveButton(null);
            await new Promise(r => setTimeout(r, 200));
        }
        setIsShowing(false);
        setUserInput([]);
    };

    const handlePress = (id: number) => {
        if (isShowing) return;
        setActiveButton(id);
        setTimeout(() => setActiveButton(null), 200);
        
        const newInput = [...userInput, id];
        setUserInput(newInput);

        if (id !== sequence[userInput.length]) {
            onEnd();
        } else if (newInput.length === sequence.length) {
            onScore(sequence.length);
            setTimeout(startRound, 800);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-8 p-10 max-w-sm mx-auto">
            {[0, 1, 2, 3].map(i => (
                <button 
                    key={i} 
                    onClick={() => handlePress(i)}
                    className={`w-32 h-32 rounded-[2.5rem] border-4 transition-all duration-300 ${
                        activeButton === i 
                        ? 'bg-white border-white scale-110 shadow-[0_0_50px_rgba(255,255,255,0.8)]' 
                        : 'liquid-glass border-white/10 hover:border-white/20'
                    } ${i === 0 ? 'border-t-blue-500' : i === 1 ? 'border-t-emerald-500' : i === 2 ? 'border-t-purple-500' : 'border-t-rose-500'}`}
                />
            ))}
        </div>
    );
};

const MathGame: React.FC<{ onScore: (s: number) => void, onEnd: () => void, isPlaying: boolean }> = ({ onScore, onEnd, isPlaying }) => {
    const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', ans: 0 });
    const [options, setOptions] = useState<number[]>([]);
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        if (isPlaying) nextProblem();
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying && timer > 0) {
            const t = setInterval(() => setTimer(s => s - 1), 1000);
            return () => clearInterval(t);
        } else if (timer === 0) onEnd();
    }, [timer, isPlaying]);

    const nextProblem = () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let ans = 0;
        if (op === '+') ans = a + b; else if (op === '-') ans = a - b; else ans = a * b;
        
        const opts = [ans, ans + 2, ans - 3, ans + 5].sort(() => Math.random() - 0.5);
        setProblem({ a, b, op, ans });
        setOptions(opts);
        setTimer(5);
    };

    const handleAnswer = (val: number) => {
        if (val === problem.ans) {
            onScore(s => s + 1); nextProblem();
        } else onEnd();
    };

    return (
        <div className="text-center space-y-12 w-full max-w-md mx-auto p-10">
            <div className="relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 vibe-logo text-[8px] text-rose-500 font-black tracking-[0.4em] animate-pulse">Temps Restant: {timer}s</div>
                <div className="text-7xl font-black text-white tracking-tighter">{problem.a} {problem.op === '*' ? '×' : problem.op} {problem.b}</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {options.map((o, i) => (
                    <button key={i} onClick={() => handleAnswer(o)} className="py-6 liquid-glass rounded-3xl border border-white/10 font-black text-2xl text-white hover:bg-white hover:text-black transition-all active:scale-95">{o}</button>
                ))}
            </div>
        </div>
    );
};

const ClickerGame: React.FC<{ onScore: (s: number) => void, isPlaying: boolean }> = ({ onScore, isPlaying }) => {
    const [count, setCount] = useState(0);
    const [effects, setEffects] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleClick = (e: React.MouseEvent) => {
        if (!isPlaying) return;
        const newScore = count + 1;
        setCount(newScore);
        onScore(newScore);
        
        const eff = { id: Date.now(), x: e.clientX, y: e.clientY };
        setEffects(prev => [...prev, eff]);
        setTimeout(() => setEffects(prev => prev.filter(ef => ef.id !== eff.id)), 800);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-10 cursor-pointer select-none" onClick={handleClick}>
            <div className="relative">
                <div className="w-56 h-56 rounded-full liquid-glass-blue border-4 border-blue-500/30 flex items-center justify-center text-7xl shadow-4xl animate-pulse">⚡</div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 vibe-logo text-[10px] text-blue-400 font-black tracking-[0.5em] animate-bounce">SYNC NOW</div>
            </div>
            
            {effects.map(eff => (
                <div 
                    key={eff.id} 
                    className="fixed pointer-events-none text-blue-400 font-black vibe-logo text-xl animate-out fade-out slide-out-to-top-10 duration-700"
                    style={{ left: eff.x - 20, top: eff.y - 40 }}
                >
                    +1 IMPULSION
                </div>
            ))}
        </div>
    );
};

export default Games;
