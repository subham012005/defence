import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { useDemo } from '../../store/DemoContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const CheckInQueue: React.FC = () => {
  const { riskAssessments, currentWeek, interventions } = useDemo();

  // Filter queue for current week, excluding STABLE, sort by priority
  const queue = riskAssessments
    .filter(r => r.week === currentWeek && r.band !== 'STABLE')
    .sort((a, b) => {
      const order = { 'PRIORITY_CHECK_IN': 3, 'CHECK_IN_RECOMMENDED': 2, 'MONITOR': 1, 'STABLE': 0 };
      return order[b.band] - order[a.band];
    });

  const getInterventionStatus = (token: string) => {
    return interventions.find(i => i.token === token && i.status !== 'COMPLETED');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Check-in Queue</h2>
        <p className="text-muted/80">Prioritised list of personnel needing attention.</p>
      </div>

      <div className="space-y-4">
        {queue.map((assessment, idx) => {
          const activeIntervention = getInterventionStatus(assessment.token);
          
          return (
            <Card key={idx} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-white gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-medium text-lg text-primary">{assessment.token.replace('PRH', 'ID')}</span>
                    <Badge band={assessment.band} />
                    {assessment.confidence === 'REDUCED' && (
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">CONFIDENCE: REDUCED</span>
                    )}
                    {assessment.confidence === 'HIGH' && (
                      <span className="text-xs font-medium text-gray-500">Confidence: High</span>
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Drivers:</p>
                    <ul className="list-disc list-inside text-muted/80 space-y-0.5">
                      {assessment.drivers.map((d, i) => (
                        <li key={i}>{d.description}</li>
                      ))}
                      {assessment.drivers.length === 0 && <li>No specific drivers identified.</li>}
                    </ul>
                  </div>

                  {activeIntervention && (
                    <div className="bg-blue-50 text-blue-800 text-sm p-2 rounded border border-blue-100 inline-block">
                      <strong>Welfare action in progress:</strong> {activeIntervention.recommendedAction}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                  <Link to={`/personnel/${assessment.token}`}>
                    <Button>Open Record</Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
        {queue.length === 0 && (
          <div className="p-8 text-center text-muted border rounded-lg bg-surface">
            Queue is empty for this week.
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInQueue;
