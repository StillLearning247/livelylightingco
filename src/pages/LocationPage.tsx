import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, MapPin, Sun } from "lucide-react";
import { SEO } from "../components/SEO";
import { getLocation, LOCATIONS } from "../data/locations";

const BASE_URL = "https://livelylightingco.com";

const LocationPage = () => {
  const { slug = "" } = useParams();
  const loc = getLocation(slug);

  // Unknown slug → send to the hub rather than render an empty page.
  if (!loc) return <Navigate to="/locations" replace />;

  const canonical = `/locations/${loc.slug}`;
  const isState = loc.areaScope === "state";
  const title = isState
    ? `Permanent Outdoor Lighting in ${loc.state}`
    : `Permanent Outdoor Lighting in ${loc.city}, ${loc.stateAbbr}`;
  const breadcrumbLabel = isState ? loc.state : `${loc.city}, ${loc.stateAbbr}`;

  // Per-city Service schema (areaServed scoped to this city) + local FAQPage.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Permanent Outdoor Lighting Installation",
    name: `Permanent Outdoor Lighting Installation in ${loc.city}, ${loc.stateAbbr}`,
    description: loc.metaDescription,
    provider: { "@id": `${BASE_URL}/#business` },
    areaServed: isState
      ? { "@type": "State", name: loc.state }
      : {
          "@type": "City",
          name: loc.city,
          containedInPlace: { "@type": "State", name: loc.state },
        },
    url: `${BASE_URL}${canonical}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: loc.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Link a nearby area to its own location page when one exists.
  const slugFor = (area: string) =>
    LOCATIONS.find(
      (l) => l.city.toLowerCase() === area.toLowerCase()
    )?.slug;

  return (
    <main className="pt-20 bg-white">
      <SEO
        canonical={canonical}
        title={title}
        description={loc.metaDescription}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/locations" },
          { name: breadcrumbLabel, path: canonical },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-6 py-16">
        {/* Back to the locations hub */}
        <Link
          to="/locations"
          className="inline-flex items-center gap-1.5 text-surface-500 hover:text-brand-500 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          All Service Areas
        </Link>

        {/* Hero */}
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-brand-400 font-medium mb-3">
            <MapPin className="h-5 w-5" />
            {isState ? loc.state : `${loc.city}, ${loc.state}`}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-surface-900 mb-6">
            {loc.h1}
          </h1>
          <p className="text-lg text-surface-600 mb-8">{loc.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-md bg-accent-400 text-surface-900 text-center font-heading font-bold hover:bg-accent-500 transition shadow-lg"
            >
              Get a Free Quote
            </Link>
            <Link
              to="/#gallery"
              className="px-8 py-4 rounded-md border border-surface-300 text-surface-800 text-center font-heading font-semibold hover:bg-surface-50 transition-colors inline-flex items-center justify-center group"
            >
              See Our Work
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* UV-resistance emphasis — a core differentiator */}
        <div className="max-w-3xl mt-10 flex items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <Sun className="h-8 w-8 text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-lg text-surface-900 mb-1">
              Built to stand up to {loc.state} UV
            </p>
            <p className="text-surface-700">
              The PermTrack mounting track is{" "}
              <strong>rigid, UV-resistant PVC — the same kind of material used in
              the vinyl window frames homeowners already trust to take decades of
              sun</strong>. Intense {loc.state} UV won't yellow it, fade it, or
              make it brittle the way it destroys temporary clip-on lights, so your
              roofline stays clean and bright year after year.
            </p>
          </div>
        </div>

        {/* Body sections */}
        <div className="max-w-3xl mt-12 space-y-12">
          {loc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-heading text-2xl font-bold text-surface-900 mb-3">
                {s.heading}
              </h2>
              <p className="text-surface-600 text-lg">{s.body}</p>
            </section>
          ))}
        </div>

        {/* Nearby areas */}
        {loc.nearbyAreas.length > 0 && (
          <div className="max-w-3xl mt-16">
            <h2 className="font-heading text-2xl font-bold text-surface-900 mb-4">
              {isState
                ? `Cities we serve in ${loc.state}`
                : `Areas we serve near ${loc.city}`}
            </h2>
            <div className="flex flex-wrap gap-3">
              {loc.nearbyAreas.map((area) => {
                const areaSlug = slugFor(area);
                const className =
                  "px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-surface-700 text-sm font-medium";
                return areaSlug ? (
                  <Link key={area} to={`/locations/${areaSlug}`} className={`${className} hover:border-brand-300 transition-colors`}>
                    {area}
                  </Link>
                ) : (
                  <span key={area} className={className}>
                    {area}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Local FAQ */}
        {loc.faqs.length > 0 && (
          <div className="max-w-3xl mt-16">
            <h2 className="font-heading text-2xl font-bold text-surface-900 mb-6">
              Permanent outdoor lighting in {loc.city} — FAQ
            </h2>
            <div className="space-y-6">
              {loc.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-heading text-lg font-semibold text-surface-900 mb-2">
                    {f.q}
                  </h3>
                  <p className="text-surface-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-3xl mt-16 bg-surface-900 text-white rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
            Ready for permanent outdoor lighting in {loc.city}?
          </h2>
          <p className="text-surface-300 mb-6">
            Free in-home consultation, lifetime PermTrack hardware warranty, and a
            5-year workmanship warranty on every install.
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

export default LocationPage;
