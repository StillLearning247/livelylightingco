import { ArrowRight, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { AdvancedImage, responsive } from "@cloudinary/react";
import cld from "../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";
import YouTubeLite from "./YouTubeLite";

export const Hero = () => {
  const heroImage = cld.image("House6_kmwq4e");
  heroImage
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width("1920").height("1080"));

  return (
    // Center vertically on large screens; keep top-aligned on small
    <div className="relative min-h-screen flex lg:items-center items-start overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900/30 z-10" />
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
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animation-fade-in"
            aria-label="Beautiful Permanent Outdoor Lighting For Your Home"
          >
            Govee Permanent Outdoor Lighting. Expertly Installed
          </h1>

          <p
            className="text-xl text-gray-200 mb-8"
            aria-label="Year-round custom lighting controlled from your phone"
          >
            Year-round custom lighting. No hassle or ugly wires. All controlled
            from your phone. Installed by Govee lighting experts.
          </p>

          <div className="flex flex-col gap-4 sm:max-w-md w-full mx-auto sm:pb-6">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-center font-semibold hover:bg-indigo-700 transition shadow-lg transform hover:scale-105 duration-200 w-full"
            >
              Free Quote/Contact
            </Link>

            <a
              href="#difference"
              className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-sm text-white text-center font-semibold hover:bg-white/20 transition-colors flex items-center justify-center group w-full"
            >
              Why Choose Us
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://www.youtube.com/channel/UChIr1JGEiGCqtX_2fl1gfNQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg bg-red-600/80 backdrop-blur-sm text-white text-center font-semibold hover:bg-red-700/80 transition-colors flex items-center justify-center group w-full"
            >
              <Youtube className="mr-2 h-4 w-4" />
              As Seen on YouTube
            </a>
          </div>
        </div>

        {/* Wider video row (separate, centered) */}
        <div className="w-full mx-auto mt-6 sm:mt-8 flex justify-center">
          <div className="w-full max-w-[min(1280px,92vw)]">
            <YouTubeLite
              id="Q-BZ2rjHZgE"
              title="Lively Lighting Co — Featured Install"
              ratio="16 / 9"
              className="w-full mt-1 mb-8" // ← reduced bottom margin
            />
          </div>
        </div>
      </div>
    </div>
  );
};
