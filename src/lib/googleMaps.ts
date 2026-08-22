// Lazy loader for the Google Maps JavaScript API (Places library).
//
// The Maps script is injected on first use — typically when a visitor focuses
// the address field — so we never pay the download/quota cost for users who
// don't interact with autocomplete. `loadPlacesLibrary()` resolves to the
// `google.maps.places` namespace (AutocompleteSuggestion, AutocompleteSessionToken,
// …). Callers should treat a rejection as "autocomplete unavailable" and fall
// back to a plain text input rather than surfacing an error.
//
// We load with an explicit `callback` and read `google.maps.places` once it
// fires. This avoids a timing race with `google.maps.importLibrary`, which is
// not reliably defined at the script's `onload` event.

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

const CALLBACK_NAME = "__livelyInitGoogleMapsPlaces__";

let placesPromise: Promise<any> | null = null;

// Resolve to the Places library namespace, loading the script once on first call.
export function loadPlacesLibrary(): Promise<any> {
  if (placesPromise) return placesPromise;

  placesPromise = new Promise((resolve, reject) => {
    if (!MAPS_API_KEY) {
      reject(new Error("VITE_GOOGLE_MAPS_API_KEY is not set"));
      return;
    }
    if (window.google?.maps?.places) {
      resolve(window.google.maps.places);
      return;
    }

    window[CALLBACK_NAME] = () => {
      resolve(window.google.maps.places);
      delete window[CALLBACK_NAME];
    };

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        MAPS_API_KEY
      )}` + `&libraries=places&loading=async&callback=${CALLBACK_NAME}`;
    script.async = true;
    script.onerror = () => {
      delete window[CALLBACK_NAME];
      reject(new Error("Failed to load the Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return placesPromise;
}
