
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout }) => {
  const currentHash = window.location.hash || '#home';

  return (
    <div className="flex flex-col h-full p-4 space-y-8 sticky top-0">
      <div className="flex items-center space-x-2 text-2xl font-bold text-white mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">V</div>
        <span className="hidden md:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-black">Vibe</span>
      </div>

      <nav className="flex-1 space-y-2">
        <a href="#home" className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${currentHash === '#home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="hidden md:inline font-bold">Home</span>
        </a>
        <a href="#vibeos" className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${currentHash === '#vibeos' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="hidden md:inline font-bold">Vibeos</span>
        </a>
        <a href="#ai-hub" className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${currentHash === '#ai-hub' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-indigo-900/30 hover:text-indigo-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="hidden md:inline font-bold">AI Hub</span>
        </a>
        <a href="#explore" className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${currentHash === '#explore' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="hidden md:inline font-bold">Explore</span>
        </a>
        <a href="#profile" className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${currentHash === '#profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="hidden md:inline font-bold">Profile</span>
        </a>
      </nav>

      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center space-x-3 p-2">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl border border-slate-700 shadow-sm" />
          <div className="hidden md:block overflow-hidden">
            <p className="text-sm font-black truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">@{currentUser.username}</p>
          </div>
        </div>
        <button onClick={onLogout} className="mt-4 w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="hidden md:inline font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
