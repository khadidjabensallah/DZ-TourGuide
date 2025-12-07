import { Eye, EyeOff, Check, X, LockOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newPassRef = useRef(null);

  useEffect(() => {
    if (newPassRef.current) newPassRef.current.focus();
  }, []);

  // Password validation criteria
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const allCriteriaMet = Object.values(criteria).every(Boolean);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Password strength calculation
  const getPasswordStrength = () => {
    const metCount = Object.values(criteria).filter(Boolean).length;
    if (metCount === 0) return { level: 0, text: "", color: "" };
    if (metCount <= 2) return { level: 1, text: "Weak", color: "bg-red-500" };
    if (metCount === 3) return { level: 2, text: "Fair", color: "bg-yellow-500" };
    return { level: 3, text: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength();

  const handleReset = async () => {
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!allCriteriaMet || !passwordsMatch) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Password reset successful:", password);
    setIsSubmitting(false);
  };

  const preventPaste = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Set a New Password
            </h1>
            <p className="text-sm text-gray-600">
              Create a strong password to secure your account
            </p>
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                ref={newPassRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all pr-12"
                aria-label="New password"
                aria-describedby="password-requirements"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            <div id="password-requirements" className="mt-3 space-y-2">
              {[
                { key: "length", text: "At least 8 characters" },
                { key: "uppercase", text: "One uppercase letter" },
                { key: "lowercase", text: "One lowercase letter" },
                { key: "number", text: "One number" },
              ].map(({ key, text }) => (
                <div
                  key={key}
                  className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                    criteria[key] ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {criteria[key] ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span className={criteria[key] ? "font-medium" : ""}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                onPaste={preventPaste}
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none transition-all pr-12 ${
                  confirmTouched && confirmPassword && !passwordsMatch
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-orange-500"
                }`}
                aria-label="Confirm password"
                aria-invalid={confirmTouched && confirmPassword && !passwordsMatch}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 rounded"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={isSubmitting || !allCriteriaMet || !passwordsMatch}
            className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isSubmitting || !allCriteriaMet || !passwordsMatch
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting Password...
              </>
            ) : (
              "Set Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}