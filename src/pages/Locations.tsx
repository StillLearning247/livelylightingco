import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { SEO } from "../components/SEO";
import { LOCATIONS } from "../data/locations";

const Locations = () => {
  // Group served cities by state for a scannable hub.
  const byState = LOCATIONS.reduce<Record<string, typeof LOCATIONS>>(
    (acc, loc) => {
      (acc[loc.state] ||= []).push(loc);
      return acc;
    },
    {}
  );
  const states = Object.keys(byState).sort();

  return (
    <main className="pt-20 bg-white">
      <SEO
        canonical="/locations"
        title="Service Areas — Texas & Oklahoma"
        description="LivelyLightingCo installs permanent outdoor LED lighting across Texas and Oklahoma. Find permanent lighting installation in your city."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/locations" },
        ]}
      />
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-surface-900 mb-6">
            Where We Install Permanent Outdoor Lighting
          </h1>
          <p className="text-lg text-surface-600">
            LivelyLightingCo installs permanent outdoor LED lighting — Govee Pro,
            Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack mounting
            system — across Texas and Oklahoma. Choose your area for local details,
            or contact us about your address.
          </p>
        </div>

        <div className="space-y-12">
          {states.map((state) => (
            <section key={state}>
              <h2 className="font-heading text-2xl font-bold text-surface-900 mb-5">
                {state}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byState[state]
                  .slice()
                  .sort((a, b) => a.city.localeCompare(b.city))
                  .map((loc) => (
                    <Link
                      key={loc.slug}
                      to={`/locations/${loc.slug}`}
                      className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-brand-300 hover:shadow-sm transition-all group"
                    >
                      <MapPin className="h-5 w-5 text-brand-400 flex-shrink-0" />
                      <span className="font-medium text-surface-800 group-hover:text-brand-500 transition-colors">
                        {loc.city}, {loc.stateAbbr}
                      </span>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Locations;
