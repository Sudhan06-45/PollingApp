import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await api.post("/auth/login", { email, password });

      const jwt = response.data.token;
      if (!jwt) return setErrorMsg("Invalid server response");

      const payload = JSON.parse(atob(jwt.split(".")[1]));

      const userData = {
        id: payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
        role: payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        email: payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      };

      login(jwt, userData);

      if (userData.role === "Admin") navigate("/admin/polls");
      else navigate("/polls");
    } catch (err) {
      console.error(err);
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden rounded-r-3xl bg-black">
        <img
          src="https://storage.googleapis.com/fplswordpressblog/2022/07/online-voting.png"
          alt="login visual"
          className="absolute  w-full h-full"
        />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/50" />
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-10 md:px-20">

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Welcome Back 
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                data-testid="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white cursor-pointer py-2 rounded-lg text-lg font-medium hover:bg-gray-900 transition"
          >
            Sign In
          </button>
        </form>
 
        <p className="text-center text-sm mt-6 text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
