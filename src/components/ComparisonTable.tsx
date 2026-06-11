import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, Minus } from "lucide-react";
import { Link } from "react-router-dom";

type Cell = boolean | "limited" | string;

interface Competitor {
  name: string;
  tagline: string;
  highlight?: boolean;
}

interface FeatureRow {
  label: string;
  description?: string;
  values: Cell[];
}

const COMPETITORS: Competitor[] = [
  { name: "Lively + PermTrack", tagline: "Govee, Asahom, Eufy or Enbrighten — premium install", highlight: true },
  { name: "Trimlight", tagline: "Legacy permanent lighting" },
  { name: "Jellyfish", tagline: "Eave-mounted system" },
  { name: "Gemstone / Astoria", tagline: "Premium-priced track system" },
  { name: "Oelo", tagline: "Permanent LED system" },
  { name: "DIY Install", tagline: "Self-install consumer kit" },
];

const FEATURES: FeatureRow[] = [
  {
    label: "LED Brand Choice",
    description: "Pick the system that fits your home, budget, and smart-home setup",
    values: ["4 brands", "Trimlight only", "Jellyfish only", "Gemstone only", "Oelo only", "Buy any"],
  },
  {
    label: "Track / Hardware Warranty",
    description: "Coverage on the mounting track and components",
    values: ["Lifetime PermTrack", "Lifetime†", "5-Year parts†", "10-Year parts†", "5–7 Years*†", "1 yr (mfr)"],
  },
  {
    label: "LED Warranty",
    description: "Coverage on the LED bulbs themselves",
    values: ["Per brand mfr**", "Lifetime LEDs†", "5-Year parts†", "Lifetime LEDs†", "5–7 Years*†", "1–3 Years (mfr)"],
  },
  {
    label: "Workmanship Warranty",
    description: "Coverage on every clip, connection, and run we install",
    values: ["5 Years", "1 Year", "1 Year", "3 Years", "5–7 Years*", false],
  },
  {
    label: "Smart App + Voice + Music Sync",
    description: "Wi-Fi app, Alexa/Google, music-reactive scenes — industry standard now",
    values: [true, true, true, true, true, true],
  },
  {
    label: "Matter / Apple Home",
    description: "Native Matter protocol — works in Apple Home, full smart-home interop",
    values: [true, false, false, false, false, "Govee/Eufy"],
  },
  {
    label: "16M+ Colors",
    description: "Full color spectrum vs preset palettes",
    values: [true, true, true, true, true, true],
  },
  {
    label: "Custom Track Color Match",
    description: "How well the track blends with your trim",
    values: ["Perfect Home Color Paint Match", "50+ stock colors", "Trim-matched track", "151+ stock + hex codes", "Standard colors", "N/A"],
  },
  {
    label: "Smart Camera Integration",
    description: "Lights respond to security cameras (motion, alerts)",
    values: ["Via Eufy", false, false, false, false, "Via Eufy"],
  },
  {
    label: "Professional Installation",
    description: "Trained installers, weatherproofing, planning",
    values: [true, true, true, true, true, false],
  },
  {
    label: "Best Price Guarantee",
    description: "We beat any written competitor quote",
    values: [true, false, false, false, false, false],
  },
];

const renderCell = (value: Cell, isHighlight: boolean) => {
  const baseTextClass = isHighlight ? "text-surface-900 font-semibold" : "text-surface-700";

  if (value === true) {
    return (
      <Check
        className={`h-5 w-5 mx-auto ${isHighlight ? "text-brand-500" : "text-brand-400"}`}
        aria-label="Yes"
      />
    );
  }
  if (value === false) {
    return (
      <X className="h-5 w-5 mx-auto text-surface-300" aria-label="No" />
    );
  }
  if (value === "limited") {
    return (
      <Minus
        className="h-5 w-5 mx-auto text-amber-500"
        aria-label="Limited"
      />
    );
  }
  return <span className={`text-sm ${baseTextClass}`}>{value}</span>;
};

