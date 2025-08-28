import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Lock } from "lucide-react";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setIsOpen(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
      >
        <Lock className="h-4 w-4" />
        <span className="text-sm">Admin</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      {/* Force dark text inside the modal so inputs aren’t white-on-white */}
      <div className="bg-white text-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Admin Login</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="
                w-full px-3 py-2 rounded-md border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                text-gray-900 placeholder-gray-500 caret-indigo-600
                autofill:bg-white autofill:text-gray-900
                autofill:shadow-[inset_0_0_0px_1000px_white]
                [--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/)]
              "
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full px-3 py-2 rounded-md border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                text-gray-900 placeholder-gray-500 caret-indigo-600
                autofill:bg-white autofill:text-gray-900
                autofill:shadow-[inset_0_0_0px_1000px_white]
              "
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
