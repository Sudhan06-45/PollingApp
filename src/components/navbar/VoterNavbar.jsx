
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ChartBarIcon } from "@heroicons/react/24/solid";

const VoterNavbar = () => {
 const { user, logout } = useAuth();
 const navigate = useNavigate();

 const displayName =
  user?.name ??
  user?.email?.split("@")[0]?.charAt(0).toUpperCase() +
    user?.email?.split("@")[0]?.slice(1).toLowerCase();

 const handleLogout = () => {
  logout();
  navigate("/login");
 };

 return (
  <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-md z-50">
   <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
    <div
     onClick={() => navigate("/polls")}
     className="flex items-center gap-2 cursor-pointer"
    >
     <ChartBarIcon className="h-7 w-7 text-indigo-600" />
     <span className="text-xl font-bold text-gray-900">
      PollingApp
     </span>
    </div>
    <div className="flex items-center gap-8">
     <span className="text-gray-700 font-bold">Hello, {displayName}</span>
     <button
      onClick={handleLogout}
      className="px-5 py-1.5 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition"
     >
      Logout
     </button>
    </div>
   </div>
  </nav>
 );
};

export default VoterNavbar;
