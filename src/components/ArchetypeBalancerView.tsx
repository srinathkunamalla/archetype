import React from 'react';
import { StaffTask, analyzeArchetypeBalance, StaffArchetype } from '../utils/prioritization';
import { TaskItem } from './TaskItem';
import { ShieldAlert, Award, Compass, Sparkles, Clock, Flame, Users, Lightbulb } from 'lucide-react';

interface ArchetypeBalancerViewProps {
  tasks: StaffTask[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowDelegation: (task: StaffTask) => void;
  onOpenNewTask: () => void;
}

const ARCHETYPES_META: Record<StaffArchetype, { name: string; desc: string; color: string; bg: string; border: string }> = {
  architect: {
    name: 'Architect',
    desc: 'RFCs, system boundaries, ADRs, and tech strategy.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
  },
  multiplier: {
    name: 'Multiplier',
    desc: 'Unblocking others, PR reviews, 1:1 mentorship, cross-team talks.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
  },
  deep_solver: {
    name: 'Deep Solver',
    desc: 'Complex bug spikes, hard algorithmic kernels, reference prototypes.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
  },
  firefighter: {
    name: 'Firefighter',
    desc: 'Urgent production incidents, oncall escalations, broken pipelines.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
  },
};

export const ArchetypeBalancerView: React.FC<ArchetypeBalancerViewProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onShowDelegation,
  onOpenNewTask,
}) => {
  const report = analyzeArchetypeBalance(tasks);
  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="space-y-6">
      {/* Cadence & Energy Breakdown Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-base">Today&apos;s Staff Archetype Cadence</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target healthy Staff balance: ~30-40% Multiplier, 25-35% Architect, 20-30% Deep Solver, &lt;15% Firefighter
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Planned Active Work:</span>
            <strong className="text-white font-mono">{report.totalMinutes} mins ({(report.totalMinutes / 60).toFixed(1)}h)</strong>
          </div>
        </div>

        {/* Visual Progress Stacked Bar */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
            {report.percentages.multiplier > 0 && (
              <div
                style={{ width: `${report.percentages.multiplier}%` }}
                className="bg-emerald-500 rounded-l-full transition-all duration-500"
                title={`Multiplier: ${report.percentages.multiplier}%`}
              />
            )}
            {report.percentages.architect > 0 && (
              <div
                style={{ width: `${report.percentages.architect}%` }}
                className="bg-indigo-500 transition-all duration-500"
                title={`Architect: ${report.percentages.architect}%`}
              />
            )}
            {report.percentages.deep_solver > 0 && (
              <div
                style={{ width: `${report.percentages.deep_solver}%` }}
                className="bg-cyan-500 transition-all duration-500"
                title={`Deep Solver: ${report.percentages.deep_solver}%`}
              />
            )}
            {report.percentages.firefighter > 0 && (
              <div
                style={{ width: `${report.percentages.firefighter}%` }}
                className="bg-rose-500 rounded-r-full transition-all duration-500"
                title={`Firefighter: ${report.percentages.firefighter}%`}
              />
            )}
          </div>

          {/* Archetype mini cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {(Object.keys(ARCHETYPES_META) as StaffArchetype[]).map((arch) => {
              const meta = ARCHETYPES_META[arch];
              const pct = report.percentages[arch] || 0;
              const isDominant = report.dominantArchetype === arch && report.totalMinutes > 0;

              return (
                <div
                  key={arch}
                  className={`p-3 rounded-lg border text-xs transition ${
                    isDominant ? `${meta.bg} ${meta.border}` : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${meta.color}`}>{meta.name}</span>
                    <span className="font-mono font-bold text-slate-100">{pct}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{meta.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning & Recommendation Callout */}
        {report.warning ? (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">{report.warning}</strong>
              <p className="text-amber-300/80 leading-relaxed">{report.recommendation}</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3.5 flex items-start gap-3 text-xs text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Balanced Staff Cadence</strong>
              <p className="text-emerald-300/80 leading-relaxed">{report.recommendation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Task List Grouped by Archetype */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-200 text-sm">Tasks Organised by Staff Responsibility</h4>
          <span className="text-xs text-slate-400">{activeTasks.length} active tasks today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(ARCHETYPES_META) as StaffArchetype[]).map((arch) => {
            const archTasks = tasks.filter((t) => t.archetype === arch);
            const meta = ARCHETYPES_META[arch];

            return (
              <div key={arch} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${meta.color.replace('text-', 'bg-')}`}></span>
                    <span className="font-semibold text-slate-200 text-xs">{meta.name}</span>
                    <span className="text-[11px] text-slate-500">({archTasks.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {archTasks.reduce((acc, t) => acc + (t.completed ? 0 : t.estimatedMinutes), 0)}m remaining
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {archTasks.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800/80 rounded-lg text-slate-500 text-xs">
                      No {meta.name.toLowerCase()} tasks planned today.
                    </div>
                  ) : (
                    archTasks.map((t) => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        onToggleComplete={onToggleComplete}
                        onDeleteTask={onDeleteTask}
                        onShowDelegation={onShowDelegation}
                        compact
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
