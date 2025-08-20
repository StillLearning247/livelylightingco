import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Jennifer S.",
      location: "Austin, TX",
      quote:
        "LivelyLightingCo transformed our home! The install was quick and professional – and we love controlling the lights with our phone. Our neighbors keep asking where we got our lights done.",
      rating: 5,
    },
    {
      name: "Michael T.",
      location: "Round Rock, TX",
      quote:
        "Jakob and his team were fantastic from start to finish. No more climbing ladders for holidays! The lights look clean and professional during the day and absolutely stunning at night.",
      rating: 5,
    },
    {
      name: "Sarah & David",
      location: "Cedar Park, TX",
      quote:
        "We tried installing Govee lights ourselves first and it was a disaster. LivelyLightingCo fixed everything and installed them properly with their track system. Worth every penny!",
      rating: 5,
    },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = (i: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    const len = testimonials.length;
    setIndex(((i % len) + len) % len); // safe modulo
  };

  const next = () => goTo(index + 1, 1);
  const prev = () => goTo(index - 1, -1);

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

  const active = testimonials[index];

  // Framer Motion variants for slide/fade
  const variants = {
    enter: (dir: 1 | -1) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
  };

  return (
    <section className="py-20 bg-indigo-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what homeowners think about
            our service.
          </p>
        </div>

        <div
          className="max-w-4xl mx-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Card with animated content */}
          <div className="relative bg-indigo-800 rounded-2xl shadow-xl p-8 md:p-10 min-h-[260px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
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
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-lg italic mb-6">"{active.quote}"</p>

                <div>
                  <p className="font-semibold">{active.name}</p>
                  <p className="text-indigo-300">{active.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Control bar: chevrons + dots (like gallery) */}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={prev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/30 text-white bg-white/10 hover:bg-white/15 hover:ring-white/50 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    className={[
                      "h-2.5 rounded-full transition-all",
                      isActive
                        ? "w-6 bg-white"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/30 text-white bg-white/10 hover:bg-white/15 hover:ring-white/50 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
