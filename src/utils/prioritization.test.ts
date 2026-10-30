import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateUnblockScore,
  calculateStaffLeverageScore,
  analyzeArchetypeBalance,
  sequenceTasksByUnblockingPriority,
  clusterByContext,
  evaluateDelegationOpportunity,
  DEFAULT_STAFF_TASKS,
  StaffTask,
} from './prioritization';

test('calculateUnblockScore calculates higher score for tasks blocking more engineers', () => {
  const highBlocker: StaffTask = {
    ...DEFAULT_STAFF_TASKS[0],
    blockedEngineersCount: 5,
    urgency: 4,
    strategicImpact: 5,
  };

  const lowBlocker: StaffTask = {
    ...DEFAULT_STAFF_TASKS[0],
    blockedEngineersCount: 0,
    urgency: 4,
    strategicImpact: 5,
  };

  const scoreHigh = calculateUnblockScore(highBlocker);
  const scoreLow = calculateUnblockScore(lowBlocker);

  assert.ok(scoreHigh > scoreLow);
  assert.equal(calculateUnblockScore({ ...highBlocker, completed: true }), 0);
});

test('calculateStaffLeverageScore scales by organizational reach', () => {
  const companyTask: StaffTask = {
    ...DEFAULT_STAFF_TASKS[0],
    reach: 'company',
    strategicImpact: 5,
    urgency: 5,
    blockedEngineersCount: 2,
  };

  const teamTask: StaffTask = {
    ...companyTask,
    reach: 'team',
  };

  const companyScore = calculateStaffLeverageScore(companyTask);
  const teamScore = calculateStaffLeverageScore(teamTask);

  assert.ok(companyScore >= teamScore);
});

test('analyzeArchetypeBalance calculates breakdown and warnings accurately', () => {
  const report = analyzeArchetypeBalance(DEFAULT_STAFF_TASKS);

  assert.ok(report.totalMinutes > 0);
  assert.equal(
    report.percentages.architect +
    report.percentages.multiplier +
    report.percentages.deep_solver +
    report.percentages.firefighter,
    100
  );
});

test('sequenceTasksByUnblockingPriority places heavy blocker first', () => {
  const sequenced = sequenceTasksByUnblockingPriority(DEFAULT_STAFF_TASKS);
  assert.equal(sequenced[0].id, 'task-1'); // blocked 4 people + high impact
});

test('clusterByContext groups tasks with matching categories', () => {
  const clusters = clusterByContext(DEFAULT_STAFF_TASKS);
  const infraCluster = clusters.find((c) => c.category === 'Core Infra');
  assert.ok(infraCluster);
  assert.equal(infraCluster?.tasks.length, 2);
});

test('evaluateDelegationOpportunity identifies delegate and pair tasks', () => {
  const delegateTask = DEFAULT_STAFF_TASKS.find((t) => t.delegationPotential === 'ready_to_delegate')!;
  const recommendation = evaluateDelegationOpportunity(delegateTask);
  assert.equal(recommendation.action, 'Delegate to Team');
  assert.ok(recommendation.suggestedTemplate.includes('great chance for you'));
});
