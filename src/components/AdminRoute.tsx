import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "deny">("loading");

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return setState("deny");

      const { data, error } = await supabase.rpc("is_admin");
      if (error || !data) setState("deny");
      else setState("ok");
    })();
  }, []);

  if (state === "loading")
    return <div className="p-8 text-center">Checking…</div>;
  return state === "ok" ? <>{children}</> : <Navigate to="/" replace />;
}
