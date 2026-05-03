import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, MoreVertical, Flame, RotateCcw, AlignLeft, X, Edit2, Trash2, Plus } from 'lucide-react';
import { cn, getUserAvatarUrl } from '../lib/utils';
import { getHabitIcon, calculateHabitStreak, calculateConsistency } from '../lib/habitUtils';
import { Habit, HistoryRecord } from '../types';

interface ProfileScreenProps {
  userName: string;
  photoURL?: string;
  habits: Habit[];
  records: HistoryRecord[];
  onOpenSettings: () => void;
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onAddHabit: () => void;
}

export function ProfileScreen({ userName, photoURL, habits, records, onOpenSettings, onUpdateHabit, onDeleteHabit, onAddHabit }: ProfileScreenProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const displayHabits = habits;

  const consistencyScore = calculateConsistency(habits, records);
  const maxStreak = habits.length > 0 
    ? Math.max(...habits.map(h => calculateHabitStreak(h.id, records)), 0)
    : 0;
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto pb-24 relative">
      {/* Settings Row */}
      <div className="px-4 pt-6 flex justify-between absolute w-full max-w-md z-20">
         <div />
         <button 
           onClick={onOpenSettings}
           className="p-2 text-white/80 hover:text-white transition-colors"
         >
            <Settings size={20} />
         </button>
      </div>

      {/* Profile Header Banner */}
      <div className="relative h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-400 to-indigo-600" />
        {/* Abstract design elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[40px] border-white/5 rounded-full" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 pt-12">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl mb-3">
             <img 
               src={photoURL || getUserAvatarUrl(userName)} 
               alt="Profile" 
               className="w-full h-full object-cover bg-white"
             />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
          <p className="text-white/80 font-medium text-sm">Building better habits daily</p>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="px-4 -translate-y-10 z-20">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50 flex flex-col items-center text-center">
            <span className="text-xl font-bold text-indigo-600">{habits.length}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Habits</span>
          </div>
          <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50 flex flex-col items-center text-center">
            <span className="text-xl font-bold text-indigo-600">{maxStreak}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">days Streak</span>
          </div>
          <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50 flex flex-col items-center text-center">
            <span className="text-xl font-bold text-indigo-600">{consistencyScore}%</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Consist. (Life)</span>
          </div>
        </div>
      </div>

      {/* My Habits List */}
      <div className="px-4 -mt-4 mb-2">
        <h3 className="text-lg font-bold text-slate-800">My Habits</h3>
      </div>

      <div className="px-4 space-y-3 mb-10 pb-10">
        {displayHabits.map((habit) => {
          const streak = calculateHabitStreak(habit.id, records);
          return (
            <div key={habit.id} className="relative">
              <div className={cn(
                "bg-white rounded-[15px] p-4 shadow-sm border transition-all flex items-center justify-between group",
                habit.isActive ? "border-slate-100" : "border-slate-100 opacity-60"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-[15px] flex items-center justify-center transition-colors",
                    habit.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {getHabitIcon(habit.icon, habit.name, 18)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-[13px]">{habit.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {habit.frequency}
                      </span>
                      <div className="flex items-center gap-1">
                        <Flame size={10} className="text-orange-500" />
                        <span className="text-[9px] font-bold text-slate-400">{streak} days</span>
                      </div>
                    </div>
                    {habit.details && (
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate">
                        {habit.details}
                      </p>
                    )}
                  </div>
                </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onUpdateHabit(habit.id, { isActive: !habit.isActive })}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors relative",
                    habit.isActive ? "bg-indigo-600" : "bg-slate-200"
                  )}
                >
                  <motion.div 
                    animate={{ x: habit.isActive ? 16 : 4 }}
                    className="w-2 h-2 bg-white rounded-full absolute top-1"
                  />
                </button>
                <button 
                  onClick={() => setActiveMenu(activeMenu === habit.id ? null : habit.id)}
                  className="p-1 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Habit Menu */}
              <AnimatePresence>
                {activeMenu === habit.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -5 }}
                      className="absolute right-0 top-12 bg-white rounded-[15px] shadow-xl border border-slate-50 p-2 z-40 w-36"
                    >
                      <button 
                        onClick={() => {
                          setEditingHabit(habit);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-[15px] hover:bg-slate-50 flex items-center gap-2 text-xs font-bold text-slate-600"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          setIsDeleting(habit.id);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-[15px] hover:bg-slate-50 flex items-center gap-2 text-xs font-bold text-red-500"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

        {habits.length === 0 && (
          <div className="flex justify-center py-10">
            <p className="text-slate-400 font-bold">No habits yet</p>
          </div>
        )}

        <div className="pt-4 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAddHabit}
            className="flex items-center gap-2 px-6 py-3 rounded-[15px] border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all"
          >
            <Plus size={18} />
            Add Habit
          </motion.button>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingHabit && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-[15px] sm:rounded-[15px] w-full max-w-md p-8 pt-10 pb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-extrabold text-slate-900">Edit Habit</h3>
                <button onClick={() => setEditingHabit(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-2">Habit Name</label>
                  <input 
                    type="text" 
                    value={editingHabit.name}
                    onChange={(e) => setEditingHabit({...editingHabit, name: e.target.value})}
                    className="w-full bg-slate-50 rounded-[15px] px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-2">Details (Optional)</label>
                  <textarea 
                    value={editingHabit.details || ''}
                    onChange={(e) => setEditingHabit({...editingHabit, details: e.target.value})}
                    className="w-full bg-slate-50 rounded-[15px] px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none resize-none min-h-[100px]"
                    placeholder="Add some notes about this habit..."
                  />
                </div>

                <div className="flex gap-4">
                  {(['daily', 'weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setEditingHabit({...editingHabit, frequency: freq})}
                      className={cn(
                        "flex-1 py-4 rounded-[15px] font-bold transition-all border-2",
                        editingHabit.frequency === freq 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-slate-100 text-slate-400 hover:border-indigo-100"
                      )}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={async () => {
                    await onUpdateHabit(editingHabit.id, editingHabit);
                    setEditingHabit(null);
                  }}
                  className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[15px] mt-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[15px] w-full max-w-sm p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={36} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Habit?</h3>
              <p className="text-slate-500 font-medium mb-8">This will permanently remove the habit and all its history.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-4 rounded-[15px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await onDeleteHabit(isDeleting);
                    setIsDeleting(null);
                  }}
                  className="flex-1 py-4 rounded-[15px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
