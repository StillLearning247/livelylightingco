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

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo>(null);

  const load = async () => {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) return setAdmin(null);

    // read own admin row (needs the SELECT policy above)
    const { data: row } = await supabase
      .from("admins")
      .select("id, username")
      .eq("id", user.id)
      .maybeSingle();

    setAdmin({
      id: user.id,
      email: user.email ?? null,
      username: row?.username ?? null,
    });
  };

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  return (
    <AdminCtx.Provider value={{ admin, refresh: load, signOut }}>
      {children}
    </AdminCtx.Provider>
  );
}

export const useAdmin = () => useContext(AdminCtx);
