import React from "react";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Promo Banner */}
      <div className="absolute top-20 left-0 right-0 z-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
            <div
              className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => {
                const promoSection = document.querySelector(
                  "#contact .bg-gradient-to-r"
                );
                promoSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-white text-lg font-semibold">
                    🎉 Early Bird Special: $500 OFF
                  </span>
                </div>
                <div className="text-white/80 text-sm">Click to learn more</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-indigo-900/70 z-10"></div>
        <img
          loading="eager"
          fetchPriority="high"
          src="/images/House4.jpg"
          alt="Beautiful home with outdoor lighting"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-2xl">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animation-fade-in"
            aria-label="Beautiful Permanent Outdoor Lighting For Your Home"
          >
            Beautiful Permanent Outdoor Lighting For Your Home
          </h1>
          <p
            className="text-xl text-gray-200 mb-8"
            aria-label="Year-round custom lighting controlled from your phone"
          >
            Year-round custom lighting. No hassle or ugly wires. All controlled
            from your phone. Installed by Govee lighting experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-center font-semibold hover:bg-indigo-700 transition-colors shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              Book a Free Consultation
            </a>
            <a
              href="#difference"
              className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-sm text-white text-center font-semibold hover:bg-white/20 transition-colors flex items-center justify-center group"
            >
              Why Choose Us
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <span className="text-white/70 text-sm font-medium tracking-wide">
          Scroll down to explore
        </span>
        <div className="h-12 w-[2px] bg-white/30 rounded-full relative overflow-hidden">
          <div className="h-1/2 w-full bg-white absolute top-0 animate-scroll-down"></div>
        </div>
      </div>
    </div>
  );
};
