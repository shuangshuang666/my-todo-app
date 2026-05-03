import React from 'react';
import { motion } from 'motion/react';
import { Bell, Zap, Trophy, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface NotificationItemProps {
  icon: any;
  title: string;
  time: string;
  content: string;
  color: string;
  isNew?: boolean;
}

const NotificationItem = ({ icon: Icon, title, time, content, color, isNew }: NotificationItemProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-50 flex gap-4 relative overflow-hidden group"
  >
    {isNew && (
      <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-600 translate-x-4 -translate-y-4 rotate-45" />
    )}
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", color)}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-bold text-slate-800 text-[14px]">{title}</h4>
        <span className="text-[10px] font-bold text-slate-400">{time}</span>
      </div>
      <p className="text-[12px] text-slate-500 leading-relaxed">{content}</p>
    </div>
  </motion.div>
);

interface NotificationsScreenProps {
  pendingCount: number;
}

export function NotificationsScreen({ pendingCount }: NotificationsScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto p-6 pb-32">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Inbox</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 ml-0.5">Stay updated</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
           <Bell size={20} />
        </div>
      </header>

      <div className="space-y-4">
        <NotificationItem 
          icon={Zap}
          title="Getting Started"
          time="Recently"
          content="Welcome to your new habit journey. Each small action counts toward big changes."
          color="bg-orange-50 text-orange-500"
          isNew={true}
        />
      </div>

      <div className="mt-12 flex flex-col items-center">
        <div className="w-16 h-1 bg-slate-100 rounded-full mb-6" />
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">End of notifications</p>
      </div>
    </div>
  );
}
