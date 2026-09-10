import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DemoProvider, useDemo } from './store/DemoContext';
import { Layout } from './components/Layout';

// Placeholder Pages
import Dashboard from './pages/dashboard/UnitOverview';
import CheckInQueue from './pages/welfare/CheckInQueue';
import IndividualView from './pages/welfare/IndividualView';
import Interventions from './pages/welfare/InterventionTracker';
import CommanderWorkload from './pages/commander/WorkloadDistribution';
import CounsellorConsole from './pages/counsellor/CounsellorConsole';
import AuditorConsole from './pages/auditor/AuditorConsole';
import AdminConsole from './pages/admin/AdminConsole';
import MobileApp from './pages/personnel/MobileApp';

const RouteDirector = () => {
  const { role } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'PERSONNEL') navigate('/personnel');
    else if (role === 'WELFARE_OFFICER') navigate('/dashboard');
    else if (role === 'COMMANDER') navigate('/commander');
    else if (role === 'COUNSELLOR') navigate('/counsellor');
    else if (role === 'AUDITOR') navigate('/auditor');
    else if (role === 'ADMIN') navigate('/admin');
  }, []);

  return null;
};

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<RouteDirector />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="queue" element={<CheckInQueue />} />
            <Route path="personnel/:token" element={<IndividualView />} />
            <Route path="interventions" element={<Interventions />} />
            
            <Route path="commander" element={<Dashboard isCommanderView />} />
            <Route path="workload" element={<CommanderWorkload />} />
            
            <Route path="counsellor" element={<CounsellorConsole />} />
            
            <Route path="auditor" element={<AuditorConsole />} />
            
            <Route path="admin" element={<AdminConsole />} />
            
            {/* Mobile App View wrapped in a device container */}
            <Route path="personnel" element={<MobileApp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}

export default App;
