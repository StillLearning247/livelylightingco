import { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ContactInfo } from "./ContactInfo";
import { WhyConsultation } from "./WhyConsultation";
import { SuccessMessage } from "./SuccessMessage";
import { ConsultationForm } from "./ConsultationForm";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

export const Consultation = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Guard against re-entry: a second click that lands before React re-renders the
  // disabled button will see this flag and bail out immediately.
  const inFlightRef = useRef(false);
  // Holds the clients-row ID across retries so we don't insert a new row each attempt.
  const insertedRowIdRef = useRef<string | null>(null);

  const resetSubmissionState = () => {
    insertedRowIdRef.current = null;
    setStatus("idle");
  };

  const handleSubmit = async (formData: FormState) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setStatus("submitting");
    setErrorMessage("");

    // Check if honeypot field is filled (bot detected)
    if (formData.website) {
      setStatus("success");
      inFlightRef.current = false;
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      inFlightRef.current = false;
      return;
    }

    try {
      // Only insert if we haven't already on a prior (partially-failed) attempt.
      if (!insertedRowIdRef.current) {
        // Generate the row ID client-side so we don't need SELECT-back permission
        // for anon users. This is the key to making retries idempotent.
        const rowId = crypto.randomUUID();
        const { error: leadsError } = await supabase
          .from("clients")
          .insert([{ ...formData, id: rowId }]);

        if (leadsError) throw new Error(`Database error: ${leadsError.message}`);
        insertedRowIdRef.current = rowId;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create lead in vCita");
      }

      // SendGrid email notification (runs alongside Zapier during migration)
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        });
      } catch (emailError) {
        // Log but don't fail - Zapier is still active as backup
        console.error("SendGrid email error (non-fatal):", emailError);
      }

      // Successful submission — clear the held row ID so a new form fill starts fresh.
      insertedRowIdRef.current = null;
      setStatus("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      inFlightRef.current = false;
    }
  };

  return (
    <section id="consultation" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 border border-gray-100">
              {status === "success" ? (
                <SuccessMessage onReset={resetSubmissionState} />
              ) : (
                <ConsultationForm
                  onSubmit={handleSubmit}
                  status={status}
                  errorMessage={errorMessage}
                />
              )}
            </div>
          </div>
          <div>
            <WhyConsultation />
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
};
