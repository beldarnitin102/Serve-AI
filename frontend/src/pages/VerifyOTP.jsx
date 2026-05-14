import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Mail } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyOTP(userId, otp);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    // Implement resend OTP logic
    setError('Resend functionality not implemented yet');
  };

  return (
    <div className="min-h-screen bg-[#071226] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-slate-300">
              We've sent a verification code to your email address
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label="Verification Code"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (error) setError('');
              }}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              onClick={handleVerifyOTP}
              className="w-full"
              size="lg"
              loading={loading}
              disabled={otp.length !== 6}
            >
              Verify Email
            </Button>

            <div className="text-center">
              <p className="text-slate-300 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Resend Code
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;