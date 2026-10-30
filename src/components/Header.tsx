import React from 'react';
import { Compass, Sparkles, Layers, ShieldCheck, Download, RotateCcw, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewTask: () => void;
  onResetData: () => void;
  onExportMarkdown: () => void;
  totalTasks: number;
  completedTasks: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTask,
  onResetData,
  onExportMarkdown,
  totalTasks,
  completedTasks,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">Software Task Compass</h1>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Staff+ SWE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Standalone Daily Work Orchestrator • Zero external DB dependencies
              </p>
            </div>
          </div>

          {/* Quick stats & action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Progress:</span>
              <span className="font-semibold text-slate-100">
                {completedTasks}/{totalTasks} done
              </span>
            </div>

            <button
              onClick={onOpenNewTask}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Planned Work</span>
            </button>

            <button
              onClick={onExportMarkdown}
              title="Export as Markdown for Daily Scratchpad or Slack"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset to sample Software Engineer work"
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Concept Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-800/80 mt-3 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('unified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'unified'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unified Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab('archetype')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'archetype'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center justify-center">1</span>
            <span>Idea 1: Archetype Balancer</span>
          </button>
          <button
            onClick={() => setActiveTab('unblock')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'unblock'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">2</span>
            <span>Idea 2: Downstream Unblocker</span>
          </button>

          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'clusters'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center">3</span>
            <span>Idea 3: Context Island Batcher</span>
          </button>

          <button
            onClick={() => setActiveTab('delegation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'delegation'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">4</span>
            <span>Idea 4: Leverage & Delegate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
