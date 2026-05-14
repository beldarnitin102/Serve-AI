import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, Shield, Globe, Moon, Sun, Save } from 'lucide-react';

const UserSettings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      sms: user?.preferences?.notifications?.sms ?? true,
      push: user?.preferences?.notifications?.push ?? true
    },
    language: user?.preferences?.language || 'en',
    theme: 'dark' // Only dark theme for now
  });

  const handleNotificationChange = (type, value) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: value
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile({
      preferences: settings
    });
    if (result.success) {
      alert('Settings saved successfully!');
    }
    setLoading(false);
  };

  const notificationOptions = [
    {
      key: 'email',
      label: 'Email Notifications',
      description: 'Receive booking updates and promotions via email',
      icon: Bell
    },
    {
      key: 'sms',
      label: 'SMS Notifications',
      description: 'Get important updates via text message',
      icon: Shield
    },
    {
      key: 'push',
      label: 'Push Notifications',
      description: 'Receive notifications in your browser',
      icon: Bell
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-300">
          Customize your experience and manage your preferences.
        </p>
      </div>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Bell size={24} className="mr-3 text-blue-400" />
          Notification Preferences
        </h3>

        <div className="space-y-6">
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Icon size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-slate-400 text-sm">{option.description}</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications[option.key]}
                    onChange={(e) => handleNotificationChange(option.key, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Language Settings */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Globe size={24} className="mr-3 text-green-400" />
          Language & Region
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preferred Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Moon size={24} className="mr-3 text-purple-400" />
          Appearance
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Moon size={20} />
                <span>Dark</span>
              </button>
              <button
                disabled
                className="flex items-center space-x-2 px-4 py-3 rounded-xl border-2 border-white/10 opacity-50 cursor-not-allowed"
              >
                <Sun size={20} />
                <span>Light (Coming Soon)</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Security */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Shield size={24} className="mr-3 text-red-400" />
          Account Security
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-slate-400 text-sm">Update your account password</p>
            </div>
            <Button variant="secondary" size="sm">
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-slate-400 text-sm">Add an extra layer of security</p>
            </div>
            <Button variant="secondary" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div>
              <h4 className="font-medium text-red-400">Delete Account</h4>
              <p className="text-slate-400 text-sm">Permanently delete your account</p>
            </div>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading} size="lg">
          <Save size={20} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;