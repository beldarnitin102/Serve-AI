import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { workerAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { User, Mail, Phone, MapPin, Camera, Save, Award, Briefcase, Star, ShieldCheck, CheckCircle, Video } from 'lucide-react';

const WorkerProfile = () => {
  const { user, updateProfile, updateWorkerProfile } = useAuth();
  const workerProfile = user?.worker;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: workerProfile?.bio || user?.bio || '',
    experience: workerProfile?.experience || '',
    services: workerProfile?.services || [],
    hourlyRate: workerProfile?.hourlyRate || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || ''
    },
    certifications: workerProfile?.certifications || user?.certifications || [],
    languages: user?.languages || []
  });

  const availableServices = [
    'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting',
    'HVAC', 'Appliance Repair', 'Landscaping', 'Pest Control', 'Moving'
  ];

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

  const handleServiceToggle = (service) => {
    const currentServices = formData.services || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];

    setFormData({
      ...formData,
      services: newServices
    });
  };

  const [files, setFiles] = useState({
    aadhaar: null,
    profileImage: null,
    demoVideo: null
  });

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let result;
      // If files are present, use the verification endpoint to trigger AI analysis
      if (files.aadhaar || files.profileImage || files.demoVideo) {
        const formDataPayload = new FormData();
        formDataPayload.append('experience', formData.experience);
        formDataPayload.append('services', formData.services.join(','));
        formDataPayload.append('hourlyRate', formData.hourlyRate);
        formDataPayload.append('bio', formData.bio);
        if (files.aadhaar) formDataPayload.append('aadhaar', files.aadhaar);
        if (files.profileImage) formDataPayload.append('profileImage', files.profileImage);
        if (files.demoVideo) formDataPayload.append('demoVideo', files.demoVideo);

        const response = await workerAPI.verifyProfile(formDataPayload);
        updateProfile({ worker: response.data.worker, profileImage: response.data.worker.profileMedia.profileImage });
        result = { success: true };
      } else {
        result = user?.role === 'worker'
          ? await updateWorkerProfile(formData)
          : await updateProfile(formData);
      }

      if (result.success) {
        setIsEditing(false);
        setFiles({ aadhaar: null, profileImage: null, demoVideo: null });
      }
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: workerProfile?.bio || user?.bio || '',
      experience: workerProfile?.experience || '',
      services: workerProfile?.services || [],
      hourlyRate: workerProfile?.hourlyRate || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || ''
      },
      certifications: workerProfile?.certifications || user?.certifications || [],
      languages: user?.languages || []
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-slate-300">
            Showcase your skills and build trust with customers.
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
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-full h-full object-cover rounded-2xl border-2 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <User size={64} className="text-white" />
                </div>
              )}
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
                <span className="text-sm font-medium">Trust Score: {workerProfile?.verification?.trustRating || user?.trustScore || 100}%</span>
              </div>

              <div className="flex items-center justify-center text-yellow-400">
                <Star size={16} className="mr-1" />
                <span className="text-sm font-medium">{workerProfile?.rating || user?.rating || 4.8} Rating</span>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{workerProfile?.completedJobs || user?.completedJobs || 87}</div>
                <div className="text-sm text-slate-400">Jobs Completed</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{workerProfile?.responseTime || user?.responseTime || 15}m</div>
                <div className="text-sm text-slate-400">Avg Response Time</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-6">Professional Information</h3>

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

              <Input
                label="Years of Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Briefcase size={20} />}
                placeholder="e.g., 5 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Professional Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell customers about your experience and specialties..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                rows={4}
              />
            </div>

            {/* Services Offered */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">
                Services Offered
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.services?.includes(service) || false}
                      onChange={() => isEditing && handleServiceToggle(service)}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className={`text-sm ${!isEditing ? 'text-slate-400' : 'text-slate-300'}`}>
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 flex items-center">
                <MapPin size={20} className="mr-2" />
                Service Area
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Your business address"
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
            </div>

            {/* Verification Documents Section */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-400" />
                Identity & Verification Documents
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Aadhar Card</label>
                  {workerProfile?.profileMedia?.aadhaar ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-400 font-bold flex items-center gap-2">
                      <CheckCircle size={14} /> Aadhaar Verified
                    </div>
                  ) : (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold">
                      Aadhaar Missing
                    </div>
                  )}
                  {isEditing && (
                    <input 
                      type="file" 
                      name="aadhaar"
                      onChange={handleFileChange}
                      className="text-[10px] text-slate-400" 
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Passport Photo</label>
                  <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    {user?.profileImage ? (
                      <img src={user.profileImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Camera size={20} className="text-slate-700" /></div>
                    )}
                  </div>
                  {isEditing && (
                    <input 
                      type="file" 
                      name="profileImage"
                      onChange={handleFileChange}
                      className="text-[10px] text-slate-400" 
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Work Demo Video</label>
                  {workerProfile?.profileMedia?.demoVideo ? (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400 font-bold flex items-center gap-2">
                      <Video size={14} /> Demo Video Live
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-800 border border-white/5 rounded-xl text-xs text-slate-500">
                      No Video Uploaded
                    </div>
                  )}
                  {isEditing && (
                    <input 
                      type="file" 
                      name="demoVideo"
                      onChange={handleFileChange}
                      className="text-[10px] text-slate-400" 
                    />
                  )}
                </div>
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

      {/* Certifications & Languages */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Award size={24} className="mr-3 text-yellow-400" />
            Certifications
          </h3>

          <div className="space-y-3">
            {user?.certifications?.length > 0 ? (
              user.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Award size={20} className="text-yellow-400" />
                  <span className="text-slate-300">{cert}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">
                No certifications added yet
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Languages Spoken</h3>

          <div className="space-y-3">
            {user?.languages?.length > 0 ? (
              user.languages.map((lang, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">{lang}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">
                No languages specified
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Performance Stats */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Performance Statistics</h3>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{user?.completedJobs || 87}</div>
            <div className="text-slate-400 text-sm">Total Jobs</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{user?.rating || 4.8}</div>
            <div className="text-slate-400 text-sm">Average Rating</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{user?.responseTime || 15}m</div>
            <div className="text-slate-400 text-sm">Response Time</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">${user?.totalEarnings?.toLocaleString() || '15,420'}</div>
            <div className="text-slate-400 text-sm">Total Earnings</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkerProfile;