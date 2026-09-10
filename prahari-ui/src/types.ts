export type Role = 'PERSONNEL' | 'WELFARE_OFFICER' | 'COUNSELLOR' | 'COMMANDER' | 'AUDITOR' | 'ADMIN';

export type Band = 'STABLE' | 'MONITOR' | 'CHECK_IN_RECOMMENDED' | 'PRIORITY_CHECK_IN';

export interface Personnel {
  token: string;
  id: string; // Pseudonymous ID e.g., CRP-A-0417
  rank: string;
  name: string; // Only visible to counsellor or if justified
  unitId: string;
  dateOfJoining?: string;
  homeDistrict?: string;
  currentStation?: string;
  maritalStatus?: string;
  dependentsCount?: number;
  consent: {
    hrAnalytics: boolean;
    selfReport: boolean;
    biometric: boolean;
    researchAggregate: boolean;
  };
}

export interface RiskAssessment {
  token: string;
  week: number;
  band: Band;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'REDUCED';
  drivers: {
    feature: string;
    direction: 'high' | 'low';
    description: string;
    actionable: boolean;
  }[];
}

export interface Intervention {
  id: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
  recommendedAction: string;
  decidedAt?: string;
  notes?: string;
  action_taken_notes?: string;
  outcome?: string;
  type?: 'ROUTINE' | 'ELEVATED' | 'PRIORITY' | 'ACUTE';
}

export interface AuditEvent {
  id: string;
  actorRole: Role;
  action: string;
  targetToken: string;
  statedReason: string;
  timestamp: string;
  hash: string;
}

export interface Unit {
  id: string;
  name: string;
  personnelCount: number;
}
