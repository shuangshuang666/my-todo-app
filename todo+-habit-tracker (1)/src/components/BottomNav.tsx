import React from 'react';
import { Calendar, LineChart, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: 'today' | 'stats' | 'notifications' | 'profile';
  onTabChange: (tab: 'today' | 'stats' | 'notifications' | 'profile') => void;
  hasNotifications?: boolean;
}

export function BottomNav({ activeTab, onTabChange, hasNotifications }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-50 px-6 py-3 z-50 rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onTabChange('today')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            activeTab === 'today' ? "bg-indigo-600 text-white" : "text-slate-400 group-hover:bg-slate-50"
          )}>
            <Calendar size={20} />
          </div>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider",
            activeTab === 'today' ? "text-indigo-600" : "text-slate-400"
          )}>Today</span>
        </button>

        <button 
          onClick={() => onTabChange('stats')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            activeTab === 'stats' ? "bg-indigo-600 text-white" : "text-slate-400 group-hover:bg-slate-50"
          )}>
            <LineChart size={20} />
          </div>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider",
            activeTab === 'stats' ? "text-indigo-600" : "text-slate-400"
          )}>Stats</span>
        </button>

        <button 
          onClick={() => onTabChange('notifications')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all relative",
            activeTab === 'notifications' ? "bg-indigo-600 text-white" : "text-slate-400 group-hover:bg-slate-50"
          )}>
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/20" />
            )}
            <div className="relative">
              <Calendar size={20} className="hidden" /> {/* Hidden to keep spacing if needed, but using Bell */}
              <LineChart size={20} className="hidden" />
              <User size={20} className="hidden" />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
          </div>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider",
            activeTab === 'notifications' ? "text-indigo-600" : "text-slate-400"
          )}>Inbox</span>
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            activeTab === 'profile' ? "bg-indigo-600 text-white" : "text-slate-400 group-hover:bg-slate-50"
          )}>
            <User size={20} />
          </div>
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider",
            activeTab === 'profile' ? "text-indigo-600" : "text-slate-400"
          )}>Profile</span>
        </button>
      </div>
    </div>
  );
}
