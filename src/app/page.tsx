'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Habit, GameStats, HabitCategory, UserProfileSettings } from '@/types';
import { storage, DEFAULT_PROFILE } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { voiceCoach } from '@/lib/voice';
import { notifier } from '@/lib/notifications';
import { calculateStats, formatDayKey } from '@/lib/dateUtils';
import { Header, TrackerView } from '@/components/Header';
import { GamificationBar } from '@/components/GamificationBar';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { SprintProgressCard } from '@/components/SprintProgressCard';
import { WeekDetailView } from '@/components/WeekDetailView';
import { HabitGrid } from '@/components/HabitGrid';
import { AddHabitModal } from '@/components/AddHabitModal';
import { InstructionsModal } from '@/components/InstructionsModal';
import { UserSettingsModal } from '@/components/UserSettingsModal';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11);
  const [activeView, setActiveView] = useState<TrackerView>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState<UserProfileSettings>(DEFAULT_PROFILE);
  const [gameStats, setGameStats] = useState<GameStats>({
    xp: 690,
    level: 4,
    streak: 7,
    soundEnabled: true,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const loadedHabits = storage.getHabits();
    const loadedLogs = storage.getLogs(currentYear, currentMonth);
    const loadedStats = storage.getGameStats();
    const loadedProfile = storage.getProfile();

    setHabits(loadedHabits);
    setLogs(loadedLogs);
    setGameStats(loadedStats);
    setUserProfile(loadedProfile);
    sound.setEnabled(loadedStats.soundEnabled);
    voiceCoach.configure({
      enabled: loadedProfile.voiceEnabled,
      name: loadedProfile.userName,
      rate: loadedProfile.voiceRate,
    });
    setMounted(true);

    // Initial check with backend API
    fetch('/api/habits')
      .then((res) => {
        if (res.ok) setIsCloudSynced(true);
      })
      .catch(() => setIsCloudSynced(false));
  }, [currentYear, currentMonth]);

  // Periodic reminder checking
  useEffect(() => {
    if (!userProfile.remindersEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (userProfile.reminderTimes.includes(timeStr)) {
        notifier.sendNotification(
          `🎯 LifeTracker Reminder for ${userProfile.userName}!`,
          `Time to check your project sprint, gym, and study targets for today!`
        );
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [userProfile]);

  // Recalculate stats
  const { days, weeks, overallPercentage, totalChecks, possibleChecks } = useMemo(() => {
    return calculateStats(habits, logs, currentYear, currentMonth);
  }, [habits, logs, currentYear, currentMonth]);

  const todayCompletion = useMemo(() => {
    const today = new Date();
    const todayStr = formatDayKey(currentYear, currentMonth, Math.min(today.getDate(), 28));
    const dayStat = days.find((d) => d.dateString === todayStr);
    return dayStat ? dayStat.percentage : 80;
  }, [days, currentYear, currentMonth]);

  // Handle Checkbox Click
  const handleToggleCheck = useCallback(
    (habitId: string, dateString: string) => {
      const cellKey = `${habitId}_${dateString}`;
      const wasCompleted = !!logs[cellKey];
      const nextState = !wasCompleted;

      // Play audio feedback
      sound.playCheck(nextState);

      // Voice encouragement on check
      if (nextState && userProfile.voiceEnabled) {
        const habit = habits.find((h) => h.id === habitId);
        voiceCoach.speakTaskCompletion(habit ? habit.title : 'Task', userProfile.customQuote);
      }

      const nextLogs = {
        ...logs,
        [cellKey]: nextState,
      };

      setLogs(nextLogs);
      storage.saveLogs(nextLogs);

      // XP & Gamification updates
      const xpDelta = nextState ? 10 : -10;
      const nextXp = Math.max(0, gameStats.xp + xpDelta);
      const nextLevel = Math.floor(nextXp / 250) + 1;

      const nextStats = {
        ...gameStats,
        xp: nextXp,
        level: nextLevel,
      };

      setGameStats(nextStats);
      storage.saveGameStats(nextStats);

      // Check if 100% of day completed
      if (nextState) {
        const dayHabitsCompleted = habits.filter((h) => {
          if (h.id === habitId) return true;
          return !!logs[`${h.id}_${dateString}`];
        }).length;

        if (dayHabitsCompleted === habits.length && habits.length > 0) {
          sound.playCelebration();
          voiceCoach.speakDayGoalAchieved();
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#6B8AFE', '#D46187', '#4FA67B', '#E0934A', '#FBBF24'],
            });
          } catch {
            // fallback
          }
        }
      }

      // Sync to API in background
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date: dateString, completed: nextState }),
      }).catch(() => {});
    },
    [logs, gameStats, habits, userProfile]
  );

  // Toggle Sound
  const handleToggleSound = () => {
    const nextVal = !gameStats.soundEnabled;
    sound.setEnabled(nextVal);
    const updated = { ...gameStats, soundEnabled: nextVal };
    setGameStats(updated);
    storage.saveGameStats(updated);
  };

  // Add Habit
  const handleAddHabit = (newHabitData: {
    title: string;
    category: HabitCategory;
    icon: string;
    color: string;
  }) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title: newHabitData.title,
      category: newHabitData.category,
      icon: newHabitData.icon,
      color: newHabitData.color,
      order: habits.length,
    };

    const nextHabits = [...habits, newHabit];
    setHabits(nextHabits);
    storage.saveHabits(nextHabits);

    fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHabit),
    }).catch(() => {});
  };

  // Delete Habit
  const handleDeleteHabit = (habitId: string) => {
    const nextHabits = habits.filter((h) => h.id !== habitId);
    setHabits(nextHabits);
    storage.saveHabits(nextHabits);

    fetch(`/api/habits?id=${habitId}`, {
      method: 'DELETE',
    }).catch(() => {});
  };

  // Restore Photo Preset
  const handleResetPhotoPreset = () => {
    const restored = storage.resetToPhotoPreset(currentYear, currentMonth);
    setHabits(restored.habits);
    setLogs(restored.logs);
    setGameStats(restored.stats);
    setUserProfile(restored.profile);
    sound.playCelebration();
  };

  // Save user profile settings
  const handleSaveProfile = (updated: UserProfileSettings) => {
    setUserProfile(updated);
    storage.saveProfile(updated);
    voiceCoach.configure({
      enabled: updated.voiceEnabled,
      name: updated.userName,
      rate: updated.voiceRate,
    });
  };

  // Month Navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F3F8]">
        <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
          <span>Loading LifeTracker...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1480px] mx-auto px-3 sm:px-6 py-6 transition-all">
      {/* Navigation Header */}
      <Header
        currentMonth={currentMonth}
        currentYear={currentYear}
        soundEnabled={gameStats.soundEnabled}
        voiceEnabled={userProfile.voiceEnabled}
        userName={userProfile.userName}
        activeView={activeView}
        onChangeView={setActiveView}
        onToggleSound={handleToggleSound}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onResetPhotoPreset={handleResetPhotoPreset}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCloudSynced={isCloudSynced}
      />

      {/* Gamification Level & XP Bar */}
      <GamificationBar stats={gameStats} todayCompletion={todayCompletion} />

      {/* 1-Month Sprint Progress Card (Always visible or in sprint view) */}
      {(activeView === 'sprint' || activeView === 'month') && (
        <SprintProgressCard
          sprint={userProfile.sprint}
          habits={habits}
          logs={logs}
          year={currentYear}
          month={currentMonth}
          userName={userProfile.userName}
        />
      )}

      {/* VIEW 1: Month Matrix (Exact Photo Analytics & Full Checkbox Grid) */}
      {activeView === 'month' && (
        <>
          <AnalyticsDashboard
            days={days}
            weeks={weeks}
            overallPercentage={overallPercentage}
            totalChecks={totalChecks}
            possibleChecks={possibleChecks}
          />

          <HabitGrid
            habits={habits}
            logs={logs}
            days={days}
            year={currentYear}
            month={currentMonth}
            onToggleCheck={handleToggleCheck}
            onAddHabitClick={() => setIsAddModalOpen(true)}
            onDeleteHabit={handleDeleteHabit}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </>
      )}

      {/* VIEW 2: Week Deep-Dive (Day-by-Day Cards for Week 1, 2, 3, 4) */}
      {activeView === 'week' && (
        <WeekDetailView
          habits={habits}
          logs={logs}
          days={days}
          year={currentYear}
          month={currentMonth}
          onToggleCheck={handleToggleCheck}
          selectedCategory={selectedCategory}
        />
      )}

      {/* VIEW 3: Sprint Focus View */}
      {activeView === 'sprint' && (
        <HabitGrid
          habits={habits}
          logs={logs}
          days={days}
          year={currentYear}
          month={currentMonth}
          onToggleCheck={handleToggleCheck}
          onAddHabitClick={() => setIsAddModalOpen(true)}
          onDeleteHabit={handleDeleteHabit}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* Modals */}
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={userProfile}
        onSave={handleSaveProfile}
      />

      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddHabit}
      />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
        <div className="flex items-center gap-2">
          <span>LifeTracker for <strong>{userProfile.userName}</strong></span>
          <span>•</span>
          <span className="text-slate-500 font-medium">1-Month Sprint Tracker (Project, Gym, Study, Health)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-slate-600 underline font-medium"
          >
            Voice & Reminder Settings
          </button>
          <span>•</span>
          <button
            onClick={handleResetPhotoPreset}
            className="hover:text-slate-600 underline font-medium"
          >
            Reload Photo Preset
          </button>
        </div>
      </footer>
    </main>
  );
}
