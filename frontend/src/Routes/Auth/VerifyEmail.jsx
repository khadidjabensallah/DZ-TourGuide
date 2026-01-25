import { Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";


export default function VerifyEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get email from location state or sessionStorage
    const email = location.state?.email || sessionStorage.getItem('user_email') || "";
    setUserEmail(email);
  }, [location]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6 && /^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    setCode(newCode);
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError(t('auth.completeCodeRequired'));
      return;
    }



    setVerifying(true);
    setError("");

    try {
      // Get user_id from sessionStorage
      const userId = sessionStorage.getItem('pending_verification_user_id');

      if (!userId) {
        setError(t('auth.sessionExpired'));
        return;
      }



      const response = await AuthAPI.verifyEmail(userId, verificationCode, userEmail);


      if (response.success) {
        setSuccess(true);
        // Clear session data
        sessionStorage.removeItem('pending_verification_user_id');
        sessionStorage.removeItem('user_email');

        // Redirect to signin after 2 seconds
        setTimeout(() => {
          navigate("/signin", {
            state: {
              message: t('auth.verifiedRedirectMsg')
            }

          });
        }, 2000);

      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.message || t('auth.invalidCode'));
      // Clear code on error


      setCode(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    try {
      // Get userId from state if available, or session
      const userId = sessionStorage.getItem('pending_verification_user_id');
      await AuthAPI.resendVerificationCode(userId, userEmail);

      setError(""); // Clear any previous errors
      alert(t('auth.codeSentNotice'));
    } catch (error) {
      setError(error.message || t('auth.signupFailed'));
    }


  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.verifyEmail')}
          </h1>
          <p className="text-gray-500 text-sm">
            {t('auth.enterCodeSent')} {userEmail}
          </p>

        </div>


        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
            {t('auth.emailVerifiedSuccess')}
          </div>
        )}


        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Code Input */}
        <div className="flex gap-3 justify-center mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={verifying || success}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? t('auth.verifying') : success ? t('auth.verified') : t('auth.verifyEmail')}
        </button>


        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('auth.didntReceive')}{" "}
            <button
              onClick={handleResendCode}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              {t('auth.resend')}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
