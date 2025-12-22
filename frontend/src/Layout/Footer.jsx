import React from "react";
import logo from "../assets/logo.png";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0 mb-8">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Tguida logo"
              className="w-32 sm:w-40 object-contain"
            />
          </div>

          {/* Navigation Links - Centered */}
          <nav className="flex flex-wrap justify-center md:justify-center gap-6">
            <a
              href="#product"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium"
            >
              Product
            </a>
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium"
            >
              Pricing
            </a>
            <a
              href="#resources"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium"
            >
              Resources
            </a>
          </nav>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <a
              href="#twitter"
              className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#facebook"
              className="bg-blue-600 rounded-full p-2.5 hover:bg-blue-500 transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#instagram"
              className="text-gray-300 hover:text-pink-400 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#github"
              className="text-gray-300 hover:text-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-700/50 mb-6"></div>

        {/* Copyright Text */}
        <div className="text-center">
          <p className="text-gray-400 text-xs sm:text-sm tracking-wide">
            © 2025 Tguida. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
