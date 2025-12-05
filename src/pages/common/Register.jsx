import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "Voter",
      });

      if (response.data?.token) {
        setSuccessMsg("Registered successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden rounded-r-3xl bg-black">
        <img
          src="https://storage.googleapis.com/fplswordpressblog/2022/07/online-voting.png"
          alt="login visual"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/50" />
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-10 md:px-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                data-testid="toggle-pass"
              >
                {showPass ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Re-enter password"
                className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                data-testid="toggle-confirm"
              >
                {showConfirmPass ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-green-600 text-sm">{successMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg text-lg font-medium hover:bg-gray-900 transition cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-700">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
