import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { useDemo } from '../../store/DemoContext';
import { ShieldAlert, MessageCircle, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const CounsellorConsole: React.FC = () => {
  const { interventions, personnel } = useDemo();

  const counsellorCases = interventions.filter(i => i.type === 'ACUTE' || i.type === 'PRIORITY');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clinical Cases</h2>
        <p className="text-muted/80">Consent-gated confidential console.</p>
      </div>

      <div className="space-y-4">
        {counsellorCases.map(c => {
          const person = personnel.find(p => p.token === c.token);
          const hasSelfReportConsent = person?.consent.selfReport;

          return (
            <Card key={c.id} className="border-l-4 border-l-purple-600">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold">{person?.name || c.token}</h3>
                      {c.type === 'ACUTE' && (
                        <span className="flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold uppercase">
                          <ShieldAlert size={14} className="mr-1" /> Acute Distress
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted mb-4">{person?.rank} • {person?.unitId}</p>
                    
                    {hasSelfReportConsent ? (
                      <div className="bg-gray-50 p-4 rounded text-sm space-y-2 border">
                        <p className="font-semibold">Clinical Detail (Consent Granted):</p>
                        <p><strong>PSS-10 Score:</strong> 28/40 (High)</p>
                        <p><strong>WHO-5:</strong> 20/100 (Low Well-being)</p>
                        {c.type === 'ACUTE' && (
                          <p className="text-red-700 font-medium">Self-reported: "I cannot take this anymore, I need help immediately."</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded text-sm border border-dashed text-muted">
                        No clinical consent granted for self-report data.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 min-w-[150px]">
                    <Button className="w-full bg-purple-700 hover:bg-purple-800">
                      <MessageCircle size={16} className="mr-2" /> Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText size={16} className="mr-2" /> Add Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {counsellorCases.length === 0 && (
          <div className="p-8 text-center text-muted border rounded-lg bg-surface">
            No priority or acute cases currently assigned.
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorConsole;
