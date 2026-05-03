export type HabitFrequency = 'daily' | 'weekly';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  lastVisit?: string;
  streakCount?: number;
  remindersEnabled?: boolean;
  dailyReminderTime?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  reminderTime?: string;
  userId: string;
  createdAt: string;
  isActive: boolean;
  details?: string;
}

export interface HistoryRecord {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  status: 'done' | 'pending';
  timestamp: string;
}

export interface WeeklyStats {
  date: string;
  completionRate: number;
}
