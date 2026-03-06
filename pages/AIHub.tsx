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
      alert(`Crédits insuffisants (${service?.cost} C requis).`);
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
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#050505] text-white animate-in fade-in duration-700 font-sans">
      
      {/* Header */}
      <div className="flex-none p-6 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">AURA 2</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-bold text-emerald-500 tracking-[0.2em] uppercase">Système Opérationnel</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveTab(s.id); setResult(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === s.id 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex-none p-4 border-b border-white/5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {services.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveTab(s.id); setResult(null); }}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === s.id 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-white/5 text-white/50 border border-white/5'
              }`}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Welcome / Context */}
          {history.filter(h => h.service === activeTab).length === 0 && !result && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in slide-in-from-bottom-4 duration-700">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${activeService?.color} opacity-20 blur-2xl absolute`}></div>
              <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-2xl backdrop-blur-xl">
                {activeService?.icon}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">{activeService?.label}</h2>
                <p className="text-white/50 font-medium max-w-md mx-auto">{activeService?.desc}</p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/70">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Modèle : {activeService?.model}
              </div>
            </div>
          )}

          {/* Chat / Search History */}
          {(activeTab === AIService.CHAT || activeTab === AIService.SEARCH) && (
            <div className="space-y-6 pb-20">
              {history.filter(h => h.service === activeTab).map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white/10 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-md'
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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

          {/* Image / Video Result */}
          {(activeTab === AIService.IMAGE_GEN || activeTab === AIService.VIDEO_GEN) && result && (
            <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-[2rem] p-4 backdrop-blur-xl shadow-2xl">
                <div className="relative rounded-3xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  {result.type === 'image' ? (
                    <img src={result.mediaUrl} className="w-full h-full object-cover" alt="Generated" />
                  ) : (
                    <video src={result.mediaUrl} className="w-full h-full object-cover" controls autoPlay loop />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium text-sm drop-shadow-md line-clamp-2">"{result.prompt}"</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {(activeTab === AIService.IMAGE_GEN || activeTab === AIService.VIDEO_GEN) && loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in">
               <div className="relative w-32 h-32">
                 <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                   {activeTab === AIService.IMAGE_GEN ? '🎨' : '🎬'}
                 </div>
               </div>
               <div className="text-center space-y-2">
                 <h3 className="text-lg font-black tracking-tight text-white">Génération en cours...</h3>
                 <p className="text-xs text-white/50 font-medium uppercase tracking-widest">Veuillez patienter</p>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 md:p-6 bg-gradient-to-t from-black via-black to-transparent">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Deep Thinking Toggle (Chat only) */}
          {activeTab === AIService.CHAT && (
            <div className="absolute -top-10 left-0">
              <button 
                onClick={() => setThinking(!thinking)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  thinking ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Deep Thinking {thinking ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-end gap-2 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-2 shadow-2xl">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAction();
                  }
                }}
                placeholder={
                  activeTab === AIService.CHAT ? "Message Aura..." : 
                  activeTab === AIService.SEARCH ? "Rechercher sur le web..." : 
                  activeTab === AIService.IMAGE_GEN ? "Décrivez l'image à générer..." : 
                  "Décrivez la vidéo à générer..."
                }
                className="w-full bg-transparent border-none text-white text-sm font-medium px-4 py-3 focus:ring-0 resize-none min-h-[52px] max-h-32 placeholder:text-white/30 scrollbar-hide"
                rows={1}
              />
              <div className="flex flex-col justify-end pb-1 pr-1">
                <button 
                  onClick={handleAction}
                  disabled={loading || !input.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    loading || !input.trim() 
                      ? 'bg-white/5 text-white/30' 
                      : 'bg-white text-black hover:scale-105 shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 px-4">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {activeService?.cost === 0 ? 'Gratuit' : `${activeService?.cost} Crédits`}
            </div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {input.length} / {activeTab === AIService.CHAT ? '4000' : '1000'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHub;
