import React, { useState, useEffect, useCallback } from "react";
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
  onSelect,
}: {
  data: GalleryImageDisplay[];
  dataIndex: number;
  onSelect: (index: number) => void;
}) => {
  const { publicId, title } = data[dataIndex];
  const img = cld.image(publicId);
  img
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(800).height(450));

  return (
    <div
      className="group relative w-full h-full bg-surface-800 flex items-center justify-center cursor-pointer rounded-xl overflow-hidden ring-1 ring-white/10"
      onClick={() => onSelect(dataIndex)}
    >
      <div className="relative w-full h-full aspect-[16/9]">
        <AdvancedImage
          cldImg={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute bottom-0 inset-x-0 p-6 text-left bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <p className="text-white text-base md:text-xl font-medium font-heading">{title}</p>
        </div>
      </div>
    </div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({
  adminMode: _adminMode = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const ref = React.useRef<any>(null);
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

  // Transform database images to carousel format
  const galleryImages: GalleryImageDisplay[] = images.map((img) => ({
    publicId: img.cloudinary_public_id,
    title: img.title || "",
    hiResUrl: img.cloudinary_hires_id || img.cloudinary_public_id,
  }));

  // Lightbox navigation
  const lightboxPrev = useCallback(() => {
    if (galleryImages.length === 0) return;
    setImageLoading(true);
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [galleryImages.length]);

  const lightboxNext = useCallback(() => {
    if (galleryImages.length === 0) return;
    setImageLoading(true);
    setSelectedIndex((prev) =>
      prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [galleryImages.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setImageLoading(true);
  }, []);

  // Keyboard nav: carousel when lightbox closed, lightbox when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") lightboxPrev();
        if (e.key === "ArrowRight") lightboxNext();
      } else {
        if (e.key === "ArrowLeft") ref.current?.goBack();
        if (e.key === "ArrowRight") ref.current?.goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, closeLightbox, lightboxPrev, lightboxNext]);

  // Compute hi-res URL for lightbox
  const getHiResUrl = (index: number): string => {
    const { hiResUrl } = galleryImages[index];
    const img = cld.image(hiResUrl);
    img
      .format("auto")
      .delivery(quality("auto"))
      .resize(fill().width(2400).height(1350));
    return img.toURL();
  };

  // Get content from database with fallbacks (strip HTML tags)
  const galleryTitle = stripHtml(content.gallery_title || "Our Work");
  const galleryDescription = stripHtml(content.gallery_description || "Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home's architecture.");

  // Show loading state while fetching
  if (imagesLoading || contentLoading || galleryImages.length === 0) {
    return (
      <section id="gallery" className="py-12 bg-surface-900 overflow-hidden">
        <div className="text-center py-20">
          <Loader2 className="h-10 w-10 text-surface-400 animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-12 bg-surface-900 overflow-hidden">
      <div className="px-0 md:px-4">
        <div className="text-center mb-16">
          {/* Gradient accent line */}
          <div className="w-16 h-1 bg-brand-gradient-r mx-auto mb-6 rounded-full" />
          <EditableArea
            editPath={contentEditPath("home", "gallery_title")}
            label="Gallery Title"
          >
            <h2 className="font-heading text-3xl font-bold text-white mb-4">{galleryTitle}</h2>
          </EditableArea>
          <EditableArea
            editPath={contentEditPath("home", "gallery_description")}
            label="Gallery Description"
          >
            <p className="text-xl text-surface-400 max-w-3xl mx-auto">
              {galleryDescription}
            </p>
          </EditableArea>
        </div>

        <EditableArea editPath="/admin/gallery" label="Gallery Images">
          <div className="relative w-full">
            {/* Carousel area with glow */}
            <div className="relative py-4">
              {/* Decorative gradient glow */}
              <div className="absolute -inset-x-8 -inset-y-4 bg-brand-gradient rounded-3xl blur-3xl opacity-[0.07] pointer-events-none" />

              <div className="relative">
                <ResponsiveContainer
                  carouselRef={ref}
                  render={(width: number, carouselRef: React.Ref<any>) => (
                    <StackedCarousel
                      ref={carouselRef}
                      slideComponent={(props: {
                        data: any[];
                        dataIndex: number;
                      }) => (
                        <Slide {...props} onSelect={(index) => {
                          setImageLoading(true);
                          setSelectedIndex(index);
                        }} />
                      )}
                      slideWidth={650}
                      carouselWidth={width}
                      data={galleryImages}
                      maxVisibleSlide={5}
                      swipeThreshold={0}
                      disableSwipe={isMobile}
                      transitionSpeed={8}
                      customScales={[1, 0.9, 0.8, 0.7]}
                      transitionTime={500}
                      fadeDistance={0.5}
                      onActiveSlideChange={setCenterIndex}
                    />
                  )}
                />
              </div>
            </div>

          {/* Control bar: chevrons + dots */}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => ref.current?.goBack()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/10 text-white hover:bg-white/20 hover:ring-white/20 hover:ring-brand-300/30 transition"
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
                        ? "w-6 bg-brand-300 shadow-[0_0_6px_rgba(45,236,204,0.4)]"
                        : "w-2.5 bg-white/30 hover:bg-white/50",
                    ].join(" ")}
                  />
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => ref.current?.goNext()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/10 text-white hover:bg-white/20 hover:ring-white/20 hover:ring-brand-300/30 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </div>
        </EditableArea>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <ModalPortal>
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 animate-lightbox-fade-in"
              onClick={closeLightbox}
            >
              <div
                className="relative max-w-full max-h-full animate-lightbox-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button — frosted glass, top-right inside dialog */}
                <button
                  className="absolute top-3 right-3 z-10 bg-surface-900/80 backdrop-blur-md ring-1 ring-white/10 rounded-full p-2.5 text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  onClick={closeLightbox}
                  aria-label="Close image"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Previous button */}
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-surface-900/80 backdrop-blur-md ring-1 ring-white/10 rounded-full p-2.5 text-white hover:bg-white/20 hover:ring-brand-300/30 transition-all duration-200"
                  onClick={lightboxPrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Next button */}
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-surface-900/80 backdrop-blur-md ring-1 ring-white/10 rounded-full p-2.5 text-white hover:bg-white/20 hover:ring-brand-300/30 transition-all duration-200"
                  onClick={lightboxNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                  </div>
                )}

                <img
                  src={getHiResUrl(selectedIndex)}
                  alt={galleryImages[selectedIndex].title || "Enlarged view"}
                  className="max-h-[85vh] max-w-full object-contain rounded-xl ring-1 ring-white/10 shadow-2xl"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />

                {/* Image counter */}
                <p className="text-center text-surface-400 text-sm mt-3 font-heading">
                  {selectedIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </div>
          </ModalPortal>
        )}
      </div>
    </section>
  );
};
