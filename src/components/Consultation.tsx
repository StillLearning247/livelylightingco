import React, { useState } from "react";
import { Phone, Mail, MapPin, Check, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { PrivacyPolicy } from "./PrivacyPolicy";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const Consultation = () => {
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    website: "", // honeypot field
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Check if honeypot field is filled (bot detected)
    if (formState.website) {
      // Silently prevent submission but show success message
      setStatus("success");
      setFormState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
        website: "",
      });
      return;
    }

    if (!EMAIL_REGEX.test(formState.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      const { error: leadsError } = await supabase
        .from("clients")
        .insert([formState]);

      if (leadsError) throw new Error(`Database error: ${leadsError.message}`);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create lead in vCita");
      }

      setStatus("success");
      setFormState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
        website: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or contact us directly."
      );
    }
  };

  return (
    <section id="consultation" className="py-10 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get Your Free Consultation
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Ready to transform your home with stunning, permanent lighting?
              Fill out the form for a free consultation or reach out directly.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Phone className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">
                    <a
                      href="tel:+15128097323"
                      aria-label="Call us at (512) 809-7323"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      (512)-809-7323
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:contact@livelylightingco.com"
                      aria-label="Email us at contact@livelylightingco.com"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      contact@livelylightingco.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Service Area
                  </h3>
                  <p className="text-gray-600">
                    Austin, Round Rock, Cedar Park, and surrounding areas
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Why Get a Consultation?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Custom design plans tailored to your home
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Accurate pricing with no surprises
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Expert advice on lighting options and placement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    No obligation - friendly chat to explore possibilities
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-6">
                  We've received your request! Please check your inbox shortly
                  for confirmation details and next steps.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3
                  id="contact-form"
                  className="text-xl font-semibold text-gray-900 mb-4"
                >
                  Request a Free Quote
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={status === "submitting"}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        status === "error" && errorMessage.includes("email")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={status === "submitting"}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formState.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="City/neighborhood is fine"
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

                {status === "error" && (
                  <div className="text-red-600 text-sm">{errorMessage}</div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
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

                <p className="text-sm text-gray-500 mt-4">
                  By submitting, you agree to our{" "}
                  <button
                    type="button"
                    onClick={() => setIsPrivacyOpen(true)}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <PrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onOpen={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </section>
  );
};
