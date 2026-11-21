'use client';

import React from 'react';
import { X, CheckCircle2, Trophy, BarChart3, Flame } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              LifeTracker • Instructions & Game Rules
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 text-sm block mb-1">Stay Disciplined Like a Game</strong>
              Every habit completed awards you <strong>+10 XP</strong>. Completing 100% of your habits in a single day triggers confetti celebration and bonus <strong>+50 XP</strong>!
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <BarChart3 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 text-sm block mb-1">Visual Analytics Dashboard</strong>
              The top bar charts show your daily performance across Week 1, Week 2, Week 3, and Week 4. Circular donut rings give you instant feedback on weekly completion.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <Flame className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 text-sm block mb-1">Streak & Database Persistence</strong>
              All habit logs are saved locally and synced with the database. You can customize habits, add new ones, or reset anytime using the &quot;Photo Preset&quot; button.
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
          >
            Got It! Let&apos;s Track
          </button>
        </div>
      </div>
    </div>
  );
};

