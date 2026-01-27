// ==================== FILE 3: ResetPassword.jsx ====================
import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthAPI } from '../../utils/api';


export default function ResetPassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const allCriteriaMet = Object.values(criteria).every(Boolean);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSubmit = allCriteriaMet && passwordsMatch;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await AuthAPI.resetPassword(password, confirmPassword);

      if (response.success) {
        const email = response.data?.email || sessionStorage.getItem('reset_email');

        // Try automatic sign-in
        if (email) {
          try {
            const signinResp = await AuthAPI.signin(email, password);
            if (signinResp?.success) {
              sessionStorage.setItem('user', JSON.stringify(signinResp.data));
              sessionStorage.setItem('is_authenticated', 'true');

              // Clear reset data
              sessionStorage.removeItem('reset_email');
              sessionStorage.removeItem('reset_user_id');

              // Navigate to success with auto-login info
              navigate('/password-changed', {
                state: {
                  autoSignedIn: true,
                  userData: signinResp.data
                }
              });
              return;
            }
          } catch (signinErr) {
            console.warn('Auto sign-in failed:', signinErr);
          }
        }

        // Clear reset data
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('reset_user_id');

        // Navigate to success without auto-login
        navigate('/password-changed', {
          state: { autoSignedIn: false }
        });
      }
    } catch (err) {
      const message = err?.data?.message || err.message || t('auth.unexpectedError');
      setError(message);
    } finally {

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <button
          onClick={() => navigate('/verify-reset')}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('auth.back')}
        </button>


        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full">
              <KeyRound className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.resetPassword')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('auth.createNewPassword')}
            </p>
          </div>


          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.newPassword')}
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Criteria */}
            <div className="mt-3 space-y-2">
              {[
                { key: 'length', text: t('auth.atLeast8Chars') || "At least 8 characters" },
                { key: 'uppercase', text: t('auth.oneUppercase') || "One uppercase letter" },
                { key: 'lowercase', text: t('auth.oneLowercase') || "One lowercase letter" },
                { key: 'number', text: t('auth.oneNumber') || "One number" },
              ].map(({ key, text }) => (

                <div
                  key={key}
                  className={`flex items-center gap-2 text-xs ${criteria[key] ? 'text-green-600' : 'text-gray-500'
                    }`}
                >
                  {criteria[key] ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.confirmNewPassword')}
            </label>

            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg outline-none transition-all ${confirmPassword && !passwordsMatch
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">{t('auth.passwordsDoNotMatch')}</p>
            )}

          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 ${!canSubmit || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
          >
            {isLoading ? t('auth.resetting') : t('auth.resetPassword')}
          </button>

        </div>
      </div>
    </div>
  );
}

