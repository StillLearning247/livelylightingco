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
  /** "city" (default) targets a city; "state" is a statewide hub page. */
  areaScope?: "city" | "state";
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

  {
    slug: "cedar-park-tx",
    city: "Cedar Park",
    state: "Texas",
    stateAbbr: "TX",
    status: "established",
    metaTitle: "Permanent Outdoor Lighting in Cedar Park, TX",
    metaDescription:
      "LivelyLightingCo is based in Cedar Park, TX, installing permanent outdoor LED lighting with hidden wiring and app control. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Cedar Park, Texas",
    intro:
      "Cedar Park is our home base. LivelyLightingCo installs permanent outdoor LED lighting — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack mounting track — for Cedar Park homeowners, with hidden wiring and app control for warm-white everyday light, holidays, and accent lighting year-round.",
    sections: [
      {
        heading: "Your local Cedar Park installer",
        body: "We are based right here in Cedar Park — not a seasonal pop-up crew that disappears after the holidays. That means quick scheduling for your consultation, local accountability on every install, and warranty service from a team down the road rather than out of state.",
      },
      {
        heading: "Built for Central Texas weather",
        body: "Cedar Park sees long, sun-baked summers, high UV, and the occasional Hill Country hailstorm. The LEDs are weather-sealed and the PermTrack channel is color-matched to your fascia, so the system holds up and stays nearly invisible in daylight where seasonal clip-on lights fade and fail.",
      },
      {
        heading: "One install, every season",
        body: "Installed once and run from your phone — warm white for everyday curb appeal, full color for the holidays, team colors on game days. No ladders, no storage bins, no tangled strands every December.",
      },
    ],
    nearbyAreas: ["Leander", "Round Rock", "Georgetown", "Austin", "Liberty Hill"],
    faqs: [
      {
        q: "Are you actually local to Cedar Park?",
        a: "Yes — Cedar Park is our home base. You get fast scheduling, a local team, and in-person warranty support rather than an out-of-town installer.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Cedar Park?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories. The consultation and quote are free.",
      },
    ],
  },

  {
    slug: "leander-tx",
    city: "Leander",
    state: "Texas",
    stateAbbr: "TX",
    status: "established",
    metaTitle: "Permanent Outdoor Lighting in Leander, TX",
    metaDescription:
      "Permanent outdoor LED lighting for Leander, TX homes — hidden wiring, app control, year-round. Installed by Govee-certified local pros. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Leander, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting for Leander homeowners from our base in neighboring Cedar Park. Our systems mount low along the roofline on the PermTrack track, run on hidden wiring, and are controlled from a phone app for everyday warm white, holidays, and accent lighting all year.",
    sections: [
      {
        heading: "Clean rooflines for Leander's newer homes",
        body: "Leander's fast-growing, master-planned neighborhoods — from Travisso to Crystal Falls and Bryson — are full of crisp new architecture. A permanent system keeps that clean look year-round: the color-matched track disappears against the fascia, so there's no bulky cord or clip ruining the lines of a brand-new home.",
      },
      {
        heading: "Built for Central Texas weather",
        body: "Intense summer sun, high UV, and the odd hailstorm are hard on temporary lights. Permanent outdoor lighting is built to live outside through all of it — sealed, weather-rated LEDs in an aluminum track that's fastened to the home, not clipped on.",
      },
    ],
    nearbyAreas: ["Cedar Park", "Liberty Hill", "Georgetown", "Round Rock"],
    faqs: [
      {
        q: "Do you serve new construction in Leander?",
        a: "Yes — permanent outdoor lighting is a great fit for Leander's newer homes. The PermTrack channel is color-matched to your fascia for a clean, built-in look, and we can plan the run around your roofline during the free consultation.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Leander?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "round-rock-tx",
    city: "Round Rock",
    state: "Texas",
    stateAbbr: "TX",
    status: "established",
    metaTitle: "Permanent Outdoor Lighting in Round Rock, TX",
    metaDescription:
      "Permanent outdoor LED lighting for Round Rock, TX — hidden wiring, app control, game-day and holiday scenes year-round. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Round Rock, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Round Rock from our nearby Cedar Park base. The system mounts low along your roofline on the PermTrack track with hidden wiring and phone-app control, ready for everyday warm white, holidays, and game days year-round.",
    sections: [
      {
        heading: "Game-day ready in the Sports Capital of Texas",
        body: "Round Rock takes its teams seriously. With a permanent system you can switch your whole roofline to team colors for a tournament weekend or a big game from your phone — then back to warm white the next night — without ever touching a ladder.",
      },
      {
        heading: "Built for Central Texas weather",
        body: "Round Rock's established neighborhoods and newer subdivisions all face the same Central Texas heat, UV, and storms. Permanent outdoor lighting is sealed and weather-rated, with a color-matched aluminum track that holds up and stays nearly invisible in daylight.",
      },
    ],
    nearbyAreas: ["Cedar Park", "Pflugerville", "Georgetown", "Austin"],
    faqs: [
      {
        q: "Can I set my lights to team colors for game days?",
        a: "Yes — the app lets you switch the whole system to any color or scene in seconds, so team colors for a game day and warm white the rest of the week are a tap apart.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Round Rock?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "georgetown-tx",
    city: "Georgetown",
    state: "Texas",
    stateAbbr: "TX",
    status: "established",
    metaTitle: "Permanent Outdoor Lighting in Georgetown, TX",
    metaDescription:
      "Permanent outdoor LED lighting for Georgetown, TX, including Sun City — no ladders, hidden wiring, app control. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Georgetown, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting throughout Georgetown, from the historic square to Sun City, out of our nearby Cedar Park base. The system mounts low on the PermTrack track with hidden wiring and app control for everyday warm white, holidays, and accent lighting year-round.",
    sections: [
      {
        heading: "No more ladders — a favorite in Sun City",
        body: "For Georgetown's large Sun City community and anyone who'd rather not climb a ladder, permanent lighting is a perfect fit. It's installed once and controlled entirely from a phone app, so holiday and everyday lighting never means getting on a roof again.",
      },
      {
        heading: "Built for Central Texas weather",
        body: "From the limestone homes near the square to newer builds on the north side, Georgetown homes face the same intense sun and seasonal storms. The weather-sealed LEDs and color-matched PermTrack channel are built to stay outside year-round and disappear in daylight.",
      },
    ],
    nearbyAreas: ["Round Rock", "Leander", "Cedar Park", "Liberty Hill"],
    faqs: [
      {
        q: "Is permanent lighting a good option for Sun City homeowners?",
        a: "Yes — it's one of the most popular reasons people choose it. Everything is controlled from a phone app, so there are no ladders and no taking lights up and down each season.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Georgetown?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "pflugerville-tx",
    city: "Pflugerville",
    state: "Texas",
    stateAbbr: "TX",
    status: "established",
    metaTitle: "Permanent Outdoor Lighting in Pflugerville, TX",
    metaDescription:
      "Permanent outdoor LED lighting for Pflugerville, TX homes — hidden wiring, app control, year-round. Local Govee-certified install. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Pflugerville, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Pflugerville from our nearby Cedar Park base. The low-profile system mounts on the PermTrack track with hidden wiring and phone-app control for everyday warm white, holidays, and accent lighting all year.",
    sections: [
      {
        heading: "Built for Pflugerville's growing neighborhoods",
        body: "From Stone Hill to the communities around Lake Pflugerville, Pflugerville keeps adding crisp new homes. A permanent system gives them clean, built-in roofline lighting that looks intentional year-round — not a seasonal afterthought.",
      },
      {
        heading: "Built for Central Texas weather",
        body: "Hot summers, strong UV, and the occasional hailstorm wear out temporary lights fast. Permanent outdoor lighting is sealed and weather-rated, with a color-matched aluminum track fastened to the home so it holds up season after season.",
      },
    ],
    nearbyAreas: ["Round Rock", "Hutto", "Austin", "Cedar Park"],
    faqs: [
      {
        q: "How long does a permanent lighting install take?",
        a: "Most single-family installs are completed in a day. We plan the layout with you during the free consultation and handle the mounting, hidden wiring, and app setup.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Pflugerville?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "dallas-tx",
    city: "Dallas",
    state: "Texas",
    stateAbbr: "TX",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Dallas, TX",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Dallas, TX — hidden wiring, app control, built for Texas heat and ice. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Dallas, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Dallas as we expand throughout Texas. Our systems — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack track — mount low along the roofline with hidden wiring and app control for everyday warm white, holidays, and accent lighting year-round.",
    sections: [
      {
        heading: "Built for Dallas weather — heat and ice",
        body: "Dallas swings from triple-digit summers to winter ice storms, and both are brutal on temporary lights. Permanent outdoor lighting is engineered to stay put through it: sealed, weather-rated LEDs in an aluminum PermTrack channel that's mechanically fastened to the fascia, not clipped on.",
      },
      {
        heading: "One install, every season",
        body: "Installed once and controlled from a phone app — warm white for everyday curb appeal, full color for the holidays, and team colors for game days, with no ladders and nothing to take down and store.",
      },
    ],
    nearbyAreas: ["Fort Worth", "Plano", "Frisco", "Arlington", "Irving"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Dallas?",
        a: "Yes — we are actively expanding across Texas and installing permanent outdoor lighting in the Dallas–Fort Worth metro. Contact us for a free consultation and we'll confirm scheduling for your address.",
      },
      {
        q: "Will permanent lights survive a Dallas ice storm?",
        a: "The PermTrack channel is fastened to the fascia and the LEDs are weather-sealed, so a properly installed system is built to handle Texas heat and winter ice far better than temporary clip-on lights.",
      },
    ],
  },

  {
    slug: "fort-worth-tx",
    city: "Fort Worth",
    state: "Texas",
    stateAbbr: "TX",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Fort Worth, TX",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Fort Worth, TX — hidden wiring, app control, built for North Texas weather. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Fort Worth, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Fort Worth as we expand throughout Texas. The low-profile system mounts on the PermTrack track with hidden wiring and phone-app control for everyday warm white, holidays, and accent lighting all year.",
    sections: [
      {
        heading: "Clean lighting for Cowtown homes",
        body: "From ranch-style homes to modern new builds, Fort Worth rooflines look best with lighting that's there when you want it and invisible when you don't. The color-matched PermTrack channel blends into the fascia, so the hardware disappears in daylight.",
      },
      {
        heading: "Built for North Texas weather",
        body: "Fort Worth shares Dallas's swing from intense summer heat to winter ice. Permanent outdoor lighting uses sealed, weather-rated LEDs in an aluminum track fastened to the home, built to hold up where seasonal lights tear loose and fail.",
      },
    ],
    nearbyAreas: ["Dallas", "Arlington", "Keller", "Southlake", "Mansfield"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Fort Worth?",
        a: "Yes — we are actively expanding across Texas and installing permanent outdoor lighting in the Dallas–Fort Worth metro. Reach out for a free consultation about your address.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Fort Worth?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "houston-tx",
    city: "Houston",
    state: "Texas",
    stateAbbr: "TX",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Houston, TX",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Houston, TX — hidden wiring, app control, built for Gulf Coast humidity and storms. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Houston, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Houston as we expand throughout Texas. Our systems mount low along the roofline on the PermTrack track with hidden wiring and app control for everyday warm white, holidays, and accent lighting year-round.",
    sections: [
      {
        heading: "Built for the Gulf Coast",
        body: "Houston's heat, humidity, heavy rain, and storm season are demanding on anything outdoors. Permanent outdoor lighting is sealed and weather-rated for exactly this, with an aluminum PermTrack channel fastened to the fascia so it stays put when temporary lights would sag, corrode, or blow loose.",
      },
      {
        heading: "One install, every season",
        body: "Installed once and run from your phone — warm white most nights, full color for the holidays, and patriotic or team scenes whenever you like, with no ladders and nothing to store between seasons.",
      },
    ],
    nearbyAreas: ["The Woodlands", "Katy", "Sugar Land", "Pearland", "Cypress"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Houston?",
        a: "Yes — we are actively expanding across Texas and installing permanent outdoor lighting in the greater Houston area. Contact us for a free consultation about your address.",
      },
      {
        q: "Can permanent outdoor lights handle Houston humidity and storms?",
        a: "Yes. The LEDs are weather-sealed and the PermTrack track is mechanically fastened to the home, so a properly installed system is built for Gulf Coast humidity, heat, and heavy weather.",
      },
    ],
  },

  {
    slug: "san-antonio-tx",
    city: "San Antonio",
    state: "Texas",
    stateAbbr: "TX",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in San Antonio, TX",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across San Antonio, TX — hidden wiring, app control, built for South Texas heat. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in San Antonio, Texas",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across San Antonio as we expand throughout Texas. The low-profile system mounts on the PermTrack track with hidden wiring and phone-app control for everyday warm white, holidays, and accent lighting all year.",
    sections: [
      {
        heading: "Built for South Texas sun",
        body: "San Antonio's long, hot season and strong UV quickly fade and brittle the plastic of seasonal lights. Permanent outdoor lighting uses sealed, UV-rated LEDs in an aluminum track color-matched to your trim, built to stay outside and keep looking clean year-round.",
      },
      {
        heading: "From Stone Oak to the Hill Country edge",
        body: "Whether your home is a modern build in Stone Oak or a classic on the city's older streets, the PermTrack channel mounts flush to the fascia for a built-in look, and the app puts warm white, holiday color, and Spurs-night scenes a tap away.",
      },
    ],
    nearbyAreas: ["New Braunfels", "Boerne", "Schertz", "Stone Oak", "Helotes"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in San Antonio?",
        a: "Yes — we are actively expanding across Texas and installing permanent outdoor lighting in the San Antonio area. Contact us for a free consultation about your address.",
      },
      {
        q: "How much does permanent outdoor lighting cost in San Antonio?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "tulsa-ok",
    city: "Tulsa",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Tulsa, OK",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Tulsa, OK — hidden wiring, app control, built for Oklahoma wind and ice. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Tulsa, Oklahoma",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Tulsa as we expand throughout Oklahoma. Our systems — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack track — mount low along the roofline with hidden wiring and app control for everyday warm white, holidays, and accent lighting year-round.",
    sections: [
      {
        heading: "Built for Oklahoma weather",
        body: "Tulsa sees high winds, severe spring storms, summer heat, and winter ice — conditions that pull temporary lights loose and break them. Permanent outdoor lighting is fastened to the fascia and sealed against the weather, built to stay put and keep working through Oklahoma's seasons.",
      },
      {
        heading: "One install, every season",
        body: "Installed once and controlled from a phone app — warm white for everyday curb appeal, full color for the holidays, and team colors on game days, with no ladders in a Tulsa January and nothing to store.",
      },
    ],
    nearbyAreas: ["Broken Arrow", "Owasso", "Bixby", "Jenks", "Sand Springs"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Tulsa yet?",
        a: "Yes — we are actively expanding across Oklahoma and installing permanent outdoor lighting in the Tulsa metro. Contact us for a free consultation and we'll confirm scheduling for your address.",
      },
      {
        q: "Will permanent lights hold up to Oklahoma wind and ice?",
        a: "Yes. The PermTrack channel is mechanically fastened to the fascia rather than clipped on, and the LEDs are weather-sealed, so a properly installed system is built for Oklahoma wind, storms, and winter ice.",
      },
    ],
  },

  {
    slug: "norman-ok",
    city: "Norman",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Norman, OK",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Norman, OK — hidden wiring, app control, crimson-and-cream game-day scenes. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Norman, Oklahoma",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Norman as we expand throughout Oklahoma. The low-profile system mounts on the PermTrack track with hidden wiring and phone-app control for everyday warm white, holidays, game days, and accent lighting all year.",
    sections: [
      {
        heading: "Crimson and cream, any game day",
        body: "In a college town like Norman, a permanent system lets you light the whole roofline in crimson and cream for a game weekend and switch back to warm white afterward — all from your phone, with no ladder and no untangling strands.",
      },
      {
        heading: "Built for Oklahoma weather",
        body: "Norman's plains weather brings wind, storms, heat, and winter ice. Permanent outdoor lighting uses sealed, weather-rated LEDs in an aluminum track fastened to the home, built to hold up where temporary lights tear loose.",
      },
    ],
    nearbyAreas: ["Moore", "Oklahoma City", "Noble", "Newcastle"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Norman yet?",
        a: "Yes — we are actively expanding across Oklahoma and installing permanent outdoor lighting in Norman. Contact us for a free consultation about your address.",
      },
      {
        q: "Can I set my lights to team colors for game days?",
        a: "Yes — the app switches the whole system to any color or scene in seconds, so crimson and cream for a game day and warm white the rest of the week are a tap apart.",
      },
    ],
  },

  {
    slug: "edmond-ok",
    city: "Edmond",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Edmond, OK",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Edmond, OK — hidden wiring, app control, clean built-in rooflines. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Edmond, Oklahoma",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Edmond as we expand throughout Oklahoma. The low-profile system mounts on the PermTrack track with hidden wiring and app control for everyday warm white, holidays, and accent lighting year-round.",
    sections: [
      {
        heading: "A built-in look for Edmond homes",
        body: "Edmond's upscale, newer neighborhoods look best with lighting that's there when you want it and invisible when you don't. The color-matched PermTrack channel mounts flush to the fascia, so there's no bulky cord or seasonal clip breaking the lines of the home.",
      },
      {
        heading: "Built for Oklahoma weather",
        body: "From summer heat to winter ice and the wind in between, Edmond homes face the full range of Oklahoma weather. Permanent outdoor lighting is sealed and fastened to the home, built to keep working through all of it.",
      },
    ],
    nearbyAreas: ["Oklahoma City", "Norman", "Yukon", "Guthrie"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Edmond yet?",
        a: "Yes — we are actively expanding across Oklahoma and installing permanent outdoor lighting in Edmond. Contact us for a free consultation about your address.",
      },
      {
        q: "How much does permanent outdoor lighting cost in Edmond?",
        a: "Most installations run about $18–$35 per linear foot of roofline, with typical homes between $2,000 and $8,000+ depending on size, roof complexity, the brand chosen, and number of stories.",
      },
    ],
  },

  {
    slug: "broken-arrow-ok",
    city: "Broken Arrow",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "expansion",
    metaTitle: "Permanent Outdoor Lighting in Broken Arrow, OK",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Broken Arrow, OK — hidden wiring, app control, built for Oklahoma weather. Lifetime hardware + 5-year workmanship warranty.",
    h1: "Permanent Outdoor Lighting in Broken Arrow, Oklahoma",
    intro:
      "LivelyLightingCo installs permanent outdoor LED lighting across Broken Arrow as we expand throughout Oklahoma. The low-profile system mounts on the PermTrack track with hidden wiring and phone-app control for everyday warm white, holidays, and accent lighting all year.",
    sections: [
      {
        heading: "Clean rooflines for a growing suburb",
        body: "Broken Arrow keeps adding crisp new family homes. A permanent system gives them built-in roofline lighting that looks intentional year-round, with a color-matched track that disappears against the fascia in daylight.",
      },
      {
        heading: "Built for Oklahoma weather",
        body: "Wind, severe storms, heat, and winter ice all pass through Broken Arrow. Permanent outdoor lighting is fastened to the home and sealed against the weather, built to stay put where temporary lights fail.",
      },
    ],
    nearbyAreas: ["Tulsa", "Owasso", "Bixby", "Coweta"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Broken Arrow yet?",
        a: "Yes — we are actively expanding across Oklahoma and installing permanent outdoor lighting in Broken Arrow. Contact us for a free consultation about your address.",
      },
      {
        q: "How long does a permanent lighting install take?",
        a: "Most single-family installs are completed in a day. We plan the layout during the free consultation, then handle mounting, hidden wiring, and app setup.",
      },
    ],
  },

  {
    slug: "oklahoma",
    city: "Oklahoma",
    state: "Oklahoma",
    stateAbbr: "OK",
    status: "expansion",
    areaScope: "state",
    metaTitle: "Permanent Outdoor Lighting in Oklahoma",
    metaDescription:
      "LivelyLightingCo installs permanent outdoor LED lighting across Oklahoma — Oklahoma City, Tulsa, Norman, Edmond, Broken Arrow and beyond. Built for Oklahoma weather, backed by warranty.",
    h1: "Permanent Outdoor Lighting Across Oklahoma",
    intro:
      "LivelyLightingCo is bringing permanent outdoor LED lighting to homeowners across Oklahoma. Our systems — Govee Pro, Govee Prism, Asahom, Eufy, and Enbrighten on the PermTrack mounting track — mount low along the roofline with hidden wiring and phone-app control for everyday warm white, holidays, game days, and accent lighting year-round.",
    sections: [
      {
        heading: "Built for Oklahoma weather",
        body: "Oklahoma asks a lot of anything mounted outdoors — high winds, severe spring storms, summer heat, and winter ice. Permanent outdoor lighting is engineered to stay put and keep working: weather-sealed LEDs in an aluminum PermTrack channel that's fastened to the fascia, not clipped on.",
      },
      {
        heading: "Expanding across the state",
        body: "We are actively expanding throughout Oklahoma, including Oklahoma City, Tulsa, Norman, Edmond, and Broken Arrow. Every install pairs your chosen LED system with the PermTrack track, hidden wiring, and Govee-certified workmanship, backed by a lifetime warranty on the PermTrack mounting hardware and a 5-year workmanship warranty.",
      },
      {
        heading: "One install, every season",
        body: "Installed once and controlled from a phone app — warm white most nights, full color for the holidays, and team colors on game days, with no ladders and nothing to take down and store.",
      },
    ],
    nearbyAreas: ["Oklahoma City", "Tulsa", "Norman", "Edmond", "Broken Arrow"],
    faqs: [
      {
        q: "Does LivelyLightingCo install in Oklahoma?",
        a: "Yes — we are actively expanding across Oklahoma, including the Oklahoma City and Tulsa metros and surrounding communities. Contact us for a free consultation and we'll confirm scheduling for your address.",
      },
      {
        q: "Will permanent lights hold up to Oklahoma weather?",
        a: "Yes. The PermTrack channel is mechanically fastened to the fascia and the LEDs are weather-sealed, so a properly installed system is built for Oklahoma wind, storms, heat, and winter ice.",
      },
    ],
  },
];

export const getLocation = (slug: string): LocationContent | undefined =>
  LOCATIONS.find((l) => l.slug === slug);
