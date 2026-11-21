'use client';

import React from 'react';
import { Habit, HabitCategory, SprintConfig } from '@/types';
import { Rocket, Clock, Target, CheckCircle2, AlertCircle, Dumbbell, BookOpen, Laptop, HeartPulse, Sparkles } from 'lucide-react';

interface SprintProgressCardProps {
  sprint: SprintConfig;
  habits: Habit[];
  logs: Record<string, boolean>;
  year: number;
  month: number;
  userName: string;
}

export const SprintProgressCard: React.FC<SprintProgressCardProps> = ({
  sprint,
  habits,
  logs,
  year,
  month,
  userName,
}) => {
  // Calculate current sprint day
  const today = new Date();
  const currentDayOfMonth = Math.min(Math.max(today.getDate(), 1), sprint.totalDays);
  const daysRemaining = Math.max(0, sprint.totalDays - currentDayOfMonth);
  const timeElapsedPct = Math.round((currentDayOfMonth / sprint.totalDays) * 100);

  // Calculate field-by-field completion
  const categories: { category: HabitCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { category: 'Project', label: 'Project & Code', icon: <Laptop className="w-4 h-4" />, color: 'from-indigo-500 to-blue-600' },
    { category: 'Fitness', label: 'Gym & Fitness', icon: <Dumbbell className="w-4 h-4" />, color: 'from-rose-500 to-red-600' },
    { category: 'Study', label: 'Study & Learning', icon: <BookOpen className="w-4 h-4" />, color: 'from-amber-500 to-yellow-600' },
    { category: 'Health', label: 'Health & Diet', icon: <HeartPulse className="w-4 h-4" />, color: 'from-emerald-500 to-teal-600' },
    { category: 'Mindset', label: 'Mindset & Rest', icon: <Sparkles className="w-4 h-4" />, color: 'from-purple-500 to-indigo-600' },
  ];

  const categoryStats = categories.map((cat) => {
    const catHabits = habits.filter((h) => h.category === cat.category);
    let totalPossible = catHabits.length * currentDayOfMonth;
    let completed = 0;

    const monthStr = String(month).padStart(2, '0');
    for (let day = 1; day <= currentDayOfMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${year}-${monthStr}-${dayStr}`;
      catHabits.forEach((h) => {
        if (logs[`${h.id}_${dateKey}`]) completed++;
      });
    }

    const pct = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
    return {
      ...cat,
      completed,
      totalPossible,
      pct,
      habitCount: catHabits.length,
    };
  });

  // Overall sprint work completion
  const totalCompletedChecks = categoryStats.reduce((acc, c) => acc + c.completed, 0);
  const totalPossibleChecks = categoryStats.reduce((acc, c) => acc + c.totalPossible, 0);
  const overallSprintPct = totalPossibleChecks > 0 ? Math.round((totalCompletedChecks / totalPossibleChecks) * 100) : 0;

  const isAhead = overallSprintPct >= timeElapsedPct;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#131b2e] to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 mb-6 transition-all">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Rocket className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                {sprint.projectName}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                1-Month Sprint
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized for <strong className="text-white font-semibold">{userName}</strong> • Real-time work position across all fields
            </p>
          </div>
        </div>

        {/* Days Left Countdown Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sprint Clock</div>
              <div className="text-xs font-bold text-white">
                Day {currentDayOfMonth} of {sprint.totalDays} ({daysRemaining} days left)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Progress (Time Elapsed vs Work Done) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
        {/* Time Elapsed */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Sprint Time Elapsed</span>
            </span>
            <span>{timeElapsedPct}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${timeElapsedPct}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400">
            {currentDayOfMonth} days spent • {daysRemaining} days remaining to launch
          </span>
        </div>

        {/* Work Completed */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Actual Work Velocity</span>
            </span>
            <span className="text-emerald-400 font-bold">{overallSprintPct}% Completed</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAhead ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${overallSprintPct}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            {isAhead ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ahead of sprint schedule! Great discipline, {userName}!
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Behind schedule — increase daily output to hit target!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Field-by-Field Breakdown (Project, Gym, Study, Health, Mindset) */}
      <div className="mt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Field-by-Field Execution Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categoryStats.map((item) => (
            <div
              key={item.category}
              className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-xs font-extrabold text-white">{item.pct}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-700/60 rounded-full overflow-hidden my-1">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>{item.completed} checks</span>
                <span>{item.habitCount} habits</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
