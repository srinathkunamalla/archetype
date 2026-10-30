import React, { useState } from 'react';
import {
  StaffTask,
  sequenceTasksByUnblockingPriority,
  analyzeArchetypeBalance,
  clusterByContext,
  StaffArchetype,
} from '../utils/prioritization';
import { TaskItem } from './TaskItem';
import {
  Sparkles,
  Users,
  Compass,
  Brain,
  ShieldCheck,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface UnifiedDashboardViewProps {
  tasks: StaffTask[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onShowDelegation: (task: StaffTask) => void;
  onOpenNewTask: () => void;
  onSelectConceptTab: (tab: string) => void;
}

export const UnifiedDashboardView: React.FC<UnifiedDashboardViewProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onShowDelegation,
  onOpenNewTask,
  onSelectConceptTab,
}) => {
  const [filterArchetype, setFilterArchetype] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const archetypeReport = analyzeArchetypeBalance(tasks);
  const unblockSequenced = sequenceTasksByUnblockingPriority(activeTasks);
  const topBlockers = unblockSequenced.filter((t) => t.blockedEngineersCount > 0).slice(0, 3);
  const clusters = clusterByContext(activeTasks);

  const filteredTasks = tasks.filter((t) => {
    if (filterArchetype !== 'all' && t.archetype !== filterArchetype) return false;
    if (searchQuery.trim() && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Archetype Health */}
        <div
          onClick={() => onSelectConceptTab('archetype')}
          className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Archetype Cadence</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 flex items-center gap-0.5">
              Idea 1 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-lg font-bold text-slate-100 capitalize">
            {archetypeReport.dominantArchetype.replace('_', ' ')}
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {archetypeReport.warning ? '⚠️ ' + archetypeReport.warning : 'Healthy balanced cadence'}
          </p>
        </div>

        {/* Metric 2: Unblock Priority */}
        <div
          onClick={() => onSelectConceptTab('unblock')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Downstream Impact</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-amber-400 flex items-center gap-0.5">
              Idea 2 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-lg font-bold text-slate-100">
            {topBlockers.reduce((acc, t) => acc + t.blockedEngineersCount, 0)} Blocked Devs
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {topBlockers.length > 0 ? `${topBlockers.length} blocker items to clear first` : 'No team blockers!'}
          </p>
        </div>

        {/* Metric 3: Context Islands */}
        <div
          onClick={() => onSelectConceptTab('clusters')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Context Islands</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 flex items-center gap-0.5">
              Idea 3 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono">
            {clusters.length} Batched Slots
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            Avoids mental thrashing across tasks
          </p>
        </div>

        {/* Metric 4: Delegation Opportunities */}
        <div
          onClick={() => onSelectConceptTab('delegation')}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff Leverage</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 flex items-center gap-0.5">
              Idea 4 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono">
            {tasks.filter((t) => t.delegationPotential !== 'none').length} Delegatable
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            Grow future tech leads by pairing
          </p>
        </div>
      </div>

      {/* Top Priority Unblockers callout (if any) */}
      {topBlockers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <h4 className="font-bold text-amber-200 text-xs uppercase tracking-wide">
                Morning Unblocking Priority (Do these before standup/focus time)
              </h4>
            </div>
            <button
              onClick={() => onSelectConceptTab('unblock')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View Unblock Sequence</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topBlockers.map((t) => (
              <div
                key={t.id}
                className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-[11px]">
                    <span className="font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Unblocks {t.blockedEngineersCount} devs
                    </span>
                    <span className="text-slate-400">{t.estimatedMinutes}m</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-2">{t.title}</p>
                </div>
                <button
                  onClick={() => onToggleComplete(t.id)}
                  className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mark Unblocked</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Task List with filter bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Today&apos;s Planned Work Stream</h3>
            <p className="text-xs text-slate-400">
              {activeTasks.length} active tasks • {completedTasks.length} completed
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />

            <select
              value={filterArchetype}
              onChange={(e) => setFilterArchetype(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Archetypes</option>
              <option value="architect">Architect</option>
              <option value="multiplier">Multiplier</option>
              <option value="deep_solver">Deep Solver</option>
              <option value="firefighter">Firefighter</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-400 text-xs">
              No tasks match your filter.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onShowDelegation={onShowDelegation}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
