import { useEffect, useRef, useState } from "react";
import { loadPlacesLibrary } from "../../lib/googleMaps";

// Bias suggestions toward the Austin, TX metro (where most installs happen)
// without restricting them — customers in the other service-area metros still
// get results. Region is hard-limited to the US.
const LOCATION_BIAS = {
  center: { lat: 30.2672, lng: -97.7431 },
  radius: 80000, // meters (~50 mi)
};
const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;
const MAX_SUGGESTIONS = 5;

interface AddressAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// A required-capable text input enhanced with Google Places autocomplete.
//
// The underlying <input> is a normal controlled field: `required`, free typing,
// and browser validation all work as usual. Autocomplete is progressive — if
// the Maps API can't load (missing key, network, CSP), the field silently stays
// a plain text box and never blocks a submission.
export const AddressAutocomplete = ({
  id,
  name,
  value,
  onValueChange,
  required,
  disabled,
  placeholder,
  className,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const placesRef = useRef<any>(null);
  const placesFailedRef = useRef(false);
  const sessionTokenRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  // Guards against stale async responses overwriting newer ones.
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  // Load the Places library on demand; cache the result and never retry after a
  // failure (so a bad key doesn't hammer the network on every keystroke).
  const ensurePlaces = async (): Promise<any> => {
    if (placesRef.current) return placesRef.current;
    if (placesFailedRef.current) return null;
    try {
      placesRef.current = await loadPlacesLibrary();
      return placesRef.current;
    } catch {
      placesFailedRef.current = true;
      return null;
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const fetchSuggestions = async (input: string) => {
    const places = await ensurePlaces();
    if (!places) return; // Autocomplete unavailable — stay a plain input.

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    }

    const requestId = ++requestIdRef.current;
    try {
      const { suggestions: results } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionTokenRef.current,
          includedRegionCodes: ["us"],
          locationBias: LOCATION_BIAS,
        });

      if (requestId !== requestIdRef.current) return; // A newer request won.

      const predictions = (results || [])
        .filter((s: any) => s.placePrediction)
        .slice(0, MAX_SUGGESTIONS);

      setSuggestions(predictions);
      setActiveIndex(-1);
      setOpen(predictions.length > 0);
    } catch {
      // Non-fatal: hide the dropdown, keep the typed text.
      closeDropdown();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    onValueChange(next);

    clearTimeout(debounceRef.current);
    const trimmed = next.trim();
    if (trimmed.length < MIN_CHARS) {
      closeDropdown();
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(trimmed), DEBOUNCE_MS);
  };

  const handleSelect = async (suggestion: any) => {
    const prediction = suggestion.placePrediction;
    const fallbackText = prediction?.text?.toString?.() ?? "";
    closeDropdown();

    try {
      const place = prediction.toPlace();
      // fetchFields concludes the billing session; start a fresh one next time.
      await place.fetchFields({ fields: ["formattedAddress"] });
      onValueChange(place.formattedAddress || fallbackText);
    } catch {
      onValueChange(fallbackText);
    } finally {
      sessionTokenRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      // Only intercept Enter when a suggestion is highlighted; otherwise let the
      // form submit normally.
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  const listboxId = `${id}-listbox`;

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        // Delay so a suggestion click (which blurs the input) registers first.
        onBlur={() => setTimeout(closeDropdown, 120)}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        }
      />

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 w-full bg-white border border-surface-300 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1"
        >
          {suggestions.map((suggestion, index) => {
            const text =
              suggestion.placePrediction?.text?.toString?.() ?? "";
            return (
              <li
                key={suggestion.placePrediction?.placeId ?? index}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                // preventDefault keeps the input focused so onBlur doesn't close
                // the list before onClick fires.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(suggestion)}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  index === activeIndex
                    ? "bg-brand-50 text-surface-900"
                    : "text-surface-700"
                }`}
              >
                {text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
