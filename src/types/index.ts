export type HabitCategory = 'Health' | 'Fitness' | 'Mindset' | 'Productivity' | 'Routine' | 'General';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  color?: string;
  order: number;
  createdAt?: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface DayStats {
  dayNumber: number;
  dateString: string;
  dayOfWeek: string; // 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S'
  weekIndex: number; // 0, 1, 2, 3
  completedCount: number;
  totalHabits: number;
  percentage: number;
}

export interface WeekStats {
  weekIndex: number; // 0 = Week 1, 1 = Week 2, 2 = Week 3, 3 = Week 4
  title: string; // "week 1", "week 2", "week 3", "week 4"
  startDay: number;
  endDay: number;
  completedChecks: number;
  totalChecks: number;
  percentage: number;
}

export interface GameStats {
  xp: number;
  level: number;
  streak: number;
  soundEnabled: boolean;
}

