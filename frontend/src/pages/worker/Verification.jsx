import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { workerAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import TrustBadge from '../../components/TrustBadge';
import { FileText, Camera, Video, ShieldCheck, UploadCloud, Award } from 'lucide-react';

const Verification = () => {
  const { user, updateProfile, dispatch } = useAuth();
  const navigate = useNavigate();

  // Redirection for already verified workers
  React.useEffect(() => {
    if (user?.worker?.verification?.isVerified) {
      navigate('/worker/jobs');
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formState, setFormState] = useState({
    experience: user?.worker?.experience || 0,
    services: user?.worker?.services?.join(', ') || '',
    hourlyRate: user?.worker?.hourlyRate || 250,
    aadhaar: null,
    pan: null,
    certificates: null,
    profileImage: null,
    introVideo: null,
    demoVideo: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const steps = [
    { id: 1, title: 'Profile Basics' },
    { id: 2, title: 'Identity Documents' },
    { id: 3, title: 'Video Verification' }
  ];

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: files ? (files.length > 1 ? files : files[0]) : value
    }));
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
      setMessage('');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setMessage('');
    }
  };

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setAnalysisProgress(10);

    try {
      const data = new FormData();
      data.append('experience', formState.experience);
      data.append('services', formState.services);
      data.append('hourlyRate', formState.hourlyRate);
      if (formState.aadhaar) data.append('aadhaar', formState.aadhaar);
      if (formState.pan) data.append('pan', formState.pan);
      if (formState.certificates) {
        Array.from(formState.certificates).forEach((file) => data.append('certificates', file));
      }
      if (formState.profileImage) data.append('profileImage', formState.profileImage);
      if (formState.introVideo) data.append('introVideo', formState.introVideo);
      if (formState.demoVideo) data.append('demoVideo', formState.demoVideo);

      // Simulate AI processing progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(95, prev + 5));
      }, 400);

      const response = await workerAPI.verifyProfile(data);
      clearInterval(progressInterval);
      setAnalysisProgress(100);

    if (response.data?.worker) {
        setVerificationResult(response.data.verification);
        dispatch({ 
          type: 'SET_USER', 
          payload: { ...user, worker: response.data.worker } 
        });
        setTimeout(() => {
          setIsCompleted(true);
        }, 800);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verificationStatus = user?.worker?.verification?.isVerified;

  return (
    <div className="space-y-8">
      {/* Loading Overlay with Progress */}
      {loading && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md space-y-6">
            <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">AI Analysis in Progress</h3>
              <p className="text-slate-400">
                Our AI is scanning your documents, verifying your identity, and assessing your profile communication signals.
              </p>
            </div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-blue-400 font-bold">{analysisProgress > 30 ? '✅' : '⏳'}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Identity</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">{analysisProgress > 60 ? '✅' : '⏳'}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">{analysisProgress > 90 ? '✅' : '⏳'}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">Authenticity</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Worker Verification</h1>
          <p className="text-slate-300 max-w-2xl">
            Complete your secure profile verification to unlock booking acceptance, location access, and live jobs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 px-5 py-3">
            <span className="text-slate-400 text-sm">Status</span>
            <div className={`mt-1 font-semibold ${verificationStatus ? 'text-green-400' : 'text-yellow-400'}`}>
              {verificationStatus ? 'Verified' : 'Pending Verification'}
            </div>
          </div>
          <div className="flex items-center gap-3">
             {user?.worker?.verification?.badge && <TrustBadge level={user?.worker?.verification?.badge} />}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Verification Progress</h2>
                <p className="text-slate-400 text-sm">Follow the steps below to complete verification.</p>
              </div>
              <div className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                Step {step} of {steps.length}
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((item) => (
                <div key={item.id} className={`rounded-3xl p-4 border ${item.id === step ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 bg-slate-900/70'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-slate-400 text-sm">{item.id === step ? 'Current step' : 'Upcoming step'}</p>
                    </div>
                    <div className="text-sm text-slate-400">{item.id === step ? 'Active' : 'Ready'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      label="Experience (years)"
                      name="experience"
                      type="number"
                      value={formState.experience}
                      onChange={handleFieldChange}
                      placeholder="e.g. 3"
                    />
                    <Input
                      label="Hourly Rate"
                      name="hourlyRate"
                      type="number"
                      value={formState.hourlyRate}
                      onChange={handleFieldChange}
                      placeholder="e.g. 250"
                    />
                    <Input
                      label="Services"
                      name="services"
                      value={formState.services}
                      onChange={handleFieldChange}
                      placeholder="Plumbing, Electrical, Cleaning"
                    />
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <h3 className="font-semibold text-white mb-2">Why this matters</h3>
                    <p className="text-slate-400 text-sm">
                      The AI verification engine uses your experience and service specialties to match you with high-value jobs.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <label className="block text-sm font-medium text-slate-300">Aadhaar / PAN</label>
                    <input
                      type="file"
                      name="aadhaar"
                      accept="image/*,application/pdf"
                      onChange={handleFieldChange}
                      className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white"
                    />
                    <input
                      type="file"
                      name="pan"
                      accept="image/*,application/pdf"
                      onChange={handleFieldChange}
                      className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white"
                    />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText size={20} className="text-blue-400" />
                      <h3 className="text-white font-semibold">Document quality</h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Upload clear government ID scans, certificates, and a professional profile image. AI checks authenticity and document validity.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Certificates</label>
                    <input
                      type="file"
                      name="certificates"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFieldChange}
                      className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Profile Image</label>
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleFieldChange}
                        className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Introduction Video</label>
                      <input
                        type="file"
                        name="introVideo"
                        accept="video/*"
                        onChange={handleFieldChange}
                        className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Demo Video</label>
                      <input
                        type="file"
                        name="demoVideo"
                        accept="video/*"
                        onChange={handleFieldChange}
                        className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Video size={20} className="text-blue-400" />
                      <h3 className="text-white font-semibold">AI Video Review</h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                      AI will analyze your intro and demo videos for face consistency, communication confidence, and overall professionalism.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {message && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button onClick={handleBack} variant="secondary" disabled={step === 1 || loading}>
              Back
            </Button>
            {step < steps.length ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading}>
                Submit Verification
              </Button>
            )}
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-blue-500/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={24} className="text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Secure onboarding</h3>
                <p className="text-slate-400 text-sm">Your documents and media are processed by AI securely with Cloudinary storage.</p>
              </div>
            </div>
            <div className="space-y-3 text-slate-300 text-sm">
              <p>• Complete onboarding to unlock job acceptance.</p>
              <p>• AI verifies docs, communication, and identity consistency.</p>
              <p>• A verified badge increases trust with customers.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Award size={24} className="text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Verification benefits</h3>
              </div>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Accept bookings instantly.</li>
              <li>• View customer location and start jobs.</li>
              <li>• Build a higher trust score and badge.</li>
            </ul>
          </div>
        </Card>
      </div>

      <Modal isOpen={isCompleted} onClose={() => navigate('/worker/dashboard')} title="Verification Results">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">AI Analysis Complete</h3>
            <p className="text-slate-400">Your profile has been assessed by our AI Trust Engine.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 text-center space-y-2">
               <div className="text-sm text-slate-400 uppercase tracking-wider">Trust Score</div>
               <div className="text-3xl font-black text-blue-400">{verificationResult?.trustScore || 0}%</div>
            </div>
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 flex flex-col items-center justify-center space-y-2">
               <div className="text-sm text-slate-400 uppercase tracking-wider">Badge</div>
               <TrustBadge level={verificationResult?.badge || 'Bronze'} size="md" />
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-slate-400">Professionalism</span>
                <span className="text-white font-medium">{verificationResult?.metrics?.professionalism}%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${verificationResult?.metrics?.professionalism}%` }} />
             </div>
             
             <div className="flex justify-between text-sm mt-4">
                <span className="text-slate-400">Communication</span>
                <span className="text-white font-medium">{verificationResult?.metrics?.communication}%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${verificationResult?.metrics?.communication}%` }} />
             </div>
          </div>

          <div className="rounded-3xl bg-blue-500/10 border border-blue-500/20 p-5">
            <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
               <ShieldCheck size={18} />
               AI Assessment
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{verificationResult?.report}"
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
             <div className={`w-3 h-3 rounded-full ${verificationResult?.fraudRisk === 'low' ? 'bg-green-500' : 'bg-yellow-500'}`} />
             <span className="text-sm text-slate-300">Fraud Risk: <strong className="uppercase">{verificationResult?.fraudRisk || 'Low'}</strong></span>
          </div>

          <Button onClick={() => navigate('/worker/dashboard')} className="w-full h-14 text-lg">
            Access Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Verification;
