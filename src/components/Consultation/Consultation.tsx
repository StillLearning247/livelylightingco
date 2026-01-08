import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ContactInfo } from "./ContactInfo";
import { WhyConsultation } from "./WhyConsultation";
import { SuccessMessage } from "./SuccessMessage";
import { ConsultationForm } from "./ConsultationForm";
import { PrivacyPolicy } from "../PrivacyPolicy";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  website: string;
}

export const Consultation = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleSubmit = async (formData: FormState) => {
    setStatus("submitting");
    setErrorMessage("");

    // Check if honeypot field is filled (bot detected)
    if (formData.website) {
      setStatus("success");
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      const { error: leadsError } = await supabase
        .from("clients")
        .insert([formData]);

      if (leadsError) throw new Error(`Database error: ${leadsError.message}`);

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

      setStatus("success");
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
    <section id="consultation" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              {status === "success" ? (
                <SuccessMessage onReset={() => setStatus("idle")} />
              ) : (
                <ConsultationForm
                  onSubmit={handleSubmit}
                  status={status}
                  errorMessage={errorMessage}
                  onPrivacyClick={() => setIsPrivacyOpen(true)}
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
      <PrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onOpen={() => setIsPrivacyOpen(true)}
      />
    </section>
  );
};
