import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AdvancedImage, responsive } from "@cloudinary/react";
import cld from "../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";
import YouTubeLite from "./YouTubeLite";
import { usePageContent } from "../hooks/useContent";
import { EditableArea, contentEditPath } from "./EditableArea";
import { stripHtml } from "../lib/stripHtml";

type HeroProps = {
  adminMode?: boolean;
};

export const Hero: React.FC<HeroProps> = ({
  adminMode: _adminMode = false,
}) => {
  // Fetch content from database
  const { content } = usePageContent("home");

  // Get content from database with fallbacks (strip HTML tags from rich text)
  const heroTitle = stripHtml(
    content.hero_title || "Permanent Outdoor Lighting. Expertly Installed",
  );
  const heroSubtitle = stripHtml(
    content.hero_subtitle ||
      "Year-round custom lighting. No hassle or ugly wires. All controlled from your phone. Installed by Govee lighting experts.",
  );
  const heroImage = cld.image("House6_kmwq4e");
  heroImage
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width("1920").height("1080"));

  // Split title to accent the last word in cyan
  const titleWords = heroTitle.split(" ");
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(" ");

  return (
    // Center vertically on large screens; keep top-aligned on small
    <div className="relative min-h-screen flex lg:items-center items-start overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/70 via-surface-900/40 to-surface-950/80 z-10" />
        <AdvancedImage
          cldImg={heroImage}
          plugins={[responsive()]}
          alt="Govee permanent outdoor lights PRO with permtrack"
          className="w-full h-full object-cover object-center"
          fetchPriority="eager"
        />
      </div>

      {/* Content container */}
      <div className="container mx-auto px-6 relative z-20 pt-28 sm:pt-32 lg:pt-40 xl:pt-44">
        {/* Text + buttons (narrow, centered) */}
        <div className="w-full max-w-2xl mx-auto text-center">
          <EditableArea
            editPath={contentEditPath("home", "hero_title")}
            label="Hero Title"
          >
            <h1
              className="font-heading text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animation-fade-in"
              aria-label="Beautiful Permanent Outdoor Lighting For Your Home"
            >
              {titleMain} <span className="text-brand-300">{lastWord}</span>
            </h1>
          </EditableArea>

          <EditableArea
            editPath={contentEditPath("home", "hero_subtitle")}
            label="Hero Subtitle"
          >
            <p
              className="text-lg sm:text-xl text-surface-300 mb-8"
              aria-label="Year-round custom lighting controlled from your phone"
            >
              {heroSubtitle}
            </p>
          </EditableArea>

          <div className="flex flex-col sm:flex-row gap-4 sm:max-w-md w-full mx-auto sm:pb-6 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-md bg-accent-400 text-surface-900 text-center font-heading font-bold hover:bg-accent-500 transition shadow-lg transform hover:scale-105 duration-200"
            >
              Get a Free Quote
            </Link>

            <a
              href="#gallery"
              className="px-8 py-4 rounded-md border border-white/30 text-white text-center font-heading font-semibold hover:bg-white/10 transition-colors flex items-center justify-center group"
            >
              See Our Work
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Decorative gradient line above video */}
        <div className="w-full max-w-[min(960px,90vw)] mx-auto mt-8">
          <div className="h-px bg-brand-gradient-r w-full mb-4" />
        </div>

        {/* Wider video row (separate, centered) */}
        <div className="w-full mx-auto flex justify-center">
          <div className="w-full max-w-[min(960px,90vw)]">
            <YouTubeLite
              id="Q-BZ2rjHZgE"
              title="Lively Lighting Co — Featured Install"
              ratio="16 / 9"
              className="w-full mt-1 mb-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
