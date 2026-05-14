import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Users, UserPlus2, CalendarCheck, BarChart3, ShieldCheck, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: 1248, icon: Users, color: 'text-blue-400' },
    { label: 'Verified Workers', value: 342, icon: UserPlus2, color: 'text-green-400' },
    { label: 'Active Bookings', value: 74, icon: CalendarCheck, color: 'text-yellow-400' },
    { label: 'System Alerts', value: 5, icon: Bell, color: 'text-red-400' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-300">Monitor platform performance, manage operations, and review high-value insights.</p>
      </div>

      <div className="grid xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-sm text-slate-500">Updated 5 minutes ago</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Booking velocity</h2>
              <p className="text-slate-400 text-sm">Track booking volume and seasonal demand.</p>
            </div>
            <Button variant="secondary" size="sm">View Report</Button>
          </div>
          <div className="h-64 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400">
            Analytics chart placeholder
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Priority alerts</h2>
              <p className="text-slate-400 text-sm">Incidents that need your attention.</p>
            </div>
            <ShieldCheck size={22} className="text-green-400" />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-3xl border border-white/10">
              <p className="text-sm text-slate-300">5 workers require verification review</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-3xl border border-white/10">
              <p className="text-sm text-slate-300">2 emergency jobs are pending assignment</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent system actions</h2>
          <div className="space-y-3">
            <div className="flex items-start justify-between p-4 bg-white/5 rounded-3xl">
              <div>
                <p className="text-slate-300">New worker onboarding request</p>
                <p className="text-slate-500 text-xs">3 minutes ago</p>
              </div>
              <Button variant="secondary" size="sm">Review</Button>
            </div>
            <div className="flex items-start justify-between p-4 bg-white/5 rounded-3xl">
              <div>
                <p className="text-slate-300">High distress alert triggered</p>
                <p className="text-slate-500 text-xs">12 minutes ago</p>
              </div>
              <Button variant="secondary" size="sm">Inspect</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Platform growth</h2>
          <p className="text-slate-400 mb-6">Revenue, user acquisition, and worker adoption trends in one place.</p>
          <div className="h-72 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400">
            Growth chart placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
