import React, { useState } from 'react';
import { StaffTask, StaffArchetype, OrganizationalReach } from '../utils/prioritization';
import { Plus, X, Sparkles, Clock, Users, Shield, Target } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<StaffTask, 'id' | 'createdAt' | 'completed'>) => void;
}

const PRESETS = [
  {
    title: 'Review System Design RFC & Schema Contract',
    category: 'Architecture',
    archetype: 'architect' as StaffArchetype,
    estimatedMinutes: 60,
    blockedEngineersCount: 3,
    reach: 'group' as OrganizationalReach,
    urgency: 4 as const,
    strategicImpact: 5 as const,
    delegationPotential: 'none' as const,
  },
  {
    title: 'Unblock Critical Path Feature PR (Review & Sign-off)',
    category: 'Squad Unblock',
    archetype: 'firefighter' as StaffArchetype,
    estimatedMinutes: 25,
    blockedEngineersCount: 2,
    reach: 'team' as OrganizationalReach,
    urgency: 5 as const,
    strategicImpact: 3 as const,
    delegationPotential: 'none' as const,
  },
  {
    title: 'Hands-on Spike: Zero-Downtime Migration Sandbox',
    category: 'Core Infra',
    archetype: 'deep_solver' as StaffArchetype,
    estimatedMinutes: 90,
    blockedEngineersCount: 0,
    reach: 'company' as OrganizationalReach,
    urgency: 3 as const,
    strategicImpact: 5 as const,
    delegationPotential: 'good_mentorship' as const,
  },
  {
    title: '1:1 Technical Mentoring & Design Pairing with Senior Dev',
    category: 'Mentorship',
    archetype: 'multiplier' as StaffArchetype,
    estimatedMinutes: 45,
    blockedEngineersCount: 1,
    reach: 'individual' as OrganizationalReach,
    urgency: 3 as const,
    strategicImpact: 4 as const,
    delegationPotential: 'none' as const,
  },
];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [archetype, setArchetype] = useState<StaffArchetype>('architect');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [blockedEngineersCount, setBlockedEngineersCount] = useState(0);
  const [reach, setReach] = useState<OrganizationalReach>('team');
  const [urgency, setUrgency] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [strategicImpact, setStrategicImpact] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [delegationPotential, setDelegationPotential] = useState<'none' | 'good_mentorship' | 'ready_to_delegate'>('none');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category: category.trim() || 'General',
      archetype,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      blockedEngineersCount: Number(blockedEngineersCount) || 0,
      reach,
      urgency,
      strategicImpact,
      delegationPotential,
    });

    onClose();
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setArchetype(preset.archetype);
    setEstimatedMinutes(preset.estimatedMinutes);
    setBlockedEngineersCount(preset.blockedEngineersCount);
    setReach(preset.reach);
    setUrgency(preset.urgency);
    setStrategicImpact(preset.strategicImpact);
    setDelegationPotential(preset.delegationPotential);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Add Planned Work for Today</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Staff SWE Quick Presets:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition cursor-pointer"
              >
                {p.category}: {p.title.split(' ')[0]}...
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Task Description / Objective</label>
            <input
              type="text"
              required
              placeholder="e.g. Review Auth & Permissions RFC for Platform v2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Domain / Category</label>
              <input
                type="text"
                placeholder="e.g. Architecture, Core Infra"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Staff Archetype</label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value as StaffArchetype)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="architect">Architect (RFCs, Systems)</option>
                <option value="multiplier">Multiplier (Mentorship, Reviews)</option>
                <option value="deep_solver">Deep Solver (Hard Spikes)</option>
                <option value="firefighter">Firefighter (Incidents, Escalations)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Estimated Minutes</label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Blocked Engineers Count
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={blockedEngineersCount}
                onChange={(e) => setBlockedEngineersCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Organizational Reach</label>
              <select
                value={reach}
                onChange={(e) => setReach(e.target.value as OrganizationalReach)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="individual">Individual</option>
                <option value="team">Team (1 squad)</option>
                <option value="group">Group / Department (3-5 squads)</option>
                <option value="company">Company-wide</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Strategic Impact (1-5)</label>
              <select
                value={strategicImpact}
                onChange={(e) => setStrategicImpact(Number(e.target.value) as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={1}>1 - Low Tactical</option>
                <option value={2}>2 - Minor Fix</option>
                <option value={3}>3 - Squad Milestone</option>
                <option value={4}>4 - High Technical Leverage</option>
                <option value={5}>5 - Transformational / Core Architecture</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Delegation / Mentorship Potential</label>
            <select
              value={delegationPotential}
              onChange={(e) => setDelegationPotential(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="none">Staff Must Drive Directly (No Delegation)</option>
              <option value="good_mentorship">Great Opportunity to Pair / Mentor a Senior SWE</option>
              <option value="ready_to_delegate">Ready to Delegate to Squad / Feature Owner</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition shadow-md shadow-indigo-600/30"
            >
              Add to Work Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
