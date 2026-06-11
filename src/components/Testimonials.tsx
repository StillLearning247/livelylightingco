import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTestimonials } from "../hooks/useTestimonials";
import { usePageContent } from "../hooks/useContent";
import { EditableArea, contentEditPath } from "./EditableArea";
import { stripHtml } from "../lib/stripHtml";

export const Testimonials = () => {
  // Fetch testimonials and content from database
  const { testimonials, loading: testimonialsLoading } = useTestimonials();
  const { content, loading: contentLoading } = usePageContent("home");

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const len = testimonials.length;
  // The global keydown listener below fires ArrowLeft/ArrowRight even while
  // testimonials are still loading (len 0) — e.g. when the gallery lightbox is
  // open. That previously made goTo compute a NaN index and crash on
  // `active.rating`. safeIndex always resolves to a real item once data exists.
  const safeIndex =
    Number.isInteger(index) && index >= 0 && index < len ? index : 0;

  const goTo = (i: number, dir: 1 | -1 = 1) => {
    if (len === 0) return; // nothing to navigate yet — avoids a NaN index
    setDirection(dir);
    setIndex(((i % len) + len) % len); // safe modulo
  };

  const next = () => goTo(safeIndex + 1, 1);
  const prev = () => goTo(safeIndex - 1, -1);

  // Keyboard nav: ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]); // eslint-disable-line

  // Simple swipe for mobile
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40; // px
    if (delta > threshold) prev();
    if (delta < -threshold) next();
    touchStartX.current = null;
  };

  // Get content from database with fallbacks (strip HTML tags)
  const testimonialsTitle = stripHtml(content.testimonials_title || "What Our Customers Say");
  const testimonialsDescription = stripHtml(content.testimonials_description || "Don't just take our word for it. Here's what homeowners think about our service.");

  // Framer Motion variants for slide/fade
  const variants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
  };

  // Show loading state while fetching
  if (testimonialsLoading || contentLoading || testimonials.length === 0) {
    return (
      <section className="py-20 bg-surface-950 text-white">
        <div className="text-center py-20">
          <Loader2 className="h-10 w-10 text-surface-400 animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  const active = testimonials[safeIndex];

  // Calculate aggregate rating for structured data
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "5.0";

  // Generate AggregateRating schema
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://livelylightingco.com/#business",
    "name": "LivelyLightingCo",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": t.quote
    }))
  };

  return (
    <section className="py-20 bg-surface-950 text-white">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(reviewSchema)}
        </script>
      </Helmet>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Gradient accent line */}
          <div className="w-16 h-1 bg-brand-gradient-r mx-auto mb-6 rounded-full" />
          <EditableArea
            editPath={contentEditPath("home", "testimonials_title")}
            label="Testimonials Title"
          >
            <h2 className="font-heading text-3xl font-bold mb-4">{testimonialsTitle}</h2>
          </EditableArea>
          <EditableArea
            editPath={contentEditPath("home", "testimonials_description")}
            label="Testimonials Description"
          >
            <p className="text-xl text-surface-400 max-w-3xl mx-auto">
              {testimonialsDescription}
            </p>
          </EditableArea>
        </div>

        <EditableArea editPath="/admin/testimonials" label="Testimonials">
          <div
            className="max-w-4xl mx-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Decorative gradient glow blob */}
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-gradient rounded-3xl blur-2xl opacity-10" />

              {/* Frosted glass card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl p-8 md:p-10 min-h-[260px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={safeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="flex mb-4">
                    {[...Array(active.rating)].map((_, i) => (
                      <Star
                        key={`star-${i}`}
                        className="w-5 h-5 text-accent-400 fill-accent-400"
                      />
                    ))}
                  </div>

                  <p className="text-lg italic mb-6 text-surface-200">"{active.quote}"</p>

                  <div>
                    <p className="font-semibold text-white">{active.name}</p>
                    <p className="text-brand-300">{active.location}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            </div>

          {/* Control bar: chevrons + dots */}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={prev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/20 text-white bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:ring-white/30 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => {
                const isActive = i === safeIndex;
                return (
                  <button
                    key={`testimonial-dot-${i}`}
                    type="button"
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    className={[
                      "h-2.5 rounded-full transition-all",
                      isActive
                        ? "w-6 bg-brand-300"
                        : "w-2.5 bg-white/30 hover:bg-white/50",
                    ].join(" ")}
                  />
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={next}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/20 text-white bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:ring-white/30 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </div>
        </EditableArea>
      </div>
    </section>
  );
};
