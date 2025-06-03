import { ArrowRight, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900/30 z-10"></div>
        <img
          loading="eager"
          fetchPriority="low"
          src="/images/House6.jpg"
          alt="Govee permanent outdoor lights PRO with permtrack"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-2xl relative">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-center font-semibold hover:bg-indigo-700 transition shadow-lg transform hover:scale-105 duration-200 w-full sm:w-auto"
            >
              Get Free Quote
            </Link>
            <a
              href="#difference"
              className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-sm text-white text-center font-semibold hover:bg-white/20 transition-colors flex items-center justify-center group w-full sm:w-auto"
            >
              Why Choose Us
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://www.youtube.com/channel/UChIr1JGEiGCqtX_2fl1gfNQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg bg-red-600/80 backdrop-blur-sm text-white text-center font-semibold hover:bg-red-700/80 transition-colors flex items-center justify-center group w-full sm:w-auto"
            >
              <Youtube className="mr-2 h-4 w-4" />
              As Seen on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
