import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { emergencyAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Emergency = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestSOS = async () => {
    setLoading(true);
    try {
      const payload = {
        service: 'Emergency Support',
        description: description || 'Urgent service request',
        location: {
          address: location,
          coordinates: {
            lat: 0,
            lng: 0
          }
        },
        severity: 'critical'
      };

      await emergencyAPI.sendSOS(payload);
      setStatus('Emergency alert sent. A trusted agent will reach out immediately.');
    } catch (error) {
      setStatus('Unable to send SOS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Emergency Support</h1>
        <p className="text-slate-300">Activate trusted safety monitoring and get high-priority support immediately.</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter address or landmark"
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What is happening?</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue to help first responders and the AI system triage safely."
              rows={5}
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleRequestSOS} disabled={loading}>
              {loading ? 'Sending SOS...' : 'Send SOS Alert'}
            </Button>
            <Button variant="secondary" onClick={() => setStatus(null)}>
              Reset
            </Button>
          </div>

          {status && (
            <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 text-slate-100">
              {status}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Safety Features Included</h2>
        <ul className="space-y-3 text-slate-300">
          <li>• Live location sharing with emergency responders.</li>
          <li>• Admin alert escalation and high-priority support.</li>
          <li>• AI service prioritization based on threat level.</li>
        </ul>
      </Card>
    </div>
  );
};

export default Emergency;
