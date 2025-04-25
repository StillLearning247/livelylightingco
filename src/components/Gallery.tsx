import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const TRANSITION_DURATION = 500;

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const galleryImages = [
    {
      url: "/images/House1.jpg",
      title: "Holiday Themed with Multi-Color Display",
    },
    {
      url: "/images/House2.jpg",
      title: "Contemporary Home with RGB Accents",
    },
    {
      url: "/images/House3.jpg",
      title: "Modern Home with Bright White",
    },
    {
      url: "/images/House4.jpg",
      title: "Mediterranean Style with Subtle Lighting",
    },
    {
      url: "/images/House5.jpg",
      title: "Ranch Home with Vibrant Perimeter Lighting",
    },
    {
      url: "/images/Ryan Blank Daytime.jpg",
      title: "Govee permanent outdoor lights PRO with permtrack",
    },
    {
      url: "/images/Daytime_Browntrack.jpg",
      title: "Govee permanent outdoor lights PRO with permtrack",
    },
  ];

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our gallery of beautiful lighting installations. Each project
            is custom designed to complement the home's architecture.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 shadow-xl">
            <div
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {galleryImages.map((image, index) => (
                <div key={index} className="flex-shrink-0 w-full h-full">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-medium mb-2 transition-opacity duration-300">
                {galleryImages[currentIndex].title}
              </h3>
              <p className="text-gray-200 transition-opacity duration-300">
                Click to view full size
              </p>
            </div>

            {/* Overlay button for full screen */}
            <button
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => setSelectedImage(galleryImages[currentIndex].url)}
              aria-label="View full size image"
            />

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
              disabled={isTransitioning}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Next image"
              disabled={isTransitioning}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center mt-6 gap-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-indigo-600 scale-110 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Modal for fullsize image view */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-7xl max-h-full">
              <button
                className="absolute -top-12 right-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="h-6 w-6 text-white" />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged view"
                loading="lazy"
                className="max-h-[85vh] max-w-full rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
