'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Habit, GameStats, HabitCategory } from '@/types';
import { storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { calculateStats, formatDayKey } from '@/lib/dateUtils';
import { Header } from '@/components/Header';
import { GamificationBar } from '@/components/GamificationBar';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { HabitGrid } from '@/components/HabitGrid';
import { AddHabitModal } from '@/components/AddHabitModal';
import { InstructionsModal } from '@/components/InstructionsModal';
import { Sparkles, Trophy } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // November 2026
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, boolean>>({});
  const [gameStats, setGameStats] = useState<GameStats>({
    xp: 690,
    level: 4,
    streak: 7,
    soundEnabled: true,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const loadedHabits = storage.getHabits();
    const loadedLogs = storage.getLogs(currentYear, currentMonth);
    const loadedStats = storage.getGameStats();

    setHabits(loadedHabits);
    setLogs(loadedLogs);
    setGameStats(loadedStats);
    sound.setEnabled(loadedStats.soundEnabled);
    setMounted(true);

    // Initial sync with backend API (non-blocking)
    fetch('/api/habits')
      .then((res) => {
        if (res.ok) setIsCloudSynced(true);
      })
      .catch(() => setIsCloudSynced(false));
  }, [currentYear, currentMonth]);

  // Recalculate stats whenever habits, logs, or month changes
  const { days, weeks, overallPercentage, totalChecks, possibleChecks } = useMemo(() => {
    return calculateStats(habits, logs, currentYear, currentMonth);
  }, [habits, logs, currentYear, currentMonth]);

  // Today's completion calculation
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

      // Check if this action completed 100% of habits for the given day
      if (nextState) {
        const dayHabitsCompleted = habits.filter((h) => {
          if (h.id === habitId) return true;
          return !!logs[`${h.id}_${dateString}`];
        }).length;

        if (dayHabitsCompleted === habits.length && habits.length > 0) {
          // Trigger celebratory confetti & chime
          sound.playCelebration();
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
      }).catch(() => {
        // Keeps local persistence uninterrupted
      });
    },
    [logs, gameStats, habits]
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

  // Restore Photo Preset (Week 1 = 82.1%, Week 2 = 23.8%)
  const handleResetPhotoPreset = () => {
    const restored = storage.resetToPhotoPreset(currentYear, currentMonth);
    setHabits(restored.habits);
    setLogs(restored.logs);
    setGameStats(restored.stats);
    sound.playCelebration();
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
      {/* Navigation & Controls */}
      <Header
        currentMonth={currentMonth}
        currentYear={currentYear}
        soundEnabled={gameStats.soundEnabled}
        onToggleSound={handleToggleSound}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onResetPhotoPreset={handleResetPhotoPreset}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        isCloudSynced={isCloudSynced}
      />

      {/* Gamification Level & XP Bar */}
      <GamificationBar stats={gameStats} todayCompletion={todayCompletion} />

      {/* Visual Analytics Dashboard (Bar Chart & Rings matching photo) */}
      <AnalyticsDashboard
        days={days}
        weeks={weeks}
        overallPercentage={overallPercentage}
        totalChecks={totalChecks}
        possibleChecks={possibleChecks}
      />

      {/* Monthly Habit Table Matrix */}
      <HabitGrid
        habits={habits}
        logs={logs}
        days={days}
        year={currentYear}
        month={currentMonth}
        onToggleCheck={handleToggleCheck}
        onAddHabitClick={() => setIsAddModalOpen(true)}
        onDeleteHabit={handleDeleteHabit}
      />

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddHabit}
      />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Bottom Footer Credits */}
      <footer className="mt-8 text-center text-xs text-slate-400 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
        <div className="flex items-center gap-2">
          <span>LifeTracker Web Application</span>
          <span>•</span>
          <span className="text-slate-500 font-medium">Ready for Vercel & PostgreSQL / SQLite</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInstructionsOpen(true)}
            className="hover:text-slate-600 underline font-medium"
          >
            Instructions Tab
          </button>
          <span>•</span>
          <button
            onClick={handleResetPhotoPreset}
            className="hover:text-slate-600 underline font-medium"
          >
            Reload Photo Numbers
          </button>
        </div>
      </footer>
    </main>
  );
}

