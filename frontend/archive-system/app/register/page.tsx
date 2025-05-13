"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/auth/register`, form);
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-white flex items-center justify-center px-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full space-y-4"
        >
          <h1 className="text-3xl font-semibold text-gray-800">Sign up</h1>
          <p className="text-sm text-gray-500">
            Sign up to enjoy the feature of Revolute
          </p>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
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
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 text-white w-full py-2 rounded-md hover:bg-violet-700"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <div className="text-center text-sm text-gray-500">
            Already have an account? <a href="/login" className="text-violet-600 font-medium">Sign in</a>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
      <div className="w-1/2">
        <img
          src="/right.jpg"
          alt="Signup"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
    </div>
  );
}
