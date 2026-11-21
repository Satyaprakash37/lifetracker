'use client';

import React, { useState } from 'react';
import { Achievement } from '@/types';
import { Trophy, Lock, Award, ShieldCheck, ArrowRight } from 'lucide-react';

interface AchievementsShowcaseProps {
  achievements: Achievement[];
  overallPercentage: number;
  userName: string;
}

export const AchievementsShowcase: React.FC<AchievementsShowcaseProps> = ({
  achievements,
  overallPercentage,
  userName,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  // Filter stage badges in strict order 1 to 5
  const stageBadges = achievements
    .filter((a) => a.type === 'percentage')
    .sort((a, b) => a.stageOrder - b.stageOrder);

  // Find next eligible locked stage
  const nextStageBadge = stageBadges.find((a) => !a.unlocked);

  const progressToNext = nextStageBadge
    ? Math.min(Math.round((overallPercentage / nextStageBadge.requirement) * 100), 100)
    : 100;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 mb-6 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Serial Stage Milestones & Discipline Badges
              </h3>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                {unlockedCount}/{totalCount} Unlocked
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anti-Cheat Guard: Must unlock Stage 1 (20%) → Stage 2 (40%) → Stage 3 (60%) in strict order!</span>
            </p>
          </div>
        </div>

        {/* Next Stage Target Meter */}
        {nextStageBadge && (
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 w-full sm:w-auto">
            <div className="text-right min-w-[130px]">
              <div className="text-[10px] font-semibold text-slate-500">
                Target: <strong className="text-slate-800">{nextStageBadge.stageLabel}</strong>
              </div>
              <div className="text-[10px] text-indigo-600 font-bold">
                {overallPercentage.toFixed(1)}% / {nextStageBadge.requirement}%
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Strict Serial Progression Pipeline */}
      <div className="mt-3.5 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-[800px]">
          {achievements.map((badge, idx) => {
            const isUnlocked = badge.unlocked;

            // Check if prerequisite is locked
            const prereqBadge = badge.prerequisiteId
              ? achievements.find((a) => a.id === badge.prerequisiteId)
              : null;
            const isPrereqLocked = prereqBadge ? !prereqBadge.unlocked : false;

            return (
              <React.Fragment key={badge.id}>
                <div
                  onClick={() => setSelectedBadge(badge)}
                  className={`flex-1 min-w-[125px] max-w-[160px] p-2.5 rounded-xl border cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300 shadow-2xs hover:shadow-sm ring-1 ring-amber-400/30'
                      : isPrereqLocked
                      ? 'bg-slate-100/60 border-slate-200 opacity-40 hover:opacity-70'
                      : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-90'
                  }`}
                >
                  {/* Badge Icon & Lock */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="relative text-2xl select-none">
                      {badge.icon}
                      {isUnlocked && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                      )}
                    </div>
                    {!isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>

                  {/* Title & Stage */}
                  <div className="font-bold text-[11px] text-slate-900 truncate" title={badge.title}>
                    {badge.title}
                  </div>
                  <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight truncate">
                    {badge.stageLabel}
                  </div>

                  {/* Status Note */}
                  <div className="mt-1.5 text-[9px] font-bold">
                    {isUnlocked ? (
                      <span className="text-emerald-600 font-extrabold">✓ Achieved</span>
                    ) : isPrereqLocked ? (
                      <span className="text-slate-400 italic">Locked by {prereqBadge?.stageLabel}</span>
                    ) : (
                      <span className="text-indigo-600">Eligible ({badge.requirement}%)</span>
                    )}
                  </div>
                </div>

                {/* Arrow between sequential stages */}
                {badge.type === 'percentage' && badge.stageOrder < 5 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 select-none" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Badge Click Info Tooltip/Popup */}
      {selectedBadge && (
        <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedBadge.icon}</span>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{selectedBadge.title}</span>
                <span className="text-[10px] text-amber-300 font-normal">({selectedBadge.stageLabel})</span>
                {selectedBadge.unlocked && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700">
                    Achieved
                  </span>
                )}
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">{selectedBadge.description}</div>
              {selectedBadge.prerequisiteId && (
                <div className="text-amber-400 text-[10px] mt-0.5 font-semibold">
                  🛡️ Strict prerequisite: Must conquer {achievements.find(a => a.id === selectedBadge.prerequisiteId)?.stageLabel} first!
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedBadge(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
