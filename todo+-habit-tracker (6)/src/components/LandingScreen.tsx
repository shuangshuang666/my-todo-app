import React from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingScreenProps {
  onContinueWithEmail: () => void;
  onContinueAsGuest: () => void;
}

export function LandingScreen({ onContinueWithEmail, onContinueAsGuest }: LandingScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Hero Section with Mountain Aesthetic */}
      <div className="relative h-72 w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://raw.githubusercontent.com/shuangshuang666/shuangshuang666.github.io/main/src/assets/bgimgtodolanding.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/20" />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-black tracking-tight drop-shadow-lg mb-1">Build habits.</h1>
            <h1 className="text-4xl font-black tracking-tight drop-shadow-lg">Build yourself.</h1>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-5 pt-8 pb-10 flex flex-col">
        <div className="text-center mb-8">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src="https://raw.githubusercontent.com/shuangshuang666/shuangshuang666.github.io/main/src/assets/todo%2B.png"
            alt="Todo+"
            className="h-10 mx-auto mb-1 object-contain"
          />
          <p className="text-gray-600 font-medium text-base">Build habits that actually stick</p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3.5 rounded-[20px] border border-gray-100 bg-gray-50 flex items-center gap-3 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Track daily habits easily</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-3.5 rounded-[20px] border border-gray-100 bg-gray-50 flex items-center gap-3 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Improve consistency with data</p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onContinueWithEmail}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-[20px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 text-sm"
          >
            <Mail size={18} />
            Continue with Email
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onContinueAsGuest}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3.5 px-6 rounded-[20px] transition-all text-sm"
          >
            Continue as Guest
          </motion.button>

          <p className="text-center text-[10px] text-gray-400 mt-6 px-4">
            By continuing, you agree to our <span className="text-indigo-500 cursor-pointer underline">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
