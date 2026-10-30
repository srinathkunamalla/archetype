/**
 * Staff Software Engineer Prioritization and Orchestration Engine
 * Pure logic module for task scoring, archetype balancing, dependency sequencing,
 * context clustering, and delegation analysis.
 */

export type StaffArchetype = 'architect' | 'multiplier' | 'deep_solver' | 'firefighter';

export type OrganizationalReach = 'individual' | 'team' | 'group' | 'company';

export type CognitiveEnergy = 'deep_focus' | 'collaborative' | 'light_admin' | 'reactive';

export interface StaffTask {
  id: string;
  title: string;
  category: string; // e.g. "Core Platform", "Auth RFC", "Payments", "Mentorship"
  archetype: StaffArchetype;
  estimatedMinutes: number;
  blockedEngineersCount: number; // Downstream impact
  reach: OrganizationalReach;
  urgency: 1 | 2 | 3 | 4 | 5; // 1 lowest, 5 highest
  strategicImpact: 1 | 2 | 3 | 4 | 5; // 1 lowest, 5 highest
  delegationPotential: 'none' | 'good_mentorship' | 'ready_to_delegate';
  completed: boolean;
  notes?: string;
  createdAt: number;
}

export interface ArchetypeBalanceReport {
  percentages: Record<StaffArchetype, number>;
  totalMinutes: number;
  dominantArchetype: StaffArchetype;
  warning?: string;
  recommendation: string;
}

export interface FocusCluster {
  category: string;
  totalMinutes: number;
  tasks: StaffTask[];
  suggestedSlot: 'Morning Unblock' | 'Prime Deep Work' | 'Afternoon Collaboration' | 'End of Day Triage';
}

export interface DelegationRecommendation {
  action: 'Execute Directly' | 'Pair & Mentor' | 'Delegate to Team' | 'Decline / Renegotiate';
  rationale: string;
  suggestedTemplate: string;
}

/**
 * Calculates downstream unblocking score.
 * Staff engineers provide maximum leverage by clearing paths for their teams first.
 */
export function calculateUnblockScore(task: StaffTask): number {
  if (task.completed) return 0;
  const blockedWeight = task.blockedEngineersCount * 25; // 25 pts per blocked engineer
  const urgencyWeight = task.urgency * 10;
  const impactWeight = task.strategicImpact * 10;
  return blockedWeight + urgencyWeight + impactWeight;
}

/**
 * Calculates strategic staff leverage score (0 - 100).
 */
export function calculateStaffLeverageScore(task: StaffTask): number {
  const reachMultipliers: Record<OrganizationalReach, number> = {
    company: 1.5,
    group: 1.25,
    team: 1.0,
    individual: 0.7,
  };

  const baseScore = (task.strategicImpact * 12) + (task.urgency * 6) + (task.blockedEngineersCount * 4);
  const adjusted = baseScore * reachMultipliers[task.reach];
  return Math.min(100, Math.round(adjusted));
}

/**
 * Analyzes workload balance across the four core Staff Engineer archetypes
 */
export function analyzeArchetypeBalance(tasks: StaffTask[]): ArchetypeBalanceReport {
  const activeTasks = tasks.filter((t) => !t.completed);
  const totalMinutes = activeTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  const initialMinutes: Record<StaffArchetype, number> = {
    architect: 0,
    multiplier: 0,
    deep_solver: 0,
    firefighter: 0,
  };

  activeTasks.forEach((t) => {
    initialMinutes[t.archetype] += t.estimatedMinutes;
  });

  const percentages: Record<StaffArchetype, number> = {
    architect: totalMinutes > 0 ? Math.round((initialMinutes.architect / totalMinutes) * 100) : 0,
    multiplier: totalMinutes > 0 ? Math.round((initialMinutes.multiplier / totalMinutes) * 100) : 0,
    deep_solver: totalMinutes > 0 ? Math.round((initialMinutes.deep_solver / totalMinutes) * 100) : 0,
    firefighter: totalMinutes > 0 ? Math.round((initialMinutes.firefighter / totalMinutes) * 100) : 0,
  };

  let dominantArchetype: StaffArchetype = 'architect';
  let maxMin = -1;
  (Object.keys(initialMinutes) as StaffArchetype[]).forEach((arch) => {
    if (initialMinutes[arch] > maxMin) {
      maxMin = initialMinutes[arch];
      dominantArchetype = arch;
    }
  });

  let warning: string | undefined;
  let recommendation = 'Your planned workload is well-distributed across staff responsibilities.';

  if (percentages.firefighter > 40) {
    warning = 'High firefighting alert: Over 40% of your day is reactive triage.';
    recommendation = 'Time-box incident investigations. Protect a minimum 90-minute block for strategic architecture or root-cause prevention.';
  } else if (percentages.deep_solver > 65) {
    warning = 'Solo silo risk: Heavy individual contributor focus.';
    recommendation = 'Ensure you check in on blocked team PRs or architectural design reviews to avoid becoming an organizational bottleneck.';
  } else if (percentages.multiplier > 60 && percentages.architect < 15) {
    warning = 'Fragmentation risk: High meeting/mentorship load without architectural headroom.';
    recommendation = 'Batch code reviews and PR feedback into two focused windows rather than interrupting your day continuously.';
  }

  return {
    percentages,
    totalMinutes,
    dominantArchetype,
    warning,
    recommendation,
  };
}

/**
 * Sorts tasks by the "Unblock First, Deep Dive Second" Staff sequence.
 * 1. Blocking 1+ engineers (ordered by number of people unblocked)
 * 2. High strategic leverage deep work (RFCs, system spikes)
 * 3. General tasks and administrative alignment
 */
