// ==================== FILE 2: VerifyResetCode.jsx ====================
import React, { useState, useEffect, useRef } from 'react';
import { LockOpen, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthAPI } from '../../utils/api';

export default function VerifyResetCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [devCode, setDevCode] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email and dev code from navigation state or sessionStorage
    const stateEmail = location.state?.email || sessionStorage.getItem('reset_email');
    const stateDev = location.state?.dev_reset_code || sessionStorage.getItem('dev_reset_code');

    setEmail(stateEmail || '');
    setDevCode(stateDev || null);

    if (!stateEmail) {
      setError('Session expired. Please start over.');
      setTimeout(() => navigate('/forgot-password'), 2000);
      return;
    }

    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, [location, navigate]);
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6 && /^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    setCode(newCode);
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userId = sessionStorage.getItem('reset_user_id');

      if (!userId) {
        throw new Error('Session expired. Please start over.');
      }

      // AuthAPI.verifyPasswordResetCode expects (code, userId)
      const response = await AuthAPI.verifyPasswordResetCode(verificationCode, userId);

      if (response.success) {
        // Navigate to reset password page
        navigate('/reset-password');
      }
    } catch (err) {
      const message = err?.data?.message || err.message || 'Invalid code. Please try again.';
      setError(message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email not found. Please start over.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await AuthAPI.requestPasswordReset(email);
      alert(response.message || 'New code sent! Please check your email.');
      
      // Update dev code if available
      if (response.data?.dev_reset_code) {
        setDevCode(response.data.dev_reset_code);
      }
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to resend code';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <button
          onClick={() => navigate('/verify-email-pass')}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <LockOpen className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Code
            </h1>
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to<br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          {devCode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium">Dev Mode</p>
              <p className="text-sm text-yellow-900 font-mono mt-1">Code: {devCode}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-center mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all disabled:bg-gray-50"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-4"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-orange-500 hover:text-orange-600 font-medium disabled:opacity-50"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
