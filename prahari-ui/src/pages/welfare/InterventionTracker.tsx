import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useDemo } from '../../store/DemoContext';
import { Button } from '../../components/ui/Button';

const InterventionTracker: React.FC = () => {
  const { interventions } = useDemo();

  const columns = ['PENDING', 'ACCEPTED', 'COMPLETED'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Interventions Kanban</h2>
        <p className="text-muted/80">Track open welfare actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(status => (
          <div key={status} className="flex flex-col space-y-4">
            <h3 className="font-semibold text-muted bg-gray-100 px-3 py-2 rounded-md">{status.replace('_', ' ')}</h3>
            
            <div className="flex-1 space-y-4 min-h-[200px] p-2 bg-gray-50/50 rounded-lg border border-dashed">
              {interventions.filter(i => i.status === status).map(inv => (
                <Card key={inv.id} className="shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm">{inv.token.replace('PRH', 'ID')}</CardTitle>
                      {inv.type === 'PRIORITY' && <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Priority</span>}
                      {inv.type === 'ACUTE' && <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Acute Route</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm space-y-3">
                    <p className="text-muted/80">{inv.recommendedAction}</p>
                    {inv.action_taken_notes && (
                      <div className="bg-green-50 p-2 rounded text-xs text-green-800 border border-green-100">
                        {inv.action_taken_notes}
                      </div>
                    )}
                    {status === 'PENDING' && (
                      <Button variant="outline" size="sm" className="w-full mt-2">Update Status</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterventionTracker;
