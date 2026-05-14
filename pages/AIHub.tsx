import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService.ts';
import { AIService, User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Search, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Zap, 
  MessageSquare,
  Cpu,
  ShieldCheck,
  Globe,
  Bot
} from 'lucide-react';

const AIHub: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AIService>(AIService.CHAT);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [thinking, setThinking] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, result, loading]);

  const services = [
    { id: AIService.CHAT, label: 'Vibea AI 3', icon: <Bot className="w-5 h-5" />, desc: 'Modèle de langage ultra-performant pour le dialogue.', color: 'from-blue-600 to-indigo-400', model: 'Gemini 3.5 Pro (Nexus Edition)', cost: 0, ultimate: false },
    { id: AIService.SEARCH, label: 'Nexus Search', icon: <Globe className="w-5 h-5" />, desc: 'Intelligence web temps réel avec index complet.', color: 'from-emerald-500 to-teal-400', model: 'Gemini 3 Search Focus', cost: 0, ultimate: false },
    { id: AIService.IMAGE_GEN, label: 'Vibea Vision', icon: <ImageIcon className="w-5 h-5" />, desc: 'Studio de création visuelle haute fidélité.', color: 'from-purple-600 to-pink-500', model: 'Imagen 3 Nexus', cost: 500, ultimate: true },
    { id: AIService.VIDEO_GEN, label: 'Vibea Motion', icon: <VideoIcon className="w-5 h-5" />, desc: 'Production vidéo cinématique par texte.', color: 'from-rose-600 to-orange-500', model: 'Veo 3 Pro', cost: 2000, ultimate: true },
  ];

  const handleAction = async () => {
    if (!input.trim()) return;
    
    const service = services.find(s => s.id === activeTab);
    
    if (service?.ultimate && !user.isUltimate) {
      alert("Accès restreint : Ce service nécessite un abonnement Ultimate.");
      return;
    }

    if (user.credits < (service?.cost || 0)) {
      alert(`Novas insuffisants (${service?.cost} N requis).`);
      return;
    }

    const currentInput = input;
    setInput('');
    setLoading(true);
    
    if (activeTab === AIService.CHAT || activeTab === AIService.SEARCH) {
      setHistory(prev => [...prev, { text: currentInput, type: 'user', timestamp: Date.now(), service: activeTab }]);
    }

    try {
      let res;
      switch (activeTab) {
        case AIService.CHAT:
          res = await gemini.chat(currentInput, thinking);
          const chatData = { text: res, type: 'ai', timestamp: Date.now(), service: activeTab };
          setHistory(prev => [...prev, chatData]);
          storage.addReward(user.id, 5, 20);
          break;
        case AIService.IMAGE_GEN:
          res = await gemini.generateImage(currentInput);
          const imgData = { mediaUrl: res, type: 'image', prompt: currentInput, timestamp: Date.now(), service: activeTab };
          setResult(imgData);
          setHistory(prev => [...prev, imgData]);
          storage.addReward(user.id, -500, 50);
          break;
        case AIService.SEARCH:
          const searchRes = await gemini.search(currentInput);
          const sData = { ...searchRes, type: 'search', timestamp: Date.now(), service: activeTab };
          setHistory(prev => [...prev, sData]);
          storage.addReward(user.id, 10, 30);
          break;
        case AIService.VIDEO_GEN:
          res = await gemini.generateVideo(currentInput);
          const vData = { mediaUrl: res, type: 'video', prompt: currentInput, timestamp: Date.now(), service: activeTab };
          setResult(vData);
          setHistory(prev => [...prev, vData]);
          storage.addReward(user.id, -2000, 200);
          break;
      }
    } catch (err: any) {
      console.error(err);
      alert("Erreur Vibea AI : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeService = services.find(s => s.id === activeTab);

  return (
    <div className="flex flex-col flex-1 bg-black text-white animate-in fade-in duration-700 font-sans overflow-hidden">
      
      {/* Immersive AI Header */}
      <div className="relative pt-12 pb-6 px-6 border-b border-white/5 bg-gradient-to-b from-blue-950/20 to-black/40 backdrop-blur-3xl z-50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="relative shrink-0">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-3 bg-gradient-to-r from-vibe-blue via-vibe-purple to-vibe-blue rounded-full opacity-20 blur-xl" 
                    />
                    <div className="relative w-20 h-20 bg-black rounded-full border border-white/10 flex items-center justify-center shadow-4xl overflow-hidden ring-4 ring-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(59,130,246,0.3),_transparent_70%)] animate-pulse" />
                        <Bot className="w-10 h-10 text-blue-400 relative z-10" />
                    </div>
                </div>
                <div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black vibe-logo tracking-tighter bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">VIBEA AI 3</h1>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black tracking-[0.3em] uppercase">PRO v3.5</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 mt-3">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Cpu className="w-3.5 h-3.5" />
                            Nexus Core
                        </div>
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Synchronisé
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex bg-[#111216]/50 backdrop-blur-xl rounded-[2rem] p-1.5 border border-white/5 shadow-inner overflow-x-auto scrollbar-hide shrink-0 max-w-full">
                {services.map(s => (
                    <button
                        key={s.id}
                        onClick={() => { setActiveTab(s.id); setResult(null); }}
                        className={`px-5 md:px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shrink-0 ${
                            activeTab === s.id ? `bg-white text-black shadow-2xl scale-[1.02]` : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {activeTab === s.id ? s.icon : <div className="opacity-50">{s.icon}</div>}
                        <span className="whitespace-nowrap">{s.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        <div className="absolute inset-0 atmosphere pointer-events-none opacity-30" />
        
        {/* Interaction Stage */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-4xl mx-auto p-6 md:p-12 pb-40">
            <AnimatePresence mode="wait">
                {history.filter(h => h.service === activeTab).length === 0 && !result ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 md:py-24 text-center space-y-10"
                    >
                        <div className="relative mx-auto w-32 h-32">
                           <div className={`absolute inset-0 bg-gradient-to-br ${activeService?.color} blur-[60px] opacity-20 animate-pulse`} />
                           <div className="relative w-full h-full rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center text-6xl shadow-3xl backdrop-blur-3xl ring-1 ring-white/20">
                              {activeService?.icon}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h2 className="text-5xl font-black tracking-tighter vibe-logo uppercase">{activeService?.label}</h2>
                           <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">{activeService?.desc}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {[
                                "Explique-moi la théorie du Nexus...",
                                "Crée une image d'une ville néon futuriste",
                                "Quelles sont les dernières actus tech ?",
                                "Aide-moi à coder une fonction en Python"
                            ].map((prompt, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setInput(prompt)}
                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-left text-sm font-medium text-slate-400 hover:text-white transition-all group"
                                >
                                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">⚡</span> {prompt}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80 mx-auto w-fit">
                           <Cpu className="w-3.5 h-3.5" />
                           Architecture {activeService?.model}
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-10 flex flex-col pt-4">
                        {history.filter(h => h.service === activeTab).map((msg, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={idx} 
                                className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl shrink-0 flex items-center justify-center text-sm md:text-md border ${
                                        msg.type === 'user' 
                                            ? 'bg-blue-600 border-blue-400 text-white' 
                                            : 'bg-white font-black text-black border-white shadow-xl'
                                    }`}>
                                        {msg.type === 'user' ? 'U' : 'V'}
                                    </div>
                                    <div className={`rounded-3xl p-6 md:p-8 shadow-2xl ${
                                        msg.type === 'user' 
                                            ? 'bg-[#1e1e1e] border border-white/10 text-white rounded-tr-none' 
                                            : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none backdrop-blur-3xl'
                                    }`}>
                                        {msg.type === 'search' ? (
                                            <div className="space-y-6">
                                                <p className="text-base md:text-lg leading-relaxed font-medium">{msg.text}</p>
                                                {msg.grounding?.length > 0 && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/5">
                                                        {msg.grounding.map((g: any, i: number) => (
                                                            <a key={i} href={g.uri} target="_blank" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-xs font-bold text-blue-400 hover:bg-white/10 transition-all border border-white/5 group">
                                                                <Globe className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                                <span className="truncate">{g.title}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : msg.type === 'image' || msg.type === 'video' ? (
                                            <div className="space-y-4">
                                                <div className="relative rounded-2xl overflow-hidden bg-black ring-1 ring-white/10">
                                                    {msg.type === 'video' ? (
                                                       <video src={msg.mediaUrl} className="w-full h-auto" controls autoPlay loop />
                                                    ) : (
                                                       <img src={msg.mediaUrl} className="w-full h-auto" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 italic font-medium">Prompt: {msg.prompt}</p>
                                            </div>
                                        ) : (
                                            <div className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed font-medium">
                                                {msg.text.split('\n').map((line: string, i: number) => (
                                                    <p key={i} className="mb-4 last:mb-0">{line}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-4 max-w-[80%]">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white font-black text-black flex items-center justify-center text-sm border-white animate-pulse">V</div>
                                    <div className="bg-white/5 border border-white/5 rounded-3xl rounded-tl-none p-6 md:p-8 flex items-center gap-4 backdrop-blur-3xl shadow-xl">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Vibea AI analyse...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* Console Input */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-50">
          <div className="max-w-4xl mx-auto relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-vibe-purple/20 to-pink-600/20 rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />
             <div className="relative bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 md:p-4 shadow-4xl flex items-end gap-3 ring-1 ring-white/10">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAction();
                    }
                  }}
                  placeholder={`Expliquez votre vision à ${activeService?.label}...`}
                  className="flex-1 bg-transparent text-white placeholder:text-slate-600 px-6 py-4 outline-none resize-none min-h-[60px] max-h-[200px] text-lg font-medium custom-scrollbar"
                  rows={1}
                />
                
                <div className="flex items-center gap-3 pb-2 pr-2">
                    {activeTab === AIService.CHAT && (
                      <button 
                        onClick={() => setThinking(!thinking)}
                        className={`p-4 rounded-2xl transition-all relative group/think ${thinking ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                      >
                         <Zap className={`w-6 h-6 ${thinking ? 'fill-white animate-pulse' : ''}`} />
                         <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1.5 bg-black border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover/think:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Vibea Ultra (Nexus)</span>
                      </button>
                    )}
                    <button 
                      onClick={handleAction}
                      disabled={loading || !input.trim()}
                      className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center shadow-xl ${
                        input.trim() && !loading
                          ? `bg-blue-600 text-white hover:scale-105 active:scale-95` 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-6 h-6" />
                    </button>
                </div>
             </div>

             <div className="flex justify-between items-center mt-4 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                <div className="flex items-center gap-4">
                    <span className={activeService?.cost === 0 ? 'text-emerald-500/50' : 'text-blue-500/50'}>
                        {activeService?.cost === 0 ? 'Gratuit' : `${activeService?.cost} Novas / generation`}
                    </span>
                    <span>Modèle: {activeService?.model}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>Liaison Nexus Active</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHub;
