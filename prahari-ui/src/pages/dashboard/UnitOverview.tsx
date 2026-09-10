import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useDemo } from '../../store/DemoContext';
import { ShieldAlert, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const UnitOverview: React.FC<{ isCommanderView?: boolean }> = ({ isCommanderView }) => {
  const { riskAssessments, simulateCriticalIncident, interventions, currentWeek } = useDemo();

  // Calculate stats for current week
  const currentAssessments = riskAssessments.filter(r => r.week === currentWeek);
  const stableCount = currentAssessments.filter(r => r.band === 'STABLE').length;
  const monitorCount = currentAssessments.filter(r => r.band === 'MONITOR').length;
  const checkinCount = currentAssessments.filter(r => r.band === 'CHECK_IN_RECOMMENDED').length;
  const priorityCount = currentAssessments.filter(r => r.band === 'PRIORITY_CHECK_IN').length;
  const total = currentAssessments.length;

  const amberPercentage = total > 0 ? ((monitorCount + checkinCount + priorityCount) / total) * 100 : 0;
  const isUnitCase = amberPercentage >= 30;

  const unitIntervention = interventions.find(i => i.token === 'UNIT-1-AGGREGATE');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">3rd Bn, A Coy — Overview</h2>
          <p className="text-muted/80">Week {currentWeek}</p>
        </div>
        {!isCommanderView && (
          <Button variant="outline" onClick={simulateCriticalIncident} className="text-xs border-amber-500 text-amber-700 hover:bg-amber-50">
            [Demo: Simulate Critical Incident]
          </Button>
        )}
      </div>

      {isUnitCase && unitIntervention && (
        <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded flex items-start space-x-3">
          <ShieldAlert className="text-amber-700 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-900">Elevated Sub-unit Stress Detected</h3>
            <p className="text-sm text-amber-800 mt-1">
              {amberPercentage.toFixed(0)}% of personnel are showing elevated indicators following a recent incident. 
              <strong> System Recommendation: {unitIntervention.recommendedAction}</strong>
            </p>
            {isCommanderView && (
              <p className="text-xs text-amber-700 mt-2 italic">
                (Note: 48 individual referrals suppressed to prevent clinical overload)
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Stable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stableCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{monitorCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Check-in Recommended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{checkinCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{priorityCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-unit Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-muted" />
                <span className="font-medium">Platoon 1</span>
              </div>
              <div className="flex space-x-1">
                {/* Simulated heatmap blocks */}
                <div className="w-8 h-8 rounded bg-band-stable" title="Stable" />
                <div className="w-8 h-8 rounded bg-band-stable" />
                <div className="w-8 h-8 rounded bg-band-monitor" />
                <div className="w-8 h-8 rounded bg-band-checkin" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-muted" />
                <span className="font-medium">Platoon 2</span>
              </div>
              <div className="flex space-x-1">
                {isUnitCase ? (
                  <>
                    <div className="w-8 h-8 rounded bg-band-monitor" />
                    <div className="w-8 h-8 rounded bg-band-monitor" />
                    <div className="w-8 h-8 rounded bg-band-monitor" />
                    <div className="w-8 h-8 rounded bg-band-checkin" />
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded bg-band-stable" />
                    <div className="w-8 h-8 rounded bg-band-stable" />
                    <div className="w-8 h-8 rounded bg-band-stable" />
                    <div className="w-8 h-8 rounded bg-band-monitor" />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 rounded border border-dashed opacity-70">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-muted" />
                <span className="font-medium">Special Detachment</span>
              </div>
              <div className="text-sm italic text-muted">
                Insufficient cohort (k &lt; 10)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitOverview;
