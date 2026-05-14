import React from 'react';
import { User } from '../types.ts';
import { 
  Settings as SettingsIcon, 
  Target, 
  ShoppingBag, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface PlusPageProps {
  user: User;
}

const Plus: React.FC<PlusPageProps> = ({ user }) => {
  const menuItems = [
    { id: 'settings', label: 'Paramètres', icon: <SettingsIcon className="w-6 h-6" />, desc: 'Gérez votre compte et vos préférences.', color: 'bg-slate-500' },
    { id: 'quests', label: 'Quêtes', icon: <Target className="w-6 h-6" />, desc: 'Relevez des défis pour gagner des récompenses.', color: 'bg-emerald-500' },
    { id: 'store', label: 'Shop', icon: <ShoppingBag className="w-6 h-6" />, desc: 'Achetez des cosmétiques et des boosts.', color: 'bg-blue-500' },
    { id: 'boost', label: 'Boost', icon: <Zap className="w-6 h-6" />, desc: 'Accélérez votre progression dans le Nexus.', color: 'bg-amber-500' },
  ];

  const handleNavigate = (id: string) => {
    window.dispatchEvent(new CustomEvent('vibeNavigate', { detail: id }));
  };

  return (
    <div className="min-h-screen bg-[#F2F4F5] dark:bg-[#111216] animate-in fade-in duration-700 pb-32">
      <div className="sticky top-0 z-[100] bg-white dark:bg-[#1B1D22] border-b border-black/5 dark:border-white/5 px-6 py-8 flex flex-col justify-center shadow-sm">
        <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">Plus</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Explorez les fonctionnalités étendues du Nexus.</p>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12 space-y-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleNavigate(item.id)}
            className="w-full flex items-center gap-6 p-6 bg-white dark:bg-[#1B1D22] hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 transition-all group shadow-sm hover:shadow-md"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-offset-2 ring-transparent group-hover:ring-${item.id === 'settings' ? 'slate' : item.id === 'quests' ? 'emerald' : item.id === 'store' ? 'blue' : 'amber'}-500/20 transition-all`}>
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-black text-black dark:text-white">{item.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}

        <div className="mt-12 p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Nexus Premium</h3>
            <p className="text-white/80 text-sm font-medium mb-6 max-w-[240px]">Débloquez toutes les quêtes exclusives et obtenez des boosts permanents.</p>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
              En savoir plus
            </button>
          </div>
          <Zap className="absolute top-1/2 -right-4 w-32 h-32 text-white/10 -translate-y-1/2 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
};

export default Plus;
