import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { cn, getUserAvatarUrl } from '../lib/utils';
import { HabitFrequency } from '../types';

interface AddHabitScreenProps {
  onBack: () => void;
  onCreate: (habit: { name: string, frequency: HabitFrequency, icon: string, details?: string, reminderTime?: string }) => void;
  userName: string;
  photoURL?: string;
}

const CATEGORIES = [
  { name: 'Meditation', icon: '🧘', color: 'indigo' },
  { name: 'Reading', icon: '📖', color: 'blue' },
  { name: 'Running', icon: '🏃', color: 'orange' },
  { name: 'Healthy Eating', icon: '🍎', color: 'red' },
];

export function AddHabitScreen({ onBack, onCreate, userName, photoURL }: AddHabitScreenProps) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto pb-8 p-4">
      {/* Back Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden">
           <img src={photoURL || getUserAvatarUrl(userName)} alt="Me" className="bg-indigo-50 w-full h-full object-cover" />
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Create New Habit</h2>
      <p className="text-slate-400 font-medium text-sm mb-8">Build one habit at a time</p>

      {/* Form Fields */}
      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-[13px] font-bold text-slate-800 mb-2 ml-2">Habit Name</label>
          <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50">
             <input 
               type="text" 
               placeholder="e.g. Drink 2L of water"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full bg-transparent border-none outline-none text-base font-medium text-slate-700 placeholder:text-slate-300"
             />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-slate-800 mb-2 ml-2">Details (Optional)</label>
          <div className="bg-white rounded-[15px] p-4 shadow-sm border border-slate-50">
             <textarea 
               placeholder="Why are you doing this habit?"
               value={details}
               onChange={(e) => setDetails(e.target.value)}
               className="w-full bg-transparent border-none outline-none text-base font-medium text-slate-700 placeholder:text-slate-300 resize-none min-h-[80px]"
             />
          </div>
        </div>

        <div>
           <label className="block text-[13px] font-bold text-slate-800 mb-3 ml-2">Frequency</label>
           <div className="bg-slate-100 p-1 rounded-[15px] flex">
              <button 
                onClick={() => setFrequency('daily')}
                className={cn(
                  "flex-1 py-2 text-[13px] font-bold rounded-[15px] transition-all",
                  frequency === 'daily' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                )}
              >
                Daily
              </button>
              <button 
                onClick={() => setFrequency('weekly')}
                className={cn(
                  "flex-1 py-2 text-[13px] font-bold rounded-[15px] transition-all",
                  frequency === 'weekly' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                )}
              >
                Weekly
              </button>
           </div>
        </div>


        {/* Reminder Settings */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-slate-50 space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Bell size={18} />
                 </div>
                 <div>
                    <p className="font-bold text-slate-800 text-[13px]">Set reminder</p>
                    <p className="text-[9px] text-slate-400 font-bold">Get notified to stay on track</p>
                 </div>
              </div>
              <button 
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  reminderEnabled ? "bg-indigo-600" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-3 h-3 bg-white rounded-full absolute top-1 transition-all",
                  reminderEnabled ? "right-1" : "left-1"
                )} />
              </button>
           </div>

           <div className="h-px bg-slate-50 w-full" />

           <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold text-[13px]">Reminder time</span>
              <div className="relative">
                <input 
                  type="time" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-indigo-50 px-3 py-1.5 rounded-[15px] text-indigo-700 font-bold text-xs outline-none border border-transparent focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                />
              </div>
           </div>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setName(cat.name)}
              className="bg-white border border-slate-100 rounded-[15px] px-5 py-2.5 flex items-center gap-2 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <div className="mt-10">
        <button
          onClick={() => onCreate({ 
            name, 
            frequency, 
            icon: 'flame', 
            details: details || undefined,
            reminderTime: reminderEnabled ? reminderTime : undefined
          })}
          disabled={!name}
          className="w-full bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold py-5 px-6 rounded-[15px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-sm"
        >
          <Sparkles size={20} />
          Create Habit
        </button>
      </div>
    </div>
  );
}
