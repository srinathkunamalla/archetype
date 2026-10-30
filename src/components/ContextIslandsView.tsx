import React, { useState } from 'react';
import { StaffTask, clusterByContext, FocusCluster } from '../utils/prioritization';
import { TaskItem } from './TaskItem';
import { Layers, Brain, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContextIslandsViewProps {
  tasks: StaffTask[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowDelegation: (task: StaffTask) => void;
  onOpenNewTask: () => void;
}

export const ContextIslandsView: React.FC<ContextIslandsViewProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onShowDelegation,
  onOpenNewTask,
}) => {
  const clusters = clusterByContext(tasks);
  const distinctCategories = new Set(tasks.filter((t) => !t.completed).map((t) => t.category)).size;

  // Each unbatched context switch costs ~20 mins of cognitive recovery time
  const contextSwitchPenaltyMinutes = Math.max(0, (distinctCategories - 2) * 20);

  return (
    <div className="space-y-6">
      {/* Context Switch Cost Metric */}
      <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Cognitive Focus Islands</h3>
                <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Anti-Thrash Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Switching mental domains (e.g. from distributed systems consensus to org mentorship) costs ~20 minutes of ramp-up time.
                Tasks are batched into cohesive focus blocks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2">
              <span className="text-xs text-slate-400 block">Domain Clusters:</span>
              <span className="text-base font-bold text-cyan-300 font-mono">{clusters.length} active islands</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2">
              <span className="text-xs text-slate-400 block">Estimated Time Saved:</span>
              <span className="text-base font-bold text-emerald-400 font-mono">~{contextSwitchPenaltyMinutes} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Islands Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-200 text-sm">Today&apos;s Batched Focus Islands</h4>
          <span className="text-xs text-slate-400">Sequenced by cognitive demand</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((cluster, idx) => {
            const completedCount = cluster.tasks.filter((t) => t.completed).length;

            return (
              <div
                key={cluster.category}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-100 text-sm">{cluster.category}</h5>
                      <span className="text-[11px] text-cyan-400/90 font-medium">
                        Slot: {cluster.suggestedSlot}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-mono font-bold text-slate-200 block">{cluster.totalMinutes}m</span>
                    <span className="text-[11px] text-slate-400">{completedCount}/{cluster.tasks.length} done</span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1 mb-3">
                  {cluster.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDeleteTask={onDeleteTask}
                      onShowDelegation={onShowDelegation}
                      compact
                    />
                  ))}
                </div>

                {/* Transition Helper Footer */}
                <div className="mt-auto pt-2.5 border-t border-slate-800/60 bg-slate-950/40 -mx-4 -mb-4 px-4 py-2.5 rounded-b-xl flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Single-context focus lock</span>
                  </span>
                  <span className="text-slate-500 font-mono">Zero tab-hopping</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Transition Ritual */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs">
        <h5 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>Staff Transition Checklist (Run before jumping between Focus Islands)</span>
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-400">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-slate-200 block mb-0.5">1. Checkpoint Context</span>
            <span>Push draft commit or write 2-bullet state summary in your scratchpad.</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-slate-200 block mb-0.5">2. Close Domain Tabs</span>
            <span>Close Slack channels and PR tabs of previous domain to eliminate ambient interruptions.</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-slate-200 block mb-0.5">3. 2-Min Reset</span>
            <span>Hydrate or step away before loading the next domain&apos;s mental model.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
