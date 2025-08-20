import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X } from "lucide-react";

/**
 * FloatingBanner
 * — A chic, animated floating banner for React + Tailwind
 *
 * Props
 *  - message: string | ReactNode — banner text/content
 *  - href?: string — optional link (turns message into an anchor)
 *  - onClose?: () => void — close handler (shows an X button if provided)
 *  - variant?: "marquee" | "slide" | "static" — animation style
 *  - tone?: "brand" | "success" | "warning" | "info" — colorway
 *  - icon?: ReactNode — optional leading icon (defaults to Megaphone)
 *  - duration?: number — marquee loop duration (ms)
 *  - className?: string — extra classes
 *  - stickyTop?: string — override top offset (e.g., "top-6")
 */

const tones = {
  brand:
    "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white",
  success:
    "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white",
  warning:
    "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white",
  info: "bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 text-white",
};

const baseShell =
  "fixed left-4 right-4 z-50 drop-shadow-2xl pointer-events-auto";

const cardBase =
  "relative rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/10";

type FloatingBannerProps = {
  message?: string | React.ReactNode;
  href?: string;
  onClose?: () => void;
  variant?: "marquee" | "slide" | "static";
  tone?: "brand" | "success" | "warning" | "info";
  icon?: React.ReactNode;
  duration?: number;
  className?: string;
  stickyTop?: string;
};

export default function FloatingBanner({
  message = "This is a floating banner!",
  href,
  onClose,
  variant = "marquee",
  tone = "brand",
  icon,
  duration = 14000,
  stickyTop = "top-16",
  className = "",
}: FloatingBannerProps) {
  const hasClose = typeof onClose === "function";
  const Icon = icon ?? <Megaphone className="h-5 w-5 shrink-0" aria-hidden />;

  // Variants for entrance/exit
  const containerVariants = {
    initial: { y: -24, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, damping: 22, stiffness: 240 },
    },
    exit: { y: -16, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`${baseShell} ${stickyTop} ${className}`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        role="region"
        aria-live="polite"
      >
        <div className={`${cardBase} ${tones[tone]}`}>
          {/* Frosted glass sheen */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(1200px_400px_at_-20%_-40%,white,transparent)]" />

          {/* Content wrapper for padding and layout */}
          <div className="relative flex items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 w-full">
              <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-1.5">
                {Icon}
              </span>

              {variant === "marquee" ? (
                <Marquee duration={duration}>
                  <BannerText href={href}>{message}</BannerText>
                </Marquee>
              ) : (
                <motion.div
                  className="min-w-0 flex-1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.25 }}
                >
                  <BannerText href={href}>{message}</BannerText>
                </motion.div>
              )}
            </div>

            {hasClose && (
              <button
                onClick={onClose}
                aria-label="Dismiss banner"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Slide underline accent for non-marquee variant */}
          {variant !== "marquee" && (
            <motion.div
              className="h-1 w-full bg-white/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          )}
        </div>

        {/* Local styles for marquee keyframes */}
        <style>{`
          @keyframes banner-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-mask { mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent); }
          .marquee-track { display: flex; width: max-content; animation: banner-marquee var(--marquee-duration, 14s) linear infinite; }
          .marquee-paused { animation-play-state: paused; }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

function BannerText({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const content = (
    <span className="block text-sm sm:text-base font-medium tracking-wide leading-none">
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className="inline-flex max-w-full items-center gap-2 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        {content}
      </a>
    );
  }
  return content;
}

function Marquee({
  children,
  duration = 14000,
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  // Render two copies for seamless loop
  return (
    <div
      className="group relative flex-1 overflow-hidden marquee-mask"
      style={
        { "--marquee-duration": `${duration}ms` } as React.CSSProperties &
          Record<string, any>
      }
    >
      <div className="marquee-track group-hover:marquee-paused">
        <div className="flex items-center gap-4 pr-4">
          {children}
          <Dot />
          {children}
          <Dot />
          {children}
          <Dot />
        </div>
        {/* Duplicate set for continuous loop */}
        <div className="flex items-center gap-4 pr-4">
          {children}
          <Dot />
          {children}
          <Dot />
          {children}
          <Dot />
        </div>
      </div>
    </div>
  );
}

const Dot = () => (
  <span className="mx-1 h-1.5 w-1.5 rounded-full bg-white/70 inline-block" />
);

/*
Usage examples:

<FloatingBanner message="Summer sale — 25% off sitewide. Use code SUN25." />

<FloatingBanner
  variant="slide"
  tone="info"
  message={<>
    Heads up: We'll have maintenance on Friday, Aug 22, 2–3am CT.
  </>}
  href="/status"
  onClose={() => setOpen(false)}
/>

<FloatingBanner
  variant="marquee"
  tone="warning"
  duration={12000}
  message={<>New features rolling out weekly • Try the Beta Dashboard • Tell us what you think</>}
/>
*/
