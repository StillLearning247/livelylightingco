import { useState, FormEvent, ChangeEvent, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { trackEvent } from "../../lib/analytics";
import { AddressAutocomplete } from "./AddressAutocomplete";

// Edit this list to add/remove referral source options.
export const LEAD_SOURCES = [
  "Google Search",
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube",
  "Referral / Word of Mouth",
  "Door Hanger / Flyer",
  "Other",
] as const;

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  lead_source: string;
  sales_code: string;
  website: string;
}

interface ConsultationFormProps {
  onSubmit: (formData: FormState) => Promise<void>;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string;
}

export const ConsultationForm = ({
  onSubmit,
  status,
  errorMessage,
}: ConsultationFormProps) => {
  const [formState, setFormState] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    lead_source: "",
    sales_code: "",
    website: "",
  });

  const formStartedRef = useRef(false);

  // Central setter so both native fields and the address autocomplete share the
  // same "form_start" analytics gate.
  const setField = (name: keyof FormState, value: string) => {
    if (!formStartedRef.current && name !== "website") {
      formStartedRef.current = true;
      trackEvent("form_start", "/contact");
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setField(e.target.name as keyof FormState, e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3
        id="contact-form"
        className="font-heading text-xl font-semibold text-surface-900 mb-4"
      >
        Request a Free Quote
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-surface-700 mb-1"
          >
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            value={formState.first_name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300"
            disabled={status === "submitting"}
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-surface-700 mb-1"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            value={formState.last_name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-surface-700 mb-1"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address"
          required
          value={formState.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 ${
            status === "error" && errorMessage.includes("email")
              ? "border-red-500 bg-red-50"
              : "border-surface-300"
          }`}
          disabled={status === "submitting"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-surface-700 mb-1"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formState.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300"
            disabled={status === "submitting"}
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-surface-700 mb-1"
          >
            Address *
          </label>
          <AddressAutocomplete
            id="address"
            name="address"
            required
            value={formState.address}
            onValueChange={(value) => setField("address", value)}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300"
            placeholder="Start typing your address…"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How did you hear about us? */}
        <div>
          <label
            htmlFor="lead_source"
            className="block text-sm font-medium text-surface-700 mb-1"
          >
            How did you hear about us? *
          </label>
          <select
            id="lead_source"
            name="lead_source"
            required
            value={formState.lead_source}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 bg-white"
            disabled={status === "submitting"}
          >
            <option value="">Select an option…</option>
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Sales Code (optional) */}
        <div>
          <label
            htmlFor="sales_code"
            className="block text-sm font-medium text-surface-700 mb-1"
          >
            Sales Code <span className="text-surface-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="sales_code"
            name="sales_code"
            value={formState.sales_code}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 uppercase tracking-wider"
            placeholder="e.g. SAVE250"
            maxLength={32}
            disabled={status === "submitting"}
          />
        </div>
      </div>

      {/* Honeypot field - hidden from real users */}
      <div className="absolute opacity-0 -z-10 select-none pointer-events-none">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formState.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="text-red-600 text-sm">{errorMessage}</div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-6 py-4 bg-accent-400 text-surface-900 font-heading font-bold rounded-md hover:bg-accent-500 transition-colors shadow-md hover:shadow-lg flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Submitting...
          </>
        ) : (
          <>
            Submit
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
