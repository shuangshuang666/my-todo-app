import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MoreVertical, Edit2, Trash2, X, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { getHabitIcon } from '../lib/habitUtils';
import { Habit, HistoryRecord } from '../types';

interface AllHabitsScreenProps {
  habits: Habit[];
  records: HistoryRecord[];
  onBack: () => void;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
}

export function AllHabitsScreen({ habits, records, onBack, onDeleteHabit, onUpdateHabit }: AllHabitsScreenProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleToggleActive = (habit: Habit) => {
    onUpdateHabit(habit.id, { isActive: !habit.isActive });
  };

  const menuItems = (habit: Habit) => [
    { 
      label: 'Edit', 
      icon: Edit2, 
      color: 'text-slate-600',
      onClick: () => {
        setEditingHabit(habit);
        setActiveMenu(null);
      }
    },
    { 
      label: 'Delete', 
      icon: Trash2, 
      color: 'text-red-500',
      onClick: () => {
        setIsDeleting(habit.id);
        setActiveMenu(null);
      }
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto p-4 pb-12 relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-xl font-extrabold text-slate-900">All Habits</h2>
      </div>

      <div className="space-y-4 flex-1">
        {habits.map((habit) => (
          <div key={habit.id} className="relative">
            <div className={cn(
              "bg-white rounded-[20px] p-4 shadow-sm border transition-all",
              habit.isActive ? "border-slate-50" : "border-slate-100 opacity-60"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-[20px] flex items-center justify-center transition-colors",
                    habit.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                  )}>
                    {getHabitIcon(habit.icon, habit.name, 20)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-[13px]">{habit.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {habit.frequency}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className={cn(
                        "text-[9px] font-bold uppercase",
                        habit.isActive ? "text-green-500" : "text-slate-400"
                      )}>
                        {habit.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {habit.details && (
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate">
                        {habit.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleToggleActive(habit)}
                    className={cn(
                      "w-9 h-5 rounded-full transition-colors relative",
                      habit.isActive ? "bg-indigo-600" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: habit.isActive ? 18 : 4 }}
                      className="w-3 h-3 bg-white rounded-full absolute top-1"
                    />
                  </button>
                  <button 
                    onClick={() => setActiveMenu(activeMenu === habit.id ? null : habit.id)}
                    className="p-1 px-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeMenu === habit.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setActiveMenu(null)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-14 w-40 bg-white rounded-[20px] shadow-xl border border-slate-50 p-2 z-40"
                    >
                      {menuItems(habit).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={item.onClick}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-[20px] hover:bg-slate-50 transition-colors font-bold text-sm",
                            item.color
                          )}
                        >
                          <item.icon size={16} />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-400">No habits found</h3>
          </div>
        )}
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
                    className="w-full bg-slate-50 rounded-[15px] px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                        "flex-1 py-4 rounded-[20px] font-bold transition-all border-2",
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
              className="bg-white rounded-[20px] w-full max-w-sm p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={36} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Habit?</h3>
              <p className="text-slate-500 font-medium mb-8">This will permanently remove the habit and all its history. This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-4 rounded-[20px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await onDeleteHabit(isDeleting);
                    setIsDeleting(null);
                  }}
                  className="flex-1 py-4 rounded-[20px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
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
