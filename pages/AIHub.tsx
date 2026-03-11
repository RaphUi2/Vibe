import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService.ts';
import { AIService, User } from '../types.ts';
import { storage } from '../services/storageService.ts';
import Logo from '../components/Logo.tsx';

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
    { id: AIService.CHAT, label: 'Aura Core 2', icon: '⚡', desc: 'Intelligence conversationnelle avancée.', color: 'from-blue-600 to-cyan-400', model: 'Gemini 3.1 Pro', cost: 0, ultimate: false },
    { id: AIService.SEARCH, label: 'Aura Search', icon: '🌐', desc: 'Recherche web en temps réel.', color: 'from-emerald-500 to-teal-400', model: 'Gemini 3 Flash', cost: 0, ultimate: false },
    { id: AIService.IMAGE_GEN, label: 'Aura Vision', icon: '👁️', desc: 'Génération d\'images 4K.', color: 'from-purple-600 to-pink-500', model: 'Gemini 3.1 Flash Image', cost: 500, ultimate: true },
    { id: AIService.VIDEO_GEN, label: 'Aura Motion', icon: '🎬', desc: 'Création vidéo cinématique.', color: 'from-rose-600 to-orange-500', model: 'Veo 3.1 Fast', cost: 2000, ultimate: true },
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
    
    // Add user message to history immediately for chat
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
      alert("Erreur Aura : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeService = services.find(s => s.id === activeTab);

  return (
    <div className="flex h-[calc(100vh-80px)] landscape:h-full bg-[#020617] text-white animate-in fade-in duration-700 font-sans overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl p-6 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 p-[1px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 vibe-logo">AURA 2</h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-emerald-500 tracking-[0.2em] uppercase">Online</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <h3 className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-4 px-2">Modules</h3>
          {services.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveTab(s.id); setResult(null); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                activeTab === s.id 
                  ? `bg-gradient-to-r ${s.color} text-white shadow-lg scale-105` 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{s.label}</span>
                <span className="text-[9px] opacity-70">{s.model}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
            </div>
            <h1 className="text-lg font-black tracking-tighter vibe-logo">AURA 2</h1>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-[60%]">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveTab(s.id); setResult(null); }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  activeTab === s.id ? `bg-gradient-to-r ${s.color} text-white` : 'bg-white/5 text-white/50'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 pb-32">
            
            {/* Welcome / Context */}
            {history.filter(h => h.service === activeTab).length === 0 && !result && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in-95 duration-700">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${activeService?.color} opacity-20 blur-3xl absolute animate-pulse`}></div>
                <div className="relative w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl backdrop-blur-xl">
                  {activeService?.icon}
                </div>
                <div className="space-y-2 relative z-10">
                  <h2 className="text-4xl font-black tracking-tighter vibe-logo">{activeService?.label}</h2>
                  <p className="text-white/50 font-medium max-w-md mx-auto">{activeService?.desc}</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/70 relative z-10 shadow-xl">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Propulsé par {activeService?.model}
                </div>
              </div>
            )}

            {/* Chat / Search History */}
            {(activeTab === AIService.CHAT || activeTab === AIService.SEARCH) && (
              <div className="space-y-6">
                {history.filter(h => h.service === activeTab).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-tr-sm' 
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-2xl'
                    }`}>
                      {msg.type === 'search' ? (
                        <div className="space-y-4">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          {msg.grounding?.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                              {msg.grounding.map((g: any, i: number) => (
                                <a key={i} href={g.uri} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg text-[10px] font-bold text-blue-400 hover:bg-black/50 transition-colors border border-white/5">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                  {g.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                          {msg.text.split('\n').map((line: string, i: number) => (
                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white/5 border border-white/10 rounded-3xl rounded-tl-sm p-5 flex items-center gap-3 backdrop-blur-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Aura réfléchit...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Media Results */}
            {result && (activeTab === AIService.IMAGE_GEN || activeTab === AIService.VIDEO_GEN) && (
              <div className="animate-in zoom-in-95 duration-500">
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/50 backdrop-blur-xl p-2">
                  {result.type === 'video' ? (
                    <video src={result.mediaUrl} className="w-full rounded-[1.5rem] object-cover" controls autoPlay loop />
                  ) : (
                    <img src={result.mediaUrl} className="w-full rounded-[1.5rem] object-cover" />
                  )}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-xs font-medium text-white/80">"{result.prompt}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State for Media */}
            {(activeTab === AIService.IMAGE_GEN || activeTab === AIService.VIDEO_GEN) && loading && (
              <div className="flex justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24">
                    <div className={`absolute inset-0 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-500 animate-spin`}></div>
                    <div className={`absolute inset-2 rounded-full border-l-4 border-r-4 border-transparent border-l-purple-500 animate-spin-reverse`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                      {activeTab === AIService.IMAGE_GEN ? '🎨' : '🎬'}
                    </div>
                  </div>
                  <span className="text-xs font-black tracking-widest uppercase text-blue-400 animate-pulse">Génération en cours...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-50">
          <div className="max-w-4xl mx-auto relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r ${activeService?.color} rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
            <div className="relative flex items-end gap-2 bg-black/60 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAction();
                  }
                }}
                placeholder={`Demander à ${activeService?.label}...`}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 px-4 py-3 outline-none resize-none min-h-[50px] max-h-[150px] text-sm font-medium"
                rows={1}
              />
              <div className="flex items-center gap-2 pb-1 pr-1">
                {activeTab === AIService.CHAT && (
                  <button 
                    onClick={() => setThinking(!thinking)}
                    className={`p-3 rounded-xl transition-all ${thinking ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                    title="Mode Réflexion Profonde"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </button>
                )}
                <button 
                  onClick={handleAction}
                  disabled={loading || !input.trim()}
                  className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                    input.trim() && !loading
                      ? `bg-gradient-to-r ${activeService?.color} text-white shadow-lg hover:scale-105` 
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 px-4">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Coût : {activeService?.cost === 0 ? 'Gratuit' : `${activeService?.cost} Novas`}
              </span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                Aura OS v2.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHub;
