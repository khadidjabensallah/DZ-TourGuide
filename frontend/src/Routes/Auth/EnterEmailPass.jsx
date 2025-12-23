// ==================== FILE 1: EnterEmailPass.jsx ====================

import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../../utils/api';

export default function EnterEmailPass() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devCode, setDevCode] = useState(null);
  const [unverified, setUnverified] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await AuthAPI.requestPasswordReset(email);

      if (response && response.success) {
        setSuccessMsg(response.message || 'Code sent!');

        const data = response.data || {};
        if (data.dev_reset_code) {
          setDevCode(data.dev_reset_code);
          sessionStorage.setItem('dev_reset_code', data.dev_reset_code);
        }
        if (data.unverified_email) setUnverified(true);

        if (data.user_id) sessionStorage.setItem('reset_user_id', data.user_id);
        sessionStorage.setItem('reset_email', data.email || email);

        // Navigate to verify page
        navigate('/verify-reset', { state: { email: data.email || email, dev_reset_code: data.dev_reset_code } });
      }
    } catch (err) {
      const message = err?.data?.message || err.message || 'Failed to send reset code';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <KeyRound className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Your Password?</h1>
            <p className="text-sm text-gray-600">Enter your email and we'll send you a reset code</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          {devCode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">Dev reset code: <strong className="font-mono">{devCode}</strong></p>
              {unverified && <p className="text-xs text-yellow-700 mt-1">Note: this account email is not verified yet.</p>}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </button>

          <div className="text-center mt-4">
            <button onClick={() => navigate('/signin')} className="text-sm text-gray-600 hover:text-gray-900">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}