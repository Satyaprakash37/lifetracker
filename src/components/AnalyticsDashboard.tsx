'use client';

import React from 'react';
import { DayStats, WeekStats } from '@/types';
import { WEEK_CONFIGS } from '@/lib/dateUtils';
import { Trophy, Flame, Sparkles } from 'lucide-react';

interface AnalyticsDashboardProps {
  days: DayStats[];
  weeks: WeekStats[];
  overallPercentage: number;
  totalChecks: number;
  possibleChecks: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  days,
  weeks,
  overallPercentage,
  totalChecks,
}) => {
  // SVG Donut Ring helper
  const renderCircleProgress = (
    percentage: number,
    color: string,
    size: number = 100,
    strokeWidth: number = 10
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-6 transition-all">
      {/* Reel POV Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Pov: I made staying disciplined feel like a game.</span>
          </div>
        </div>

        {/* Quick Month Overview Badges */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Total Checked: <strong className="text-slate-800">{totalChecks}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Month Score: <strong className="text-slate-800">{overallPercentage.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Top Section: Multi-week Bar Chart & Daily Statistics */}
      <div className="mt-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="min-w-[840px]">
          {/* Week Label Headers */}
          <div className="grid grid-cols-4 gap-4 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <div className="pl-2">week 1</div>
            <div className="pl-2">week 2</div>
            <div className="pl-2">week 3</div>
            <div className="pl-2">week 4</div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-36 bg-slate-50/60 rounded-xl p-3 flex items-end border border-slate-100 gap-1.5 relative">
            {/* Horizontal guideline */}
            <div className="absolute inset-x-3 top-3 border-b border-dashed border-slate-200/70" />
            <div className="absolute inset-x-3 top-1/2 border-b border-dashed border-slate-200/70" />

            {days.map((day) => {
              const weekCfg = WEEK_CONFIGS[day.weekIndex] || WEEK_CONFIGS[3];
              const barHeightPct = Math.max(day.percentage, 3);

              return (
                <div
                  key={day.dateString}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  title={`Day ${day.dayNumber}: ${day.completedCount}/${day.totalHabits} (${day.percentage.toFixed(0)}%)`}
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
                    Day {day.dayNumber}: {day.percentage.toFixed(0)}%
                  </div>

                  {/* Vertical Bar */}
                  <div
                    className="w-full max-w-[20px] rounded-t-md transition-all duration-500 ease-out group-hover:opacity-90"
                    style={{
                      height: `${barHeightPct}%`,
                      backgroundColor: day.completedCount > 0 ? weekCfg.barColor : '#E2E8F0',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Statistics Rows Under Chart: Percentages & Completed Counts */}
          <div className="flex gap-1.5 mt-2.5">
            {days.map((day) => (
              <div
                key={`pct-${day.dateString}`}
                className="flex-1 text-center font-medium text-[10px] text-slate-600 truncate"
              >
                {day.percentage > 0 ? `${Math.round(day.percentage)}%` : '0%'}
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mt-1">
            {days.map((day) => (
              <div
                key={`cnt-${day.dateString}`}
                className="flex-1 text-center font-bold text-[11px] text-slate-800 truncate"
              >
                {day.completedCount}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Circular Progress Rings Section (Week 1, Week 2, Week 3, Week 4) */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {weeks.map((week) => {
            const cfg = WEEK_CONFIGS[week.weekIndex];
            return (
              <div
                key={week.title}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {week.title}
                </div>
                {renderCircleProgress(
                  week.percentage,
                  week.percentage > 0 ? cfg.barColor : '#CBD5E1',
                  88,
                  9
                )}
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  {week.completedChecks} / {week.totalChecks} Done
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

