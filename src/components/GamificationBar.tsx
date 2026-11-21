'use client';

import React from 'react';
import { GameStats } from '@/types';
import { ShieldCheck, Flame, Zap, Award } from 'lucide-react';

interface GamificationBarProps {
  stats: GameStats;
  todayCompletion: number;
}

export const GamificationBar: React.FC<GamificationBarProps> = ({ stats, todayCompletion }) => {
  const xpNeededForNextLevel = stats.level * 250;
  const currentLevelProgress = Math.min(Math.round(((stats.xp % 250) / 250) * 100), 100);

  const getLevelTitle = (lvl: number) => {
    if (lvl <= 1) return 'Novice Tracker';
    if (lvl <= 3) return 'Habit Builder';
    if (lvl <= 5) return 'Discipline Warrior';
    if (lvl <= 8) return 'Focus Master';
    return 'Ascended Grandmaster';
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg mb-6 border border-slate-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Level and Title */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-extrabold text-lg text-white shadow-md">
              {stats.level}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-0.5 rounded-full ring-2 ring-slate-900">
              <Zap className="w-3 h-3 fill-slate-900" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                Level {stats.level}
              </span>
              <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
                {getLevelTitle(stats.level)}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {stats.xp} Total XP earned
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full md:max-w-xs flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>Level Progress</span>
            <span className="text-amber-300 font-bold">{currentLevelProgress}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Streak Counter */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-bounce" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Streak
              </div>
              <div className="text-sm font-extrabold text-white">
                {stats.streak} Days
              </div>
            </div>
          </div>

          {/* Today's completion */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Today
              </div>
              <div className="text-sm font-extrabold text-emerald-300">
                {todayCompletion.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

