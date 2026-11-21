import { Achievement } from '@/types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // 1. Stage 1: 20% Milestone (Strictly Order 1)
  {
    id: 'stage_20',
    title: 'Ignition Spark',
    stageLabel: 'Stage 1 (20%)',
    stageOrder: 1,
    description: 'Broke past 20% overall consistency! Momentum initiated.',
    icon: '🥉',
    color: 'from-amber-600 to-yellow-500',
    requirement: 20,
    type: 'percentage',
    unlocked: false,
  },
  // 2. Stage 2: 40% Milestone (Prerequisite: Stage 1)
  {
    id: 'stage_40',
    title: 'Momentum Builder',
    stageLabel: 'Stage 2 (40%)',
    stageOrder: 2,
    prerequisiteId: 'stage_20',
    description: 'Reached 40% protocol completion! Prerequisite: Stage 1 must be completed.',
    icon: '🥈',
    color: 'from-slate-400 to-slate-200',
    requirement: 40,
    type: 'percentage',
    unlocked: false,
  },
  // 3. Stage 3: 60% Milestone (Prerequisite: Stage 2)
  {
    id: 'stage_60',
    title: 'Discipline Titan',
    stageLabel: 'Stage 3 (60%)',
    stageOrder: 3,
    prerequisiteId: 'stage_40',
    description: 'Over 60% consistency achieved! Prerequisite: Stage 2 must be completed.',
    icon: '🥇',
    color: 'from-amber-500 to-yellow-400',
    requirement: 60,
    type: 'percentage',
    unlocked: false,
  },
  // 4. Stage 4: 80% Milestone (Prerequisite: Stage 3)
  {
    id: 'stage_80',
    title: 'Elite Performer',
    stageLabel: 'Stage 4 (80%)',
    stageOrder: 4,
    prerequisiteId: 'stage_60',
    description: 'Cruising past 80%! Prerequisite: Stage 3 must be completed.',
    icon: '💎',
    color: 'from-cyan-400 to-blue-500',
    requirement: 80,
    type: 'percentage',
    unlocked: false,
  },
  // 5. Stage 5: 100% Milestone (Prerequisite: Stage 4)
  {
    id: 'stage_100',
    title: 'Unstoppable Legend',
    stageLabel: 'Stage 5 (100%)',
    stageOrder: 5,
    prerequisiteId: 'stage_80',
    description: 'Flawless 100% completion! Prerequisite: Stage 4 must be completed.',
    icon: '👑',
    color: 'from-yellow-400 via-amber-300 to-yellow-500',
    requirement: 100,
    type: 'percentage',
    unlocked: false,
  },
  // Streak Badges (Serial order 1, 2)
  {
    id: 'streak_3',
    title: '3-Day Fire',
    stageLabel: 'Streak Badge',
    stageOrder: 10,
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
    stageOrder: 11,
    prerequisiteId: 'streak_3',
    description: 'Full 7-day week of discipline. Prerequisite: 3-Day streak required.',
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
    stageOrder: 20,
    description: 'Completed 100% of all habits on a single calendar day.',
    icon: '🌟',
    color: 'from-emerald-400 to-teal-500',
    requirement: 100,
    type: 'perfectDay',
    unlocked: false,
  },
  // Century Club
  {
    id: 'century_100',
    title: 'Century Club',
    stageLabel: 'Volume Badge',
    stageOrder: 30,
    description: 'Checked off 100 total habit tasks authentically.',
    icon: '🎯',
    color: 'from-rose-500 to-pink-600',
    requirement: 100,
    type: 'totalChecks',
    unlocked: false,
  },
];

const STORAGE_KEY_ACHIEVEMENTS = 'lifetracker_achievements_v2';

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

  // Strict Serial Anti-Fraud Check
  public checkUnlocks(
    overallPercentage: number,
    streak: number,
    totalChecks: number,
    hasAnyPerfectDay: boolean
  ): { updatedList: Achievement[]; newlyUnlocked: Achievement[] } {
    const currentList = this.getAchievements();
    const newlyUnlocked: Achievement[] = [];

    // Sort stages by strict stageOrder so Stage 1 must be evaluated before Stage 2
    const sortedList = [...currentList].sort((a, b) => a.stageOrder - b.stageOrder);
    const unlockedMap = new Map<string, boolean>();
    sortedList.forEach((a) => unlockedMap.set(a.id, a.unlocked));

    const updatedList = sortedList.map((item) => {
      if (item.unlocked) return item;

      // ANTI-CHEAT RULE 1: Check prerequisite badge
      if (item.prerequisiteId && !unlockedMap.get(item.prerequisiteId)) {
        // Cannot unlock if previous stage is still locked! No skipping stages.
        return item;
      }

      let meetsRequirement = false;

      if (item.type === 'percentage') {
        meetsRequirement = overallPercentage >= item.requirement;
      } else if (item.type === 'streak') {
        meetsRequirement = streak >= item.requirement;
      } else if (item.type === 'totalChecks') {
        meetsRequirement = totalChecks >= item.requirement;
      } else if (item.type === 'perfectDay') {
        meetsRequirement = hasAnyPerfectDay;
      }

      // ANTI-CHEAT RULE 2: Allow unlocking only if requirement is strictly met and prerequisite is clear
      if (meetsRequirement && newlyUnlocked.length === 0) {
        // Unlock this stage
        const unlockedItem: Achievement = {
          ...item,
          unlocked: true,
          unlockedAt: new Date().toLocaleDateString(),
        };
        unlockedMap.set(item.id, true);
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
