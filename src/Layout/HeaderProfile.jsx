import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeaderProfile() {
  return (
    <>
      <header className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
        {" "}
        {/* Changed from bg-gray-200 to bg-gray-50 */}
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ChevronLeft size={20} />
            <span className="font-medium">BOTTON</span>
          </button>
          <nav className="flex gap-6">
            {/* <Link to="#" className="text-gray-700 hover:text-gray-900">
              Reservations
            </Link> */}
            <Link
              to="/GuideTours"
              className="text-gray-700 hover:text-gray-900"
            >
              My Tours
            </Link>
            <Link
              to="/GuideProfileG"
              className="text-gray-700 hover:text-gray-900 "
            >
              My Profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Log out
          </button>
        </div>
      </header>
    </>
  );
}
