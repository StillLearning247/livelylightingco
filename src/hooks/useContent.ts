import { useState, useEffect } from "react";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content: string;
  updated_at: string;
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

  const url = `${supabaseUrl}/rest/v1/${endpoint}`;

  try {
    const headers: Record<string, string> = {
      apikey: supabaseKey,
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
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
 * Hook to fetch a single content item (uses REST API to avoid hanging)
 */
export const useContent = (page: string, section: string) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabaseRest<ContentItem[]>(
        `site_content?page=eq.${encodeURIComponent(page)}&section=eq.${encodeURIComponent(section)}&limit=1`
      );

      if (error) {
        console.error("Error fetching content:", error);
        setError(error);
      } else {
        setContent(data?.[0]?.content || "");
      }
      setLoading(false);
    };

    if (page && section) {
      fetchContent();
    }
  }, [page, section]);

  return { content, loading, error };
};

/**
 * Hook to fetch all content for a page (uses REST API to avoid hanging)
 */
export const usePageContent = (page: string) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabaseRest<{ section: string; content: string }[]>(
        `site_content?page=eq.${encodeURIComponent(page)}&select=section,content`
      );

      if (error) {
        console.error("Error fetching page content:", error);
        setError(error);
      } else {
        const contentMap: Record<string, string> = {};
        data?.forEach((item) => {
          contentMap[item.section] = item.content;
        });
        setContent(contentMap);
      }
      setLoading(false);
    };

    if (page) {
      fetchContent();
    }
  }, [page]);

  return { content, loading, error };
};

/**
 * Hook for admin to manage all content (uses REST API to avoid hanging)
 */
export const useAllContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabaseRest<ContentItem[]>(
      "site_content?order=page,section",
      { requireAuth: true }
    );

    if (error) {
      setError(error);
    } else {
      setContent(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (
    page: string,
    section: string,
    newContent: string
  ) => {
    // First check if content exists
    const { data: existing } = await supabaseRest<ContentItem[]>(
      `site_content?page=eq.${encodeURIComponent(page)}&section=eq.${encodeURIComponent(section)}&limit=1`,
      { requireAuth: true }
    );

    if (existing && existing.length > 0) {
      // Update existing
      const { error } = await supabaseRest(
        `site_content?page=eq.${encodeURIComponent(page)}&section=eq.${encodeURIComponent(section)}`,
        {
          method: "PATCH",
          requireAuth: true,
          body: { content: newContent, updated_at: new Date().toISOString() },
        }
      );

      if (error) {
        console.error("Error updating content:", error);
        throw new Error(error);
      }
    } else {
      // Insert new
      const { error } = await supabaseRest("site_content", {
        method: "POST",
        requireAuth: true,
        body: {
          page,
          section,
          content: newContent,
          updated_at: new Date().toISOString(),
        },
      });

      if (error) {
        console.error("Error inserting content:", error);
        throw new Error(error);
      }
    }

    await fetchContent();
  };

  return { content, loading, error, updateContent, refetch: fetchContent };
};
