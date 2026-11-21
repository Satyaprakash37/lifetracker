import { Achievement } from '@/types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // 1. Stage 1: 20% Milestone (Specifically requested by user)
  {
    id: 'stage_20',
    title: 'Ignition Spark',
    stageLabel: 'Stage 1 (20%)',
    description: 'Broke past 20% overall consistency! Momentum initiated.',
    icon: '🥉',
    color: 'from-amber-600 to-yellow-500',
    requirement: 20,
    type: 'percentage',
    unlocked: false,
  },
  // 2. Stage 2: 40% Milestone
  {
    id: 'stage_40',
    title: 'Momentum Builder',
    stageLabel: 'Stage 2 (40%)',
    description: 'Reached 40% protocol completion! Your daily habits are locking in.',
    icon: '🥈',
    color: 'from-slate-400 to-slate-200',
    requirement: 40,
    type: 'percentage',
    unlocked: false,
  },
  // 3. Stage 3: 60% Milestone
  {
    id: 'stage_60',
    title: 'Discipline Titan',
    stageLabel: 'Stage 3 (60%)',
    description: 'Over 60% consistency achieved! More than halfway to total mastery.',
    icon: '🥇',
    color: 'from-amber-500 to-yellow-400',
    requirement: 60,
    type: 'percentage',
    unlocked: false,
  },
  // 4. Stage 4: 80% Milestone
  {
    id: 'stage_80',
    title: 'Elite Performer',
    stageLabel: 'Stage 4 (80%)',
    description: 'Cruising past 80%! You are operating in the top tier of consistency.',
    icon: '💎',
    color: 'from-cyan-400 to-blue-500',
    requirement: 80,
    type: 'percentage',
    unlocked: false,
  },
  // 5. Stage 5: 100% Milestone
  {
    id: 'stage_100',
    title: 'Unstoppable Legend',
    stageLabel: 'Stage 5 (100%)',
    description: 'Flawless 100% completion! Absolute discipline mastery achieved.',
    icon: '👑',
    color: 'from-yellow-400 via-amber-300 to-yellow-500',
    requirement: 100,
    type: 'percentage',
    unlocked: false,
  },
  // Streak Badges
  {
    id: 'streak_3',
    title: '3-Day Fire',
    stageLabel: 'Streak Badge',
    description: 'Maintained 3 consecutive days of discipline without dropping.',
    icon: '🔥',
    color: 'from-orange-500 to-red-500',
    requirement: 3,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'streak_7',
    title: '7-Day Iron Will',
    stageLabel: 'Streak Badge',
    description: 'A full 7-day week of unwavering consistency completed.',
    icon: '⚡',
    color: 'from-indigo-500 to-purple-600',
    requirement: 7,
    type: 'streak',
    unlocked: false,
  },
  // Perfect Day Badge
  {
    id: 'perfect_day',
    title: 'Flawless Day',
    stageLabel: 'Daily Master',
    description: 'Completed 100% of all habits on a single calendar day.',
    icon: '🌟',
    color: 'from-emerald-400 to-teal-500',
    requirement: 100,
    type: 'perfectDay',
    unlocked: false,
  },
  // Century Club (100 total checks)
  {
    id: 'century_100',
    title: 'Century Club',
    stageLabel: 'Volume Badge',
    description: 'Checked off 100 total habit tasks this month.',
    icon: '🎯',
    color: 'from-rose-500 to-pink-600',
    requirement: 100,
    type: 'totalChecks',
    unlocked: false,
  },
];

const STORAGE_KEY_ACHIEVEMENTS = 'lifetracker_achievements_v1';

export class AchievementService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public getAchievements(): Achievement[] {
    if (!this.isBrowser()) return INITIAL_ACHIEVEMENTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
      if (data) return JSON.parse(data);
      this.saveAchievements(INITIAL_ACHIEVEMENTS);
      return INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public saveAchievements(list: Achievement[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save achievements', e);
    }
  }

  // Evaluates state and returns newly unlocked badges (if any)
  public checkUnlocks(
    overallPercentage: number,
    streak: number,
    totalChecks: number,
    hasAnyPerfectDay: boolean
  ): { updatedList: Achievement[]; newlyUnlocked: Achievement[] } {
    const currentList = this.getAchievements();
    const newlyUnlocked: Achievement[] = [];

    const updatedList = currentList.map((item) => {
      if (item.unlocked) return item;

      let shouldUnlock = false;

      if (item.type === 'percentage') {
        shouldUnlock = overallPercentage >= item.requirement;
      } else if (item.type === 'streak') {
        shouldUnlock = streak >= item.requirement;
      } else if (item.type === 'totalChecks') {
        shouldUnlock = totalChecks >= item.requirement;
      } else if (item.type === 'perfectDay') {
        shouldUnlock = hasAnyPerfectDay;
      }

      if (shouldUnlock) {
        const unlockedItem: Achievement = {
          ...item,
          unlocked: true,
          unlockedAt: new Date().toLocaleDateString(),
        };
        newlyUnlocked.push(unlockedItem);
        return unlockedItem;
      }

      return item;
    });

    if (newlyUnlocked.length > 0) {
      this.saveAchievements(updatedList);
    }

    return { updatedList, newlyUnlocked };
  }
}

export const achievementService = new AchievementService();