export function sequenceTasksByUnblockingPriority(tasks: StaffTask[]): StaffTask[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const scoreA = calculateUnblockScore(a);
    const scoreB = calculateUnblockScore(b);
    return scoreB - scoreA;
  });
}

/**
 * Groups tasks by contextual domain to eliminate costly mental context-switching
 */
export function clusterByContext(tasks: StaffTask[]): FocusCluster[] {
  const activeTasks = tasks.filter((t) => !t.completed);
  const map = new Map<string, StaffTask[]>();

  activeTasks.forEach((t) => {
    const key = t.category || 'General';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  });

  const clusters: FocusCluster[] = [];

  map.forEach((taskList, category) => {
    const totalMinutes = taskList.reduce((acc, t) => acc + t.estimatedMinutes, 0);
    const hasUnblocking = taskList.some((t) => t.blockedEngineersCount > 0);
    const hasArchitecture = taskList.some((t) => t.archetype === 'architect' || t.archetype === 'deep_solver');

    let suggestedSlot: FocusCluster['suggestedSlot'] = 'Afternoon Collaboration';
    if (hasUnblocking) {
      suggestedSlot = 'Morning Unblock';
    } else if (hasArchitecture && totalMinutes >= 60) {
      suggestedSlot = 'Prime Deep Work';
    } else if (totalMinutes < 45) {
      suggestedSlot = 'End of Day Triage';
    }

    clusters.push({
      category,
      totalMinutes,
      tasks: taskList,
      suggestedSlot,
    });
  });

  const slotOrder: Record<FocusCluster['suggestedSlot'], number> = {
    'Morning Unblock': 1,
    'Prime Deep Work': 2,
    'Afternoon Collaboration': 3,
    'End of Day Triage': 4,
  };

  return clusters.sort((a, b) => slotOrder[a.suggestedSlot] - slotOrder[b.suggestedSlot]);
}

/**
 * Evaluates whether a Staff Engineer should execute, pair, delegate, or decline a task.
 */
export function evaluateDelegationOpportunity(task: StaffTask): DelegationRecommendation {
  if (task.delegationPotential === 'ready_to_delegate') {
    return {
      action: 'Delegate to Team',
      rationale: 'This work provides an excellent stretch ownership opportunity for a mid/senior engineer on the team.',
      suggestedTemplate: `Hey! I noticed you have been diving into ${task.category}. This task (${task.title}) would be a great chance for you to lead this component. I'm happy to review the design and answer questions!`,
    };
  }

  if (task.delegationPotential === 'good_mentorship') {
    return {
      action: 'Pair & Mentor',
      rationale: 'Valuable technical problem where co-authoring or pairing transfers architectural context to future tech leads.',
      suggestedTemplate: `Let's pair on ${task.title} for 45 minutes to draft the design, and you can take over driving the PR implementation.`,
    };
  }

  if (task.strategicImpact <= 2 && task.urgency >= 4 && task.reach === 'individual') {
    return {
      action: 'Decline / Renegotiate',
      rationale: 'Urgent but low strategic leverage. Risk of taking on tactical busywork that pulls you away from core initiatives.',
      suggestedTemplate: `Thanks for looping me in. Given my current commitment to high-priority architectural milestones this week, I won't be able to take this on directly. I recommend checking our existing docs or delegating to the feature squad.`,
    };
  }

  return {
    action: 'Execute Directly',
    rationale: 'High-leverage Staff engineering milestone requiring broad system perspective and technical authority.',
    suggestedTemplate: `I will be driving this milestone directly. Expected milestone completion by end of current sprint.`,
  };
}

/**
 * Deterministic default tasks representing a typical Staff Engineer's day
 */
export const DEFAULT_STAFF_TASKS: StaffTask[] = [
  {
    id: 'task-1',
    title: 'Review Distributed Event Streaming RFC & Schema Contract',
    category: 'Architecture',
    archetype: 'architect',
    estimatedMinutes: 60,
    blockedEngineersCount: 4,
    reach: 'group',
    urgency: 4,
    strategicImpact: 5,
    delegationPotential: 'none',
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'Unblock Payment Gateway PR #1428 (Critical Migration Blocker)',
    category: 'Payments Squad',
    archetype: 'firefighter',
    estimatedMinutes: 30,
    blockedEngineersCount: 3,
    reach: 'team',
    urgency: 5,
    strategicImpact: 4,
    delegationPotential: 'none',
    completed: false,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'task-3',
    title: 'Prototype Zero-Downtime Database Failover in Sandbox (Spike)',
    category: 'Core Infra',
    archetype: 'deep_solver',
    estimatedMinutes: 90,
    blockedEngineersCount: 0,
    reach: 'company',
    urgency: 3,
    strategicImpact: 5,
    delegationPotential: 'good_mentorship',
    completed: false,
    createdAt: Date.now() - 10800000,
  },
  {
    id: 'task-4',
    title: '1:1 Technical Mentorship & Career Ladder Alignment with Senior SWE',
    category: 'Mentorship & People',
    archetype: 'multiplier',
    estimatedMinutes: 45,
    blockedEngineersCount: 1,
    reach: 'individual',
    urgency: 3,
    strategicImpact: 4,
    delegationPotential: 'none',
    completed: false,
    createdAt: Date.now() - 14400000,
  },
  {
    id: 'task-5',
    title: 'Update Observability Dashboard Metrics & Metric Alert Thresholds',
    category: 'Core Infra',
    archetype: 'multiplier',
    estimatedMinutes: 40,
    blockedEngineersCount: 0,
    reach: 'team',
    urgency: 2,
    strategicImpact: 2,
    delegationPotential: 'ready_to_delegate',
    completed: false,
    createdAt: Date.now() - 18000000,
  },
];
