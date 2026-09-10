import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useDemo } from '../../store/DemoContext';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const AuditorConsole: React.FC = () => {
  const { auditLogs } = useDemo();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const verifyChain = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Immutable Access Logs</h2>
          <p className="text-muted/80">Every individual record access is logged and hash-chained.</p>
        </div>
        <Button onClick={verifyChain} disabled={verifying || verified} className="bg-slate-800 hover:bg-slate-700">
          <ShieldCheck size={18} className="mr-2" />
          {verifying ? 'Verifying Chain...' : verified ? 'Chain Intact' : 'Verify Chain Integrity'}
        </Button>
      </div>

      {verified && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded flex items-center space-x-3 shadow-sm">
          <CheckCircle2 className="text-green-600" size={20} />
          <div>
            <h3 className="font-semibold text-green-800">Verification Passed</h3>
            <p className="text-sm text-green-700">Cryptographic hash chain is intact. No records have been tampered with or deleted.</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor Role</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Stated Reason</th>
                  <th className="px-6 py-3">Hash (Truncated)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[...auditLogs].reverse().map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-muted/80">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">{log.actorRole.replace('_', ' ')}</td>
                    <td className="px-6 py-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">{log.action}</span></td>
                    <td className="px-6 py-4 font-mono">{log.targetToken.replace('PRH', 'ID')}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={log.statedReason}>{log.statedReason}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted/50" title={log.hash}>{log.hash.substring(0, 16)}...</td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted">No audit events recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditorConsole;
