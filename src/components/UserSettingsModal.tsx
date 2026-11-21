'use client';

import React, { useState } from 'react';
import { UserProfileSettings } from '@/types';
import { notifier } from '@/lib/notifications';
import { X, User, Bell, Check, Send } from 'lucide-react';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileSettings;
  onSave: (updated: UserProfileSettings) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [userName, setUserName] = useState(profile.userName);
  const [remindersEnabled, setRemindersEnabled] = useState(profile.remindersEnabled);
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(profile.antiCheatEnabled ?? true);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleTestNotification = async () => {
    const granted = await notifier.requestPermission();
    if (granted || notifier.isGranted()) {
      notifier.testReminder(userName);
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    } else {
      alert('Please enable browser notification permissions in your browser URL bar.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfileSettings = {
      ...profile,
      userName: userName.trim() || 'Satya',
      remindersEnabled,
      antiCheatEnabled,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">LifeTracker Settings</h2>
              <p className="text-xs text-slate-500">Configure profile, reminders & anti-cheat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* 1. Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Abhijit, Satya"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Personalizes your dashboard and achievement badge awards.
            </span>
          </div>

          {/* 2. Smart Reminders & Notifications */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Daily Habit Reminders
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={(e) => setRemindersEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <p className="text-xs text-slate-600">
              Receive desktop alerts throughout the day to keep your habit consistency high.
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">Notification alert test:</span>
              <button
                type="button"
                onClick={handleTestNotification}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testNotificationSent ? 'Sent!' : 'Send Test Alert'}</span>
              </button>
            </div>
          </div>

          {/* 3. Anti-Cheat & Serial Progression Guard */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Anti-Cheat & Serial Progression Guard
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiCheatEnabled}
                  onChange={(e) => setAntiCheatEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-600">
              Prevents cheating and skipping stages: Badges unlock strictly in order (Stage 1 → Stage 2 → Stage 3), and future calendar days are locked.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
