import { Search, Eye, Trash2, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminAPI } from "../../utils/api";
import AdminHeader from "../../Layout/AdminHeader";

// Import logo - adjust path if needed
const logo = "./assets/logo.png"; // Try with ./ instead of /

export default function UserManagement() {
  const [selectedFilter, setSelectedFilter] = useState("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch users from API
        const user = JSON.parse(sessionStorage.getItem('user'));
        const adminId = user?.user_id;

        if (!adminId) {
          throw new Error('Unauthorized');
        }

        const response = await AdminAPI.getAllUsers(adminId);

        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch users');
        }

        const apiUsers = response.users.map(u => ({
          id: u.id,
          name: u.name,
          type: u.type === 'guide' ? 'Guide' : 'Tourist',
          email: u.email,
          tours: u.stats?.tours_count || 0,
          completed: u.stats?.completed_tours || u.stats?.completed || 0, // Handle different structure for guid/tourist
          reports: u.reports_count || 0,
          hasPhoto: !!u.photo_url
        }));

        setUsers(apiUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
        setUsers([]); // Empty array - no fake data
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on selection
  const filteredUsers = users.filter(user => {
    const matchesFilter = selectedFilter === "All Users" || user.type === selectedFilter.slice(0, -1);
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <AdminHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage all users on the platform</p>
          </div>

          {/* Filters and Search */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-300 rounded-lg px-4 py-2 pr-10 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              >
                <option>All Users</option>
                <option>Guides</option>
                <option>Tourists</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a User"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          )}



          {/* Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Stats</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Reports</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {user.hasPhoto ? (
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                          ) : (
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-500 font-bold text-lg">H</span>
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.type === "Guide"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                          }`}>
                          {user.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">
                        {user.type === "Guide" ? (
                          <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              {user.tours}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                              {user.completed}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-600 text-sm">{user.completed}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.reports === 0
                          ? "bg-gray-100 text-gray-600"
                          : user.reports >= 5
                            ? "bg-red-100 text-red-600"
                            : "bg-red-100 text-red-600"
                          }`}>
                          {user.reports === 0 ? "0" : user.reports}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Pagination Controls - Outside white card */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border-2 ${currentPage === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="text-sm text-gray-600 px-4">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border-2 ${currentPage === totalPages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}