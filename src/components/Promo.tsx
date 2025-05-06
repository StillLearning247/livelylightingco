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
                    Save <span className="text-yellow-300">$300</span> on Your
                    Install
                  </p>
                  <p className="text-xl text-white/90 mt-4">
                    -Limited Time Offer-
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
