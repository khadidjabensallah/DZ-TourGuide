import React from "react";
import logo from "../assets/logo.png";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Main Footer Content */}
        <div className="flex justify-between items-center mb-12">
          {/* Logo Section */}
          <div className="flex-shrink-0 ml-4 -mt-10 -mb-10 ">
            <img
              src={logo}
              alt="Tguida_Logo"
              className="w-44 h-44 object-cover"
            />
          </div>

          {/* Navigation Links - Centered */}
          <nav className="flex gap-12">
            <a
              href="#product"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Product
            </a>
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Pricing
            </a>
            <a
              href="#resources"
              className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium"
            >
              Resources
            </a>
          </nav>

          {/* Social Media Icons */}
          <div className="flex items-center gap-5">
            <a
              href="#twitter"
              className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter size={22} />
            </a>
            <a
              href="#facebook"
              className="bg-blue-600 rounded-full p-2.5 hover:bg-blue-500 transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#instagram"
              className="text-gray-300 hover:text-pink-400 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#github"
              className="text-gray-300 hover:text-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-700/50 mb-8"></div>

        {/* Copyright Text */}
        <div className="text-center">
          <p className="text-gray-400 text-sm tracking-wide">
            © Copyright 2025, All Rights Reserved by Logo
          </p>
        </div>
      </div>
    </footer>
  );
}
