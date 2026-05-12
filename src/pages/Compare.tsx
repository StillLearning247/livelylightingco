import { ComparisonTable } from "../components/ComparisonTable";
import { SEO } from "../components/SEO";

const Compare = () => {
  return (
    <main className="pt-20 bg-white">
      <SEO
        canonical="/compare"
        title="Compare Permanent Outdoor Lighting | Lively vs Trimlight, Jellyfish, Gemstone, Oelo"
        description="Honest side-by-side comparison of permanent outdoor lighting systems. See how Lively + PermTrack — paired with premium Govee, Asahom, Eufy, or Enbrighten LEDs — compares to Trimlight, Jellyfish, Gemstone (Astoria), Oelo, and DIY kits on price, smart features, exact color match, and warranty. Lifetime PermTrack warranty + 5-year install warranty."
      />
      <ComparisonTable />
    </main>
  );
};

export default Compare;
