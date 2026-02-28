
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types.ts';
import { storage } from '../services/storageService.ts';

const Games: React.FC<{ user: User }> = ({ user }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showUltimateModal, setShowUltimateModal] = useState(false);

  const games = [
    { id: 'clicker', name: 'Synth Clicker', icon: '⚡', color: 'bg-slate-900', accent: 'text-blue-400', desc: 'Générez des crédits via impulsions neuronales.', difficulty: 'Easy', premium: false },
    { id: 'snake', name: 'Neural Snake', icon: '🐍', color: 'bg-slate-900', accent: 'text-emerald-400', desc: 'Collectez des fragments de données sans collision.', difficulty: 'Medium', premium: true },
    { id: 'matrix', name: 'Memory Matrix', icon: '💠', color: 'bg-slate-900', accent: 'text-purple-400', desc: 'Répétez la séquence de synchronisation Aura.', difficulty: 'Hard', premium: true },
    { id: 'math', name: 'Fast Math', icon: '🧮', color: 'bg-slate-900', accent: 'text-rose-400', desc: 'Résolvez les équations du Nexus en temps record.', difficulty: 'Medium', premium: true },
  ];

  const handleGameSelect = (game: any) => {
    if (game.premium && !user.isUltimate) {
      setShowUltimateModal(true);
      return;
    }
    setActiveGame(game.id);
  };

  return (
    <div className="min-h-screen bg-[#020617] animate-in fade-in duration-700 pb-32">
      {/* Hero Header - Minimal & Modern */}
      <div className="relative px-6 py-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
           <h2 className="vibe-logo text-8xl font-black text-white tracking-tighter leading-none">VIBEGAMES</h2>
           <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Systems: Nominal</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Network Jackpot: 50,000 C</span>
           </div>
        </div>
      </div>

      {/* Games Selection Grid */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {games.map(game => (
          <button 
            key={game.id} 
            onClick={() => handleGameSelect(game)} 
            className={`relative overflow-hidden p-12 rounded-[3rem] ${game.color} border border-white/5 group transition-all hover:border-white/20 hover:translate-y-[-4px] active:scale-[0.98] shadow-2xl text-left min-h-[320px] flex flex-col justify-between`}
          >
            {/* Background Icon */}
            <div className="absolute top-[-10%] right-[-5%] opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700 pointer-events-none">
              <span className="text-[240px] leading-none">{game.icon}</span>
            </div>
            
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">{game.difficulty}</span>
                  {game.premium && (
                    <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest">ULTIMATE</span>
                  )}
               </div>
               <div className="space-y-2">
                  <h3 className="text-5xl font-black text-white vibe-logo tracking-tight group-hover:text-blue-400 transition-colors">{game.name}</h3>
                  <p className="text-slate-400 text-sm font-medium max-w-[85%] leading-relaxed">{game.desc}</p>
               </div>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-8">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">+12</div>
               </div>
               <div className="px-10 py-5 bg-white text-black rounded-2xl font-black vibe-logo text-[11px] uppercase tracking-[0.2em] shadow-xl group-hover:bg-blue-50 transition-all">
                  {game.premium && !user.isUltimate ? '🔒 Locked' : 'Connect'}
               </div>
            </div>
          </button>
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
    <div className="fixed inset-0 z-[1200] bg-[#020617] flex items-center justify-center animate-in fade-in duration-500">
      <div className="w-full h-full max-w-7xl mx-auto flex flex-col p-6 md:p-12 gap-10">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b border-white/5 pb-10">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
                {id === 'snake' ? '🐍' : id === 'matrix' ? '💠' : id === 'math' ? '🧮' : '⚡'}
              </div>
              <div>
                <h3 className="vibe-logo text-5xl font-black text-white tracking-tighter">{id.toUpperCase()} PROTOCOL</h3>
                <div className="flex items-center gap-4 mt-1">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Link: @{user.username}</span>
                   <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latency: 14ms</span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-500 transition-all group">
             <svg className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Game Canvas / Area */}
        <div className="flex-1 relative bg-slate-900/50 rounded-[4rem] border border-white/5 shadow-inner overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.05),transparent_70%)] pointer-events-none"></div>
            
            {gameState === 'start' && (
                <div className="text-center space-y-12 animate-in zoom-in duration-500 relative z-10">
                    <div className="space-y-4">
                       <p className="vibe-logo text-sm text-slate-500 tracking-[0.8em] uppercase">Establishing Neural Link</p>
                       <div className="w-48 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-1/3 animate-[loading_2s_infinite]"></div>
                       </div>
                    </div>
                    <button 
                        onClick={() => setGameState('playing')}
                        className="px-24 py-10 bg-white text-black rounded-[2.5rem] font-black vibe-logo text-3xl shadow-4xl hover:scale-105 active:scale-95 transition-all"
                    >
                        INITIALIZE
                    </button>
                </div>
            )}

            {gameState === 'playing' && renderGame()}

            {gameState === 'end' && (
                <div className="text-center space-y-12 animate-in fade-in duration-500 relative z-10">
                    <h4 className="vibe-logo text-8xl font-black text-white tracking-tighter leading-none">LINK SEVERED</h4>
                    <div className="space-y-4">
                       <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Final Synchronization Score</p>
                       <p className="text-[12rem] font-black text-white leading-none tracking-tighter">{score}</p>
                    </div>
                    <div className="flex gap-6 justify-center">
                        <button onClick={() => { setScore(0); setGameState('playing'); }} className="px-16 py-7 bg-blue-600 text-white rounded-3xl font-black vibe-logo text-sm uppercase tracking-widest transition-all hover:bg-blue-500 shadow-2xl">Retry Link</button>
                        <button onClick={onClose} className="px-16 py-7 bg-white/5 border border-white/10 text-white rounded-3xl font-black vibe-logo text-sm uppercase tracking-widest transition-all hover:bg-white/10">Terminate</button>
                    </div>
                </div>
            )}
        </div>

        {/* Real-time Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-2">
                <span className="vibe-logo text-[10px] text-slate-500 uppercase tracking-widest">Current Score</span>
                <span className="text-6xl font-black text-white tracking-tighter">{score}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-2">
                <span className="vibe-logo text-[10px] text-slate-500 uppercase tracking-widest">XP Sync</span>
                <span className="text-6xl font-black text-indigo-400 tracking-tighter">+{earnedXp}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-2">
                <span className="vibe-logo text-[10px] text-slate-500 uppercase tracking-widest">Credits Earned</span>
                <span className="text-6xl font-black text-blue-500 tracking-tighter">+{earnedCredits}</span>
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
