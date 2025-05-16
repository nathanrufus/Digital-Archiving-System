"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, form);
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-white flex items-baseline justify-center px-8 flex-col">
      <img
          src="/towfig.png"
          alt="Towfiq Logistics"
          className="h-15 mb-34"
        />
        <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
          <h1 className="text-3xl font-semibold text-gray-800">Sign in</h1>
          <p className="text-sm text-gray-500">Please login to continue to your account.</p>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Keep me logged in
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 text-white w-full py-2 rounded-md hover:bg-violet-700"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-center text-sm text-gray-500">
            Need an account? <a href="/register" className="text-violet-600 font-medium">Create one</a>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
      <div className="w-1/2">
        <img
          src="/right.jpg"
          alt="Login"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
    </div>
  );
}