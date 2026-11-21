import { Habit, DayStats, WeekStats } from '@/types';

export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const WEEK_CONFIGS = [
  { index: 0, title: 'week 1', startDay: 1, endDay: 7, colorClass: 'bg-[#C5D1E8]', textClass: 'text-[#2D3F5E]', barColor: '#6B8AFE' },
  { index: 1, title: 'week 2', startDay: 8, endDay: 14, colorClass: 'bg-[#F3C5D3]', textClass: 'text-[#5E2B3C]', barColor: '#D46187' },
  { index: 2, title: 'week 3', startDay: 15, endDay: 21, colorClass: 'bg-[#C4E2D5]', textClass: 'text-[#244E3B]', barColor: '#4FA67B' },
  { index: 3, title: 'week 4', startDay: 22, endDay: 31, colorClass: 'bg-[#F8DCBA]', textClass: 'text-[#5E3F1F]', barColor: '#E0934A' },
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatDayKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function getWeekdayInitial(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  // Sunday is 0, Monday is 1, etc.
  const dayIndex = date.getDay();
  // We want Monday = 0, Tuesday = 1, ... Sunday = 6
  const normalized = (dayIndex + 6) % 7;
  return WEEKDAYS[normalized];
}

export function calculateStats(
  habits: Habit[],
  logs: Record<string, boolean>,
  year: number,
  month: number
): {
  days: DayStats[];
  weeks: WeekStats[];
  overallPercentage: number;
  totalChecks: number;
  possibleChecks: number;
} {
  const daysInMonth = getDaysInMonth(year, month);
  const totalHabits = habits.length;

  const days: DayStats[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDayKey(year, month, day);
    let completedCount = 0;

    habits.forEach((h) => {
      if (logs[`${h.id}_${dateString}`]) {
        completedCount++;
      }
    });

    const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
    
    // Determine which week block this day falls into
    let weekIndex = 0;
    if (day <= 7) weekIndex = 0;
    else if (day <= 14) weekIndex = 1;
    else if (day <= 21) weekIndex = 2;
    else weekIndex = 3;

    days.push({
      dayNumber: day,
      dateString,
      dayOfWeek: getWeekdayInitial(year, month, day),
      weekIndex,
      completedCount,
      totalHabits,
      percentage,
    });
  }

  // Calculate week stats
  const weeks: WeekStats[] = WEEK_CONFIGS.map((cfg) => {
    const end = Math.min(cfg.endDay, daysInMonth);
    const weekDays = days.filter((d) => d.dayNumber >= cfg.startDay && d.dayNumber <= end);
    const completedChecks = weekDays.reduce((acc, curr) => acc + curr.completedCount, 0);
    const totalChecks = weekDays.length * totalHabits;
    const percentage = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;

    return {
      weekIndex: cfg.index,
      title: cfg.title,
      startDay: cfg.startDay,
      endDay: end,
      completedChecks,
      totalChecks,
      percentage,
    };
  });

  const totalChecks = days.reduce((acc, curr) => acc + curr.completedCount, 0);
  const possibleChecks = daysInMonth * totalHabits;
  const overallPercentage = possibleChecks > 0 ? (totalChecks / possibleChecks) * 100 : 0;

  return {
    days,
    weeks,
    overallPercentage,
    totalChecks,
    possibleChecks,
  };
}

