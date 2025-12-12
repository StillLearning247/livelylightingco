import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AdminInfo = {
  id: string;
  email: string | null;
  username: string | null;
} | null;

const AdminCtx = createContext<{
  admin: AdminInfo;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}>({ admin: null, refresh: async () => {}, signOut: async () => {} });

// Helper to get session directly from localStorage
function getSessionFromStorage(): { userId: string; email: string } | null {
  try {
    const keys = Object.keys(localStorage);
    const authKey = keys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (!authKey) return null;

    const data = JSON.parse(localStorage.getItem(authKey) || "null");
    if (!data?.user?.id) return null;

    return {
      userId: data.user.id,
      email: data.user.email,
    };
  } catch {
    return null;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo>(null);

  const load = async () => {
    try {
      // Get session from localStorage directly (more reliable than Supabase client)
      const storedSession = getSessionFromStorage();
      if (!storedSession) {
        setAdmin(null);
        return;
      }

      // Query admins table using fetch directly
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const keys = Object.keys(localStorage);
      const authKey = keys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
      const authData = authKey ? JSON.parse(localStorage.getItem(authKey) || "{}") : {};
      const accessToken = authData?.access_token;

      if (!accessToken) {
        setAdmin(null);
        return;
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/admins?user_id=eq.${storedSession.userId}&select=user_id,username`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        setAdmin(null);
        return;
      }

      const admins = await response.json();

      if (admins && admins.length > 0) {
        setAdmin({
          id: storedSession.userId,
          email: storedSession.email,
          username: admins[0]?.username ?? null,
        });
      } else {
        // User is logged in but not an admin
        setAdmin({
          id: storedSession.userId,
          email: storedSession.email,
          username: null,
        });
      }
    } catch (err) {
      console.error("[AdminProvider] Exception:", err);
      setAdmin(null);
    }
  };

  useEffect(() => {
    load();
    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = () => load();
    window.addEventListener("storage", handleStorage);

    // Also listen for Supabase auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // Small delay to allow localStorage to be updated
      setTimeout(load, 100);
    });

    return () => {
      window.removeEventListener("storage", handleStorage);
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // Clear localStorage directly
    const keys = Object.keys(localStorage);
    const authKey = keys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (authKey) {
      localStorage.removeItem(authKey);
    }
    // Also call Supabase signOut (fire and forget)
    supabase.auth.signOut().catch(() => {});
    setAdmin(null);
  };

  return (
    <AdminCtx.Provider value={{ admin, refresh: load, signOut }}>
      {children}
    </AdminCtx.Provider>
  );
}

export const useAdmin = () => useContext(AdminCtx);
