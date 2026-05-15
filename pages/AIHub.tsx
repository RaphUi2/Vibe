import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService.ts';
import { AIService, User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion, AnimatePresence } from 'motion/react';
import AILogo from '../components/AILogo.tsx';
import { 
  Sparkles, 
  Send, 
  Search, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Zap, 
  MessageSquare,
  Cpu,
  Globe,
  Bot,
  ChevronLeft,
  Plus as PlusIcon
} from 'lucide-react';

const AIHub: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AIService>(AIService.CHAT);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [thinking, setThinking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const services = [
    { id: AIService.CHAT, label: 'Chat', icon: <Bot className="w-4 h-4" />, color: 'from-blue-600 to-indigo-400', model: 'v3.5 Pro', cost: 0 },
    { id: AIService.SEARCH, label: 'Search', icon: <Globe className="w-4 h-4" />, color: 'from-emerald-500 to-teal-400', model: 'Search v3', cost: 0 },
    { id: AIService.IMAGE_GEN, label: 'Vision', icon: <ImageIcon className="w-4 h-4" />, color: 'from-purple-600 to-pink-500', model: 'Nexus Gen', cost: 500, ultimate: true },
    { id: AIService.VIDEO_GEN, label: 'Motion', icon: <VideoIcon className="w-4 h-4" />, color: 'from-rose-600 to-orange-500', model: 'Veo Pro', cost: 2000, ultimate: true },
  ];

  const handleAction = async () => {
    if (!input.trim() || loading) return;
    
    const service = services.find(s => s.id === activeTab);
    if (service?.ultimate && !user.isUltimate) {
      alert("Ultimate requis");
      return;
    }

    const currentInput = input;
    setInput('');
    setLoading(true);
    
    // Add user message
    const userMsg = { text: currentInput, type: 'user', timestamp: Date.now(), service: activeTab };
    setHistory(prev => [...prev, userMsg]);

    try {
      let res;
      switch (activeTab) {
        case AIService.CHAT:
          res = await gemini.chat(currentInput, thinking);
          setHistory(prev => [...prev, { text: res, type: 'ai', timestamp: Date.now(), service: activeTab }]);
          storage.addReward(user.id, 5, 20);
          break;
        case AIService.IMAGE_GEN:
          res = await gemini.generateImage(currentInput);
          setHistory(prev => [...prev, { mediaUrl: res, type: 'image', prompt: currentInput, timestamp: Date.now(), service: activeTab }]);
          storage.addReward(user.id, -500, 50);
          break;
        case AIService.SEARCH:
          const searchRes = await gemini.search(currentInput);
          setHistory(prev => [...prev, { ...searchRes, type: 'search', timestamp: Date.now(), service: activeTab }]);
          storage.addReward(user.id, 10, 30);
          break;
        case AIService.VIDEO_GEN:
          res = await gemini.generateVideo(currentInput);
          setHistory(prev => [...prev, { mediaUrl: res, type: 'video', prompt: currentInput, timestamp: Date.now(), service: activeTab }]);
          storage.addReward(user.id, -2000, 200);
          break;
      }
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeService = services.find(s => s.id === activeTab);

  return (
    <div className="flex flex-col h-screen bg-black text-white selection:bg-vibe-blue/20 overflow-hidden relative">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 atmosphere opacity-20 pointer-events-none"></div>
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${activeService?.color.split(' ')[0]} blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 transition-all duration-1000`}></div>

      {/* Header - Glassmorphism */}
      <div className="pt-12 md:pt-16 pb-4 px-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl relative z-10 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('vibeNavigate', { detail: 'home' }))}
                        className="p-2.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all md:hidden"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-4xl relative overflow-hidden group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${activeService?.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                            <AILogo size="sm" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black vibe-logo uppercase tracking-tighter">Vibea AI</h1>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow"></div>
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Nexus Sync Optimal</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Crédits</span>
                    <span className="text-sm font-black text-white">{user.credits?.toLocaleString()} N</span>
                </div>
            </div>

            {/* Service Selection - Horizontal Scrollable on Mobile */}
            <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
                {services.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveTab(s.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                            activeTab === s.id 
                            ? 'bg-white text-black shadow-xl scale-105' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {React.cloneElement(s.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Message Feed - Optimized for readability */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 relative flex flex-col custom-scrollbar bg-black/20">
          <div className="max-w-3xl mx-auto w-full space-y-8 pb-40">
            {history.filter(h => h.service === activeTab).length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-10 md:pt-20 text-center space-y-8 animate-in zoom-in-95 duration-700">
                    <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-5xl bg-gradient-to-br ${activeService?.color} shadow-6xl border border-white/10 ring-8 ring-white/5 relative group`}>
                        <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-inherit"></div>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {activeService?.icon}
                        </motion.div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter vibe-logo uppercase">{activeService?.label} Hub</h2>
                        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                            {activeService?.model} • Architecture Neurone Nexus v4.0
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg pt-8">
                        {["Explique moi le Nexus VIBE", "Génère un avatar néon futuriste", "Dernières tendances IA"].map(p => (
                            <button 
                                key={p} 
                                onClick={() => setInput(p)} 
                                className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] text-left font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                            >
                                <span className="opacity-40 mr-2">{'>'}</span> {p}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                history.filter(h => h.service === activeTab).map((msg, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`max-w-[85%] md:max-w-[75%] p-5 md:p-6 rounded-[2rem] border shadow-4xl relative ${
                            msg.type === 'user' 
                                ? 'bg-gradient-to-br from-vibe-blue to-blue-700 border-white/10 text-white rounded-tr-none' 
                                : 'bg-white/[0.03] backdrop-blur-3xl border-white/10 text-white rounded-tl-none'
                        }`}>
                             {msg.type !== 'user' && (
                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-black border border-white/10 flex items-center justify-center shadow-lg">
                                    <AILogo size="sm" />
                                </div>
                             )}

                            {msg.type === 'image' || msg.type === 'video' ? (
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                        {msg.type === 'video' ? (
                                            msg.mediaUrl ? (
                                                <video src={msg.mediaUrl} controls autoPlay loop className="w-full" />
                                            ) : (
                                                <div className="p-20 text-center flex flex-col items-center gap-4">
                                                    <VideoIcon className="w-10 h-10 text-rose-500 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Flux vidéo corrompu</span>
                                                </div>
                                            )
                                        ) : (
                                            <img src={msg.mediaUrl} className="w-full h-auto transition-transform duration-[3s] group-hover:scale-110" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-slate-400 font-bold italic truncate max-w-[200px]">Prompt: {msg.prompt}</p>
                                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <Zap className="w-3 h-3 text-blue-400" />
                                        </button>
                                    </div>
                                </div>
                            ) : msg.type === 'search' ? (
                                <div className="space-y-6">
                                    <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>
                                    <div className="space-y-3 pt-6 border-t border-white/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sources Indexées</h4>
                                        <div className="flex flex-col gap-2">
                                            {msg.grounding?.map((g: any, j: number) => (
                                                <a key={j} href={g.uri} target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group">
                                                    <div className="flex items-center gap-3 truncate">
                                                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-[10px]">{j+1}</div>
                                                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">{g.title}</span>
                                                    </div>
                                                    <Globe className="w-3 h-3 text-slate-600 group-hover:text-blue-400" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-2">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">{msg.type === 'user' ? 'Moi' : 'Vibea AI'}</span>
                            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                            <span className="text-[8px] font-black text-slate-600 tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </motion.div>
                ))
            )}
            
            {loading && (
                <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                        <AILogo size="sm" />
                    </div>
                    <div className="p-6 bg-white/[0.02] rounded-[2rem] rounded-tl-none border border-white/5 flex flex-col gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Traitement Neural en cours...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
      </div>

      {/* Modern Fixed Input - Mobile First */}
      <div className="fixed bottom-0 md:bottom-8 left-0 right-0 p-4 md:px-8 z-[100] safe-bottom">
          <div className="max-w-4xl mx-auto">
              <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-2 rounded-[2rem] md:rounded-[3rem] shadow-6xl relative group focus-within:border-white/20 transition-all">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeService?.color} opacity-40 rounded-full blur-sm transition-all duration-1000 overflow-hidden`}>
                      {loading && <motion.div className="h-full bg-white animate-scan-fast" />}
                  </div>
                  
                  <div className="flex items-center gap-2">
                       {/* Context Trigger Button */}
                       <div className="flex gap-2 pl-2">
                           <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400">
                               <PlusIcon className="w-5 h-5" />
                           </button>
                       </div>

                       <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAction();
                          }
                        }}
                        placeholder={`Message à ${activeService?.label}...`}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base py-4 px-4 text-white placeholder:text-slate-600 outline-none resize-none max-h-32 min-h-[52px] custom-scrollbar"
                        autoFocus
                        rows={1}
                      />

                      <div className="pr-2 flex items-center gap-3">
                           <button 
                            onClick={handleAction}
                            disabled={loading || !input.trim()}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white text-black shadow-2xl scale-100 active:scale-90' : 'bg-white/5 text-slate-700'}`}
                           >
                                <Send className="w-5 h-5" />
                           </button>
                      </div>
                  </div>
              </div>
              
              <div className="flex justify-between items-center px-6 mt-3">
                  <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                         <Cpu className="w-3 h-3 text-slate-600" />
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{activeService?.model}</span>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-vibe-blue" />
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Latence: 24ms</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AIHub;
