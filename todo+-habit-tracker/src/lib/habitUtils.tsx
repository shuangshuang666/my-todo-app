import React from 'react';
import { 
  Flame, Droplets, Moon, Footprints, BookOpen, 
  Dumbbell, Apple, Wind, Code, Music, 
  PenTool, Sparkles, Heart, Coffee, Bike 
} from 'lucide-react';
import { HistoryRecord, Habit } from '../types';

export const getHabitIcon = (iconName: string, habitName: string = '', size = 24) => {
  const name = habitName.toLowerCase();
  
  // High priority keyword matching
  if (name.includes('water') || name.includes('drink') || name.includes('hydrate')) return <Droplets size={size} />;
  if (name.includes('sleep') || name.includes('night') || name.includes('bed')) return <Moon size={size} />;
  if (name.includes('run') || name.includes('walk') || name.includes('step') || name.includes('foot')) return <Footprints size={size} />;
  if (name.includes('read') || name.includes('book') || name.includes('study') || name.includes('learn')) return <BookOpen size={size} />;
  if (name.includes('gym') || name.includes('workout') || name.includes('exercise') || name.includes('train') || name.includes('fit')) return <Dumbbell size={size} />;
  if (name.includes('eat') || name.includes('food') || name.includes('meal') || name.includes('fruit') || name.includes('healthy')) return <Apple size={size} />;
  if (name.includes('meditate') || name.includes('yoga') || name.includes('relax') || name.includes('mindful')) return <Wind size={size} />;
  if (name.includes('code') || name.includes('program') || name.includes('dev') || name.includes('coding')) return <Code size={size} />;
  if (name.includes('music') || name.includes('practice') || name.includes('play')) return <Music size={size} />;
  if (name.includes('write') || name.includes('journal') || name.includes('diary') || name.includes('note')) return <PenTool size={size} />;
  if (name.includes('clean') || name.includes('tidy') || name.includes('home')) return <Sparkles size={size} />;
  if (name.includes('heart') || name.includes('love') || name.includes('self-care')) return <Heart size={size} />;
  if (name.includes('coffee') || name.includes('tea') || name.includes('caffeine')) return <Coffee size={size} />;
  if (name.includes('bike') || name.includes('cycle') || name.includes('ride')) return <Bike size={size} />;

  // Explicit iconName mapping (from the icon field in state)
  switch (iconName) {
    case 'droplets': return <Droplets size={size} />;
    case 'moon': return <Moon size={size} />;
    case 'footprints': return <Footprints size={size} />;
    case 'book-open': return <BookOpen size={size} />;
    case 'dumbbell': return <Dumbbell size={size} />;
    case 'apple': return <Apple size={size} />;
    case 'wind': return <Wind size={size} />;
    case 'code': return <Code size={size} />;
    case 'music': return <Music size={size} />;
    case 'pen-tool': return <PenTool size={size} />;
    case 'sparkles': return <Sparkles size={size} />;
    case 'heart': return <Heart size={size} />;
    case 'coffee': return <Coffee size={size} />;
    case 'bike': return <Bike size={size} />;
    default: return <Flame size={size} />;
  }
};

export function calculateHabitStreak(habitId: string, records: HistoryRecord[]) {
  const habitRecords = records
    .filter(r => r.habitId === habitId && r.status === 'done')
    .map(r => r.date)
    .sort()
    .reverse();

  if (habitRecords.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  let currentCheckDate = habitRecords[0] === today ? today : (habitRecords[0] === yesterday ? yesterday : null);

  if (!currentCheckDate) return 0;

  for (let i = 0; i < habitRecords.length; i++) {
    const recordDate = habitRecords[i];
    
    // Check if this date is the current expected date in the streak
    if (recordDate === currentCheckDate) {
      streak++;
      // Move to the previous day
      const nextDate = new Date(currentCheckDate);
      nextDate.setDate(nextDate.getDate() - 1);
      currentCheckDate = nextDate.toISOString().split('T')[0];
    } else if (recordDate < currentCheckDate) {
      // Gap in streak
      break;
    }
  }

  return streak;
}

export function calculateConsistency(habits: Habit[], records: HistoryRecord[]) {
  if (habits.length === 0) return 0;
  
  let totalPossible = 0;
  let totalDone = 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  habits.forEach(habit => {
    const createDate = new Date(habit.createdAt);
    createDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.max(0, now.getTime() - createDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    if (habit.frequency === 'daily') {
      totalPossible += diffDays;
    } else {
      totalPossible += Math.max(1, Math.ceil(diffDays / 7));
    }
    
    totalDone += records.filter(r => r.habitId === habit.id && r.status === 'done').length;
  });

  if (totalPossible === 0) return 0;
  // Cap at 100% just in case of data inconsistencies
  return Math.min(100, Math.round((totalDone / totalPossible) * 100));
}

export function calculateWeeklyStats(habits: Habit[], records: HistoryRecord[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    
    const dayRecords = records.filter(r => r.date === dateStr && r.status === 'done');
    const completion = habits.length > 0 ? Math.round((dayRecords.length / habits.length) * 100) : 0;
    
    return { name: dayName, completion };
  });
}

export function calculateMonthlyStats(habits: Habit[], records: HistoryRecord[]) {
  // Simple version: last 4 weeks
  return Array.from({ length: 4 }).map((_, i) => {
    const weekName = `Week ${i + 1}`;
    // This is a simplification
    const weekRecords = records.filter(r => {
      const recordDate = new Date(r.date);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= (3 - i) * 7 && diffDays < (4 - i) * 7 && r.status === 'done';
    });
    
    const completion = habits.length > 0 ? Math.round((weekRecords.length / (habits.length * 7)) * 100) : 0;
    return { name: weekName, completion };
  });
}

/**
 * Returns true if the habit has any "done" record in the calendar week of the target date
 */
export function isHabitDoneThisWeek(habitId: string, records: HistoryRecord[], targetDate?: string) {
  const refDate = targetDate ? new Date(targetDate) : new Date();
  const day = refDate.getDay(); 
  const diff = refDate.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(refDate.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  const mondayStr = monday.toISOString().split('T')[0];
  const refDateStr = targetDate || new Date().toISOString().split('T')[0];
  
  return records.some(r => 
    r.habitId === habitId && 
    r.status === 'done' && 
    r.date >= mondayStr &&
    r.date <= refDateStr
  );
}

/**
 * Returns the list of habits that should be visible on the Today page for a specific date
 */
export function getHabitsForToday(habits: Habit[], records: HistoryRecord[], targetDate?: string) {
  const dateToUse = targetDate || new Date().toISOString().split('T')[0];
  const dateRecords = records.filter(r => r.date === dateToUse && r.status === 'done');

  return habits.filter(h => {
    if (!h.isActive) return false;
    // Check if habit was created after the target date
    if (new Date(h.createdAt).toISOString().split('T')[0] > dateToUse) return false;

    if (h.frequency === 'daily') return true;
    
    const isDoneOnDate = dateRecords.some(r => r.habitId === h.id);
    const isDoneInWeek = isHabitDoneThisWeek(h.id, records, dateToUse);
    
    return isDoneOnDate || !isDoneInWeek;
  });
}
