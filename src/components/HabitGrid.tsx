'use client';

import React, { useState } from 'react';
import { Habit, DayStats, HabitCategory } from '@/types';
import { WEEK_CONFIGS } from '@/lib/dateUtils';
import { Check, Plus, Trash2, Flame, Laptop, Dumbbell, BookOpen, HeartPulse, Sparkles, Filter } from 'lucide-react';

interface HabitGridProps {
  habits: Habit[];
  logs: Record<string, boolean>;
  days: DayStats[];
  year: number;
  month: number;
  onToggleCheck: (habitId: string, dateString: string) => void;
  onAddHabitClick: () => void;
  onDeleteHabit: (habitId: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({
  habits,
  logs,
  days,
  onToggleCheck,
  onAddHabitClick,
  onDeleteHabit,
  selectedCategory,
  onSelectCategory,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>('h-9_2026-11-10'); // sample active focus like photo

  // Filter habits by category
  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  const week1Days = days.filter((d) => d.dayNumber >= 1 && d.dayNumber <= 7);
  const week2Days = days.filter((d) => d.dayNumber >= 8 && d.dayNumber <= 14);
  const week3Days = days.filter((d) => d.dayNumber >= 15 && d.dayNumber <= 21);
  const week4Days = days.filter((d) => d.dayNumber >= 22);

  const getHabitStats = (habitId: string) => {
    let completedCount = 0;
    days.forEach((d) => {
      if (logs[`${habitId}_${d.dateString}`]) {
        completedCount++;
      }
    });
    const percentage = days.length > 0 ? (completedCount / days.length) * 100 : 0;
    return { completedCount, percentage };
  };

  const categories = [
    { id: 'All', label: 'All Fields' },
    { id: 'Project', label: '💻 Project' },
    { id: 'Fitness', label: '🏋️ Gym / Fitness' },
    { id: 'Study', label: '📚 Study' },
    { id: 'Health', label: '🥗 Health' },
    { id: 'Mindset', label: '🧘 Mindset' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden mb-6">
      {/* Category Filter & Actions Bar */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mr-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={onAddHabitClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Main Grid View */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300">
        <table className="w-full border-collapse text-left select-none">
          <thead>
            {/* Row 1: Week Span Banners */}
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-30 bg-slate-100/95 backdrop-blur-sm p-3 min-w-[220px] sm:min-w-[260px] text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200 shadow-sm">
                Habit Protocol ({filteredHabits.length})
              </th>

              {/* Week 1 Header */}
              <th
                colSpan={week1Days.length}
                className="text-center py-2 px-1 text-xs font-bold uppercase tracking-wider bg-[#C5D1E8] text-[#2D3F5E] border-r border-slate-300"
              >
                week 1
              </th>

              {/* Week 2 Header */}
              <th
                colSpan={week2Days.length}
                className="text-center py-2 px-1 text-xs font-bold uppercase tracking-wider bg-[#F3C5D3] text-[#5E2B3C] border-r border-slate-300"
              >
                week 2
              </th>

              {/* Week 3 Header */}
              <th
                colSpan={week3Days.length}
                className="text-center py-2 px-1 text-xs font-bold uppercase tracking-wider bg-[#C4E2D5] text-[#244E3B] border-r border-slate-300"
              >
                week 3
              </th>

              {/* Week 4 Header */}
              <th
                colSpan={week4Days.length}
                className="text-center py-2 px-1 text-xs font-bold uppercase tracking-wider bg-[#F8DCBA] text-[#5E3F1F]"
              >
                week 4
              </th>

              <th className="p-2 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider border-l border-slate-200 min-w-[80px]">
                Progress
              </th>
            </tr>

            {/* Row 2: Weekday Letters (M, T, W, T, F, S, S) */}
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 z-30 bg-slate-50/95 backdrop-blur-sm p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-200">
                Daily Focus
              </th>

              {days.map((day) => {
                let bgStyle = 'bg-slate-50';
                if (day.dayNumber <= 7) bgStyle = 'bg-[#D6E0F2]/50 text-[#2D3F5E]';
                else if (day.dayNumber <= 14) bgStyle = 'bg-[#F9D6E1]/50 text-[#5E2B3C]';
                else if (day.dayNumber <= 21) bgStyle = 'bg-[#D6ECE1]/50 text-[#244E3B]';
                else bgStyle = 'bg-[#FBE8D1]/50 text-[#5E3F1F]';

                const isWeekBoundary = day.dayNumber === 7 || day.dayNumber === 14 || day.dayNumber === 21;

                return (
                  <th
                    key={`wday-${day.dayNumber}`}
                    className={`py-1 text-center font-bold text-[11px] min-w-[32px] w-8 ${bgStyle} ${
                      isWeekBoundary ? 'border-r-2 border-slate-300' : 'border-r border-slate-200/60'
                    }`}
                  >
                    {day.dayOfWeek}
                  </th>
                );
              })}

              <th className="border-l border-slate-200"></th>
            </tr>

            {/* Row 3: Day Numbers (1, 2, 3 ... 31) */}
            <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-600">
              <th className="sticky left-0 z-30 bg-slate-100/95 backdrop-blur-sm p-2 text-[10px] font-medium text-slate-500 border-r border-slate-200">
                Day Numbers
              </th>

              {days.map((day) => {
                const isWeekBoundary = day.dayNumber === 7 || day.dayNumber === 14 || day.dayNumber === 21;

                return (
                  <th
                    key={`dnum-${day.dayNumber}`}
                    className={`py-1 text-center font-semibold text-[11px] text-slate-700 min-w-[32px] w-8 ${
                      isWeekBoundary ? 'border-r-2 border-slate-300' : 'border-r border-slate-200/60'
                    }`}
                  >
                    {day.dayNumber}
                  </th>
                );
              })}

              <th className="border-l border-slate-200"></th>
            </tr>
          </thead>

          <tbody>
            {filteredHabits.map((habit, habitIndex) => {
              const { percentage } = getHabitStats(habit.id);

              return (
                <tr
                  key={habit.id}
                  className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${
                    habitIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  {/* Left Column: Habit Title & Category */}
                  <td className="sticky left-0 z-20 bg-inherit backdrop-blur-sm p-2.5 px-3 border-r border-slate-200 flex items-center justify-between group shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-base select-none shrink-0">{habit.icon}</span>
                      <div className="truncate">
                        <div className="font-semibold text-xs text-slate-800 truncate" title={habit.title}>
                          {habit.title}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {habit.category}
                        </span>
                      </div>
                    </div>

                    {/* Delete Action on Hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        title="Delete habit"
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Day Checkboxes */}
                  {days.map((day) => {
                    const cellKey = `${habit.id}_${day.dateString}`;
                    const isChecked = !!logs[cellKey];
                    const isSelected = selectedCell === cellKey;
                    const isWeekBoundary = day.dayNumber === 7 || day.dayNumber === 14 || day.dayNumber === 21;

                    return (
                      <td
                        key={cellKey}
                        onClick={() => {
                          setSelectedCell(cellKey);
                          onToggleCheck(habit.id, day.dateString);
                        }}
                        className={`p-1 text-center align-middle cursor-pointer min-w-[32px] w-8 transition-colors ${
                          isWeekBoundary ? 'border-r-2 border-slate-300' : 'border-r border-slate-100'
                        } ${isSelected ? 'bg-indigo-50/60' : ''}`}
                      >
                        <div className="flex items-center justify-center">
                          {/* Aesthetic Checkbox Box */}
                          <div
                            className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-all duration-150 transform active:scale-90 ${
                              isChecked
                                ? 'bg-[#1E2640] border-[#1E2640] text-white shadow-xs'
                                : 'bg-white border-[1.5px] border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                            } ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                          >
                            {isChecked && (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-white animate-in zoom-in-50 duration-150" />
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  {/* Right Progress column */}
                  <td className="p-2 border-l border-slate-200 text-center font-semibold text-xs text-slate-700">
                    <div className="flex items-center justify-center gap-1">
                      <span>{percentage.toFixed(0)}%</span>
                      {percentage >= 80 && (
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grid Footer Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#1E2640] inline-block"></span> Completed Checkbox
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300 inline-block"></span> Remaining Day
          </span>
        </div>
        <span className="text-[11px] text-slate-400 italic">
          Click any square to toggle checkmark, hear voice coach & gain XP
        </span>
      </div>
    </div>
  );
};
