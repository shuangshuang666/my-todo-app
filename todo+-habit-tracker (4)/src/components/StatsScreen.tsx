import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Settings } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { cn, getUserAvatarUrl } from '../lib/utils';
import { Habit, HistoryRecord } from '../types';
import { calculateHabitStreak, calculateWeeklyStats, calculateMonthlyStats } from '../lib/habitUtils';

interface StatsScreenProps {
  onOpenSettings: () => void;
  userName: string;
  photoURL?: string;
  habits: Habit[];
  records: HistoryRecord[];
}

export function StatsScreen({ onOpenSettings, userName, photoURL, habits, records }: StatsScreenProps) {
  const [range, setRange] = useState<'week' | 'month'>('week');
  
  const weekData = calculateWeeklyStats(habits, records);
  const monthData = calculateMonthlyStats(habits, records);
  const currentData = range === 'week' ? weekData : monthData;

  const currentStreak = habits.length > 0 
    ? Math.max(...habits.map(h => calculateHabitStreak(h.id, records)), 0)
    : 0;

  const totalCompletionRate = habits.length > 0 && currentData.length > 0
    ? Math.round(currentData.reduce((acc, curr) => acc + curr.completion, 0) / currentData.length)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto pb-24 relative">
      {/* Hero Section with Background */}
      <div 
        className="relative pt-6 pb-20 px-4 mb-4 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://raw.githubusercontent.com/shuangshuang666/shuangshuang666.github.io/main/src/assets/Hero%20Greeting%20Section%20(2).png")' }}
      >
        <div className="absolute inset-0 bg-indigo-900/10" />
        
        <div className="relative z-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-sm overflow-hidden">
                <img 
                  src={photoURL || getUserAvatarUrl(userName)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-sm text-white drop-shadow-sm">{userName}</span>
            </div>
            <button onClick={onOpenSettings} className="p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full backdrop-blur-md">
              <Settings size={20} />
            </button>
          </header>

          <h2 className="text-3xl font-extrabold text-white drop-shadow-md leading-tight">
            Your Progress<br />Insights
          </h2>
        </div>
      </div>

      <div className="px-4">
        <div className="flex gap-2 mb-8 bg-slate-100/50 p-1 rounded-full w-fit">
        <button 
          onClick={() => setRange('week')}
          className={cn(
            "px-6 py-2 rounded-full font-bold text-sm transition-all",
            range === 'week' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"
          )}
        >
          This week
        </button>
        <button 
          onClick={() => setRange('month')}
          className={cn(
            "px-6 py-2 rounded-full font-bold text-sm transition-all",
            range === 'month' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"
          )}
        >
          This month
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center"
        >
          <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" fill="transparent" stroke="#F1F5F9" strokeWidth="5" />
                <circle 
                   cx="32" cy="32" r="28" fill="transparent" stroke="#6366F1" strokeWidth="5" 
                   strokeDasharray={176} strokeDashoffset={176 - (176 * totalCompletionRate) / 100} strokeLinecap="round" 
                />
             </svg>
             <span className="absolute font-bold text-indigo-900 text-sm">{totalCompletionRate}%</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400">Completion rate</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-2">
             <Flame size={24} className="text-orange-500 fill-orange-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{currentStreak}</p>
          <p className="text-[10px] font-bold text-slate-400">Current streak</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-50 flex-1"
      >
        <div className="flex items-center justify-between mb-6">
           <div>
             <h3 className="text-lg font-bold text-slate-800">
               {range === 'week' ? 'Weekly' : 'Monthly'} Completion
             </h3>
           </div>
           <div className="text-right">
             <span className="text-indigo-600 font-bold text-xs">
               Real-time tracking
             </span>
           </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }}
                dy={10}
                padding={{ left: 10, right: 10 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#6366F1', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="completion" 
                stroke="#6366F1" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorComp)" 
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 6, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
