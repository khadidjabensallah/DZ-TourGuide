import React, { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function SignUpGuideP1() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    familyName: "",
    email: "",
    phone: "",
    password: "",
    certificate: null,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "phone") {
      val = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // clear error for this field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        certificate: file,
      }));
    }
  };

  // validate all fields
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.familyName.trim())
      newErrors.familyName = "Family name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if ((formData.phone || "").length !== 9)
      newErrors.phone = "Enter 9 digits (local part) after +213";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.certificate)
      newErrors.certificate = "Certificate is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // navigate to signupguideP2 and pass form data
    navigate("/signupguideP2", { state: formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-1">
            <img
              src={logo}
              alt="TGUIDA Logo"
              className="w-32 object-contain -my-12 -mt-13"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Bienvenue sur Tguida
          </h1>
          <p className="text-sm text-gray-600 font-bold">
            Discover Algeria with our certificated guides
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          {/* FIRST NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              }`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-0">{errors.firstName}</p>
            )}
          </div>

          {/* FAMILY NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Family Name
            </label>
            <input
              type="text"
              name="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              placeholder="Enter your family name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                errors.familyName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              }`}
            />
            {errors.familyName && (
              <p className="text-xs text-red-500 mt-0">{errors.familyName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-0">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="flex">
              <span
                className="inline-flex items-center px-3 rounded-l-lg border border-r-0 
                               border-gray-300 bg-gray-100 text-gray-700"
              >
                +213
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="enter 9 digits"
                maxLength={9}
                className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-0">{errors.phone}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-0">{errors.password}</p>
            )}
          </div>

          {/* CERTIFICATE */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Upload Your Certificate
            </label>
            <div className="relative">
              <input
                type="file"
                id="certificate"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="certificate"
                className={`w-full px-4 py-2 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer 
                           hover:border-orange-500 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] transition ${
                             errors.certificate
                               ? "border-red-500"
                               : "border-gray-300"
                           }`}
              >
                <Upload size={20} className="text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">
                  {formData.certificate
                    ? formData.certificate.name
                    : "Click to upload"}
                </span>
              </label>
              {errors.certificate && (
                <p className="text-xs text-red-500 mt-0">
                  {errors.certificate}
                </p>
              )}
            </div>
          </div>

          {/* NEXT BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 py-2 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <span className="drop-shadow-sm">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
