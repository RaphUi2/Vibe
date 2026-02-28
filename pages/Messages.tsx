
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { storage } from '../services/storageService';

const Messages: React.FC<{ user: User }> = ({ user }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allUsers = storage.getUsers().filter(u => u.id !== user.id);
    setContacts(allUsers);
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      setMessages(storage.getMessages(user.id, selectedContact.id));
      scrollToBottom();
    }
  }, [selectedContact, user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = () => {
    if (!selectedContact || !input.trim()) return;
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      receiverId: selectedContact.id,
      content: input,
      createdAt: Date.now()
    };
    storage.sendMessage(msg);
    setMessages([...messages, msg]);
    setInput('');
    scrollToBottom();
    storage.addReward(user.id, 2, 5); // Social activity reward
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[80vh] flex gap-6 animate-in fade-in duration-700">
      {/* LEFT: Contact Stream Terminal */}
      <div className="w-80 md:w-96 flex flex-col h-full gap-4">
        <div className="liquid-glass rounded-[2.5rem] p-6 border border-white/10 shadow-2xl flex flex-col gap-6 h-full overflow-hidden">
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h3 className="vibe-logo text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Synchro Minds</h3>
                 <span className="text-[8px] font-black text-emerald-500/60 uppercase">{contacts.length} Actifs</span>
              </div>
              <div className="relative group">
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Filtrer le Nexus..." 
                   className="w-full bg-black/40 border border-white/5 rounded-2xl px-12 py-3.5 text-xs font-bold outline-none focus:border-blue-500/30 text-white placeholder-slate-600 transition-all shadow-inner"
                 />
                 <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {filteredContacts.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedContact(c)}
                  className={`w-full group flex items-center gap-4 p-4 rounded-3xl transition-all border relative overflow-hidden ${
                    selectedContact?.id === c.id 
                    ? 'bg-blue-600/20 border-blue-500/30 shadow-lg' 
                    : 'border-transparent hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={c.avatar} className={`w-12 h-12 rounded-2xl border-2 shadow-xl transition-transform group-hover:scale-105 ${c.isUltimate ? 'border-blue-500' : 'border-white/10'}`} />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#0a1020] shadow-sm"></div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`font-black text-sm truncate vibe-logo tracking-tight ${selectedContact?.id === c.id ? 'text-white' : 'text-slate-200'}`}>{c.name}</h4>
                      <span className="text-[8px] font-black text-slate-600 uppercase">Lv.{c.level}</span>
                    </div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-60">@{c.username}</p>
                  </div>
                  {selectedContact?.id === c.id && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  )}
                </button>
              ))}
              {filteredContacts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
                   <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   <span className="vibe-logo text-[8px] font-black tracking-widest uppercase">Signal Vide</span>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* RIGHT: Active Comms Engine */}
      <div className="flex-1 flex flex-col h-full gap-4">
        {selectedContact ? (
          <div className="flex-1 flex flex-col liquid-glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative group/chat">
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/2 backdrop-blur-xl z-20">
               <div className="flex items-center gap-5">
                  <div className="relative">
                    <img src={selectedContact.avatar} className={`w-14 h-14 rounded-2xl border-2 shadow-2xl ${selectedContact.isUltimate ? 'border-blue-500' : 'border-white/20'}`} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white border-2 border-black">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white vibe-logo tracking-tighter cyber-glow">{selectedContact.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Canal Neuronale v.4 Secure</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex gap-3">
                  <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                  <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                  <button className="p-3 bg-rose-500/10 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  </button>
               </div>
            </div>
            
            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar relative z-10 bg-black/20">
               {messages.map((m, idx) => {
                 const isSelf = m.senderId === user.id;
                 const showAvatar = idx === 0 || messages[idx-1].senderId !== m.senderId;
                 return (
                   <div key={m.id} className={`flex items-end gap-3 ${isSelf ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2`}>
                     {!isSelf && (
                       <div className="w-8 h-8 shrink-0">
                         {showAvatar ? <img src={selectedContact.avatar} className="w-full h-full rounded-lg shadow-xl" /> : <div className="w-full" />}
                       </div>
                     )}
                     <div className={`relative max-w-[65%] p-5 rounded-[1.8rem] text-sm font-semibold shadow-2xl transition-all group/bubble ${
                       isSelf 
                       ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                       : 'liquid-glass border border-white/5 text-slate-100 rounded-bl-none'
                     }`}>
                       {m.content}
                       <div className={`text-[8px] font-black uppercase tracking-widest mt-2 opacity-0 group-hover/bubble:opacity-60 transition-opacity ${isSelf ? 'text-white' : 'text-slate-400'}`}>
                         {new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • REÇU
                       </div>
                       
                       {/* Subtle Glow effects for bubbles */}
                       <div className={`absolute -inset-1 rounded-[1.8rem] blur-xl -z-10 opacity-0 group-hover/bubble:opacity-20 transition-opacity ${isSelf ? 'bg-blue-400' : 'bg-white'}`}></div>
                     </div>
                   </div>
                 );
               })}
               <div ref={chatEndRef} />
               
               {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6">
                    <div className="w-24 h-24 flex items-center justify-center liquid-glass rounded-full border border-white/20">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <p className="vibe-logo text-lg font-black tracking-[1em] uppercase">AUCUN ÉCHO</p>
                 </div>
               )}
            </div>

            {/* Input Engine */}
            <div className="p-8 bg-black/40 border-t border-white/5 z-20">
               <div className="flex gap-4 items-center">
                  <div className="flex gap-2">
                    <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-blue-400 transition-all hover:scale-110">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </button>
                    <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-purple-400 transition-all hover:scale-110">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <input 
                      value={input}
                      onChange={e=>setInput(e.target.value)}
                      onKeyDown={e=>e.key==='Enter' && handleSend()}
                      placeholder="Initialiser une fréquence..."
                      className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-8 py-4 font-bold text-sm text-white outline-none focus:border-blue-500/40 shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <span className="text-[8px] font-black text-slate-600 uppercase">Encodage Nexus-256</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSend} 
                    disabled={!input.trim()}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl ${
                      input.trim() 
                      ? 'bg-blue-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/30' 
                      : 'bg-white/5 text-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
                  </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 p-20 text-center liquid-glass rounded-[2.5rem] border border-white/10">
             <div className="relative">
                <div className="w-40 h-40 liquid-glass rounded-full flex items-center justify-center text-slate-700 shadow-4xl border border-white/5 animate-pulse">
                   <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                </div>
                <div className="absolute -inset-4 bg-blue-500/5 blur-3xl -z-10 rounded-full"></div>
             </div>
             <div className="space-y-4 max-w-sm">
                <h4 className="vibe-logo text-4xl font-black text-white tracking-tighter cyber-glow">Nexus Comms Hub</h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">Sélectionnez une identité sur la gauche pour synchroniser vos ondes cérébrales et démarrer une transmission privée.</p>
             </div>
             <button onClick={() => {}} className="px-10 py-4 bg-white/5 text-white/40 border border-white/10 rounded-2xl vibe-logo text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Générer une Invitation Nexus</button>
          </div>
        )}
      </div>

      {/* USER PREVIEW SIDEBAR (Only visible when contact selected) */}
      {selectedContact && (
        <div className="hidden lg:flex w-72 shrink-0 flex-col gap-4 animate-in slide-in-from-right-10 duration-500">
           <div className="liquid-glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-8 flex flex-col h-full">
              <div className="text-center space-y-4">
                 <div className="relative inline-block group">
                    <img src={selectedContact.avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-500/20 shadow-4xl group-hover:scale-105 transition-transform" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 liquid-glass-blue rounded-xl border border-blue-500/40 whitespace-nowrap">
                       <span className="vibe-logo text-[9px] font-black text-white tracking-widest">LVL {selectedContact.level}</span>
                    </div>
                 </div>
                 <div className="pt-2">
                    <h5 className="font-black text-xl text-white vibe-logo tracking-tight">{selectedContact.name}</h5>
                    <p className="text-blue-400 text-xs font-black uppercase tracking-widest">@{selectedContact.username}</p>
                 </div>
              </div>

              <div className="space-y-6 flex-1">
                 <div className="space-y-2">
                    <span className="vibe-logo text-[8px] text-slate-600 font-black uppercase tracking-widest">Bio-Signature</span>
                    <p className="text-xs font-bold text-slate-300 leading-relaxed italic line-clamp-4">"{selectedContact.bio || "Signal de bio-signature non identifié."}"</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                       <span className="vibe-logo text-[7px] text-slate-500 mb-1">XP</span>
                       <span className="font-black text-white">{selectedContact.xp.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                       <span className="vibe-logo text-[7px] text-slate-500 mb-1">CRÉDITS</span>
                       <span className="font-black text-blue-400">{selectedContact.credits.toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <button className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black vibe-logo text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Transférer Crédits</button>
                    <button className="w-full py-3.5 bg-white/5 text-slate-400 rounded-2xl font-black vibe-logo text-[10px] uppercase tracking-widest border border-white/10 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all">Bloquer le Signal</button>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                 <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Signal Nexus Crypté AES-GCM</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
