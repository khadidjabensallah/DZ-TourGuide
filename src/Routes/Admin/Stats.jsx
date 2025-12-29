import { LogOut, TrendingUp, Users, DollarSign, AlertCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [filterRegion, setFilterRegion] = useState("All");
  const [orderBy, setOrderBy] = useState("Rating");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for the chart
  const monthsData = [
    { month: "Jan", revenue: 45, guide: 32 },
    { month: "Feb", revenue: 52, guide: 38 },
    { month: "Mar", revenue: 61, guide: 45 },
    { month: "Apr", revenue: 58, guide: 42 },
    { month: "May", revenue: 72, guide: 51 },
    { month: "Jun", revenue: 69, guide: 48 },
    { month: "Jul", revenue: 78, guide: 55 },
    { month: "Aug", revenue: 75, guide: 52 },
    { month: "Sep", revenue: 82, guide: 58 },
    { month: "Oct", revenue: 68, guide: 49 },
    { month: "Nov", revenue: 55, guide: 40 },
    { month: "Dec", revenue: 62, guide: 44 }
  ];

  // TODO: Replace with API fetch call
  // const allGuides = fetch data from backend API here
  const allGuides = []; // Empty until connected to backend

  // Filter by region
  const filteredGuides = filterRegion === "All Wilayas" || filterRegion === "All"
    ? allGuides
    : allGuides.filter(guide => guide.region === filterRegion);

  // Sort guides based on orderBy
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    switch(orderBy) {
      case "Rating":
        return b.rating - a.rating;
      case "Revenue":
        return b.revenue - a.revenue;
      case "Total Tours":
        return b.totalTours - a.totalTours;
      default:
        return b.rating - a.rating; // Default to rating sort
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedGuides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedGuides = sortedGuides.slice(startIndex, endIndex);

  const handleOrderByChange = (value) => {
    setOrderBy(value);
    setCurrentPage(1);
  };

  const handleRegionChange = (value) => {
    setFilterRegion(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterRegion("All");
    setOrderBy("Rating");
    setCurrentPage(1);
  };

  const maxValue = Math.max(...monthsData.map(d => Math.max(d.revenue, d.guide)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <img src="/assets/logo.png" alt="DZ-TourGuide Logo" className="h-12" />
            </div>
            
            <nav className="flex gap-6">
              <a href="#" className="text-orange-500 font-medium text-sm border-b-2 border-orange-500">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Guide Validation</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Reports</a>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Administration</h1>
          <p className="text-gray-600">Discover Algeria Platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">1247</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-blue-600">836 Tourists</span>
              <span className="text-purple-600">411 Guides</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">Active Guides</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">156</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-blue-600">120 Guides</span>
              <span className="text-purple-600">36 Guides</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">Revenue (DZD)</p>
            <p className="text-3xl font-bold text-gray-900">4,250,000</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">Pending Guides</p>
            <p className="text-3xl font-bold text-gray-900">3</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Tours Completed <span className="text-orange-500">by Month</span>
          </h2>
          
          <div className="relative h-64">
            {/* Y-axis percentage labels */}
            <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-gray-500">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            
            <div className="absolute inset-0 flex items-end justify-around gap-2 px-8 ml-12">
              {monthsData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex gap-1 items-end h-48">
                    <div 
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ height: `${(data.revenue / maxValue) * 100}%` }}
                    ></div>
                    <div 
                      className="flex-1 bg-purple-500 rounded-t"
                      style={{ height: `${(data.guide / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">Guide</span>
            </div>
          </div>
        </div>

        {/* Guide Performance Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Guide <span className="text-orange-500">Performance</span>
          </h2>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-orange-500 text-sm">
              <Filter className="w-4 h-4" />
              Filter by
            </button>
            
            <select 
              value={filterRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
            >
              <option value="All">All Wilayas</option>
              <option>Adrar</option>
              <option>Chlef</option>
              <option>Laghouat</option>
              <option>Oum El Bouaghi</option>
              <option>Batna</option>
              <option>Béjaïa</option>
              <option>Biskra</option>
              <option>Béchar</option>
              <option>Blida</option>
              <option>Bouira</option>
              <option>Tamanrasset</option>
              <option>Tébessa</option>
              <option>Tlemcen</option>
              <option>Tiaret</option>
              <option>Tizi Ouzou</option>
              <option>Algiers</option>
              <option>Djelfa</option>
              <option>Jijel</option>
              <option>Sétif</option>
              <option>Saïda</option>
              <option>Skikda</option>
              <option>Sidi Bel Abbès</option>
              <option>Annaba</option>
              <option>Guelma</option>
              <option>Constantine</option>
              <option>Médéa</option>
              <option>Mostaganem</option>
              <option>M'Sila</option>
              <option>Mascara</option>
              <option>Ouargla</option>
              <option>Oran</option>
              <option>El Bayadh</option>
              <option>Illizi</option>
              <option>Bordj Bou Arréridj</option>
              <option>Boumerdès</option>
              <option>El Tarf</option>
              <option>Tindouf</option>
              <option>Tissemsilt</option>
              <option>El Oued</option>
              <option>Khenchela</option>
              <option>Souk Ahras</option>
              <option>Tipaza</option>
              <option>Mila</option>
              <option>Aïn Defla</option>
              <option>Naâma</option>
              <option>Aïn Témouchent</option>
              <option>Ghardaïa</option>
              <option>Relizane</option>
              <option>Timimoun</option>
              <option>Bordj Badji Mokhtar</option>
              <option>Ouled Djellal</option>
              <option>Béni Abbès</option>
              <option>In Salah</option>
              <option>In Guezzam</option>
              <option>Touggourt</option>
              <option>Djanet</option>
              <option>El M'Ghair</option>
              <option>El Meniaa</option>
            </select>

            <select 
              value={orderBy}
              onChange={(e) => handleOrderByChange(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
            >
              <option>Rating</option>
              <option>Revenue</option>
              <option>Total Tours</option>
            </select>

            <button 
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Reset the Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">GUIDE</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">REGION</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">STANDARD<br/>TOURS</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">CUSTOME<br/>TOURS</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">TOTAL<br/>TOURS</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">REVENUE<br/>(DZD)</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">RATING</th>
                </tr>
              </thead>
              <tbody>
                {displayedGuides.map((guide) => (
                  <tr key={guide.id} className="border-b border-gray-100 hover:bg-orange-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {guide.hasPhoto ? (
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        ) : (
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-500 font-bold">{guide.name[0]}</span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{guide.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{guide.region}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {guide.standardTours}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span className="px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                          {guide.customTours}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-gray-900">{guide.totalTours}</td>
                    <td className="py-4 px-4 text-center font-medium text-gray-900">{guide.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium text-gray-900">{guide.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Outside white card */}
        {sortedGuides.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing {startIndex + 1}-{Math.min(endIndex, sortedGuides.length)} of {sortedGuides.length}</p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border-2 ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border-2 ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}