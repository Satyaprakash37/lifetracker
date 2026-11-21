import { Habit } from '@/types';

export const DEFAULT_HABITS: Habit[] = [
  // 💻 Project & Work
  { id: 'h-1', title: '1-Month Project Coding (2h+)', category: 'Project', icon: '💻', color: '#6366f1', order: 0 },
  { id: 'h-2', title: 'Feature Commits & Testing', category: 'Project', icon: '⚡', color: '#8b5cf6', order: 1 },
  
  // 🏋️ Gym & Fitness
  { id: 'h-3', title: '45m Gym Workout / Strength', category: 'Fitness', icon: '🏋️', color: '#ef4444', order: 2 },
  { id: 'h-4', title: '10,000 Daily Steps / Cardio', category: 'Fitness', icon: '🏃', color: '#f97316', order: 3 },

  // 📚 Study & Learning
  { id: 'h-5', title: '1h Deep Study & Research', category: 'Study', icon: '📚', color: '#3b82f6', order: 4 },
  { id: 'h-6', title: 'Read 20 Pages of Book', category: 'Study', icon: '📖', color: '#f59e0b', order: 5 },

  // 🥗 Health & Nutrition
  { id: 'h-7', title: '7-8 Hours Sleep Recovery', category: 'Health', icon: '😴', color: '#10b981', order: 6 },
  { id: 'h-8', title: '2.5L Clean Hydration', category: 'Health', icon: '💧', color: '#06b6d4', order: 7 },
  { id: 'h-9', title: 'Clean Whole Food Nutrition', category: 'Health', icon: '🥗', color: '#84cc16', order: 8 },

  // 🧘 Mindset & Routine
  { id: 'h-10', title: '10m Meditation / Breathwork', category: 'Mindset', icon: '🧘', color: '#a855f7', order: 9 },
  { id: 'h-11', title: 'Morning Sunlight & Cold Shower', category: 'Routine', icon: '☀️', color: '#eab308', order: 10 },
  { id: 'h-12', title: 'Plan Tomorrow & Journaling', category: 'Routine', icon: '🎯', color: '#14b8a6', order: 11 },
];

/**
 * Generates initial check logs matching the exact numbers in the screenshot:
 * Day 1: 11/12 (92%)
 * Day 2: 12/12 (100%)
 * Day 3: 11/12 (92%)
 * Day 4: 7/12 (58%)
 * Day 5: 8/12 (67%)
 * Day 6: 12/12 (100%)
 * Day 7: 8/12 (67%)
 * -> Week 1 total: 69 / 84 = 82.1%
 * 
 * Week 2 total: 20 / 84 = 23.8%
 */
export function generateInitialLogs(year: number, month: number): Record<string, boolean> {
  const logs: Record<string, boolean> = {};
  const monthStr = String(month).padStart(2, '0');

  const dayCompletedCounts: Record<number, number> = {
    1: 11,
    2: 12,
    3: 11,
    4: 7,
    5: 8,
    6: 12,
    7: 8,
    8: 8,
    9: 7,
    10: 5,
  };

  for (let day = 1; day <= 31; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;
    const countToComplete = dayCompletedCounts[day] || 0;

    DEFAULT_HABITS.forEach((habit, idx) => {
      const isCompleted = idx < countToComplete;
      const key = `${habit.id}_${dateKey}`;
      logs[key] = isCompleted;
    });
  }

  return logs;
}
