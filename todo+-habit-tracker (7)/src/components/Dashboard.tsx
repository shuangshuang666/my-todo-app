import React from 'react';
import { motion } from 'motion/react';
import { Settings, Plus, Flame } from 'lucide-react';
import { cn, getUserAvatarUrl } from '../lib/utils';
import { getHabitIcon, calculateHabitStreak, isHabitDoneThisWeek, getHabitsForToday } from '../lib/habitUtils';
import { Habit, HistoryRecord } from '../types';

interface DashboardProps {
  userName: string;
  photoURL?: string;
  habits: Habit[];
  records: HistoryRecord[];
  onToggleHabit: (habitId: string, date?: string) => void;
  onAddHabit: () => void;
  onOpenSettings: () => void;
}

export function Dashboard({ userName, photoURL, habits, records, onToggleHabit, onAddHabit, onOpenSettings }: DashboardProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayRecords = records.filter(r => r.date === selectedDate && r.status === 'done');
  const habitsForDate = getHabitsForToday(habits, records, selectedDate);
  
  const completedCount = todayRecords.filter(r => habitsForDate.some(h => h.id === r.habitId)).length;
  const totalCount = habitsForDate.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto pb-24">
      {/* Hero Section with Background */}
      <div 
        className="relative pt-6 pb-20 px-4 mb-4 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://raw.githubusercontent.com/shuangshuang666/shuangshuang666.github.io/main/src/assets/Hero%20Greeting%20Section%20(2).png")' }}
      >
        {/* Overlay to ensure text readability if needed */}
        <div className="absolute inset-0 bg-indigo-900/10" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-sm overflow-hidden">
                <img 
                  src={photoURL || getUserAvatarUrl(userName)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-lg text-white drop-shadow-sm">{userName}</span>
            </div>
            <button onClick={onOpenSettings} className="p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full backdrop-blur-md">
              <Settings size={20} />
            </button>
          </header>

          {/* Date Selector */}
          <div className="flex gap-2 p-1 bg-white/20 backdrop-blur-md rounded-xl w-fit border border-white/20">
            <button 
              onClick={() => setSelectedDate(yesterday)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                selectedDate === yesterday ? "bg-white text-indigo-600 shadow-sm transition-all" : "text-white/70 hover:text-white"
              )}
            >
              Yesterday
            </button>
            <button 
              onClick={() => setSelectedDate(today)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                selectedDate === today ? "bg-white text-indigo-600 shadow-sm transition-all" : "text-white/70 hover:text-white"
              )}
            >
              Today
            </button>
          </div>

          {/* Greeting */}
          <div>
            <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
              {selectedDate === today ? (userName === 'Guest' ? 'Hello there!' : `Good morning, ${userName}`) : "Reviewing Past"}
            </h2>
            <p className="text-white/80 font-bold text-sm mt-1 drop-shadow-sm">
              {totalCount === 0 ? "No habits scheduled" : `You have ${totalCount} habits ${selectedDate === today ? "today" : "on this day"}`}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Card (overlapping slightly) */}
      <div className="px-4 mb-8 -mt-12 relative z-20">
        <div className="bg-white rounded-[15px] p-6 shadow-md flex items-center justify-between border border-slate-50">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {selectedDate === today ? "Daily Progress" : "Recap Progress"}
            </h3>
            <p className="text-slate-500 text-[13px] font-medium leading-tight">
              {progressPercentage}% achieved {selectedDate === today ? "today" : "on this day"}.
            </p>
          </div>
          
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-100"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={201}
                strokeDashoffset={201 - (201 * progressPercentage) / 100}
                strokeLinecap="round"
                className="text-indigo-600 transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-indigo-900 font-bold text-base">{completedCount} / {totalCount}</span>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="px-4 space-y-4 flex-1">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          {selectedDate === today ? "Today's Habits" : "Yesterday's Habits"}
        </h4>
        
        {habitsForDate.map((habit) => {
          const isDone = todayRecords.some(r => r.habitId === habit.id);
          const streak = calculateHabitStreak(habit.id, records);
          
          return (
            <motion.div 
              key={habit.id}
              layout
              className="bg-white rounded-[15px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-[15px] flex items-center justify-center",
                  isDone ? "bg-slate-50 text-slate-400" : "bg-indigo-50 text-indigo-600"
                )}>
                  {getHabitIcon(habit.icon, habit.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className={cn(
                      "font-bold text-[13px] text-slate-800",
                      isDone && "text-slate-400 line-through"
                    )}>
                      {habit.name}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame size={12} className="text-orange-500" />
                    <span className="text-[10px] font-bold text-slate-400">{streak} day streak</span>
                  </div>
                  {habit.details && (
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate">
                      {habit.details}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onToggleHabit(habit.id, selectedDate)}
                className={cn(
                  "px-3 py-1.5 rounded-[15px] font-bold text-[11px] transition-all",
                  isDone 
                    ? "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100" 
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                )}
              >
                {isDone ? 'Undo' : 'Check in'}
              </button>
            </motion.div>
          );
        })}

        {/* Empty State with Onboarding Suggestions */}
        {totalCount === 0 && (
          <div className="py-12 px-4 text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-40 h-40 rounded-full bg-indigo-50/50 flex items-center justify-center mb-6 overflow-hidden relative"
            >
               <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent" />
               <Plus size={40} className="text-indigo-200" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Build your first habit</h3>
            <p className="text-slate-400 font-medium text-sm mb-8 max-w-[240px]">
              Small steps lead to big changes. Try one of these popular habits:
            </p>
            
            <div className="w-full space-y-3 mb-8">
              {[
                { name: 'Drink 2L Water', icon: 'Water', color: 'bg-blue-50 text-blue-500' },
                { name: '10 Min Meditation', icon: 'Sun', color: 'bg-orange-50 text-orange-500' },
                { name: 'Read 5 Pages', icon: 'AlignLeft', color: 'bg-green-50 text-green-500' }
              ].map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm", item.color)}>
                      {getHabitIcon(item.icon, item.name)}
                    </div>
                    <span className="text-[13px] font-bold text-slate-700">{item.name}</span>
                  </div>
                  <button 
                    onClick={onAddHabit}
                    className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Add
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAddHabit}
            className="flex items-center gap-2 px-8 py-3.5 rounded-[15px] border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all w-full max-w-[200px] justify-center bg-white shadow-sm"
          >
            <Plus size={18} />
            Add Habit
          </motion.button>
        </div>
      </div>
    </div>
  );
}
