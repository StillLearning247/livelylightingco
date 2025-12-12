import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface GalleryImage {
  id: string;
  cloudinary_public_id: string;
  cloudinary_hires_id: string | null;
  title: string;
  alt_text: string;
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

    // Handle empty responses
    const text = await response.text();
    if (!text) return { data: null, error: null };

    return { data: JSON.parse(text) as T, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/**
 * Hook for public gallery display (uses REST API to avoid hanging)
 */
export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabaseRest<GalleryImage[]>(
        "gallery_images?is_active=eq.true&order=display_order"
      );

      if (error) {
        console.error("Error fetching gallery:", error);
        setError(error);
      } else {
        setImages(data || []);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  return { images, loading, error };
};

/**
 * Hook for admin gallery management (uses REST API to avoid hanging)
 */
export const useAdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabaseRest<GalleryImage[]>(
      "gallery_images?order=display_order",
      { requireAuth: true }
    );

    if (error) {
      setError(error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const addImage = async (
    cloudinaryPublicId: string,
    cloudinaryHiresId?: string,
    title?: string
  ) => {
    const maxOrder = images.length > 0
      ? Math.max(...images.map(img => img.display_order))
      : 0;

    const { error } = await supabaseRest("gallery_images", {
      method: "POST",
      requireAuth: true,
      body: {
        cloudinary_public_id: cloudinaryPublicId,
        cloudinary_hires_id: cloudinaryHiresId || cloudinaryPublicId,
        title: title || "",
        display_order: maxOrder + 1,
      },
    });

    if (error) {
      console.error("Error adding image:", error);
      throw new Error(error);
    }

    await fetchImages();
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabaseRest(`gallery_images?id=eq.${id}`, {
      method: "DELETE",
      requireAuth: true,
    });

    if (error) {
      console.error("Error deleting image:", error);
      throw new Error(error);
    }

    await fetchImages();
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    const { error } = await supabaseRest(`gallery_images?id=eq.${id}`, {
      method: "PATCH",
      requireAuth: true,
      body: updates,
    });

    if (error) {
      console.error("Error updating image:", error);
      throw new Error(error);
    }

    await fetchImages();
  };

  const reorderImages = async (reorderedImages: GalleryImage[]) => {
    for (let index = 0; index < reorderedImages.length; index++) {
      const img = reorderedImages[index];
      await supabaseRest(`gallery_images?id=eq.${img.id}`, {
        method: "PATCH",
        requireAuth: true,
        body: { display_order: index + 1 },
      });
    }

    await fetchImages();
  };

  return {
    images,
    loading,
    error,
    addImage,
    deleteImage,
    updateImage,
    reorderImages,
    refetch: fetchImages,
  };
};
