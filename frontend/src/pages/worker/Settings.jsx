import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, Shield, Globe, Save } from 'lucide-react';

const WorkerSettings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    availability: user?.availability || 'available',
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      sms: user?.preferences?.notifications?.sms ?? true,
      push: user?.preferences?.notifications?.push ?? true
    },
    language: user?.preferences?.language || 'en'
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile({ preferences: settings });
    if (result.success) {
      alert('Your settings were updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-300">Update your availability, notification preferences, and account settings.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Availability</h2>
          <div className="space-y-4">
            {['available', 'busy', 'offline'].map((status) => (
              <button
                key={status}
                onClick={() => setSettings({ ...settings, availability: status })}
                className={`w-full text-left px-4 py-4 rounded-3xl border transition ${
                  settings.availability === status ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="font-medium capitalize">{status}</div>
                <p className="text-sm text-slate-400">{status === 'available'
                  ? 'Ready to receive new jobs'
                  : status === 'busy'
                    ? 'Currently working on a job'
                    : 'Not accepting jobs right now'
                }</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            {['email', 'sms', 'push'].map((type) => (
              <div key={type} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10">
                <div>
                  <p className="font-medium capitalize">{type} notifications</p>
                  <p className="text-sm text-slate-400">Receive {type} alerts for bookings, messages, and updates.</p>
                </div>
                <button
                  onClick={() => handleToggle(type)}
                  className={`px-4 py-2 rounded-full transition ${settings.notifications[type] ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300'}`}
                >
                  {settings.notifications[type] ? 'On' : 'Off'}
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">General</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Preferred Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading}>
          <Save size={20} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default WorkerSettings;
