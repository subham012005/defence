import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role, Personnel, RiskAssessment, Intervention, AuditEvent, Unit } from '../types';
import { mockPersonnel, mockRiskAssessments, mockInterventions, mockAuditLogs, mockUnits } from '../data/mockData';
import { SHA256 } from 'crypto-js';

interface DemoContextType {
  role: Role;
  setRole: (role: Role) => void;
  personnel: Personnel[];
  riskAssessments: RiskAssessment[];
  interventions: Intervention[];
  auditLogs: AuditEvent[];
  units: Unit[];
  logAudit: (action: string, targetToken: string, statedReason: string) => void;
  grantLeave: (interventionId: string) => void;
  revokeBiometricConsent: (token: string) => void;
  simulateCriticalIncident: () => void;
  reportAcuteDistress: (token: string) => void;
  resetDemo: () => void;
  currentWeek: number;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('WELFARE_OFFICER');
  const [personnel, setPersonnel] = useState<Personnel[]>(mockPersonnel);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(mockRiskAssessments);
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(mockAuditLogs);
  const [units] = useState<Unit[]>(mockUnits);
  const [currentWeek, setCurrentWeek] = useState(37);

  // Load from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('prahari_demo_state');
    if (saved) {
      const state = JSON.parse(saved);
      setRole(state.role);
      setPersonnel(state.personnel);
      setRiskAssessments(state.riskAssessments);
      setInterventions(state.interventions);
      setAuditLogs(state.auditLogs);
      setCurrentWeek(state.currentWeek);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    const state = { role, personnel, riskAssessments, interventions, auditLogs, currentWeek };
    localStorage.setItem('prahari_demo_state', JSON.stringify(state));
  }, [role, personnel, riskAssessments, interventions, auditLogs, currentWeek]);

  const logAudit = (action: string, targetToken: string, statedReason: string) => {
    const prevHash = auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const payload = `${prevHash}${action}${targetToken}${statedReason}${new Date().toISOString()}`;
    const hash = SHA256(payload).toString();
    
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actorRole: role,
      action,
      targetToken,
      statedReason,
      timestamp: new Date().toISOString(),
      hash
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const grantLeave = (interventionId: string) => {
    // Scenario 1: Action on intervention
    setInterventions(prev => prev.map(inv => 
      inv.id === interventionId ? { ...inv, status: 'ACCEPTED', decidedAt: new Date().toISOString(), action_taken_notes: 'Home leave sanctioned' } : inv
    ));

    // Simulate moving to next weeks where band returns to stable
    setTimeout(() => {
      setRiskAssessments(prev => {
        const updated = [...prev];
        const token = 'PRH-7f3a91c2'; // CRP-A-0417
        updated.push({ token, week: currentWeek + 1, band: 'MONITOR', confidence: 'HIGH', drivers: [{ feature: 'recovering', direction: 'low', description: 'Leave granted, load reducing', actionable: false }] });
        updated.push({ token, week: currentWeek + 2, band: 'STABLE', confidence: 'HIGH', drivers: [] });
        return updated;
      });
      setCurrentWeek(prev => prev + 2);
    }, 2000);
  };

  const revokeBiometricConsent = (token: string) => {
    // Scenario 5: Revocation
    setPersonnel(prev => prev.map(p => 
      p.token === token ? { ...p, consent: { ...p.consent, biometric: false } } : p
    ));
    setRiskAssessments(prev => prev.map(r => 
      r.token === token && r.week === currentWeek ? { 
        ...r, 
        confidence: 'REDUCED', 
        drivers: r.drivers.filter(d => !d.feature.includes('biometric') && !d.feature.includes('sleep') && !d.feature.includes('hrv')) 
      } : r
    ));
  };

  const simulateCriticalIncident = () => {
    // Scenario 2: Unit case
    // Add many new risk assessments for the unit
    const newAssessments: RiskAssessment[] = [];
    const newInterventions: Intervention[] = [];
    
    for (let i = 0; i < 48; i++) {
      const tkn = `PRH-SIM-${i}`;
      newAssessments.push({
        token: tkn, week: currentWeek, band: 'MONITOR', confidence: 'MEDIUM', drivers: [{feature: 'unit_incident_severity', direction: 'high', description: 'Recent critical incident in unit', actionable: false}]
      });
      setPersonnel(prev => [...prev, { token: tkn, id: `CRP-S-${1000+i}`, rank: 'Constable', name: 'Simulated', unitId: 'unit-1', consent: { hrAnalytics: true, selfReport: false, biometric: false, researchAggregate: true } }]);
    }
    
    // Emit unit-level recommendation
    newInterventions.push({
      id: `int-unit-${Date.now()}`,
      token: 'UNIT-1-AGGREGATE',
      status: 'PENDING',
      recommendedAction: 'Unit-level post-incident debrief, roster rebalancing',
      type: 'PRIORITY' // Highlighting it's a unit intervention
    });
    
    setRiskAssessments(prev => [...prev, ...newAssessments]);
    setInterventions(prev => [...prev, ...newInterventions]);
  };

  const reportAcuteDistress = (token: string) => {
    // Scenario 3: Crisis routing
    setInterventions(prev => [...prev, {
      id: `int-acute-${Date.now()}`,
      token,
      status: 'PENDING',
      recommendedAction: 'Immediate Counsellor Outreach',
      type: 'ACUTE'
    }]);
    logAudit('ACUTE_DISTRESS_ROUTED', token, 'System automated routing to counsellor');
  };

  const resetDemo = () => {
    localStorage.removeItem('prahari_demo_state');
    setRole('WELFARE_OFFICER');
    setPersonnel(mockPersonnel);
    setRiskAssessments(mockRiskAssessments);
    setInterventions(mockInterventions);
    setAuditLogs(mockAuditLogs);
    setCurrentWeek(37);
  };

  return (
    <DemoContext.Provider value={{
      role, setRole, personnel, riskAssessments, interventions, auditLogs, units,
      logAudit, grantLeave, revokeBiometricConsent, simulateCriticalIncident, reportAcuteDistress, resetDemo, currentWeek
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
