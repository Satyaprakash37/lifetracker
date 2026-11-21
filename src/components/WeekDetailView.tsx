'use client';

import React, { useState } from 'react';
import { Habit, DayStats, HabitCategory } from '@/types';
import { WEEK_CONFIGS } from '@/lib/dateUtils';
import { Check, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Laptop, Dumbbell, BookOpen, HeartPulse, Sparkles } from 'lucide-react';

interface WeekDetailViewProps {
  habits: Habit[];
  logs: Record<string, boolean>;
  days: DayStats[];
  year: number;
  month: number;
  onToggleCheck: (habitId: string, dateString: string) => void;
  selectedCategory: string;
}

export const WeekDetailView: React.FC<WeekDetailViewProps> = ({
  habits,
  logs,
  days,
  onToggleCheck,
  selectedCategory,
}) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0); // 0 = Week 1, 1 = Week 2, 2 = Week 3, 3 = Week 4

  const activeWeekCfg = WEEK_CONFIGS[activeWeekIndex];
  const weekDays = days.filter((d) => d.weekIndex === activeWeekIndex);

  // Filter habits by category if user selected one
  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  const totalPossible = weekDays.length * filteredHabits.length;
  let totalCompleted = 0;
  weekDays.forEach((d) => {
    filteredHabits.forEach((h) => {
      if (logs[`${h.id}_${d.dateString}`]) totalCompleted++;
    });
  });
  const weekPct = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  const getCategoryIcon = (category: HabitCategory) => {
    switch (category) {
      case 'Project': return <Laptop className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Fitness': return <Dumbbell className="w-3.5 h-3.5 text-rose-500" />;
      case 'Study': return <BookOpen className="w-3.5 h-3.5 text-amber-500" />;
      case 'Health': return <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden mb-6">
      {/* Week Tabs Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
          {WEEK_CONFIGS.map((cfg, idx) => (
            <button
              key={cfg.title}
              onClick={() => setActiveWeekIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeWeekIndex === idx
                  ? `${cfg.colorClass} ${cfg.textClass} shadow-sm scale-102`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cfg.title} (Days {cfg.startDay}-{cfg.endDay})
            </button>
          ))}
        </div>

        {/* Week Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-slate-600">
            Week Completion: <strong className="text-slate-900">{weekPct}%</strong> ({totalCompleted}/{totalPossible} checks)
          </div>
        </div>
      </div>

      {/* Week Grid: Day by Day Cards */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weekDays.map((day) => {
          let dayCompletedCount = 0;
          filteredHabits.forEach((h) => {
            if (logs[`${h.id}_${day.dateString}`]) dayCompletedCount++;
          });
          const dayPct = filteredHabits.length > 0 ? Math.round((dayCompletedCount / filteredHabits.length) * 100) : 0;
          const is100Pct = dayPct === 100 && filteredHabits.length > 0;

          return (
            <div
              key={day.dateString}
              className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                is100Pct
                  ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {day.dayOfWeek}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Day {day.dayNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">{day.dateString}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span className={is100Pct ? 'text-emerald-600' : ''}>{dayPct}%</span>
                    {is100Pct && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                </div>

                {/* Habits Checklist for this Day */}
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredHabits.map((habit) => {
                    const isChecked = !!logs[`${habit.id}_${day.dateString}`];
                    return (
                      <div
                        key={habit.id}
                        onClick={() => onToggleCheck(habit.id, day.dateString)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-slate-100/90 text-slate-900'
                            : 'hover:bg-slate-50 text-slate-600 border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="text-sm select-none shrink-0">{habit.icon}</span>
                          <span className={`text-xs truncate ${isChecked ? 'line-through text-slate-500 font-medium' : 'font-medium'}`}>
                            {habit.title}
                          </span>
                        </div>

                        {/* Checkbox Box */}
                        <div
                          className={`w-4 h-4 rounded-[3px] flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#1E2640] text-white'
                              : 'bg-white border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day Progress Footer */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{dayCompletedCount}/{filteredHabits.length} Done</span>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${is100Pct ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${dayPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
