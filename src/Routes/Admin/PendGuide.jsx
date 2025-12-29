import { FileText, LogOut, Phone, MapPin, Languages } from "lucide-react";
import { useState } from "react";

const logo = "./assets/logo.png";

export default function GuideValidation() {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  // TODO: Add API fetch here when backend is ready
  // Example:
  // useEffect(() => {
  //   const fetchPendingGuides = async () => {
  //     try {
  //       setLoading(true);
  //       const API_BASE_URL = 'http://localhost:8000/api';
  //       const response = await fetch(`${API_BASE_URL}/guides/pending`);
  //       if (!response.ok) throw new Error('Failed to fetch pending guides');
  //       const data = await response.json();
  //       const formattedGuides = data.map(guide => ({
  //         id: guide.id,
  //         name: guide.name || guide.full_name,
  //         email: guide.email,
  //         phone: guide.phone,
  //         languages: guide.languages || [],
  //         wilayas: guide.wilayas_count || 0,
  //         certificates: guide.certificates || [],
  //         submittedOn: guide.submitted_at || guide.created_at
  //       }));
  //       setPendingGuides(formattedGuides);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching pending guides:', err);
  //       setLoading(false);
  //       setPendingGuides([]);
  //     }
  //   };
  //   fetchPendingGuides();
  // }, []);

  // Handle approve action
  const handleApprove = async (guideId) => {
    try {
      const API_BASE_URL = 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/guides/${guideId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setPendingGuides(prev => prev.filter(guide => guide.id !== guideId));
        alert('Guide approved successfully!');
      } else {
        throw new Error('Failed to approve guide');
      }
    } catch (err) {
      console.error('Error approving guide:', err);
      alert('Error approving guide. Please try again.');
    }
  };

  // Handle reject action
  const handleReject = async (guideId) => {
    try {
      const API_BASE_URL = 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/guides/${guideId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setPendingGuides(prev => prev.filter(guide => guide.id !== guideId));
        alert('Guide application rejected.');
      } else {
        throw new Error('Failed to reject guide');
      }
    } catch (err) {
      console.error('Error rejecting guide:', err);
      alert('Error rejecting guide. Please try again.');
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <nav className="flex gap-6 items-center">
              <img src={logo} alt="DZ-TourGuide Logo" className="h-12" />
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Dashboard</a>
              <a href="#" className="text-orange-500 font-medium text-sm border-b-2 border-orange-500">
                Guide Validation
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Reports
              </a>
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Pending Guide Applications</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Applications List */}
        {!loading && (
          <div className="space-y-6">
            {pendingGuides.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">No requests at the moment</p>
              </div>
            ) : (
              pendingGuides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-500 font-bold text-2xl">
                          {getInitials(guide.name)}
                        </span>
                      </div>

                      {/* Guide Info */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>
                        <p className="text-gray-600 mb-2">{guide.email}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{guide.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Languages className="w-4 h-4" />
                            <span>{guide.languages.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{guide.wilayas} wilaya{guide.wilayas !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submission Date */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Submitted on</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(guide.submittedOn)}
                      </p>
                    </div>
                  </div>

                  {/* Certificates */}
                  <div className="mb-4">
                    {guide.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 py-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Professional Certificates</p>
                          <p className="text-sm text-gray-600">{cert.filename || `Certificate_${guide.name}.pdf`}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(guide.id)}
                      className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(guide.id)}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}