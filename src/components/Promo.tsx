import { Link } from "react-router-dom";
import { Booking } from "./Booking";

export const Promo = () => {
  return (
    <section id="promo" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative mb-16 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 2px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Content container */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="px-8 py-16 bg-gradient-to-b from-black/20 to-black/5 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto text-center">
                {/* Animated sparkles */}
                <div className="relative inline-block">
                  <span className="absolute -left-6 -top-6 animate-pulse">
                    ✨
                  </span>
                  <span
                    className="absolute -right-6 -top-6 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  >
                    ✨
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
                    Early Bird Special
                  </h2>
                  <span
                    className="absolute -left-4 -bottom-4 animate-pulse"
                    style={{ animationDelay: "0.75s" }}
                  >
                    ✨
                  </span>
                  <span
                    className="absolute -right-4 -bottom-4 animate-pulse"
                    style={{ animationDelay: "0.25s" }}
                  >
                    ✨
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
                  <p className="text-2xl text-white mb-2">
                    Book your installation between August-October
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
                    Save <span className="text-yellow-300">$500</span> on Your
                    Install
                  </p>
                </div>

                <Link
                  to="#booking"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-opacity-95 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
                  Limited Time Offer - Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Booking />
      </div>
    </section>
  );
};
