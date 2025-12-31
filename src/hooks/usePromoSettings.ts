import { useState, useEffect, useCallback } from "react";

export interface ScheduledPromo {
  id: string;
  name: string;
  image_url: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

// Helper to get access token from localStorage
function getAccessToken(): string | null {
  try {
    const keys = Object.keys(localStorage);
    const authKey = keys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (!authKey) return null;
    const data = JSON.parse(localStorage.getItem(authKey) || "{}");
    return data?.access_token || null;
  } catch {
    return null;
  }
}

// Helper for Supabase REST API calls
async function supabaseRest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    requireAuth?: boolean;
  } = {}
): Promise<{ data: T | null; error: string | null }> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const accessToken = options.requireAuth ? getAccessToken() : null;

  const url = `${supabaseUrl}/rest/v1/${endpoint}`;

  try {
    const headers: Record<string, string> = {
      apikey: supabaseKey,
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (options.method === "POST" || options.method === "PATCH") {
      headers.Prefer = "return=representation";
    }

    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: errorText };
    }

    const text = await response.text();
    if (!text) return { data: null, error: null };

    return { data: JSON.parse(text) as T, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/**
 * Check if a promo is currently active based on its schedule
 */
function isPromoCurrentlyActive(promo: ScheduledPromo): boolean {
  if (!promo.is_active) return false;

  const now = new Date();

  // If no start date, it's always valid from the start
  if (promo.start_date) {
    const startDate = new Date(promo.start_date);
    if (now < startDate) return false;
  }

  // If no end date, it runs indefinitely
  if (promo.end_date) {
    const endDate = new Date(promo.end_date);
    if (now > endDate) return false;
  }

  return true;
}

/**
 * Hook to fetch the currently active promo (public - for displaying popup)
 * Returns the highest priority active promo that's within its scheduled dates
 */
export const useActivePromo = () => {
  const [promo, setPromo] = useState<ScheduledPromo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivePromo = async () => {
      setLoading(true);
      // Fetch all active promos, ordered by priority (highest first)
      const { data, error } = await supabaseRest<ScheduledPromo[]>(
        "scheduled_promos?is_active=eq.true&order=priority.desc,created_at.desc"
      );

      if (error) {
        console.error("Error fetching promos:", error);
        setError(error);
      } else {
        // Find the first promo that's currently within its scheduled dates
        const activePromo = data?.find(isPromoCurrentlyActive) || null;
        setPromo(activePromo);
      }
      setLoading(false);
    };

    fetchActivePromo();
  }, []);

  return { promo, loading, error };
};

/**
 * Hook for admin to manage all scheduled promos
 */
export const useAdminPromos = () => {
  const [promos, setPromos] = useState<ScheduledPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabaseRest<ScheduledPromo[]>(
      "scheduled_promos?order=priority.desc,created_at.desc",
      { requireAuth: true }
    );

    if (error) {
      setError(error);
    } else {
      setPromos(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const addPromo = async (promo: Omit<ScheduledPromo, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabaseRest("scheduled_promos", {
      method: "POST",
      requireAuth: true,
      body: {
        ...promo,
        updated_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("Error adding promo:", error);
      throw new Error(error);
    }

    await fetchPromos();
  };

  const updatePromo = async (id: string, updates: Partial<ScheduledPromo>) => {
    const { error } = await supabaseRest(
      `scheduled_promos?id=eq.${id}`,
      {
        method: "PATCH",
        requireAuth: true,
        body: {
          ...updates,
          updated_at: new Date().toISOString(),
        },
      }
    );

    if (error) {
      console.error("Error updating promo:", error);
      throw new Error(error);
    }

    await fetchPromos();
  };

  const deletePromo = async (id: string) => {
    const { error } = await supabaseRest(
      `scheduled_promos?id=eq.${id}`,
      {
        method: "DELETE",
        requireAuth: true,
      }
    );

    if (error) {
      console.error("Error deleting promo:", error);
      throw new Error(error);
    }

    await fetchPromos();
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    await updatePromo(id, { is_active: !currentActive });
  };

  return {
    promos,
    loading,
    error,
    addPromo,
    updatePromo,
    deletePromo,
    toggleActive,
    refetch: fetchPromos,
    isPromoCurrentlyActive,
  };
};

// Legacy exports for backwards compatibility
export const usePromoSettings = useActivePromo;
