import { useNavigate } from "react-router-dom";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleVoteClick = () => {
    if (!user) {
      navigate("/login"); 
    } else {
      navigate("/polls"); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* home-navbar */}
      <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
 
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ChartBarIcon className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              PollingApp
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 font-medium hover:text-indigo-600"
            >
              Log In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </div>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-8 pt-40 pb-20 items-center">

        <div className="animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-snug">
            PollingApp
            <br />
            <span className="text-indigo-600">Discover Trending Polls & Share Your Voice</span>
          </h1>

          <p className="text-gray-600 mt-6 text-lg leading-relaxed">
            Explore a wide range of popular polls and cast your vote on topics that matter to you.
             Stay engaged, see what others think, and make your opinion count — all in one place.
          </p>

          <button
            onClick={handleVoteClick}
            className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl text-lg 
                       shadow hover:bg-indigo-700 transition"
          >
            View Polls
          </button>
        </div>

        <div className="flex justify-center animate-slideUp">
          <img
            className="w-full max-w-lg"
            src="https://images.ctfassets.net/rvt0uslu5yqp/4uJKnYZaVGYemyF3eVQheb/fef30c31f64ad458c5545593fb7d9262/Mentimeter_Web_Live-Polling_2022_03__2_.svg?&w=1080&q=75"
            alt="Poll Illustration"
          />
        </div>

      </div>
    </div>
  );
};

export default Home;
