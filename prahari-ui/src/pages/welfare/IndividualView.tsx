import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../store/DemoContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Lock, FileWarning, ArrowLeft, Download } from 'lucide-react';

const IndividualView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { personnel, riskAssessments, logAudit, currentWeek, interventions, grantLeave } = useDemo();
  const navigate = useNavigate();

  const [, setHasAccess] = useState(false);
  const [reason, setReason] = useState('');
  const [show428, setShow428] = useState(true);
  const [exportError, setExportError] = useState(false);

  const person = personnel.find(p => p.token === token);
  const history = riskAssessments.filter(r => r.token === token).sort((a, b) => a.week - b.week);
  const currentAssessment = history.find(h => h.week === currentWeek);
  const activeIntervention = interventions.find(i => i.token === token && i.status === 'PENDING');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    // Log the access immutably
    logAudit('VIEW_INDIVIDUAL', token || '', reason);
    setHasAccess(true);
    setShow428(false);
  };

  const handleExport = () => {
    logAudit('EXPORT_ATTEMPT_PROMOTION', token || '', 'Career export attempt');
    setExportError(true);
    setTimeout(() => setExportError(false), 5000);
  };

  if (!person || !currentAssessment) {
    return <div>Record not found or no data for current week.</div>;
  }

  if (show428) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg border-primary/20">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <div className="flex items-center space-x-2 text-primary">
              <Lock size={20} />
              <CardTitle>Access Restricted (HTTP 428)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted mb-6">
              You are attempting to access a protected welfare record. You must state a valid operational or welfare reason before access is granted. This action will be immutably logged in the audit trail.
            </p>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reason for access</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="E.g., Routine weekly welfare check based on queue flag..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit">Unlock Record</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-0 h-8 w-8 rounded-full">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{person.name} ({person.id})</h2>
          <p className="text-muted/80">{person.rank} • {person.unitId}</p>
        </div>
      </div>

      {exportError && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded flex items-center space-x-3 shadow-sm mb-4">
          <FileWarning className="text-red-600" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">403 PURPOSE_BLOCKED</h3>
            <p className="text-sm text-red-700">Welfare data cannot be exported to career/disciplinary systems. Blocked by PurposeGuard middleware.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Current Status (Week {currentWeek})</p>
            <Badge band={currentAssessment.band} className="text-sm px-3 py-1" />
          </div>
          {currentAssessment.confidence === 'REDUCED' && (
            <div className="bg-red-50 text-red-700 px-3 py-1 rounded text-sm border border-red-100">
              Confidence Reduced (Consent Revoked)
            </div>
          )}
        </div>
        <div className="flex space-x-2">
           <Button variant="outline" size="sm" onClick={handleExport} className="text-red-700 border-red-200 hover:bg-red-50">
             <Download size={14} className="mr-2" />
             Export to HRMS (Demo Block)
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted uppercase">Date of Joining</p>
                <p className="text-sm font-medium">{person.dateOfJoining || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase">Home District</p>
                <p className="text-sm font-medium">{person.homeDistrict || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase">Current Station</p>
                <p className="text-sm font-medium">{person.currentStation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase">Family Info</p>
                <p className="text-sm font-medium">{person.maritalStatus || 'N/A'} • {person.dependentsCount} Dep</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            {currentAssessment.drivers.length > 0 ? (
              <ul className="space-y-4">
                {currentAssessment.drivers.map((d, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 mt-1.5 rounded-full ${d.direction === 'high' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{d.description}</p>
                      <p className="text-xs text-muted font-mono mt-0.5">{d.feature}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No concerning drivers flagged.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Action</CardTitle>
          </CardHeader>
          <CardContent>
             {activeIntervention ? (
               <div className="space-y-4">
                 <div className="bg-blue-50 p-3 rounded border border-blue-100">
                   <p className="text-sm text-blue-900 font-medium">Pending Officer Decision</p>
                   <p className="text-sm text-blue-800 mt-1">{activeIntervention.recommendedAction}</p>
                 </div>
                 {/* Specific button for Scenario 1 demo to grant leave */}
                 {activeIntervention.token === 'PRH-7f3a91c2' && activeIntervention.status === 'PENDING' && (
                   <Button onClick={() => grantLeave(activeIntervention.id)} className="w-full">
                     Sanction Home Leave
                   </Button>
                 )}
               </div>
             ) : (
               <p className="text-sm text-muted">No specific interventions currently recommended.</p>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Fake Chart Area */}
      <Card>
        <CardHeader>
          <CardTitle>Trajectory (12 Weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between px-2 pb-6 border-b border-l pt-4 relative">
             {/* Y axis labels */}
             <div className="absolute left-[-2rem] top-0 bottom-0 flex flex-col justify-between text-xs text-muted py-4 opacity-50">
                <span>PRI</span>
                <span>CHK</span>
                <span>MON</span>
                <span>STB</span>
             </div>
             
             {history.slice(-12).map((h, i) => {
               // Map bands to heights
               const heights = { 'STABLE': '20%', 'MONITOR': '50%', 'CHECK_IN_RECOMMENDED': '80%', 'PRIORITY_CHECK_IN': '95%' };
               const hVal = heights[h.band] || '20%';
               return (
                 <div key={i} className="flex flex-col items-center group w-8 relative">
                   <div 
                     className="w-full bg-primary/20 rounded-t group-hover:bg-primary/40 transition-all duration-300" 
                     style={{ height: hVal }} 
                   />
                   <div className="absolute -bottom-6 text-xs text-muted/60">W{h.week}</div>
                   
                   {/* Tooltip */}
                   <div className="absolute -top-10 hidden group-hover:block bg-slate-800 text-white text-xs p-1 rounded whitespace-nowrap z-10">
                     {h.band}
                   </div>
                 </div>
               );
             })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default IndividualView;
