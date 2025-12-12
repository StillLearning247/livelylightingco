import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Helper to get session directly from localStorage
function getSessionFromStorage(): { userId: string; email: string } | null {
  try {
    // Find the Supabase auth token key
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

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "deny">("loading");

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        // First try to get session from localStorage directly (faster and more reliable)
        const storedSession = getSessionFromStorage();
        if (!storedSession) {
          if (isMounted) setState("deny");
          return;
        }

        // Query admins table using fetch directly to avoid Supabase client hanging
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Get fresh access token from storage
        const keys = Object.keys(localStorage);
        const authKey = keys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
        const authData = authKey ? JSON.parse(localStorage.getItem(authKey) || "{}") : {};
        const accessToken = authData?.access_token;

        if (!accessToken) {
          if (isMounted) setState("deny");
          return;
        }

        const response = await fetch(
          `${supabaseUrl}/rest/v1/admins?user_id=eq.${storedSession.userId}&select=user_id`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          if (isMounted) setState("deny");
          return;
        }

        const admins = await response.json();

        if (admins && admins.length > 0) {
          if (isMounted) setState("ok");
        } else {
          if (isMounted) setState("deny");
        }
      } catch {
        if (isMounted) setState("deny");
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state === "loading")
    return <div className="p-8 text-center">Checking…</div>;
  return state === "ok" ? <>{children}</> : <Navigate to="/" replace />;
}
