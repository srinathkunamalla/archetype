import React, { useState } from 'react';
import { StaffTask, sequenceTasksByUnblockingPriority, calculateUnblockScore } from '../utils/prioritization';
import { TaskItem } from './TaskItem';
import { Users, AlertTriangle, ArrowRight, Check, Copy, Sparkles, Send, ShieldCheck } from 'lucide-react';

interface UnblockerViewProps {
  tasks: StaffTask[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowDelegation: (task: StaffTask) => void;
  onOpenNewTask: () => void;
}

export const UnblockerView: React.FC<UnblockerViewProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onShowDelegation,
  onOpenNewTask,
}) => {
  const [copiedSlack, setCopiedSlack] = useState(false);
  const sequenced = sequenceTasksByUnblockingPriority(tasks);
  const activeTasks = sequenced.filter((t) => !t.completed);

  // Split into:
  // 1. Immediate Unblocking Tier (blocking >= 1 dev or urgency >= 4)
  // 2. Deep Dive & Architectural Spikes (blocking 0 dev, high impact)
  // 3. Completed
  const unblockers = activeTasks.filter((t) => t.blockedEngineersCount > 0 || t.archetype === 'firefighter');
  const deepSpikes = activeTasks.filter((t) => t.blockedEngineersCount === 0 && t.archetype !== 'firefighter');

  const totalEngineersBlocked = activeTasks.reduce((sum, t) => sum + t.blockedEngineersCount, 0);

  const generateSlackUpdate = () => {
    let update = `🚀 *Daily Focus & Team Unblocking Plan*\n\n`;
    if (unblockers.length > 0) {
      update += `*1️⃣ Morning Unblocking (First Priority - Before 11 AM):*\n`;
      unblockers.forEach((t) => {
        update += `• ${t.title} (${t.blockedEngineersCount > 0 ? `Unblocks ${t.blockedEngineersCount} devs` : 'High Priority'})\n`;
      });
      update += `\n`;
    }

    if (deepSpikes.length > 0) {
      update += `*2️⃣ Afternoon Deep Work / Architecture Spikes (Slow to Slack response):*\n`;
      deepSpikes.forEach((t) => {
        update += `• ${t.title} (~${t.estimatedMinutes}m)\n`;
      });
      update += `\n`;
    }

    update += `_Ping me directly if anything production-critical arises!_`;
    return update;
  };

  const handleCopySlack = () => {
    navigator.clipboard.writeText(generateSlackUpdate());
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Downstream Impact Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/20 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Downstream Dependency Impact</h3>
                <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Unblock First
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff engineer velocity is measured by total organizational throughput. Clear reviews and design contracts first so other engineers can ship.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-2 text-center">
              <span className="text-xl font-mono font-extrabold text-amber-400">{totalEngineersBlocked}</span>
              <span className="block text-[11px] text-slate-400 font-medium">Engineers Blocked</span>
            </div>

            <button
              onClick={handleCopySlack}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              {copiedSlack ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedSlack ? 'Copied to Clipboard!' : 'Copy Slack Status'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Phase Execution Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase 1: Morning Unblockers */}
        <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-200 text-sm">Morning Unblocking Queue</h4>
            </div>
            <span className="text-xs text-amber-400/90 font-medium">
              Run before 11:00 AM
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Items that block peers, PRs, or critical incident remediation. Completing these unlocks multiple team members for the rest of their workday.
          </p>

          <div className="space-y-3 flex-1">
            {unblockers.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                No active team blockers! Your team has full autonomy today.
              </div>
            ) : (
              unblockers.map((t) => (
                <div key={t.id} className="relative">
                  <div className="absolute -left-2 top-3 w-1 h-8 bg-amber-500 rounded-r"></div>
                  <TaskItem
                    task={t}
                    onToggleComplete={onToggleComplete}
                    onDeleteTask={onDeleteTask}
                    onShowDelegation={onShowDelegation}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Phase 2: Afternoon Deep Dive Spikes */}
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-200 text-sm">Afternoon Deep Dive Spikes</h4>
            </div>
            <span className="text-xs text-indigo-400/90 font-medium">
              Protected Focus Hours
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            High strategic impact architecture, RFC drafting, and technology evaluation. Guard this time with status alerts and silenced notifications.
          </p>

          <div className="space-y-3 flex-1">
            {deepSpikes.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                No individual deep work planned. Add an RFC or architectural spike!
              </div>
            ) : (
              deepSpikes.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                  onShowDelegation={onShowDelegation}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
