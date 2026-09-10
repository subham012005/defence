import type { Personnel, RiskAssessment, Intervention, AuditEvent, Unit } from '../types';

export const mockUnits: Unit[] = [
  { id: 'unit-1', name: '3rd Bn, A Coy', personnelCount: 120 }
];

export const mockPersonnel: Personnel[] = [
  {
    token: 'PRH-7f3a91c2',
    id: 'CRP-A-0417',
    rank: 'Constable',
    name: 'Amit Kumar', // Revealed on consent
    unitId: 'unit-1',
    dateOfJoining: '2015-06-12',
    homeDistrict: 'Patna, Bihar',
    currentStation: 'Sukma, Chhattisgarh',
    maritalStatus: 'Married',
    dependentsCount: 3,
    consent: { hrAnalytics: true, selfReport: true, biometric: true, researchAggregate: true }
  },
  {
    token: 'PRH-2b8e44f1',
    id: 'CRP-A-0092',
    rank: 'Head Constable',
    name: 'Rajesh Singh',
    unitId: 'unit-1',
    dateOfJoining: '2008-04-20',
    homeDistrict: 'Lucknow, UP',
    currentStation: 'Sukma, Chhattisgarh',
    maritalStatus: 'Married',
    dependentsCount: 4,
    consent: { hrAnalytics: true, selfReport: false, biometric: false, researchAggregate: true }
  },
  {
    token: 'PRH-9c1d55e3',
    id: 'CRP-A-0211',
    rank: 'Constable',
    name: 'Sunil Verma',
    unitId: 'unit-1',
    dateOfJoining: '2021-11-05',
    homeDistrict: 'Jaipur, Rajasthan',
    currentStation: 'Sukma, Chhattisgarh',
    maritalStatus: 'Single',
    dependentsCount: 2,
    consent: { hrAnalytics: true, selfReport: true, biometric: true, researchAggregate: true }
  }
];

// Scenario 1: CRP-A-0417 gradually moving to check-in recommended
export const mockRiskAssessments: RiskAssessment[] = [
  // Past 6 weeks for CRP-A-0417
  { token: 'PRH-7f3a91c2', week: 32, band: 'STABLE', confidence: 'HIGH', drivers: [] },
  { token: 'PRH-7f3a91c2', week: 33, band: 'STABLE', confidence: 'HIGH', drivers: [] },
  { token: 'PRH-7f3a91c2', week: 34, band: 'MONITOR', confidence: 'HIGH', drivers: [
    { feature: 'consecutive_duty_days', direction: 'high', description: '10 consecutive duty days', actionable: true }
  ]},
  { token: 'PRH-7f3a91c2', week: 35, band: 'MONITOR', confidence: 'HIGH', drivers: [
    { feature: 'consecutive_duty_days', direction: 'high', description: '12 consecutive duty days', actionable: true },
    { feature: 'leave_applications_declined_90d', direction: 'high', description: '1 leave application declined', actionable: false }
  ]},
  { token: 'PRH-7f3a91c2', week: 36, band: 'CHECK_IN_RECOMMENDED', confidence: 'HIGH', drivers: [
    { feature: 'consecutive_duty_days', direction: 'high', description: '14 consecutive duty days', actionable: true },
    { feature: 'night_duty_ratio_vs_personal_baseline', direction: 'high', description: 'Night duty share is 2x their usual', actionable: true },
    { feature: 'days_since_last_home_visit', direction: 'high', description: 'No home leave in 419 days', actionable: true }
  ]},
  { token: 'PRH-7f3a91c2', week: 37, band: 'CHECK_IN_RECOMMENDED', confidence: 'HIGH', drivers: [
    { feature: 'consecutive_duty_days', direction: 'high', description: '14 consecutive duty days', actionable: true },
    { feature: 'night_duty_ratio_vs_personal_baseline', direction: 'high', description: 'Night duty share is 2x their usual', actionable: true },
    { feature: 'days_since_last_home_visit', direction: 'high', description: 'No home leave in 419 days', actionable: true },
    { feature: 'leave_applications_declined_90d', direction: 'high', description: '2 leave applications declined', actionable: false }
  ]},
  // Others
  { token: 'PRH-2b8e44f1', week: 37, band: 'MONITOR', confidence: 'MEDIUM', drivers: [
    { feature: 'roster_volatility', direction: 'high', description: 'High roster volatility over 28 days', actionable: true }
  ]}
];

export const mockInterventions: Intervention[] = [
  {
    id: 'int-1',
    token: 'PRH-7f3a91c2',
    status: 'PENDING',
    recommendedAction: 'Prioritise leave sanction, Duty rotation',
    type: 'ELEVATED'
  }
];

export const mockAuditLogs: AuditEvent[] = [
  {
    id: 'aud-001',
    actorRole: 'WELFARE_OFFICER',
    action: 'VIEW_QUEUE',
    targetToken: 'ALL',
    statedReason: 'Routine weekly check',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    hash: '0000000000000000000000000000000000000000000000000000000000000000'
  }
];
