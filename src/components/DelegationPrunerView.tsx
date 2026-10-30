import React, { useState } from 'react';
import {
  StaffTask,
  evaluateDelegationOpportunity,
  calculateStaffLeverageScore,
  DelegationRecommendation,
} from '../utils/prioritization';
import { TaskItem } from './TaskItem';
import { ShieldCheck, Copy, Check, Users, Sparkles, AlertCircle, ArrowUpRight, MessageSquare } from 'lucide-react';

interface DelegationPrunerViewProps {
  tasks: StaffTask[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowDelegation: (task: StaffTask) => void;
  onOpenNewTask: () => void;
}

export const DelegationPrunerView: React.FC<DelegationPrunerViewProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onShowDelegation,
  onOpenNewTask,
}) => {
  const [selectedTaskForTemplate, setSelectedTaskForTemplate] = useState<StaffTask | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const activeTasks = tasks.filter((t) => !t.completed);

  // Group by recommendations
  const leadTasks: StaffTask[] = [];
  const pairTasks: StaffTask[] = [];
  const delegateTasks: StaffTask[] = [];
  const declineTasks: StaffTask[] = [];

  activeTasks.forEach((task) => {
    const rec = evaluateDelegationOpportunity(task);
    if (rec.action === 'Execute Directly') leadTasks.push(task);
    else if (rec.action === 'Pair & Mentor') pairTasks.push(task);
    else if (rec.action === 'Delegate to Team') delegateTasks.push(task);
    else declineTasks.push(task);
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/20 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Staff Leverage &amp; Delegation Pruner</h3>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Multiplier Lens
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff engineers build leverage by turning problems into growth opportunities for other engineers instead of being a single point of failure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-center">
              <span className="text-xs text-slate-400 block">Can Delegate/Pair:</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {pairTasks.length + delegateTasks.length} tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quadrant 1: Lead & Execute Directly */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <h4 className="font-bold text-slate-200 text-sm">Lead &amp; Execute (Staff Core)</h4>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold">{leadTasks.length}</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            High strategic leverage, cross-team architecture, or critical-path technical leadership.
          </p>
          <div className="space-y-2.5 flex-1">
            {leadTasks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                No tasks in this category.
              </div>
            ) : (
              leadTasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                  onShowDelegation={setSelectedTaskForTemplate}
                  compact
                />
              ))
            )}
          </div>
        </div>

        {/* Quadrant 2: Pair & Mentor */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h4 className="font-bold text-slate-200 text-sm">Pair &amp; Mentor (Knowledge Transfer)</h4>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">{pairTasks.length}</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Co-design or pair for 45 mins, then hand over implementation to mentor future tech leads.
          </p>
          <div className="space-y-2.5 flex-1">
            {pairTasks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                No pairing candidates.
              </div>
            ) : (
              pairTasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                  onShowDelegation={setSelectedTaskForTemplate}
                  compact
                />
              ))
            )}
          </div>
        </div>

        {/* Quadrant 3: Delegate to Team */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h4 className="font-bold text-slate-200 text-sm">Delegate to Team (Stretch Opportunity)</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">{delegateTasks.length}</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Standard component or feature work. Great stretch project for a mid/senior engineer.
          </p>
          <div className="space-y-2.5 flex-1">
            {delegateTasks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                No tasks to delegate.
              </div>
            ) : (
              delegateTasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                  onShowDelegation={setSelectedTaskForTemplate}
                  compact
                />
              ))
            )}
          </div>
        </div>

        {/* Quadrant 4: Decline / Renegotiate */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <h4 className="font-bold text-slate-200 text-sm">Decline / Renegotiate (Boundary Shield)</h4>
            </div>
            <span className="text-xs font-mono text-rose-400 font-semibold">{declineTasks.length}</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Low strategic leverage with artificial urgency. Protect your focus with high-agency boundaries.
          </p>
          <div className="space-y-2.5 flex-1">
            {declineTasks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                Clean boundaries! No busywork tasks detected.
              </div>
            ) : (
              declineTasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                  onShowDelegation={setSelectedTaskForTemplate}
                  compact
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Task Communication Helper Modal */}
      {selectedTaskForTemplate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-slate-100 text-sm">Software Communication Assistant</h4>
              </div>
              <button
                onClick={() => setSelectedTaskForTemplate(null)}
                className="text-slate-400 hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-1">Task:</span>
              <p className="text-sm font-semibold text-slate-200">{selectedTaskForTemplate.title}</p>
            </div>

            {(() => {
              const rec = evaluateDelegationOpportunity(selectedTaskForTemplate);
              return (
                <div className="space-y-4">
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg text-xs">
                    <span className="text-indigo-400 font-semibold block mb-1">Action: {rec.action}</span>
                    <p className="text-slate-300">{rec.rationale}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-300">Suggested Message (Copy for Slack):</span>
                      <button
                        onClick={() => handleCopy(rec.suggestedTemplate)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTemplate ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {rec.suggestedTemplate}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedTaskForTemplate(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg cursor-pointer transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
