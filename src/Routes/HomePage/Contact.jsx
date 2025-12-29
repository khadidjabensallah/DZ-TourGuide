import React, { useState } from "react";
import Header from "../../Layout/Header";
import { Facebook, Instagram, Twitter, Phone, Mail } from "lucide-react";
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f5e6d3] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl relative">
          {/* Orange background section - full width */}
          <div className="bg-[#ff8c1a] text-white p-12 pb-32">
            <h2 className="text-3xl font-bold mb-3">We Are Here to Help You</h2>
            <p className="text-sm mb-10 max-w-md">
              A question? A suggestion? Our team is here to listen and support
              you throughout your TEQUILA experience.
            </p>

            <div className="space-y-3 mb-10">
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span className="text-sm">+33 (0) 01 45 67 89</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span className="text-sm">contact@tequila.di</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                <Facebook size={18} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                <Instagram size={18} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                <Twitter size={18} />
              </div>
            </div>
          </div>

          {/* Form card - positioned on top right */}
          <div className="absolute top-8 right-8 bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#ff8c1a] text-white py-3 rounded-full font-semibold hover:bg-[#e67d16] transition-colors shadow-md text-sm"
              >
                Send the message
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
