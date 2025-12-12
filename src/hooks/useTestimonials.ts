import { useState, useEffect } from "react";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
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

// Helper for Supabase REST API calls (avoids hanging client)
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

  try {
    const headers: Record<string, string> = {
      apikey: supabaseKey,
      "Content-Type": "application/json",
      Prefer: options.method === "POST" ? "return=representation" : "return=minimal",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
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
 * Hook for public testimonials display (uses REST API to avoid hanging)
 */
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const { data, error } = await supabaseRest<Testimonial[]>(
        "testimonials?is_active=eq.true&order=display_order"
      );

      if (error) {
        console.error("Error fetching testimonials:", error);
        setError(error);
      } else {
        setTestimonials(data || []);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

/**
 * Hook for admin testimonials management (uses REST API to avoid hanging)
 */
export const useAdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabaseRest<Testimonial[]>(
      "testimonials?order=display_order",
      { requireAuth: true }
    );

    if (error) {
      setError(error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async (
    testimonial: Omit<Testimonial, "id" | "created_at" | "display_order" | "is_active">
  ) => {
    const maxOrder = testimonials.length > 0
      ? Math.max(...testimonials.map(t => t.display_order))
      : 0;

    const { error } = await supabaseRest("testimonials", {
      method: "POST",
      requireAuth: true,
      body: {
        ...testimonial,
        display_order: maxOrder + 1,
        is_active: true,
      },
    });

    if (error) {
      console.error("Error adding testimonial:", error);
      throw new Error(error);
    }

    await fetchTestimonials();
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    const { error } = await supabaseRest(`testimonials?id=eq.${id}`, {
      method: "PATCH",
      requireAuth: true,
      body: updates,
    });

    if (error) {
      console.error("Error updating testimonial:", error);
      throw new Error(error);
    }

    await fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await supabaseRest(`testimonials?id=eq.${id}`, {
      method: "DELETE",
      requireAuth: true,
    });

    if (error) {
      console.error("Error deleting testimonial:", error);
      throw new Error(error);
    }

    await fetchTestimonials();
  };

  const reorderTestimonials = async (reorderedTestimonials: Testimonial[]) => {
    for (let index = 0; index < reorderedTestimonials.length; index++) {
      const t = reorderedTestimonials[index];
      await supabaseRest(`testimonials?id=eq.${t.id}`, {
        method: "PATCH",
        requireAuth: true,
        body: { display_order: index + 1 },
      });
    }

    await fetchTestimonials();
  };

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    reorderTestimonials,
    refetch: fetchTestimonials,
  };
};
