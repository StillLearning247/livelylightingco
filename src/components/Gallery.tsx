import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import cld from "../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";
import ModalPortal from "./ModalPortal";
import { useGallery } from "../hooks/useGallery";
import { usePageContent } from "../hooks/useContent";
import { EditableArea, contentEditPath } from "./EditableArea";
import { stripHtml } from "../lib/stripHtml";

type GalleryProps = {
  adminMode?: boolean;
};

interface GalleryImageDisplay {
  publicId: string;
  title: string;
  hiResUrl: string;
}

/* ── Cloudinary URL helpers ── */

function cloudinarySrcUrl(publicId: string, width: number): string {
  const img = cld.image(publicId);
  img
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(width).height(Math.round(width * 9 / 16)));
  return img.toURL();
}

function getHiResUrl(publicId: string): string {
  const img = cld.image(publicId);
  img
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(2400).height(1350));
  return img.toURL();
}

/* ── Framer Motion variants ── */

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ── GridItem ── */

const GridItem: React.FC<{
  image: GalleryImageDisplay;
  index: number;
  onSelect: (index: number) => void;
}> = ({ image, index, onSelect }) => {
  const srcSet = [400, 600, 800]
    .map((w) => `${cloudinarySrcUrl(image.publicId, w)} ${w}w`)
    .join(", ");

  return (
    <motion.div
      variants={gridItemVariants}
      className="group relative aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-white/10 bg-surface-800 cursor-pointer"
      onClick={() => onSelect(index)}
    >
      <img
        src={cloudinarySrcUrl(image.publicId, 600)}
        srcSet={srcSet}
        sizes="(max-width: 399px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
        alt={image.title || "Permanent outdoor LED lighting installation by LivelyLightingCo"}
        loading="lazy"
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 active:scale-[0.98]"
      />
      <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <p className="text-white text-sm md:text-base font-medium font-heading">
          {image.title}
        </p>
      </div>
    </motion.div>
  );
};

/* ── Gallery ── */

export const Gallery: React.FC<GalleryProps> = ({
  adminMode: _adminMode = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const { images, loading: imagesLoading } = useGallery();
  const { content, loading: contentLoading } = usePageContent("home");

  const galleryImages: GalleryImageDisplay[] = images.map((img) => ({
    publicId: img.cloudinary_public_id,
    title: img.title || "",
    hiResUrl: img.cloudinary_hires_id || img.cloudinary_public_id,
  }));

  /* ── Lightbox nav ── */

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

  /* ── Keyboard nav (lightbox only) ── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, closeLightbox, lightboxPrev, lightboxNext]);

  /* ── Lock body scroll when lightbox open ── */

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  /* ── Swipe handler ── */

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipeThreshold = 50;
      const velocityThreshold = 300;
      if (
        info.offset.x < -swipeThreshold ||
        info.velocity.x < -velocityThreshold
      ) {
        lightboxNext();
      } else if (
        info.offset.x > swipeThreshold ||
        info.velocity.x > velocityThreshold
      ) {
        lightboxPrev();
      }
    },
    [lightboxNext, lightboxPrev]
  );

  /* ── CMS content ── */

  const galleryTitle = stripHtml(content.gallery_title || "Our Work");
  const galleryDescription = stripHtml(
    content.gallery_description ||
      "Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home's architecture."
  );

  /* ── Loading state ── */

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
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-brand-gradient-r mx-auto mb-6 rounded-full" />
          <EditableArea
            editPath={contentEditPath("home", "gallery_title")}
            label="Gallery Title"
          >
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              {galleryTitle}
            </h2>
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

        {/* Grid */}
        <EditableArea editPath="/admin/gallery" label="Gallery Images">
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 min-[400px]:gap-4 md:gap-5"
          >
            {galleryImages.map((image, i) => (
              <GridItem
                key={image.publicId}
                image={image}
                index={i}
                onSelect={(idx) => {
                  setImageLoading(true);
                  setSelectedIndex(idx);
                }}
              />
            ))}
          </motion.div>
        </EditableArea>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <ModalPortal>
              <motion.div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeLightbox}
              >
                <motion.div
                  className="relative max-w-full max-h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
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

                  {/* Swipeable lightbox image */}
                  <motion.img
                    key={selectedIndex}
                    src={getHiResUrl(galleryImages[selectedIndex].hiResUrl)}
                    alt={
                      galleryImages[selectedIndex].title ||
                      "Permanent outdoor LED lighting installation by LivelyLightingCo"
                    }
                    className="max-h-[85vh] max-w-full object-contain rounded-xl ring-1 ring-white/10 shadow-2xl touch-pan-y"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />

                  {/* Image counter */}
                  <p className="text-center text-surface-400 text-sm mt-3 font-heading">
                    {selectedIndex + 1} / {galleryImages.length}
                  </p>
                </motion.div>
              </motion.div>
            </ModalPortal>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
