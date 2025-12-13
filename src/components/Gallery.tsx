import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  StackedCarousel,
  ResponsiveContainer,
} from "react-stacked-center-carousel";
import { AdvancedImage } from "@cloudinary/react";
import cld from "../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";
import ModalPortal from "./ModalPortal";
import { useGallery } from "../hooks/useGallery";
import { usePageContent } from "../hooks/useContent";
import { EditableArea, contentEditPath } from "./EditableArea";
import { stripHtml } from "../lib/stripHtml";

type GalleryProps = {
  /** Enables admin-only UI in the gallery (optional) */
  adminMode?: boolean;
};

// Define the type for gallery images (for carousel)
interface GalleryImageDisplay {
  publicId: string;
  title: string;
  hiResUrl: string;
}

const Slide = ({
  data,
  dataIndex,
  setSelectedImage,
}: {
  data: GalleryImageDisplay[];
  dataIndex: number;
  setSelectedImage: (url: string) => void;
}) => {
  const { publicId, title, hiResUrl } = data[dataIndex];
  const img = cld.image(publicId);
  img
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(800).height(450));

  const hiResImg = cld.image(hiResUrl);
  hiResImg
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(2400).height(1350));

  return (
    <div
      className="relative w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer"
      onClick={() => setSelectedImage(hiResImg.toURL())}
    >
      <div className="relative w-full h-full aspect-[16/9]">
        <AdvancedImage
          cldImg={img}
          alt={title}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute bottom-0 inset-x-0 p-6 text-left bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-base md:text-xl font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({
  adminMode: _adminMode = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [centerIndex, setCenterIndex] = useState(0); // ← track active slide
  const ref = React.useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Fetch gallery images and content from database
  const { images, loading: imagesLoading } = useGallery();
  const { content, loading: contentLoading } = usePageContent("home");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optional: keyboard nav (←/→)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") ref.current?.goBack();
      if (e.key === "ArrowRight") ref.current?.goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Transform database images to carousel format
  const galleryImages: GalleryImageDisplay[] = images.map((img) => ({
    publicId: img.cloudinary_public_id,
    title: img.title || "",
    hiResUrl: img.cloudinary_hires_id || img.cloudinary_public_id,
  }));

  // Get content from database with fallbacks (strip HTML tags)
  const galleryTitle = stripHtml(content.gallery_title || "Our Work");
  const galleryDescription = stripHtml(content.gallery_description || "Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home's architecture.");

  // Show loading state while fetching
  if (imagesLoading || contentLoading || galleryImages.length === 0) {
    return (
      <section id="gallery" className="py-12 bg-white overflow-hidden">
        <div className="text-center py-20">
          <Loader2 className="h-10 w-10 text-gray-400 animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-12 bg-white overflow-hidden">
      <div className="px-0 md:px-4">
        <div className="text-center mb-16">
          <EditableArea
            editPath={contentEditPath("home", "gallery_title")}
            label="Gallery Title"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{galleryTitle}</h2>
          </EditableArea>
          <EditableArea
            editPath={contentEditPath("home", "gallery_description")}
            label="Gallery Description"
          >
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {galleryDescription}
            </p>
          </EditableArea>
        </div>

        <EditableArea editPath="/admin/gallery" label="Gallery Images">
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
                  disableSwipe={isMobile}
                  transitionSpeed={8}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  customScales={[1, 0.9, 0.8, 0.7]}
                  transitionTime={450}
                  onActiveSlideChange={setCenterIndex} // ← update active index
                />
              )}
            />
          </div>

          {/* Control bar: chevrons + dots */}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => ref.current?.goBack()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gray-300 text-gray-800 bg-white hover:bg-gray-50 hover:ring-gray-400 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {galleryImages.map((_, i) => {
                const active = i === centerIndex;
                return (
                  <button
                    key={`gallery-dot-${i}`}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => ref.current?.goTo(i)}
                    className={[
                      "h-2.5 rounded-full transition-all",
                      active
                        ? "w-6 bg-gray-900"
                        : "w-2.5 bg-gray-400/60 hover:bg-gray-500/80",
                    ].join(" ")}
                  />
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => ref.current?.goNext()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gray-300 text-gray-800 bg-white hover:bg-gray-50 hover:ring-gray-400 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </div>
        </EditableArea>

        {selectedImage && (
          <ModalPortal>
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
              onClick={() => {
                setSelectedImage(null);
                setImageLoading(true);
              }}
            >
              <div
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute -top-12 right-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageLoading(true);
                  }}
                  aria-label="Close image"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                  </div>
                )}

                <img
                  src={selectedImage}
                  alt="Enlarged view"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
            </div>
          </ModalPortal>
        )}
      </div>
    </section>
  );
};
