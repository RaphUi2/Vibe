import React from 'react';
import { User } from '../types.ts';
import { 
  Settings as SettingsIcon, 
  Target, 
  ShoppingBag, 
  Zap,
  ChevronRight,
  Video,
  Gamepad2,
  Trophy,
  LayoutGrid,
  Bot,
  Flame,
  User as UserIcon,
  Search,
  Plus as PlusIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import AILogo from '../components/AILogo.tsx';

interface PlusPageProps {
  user: User;
}

const Plus: React.FC<PlusPageProps> = ({ user }) => {
  const handleNavigate = (id: string) => {
    window.dispatchEvent(new CustomEvent('vibeNavigate', { detail: id }));
  };

  const menuItems = [
    { id: 'ia', label: 'VIBEA AI', icon: <Bot className="w-6 h-6" />, desc: 'Système IA 3.0', color: 'from-indigo-600 to-blue-600', large: true },
    { id: 'vibeos', label: 'VIBEOS', icon: <Video className="w-6 h-6" />, desc: 'Flux Viral', color: 'from-rose-500 to-pink-500' },
    { id: 'games', label: 'JEUX', icon: <Gamepad2 className="w-5 h-5" />, desc: '70+ Games', color: 'from-amber-600 to-orange-500' },
    { id: 'store', label: 'BOUTIQUE', icon: <ShoppingBag className="w-5 h-5" />, desc: 'Skins & Novas', color: 'from-blue-600 to-cyan-500' },
    { id: 'quests', label: 'QUÊTES', icon: <Target className="w-5 h-5" />, desc: 'Défis Quotidiens', color: 'from-fuchsia-600 to-purple-500' },
    { id: 'levelpass', label: 'PASS', icon: <Trophy className="w-5 h-5" />, desc: 'Récompenses', color: 'from-emerald-600 to-teal-500' },
    { id: 'boost', label: 'BOOST', icon: <Zap className="w-5 h-5" />, desc: 'Turbo Nexus', color: 'from-cyan-600 to-sky-500' },
    { id: 'settings', label: 'CONFIG', icon: <SettingsIcon className="w-5 h-5" />, desc: 'Interface', color: 'from-slate-700 to-slate-900' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-40 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="px-6 pt-20 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-radial-gradient from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-3"
        >
          <h1 className="vibe-logo text-4xl md:text-6xl font-black tracking-tighter uppercase">Nexus Centre</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Système de gestion globale</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
           {menuItems.map((item, idx) => (
             <motion.button
               key={item.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.05 }}
               whileHover={{ scale: 1.02, y: -5 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => handleNavigate(item.id)}
               className={`relative glass-premium p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 group border border-white/5 overflow-hidden ${item.large ? 'col-span-2' : 'col-span-1'}`}
             >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all`}>
                    {item.icon}
                </div>
                
                <div className="space-y-1 relative z-10">
                    <h3 className="text-xs md:text-sm font-black text-white tracking-widest uppercase">{item.label}</h3>
                    {!item.large && <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">{item.desc}</p>}
                </div>

                {item.large && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-white/5 border border-white/10 rounded-xl">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                )}
             </motion.button>
           ))}
        </div>

        {/* Dynamic Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-1 rounded-[3rem] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10"
        >
           <div className="glass-premium rounded-[2.9rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-2xl shadow-orange-500/20">👑</div>
                    <div>
                        <h4 className="text-2xl font-black text-white vibe-logo tracking-tighter uppercase">Statut Premium</h4>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                            {user.isUltimate ? 'Ultimate Synchro Active' : 'Synchronisez pour plus de puissance'}
                        </p>
                    </div>
                </div>
                <button 
                  onClick={() => handleNavigate('store')}
                  className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto shrink-0 relative z-10"
                >
                    {user.isUltimate ? 'Mon Passe' : 'Découvrir'}
                </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Plus;
