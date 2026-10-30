import React from 'react';
import { StaffTask, StaffArchetype } from '../utils/prioritization';
import { CheckCircle2, Circle, Clock, Users, Shield, Target, Trash2, ArrowUpRight } from 'lucide-react';

interface TaskItemProps {
  task: StaffTask;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowDelegation?: (task: StaffTask) => void;
  compact?: boolean;
}

const ARCHETYPE_CONFIG: Record<StaffArchetype, { label: string; color: string; bg: string; border: string }> = {
  architect: {
    label: 'Architect',
    color: 'text-indigo-300',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  multiplier: {
    label: 'Multiplier',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  deep_solver: {
    label: 'Deep Solver',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  firefighter: {
    label: 'Firefighter',
    color: 'text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onShowDelegation,
  compact = false,
}) => {
  const archetypeStyle = ARCHETYPE_CONFIG[task.archetype] || ARCHETYPE_CONFIG.architect;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-md hover:shadow-slate-950/40'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start gap-3">
        {/* Completion checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" completed`}
          className="mt-0.5 text-slate-500 hover:text-indigo-400 transition cursor-pointer flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${archetypeStyle.bg} ${archetypeStyle.color} ${archetypeStyle.border}`}
            >
              {archetypeStyle.label}
            </span>

            <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
              {task.category}
            </span>

            {task.blockedEngineersCount > 0 && (
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Unblocks {task.blockedEngineersCount} {task.blockedEngineersCount === 1 ? 'dev' : 'devs'}</span>
              </span>
            )}

            <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{task.estimatedMinutes}m</span>
            </span>
          </div>

          <p
            className={`text-sm font-medium text-slate-100 leading-snug break-words ${
              task.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </p>

          {!compact && (
            <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-slate-500" />
                <span>Impact: {task.strategicImpact}/5</span>
              </div>

              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="capitalize">Reach: {task.reach}</span>
              </div>

              {task.delegationPotential !== 'none' && (
                <button
                  onClick={() => onShowDelegation && onShowDelegation(task)}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition cursor-pointer"
                >
                  <span>
                    {task.delegationPotential === 'ready_to_delegate' ? 'Can Delegate' : 'Pair & Mentor'}
                  </span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={() => onDeleteTask(task.id)}
                aria-label={`Delete task "${task.title}"`}
                className="opacity-0 group-hover:opacity-100 ml-auto text-slate-500 hover:text-rose-400 transition cursor-pointer p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
