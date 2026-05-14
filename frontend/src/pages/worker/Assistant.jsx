import React, { useEffect, useState } from 'react';
import { workerAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Assistant = () => {
  const [assistant, setAssistant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssistant = async () => {
      try {
        const response = await workerAPI.getAssistant();
        setAssistant(response.data.assistant);
      } catch (error) {
        setAssistant({
          routeOptimization: 'Keep working in dense neighborhoods during peak hours.',
          scheduleSummary: 'AI recommends two high-demand service blocks today.',
          earningsInsight: 'Trust score growth can increase earnings by 10%.',
          demandPrediction: 'Strong demand for plumbing and electrical services this evening.',
          reminders: ['Upload service start selfie', 'Confirm customer satisfaction', 'Stay on schedule']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssistant();
  }, []);

  if (loading) {
    return <div className="text-slate-300">Loading worker assistant...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-slate-300">Your personal worker agent for routing, scheduling, earnings insights, and safety alerts.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Route Optimization</h2>
          <p className="text-slate-300">{assistant.routeOptimization}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Schedule Summary</h2>
          <p className="text-slate-300">{assistant.scheduleSummary}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Earnings Insight</h2>
          <p className="text-slate-300">{assistant.earningsInsight}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Demand Prediction</h2>
          <p className="text-slate-300">{assistant.demandPrediction}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Reminders</h2>
        <ul className="space-y-2 text-slate-300">
          {assistant.reminders?.map((item, index) => (
            <li key={index} className="rounded-2xl bg-slate-950/70 p-4">{item}</li>
          ))}
        </ul>
      </Card>

      <div className="flex gap-4">
        <Button>Start Verification</Button>
        <Button variant="secondary">View Live Jobs</Button>
      </div>
    </div>
  );
};

export default Assistant;
