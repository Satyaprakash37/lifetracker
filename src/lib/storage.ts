import { Habit, GameStats } from '@/types';
import { DEFAULT_HABITS, generateInitialLogs } from './initialData';

const STORAGE_KEY_HABITS = 'lifetracker_habits_v1';
const STORAGE_KEY_LOGS = 'lifetracker_logs_v1';
const STORAGE_KEY_STATS = 'lifetracker_stats_v1';

export class StorageService {
  // Check if browser environment
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
      // Initialize with default
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
      // Initialize with default exact mock data matching screenshot
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

  public resetToPhotoPreset(year: number, month: number): {
    habits: Habit[];
    logs: Record<string, boolean>;
    stats: GameStats;
  } {
    const habits = DEFAULT_HABITS;
    const logs = generateInitialLogs(year, month);
    const stats: GameStats = {
      xp: 690,
      level: 4,
      streak: 7,
      soundEnabled: true,
    };
    this.saveHabits(habits);
    this.saveLogs(logs);
    this.saveGameStats(stats);
    return { habits, logs, stats };
  }
}

export const storage = new StorageService();

