import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_HABITS = [
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

async function main() {
  console.log('Seeding LifeTracker database...');

  // Upsert habits
  for (const habit of DEFAULT_HABITS) {
    await prisma.habit.upsert({
      where: { id: habit.id },
      update: habit,
      create: habit,
    });
  }

  // Create logs for November 2026
  for (let day = 1; day <= 30; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `2026-11-${dayStr}`;
    const count = dayCompletedCounts[day] || 0;

    for (let idx = 0; idx < DEFAULT_HABITS.length; idx++) {
      const habit = DEFAULT_HABITS[idx];
      const completed = idx < count;

      await prisma.habitLog.upsert({
        where: {
          habitId_date: {
            habitId: habit.id,
            date: dateStr,
          },
        },
        update: { completed },
        create: {
          habitId: habit.id,
          date: dateStr,
          completed,
        },
      });
    }
  }

  // Initial stats
  await prisma.gameStats.upsert({
    where: { id: 'default' },
    update: { xp: 690, level: 4, streak: 7 },
    create: { id: 'default', xp: 690, level: 4, streak: 7 },
  });

  console.log('Database seeded successfully matching photo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

