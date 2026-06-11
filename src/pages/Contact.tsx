import { useEffect } from "react";
import { Consultation } from "../components/Consultation/Consultation";
import { SEO } from "../components/SEO";
import { trackEvent } from "../lib/analytics";

const Contact = () => {
  useEffect(() => {
    trackEvent("page_view", "/contact");
  }, []);

  return (
    <main className="pt-20">
      <SEO
        canonical="/contact"
        title="Get a Free Quote"
        description="Request a free quote for permanent outdoor lighting installation in the Austin, TX metro. Local installers, lifetime PermTrack hardware warranty, 5-year workmanship warranty."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <section className="bg-gray-50 pt-12 pb-2">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl font-bold text-surface-900 mb-3">
            Get a Free Quote
          </h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            Request a free consultation for permanent outdoor LED lighting
            installation across Texas and Oklahoma.
          </p>
        </div>
      </section>
      <Consultation />
    </main>
  );
};

export default Contact;