export const ComparisonTable = () => {
  return (
    <section className="py-20 bg-surface-50 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-surface-900 mb-4">
            How Lively + PermTrack stacks up
          </h1>
          <p className="text-lg text-surface-500">
            We pair your choice of premium smart LEDs — Govee, Asahom, Eufy, or
            Enbrighten — with our PermTrack mounting system, a lifetime hardware
            warranty on PermTrack, and an industry-leading 5-year workmanship
            warranty on every install.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-2 bg-brand-gradient rounded-2xl blur opacity-10" />
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-surface-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left p-5 bg-surface-50 w-1/4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                        Feature
                      </span>
                    </th>
                    {COMPETITORS.map((c) => (
                      <th
                        key={c.name}
                        className={`text-center p-5 ${
                          c.highlight
                            ? "bg-brand-gradient text-white relative"
                            : "bg-surface-50"
                        }`}
                      >
                        {c.highlight && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent-400 text-surface-900 text-[10px] font-bold uppercase tracking-wider rounded-full">
                            Best Value
                          </div>
                        )}
                        <div
                          className={`font-heading font-bold text-sm mt-2 ${
                            c.highlight ? "text-white" : "text-surface-900"
                          }`}
                        >
                          {c.name}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            c.highlight ? "text-white/80" : "text-surface-500"
                          }`}
                        >
                          {c.tagline}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((row, rowIdx) => (
                    <tr
                      key={row.label}
                      className={
                        rowIdx % 2 === 0 ? "bg-white" : "bg-surface-50/50"
                      }
                    >
                      <td className="p-5 align-top">
                        <div className="font-medium text-surface-900 text-sm">
                          {row.label}
                        </div>
                        {row.description && (
                          <div className="text-xs text-surface-500 mt-1">
                            {row.description}
                          </div>
                        )}
                      </td>
                      {row.values.map((value, idx) => (
                        <td
                          key={idx}
                          className={`text-center p-5 align-middle ${
                            COMPETITORS[idx].highlight
                              ? "bg-brand-50/60"
                              : ""
                          }`}
                        >
                          {renderCell(value, COMPETITORS[idx].highlight ?? false)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: sticky Lively + swipable competitor */}
        <div className="lg:hidden max-w-2xl mx-auto">
          <MobileCompare competitors={COMPETITORS} features={FEATURES} />
        </div>

        {/* Legend */}
        <div className="max-w-2xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-surface-500">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand-400" />
            Included
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-surface-300" />
            Not offered
          </div>
        </div>

        {/* Footnotes */}
        <div className="max-w-3xl mx-auto mt-6 text-xs text-surface-500 leading-relaxed space-y-2">
          <p>
            <strong>*Oelo install warranty</strong> is 7 years for Authorized,
            Preferred, and Platinum Dealer installs; 5 years for Contractor and
            DIY installs. Year 1 is full system; years 2+ are component-only.
          </p>
          <p>
            <strong>**LED warranty for Lively installs</strong> is provided by
            the LED brand manufacturer at time of purchase: Govee 3yr, Asahom
            3yr, Eufy 2yr, Enbrighten lifetime LEDs.
          </p>
          <p>
            <strong>†Trimlight, Jellyfish, Gemstone, and Oelo</strong> bundle
            their track and LED coverage under a single warranty term. The
            same warranty length applies to both rows for these brands; we've
            split them out to show how Lively's PermTrack lifetime hardware
            warranty compares apples-to-apples.
          </p>
          <p>
            Comparison data based on each manufacturer's published warranty and
            spec sheets as of 2026. Verify current terms with each provider
            before purchase.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="px-8 py-4 rounded-md bg-accent-400 text-surface-900 font-heading font-bold hover:bg-accent-500 transition-colors shadow-lg"
          >
            Get a Free Quote
          </Link>
          <p className="text-sm text-surface-500">
            We'll beat any written competitor quote — guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
};

interface MobileCompareProps {
  competitors: Competitor[];
  features: FeatureRow[];
}

const SWIPE_THRESHOLD_RATIO = 0.2; // 20% of viewport width
const SNAP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // ease-out quart — crisp settle
const SNAP_DURATION_MS = 360;

const MobileCompare = ({ competitors, features }: MobileCompareProps) => {
  const livelyIdx = useMemo(
    () => Math.max(0, competitors.findIndex((c) => c.highlight)),
    [competitors]
  );
  const lively = competitors[livelyIdx];

  const others = useMemo(
    () =>
      competitors
        .map((c, idx) => ({ competitor: c, idx }))
        .filter(({ idx }) => idx !== livelyIdx),
    [competitors, livelyIdx]
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [teaseActive, setTeaseActive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fire the swipe-tease animation the first time the card scrolls into view.
  useEffect(() => {
    if (hasInteracted) return;
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setTeaseActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.4] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasInteracted]);

  const markInteracted = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (teaseActive) setTeaseActive(false);
  };

  if (others.length === 0) return null;

  const lastIdx = others.length - 1;

  // Rubber-band at boundaries so it feels like there's resistance, not a wall.
  const dampOffset = (dx: number) => {
    if (activeIdx === 0 && dx > 0) return dx * 0.35;
    if (activeIdx === lastIdx && dx < 0) return dx * 0.35;
    return dx;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    markInteracted();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    setDragOffsetPx(dampOffset(dx));
  };

  const handleTouchEnd = () => {
    const width = viewportRef.current?.offsetWidth ?? 1;
    const threshold = width * SWIPE_THRESHOLD_RATIO;
    const dx = dragOffsetPx;

    if (dx < -threshold && activeIdx < lastIdx) {
      setActiveIdx((i) => i + 1);
    } else if (dx > threshold && activeIdx > 0) {
      setActiveIdx((i) => i - 1);
    }
    touchStartX.current = null;
    setDragOffsetPx(0);
    setIsDragging(false);
  };

  // Shared track transform — every viewport's track reads this.
  const trackStyle: React.CSSProperties = {
    transform: `translate3d(calc(${-activeIdx * 100}% + ${dragOffsetPx}px), 0, 0)`,
    transition: isDragging ? "none" : `transform ${SNAP_DURATION_MS}ms ${SNAP_EASE}`,
    willChange: "transform",
  };

  return (
    <div>
      {/* Competitor chip selector */}
      <div className="mb-4">
        <div className="text-xs font-medium uppercase tracking-wider text-surface-500 mb-2">
          Compare against
        </div>
        <div className="flex flex-wrap gap-2">
          {others.map(({ competitor }, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={competitor.name}
                onClick={() => {
                  markInteracted();
                  setActiveIdx(i);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-surface-900 text-white border-surface-900"
                    : "bg-white text-surface-700 border-surface-200 hover:border-surface-300"
                }`}
                aria-pressed={isActive}
              >
                {competitor.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison card */}
      <div
        ref={cardRef}
        className="relative bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden select-none"
        style={{ touchAction: "pan-y" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Header row: Lively (fixed) | Competitor viewport (sliding track) */}
        <div className="grid grid-cols-2">
          <div className="relative bg-brand-gradient text-white p-3 sm:p-4 text-center min-w-0">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent-400 text-surface-900 text-[9px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap">
              Best Value
            </div>
            <div className="font-heading font-bold text-xs sm:text-sm mt-3 break-words leading-tight">
              {lively.name}
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/85 mt-0.5 line-clamp-2 break-words">
              {lively.tagline}
            </div>
          </div>
          <div ref={viewportRef} className="overflow-hidden bg-surface-50 min-w-0">
            <div className={teaseActive ? "animate-swipe-tease" : ""}>
              <div className="flex" style={trackStyle}>
                {others.map(({ competitor }) => (
                  <div
                    key={competitor.name}
                    className="min-w-full flex-shrink-0 p-3 sm:p-4 text-center"
                  >
                    <div className="font-heading font-bold text-xs sm:text-sm text-surface-900 mt-3 break-words leading-tight">
                      {competitor.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-surface-500 mt-0.5 line-clamp-2 break-words">
                      {competitor.tagline}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature rows */}
        <div className="divide-y divide-surface-100">
          {features.map((row) => (
            <div key={row.label} className="px-3 sm:px-4 pt-3 pb-4">
              <div className="text-[11px] uppercase tracking-wide text-surface-500 font-medium break-words">
                {row.label}
              </div>
              {row.description && (
                <div className="text-[10px] text-surface-400 mt-0.5 leading-snug break-words">
                  {row.description}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                <div className="rounded-lg bg-brand-50/60 px-2 sm:px-3 py-2 text-center min-h-[44px] min-w-0 flex items-center justify-center break-words">
                  {renderCell(row.values[livelyIdx], true)}
                </div>
                <div className="overflow-hidden rounded-lg bg-surface-50 min-w-0">
                  <div className={teaseActive ? "animate-swipe-tease" : ""}>
                    <div className="flex" style={trackStyle}>
                      {others.map(({ competitor, idx }) => (
                        <div
                          key={competitor.name}
                          className="min-w-full flex-shrink-0 px-2 sm:px-3 py-2 text-center min-h-[44px] flex items-center justify-center break-words"
                        >
                          {renderCell(row.values[idx], false)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {others.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              markInteracted();
              setActiveIdx(i);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIdx
                ? "w-6 bg-brand-500"
                : "w-2 bg-surface-300 hover:bg-surface-400"
            }`}
            aria-label={`Show competitor ${i + 1} of ${others.length}`}
          />
        ))}
      </div>

      <div className="text-center text-xs text-surface-400 mt-2">
        Swipe to compare other brands
      </div>
    </div>
  );
};
