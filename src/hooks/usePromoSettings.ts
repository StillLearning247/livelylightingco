import { useState, useEffect, useCallback } from "react";

interface PromoSettings {
  id?: string;
  enabled: boolean;
  image_url: string;
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
 * Hook to fetch promo settings (public - for displaying popup)
 */
export const usePromoSettings = () => {
  const [settings, setSettings] = useState<PromoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabaseRest<PromoSettings[]>(
        "promo_settings?limit=1"
      );

      if (error) {
        console.error("Error fetching promo settings:", error);
        setError(error);
      } else {
        setSettings(data?.[0] || null);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

/**
 * Hook for admin to manage promo settings
 */
export const useAdminPromoSettings = () => {
  const [settings, setSettings] = useState<PromoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabaseRest<PromoSettings[]>(
      "promo_settings?limit=1",
      { requireAuth: true }
    );

    if (error) {
      setError(error);
    } else {
      setSettings(data?.[0] || { enabled: false, image_url: "/images/NewYears flyer2026.png" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<PromoSettings>) => {
    if (settings?.id) {
      // Update existing - don't include id in body
      const { error } = await supabaseRest(
        `promo_settings?id=eq.${settings.id}`,
        {
          method: "PATCH",
          requireAuth: true,
          body: {
            enabled: newSettings.enabled ?? settings.enabled,
            image_url: newSettings.image_url ?? settings.image_url,
            updated_at: new Date().toISOString(),
          },
        }
      );

      if (error) {
        console.error("Error updating promo settings:", error);
        throw new Error(error);
      }
    } else {
      // Insert new
      const { error } = await supabaseRest("promo_settings", {
        method: "POST",
        requireAuth: true,
        body: {
          enabled: newSettings.enabled ?? false,
          image_url: newSettings.image_url ?? "/images/NewYears flyer2026.png",
          updated_at: new Date().toISOString(),
        },
      });

      if (error) {
        console.error("Error inserting promo settings:", error);
        throw new Error(error);
      }
    }

    await fetchSettings();
  };

  const toggleEnabled = async () => {
    await updateSettings({ enabled: !settings?.enabled });
  };

  const updateImageUrl = async (imageUrl: string) => {
    await updateSettings({ image_url: imageUrl });
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    toggleEnabled,
    updateImageUrl,
    refetch: fetchSettings,
  };
};
