'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, Calendar, Database, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentMonth: number;
  currentYear: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetPhotoPreset: () => void;
  onOpenInstructions: () => void;
  isCloudSynced: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  currentYear,
  soundEnabled,
  onToggleSound,
  onPrevMonth,
  onNextMonth,
  onResetPhotoPreset,
  onOpenInstructions,
  isCloudSynced,
}) => {
  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', {
    month: 'long',
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 mb-6">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
              LIFETRACKER
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/50">
              Discipline Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Gamified habit matrix & visual consistency analytics
          </p>
        </div>
      </div>

      {/* Month Navigator & Control Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Month Selector */}
        <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/60 shadow-inner">
          <button
            onClick={onPrevMonth}
            className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            title="Previous Month"
          >
            ←
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{monthName} {currentYear}</span>
          </div>
          <button
            onClick={onNextMonth}
            className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            title="Next Month"
          >
            →
          </button>
        </div>

        {/* Database Sync Status Badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
            isCloudSynced
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
          title={isCloudSynced ? 'Connected to Prisma Database' : 'Local Persistence & Offline Ready'}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isCloudSynced ? 'DB Synced' : 'Ready'}</span>
        </div>

        {/* Instructions button matching photo */}
        <button
          onClick={onOpenInstructions}
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all"
          title="View Instructions"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border transition-all ${
            soundEnabled
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
          }`}
          title={soundEnabled ? 'Mute Game Sounds' : 'Enable Game Sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Reset to Photo Preset */}
        <button
          onClick={onResetPhotoPreset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 border border-slate-200"
          title="Restore Exact Photo Numbers & Layout"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Photo Preset</span>
        </button>
      </div>
    </header>
  );
};

