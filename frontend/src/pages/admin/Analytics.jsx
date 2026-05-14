import React from 'react';
import Card from '../../components/Card';
import { BarChart3, TrendingUp, Sparkles, Clock } from 'lucide-react';

const AdminAnalytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-slate-300">Deep dive into user behavior, service demand, and platform performance.</p>
      </div>

      <div className="grid xl:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400">Monthly Revenue</p>
              <h2 className="text-3xl font-bold mt-2">$78,400</h2>
            </div>
            <TrendingUp size={28} className="text-green-400" />
          </div>
          <p className="text-slate-500 text-sm">+12% from last month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400">Platform Growth</p>
              <h2 className="text-3xl font-bold mt-2">28%</h2>
            </div>
            <Sparkles size={28} className="text-blue-400" />
          </div>
          <p className="text-slate-500 text-sm">User acquisition efficiency is improving</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400">Job Completion</p>
              <h2 className="text-3xl font-bold mt-2">96%</h2>
            </div>
            <BarChart3 size={28} className="text-yellow-400" />
          </div>
          <p className="text-slate-500 text-sm">High reliability across service categories</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-400">Response Time</p>
              <h2 className="text-3xl font-bold mt-2">14m</h2>
            </div>
            <Clock size={28} className="text-purple-400" />
          </div>
          <p className="text-slate-500 text-sm">Average worker response speed</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Service demand</h2>
              <p className="text-slate-400 text-sm">Analyze demand trends for the top categories.</p>
            </div>
          </div>
          <div className="h-80 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400">
            Demand chart placeholder
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Customer satisfaction</h2>
              <p className="text-slate-400 text-sm">Track average ratings and review sentiment.</p>
            </div>
          </div>
          <div className="h-80 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400">
            Satisfaction chart placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
