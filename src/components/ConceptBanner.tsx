import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

export interface ConceptDefinition {
  id: string;
  number: number;
  name: string;
  process: string;
  output: string;
  guide: string;
  fullTemplate: string;
  tagline: string;
  staffChallenge: string;
}

export const CONCEPTS: Record<string, ConceptDefinition> = {
  archetype: {
    id: 'archetype',
    number: 1,
    name: 'Staff Archetype & Energy Balancer',
    process: 'role-archetype categorization (Multiplier, Architect, Firefighter, Deep Solver) paired with cognitive energy estimation',
    output: 'a balanced daily cadence chart and anti-fragmentation schedule',
    guide: 'my focus between high-leverage organizational unblocking and uninterrupted engineering spikes',
    fullTemplate: 'My app takes planned work for today and does role-archetype categorization (Multiplier, Architect, Firefighter, Deep Solver) paired with cognitive energy estimation to create a balanced daily cadence chart and anti-fragmentation schedule that helps me prioritize my work and guide my focus between high-leverage organizational unblocking and uninterrupted engineering spikes.',
    tagline: 'Balance the 4 hats of a Staff Engineer so reactive fire-fighting doesn’t starve long-term architectural health.',
    staffChallenge: 'Staff engineers often end the day feeling exhausted after 20 minor code reviews and Slack threads, having made zero progress on the 6-month architectural roadmap.',
  },
  unblock: {
    id: 'unblock',
    number: 2,
    name: 'Downstream Unblocker & Dependency Cascade Sequencer',
    process: 'downstream team dependency mapping and critical-path bottleneck analysis',
    output: 'an "Unblock First, Deep Dive Second" ordered execution queue with real-time Slack/status snippet generators',
    guide: 'my day so other engineers aren’t waiting on my reviews, approvals, or schema decisions to ship their code',
    fullTemplate: 'My app takes planned work for today and does downstream team dependency mapping and critical-path bottleneck analysis to create an "Unblock First, Deep Dive Second" ordered execution queue with real-time Slack/status snippet generators that helps me prioritize my work and guide my day so other engineers aren’t waiting on my reviews, approvals, or schema decisions to ship their code.',
    tagline: 'Staff engineer time is an organizational multiplier. Clear other teams’ path in the first 60 minutes.',
    staffChallenge: 'A 2-hour delay on your RFC review or PR approval can stall 5 junior/mid engineers for an entire sprint day.',
  },
  clusters: {
    id: 'clusters',
    number: 3,
    name: 'Context-Switching Minimizer & Focus Island Clustor',
    process: 'cognitive context-switching cost scoring based on mental domain transitions and meeting anchors',
    output: 'batched 45-to-90 minute "focus islands" with pre-computed task transition checklists',
    guide: 'my progression through fragmented days without mental exhaustion or task-thrashing',
    fullTemplate: 'My app takes planned work for today and does cognitive context-switching cost scoring based on mental domain transitions and meeting anchors to create batched 45-to-90 minute "focus islands" with pre-computed task transition checklists that helps me prioritize my work and guide my progression through fragmented days without mental exhaustion or task-thrashing.',
    tagline: 'Eliminate the 20-minute ramp-up penalty between jumping from distributed systems code to hiring committee reviews.',
    staffChallenge: 'Jumping back and forth between deep code, mentorship 1:1s, and cloud infrastructure drains working memory.',
  },
  delegation: {
    id: 'delegation',
    number: 4,
    name: 'Staff-Impact Value Matrix & Delegate/Drop Pruner',
    process: 'high-leverage impact evaluation (assessing organizational reach vs. immediate urgency vs. delegation opportunity)',
    output: 'a 3-tier "Lead, Delegate/Pair, or Politely Decline" action blueprint with structured decline/handoff templates',
    guide: 'my commitment boundaries so I only execute on true Tier-1 staff-level problems while growing other engineers',
    fullTemplate: 'My app takes planned work for today and does high-leverage impact evaluation (assessing organizational reach vs. immediate urgency vs. delegation opportunity) to create a 3-tier "Lead, Delegate/Pair, or Politely Decline" action blueprint with structured decline/handoff templates that helps me prioritize my work and guide my commitment boundaries so I only execute on true Tier-1 staff-level problems while growing other engineers.',
    tagline: 'Saying no (or pairing) is the most impactful technical leadership skill. Grow future tech leads.',
    staffChallenge: 'Everyone asks the Staff engineer to solve their weird bugs and join their syncs, turning you into a high-paid triage queue.',
  },
};

interface ConceptBannerProps {
  currentTab: string;
}

export const ConceptBanner: React.FC<ConceptBannerProps> = ({ currentTab }) => {
  const [copied, setCopied] = React.useState(false);
  const concept = CONCEPTS[currentTab];

  if (!concept) {
    return (
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 rounded-xl p-5 mb-6 text-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold text-slate-200">Staff Engineer Standalone Orchestrator</h2>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-mono">
            4 Interactive Prototypes
          </span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed max-w-4xl">
          You are viewing the <strong className="text-slate-200">Unified Cockpit</strong>, which integrates all 4 suggested concepts.
          Click through tabs <strong className="text-indigo-300">Idea 1, 2, 3, or 4</strong> above to inspect the specific process, output, and guidance formula for each model.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(concept.fullTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 border border-slate-800 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center justify-center">
            {concept.number}
          </span>
          <h2 className="font-bold text-slate-100 text-base">{concept.name}</h2>
        </div>
        <button
          onClick={handleCopy}
          className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied Template!' : 'Copy Idea Template'}</span>
        </button>
      </div>

      <p className="text-xs text-indigo-300/90 italic mb-4">
        &ldquo;{concept.tagline}&rdquo;
      </p>

      {/* Formatted Template Box */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed mb-4">
        <span className="text-slate-500 select-none">"My app takes planned work for today and does </span>
        <span className="text-indigo-400 font-semibold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">
          {concept.process}
        </span>
        <span className="text-slate-500 select-none"> to create </span>
        <span className="text-cyan-400 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
          {concept.output}
        </span>
        <span className="text-slate-500 select-none"> that helps me prioritize my work and guide </span>
        <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
          {concept.guide}
        </span>
        <span className="text-slate-500 select-none">"</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-800/70">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Staff Problem:
          </span>
          <p className="text-slate-300">{concept.staffChallenge}</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
            Engineered Process:
          </span>
          <p className="text-slate-300">{concept.process}</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Delivered Value:
          </span>
          <p className="text-slate-300">{concept.output}</p>
        </div>
      </div>
    </div>
  );
};
