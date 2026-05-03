import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Mail, Camera, Save, CheckCircle2, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface ProfileDetailsScreenProps {
  user: UserProfile;
  onBack: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

const AVATARS = [
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Aiden',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Aleksandra',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Aria',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Caleb',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Callie',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Izzy'
];

export function ProfileDetailsScreen({ user, onBack, onSave }: ProfileDetailsScreenProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || AVATARS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorStatus(null);
    try {
      await onSave({ displayName, photoURL });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile", error);
      setErrorStatus(error instanceof Error ? error.message : "Failed to save profile. Please try a smaller image.");
    } finally {
      setIsSaving(false);
    }
  };

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Use JPEG with 0.7 quality to ensure small file size
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setPhotoURL(compressed);
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges = displayName !== (user.displayName || '') || photoURL !== (user.photoURL || AVATARS[0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-md mx-auto p-4 pb-12 relative overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-xl font-extrabold text-slate-900">Profile Details</h2>
      </div>

      <div className="flex-1 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white cursor-pointer"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            >
              <img 
                src={photoURL} 
                alt="Profile" 
                className="w-full h-full object-cover block mx-auto"
              />
            </motion.div>
            <button 
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 transition-all"
            >
              {showAvatarPicker ? <ChevronUp size={16} /> : <Camera size={16} />}
            </button>
          </div>
          
          <AnimatePresence>
            {showAvatarPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full mt-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Choose Avatar</h4>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-indigo-600 text-[11px] font-bold hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-xl"
                  >
                    <Upload size={14} />
                    Upload Photo
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => {
                        setPhotoURL(avatar);
                        setShowAvatarPicker(false);
                      }}
                      className={cn(
                        "w-12 h-12 rounded-full overflow-hidden border-2 transition-all p-0.5",
                        photoURL === avatar ? "border-indigo-600 scale-110 shadow-md bg-indigo-50" : "border-transparent opacity-60 hover:opacity-100 hover:bg-slate-50"
                      )}
                    >
                      <img src={avatar} alt="Avatar option" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">Profile Picture</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 ml-2 flex items-center gap-2">
              <User size={14} className="text-indigo-500" />
              Full Name
            </label>
            <div className="bg-white rounded-[20px] p-3.5 shadow-sm border border-slate-50 focus-within:border-indigo-200 transition-colors">
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent border-none outline-none font-medium text-slate-700 text-[15px]"
              />
            </div>
          </div>

          <div className="space-y-1.5 opacity-60">
            <label className="text-[13px] font-bold text-slate-800 ml-2 flex items-center gap-2">
              <Mail size={14} className="text-indigo-500" />
              Email Address
            </label>
            <div className="bg-slate-50 rounded-[20px] p-3.5 border border-slate-100 italic">
              <input 
                type="email" 
                value={user.email || 'guest@todo-plus.app'} 
                readOnly
                className="w-full bg-transparent border-none outline-none font-medium text-slate-400 cursor-not-allowed text-[15px]"
              />
            </div>
            <p className="text-[9px] text-slate-400 font-bold ml-2 uppercase">Email cannot be changed manually</p>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="bg-indigo-50 rounded-[20px] p-5 border border-indigo-100">
           <h4 className="text-[13px] font-bold text-indigo-900 mb-4">Account Status</h4>
           <div className="space-y-3">
              <div className="flex justify-between items-center text-[13px]">
                 <span className="text-slate-500 font-medium">Account Type</span>
                 <span className="text-indigo-600 font-bold uppercase text-[11px]">{user.isAnonymous ? 'Guest' : 'Premium Member'}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                 <span className="text-slate-500 font-medium">Member Since</span>
                <span className="text-slate-700 font-bold">May 2026</span>
              </div>
           </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="w-full bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold py-5 px-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-sm"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-24 left-6 right-6 bg-green-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg z-50"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold">Profile updated successfully!</span>
          </motion.div>
        )}

        {errorStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-24 left-6 right-6 bg-red-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg z-50"
          >
            <div className="flex-1">
              <p className="font-bold text-sm">Save Failed</p>
              <p className="text-[10px] opacity-90 line-clamp-2">{errorStatus}</p>
            </div>
            <button onClick={() => setErrorStatus(null)} className="p-1 hover:bg-white/20 rounded-lg">
              <ChevronDown size={18} className="rotate-180" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
