'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Calendar, Database, Sparkles, HelpCircle, User, Bell, LayoutGrid, CalendarRange, Check, Edit2 } from 'lucide-react';

export type TrackerView = 'month' | 'week';

interface HeaderProps {
  currentMonth: number;
  currentYear: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  userName: string;
  onUpdateName: (newName: string) => void;
  onTestVoice: () => void;
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
  onUpdateName,
  onTestVoice,
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
  const [editingName, setEditingName] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditingName(userName);
  }, [userName]);

  const handleNameBlur = () => {
    setIsEditing(false);
    const trimmed = editingName.trim();
    if (trimmed && trimmed !== userName) {
      onUpdateName(trimmed);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', {
    month: 'long',
  });

  return (
    <header className="flex flex-col gap-4 py-4 px-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 mb-6">
      {/* Top Brand Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
              Gamified habit tracker • Personalized voice coaching & consistency analytics
            </p>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Name Changer Box (e.g. Satya, Abhijit, or whatever name) */}
          <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Name:
              </span>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                placeholder="Enter Name"
                title="Type your name (e.g. Abhijit) and press Enter"
                className="w-24 sm:w-28 text-xs font-bold text-slate-900 bg-white border border-indigo-300 focus:border-indigo-600 rounded-md px-2 py-0.5 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Test Voice Button */}
            <button
              onClick={onTestVoice}
              title={`Test voice affirmation for ${userName}`}
              className="p-1 hover:bg-indigo-200/70 text-indigo-700 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Say &quot;Good {userName}, nice!&quot;</span>
            </button>
          </div>

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

          {/* Reminders / Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 rounded-xl transition-all"
            title="Configure Reminders & Settings"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Instructions */}
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
            title={soundEnabled ? 'Mute Click Sounds' : 'Enable Click Sounds'}
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
            <span className="hidden sm:inline">Photo Preset</span>
          </button>
        </div>
      </div>

      {/* Navigation View Switcher Tabs (Month vs Week) */}
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
        </div>

        {/* Database indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium text-slate-600">SQLite + Cloud Synced</span>
        </div>
      </div>
    </header>
  );
};
