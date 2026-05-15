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
      />
      <Consultation />
    </main>
  );
};

export default Contact;
