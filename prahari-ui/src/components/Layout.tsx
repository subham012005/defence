import React from 'react';
import { useDemo } from '../store/DemoContext';
import type { Role } from '../types';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, HeartPulse, FileText, Settings, UserCircle, LogOut } from 'lucide-react';

export const Layout: React.FC = () => {
  const { role, setRole } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: Record<Role, { label: string, path: string, icon: React.ReactNode }[]> = {
    PERSONNEL: [
      { label: 'My App', path: '/personnel', icon: <UserCircle size={20} /> },
    ],
    WELFARE_OFFICER: [
      { label: 'Unit Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Check-in Queue', path: '/queue', icon: <Users size={20} /> },
      { label: 'Interventions', path: '/interventions', icon: <HeartPulse size={20} /> },
    ],
    COMMANDER: [
      { label: 'Unit Health', path: '/commander', icon: <LayoutDashboard size={20} /> },
      { label: 'Workload', path: '/workload', icon: <FileText size={20} /> },
    ],
    COUNSELLOR: [
      { label: 'Clinical Cases', path: '/counsellor', icon: <HeartPulse size={20} /> },
    ],
    AUDITOR: [
      { label: 'Access Logs', path: '/auditor', icon: <FileText size={20} /> },
    ],
    ADMIN: [
      { label: 'System Config', path: '/admin', icon: <Settings size={20} /> },
    ]
  };

  const currentNav = navItems[role];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="bg-primary text-white h-16 flex items-center justify-between px-6 shadow-md z-10 relative">
        <div className="flex items-center space-x-3">
          <Shield className="text-accent" size={28} />
          <div>
            <h1 className="text-xl font-bold tracking-wider">PRAHARI</h1>
            <p className="text-[10px] text-accent/80 uppercase tracking-widest -mt-1">Personnel Welfare System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm opacity-80">
            Role: <span className="font-semibold text-white">{role.replace('_', ' ')}</span>
          </div>
          <select 
            className="bg-primary-dark border border-white/20 rounded px-2 py-1 text-sm bg-[#152843] text-white"
            value={role}
            onChange={(e) => {
              const newRole = e.target.value as Role;
              setRole(newRole);
              navigate(navItems[newRole][0].path);
            }}
          >
            {Object.keys(navItems).map(r => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {role !== 'PERSONNEL' && (
          <aside className="w-64 bg-surface border-r shadow-sm hidden md:block">
            <nav className="p-4 space-y-1">
              {currentNav.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted hover:bg-background'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="absolute bottom-4 left-4 right-4">
               <div className="text-xs text-muted/60 px-4">Classification: RESTRICTED</div>
            </div>
          </aside>
        )}

        {/* Content Area */}
        <main className={`flex-1 overflow-auto ${role === 'PERSONNEL' ? 'bg-gray-100 flex justify-center' : 'p-8'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
