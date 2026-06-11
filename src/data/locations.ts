// Location landing-page content. One entry per served city, keyed by slug
// (`<city>-<state>`). Copy is written per-city — climate, geography and search
// intent differ by market, so these are not boilerplate with the name swapped.
//
// `status` controls phrasing: "established" markets (the Austin metro home base)
// speak in the present; "expansion" markets (Oklahoma, second-tier Texas metros)
// are forward-looking and must NOT claim completed local projects or local
// reviews. Keep every claim true.

export type LocationStatus = "established" | "expansion";

export interface LocationFaq {
  q: string;
  a: string;
}

export interface LocationSection {
  heading: string;
  body: string;
}

export interface LocationContent {
  slug: string;
  city: string;
  state: string;
  stateAbbr: string;
  status: LocationStatus;
  /** ~50–60 chars */
  metaTitle: string;
  /** ~150–160 chars */
  metaDescription: string;
  h1: string;
  /** Lead paragraph — the citable, GEO-friendly summary. */
  intro: string;
  sections: LocationSection[];
  /** Real neighbouring places, for context + internal relevance. */
  nearbyAreas: string[];
  faqs: LocationFaq[];
}

export const LOCATIONS: LocationContent[] = [
  {
    slug: "austin-tx",
    city: "Austin",
    state: "Texas",
    stateAbbr: "TX",
    status: "established",
    metaTitle: "Permanent Outdoor Lighting in Austin, TX",
    metaDescription:
      "Permanent outdoor LED lighting installed across the Austin, TX metro by Govee-certified pros. Hidden wiring, app control, year-round. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Austin, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across the Austin metro from our home base in nearby Cedar Park. Our systems — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack mounting track — sit low and nearly invisible along your roofline, run on hidden wiring, and are controlled from a phone app for warm-white everyday light, holidays, game days, and architectural accent lighting all year.",
    sections: [
      {
        heading: "Built for the Central Texas climate",
        body: "Austin summers bring relentless sun, high UV, and triple-digit heat, with the occasional hailstorm rolling through the Hill Country. Permanent outdoor lighting is built to live outside through all of it: the LEDs are sealed and weather-rated, and the PermTrack channel is color-matched to your fascia so the hardware disappears in daylight and survives the seasons that quickly fade and break seasonal clip-on lights.",
      },
      {
        heading: "One install, every season",
        body: "Instead of climbing ladders each December and taking lights down in January, a permanent system is installed once and controlled from your phone. Austin homeowners use it for warm-white curb appeal most nights, burnt-orange on Longhorns game days, red-white-and-blue for the Fourth, and full-color scenes for the holidays — no storage bins, no ladders, no tangled strands.",
      },
      {
        heading: "Why homeowners choose LivelyLightingCo",
        body: "We are a local, Govee-certified installer — not a seasonal crew. Every install pairs your chosen LED system with the PermTrack mounting track, fully hidden wiring, and clean terminations, backed by a lifetime warranty on the PermTrack mounting hardware and a 5-year workmanship warranty. We offer a free in-home consultation and a best-price guarantee against quotes from Trimlight, Jellyfish, Gemstone, and Oelo.",
      },
    ],
    nearbyAreas: [
      "Cedar Park",
      "Round Rock",
      "Leander",
      "Georgetown",
      "Pflugerville",
      "Lakeway",
      "Bee Cave",
      "West Lake Hills",
    ],
    faqs: [
      {
        q: "Do permanent outdoor lights hold up to Austin heat and UV?",
        a: "Yes. The LEDs are weather-sealed and UV-rated for year-round outdoor use, and the PermTrack channel is aluminum and color-matched to your trim, so Central Texas sun, heat, and humidity don't degrade the look the way they wear out seasonal clip-on lights.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Austin?",
        a: "Most Austin-area installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories. We provide a free in-home consultation and exact quote.",
      },
      {
        q: "Which areas around Austin do you serve?",
        a: "We serve the full Austin metro — including Cedar Park, Round Rock, Leander, Georgetown, Pflugerville, Lakeway, Bee Cave, and West Lake Hills — and install across Texas and Oklahoma.",
      },
    ],
  },
  {
    slug: "oklahoma-city-ok",
    city: "Oklahoma City",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Oklahoma City, OK",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Oklahoma City. Hidden wiring, app control, built for Oklahoma weather. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Oklahoma City, Oklahoma",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Oklahoma City as we expand throughout Oklahoma. Our systems — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack mounting track — mount low and nearly invisible along your roofline, run on hidden wiring, and are controlled from a phone app for everyday warm white, holidays, OU and Thunder game days, and architectural accent lighting year-round.",
    sections: [
      {
        heading: "Built for Oklahoma weather",
        body: "Oklahoma asks a lot of anything mounted outdoors — high winds, severe spring storms, summer heat, and winter ice. Permanent outdoor lighting is engineered to stay put and keep working: the LEDs are sealed and weather-rated, and the PermTrack channel is fastened to the fascia and color-matched to your home, so it holds up where temporary clip-on lights tear loose and fail.",
      },
      {
        heading: "One install, every season",
        body: "A permanent system is installed once and controlled from your phone — no ladders in an Oklahoma January, no untangling strands, no storage. Use warm white for everyday curb appeal, crimson and cream on game days, full color for the holidays, and patriotic scenes for summer, all from an app.",
      },
      {
        heading: "Expanding across Oklahoma City",
        body: "LivelyLightingCo is actively bringing permanent outdoor lighting to Oklahoma City and the surrounding metro. Every install pairs your chosen LED system with the PermTrack mounting track, fully hidden wiring, and Govee-certified workmanship, backed by a lifetime warranty on the PermTrack mounting hardware and a 5-year workmanship warranty. Book a free consultation and a best-price guarantee against Trimlight, Jellyfish, Gemstone, and Oelo.",
      },
    ],
    nearbyAreas: ["Edmond", "Norman", "Moore", "Yukon", "Mustang", "Midwest City"],
    faqs: [
      {
        q: "Do permanent outdoor lights hold up to Oklahoma wind and storms?",
        a: "Yes. The PermTrack channel is mechanically fastened to the fascia rather than clipped on, and the LEDs are weather-sealed, so a properly installed system is built to withstand Oklahoma wind, heat, and winter ice far better than temporary seasonal lights.",
      },
      {
        q: "Does LivelyLightingCo install in Oklahoma City yet?",
        a: "Yes — we are actively expanding across Oklahoma and installing permanent outdoor lighting in the Oklahoma City metro. Contact us for a free consultation and we'll confirm scheduling for your address.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Oklahoma City?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories. We provide a free consultation and an exact quote.",
      },
    ],
  },
];

export const getLocation = (slug: string): LocationContent | undefined =>
  LOCATIONS.find((l) => l.slug === slug);
