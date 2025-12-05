
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ChartBarIcon } from "@heroicons/react/24/solid";

const AdminNavbar = () => {
 const navigate = useNavigate();
 const { user, logout } = useAuth();

 const displayName = user?.name
  ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()
  : user?.email?.split("@")[0].charAt(0).toUpperCase() +
    user?.email?.split("@")[0].slice(1).toLowerCase();

 const handleLogout = () => {
  logout();
  navigate("/");
 };

 return (
  <nav className="fixed top-0 left-0 w-full z-50 bg-linear-to-r from-purple-600 to-indigo-600 px-8 py-4 shadow-lg">
   <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div
     className="flex items-center gap-2 cursor-pointer"
     onClick={() => navigate("/admin/polls")}
    >
     <ChartBarIcon className="h-7 w-7 text-white" />
     <span className="text-xl font-bold text-white tracking-wide">
      PollingApp
     </span>
    </div>
    <div className="flex items-center gap-10">
     <Link
      to="/admin/polls"
      className="text-white font-medium hover:text-gray-200 transition"
     >
      Manage Polls
     </Link>
     <Link
      to="/admin/polls/create"
      className="text-white font-medium hover:text-gray-200 transition"
     >
      Create Poll
     </Link>
    </div>
    <div className="flex items-center gap-5">
     <span className="text-white font-bold text-m">
      Hello, <span className="font-bold">{displayName}</span>
     </span>
     <button
      onClick={handleLogout}
      className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg font-medium cursor-pointer hover:bg-gray-100 shadow-md transition"
     >
      Logout
     </button>
    </div>
   </div>
  </nav>
 );
};

export default AdminNavbar;
