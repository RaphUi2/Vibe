import React from 'react';
import { storage } from '../services/storageService';
import { Trend } from '../types';

const Trending: React.FC = () => {
  const trends = storage.getTrends();

  return (
    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 shadow-4xl backdrop-blur-xl relative overflow-hidden group">
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-orange-500 text-xl">🔥</span>
          <h2 className="vibe-logo text-xl font-black text-white tracking-tight">En vogue</h2>
        </div>

        <div className="space-y-10">
          {trends.map(trend => (
            <div key={trend.id} className="group/item cursor-pointer space-y-4">
              <div className="space-y-1">
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em]">{trend.category}</p>
                <h3 className="text-xl font-black text-white group-hover/item:text-blue-400 transition-colors tracking-tight">{trend.hashtag}</h3>
                <p className="text-slate-500 text-[10px] font-bold opacity-60">{trend.count}</p>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${trend.color} rounded-full transition-all duration-1000 group-hover/item:opacity-100 opacity-40`} style={{ width: '85%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
