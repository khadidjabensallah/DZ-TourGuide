import { LogOut, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Reports() {
  // TODO: Replace with API fetch call from backend
  const reports = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            
            <nav className="flex gap-6 items-center">
              <img src="/assets/logo.png" alt="DZ-TourGuide Logo" className="h-8" />
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Guide Validation</a>
              <a href="#" className="text-orange-500 font-medium text-sm border-b-2 border-orange-500">Reports</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">User Management</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-600">admin@dz-tourguide.com</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Reports</h1>

        {/* Reports List */}
        <div className="space-y-6">
          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-400 text-lg">No reports found</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-lg p-6">
                {/* Report Type */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="font-bold text-gray-900">{report.type}</h3>
                </div>

                {/* Reporter and Reported User */}
                <div className="grid grid-cols-2 gap-6 mb-4">
                  {/* Reporter (Tourist) */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Reported By(Tourist)</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{report.reporter.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{report.reporter.name}</p>
                        <p className="text-xs text-gray-500">{report.reporter.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reported User (Guide) */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Reported User(Guide)</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{report.reportedUser.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{report.reportedUser.name}</p>
                        <p className="text-xs text-gray-500">{report.reportedUser.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tour */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Tour</p>
                  <p className="font-semibold text-gray-900">{report.tour}</p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
                </div>

                {/* Footer with Date and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Reported on   {report.date}</p>
                  
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                    Delete Guide
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}