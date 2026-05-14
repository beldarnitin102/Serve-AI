import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Shield, Bell, Globe, Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    notifications: true,
    language: 'en'
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
        <p className="text-slate-300">Manage platform configuration, system notifications, and operational settings.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Shield size={24} className="text-purple-400" />
            <div>
              <h2 className="text-xl font-semibold">Security & Access</h2>
              <p className="text-slate-400 text-sm">Control administrative features and platform safeguards.</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleToggle('maintenanceMode')}
              className={`w-full px-4 py-4 rounded-3xl border text-left ${settings.maintenanceMode ? 'border-red-500 bg-red-500/10 text-red-300' : 'border-white/10 bg-white/5 text-slate-300'}`}
            >
              <div className="font-medium">Maintenance mode</div>
              <p className="text-slate-400 text-sm">Pause new bookings and notify workers during maintenance.</p>
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Bell size={24} className="text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-slate-400 text-sm">Manage system alerts and update channels.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10">
            <div>
              <h3 className="font-medium">Enable platform alerts</h3>
              <p className="text-slate-400 text-sm">Send notifications for urgent events and approvals.</p>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`px-4 py-2 rounded-full ${settings.notifications ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              {settings.notifications ? 'On' : 'Off'}
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-slate-400 mb-2">Platform language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg">
          <Save size={20} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
