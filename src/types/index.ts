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

export interface Achievement {
  id: string;
  title: string;
  stageLabel: string; // e.g. "Stage 1 (20%)"
  stageOrder: number; // 1, 2, 3, 4, 5 (Strict serial order)
  prerequisiteId?: string; // Must unlock this badge first
  description: string;
  icon: string;
  color: string;
  requirement: number;
  type: 'percentage' | 'streak' | 'totalChecks' | 'perfectDay';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SprintConfig {
  projectName: string;
  startDate: string;
  totalDays: number;
  targetCompletionPct: number;
}

export interface UserProfileSettings {
  userName: string;
  voiceEnabled: boolean;
  voicePitch: number;
  voiceRate: number;
  customQuote?: string;
  remindersEnabled: boolean;
  reminderTimes: string[];
  antiCheatEnabled: boolean; // Anti-cheat strict discipline mode
  sprint: SprintConfig;
}
