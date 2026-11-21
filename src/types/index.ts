export type HabitCategory = 'Project' | 'Fitness' | 'Health' | 'Study' | 'Mindset' | 'Routine' | 'General';

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
  dayOfWeek: string;
  weekIndex: number; // 0, 1, 2, 3
  completedCount: number;
  totalHabits: number;
  percentage: number;
}

export interface WeekStats {
  weekIndex: number;
  title: string;
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

export interface SprintConfig {
  projectName: string;
  startDate: string; // YYYY-MM-DD
  totalDays: number; // e.g. 30 days for 1 month sprint
  targetCompletionPct: number;
}

export interface UserProfileSettings {
  userName: string; // e.g. "Satya"
  voiceEnabled: boolean;
  voicePitch: number;
  voiceRate: number;
  customQuote?: string;
  remindersEnabled: boolean;
  reminderTimes: string[]; // e.g. ['09:00', '14:00', '21:00']
  sprint: SprintConfig;
}
