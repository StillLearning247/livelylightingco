import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SEO } from "../components/SEO";

// Buyer-question FAQ. Answers lead with a direct, self-contained statement so
// search engines and AI answer engines can extract and quote them. The same data
// drives both the visible page and the FAQPage structured data.
interface Faq {
  q: string;
  a: string;
}
interface FaqGroup {
  category: string;
  items: Faq[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "The basics",
    items: [
      {
        q: "What is permanent outdoor lighting?",
        a: "Permanent outdoor lighting is a smart LED lighting system installed once along your roofline and left up year-round. LivelyLightingCo installs Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten systems on the PermTrack mounting track, with hidden wiring and smartphone-app control for warm-white everyday light, holidays, game days, and architectural accent lighting.",
      },
      {
        q: "How is permanent outdoor lighting different from seasonal Christmas lights?",
        a: "Unlike seasonal Christmas lights, permanent outdoor lighting is installed once and never taken down — there are no ladders, no storage, and no tangled strands each year. The LEDs sit in a low-profile track mounted to your roofline and are controlled from a phone app, so the same system does warm-white everyday lighting, full-color holidays, and team colors on game days.",
      },
      {
        q: "What does permanent outdoor lighting look like during the day?",
        a: "During the day the system is nearly invisible. The LEDs face down and tuck into a slim PermTrack channel that is color-matched to your fascia and run on hidden wiring, so there is no visible cord, clip, or bulky strand — just a clean roofline.",
      },
    ],
  },
  {
    category: "Cost & installation",
    items: [
      {
        q: "How much does permanent outdoor lighting cost?",
        a: "Permanent outdoor lighting installations typically range from $18 to $35 per linear foot of roofline, with most homes falling between $2,000 and $8,000+. The final price depends on the size of the home, roof complexity, the brand chosen, and the number of stories. LivelyLightingCo offers a free in-home consultation and exact quote.",
      },
      {
        q: "How long does installation take?",
        a: "Most single-family installations are completed in a single day. LivelyLightingCo plans the layout with you during the free consultation, then handles the track mounting, hidden wiring, and smart-app setup.",
      },
      {
        q: "Do you offer a price guarantee?",
        a: "Yes. LivelyLightingCo offers a best-price guarantee and will beat any written quote from Trimlight, Jellyfish, Oelo, or Gemstone (Astoria) for a comparable permanent outdoor lighting system.",
      },
    ],
  },
  {
    category: "Durability & weather",
    items: [
      {
        q: "Do permanent outdoor lights hold up to Texas and Oklahoma heat and UV?",
        a: "Yes. The PermTrack mounting track is rigid, UV-resistant PVC — the same kind of material used in the vinyl window frames homeowners already trust to take decades of sun — so intense Texas and Oklahoma UV will not yellow it, fade it, or make it brittle. The LEDs themselves are sealed and weather-rated for year-round outdoor use.",
      },
      {
        q: "Will the lights survive wind, storms, hail, and ice?",
        a: "Yes. The PermTrack channel is mechanically fastened to the fascia rather than clipped on, and the LEDs are weather-sealed, so a properly installed system is built to withstand the high winds, severe storms, hail, and winter ice common across Texas and Oklahoma far better than temporary clip-on lights.",
      },
      {
        q: "What is PermTrack made of?",
        a: "PermTrack is a rigid, UV-resistant PVC mounting track — the same material family as the vinyl window frames trusted on homes to withstand sun and weather for decades. It is color-matched to your home's trim so it blends in during the day.",
      },
    ],
  },
  {
    category: "Brands & app control",
    items: [
      {
        q: "Which permanent outdoor lighting brands do you install?",
        a: "LivelyLightingCo is a certified installer for Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten permanent outdoor lighting systems, including Govee-certified installation. Each is paired with the PermTrack mounting track for a flush, paint-matched, weatherproof finish.",
      },
      {
        q: "What is the difference between the brands you install?",
        a: "All of the brands we install — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten — offer app control, millions of colors, scenes, and music sync. They differ in smart-home integration, price, and features, and LivelyLightingCo helps you choose the right one based on your home, budget, and existing smart-home setup during the free consultation.",
      },
      {
        q: "How does the app control work?",
        a: "Every system is controlled from a smartphone app over Wi-Fi. From the app you can change colors, brightness, animations, and scenes, schedule the lights, sync them to music, and switch between everyday warm white, holiday color, and team colors in seconds — no ladders or hardware to touch.",
      },
    ],
  },
  {
    category: "Warranty & service area",
    items: [
      {
        q: "What warranty do you offer?",
        a: "Every installation is backed by a lifetime warranty on the PermTrack mounting hardware and a 5-year workmanship warranty covering every clip, connection, and run we install. The LEDs carry their own manufacturer warranty by brand.",
      },
      {
        q: "What areas do you serve?",
        a: "LivelyLightingCo installs permanent outdoor lighting across Texas and Oklahoma. Our home base is the Austin, TX metro — Cedar Park, Round Rock, Leander, Georgetown, Pflugerville, and Austin — and we install across Dallas–Fort Worth, Houston, and San Antonio, while actively expanding throughout Oklahoma including Oklahoma City, Tulsa, Norman, Edmond, and Broken Arrow.",
      },
      {
        q: "How does this compare to Trimlight, Jellyfish, or Gemstone?",
        a: "The smart-LED brands LivelyLightingCo installs deliver the same year-round, app-controlled experience as Trimlight, Jellyfish, Oelo, and Gemstone — app-controlled scenes, music sync, and millions of colors — typically at a lower price point and with deeper smart-home integration, paired with the PermTrack track and backed by a lifetime hardware warranty plus a 5-year workmanship warranty.",
      },
    ],
  },
];

const FAQ_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((g) =>
    g.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }))
  ),
};

const Faq = () => {
  return (
    <main className="pt-20 bg-white">
      <SEO
        canonical="/faq"
        title="Permanent Outdoor Lighting FAQ"
        description="Answers to common questions about permanent outdoor LED lighting: cost, installation, durability in Texas and Oklahoma weather, brands, app control, and warranty."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(FAQ_PAGE_SCHEMA)}
        </script>
      </Helmet>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-surface-900 mb-6">
            Permanent Outdoor Lighting — FAQ
          </h1>
          <p className="text-lg text-surface-600">
            Straight answers to the questions homeowners ask most about permanent
            outdoor LED lighting — cost, installation, durability in Texas and
            Oklahoma weather, the brands we install, app control, and warranty.
          </p>
        </div>

        <div className="max-w-3xl space-y-12">
          {FAQ_GROUPS.map((group) => (
            <section key={group.category}>
              <h2 className="font-heading text-2xl font-bold text-surface-900 mb-6">
                {group.category}
              </h2>
              <div className="space-y-6">
                {group.items.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-heading text-lg font-semibold text-surface-900 mb-2">
                      {f.q}
                    </h3>
                    <p className="text-surface-600">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mt-16 bg-surface-900 text-white rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
            Still have questions?
          </h2>
          <p className="text-surface-300 mb-6">
            Get a free in-home consultation and an exact quote — no pressure, no
            obligation.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 rounded-md bg-accent-400 text-surface-900 font-heading font-bold hover:bg-accent-500 transition shadow-lg"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Faq;
