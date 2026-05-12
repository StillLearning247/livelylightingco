import { supabase } from "./supabase";

const SESSION_KEY = "ll_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(eventType: string, page?: string) {
  try {
    await supabase.from("analytics_events").insert([
      {
        event_type: eventType,
        page: page ?? (typeof window !== "undefined" ? window.location.pathname : null),
        session_id: getSessionId(),
      },
    ]);
  } catch {
    // Tracking failures must never break the user experience.
  }
}
