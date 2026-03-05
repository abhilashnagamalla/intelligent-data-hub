import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);

      if (!result.user.email.endsWith("@gmail.com")) {
        alert("Only Gmail accounts are allowed");
        setLoading(false);
        return;
      }

      // Store user info including profile photo
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">

      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Intelligent Data Hub
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Government Data Analytics Platform
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-medium transition
            ${loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:shadow-md"
            }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Secure access using your Gmail account
        </p>

      </div>
    </div>
  );
}
