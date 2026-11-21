'use client';

import React from 'react';
import { Achievement } from '@/types';
import { Sparkles, Trophy, CheckCircle, Award } from 'lucide-react';

interface AchievementUnlockedModalProps {
  achievement: Achievement | null;
  userName: string;
  onClose: () => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  achievement,
  userName,
  onClose,
}) => {
  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-amber-400/80 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center text-white shadow-2xl shadow-amber-500/20 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Background glow effects */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>New Achievement Unlocked!</span>
        </div>

        {/* Huge Badge Icon */}
        <div className="my-3 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-amber-400/80 flex items-center justify-center text-5xl shadow-xl shadow-amber-400/20 animate-bounce">
              {achievement.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-md font-bold text-xs ring-4 ring-slate-900">
              <Trophy className="w-4 h-4 fill-slate-900" />
            </div>
          </div>
        </div>

        {/* Stage & Title */}
        <div className="mt-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
            {achievement.stageLabel}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {achievement.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed px-2">
          {achievement.description}
        </p>

        {/* Personalized Affirmation Note */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-200 font-medium">
          🔥 Congratulations, <strong className="text-white font-bold">{userName}</strong>! Your discipline is compounding. Keep completing tasks to unlock the next stage!
        </div>

        {/* Claim Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Claim Badge & Keep Focused</span>
          </button>
        </div>
      </div>
    </div>
  );
};

