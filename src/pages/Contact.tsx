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
        title="Get a Free Quote - Contact LivelyLightingCo"
        description="Request your free permanent outdoor lighting consultation. Contact LivelyLightingCo at (737) 423-7246. Certified installers of Govee, Asahom, Eufy, and Enbrighten across Texas and Oklahoma — Austin, Dallas-Fort Worth, Houston, San Antonio, Oklahoma City & Tulsa metros."
      />
      <Consultation />
    </main>
  );
};

export default Contact;
