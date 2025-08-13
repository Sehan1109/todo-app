import React, { useState } from "react";
import { login, register, logout } from "./authService";
import { auth } from "./Firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useState(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  });

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Logged in!");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      await register(email, password);
      alert("Account created!");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    alert("Logged out");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-300">
      <div className="bg-purple-600 shadow-lg rounded-xl p-8 w-full max-w-md">
        {user ? (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">Welcome {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg  px-4 py-2 mb-4 focus:outline-none focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-blue-400"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Register
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
