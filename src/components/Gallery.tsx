import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const TRANSITION_DURATION = 500;

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  function setCurrentIndex(_index: number): void {
    throw new Error("Function not implemented.");
  }

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
          <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-xl">
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={true}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              transitionTime={TRANSITION_DURATION}
              stopOnHover={true}
              swipeable={true}
              emulateTouch={true}
              dynamicHeight={false}
              className="carousel-container"
            >
              {galleryImages.map((image, index) => (
                <div key={index} className="relative aspect-[16/9]">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    onClick={() => setSelectedImage(image.url)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-left bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xl font-medium">
                      {image.title}
                    </p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
          {/* Thumbnail navigation */}
          <div className="flex justify-center mt-6 gap-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-2 rounded-full transition-all duration-300 ${
                  index === 0
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
