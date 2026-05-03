import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { Lock, Settings } from 'lucide-react';

import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile, Habit, HistoryRecord, HabitFrequency } from './types';
import { LandingScreen } from './components/LandingScreen';
import { Dashboard } from './components/Dashboard';
import { StatsScreen } from './components/StatsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AddHabitScreen } from './components/AddHabitScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProfileDetailsScreen } from './components/ProfileDetailsScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { BottomNav } from './components/BottomNav';
import { CongratulationsOverlay } from './components/CongratulationsOverlay';
import { getHabitsForToday } from './lib/habitUtils';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'notifications' | 'profile'>('today');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyRecords, setDailyRecords] = useState<HistoryRecord[]>([]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const habitsForToday = getHabitsForToday(habits, dailyRecords);
  const doneToday = dailyRecords.filter(r => r.date === today && r.status === 'done');
  const pendingCount = habitsForToday.length - doneToday.filter(r => habitsForToday.some(h => h.id === r.habitId)).length;
  const hasNotifications = pendingCount > 0;

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(profile);
        
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...profile,
            lastVisit: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.error("Error syncing user:", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setDailyRecords([]);
      return;
    }

    const habitsQuery = query(collection(db, 'habits'), where('userId', '==', user.uid));
    const unsubHabits = onSnapshot(habitsQuery, (snapshot) => {
      let habitList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
      
      // Guest 模式特殊逻辑：只显示今天创建的任务，实现“第二天需重新添加”的要求
      if (user.isAnonymous) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        habitList = habitList.filter(h => h.createdAt.startsWith(todayStr));
      }
      
      setHabits(habitList);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'habits'));

    const recordsQuery = query(
      collection(db, 'history'), 
      where('userId', '==', user.uid)
    );
    const unsubRecords = onSnapshot(recordsQuery, (snapshot) => {
      const recordList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryRecord));
      setDailyRecords(recordList);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'history'));

    return () => {
      unsubHabits();
      unsubRecords();
    };
  }, [user]);

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (e: any) {
      if (e.code === 'auth/admin-restricted-operation') {
        console.error("Guest login failed: Please enable 'Anonymous' provider in Firebase Console > Authentication > Sign-in method.");
        alert("Guest 模式尚未启用。请在 Firebase 控制台中启用 'Anonymous' 登录方式。");
      } else {
        console.error("Guest login failed", e);
      }
    }
  };

  const handleEmailLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') {
        console.log("User closed the login popup.");
      } else {
        console.error("Login failed", e);
        alert("登录失败, 请重试。");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveTab('today');
    setShowSettings(false);
    setShowProfileDetails(false);
  };

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      // Strip immutable or internal fields
      const { uid, ...validUpdates } = updates;
      await setDoc(doc(db, 'users', user.uid), validUpdates, { merge: true });
      setUser({ ...user, ...updates });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'users');
    }
  };

  const toggleHabitStatus = async (habitId: string, date?: string) => {
    if (!user) return;
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');
    const existing = dailyRecords.find(r => r.habitId === habitId && r.date === targetDate);

    try {
      if (existing) {
        await deleteDoc(doc(db, 'history', existing.id));
      } else {
        const recordId = `${user.uid}_${habitId}_${targetDate}`;
        const newRecord = {
          habitId,
          userId: user.uid,
          date: targetDate,
          status: 'done' as const,
          timestamp: new Date().toISOString()
        };
        await setDoc(doc(db, 'history', recordId), newRecord);

        // Check if this was the last habit for that day
        const updatedRecords = [...dailyRecords, { id: recordId, ...newRecord } as HistoryRecord];
        const habitsForDay = getHabitsForToday(habits, updatedRecords, targetDate);
        const doneOnDay = updatedRecords.filter(r => r.date === targetDate && r.status === 'done');
        const completedCount = doneOnDay.filter(r => habitsForDay.some(h => h.id === r.habitId)).length;
        
        const today = format(new Date(), 'yyyy-MM-dd');
        if (completedCount === habitsForDay.length && habitsForDay.length > 0 && targetDate === today) {
          setShowCongratulations(true);
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'history');
    }
  };

  const createHabit = async (habitData: { name: string, frequency: HabitFrequency, icon: string, details?: string, reminderTime?: string }) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'habits'), {
        ...habitData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        color: '#6366F1',
        isActive: true
      });
      setShowAddHabit(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'habits');
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      // Strip internal fields that shouldn't be saved as data fields
      const { id, userId, createdAt, ...validUpdates } = updates as any;
      await setDoc(doc(db, 'habits', habitId), validUpdates, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'habits');
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'habits');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <LandingScreen 
        onContinueAsGuest={handleGuestLogin} 
        onContinueWithEmail={handleEmailLogin} 
      />
    );
  }

  return (
    <div className="relative font-sans text-slate-900 bg-[#FBFBFF] min-h-screen">
      {showProfileDetails ? (
        <ProfileDetailsScreen 
          user={user}
          onBack={() => setShowProfileDetails(false)}
          onSave={handleProfileUpdate}
        />
      ) : showSettings ? (
        <SettingsScreen 
          userName={user.displayName || (user.isAnonymous ? 'Guest' : 'User')}
          remindersEnabled={user.remindersEnabled ?? true}
          dailyReminderTime={user.dailyReminderTime}
          onToggleReminders={(enabled) => handleProfileUpdate({ remindersEnabled: enabled })}
          onUpdateDailyReminderTime={(time) => handleProfileUpdate({ dailyReminderTime: time })}
          onBack={() => setShowSettings(false)}
          onLogout={handleLogout}
          onNavigateToProfile={() => setShowProfileDetails(true)}
        />
      ) : showAddHabit ? (
        <AddHabitScreen 
          userName={user.displayName || (user.isAnonymous ? 'Guest' : 'User')}
          photoURL={user.photoURL || undefined}
          onBack={() => setShowAddHabit(false)} 
          onCreate={createHabit} 
        />
      ) : (
        <>
          <div className="pb-24">
            {activeTab === 'today' && (
              <Dashboard 
                userName={user.displayName || (user.isAnonymous ? 'Guest' : 'User')} 
                photoURL={user.photoURL || undefined}
                habits={habits}
                records={dailyRecords}
                onToggleHabit={toggleHabitStatus}
                onAddHabit={() => setShowAddHabit(true)}
                onOpenSettings={() => setShowSettings(true)}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsScreen pendingCount={pendingCount} />
            )}

            {activeTab === 'stats' && (
              user.isAnonymous ? (
                <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-[#FBFBFF] max-w-md mx-auto">
                   <header className="absolute top-0 left-0 w-full px-6 pt-6 flex justify-end">
                      <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 hover:text-indigo-600">
                        <Settings size={22} />
                      </button>
                   </header>
                   <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                      <Lock size={48} />
                   </div>
                   <h2 className="text-2xl font-bold text-indigo-900 mb-4">Stats are for verified members</h2>
                   <p className="text-slate-500 mb-8 font-medium">Guest accounts don't track history for weekly reports. Sign up to unlock full insights!</p>
                   <button 
                    onClick={handleEmailLogin}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
                   >
                     Sign up with Google
                   </button>
                </div>
              ) : (
                <StatsScreen 
                  userName={user.displayName || (user.isAnonymous ? 'Guest' : 'User')}
                  photoURL={user.photoURL || undefined}
                  habits={habits}
                  records={dailyRecords}
                  onOpenSettings={() => setShowSettings(true)} 
                />
              )
            )}

            {activeTab === 'profile' && user && (
              <ProfileScreen 
                userName={user.displayName || (user.isAnonymous ? 'Guest' : 'User')} 
                photoURL={user.photoURL || undefined}
                habits={habits}
                records={dailyRecords}
                onOpenSettings={() => setShowSettings(true)}
                onUpdateHabit={updateHabit}
                onDeleteHabit={deleteHabit}
                onAddHabit={() => setShowAddHabit(true)}
              />
            )}
          </div>

          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            hasNotifications={hasNotifications}
          />
        </>
      )}

      {showCongratulations && (
        <CongratulationsOverlay onClose={() => setShowCongratulations(false)} />
      )}
    </div>
  );
}
