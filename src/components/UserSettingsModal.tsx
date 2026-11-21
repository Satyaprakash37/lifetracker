'use client';

import React, { useState } from 'react';
import { UserProfileSettings } from '@/types';
import { voiceCoach } from '@/lib/voice';
import { notifier } from '@/lib/notifications';
import { X, User, Volume2, Bell, Sparkles, Check, Play, Send } from 'lucide-react';

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
  const [voiceEnabled, setVoiceEnabled] = useState(profile.voiceEnabled);
  const [customQuote, setCustomQuote] = useState(profile.customQuote || 'Good {name}, nice! Keep pushing your limits!');
  const [voiceRate, setVoiceRate] = useState(profile.voiceRate || 1.0);
  const [remindersEnabled, setRemindersEnabled] = useState(profile.remindersEnabled);
  const [projectName, setProjectName] = useState(profile.sprint.projectName);
  const [totalDays, setTotalDays] = useState(profile.sprint.totalDays);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    voiceCoach.configure({ enabled: true, name: userName, rate: voiceRate });
    voiceCoach.testPreview(userName);
  };

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
      voiceEnabled,
      customQuote: customQuote.trim(),
      voiceRate,
      remindersEnabled,
      sprint: {
        ...profile.sprint,
        projectName: projectName.trim() || '1-Month Web Application Launch',
        totalDays: Number(totalDays) || 30,
      },
    };

    voiceCoach.configure({
      enabled: voiceEnabled,
      name: updated.userName,
      rate: voiceRate,
    });

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
              <h2 className="text-base font-bold text-slate-900">Personalize Your LifeTracker</h2>
              <p className="text-xs text-slate-500">Custom voice coach, reminders & sprint goals</p>
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
              Your Name (Used in Voice & Motivation)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Satya"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              The assistant will say: &quot;Good {userName || 'Satya'}, nice! Target completed!&quot;
            </span>
          </div>

          {/* 2. Voice Coach Section */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Positive Voice Message Coach
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Custom Positive Affirmation Quote
              </label>
              <input
                type="text"
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                placeholder="Good {name}, nice! Keep pushing your limits!"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Use <code>{'{name}'}</code> to automatically insert your name.
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium">Test voice message:</span>
              <button
                type="button"
                onClick={handleTestVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Hear Voice Preview</span>
              </button>
            </div>
          </div>

          {/* 3. Smart Reminders & Notifications */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Daily Habit & Project Reminders
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
              Get desktop alerts throughout the day to keep your gym, study, and project progress on pace!
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

          {/* 4. 1-Month Project Sprint Config */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1-Month Project Sprint Goal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Project Title / Mission
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. 1-Month Web App Launch"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sprint Duration
                </label>
                <input
                  type="number"
                  min="7"
                  max="60"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>
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
