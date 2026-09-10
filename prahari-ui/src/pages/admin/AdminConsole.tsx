import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Settings, Database, Activity } from 'lucide-react';
import { useDemo } from '../../store/DemoContext';
import { Button } from '../../components/ui/Button';

const AdminConsole: React.FC = () => {
  const { resetDemo } = useDemo();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Configuration</h2>
          <p className="text-muted/80">Manage models, thresholds, and retention policies.</p>
        </div>
        <Button variant="danger" onClick={resetDemo}>Reset Demo State</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <Activity className="text-primary" size={20} />
            <CardTitle>Model Versioning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Supervised (LightGBM)</span>
                <span className="text-sm font-mono text-muted">v2.4.1 (Active)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Anomaly Detection (iForest)</span>
                <span className="text-sm font-mono text-muted">v1.2.0 (Active)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">Changepoint (CUSUM)</span>
                <span className="text-sm font-mono text-muted">v1.0.5 (Active)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <Settings className="text-primary" size={20} />
            <CardTitle>Unit Thresholds (Capacity-Matched)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">3rd Bn, A Coy</span>
                <span className="text-sm font-mono text-muted">Top 8/week</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-sm font-medium">7th Bn, HQ Coy</span>
                <span className="text-sm font-mono text-muted">Top 5/week</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-4 italic">Thresholds auto-tune based on available counsellor hours.</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <Database className="text-primary" size={20} />
            <CardTitle>Data Retention Jobs (DPDP Act Compliance)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 border rounded">
                <div>
                  <p className="font-semibold text-sm">Raw Self-Reports</p>
                  <p className="text-xs text-muted">Deletes records older than 12 months</p>
                </div>
                <div className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded">Last run: 2 hours ago</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border rounded">
                <div>
                  <p className="font-semibold text-sm">Derived Features (Tokens)</p>
                  <p className="text-xs text-muted">Deletes records older than 24 months</p>
                </div>
                <div className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded">Last run: 2 hours ago</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border rounded">
                <div>
                  <p className="font-semibold text-sm">Audit Logs</p>
                  <p className="text-xs text-muted">Archived to cold storage after 7 years</p>
                </div>
                <div className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded">Last run: 1 day ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConsole;
