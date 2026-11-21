'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, Calendar, Database, Sparkles, HelpCircle, User, Bell, LayoutGrid, CalendarRange, Rocket } from 'lucide-react';

export type TrackerView = 'month' | 'week' | 'sprint';

interface HeaderProps {
  currentMonth: number;
  currentYear: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  userName: string;
  activeView: TrackerView;
  onChangeView: (view: TrackerView) => void;
  onToggleSound: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetPhotoPreset: () => void;
  onOpenInstructions: () => void;
  onOpenSettings: () => void;
  isCloudSynced: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  currentYear,
  soundEnabled,
  voiceEnabled,
  userName,
  activeView,
  onChangeView,
  onToggleSound,
  onPrevMonth,
  onNextMonth,
  onResetPhotoPreset,
  onOpenInstructions,
  onOpenSettings,
  isCloudSynced,
}) => {
  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', {
    month: 'long',
  });

  return (
    <header className="flex flex-col gap-4 py-4 px-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 mb-6">
      {/* Top Brand Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Gamified habit matrix • 1-month sprint tracking for project, gym, study & health
            </p>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* User Profile Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 transition-all active:scale-95 shadow-2xs"
            title="Personalize Profile, Voice Coach & Reminders"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{userName}</span>
            {voiceEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Voice Coach Active" />
            )}
          </button>

          {/* Month Selector */}
          <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/60 shadow-inner">
            <button
              onClick={onPrevMonth}
              className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              ←
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>{monthName} {currentYear}</span>
            </div>
            <button
              onClick={onNextMonth}
              className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              →
            </button>
          </div>

          {/* Settings / Reminders icon */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 rounded-xl transition-all"
            title="Notification Reminders"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Instructions button */}
          <button
            onClick={onOpenInstructions}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all"
            title="Instructions & Game Rules"
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

          {/* Photo Preset Button */}
          <button
            onClick={onResetPhotoPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 border border-slate-200"
            title="Restore Exact Photo Numbers & Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Photo Preset</span>
          </button>
        </div>
      </div>

      {/* Navigation View Switcher Tabs (Month vs Week vs Sprint) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onChangeView('month')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'month'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
            <span>Month Matrix (Photo View)</span>
          </button>

          <button
            onClick={() => onChangeView('week')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'week'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5 text-rose-500" />
            <span>Week Deep-Dive</span>
          </button>

          <button
            onClick={() => onChangeView('sprint')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'sprint'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Month Project Velocity</span>
          </button>
        </div>

        {/* Sync status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium text-slate-600">SQLite + Cloud Ready</span>
        </div>
      </div>
    </header>
  );
};
