import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Prevent background scroll when modal is open + focus the email box
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      const prev = html.style.overflow;
      html.style.overflow = "hidden";
      setTimeout(() => emailRef.current?.focus(), 0);
      return () => {
        html.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Set up a one-time auth state listener to detect successful login
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          setEmail("");
          setPassword("");
          setIsOpen(false);
          setLoading(false);
          navigate("/admin", { replace: true });
        }
      });

      // Fire and forget - don't await the promise since it can hang
      supabase.auth.signInWithPassword({
        email,
        password,
      }).then(result => {
        if (result.error) {
          subscription.unsubscribe();
          setError("Invalid email or password.");
          setLoading(false);
        }
      }).catch(() => {
        subscription.unsubscribe();
        setError("Invalid email or password.");
        setLoading(false);
      });

      // Set a timeout to clean up if nothing happens
      setTimeout(() => {
        subscription.unsubscribe();
        if (loading) {
          setError("Login timed out. Please try again.");
          setLoading(false);
        }
      }, 15000);

    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
      >
        <Lock className="h-4 w-4" />
        <span className="text-sm">Admin</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // close if you click the backdrop (not inside the panel)
        if (e.target === e.currentTarget) {
          setIsOpen(false);
          setTimeout(() => triggerRef.current?.focus(), 0);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        className="bg-white text-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="admin-login-title" className="text-xl font-semibold">
            Admin Login
          </h3>
          <button
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => triggerRef.current?.focus(), 0);
            }}
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
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
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
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
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
