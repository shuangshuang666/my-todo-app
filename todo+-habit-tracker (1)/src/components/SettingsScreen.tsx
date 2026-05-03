import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Shield, CircleHelp, Trash2, ChevronRight, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  userName: string;
  remindersEnabled: boolean;
  onToggleReminders: (enabled: boolean) => void;
  dailyReminderTime?: string;
  onUpdateDailyReminderTime: (time: string) => void;
}

export function SettingsScreen({ 
  onBack, 
  onLogout, 
  onNavigateToProfile, 
  userName,
  remindersEnabled,
  onToggleReminders,
  dailyReminderTime,
  onUpdateDailyReminderTime
}: SettingsScreenProps) {
  const SettingItem = ({ icon: Icon, label, value, color, onClick }: { icon: any, label: string, value?: string, color: string, onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-[20px] p-3.5 flex items-center justify-between border border-slate-50 hover:border-indigo-100 transition-colors cursor-pointer group shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-colors", color)}>
          <Icon size={18} />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-[13px]">{label}</p>
          {value && <p className="text-[10px] text-slate-400 font-medium">{value}</p>}
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto p-4 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-xl font-extrabold text-slate-900">Settings</h2>
      </div>

      <div className="space-y-8 flex-1">
        {/* Profile Section */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Account</h3>
          <div className="space-y-3">
             <SettingItem 
               icon={User} 
               label="Profile Details" 
               value={userName}
               color="bg-indigo-50 text-indigo-600"
               onClick={onNavigateToProfile}
             />
             <SettingItem 
               icon={Shield} 
               label="Privacy & Security" 
               color="bg-blue-50 text-blue-500" 
             />
          </div>
        </div>

        {/* Habits Logic */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Preferences</h3>
          <div className="space-y-3">
             <div className="bg-white rounded-[20px] p-3.5 flex items-center justify-between border border-slate-50 shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[13px]">Daily Summary Nudge</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[180px]">
                      A gentle safety net reminder if you have any unfinished habits left.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => onToggleReminders(!remindersEnabled)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      remindersEnabled ? "bg-indigo-600" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: remindersEnabled ? 22 : 4 }}
                      className="w-3 h-3 bg-white rounded-full absolute top-1"
                    />
                  </button>
                  {remindersEnabled && (
                    <input 
                      type="time"
                      value={dailyReminderTime || '17:00'}
                      onChange={(e) => onUpdateDailyReminderTime(e.target.value)}
                      className="bg-indigo-50 px-2 py-0.5 rounded-lg text-indigo-700 font-bold text-[10px] outline-none border border-transparent focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                    />
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Support</h3>
          <div className="space-y-3">
             <SettingItem 
               icon={CircleHelp} 
               label="Help Center" 
               color="bg-green-50 text-green-500" 
             />
          </div>
        </div>

        {/* Logout/Danger */}
        <div className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full py-3.5 rounded-[20px] border-2 border-slate-100 text-slate-400 font-bold text-sm hover:bg-slate-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 mb-3"
          >
            Logout
          </button>
          <button className="w-full py-3 text-slate-300 font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:text-red-400 transition-colors">
            <Trash2 size={12} />
            Delete Account
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-1">
        <img 
          src="https://raw.githubusercontent.com/shuangshuang666/shuangshuang666.github.io/main/src/assets/todo%2B.png" 
          alt="Todo+" 
          className="h-6 object-contain opacity-50"
        />
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">v1.0.0</p>
      </div>
    </div>
  );
}
