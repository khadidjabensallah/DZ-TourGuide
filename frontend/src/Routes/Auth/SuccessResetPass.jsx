// ==================== FILE 4: SuccessResetPassword.jsx ====================
import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SuccessResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoSignedIn = location.state?.autoSignedIn || false;
  const userData = location.state?.userData || null;

  useEffect(() => {
    // If auto-signed in, redirect to appropriate dashboard after 3 seconds
    if (autoSignedIn && userData) {
      const timer = setTimeout(() => {
        if (userData.user_type === 'guide') {
          navigate('/GuideProfileG');
        } else {
          navigate('/');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [autoSignedIn, userData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <ShieldCheck className="w-12 h-12 text-green-600" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Password Changed
          </h1>
          <h2 className="text-3xl font-bold text-orange-500 mb-6">
            Successfully!
          </h2>

          <p className="text-gray-600 mb-8">
            {autoSignedIn 
              ? 'You have been automatically signed in! Redirecting...'
              : 'Your password has been reset. You can now sign in with your new password.'}
          </p>

          {autoSignedIn && userData && (
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Welcome back!</p>
              <p className="text-sm font-medium text-gray-900">{userData.email}</p>
            </div>
          )}

          {!autoSignedIn && (
            <button
              onClick={() => navigate('/signin')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Go to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}