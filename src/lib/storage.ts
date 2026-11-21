import { Habit, GameStats, UserProfileSettings } from '@/types';
import { DEFAULT_HABITS, generateInitialLogs } from './initialData';

const STORAGE_KEY_HABITS = 'lifetracker_habits_v2';
const STORAGE_KEY_LOGS = 'lifetracker_logs_v2';
const STORAGE_KEY_STATS = 'lifetracker_stats_v2';
const STORAGE_KEY_PROFILE = 'lifetracker_profile_v2';

export const DEFAULT_PROFILE: UserProfileSettings = {
  userName: 'Satya',
  voiceEnabled: true,
  voicePitch: 1.05,
  voiceRate: 1.0,
  customQuote: 'Good {name}, nice! Keep pushing your limits!',
  remindersEnabled: true,
  reminderTimes: ['09:00', '14:00', '21:00'],
  antiCheatEnabled: true,
  sprint: {
    projectName: '1-Month Web Application Launch',
    startDate: '2026-11-01',
    totalDays: 30,
    targetCompletionPct: 85,
  },
};

export class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getHabits(): Habit[] {
    if (!this.isBrowser()) return DEFAULT_HABITS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_HABITS);
      if (data) {
        return JSON.parse(data);
      }
      this.saveHabits(DEFAULT_HABITS);
      return DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  }

  public saveHabits(habits: Habit[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage', e);
    }
  }

  public getLogs(year: number, month: number): Record<string, boolean> {
    if (!this.isBrowser()) return generateInitialLogs(year, month);
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      if (data) {
        return JSON.parse(data);
      }
      const initialLogs = generateInitialLogs(year, month);
      this.saveLogs(initialLogs);
      return initialLogs;
    } catch {
      return generateInitialLogs(year, month);
    }
  }

  public saveLogs(logs: Record<string, boolean>): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }

  public getGameStats(): GameStats {
    const defaultStats: GameStats = {
      xp: 690,
      level: 4,
      streak: 7,
      soundEnabled: true,
    };
    if (!this.isBrowser()) return defaultStats;
    try {
      const data = localStorage.getItem(STORAGE_KEY_STATS);
      if (data) return JSON.parse(data);
      this.saveGameStats(defaultStats);
      return defaultStats;
    } catch {
      return defaultStats;
    }
  }

  public saveGameStats(stats: GameStats): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save game stats', e);
    }
  }

  public getProfile(): UserProfileSettings {
    if (!this.isBrowser()) return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (data) return JSON.parse(data);
      this.saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public saveProfile(profile: UserProfileSettings): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile settings', e);
    }
  }

  public resetToPhotoPreset(year: number, month: number): {
    habits: Habit[];
    logs: Record<string, boolean>;
    stats: GameStats;
    profile: UserProfileSettings;
  } {
    const habits = DEFAULT_HABITS;
    const logs = generateInitialLogs(year, month);
    const stats: GameStats = {
      xp: 690,
      level: 4,
      streak: 7,
      soundEnabled: true,
    };
    const profile = DEFAULT_PROFILE;
    this.saveHabits(habits);
    this.saveLogs(logs);
    this.saveGameStats(stats);
    this.saveProfile(profile);
    return { habits, logs, stats, profile };
  }
}

export const storage = new StorageService();
