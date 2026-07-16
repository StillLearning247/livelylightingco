// Lazy loader for the Google Maps JavaScript API (Places library).
//
// The Maps script is injected on first use — typically when a visitor focuses
// the address field — so we never pay the download/quota cost for users who
// don't interact with autocomplete. `loadPlacesLibrary()` resolves to the
// `places` library namespace (AutocompleteSuggestion, AutocompleteSessionToken,
// …). Callers should treat a rejection as "autocomplete unavailable" and fall
// back to a plain text input rather than surfacing an error.

declare global {
  interface Window {
    // Typed loosely on purpose — we don't pull in @types/google.maps.
    google?: any;
  }
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

let scriptPromise: Promise<void> | null = null;
let placesPromise: Promise<any> | null = null;

// Inject the Maps bootstrap script exactly once.
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (!MAPS_API_KEY) {
      reject(new Error("VITE_GOOGLE_MAPS_API_KEY is not set"));
      return;
    }
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        MAPS_API_KEY
      )}` + "&libraries=places&loading=async&v=weekly";
    script.async = true;
    script.onload = () => {
      if (window.google?.maps) resolve();
      else reject(new Error("Google Maps loaded but window.google.maps is missing"));
    };
    script.onerror = () =>
      reject(new Error("Failed to load the Google Maps script"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

// Resolve to the Places library namespace, loading the script if needed.
export function loadPlacesLibrary(): Promise<any> {
  if (placesPromise) return placesPromise;

  placesPromise = (async () => {
    await loadScript();
    return window.google.maps.importLibrary("places");
  })();

  return placesPromise;
}
