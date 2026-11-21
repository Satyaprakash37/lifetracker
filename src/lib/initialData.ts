import { Habit, HabitLog } from '@/types';

export const DEFAULT_HABITS: Habit[] = [
  { id: 'h-1', title: '7-8 Hours Sleep', category: 'Health', icon: '😴', color: '#6366f1', order: 0 },
  { id: 'h-2', title: 'Morning Hydration (1L)', category: 'Health', icon: '💧', color: '#06b6d4', order: 1 },
  { id: 'h-3', title: '45m Workout / Gym', category: 'Fitness', icon: '🏋️', color: '#ef4444', order: 2 },
  { id: 'h-4', title: 'Read 15 Pages', category: 'Mindset', icon: '📖', color: '#f59e0b', order: 3 },
  { id: 'h-5', title: '10m Meditation / Breathwork', category: 'Mindset', icon: '🧘', color: '#10b981', order: 4 },
  { id: 'h-6', title: '2h+ Deep Focused Work', category: 'Productivity', icon: '💻', color: '#8b5cf6', order: 5 },
  { id: 'h-7', title: 'Clean Whole Food Diet', category: 'Health', icon: '🥗', color: '#84cc16', order: 6 },
  { id: 'h-8', title: 'Morning Sunlight / Walk', category: 'Health', icon: '☀️', color: '#eab308', order: 7 },
  { id: 'h-9', title: 'Cold Shower Finish', category: 'Routine', icon: '🚿', color: '#3b82f6', order: 8 },
  { id: 'h-10', title: 'Daily Journal / Gratitude', category: 'Mindset', icon: '✍️', color: '#ec4899', order: 9 },
  { id: 'h-11', title: 'No Phone 1h Before Bed', category: 'Routine', icon: '📵', color: '#64748b', order: 10 },
  { id: 'h-12', title: 'Plan Tomorrow Priorities', category: 'Productivity', icon: '🎯', color: '#14b8a6', order: 11 },
];

/**
 * Generates initial check logs that match the exact screenshot:
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
 * Day 8: 8/12
 * Day 9: 7/12
 * Day 10: 5/12
 * Day 11+: 0
 */
export function generateInitialLogs(year: number, month: number): Record<string, boolean> {
  const logs: Record<string, boolean> = {};
  const monthStr = String(month).padStart(2, '0');

  // Daily target counts matching screenshot
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

