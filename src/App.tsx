import React, { useState, useEffect } from 'react';
import { StaffTask, DEFAULT_STAFF_TASKS, evaluateDelegationOpportunity } from './utils/prioritization';
import { Header } from './components/Header';
import { ConceptBanner, CONCEPTS } from './components/ConceptBanner';
import { ArchetypeBalancerView } from './components/ArchetypeBalancerView';
import { UnblockerView } from './components/UnblockerView';
import { ContextIslandsView } from './components/ContextIslandsView';
import { DelegationPrunerView } from './components/DelegationPrunerView';
import { UnifiedDashboardView } from './components/UnifiedDashboardView';
import { TaskFormModal } from './components/TaskFormModal';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'staff_tasks_compass_v1';

export default function App() {
  const [tasks, setTasks] = useState<StaffTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_STAFF_TASKS;
  });

  const [activeTab, setActiveTab] = useState<string>('unified');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskForDelegation, setSelectedTaskForDelegation] = useState<StaffTask | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // storage unavailable or full
    }
  }, [tasks]);

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (newTaskData: Omit<StaffTask, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: StaffTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks to the sample Staff Engineer workload?')) {
      setTasks(DEFAULT_STAFF_TASKS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportMarkdown = () => {
    let md = `# Software Engineer Daily Work Compass\n`;
    md += `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;

    md += `## 🚀 Morning Unblocking Priority\n`;
    tasks
      .filter((t) => !t.completed && (t.blockedEngineersCount > 0 || t.archetype === 'firefighter'))
      .forEach((t) => {
        md += `- [ ] **${t.title}** (${t.category}) — Unblocks ${t.blockedEngineersCount} engineers [~${t.estimatedMinutes}m]\n`;
      });

    md += `\n## 🛡️ Strategic Architecture & Deep Spikes\n`;
    tasks
      .filter((t) => !t.completed && t.blockedEngineersCount === 0)
      .forEach((t) => {
        md += `- [ ] **${t.title}** (${t.archetype}) — Reach: ${t.reach} [~${t.estimatedMinutes}m]\n`;
      });

    md += `\n## ✅ Completed Today\n`;
    tasks
      .filter((t) => t.completed)
      .forEach((t) => {
        md += `- [x] ~${t.title}~\n`;
      });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-engineer-workplan-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header with App Title and Concept Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTask={() => setIsModalOpen(true)}
        onResetData={handleResetData}
        onExportMarkdown={handleExportMarkdown}
        totalTasks={tasks.length}
        completedTasks={completedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Concept Banner showing the requested format */}
        <ConceptBanner currentTab={activeTab} />

        {/* Tab Views */}
        {activeTab === 'unified' && (
          <UnifiedDashboardView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onShowDelegation={(task) => {
              setSelectedTaskForDelegation(task);
              setActiveTab('delegation');
            }}
            onOpenNewTask={() => setIsModalOpen(true)}
            onSelectConceptTab={setActiveTab}
          />
        )}

        {activeTab === 'archetype' && (
          <ArchetypeBalancerView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onShowDelegation={setSelectedTaskForDelegation}
            onOpenNewTask={() => setIsModalOpen(true)}
          />
        )}

        {activeTab === 'unblock' && (
          <UnblockerView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onShowDelegation={setSelectedTaskForDelegation}
            onOpenNewTask={() => setIsModalOpen(true)}
          />
        )}

        {activeTab === 'clusters' && (
          <ContextIslandsView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onShowDelegation={setSelectedTaskForDelegation}
            onOpenNewTask={() => setIsModalOpen(true)}
          />
        )}

        {activeTab === 'delegation' && (
          <DelegationPrunerView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onShowDelegation={setSelectedTaskForDelegation}
            onOpenNewTask={() => setIsModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          Software Engineer Task Compass • Standalone client-side application • No external databases or tracking
        </p>
      </footer>

      {/* Add Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
