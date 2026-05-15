import { Helmet } from "react-helmet-async";
import { ComparisonTable } from "../components/ComparisonTable";
import { SEO } from "../components/SEO";

const comparisonJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Permanent Outdoor Lighting Systems Compared",
  description:
    "Side-by-side comparison of permanent outdoor LED lighting systems on price, smart features, color match, and warranty. Compares Lively + PermTrack against Trimlight, Jellyfish, Gemstone (Astoria), Oelo, and DIY install.",
  url: "https://livelylightingco.com/compare",
  numberOfItems: 6,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Lively + PermTrack",
        description:
          "PermTrack mounting system paired with your choice of Govee, Asahom, Eufy, or Enbrighten smart LEDs. Professionally installed.",
        provider: { "@id": "https://livelylightingco.com/#business" },
        areaServed: { "@type": "City", name: "Austin", containedInPlace: { "@type": "State", name: "Texas" } },
        additionalProperty: [
          { "@type": "PropertyValue", name: "LED Brand Choice", value: "4 brands (Govee, Asahom, Eufy, Enbrighten)" },
          { "@type": "PropertyValue", name: "Track / Hardware Warranty", value: "Lifetime PermTrack" },
          { "@type": "PropertyValue", name: "LED Warranty", value: "Per LED brand manufacturer warranty" },
          { "@type": "PropertyValue", name: "Workmanship Warranty", value: "5 years" },
          { "@type": "PropertyValue", name: "Smart App + Voice + Music Sync", value: "Yes" },
          { "@type": "PropertyValue", name: "Matter / Apple Home", value: "Yes" },
          { "@type": "PropertyValue", name: "16M+ Colors", value: "Yes" },
          { "@type": "PropertyValue", name: "Custom Track Color Match", value: "Perfect home color paint match" },
          { "@type": "PropertyValue", name: "Smart Camera Integration", value: "Yes (via Eufy)" },
          { "@type": "PropertyValue", name: "Professional Installation", value: "Yes" },
          { "@type": "PropertyValue", name: "Best Price Guarantee", value: "Yes" },
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Trimlight",
        description: "Legacy permanent outdoor lighting system with proprietary LEDs.",
        additionalProperty: [
          { "@type": "PropertyValue", name: "LED Brand Choice", value: "Trimlight only" },
          { "@type": "PropertyValue", name: "Track / Hardware Warranty", value: "Lifetime (per dealer)" },
          { "@type": "PropertyValue", name: "LED Warranty", value: "Lifetime LEDs (per dealer)" },
          { "@type": "PropertyValue", name: "Workmanship Warranty", value: "1 year" },
          { "@type": "PropertyValue", name: "Smart App + Voice + Music Sync", value: "Yes" },
          { "@type": "PropertyValue", name: "Matter / Apple Home", value: "No" },
          { "@type": "PropertyValue", name: "16M+ Colors", value: "Yes" },
          { "@type": "PropertyValue", name: "Custom Track Color Match", value: "50+ stock colors" },
          { "@type": "PropertyValue", name: "Smart Camera Integration", value: "No" },
          { "@type": "PropertyValue", name: "Professional Installation", value: "Yes" },
          { "@type": "PropertyValue", name: "Best Price Guarantee", value: "No" },
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Jellyfish Lighting",
        description: "Eave-mounted permanent outdoor lighting system.",
        additionalProperty: [
          { "@type": "PropertyValue", name: "LED Brand Choice", value: "Jellyfish only" },
          { "@type": "PropertyValue", name: "Track / Hardware Warranty", value: "5-Year parts (per dealer)" },
          { "@type": "PropertyValue", name: "LED Warranty", value: "5-Year parts (per dealer)" },
          { "@type": "PropertyValue", name: "Workmanship Warranty", value: "1 year" },
          { "@type": "PropertyValue", name: "Smart App + Voice + Music Sync", value: "Yes" },
          { "@type": "PropertyValue", name: "Matter / Apple Home", value: "No" },
          { "@type": "PropertyValue", name: "16M+ Colors", value: "Yes" },
          { "@type": "PropertyValue", name: "Custom Track Color Match", value: "Trim-matched track" },
          { "@type": "PropertyValue", name: "Smart Camera Integration", value: "No" },
          { "@type": "PropertyValue", name: "Professional Installation", value: "Yes" },
          { "@type": "PropertyValue", name: "Best Price Guarantee", value: "No" },
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Gemstone Lights (Astoria)",
        description: "Premium-priced permanent track lighting system.",
        additionalProperty: [
          { "@type": "PropertyValue", name: "LED Brand Choice", value: "Gemstone only" },
          { "@type": "PropertyValue", name: "Track / Hardware Warranty", value: "10-Year parts (per dealer)" },
          { "@type": "PropertyValue", name: "LED Warranty", value: "Lifetime LEDs (per dealer)" },
          { "@type": "PropertyValue", name: "Workmanship Warranty", value: "3 years" },
          { "@type": "PropertyValue", name: "Smart App + Voice + Music Sync", value: "Yes" },
          { "@type": "PropertyValue", name: "Matter / Apple Home", value: "No" },
          { "@type": "PropertyValue", name: "16M+ Colors", value: "Yes" },
          { "@type": "PropertyValue", name: "Custom Track Color Match", value: "151+ stock colors plus hex codes" },
          { "@type": "PropertyValue", name: "Smart Camera Integration", value: "No" },
          { "@type": "PropertyValue", name: "Professional Installation", value: "Yes" },
          { "@type": "PropertyValue", name: "Best Price Guarantee", value: "No" },
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Service",
        name: "Oelo",
        description: "Permanent LED outdoor lighting system.",
        additionalProperty: [
          { "@type": "PropertyValue", name: "LED Brand Choice", value: "Oelo only" },
          { "@type": "PropertyValue", name: "Track / Hardware Warranty", value: "5–7 years (varies by dealer)" },
          { "@type": "PropertyValue", name: "LED Warranty", value: "5–7 years (varies by dealer)" },
          { "@type": "PropertyValue", name: "Workmanship Warranty", value: "5–7 years (varies by dealer)" },
          { "@type": "PropertyValue", name: "Smart App + Voice + Music Sync", value: "Yes" },
          { "@type": "PropertyValue", name: "Matter / Apple Home", value: "No" },
          { "@type": "PropertyValue", name: "16M+ Colors", value: "Yes" },
          { "@type": "PropertyValue", name: "Custom Track Color Match", value: "Standard colors" },
          { "@type": "PropertyValue", name: "Smart Camera Integration", value: "No" },
          { "@type": "PropertyValue", name: "Professional Installation", value: "Yes" },
          { "@type": "PropertyValue", name: "Best Price Guarantee", value: "No" },
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "Product",
        name: "DIY Install (consumer kit)",
        description: "Self-installed consumer permanent lighting kit.",
        additionalProperty: [
          { "@type": "PropertyValue", name: "LED Brand Choice", value: "Buy any" },
          { "@type": "PropertyValue", name: "Track / Hardware Warranty", value: "1 year manufacturer" },
          { "@type": "PropertyValue", name: "LED Warranty", value: "1–3 years manufacturer" },
          { "@type": "PropertyValue", name: "Workmanship Warranty", value: "Not applicable" },
          { "@type": "PropertyValue", name: "Smart App + Voice + Music Sync", value: "Yes" },
          { "@type": "PropertyValue", name: "Matter / Apple Home", value: "Govee/Eufy only" },
          { "@type": "PropertyValue", name: "16M+ Colors", value: "Yes" },
          { "@type": "PropertyValue", name: "Custom Track Color Match", value: "Not applicable" },
          { "@type": "PropertyValue", name: "Smart Camera Integration", value: "Govee/Eufy only" },
          { "@type": "PropertyValue", name: "Professional Installation", value: "No" },
          { "@type": "PropertyValue", name: "Best Price Guarantee", value: "No" },
        ],
      },
    },
  ],
};

const Compare = () => {
  return (
    <main className="pt-20 bg-white">
      <SEO
        canonical="/compare"
        title="Compare: Lively vs Trimlight, Jellyfish, Gemstone, Oelo"
        description="Side-by-side comparison of PermTrack permanent outdoor lighting versus Trimlight, Jellyfish, Gemstone (Astoria), and Oelo on price, smart features, color, and warranty."
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(comparisonJsonLd)}
        </script>
      </Helmet>
      <ComparisonTable />
    </main>
  );
};

export default Compare;
