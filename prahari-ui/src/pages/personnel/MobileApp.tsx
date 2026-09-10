import React, { useState } from 'react';
import { useDemo } from '../../store/DemoContext';
import { Button } from '../../components/ui/Button';
import { Shield, ChevronRight, UserCircle, Activity, HeartHandshake, Eye, AlertTriangle, ArrowLeft, TrendingUp, Moon } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const MobileApp: React.FC = () => {
  const { personnel, currentWeek, riskAssessments, revokeBiometricConsent, reportAcuteDistress } = useDemo();
  
  // Use CRP-A-0417 as the logged-in user
  const token = 'PRH-7f3a91c2';
  const person = personnel.find(p => p.token === token);
  const currentAssessment = riskAssessments.find(r => r.token === token && r.week === currentWeek);

  const [activeTab, setActiveTab] = useState<'HOME' | 'CONSENT' | 'OFFICER_VIEW' | 'CRISIS' | 'TRENDS'>('HOME');
  const [distressReported, setDistressReported] = useState(false);

  if (!person) return <div>Loading...</div>;

  const handleDistress = () => {
    reportAcuteDistress(token);
    setDistressReported(true);
  };
  const mockTrendData = [
    { day: 'Mon', sleep: 6, mood: 7 },
    { day: 'Tue', sleep: 5, mood: 6 },
    { day: 'Wed', sleep: 7, mood: 8 },
    { day: 'Thu', sleep: 4, mood: 5 },
    { day: 'Fri', sleep: 5, mood: 6 },
    { day: 'Sat', sleep: 6, mood: 6 },
    { day: 'Sun', sleep: 5, mood: 5 },
  ];

  return (
    <div className="flex justify-center items-center py-4">
      {/* Phone Container */}
      <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-[14px] border-slate-800 overflow-hidden relative flex flex-col">
        
        {/* Status Bar Fake */}
        <div className="h-6 bg-primary text-white text-[10px] flex justify-between px-6 pt-1 font-semibold">
          <span>9:41</span>
          <div className="flex space-x-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* App Header */}
        <div className="bg-primary text-white p-4 pt-6 pb-6 flex items-center space-x-3 rounded-b-xl shadow-sm z-10">
          <Shield size={24} className="text-accent" />
          <h1 className="text-lg font-bold tracking-wider">PRAHARI</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-20">
          {activeTab === 'HOME' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-primary mb-1">Namaste, {person.name.split(' ')[0]}</h2>
                <p className="text-sm text-muted">{person.rank} • {person.unitId}</p>
                
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs text-muted">
                  <div>
                    <span className="block opacity-60">Home District</span>
                    <span className="font-medium text-primary">{person.homeDistrict || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block opacity-60">Station</span>
                    <span className="font-medium text-primary">{person.currentStation || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-primary flex items-center"><Activity size={18} className="mr-2" /> Daily Check-in</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Done Today</span>
                </div>
                <p className="text-sm text-muted mb-3">Thank you for completing your 25-second check-in.</p>
                <Button variant="outline" className="w-full text-sm" onClick={() => setActiveTab('TRENDS')}>View My Trends</Button>
              </div>

              <div 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
                onClick={() => setActiveTab('OFFICER_VIEW')}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full"><Eye size={20} className="text-blue-700" /></div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">What My Officer Can See</h3>
                    <p className="text-xs text-muted">Total transparency</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>

              <div 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
                onClick={() => setActiveTab('CONSENT')}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full"><Shield size={20} className="text-purple-700" /></div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">Privacy Centre</h3>
                    <p className="text-xs text-muted">Manage your consents</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          )}

          {activeTab === 'CONSENT' && (
            <div className="space-y-4">
              <Button variant="ghost" className="p-0 text-primary mb-2 h-auto" onClick={() => setActiveTab('HOME')}>
                <ArrowLeft size={16} className="mr-1" /> Back
              </Button>
              <h2 className="text-xl font-bold text-primary">Privacy Centre</h2>
              <p className="text-sm text-muted">You have full control over what data is collected. Revoking consent instantly deletes that data.</p>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">HR Analytics</h4>
                    <p className="text-xs text-muted mt-1 w-48">Duty roster and leave history.</p>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full flex justify-end items-center p-1">
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Wearable Biometrics</h4>
                    <p className="text-xs text-muted mt-1 w-48">Heart rate variability (HRV) and sleep.</p>
                  </div>
                  <div 
                    className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${person.consent.biometric ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={() => {
                      if(person.consent.biometric) revokeBiometricConsent(token);
                    }}
                  >
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OFFICER_VIEW' && (
             <div className="space-y-4">
               <Button variant="ghost" className="p-0 text-primary mb-2 h-auto" onClick={() => setActiveTab('HOME')}>
                 <ArrowLeft size={16} className="mr-1" /> Back
               </Button>
               <h2 className="text-xl font-bold text-primary">Officer View</h2>
               <p className="text-sm text-muted mb-4">This is literally what your welfare officer sees on their dashboard today.</p>
               
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Current Status</h3>
                 <Badge band={currentAssessment?.band || 'STABLE'} />
                 
                 <div className="mt-4 pt-4 border-t border-gray-100">
                   <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Visible Drivers</h3>
                   <ul className="text-sm space-y-2">
                     {currentAssessment?.drivers.map((d, i) => (
                       <li key={i} className="flex items-start">
                         <span className="text-orange-500 mr-2">•</span> {d.description}
                       </li>
                     ))}
                     {(!currentAssessment?.drivers || currentAssessment.drivers.length === 0) && (
                       <li className="text-muted italic">No concerning factors visible.</li>
                     )}
                   </ul>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'CRISIS' && (
             <div className="space-y-4 h-full flex flex-col justify-center">
               {!distressReported ? (
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 text-center space-y-4">
                   <AlertTriangle size={48} className="mx-auto text-red-500" />
                   <h2 className="text-xl font-bold text-red-700">Need immediate help?</h2>
                   <p className="text-sm text-muted">Clicking this will instantly connect you with a clinical counsellor. Your commander will NOT see the reason, only that a welfare action is in progress.</p>
                   <Button variant="danger" className="w-full py-6 text-lg" onClick={handleDistress}>I need help now</Button>
                   <Button variant="ghost" onClick={() => setActiveTab('HOME')}>Cancel</Button>
                 </div>
               ) : (
                 <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100 text-center space-y-4">
                   <h2 className="text-xl font-bold text-green-800">Help is on the way</h2>
                   <p className="text-sm text-green-700">A counsellor has been notified and will message you here securely within 10 minutes.</p>
                   <Button onClick={() => setActiveTab('HOME')}>Return Home</Button>
                 </div>
               )}
             </div>
          )}

          {activeTab === 'TRENDS' && (
             <div className="space-y-4">
               <Button variant="ghost" className="p-0 text-primary mb-2 h-auto" onClick={() => setActiveTab('HOME')}>
                 <ArrowLeft size={16} className="mr-1" /> Back
               </Button>
               <h2 className="text-xl font-bold text-primary">My Trends</h2>
               <p className="text-sm text-muted mb-4">Your personal data, kept private and used only to support you.</p>

               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-semibold text-primary flex items-center"><Moon size={18} className="mr-2" /> Sleep Quality</h3>
                   <span className="text-xs text-muted">Last 7 Days</span>
                 </div>
                 <div className="h-40 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={mockTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                       <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       <Area type="monotone" dataKey="sleep" stroke="#1e3a5f" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                 <div className="flex items-center space-x-3 mb-2">
                   <TrendingUp size={18} className="text-orange-500" />
                   <h3 className="font-semibold text-primary text-sm">Workload Insight</h3>
                 </div>
                 <p className="text-sm text-muted">You have been assigned <strong>14 consecutive duty days</strong>. Your workload is currently high.</p>
                 <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                   <strong>Tip:</strong> Extended continuous duty can affect recovery. It is recommended to request your pending rest days soon.
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Bottom Nav Fake */}
        <div className="absolute bottom-0 w-full bg-white border-t flex justify-around p-3 pb-6">
           <div className={`flex flex-col items-center cursor-pointer ${activeTab === 'HOME' ? 'text-primary' : 'text-gray-400'}`} onClick={() => setActiveTab('HOME')}>
             <UserCircle size={24} />
             <span className="text-[10px] mt-1 font-medium">Home</span>
           </div>
           <div className={`flex flex-col items-center cursor-pointer ${activeTab === 'CRISIS' ? 'text-red-600' : 'text-gray-400'}`} onClick={() => setActiveTab('CRISIS')}>
             <HeartHandshake size={24} />
             <span className="text-[10px] mt-1 font-medium">Support</span>
           </div>
        </div>
      </div>
    </div>
  );
};



export default MobileApp;
