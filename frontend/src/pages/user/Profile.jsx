import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || ''
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-slate-300">
            Manage your personal information and preferences.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                <User size={64} className="text-white" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Camera size={20} className="text-white" />
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
            <p className="text-slate-400 mb-4">{user?.email}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Trust Score: {user?.trustScore || 100}%</span>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{12}</div>
                <div className="text-sm text-slate-400">Total Bookings</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<User size={20} />}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Mail size={20} />}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Phone size={20} />}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">
                  Account Type
                </label>
                <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-white capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <MapPin size={20} className="mr-2" />
                Address
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="123 Main Street"
                />

                <Input
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Input
                  label="State"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="State"
                />

                <Input
                  label="ZIP Code"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="12345"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-4 pt-6">
                <Button onClick={handleSave} loading={loading}>
                  <Save size={20} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Account Statistics */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Account Statistics</h3>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
            <div className="text-slate-400">Total Bookings</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">10</div>
            <div className="text-slate-400">Completed</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">4.8</div>
            <div className="text-slate-400">Average Rating</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">$2,450</div>
            <div className="text-slate-400">Total Spent</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;