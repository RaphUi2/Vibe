
import React, { useState, useEffect } from 'react';
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

  const services = [
    { id: AIService.CHAT, label: 'Discussion', icon: '💬', desc: 'Assistant intelligent pour vos questions.', color: 'from-blue-500 to-indigo-600', model: 'Gemini 3 Pro', cost: 0, ultimate: false },
    { id: AIService.SEARCH, label: 'Recherche', icon: '🔍', desc: 'Recherche d\'informations en temps réel.', color: 'from-emerald-500 to-teal-600', model: 'Gemini 3 Flash', cost: 0, ultimate: false },
    { id: AIService.IMAGE_GEN, label: 'Images', icon: '🖼️', desc: 'Génération d\'images haute résolution.', color: 'from-purple-500 to-fuchsia-600', model: 'Imagen 4 / G3 Pro', cost: 500, ultimate: true },
    { id: AIService.VIDEO_GEN, label: 'Vidéos', icon: '🎥', desc: 'Création de séquences vidéo courtes.', color: 'from-rose-500 to-orange-600', model: 'Veo 3.1 Fast', cost: 2000, ultimate: true },
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

    setLoading(true);
    setResult(null);
    try {
      let res;
      switch (activeTab) {
        case AIService.CHAT:
          res = await gemini.chat(input, thinking);
          const chatData = { text: res, type: 'text', timestamp: Date.now(), service: activeTab };
          setResult(chatData);
          setHistory(prev => [chatData, ...prev.slice(0, 4)]);
          storage.addReward(user.id, 5, 20);
          break;
        case AIService.IMAGE_GEN:
          res = await gemini.generateImage(input);
          const imgData = { mediaUrl: res, type: 'image', timestamp: Date.now(), service: activeTab };
          setResult(imgData);
          setHistory(prev => [imgData, ...prev.slice(0, 4)]);
          storage.addReward(user.id, -500, 50);
          break;
        case AIService.SEARCH:
          const searchRes = await gemini.search(input);
          const sData = { ...searchRes, type: 'search', timestamp: Date.now(), service: activeTab };
          setResult(sData);
          setHistory(prev => [sData, ...prev.slice(0, 4)]);
          storage.addReward(user.id, 10, 30);
          break;
        case AIService.VIDEO_GEN:
          res = await gemini.generateVideo(input);
          const vData = { mediaUrl: res, type: 'video', timestamp: Date.now(), service: activeTab };
          setResult(vData);
          setHistory(prev => [vData, ...prev.slice(0, 4)]);
          storage.addReward(user.id, -2000, 200);
          break;
      }
    } catch (err: any) {
      console.error(err);
      alert("Erreur de connexion : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Status */}
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <h2 className="vibe-logo text-4xl font-black text-white tracking-tighter">ASSISTANT IA</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">Système Opérationnel</span>
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => { setActiveTab(s.id); setResult(null); }}
            className={`relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 group text-left flex flex-col justify-between h-44 ${
              activeTab === s.id 
              ? `bg-white text-black border-white shadow-2xl scale-[1.02]` 
              : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-start">
               <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{s.icon}</span>
            </div>
            <div>
               <h3 className={`vibe-logo text-[10px] font-black uppercase tracking-widest ${activeTab === s.id ? 'text-black' : 'text-slate-400'}`}>{s.label}</h3>
               <p className={`text-[9px] font-medium leading-tight mt-1 ${activeTab === s.id ? 'text-black/70' : 'text-slate-600'}`}>{s.desc}</p>
            </div>
            {s.ultimate && !user.isUltimate && (
              <div className="absolute top-4 right-4 text-[8px] font-black bg-black/40 px-2 py-1 rounded-lg text-white border border-white/20">ULTIMATE</div>
            )}
          </button>
        ))}
      </div>

      {/* Command Terminal */}
      <div className="relative group">
        <div className="relative bg-white/5 rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-4xl backdrop-blur-3xl overflow-hidden">
          
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="flex flex-col">
                   <span className="vibe-logo text-[8px] font-black text-slate-400 uppercase tracking-widest">Modèle Actif</span>
                   <span className="text-[10px] font-black text-white">{user.isUltimatePlus ? 'Gemini 3.1 Pro' : services.find(s=>s.id === activeTab)?.model}</span>
                </div>
             </div>

             {activeTab === AIService.CHAT && (
               <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="vibe-logo text-[7px] text-slate-500 font-black uppercase tracking-widest">Mode Réflexion</span>
                    <span className={`text-[9px] font-black uppercase ${thinking ? 'text-blue-400' : 'text-slate-600'}`}>{thinking ? 'Activé' : 'Désactivé'}</span>
                  </div>
                  <button 
                    onClick={() => setThinking(!thinking)}
                    className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${thinking ? 'bg-blue-600' : 'bg-white/5 border border-white/5'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-xl ${thinking ? 'left-8' : 'left-1'}`}></div>
                  </button>
               </div>
             )}
          </div>

          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ici..."
              className="w-full bg-transparent border-none outline-none text-white font-bold text-2xl md:text-3xl placeholder:text-slate-700 min-h-[160px] max-h-[400px] custom-scrollbar leading-tight selection:bg-blue-500/30"
            />
            
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/5">
              <span className={`text-[10px] font-black vibe-logo transition-all ${input.length > 250 && !user.isUltimate ? 'text-rose-500' : 'text-slate-600'}`}>
                {input.length} / {user.isUltimate ? '∞' : '300'} <span className="ml-2 opacity-50">CARACTÈRES</span>
              </span>
              <button
                onClick={handleAction}
                disabled={loading || !input.trim()}
                className={`relative px-12 py-5 rounded-2xl vibe-logo text-xs font-black uppercase tracking-[0.2em] transition-all overflow-hidden flex items-center gap-4 ${
                  loading || !input.trim() 
                  ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                  : 'bg-white text-black hover:scale-[1.05] active:scale-95 shadow-4xl'
                }`}
              >
                {loading ? (
                   <>
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Calcul...</span>
                   </>
                ) : (
                  <>
                    <span>Envoyer</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Area */}
      {result && (
        <div className="animate-in zoom-in fade-in duration-500 relative">
          <div className="bg-white/5 rounded-[3rem] p-10 md:p-14 border border-white/10 shadow-4xl space-y-10">
             <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                   <Logo size="md" />
                   <div className="flex flex-col">
                      <span className="vibe-logo text-[10px] font-black text-slate-400 uppercase tracking-widest">Résultat de l'IA</span>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{new Date(result.timestamp).toLocaleTimeString()}</span>
                   </div>
                </div>
             </div>

             {result.type === 'text' || result.type === 'search' ? (
                <div className="space-y-8">
                   <p className="text-3xl md:text-4xl font-bold text-slate-100 leading-snug tracking-tight whitespace-pre-wrap selection:bg-blue-500/40">{result.text}</p>
                   {result.grounding?.length > 0 && (
                     <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                        {result.grounding.map((g: any, i: number) => (
                          <a 
                            key={i} 
                            href={g.uri} 
                            target="_blank" 
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all group"
                          >
                            <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            {g.title}
                          </a>
                        ))}
                     </div>
                   )}
                </div>
             ) : (
                <div className="relative group/media overflow-hidden rounded-[2.5rem] border border-white/10 shadow-4xl bg-black">
                   {result.type === 'video' ? (
                      <video src={result.mediaUrl} controls autoPlay loop className="w-full h-auto" />
                   ) : (
                      <img src={result.mediaUrl} alt="Synthesis Output" className="w-full h-auto" />
                   )}
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHub;
