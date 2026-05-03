import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, Sparkles } from 'lucide-react';

interface CongratulationsOverlayProps {
  onClose: () => void;
}

export function CongratulationsOverlay({ onClose }: CongratulationsOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-indigo-600 z-[100] flex flex-col items-center justify-center p-8 text-center text-white"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1 
        }}
        className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-8 relative"
      >
        <Trophy size={64} className="text-white" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles size={24} className="text-yellow-300 fill-yellow-300" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">You've Crushed It!</h2>
        <p className="text-indigo-100 text-lg font-medium max-w-[280px] mx-auto leading-relaxed">
          Every single habit for today is complete. You're becoming the best version of yourself.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 w-full max-w-xs"
      >
        <button
          onClick={onClose}
          className="w-full bg-white text-indigo-600 font-bold py-5 rounded-[20px] shadow-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 transition-colors uppercase tracking-widest text-sm"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <p className="mt-6 text-indigo-200 text-xs font-bold uppercase tracking-[0.2em]">See you tomorrow!</p>
      </motion.div>
    </motion.div>
  );
}
