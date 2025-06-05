import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  StackedCarousel,
  ResponsiveContainer,
} from "react-stacked-center-carousel";

// Optional type definition for gallery images
interface GalleryImage {
  url: string;
  title: string;
}

const Slide = ({
  data,
  dataIndex,
  setSelectedImage,
}: {
  data: GalleryImage[];
  dataIndex: number;
  setSelectedImage: (url: string) => void;
}) => {
  const { url, title } = data[dataIndex];
  return (
    <div
      className="relative w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer"
      onClick={() => setSelectedImage(url)}
    >
      <div className="relative w-full h-full aspect-[16/9]">
        <img
          src={url}
          alt={title}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300"
          draggable={false}
        />
        <div className="absolute bottom-0 inset-x-0 p-6 text-left bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-base md:text-xl font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
};

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [centerSlideIndex, setCenterSlideIndex] = useState(0);
  const ref = React.useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const galleryImages: GalleryImage[] = [
    {
      url: "/images/House6_png800.png",
      title: "",
    },
    {
      url: "/images/House6_png800.png",
      title: "",
    },
    {
      url: "/images/House6_png800.png",
      title: "",
    },
    {
      url: "/images/House6_png800.png",
      title: "",
    },
    {
      url: "/images/House6_png800.png",
      title: "",
    },
    {
      url: "/images/House6_png800.png",
      title: "",
    },
  ];

  return (
    <section id="gallery" className="py-12 bg-white overflow-hidden">
      <div className="px-0 md:px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our gallery of beautiful lighting installations. Each project
            is custom designed to complement the home's architecture.
          </p>
        </div>

        <div className="relative w-full">
          <div className="relative bg-gray-100">
            <ResponsiveContainer
              carouselRef={ref}
              render={(width: number, carouselRef: React.Ref<any>) => (
                <StackedCarousel
                  ref={carouselRef}
                  slideComponent={(props: {
                    data: any[];
                    dataIndex: number;
                  }) => (
                    <Slide {...props} setSelectedImage={setSelectedImage} />
                  )}
                  slideWidth={600}
                  carouselWidth={width}
                  data={galleryImages}
                  maxVisibleSlide={5}
                  swipeThreshold={0}
                  disableSwipe={isMobile} /* 👈 disables swipe on mobile */
                  transitionSpeed={8}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  customScales={[1, 0.9, 0.8, 0.7]}
                  transitionTime={450}
                  onActiveSlideChange={setCenterSlideIndex}
                />
              )}
            />

            <button
              onClick={() => ref.current?.goBack()}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => ref.current?.goNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
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
                className={`max-h-auto w-full object-contain rounded-lg shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
