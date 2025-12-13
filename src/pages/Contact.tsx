import { Consultation } from "../components/Consultation/Consultation";
import { SEO } from "../components/SEO";

const Contact = () => {
  return (
    <main className="pt-20">
      <SEO
        canonical="/contact"
        title="Get a Free Quote - Contact LivelyLightingCo"
        description="Request your free Govee permanent outdoor lighting consultation. Contact LivelyLightingCo at (512) 809-7323. Serving Austin, Cedar Park, Round Rock, Houston & Central Texas."
      />
      <Consultation />
    </main>
  );
};

export default Contact;
