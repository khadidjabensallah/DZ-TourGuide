import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { AuthAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";


export default function SignInPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setApiError("");
      setShowVerificationPrompt(false);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      setEmailError(!validateEmail(value));
    } else {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setApiError("");
    setSuccessMessage("");
    setShowVerificationPrompt(false);
    setResendStatus("");

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    if (!password) {
      setApiError(t('auth.passwordRequired') || "Password is required");
      return;
    }


    setSubmitting(true);
    try {
      const response = await AuthAPI.signin(email, password);

      if (!response) {
        setApiError(t('auth.unexpectedError') || "Unexpected response from server. Please try again.");
        return;
      }


      if (!response.success) {
        const message = response.message || t('auth.invalidEmailPassword') || "Invalid email or password. Please try again.";
        setApiError(message);

        if (message.toLowerCase().includes("verify")) {
          setShowVerificationPrompt(true);
        }
        return;
      }

      if (response.success) {
        if (response.data) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
          sessionStorage.setItem("is_authenticated", "true");
        }

        console.log("LOGIN SUCCESS - Full Response:", JSON.stringify(response, null, 2));
        console.log("LOGIN SUCCESS - Response Data:", response.data);

        // Try multiple possible property names for user type
        const userType = (
          response.data?.user_type ||
          response.data?.userType ||
          response.data?.role ||
          response.data?.type ||
          response.data?.account_type ||
          ""
        ).toLowerCase().trim();

        console.log("DETECTED USER TYPE:", userType);

        // Show a brief success message before redirecting
        setSuccessMessage(t('auth.signInSuccess'));


        // Navigation to home regardless of user type
        setTimeout(() => {
          console.log("✅ Navigating to Homepage: /");
          navigate("/", { replace: true });
        }, 500); // 500ms delay to ensure user sees the message and logs are visible
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const backendMessage = error?.data?.message || error?.message || "Unable to sign in right now.";
      setApiError(backendMessage);
      if (backendMessage.toLowerCase().includes("verify")) {
        setShowVerificationPrompt(true);
      } else {
        setShowVerificationPrompt(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToVerification = () => {
    if (email) {
      sessionStorage.setItem("user_email", email);
    }
    navigate("/verifyEmail", {
      state: {
        email: email || sessionStorage.getItem("user_email") || "",
        message: t('auth.verifyEmailNotice'),
      },

    });
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendStatus("");
    try {
      const response = await AuthAPI.resendVerificationCode(email);
      setResendStatus(response?.message || t('auth.codeResent') || "Verification code resent!");
    } catch (error) {
      setResendStatus(error.message || t('auth.unableToResend') || "Unable to resend verification code right now.");
    } finally {

      setResendLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          className="flex items-center text-gray-700 mb-6 hover:text-gray-900 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">{t('auth.back')}</span>
        </button>


        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://i.postimg.cc/gkjD1gq7/logo.png"
                alt="Tguida Logo"
                className="w-32 object-contain -my-12 -mt-13"
              />
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {t('auth.welcome')}
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              {t('auth.discoverAlgeria')}
            </p>
          </div>


          <form className="space-y-4 max-w-md mx-auto" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-black-700 mb-1.5">
                {t('auth.email')}
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={t('auth.emailPlaceholder')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"

                  }`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{t('auth.validEmailRequired')}</p>}

            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-black-700 mb-1.5">
                {t('auth.password')}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm pr-10 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
                {showVerificationPrompt && (
                  <div className="mt-3 flex flex-col gap-2">
                    <button type="button" onClick={handleGoToVerification} className="text-orange-600 font-semibold hover:underline text-sm text-left">
                      {t('auth.verifyNow')}
                    </button>
                    <button type="button" disabled={resendLoading} onClick={handleResendVerification} className="text-sm text-gray-700 underline disabled:opacity-50 text-left">
                      {resendLoading ? t('auth.resending') : t('auth.resendCode')}
                    </button>
                    {resendStatus && <p className="text-xs text-gray-600">{resendStatus}</p>}
                  </div>
                )}

              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 py-2 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="drop-shadow-sm">{submitting ? t('auth.signingIn') : t('auth.signIn')}</span>
            </button>

          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <button
                onClick={() => navigate('/selectType')}
                className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
              >
                {t('auth.register')}
              </button>
            </p>

          </div>

          <div className="text-center mt-2">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              {t('auth.forgotPassword')}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}