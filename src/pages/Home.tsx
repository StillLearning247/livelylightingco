import { Hero } from "../components/Hero";
import { Gallery } from "../components/Gallery";
import { Difference } from "../components/Difference";
import { Testimonials } from "../components/Testimonials";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import FloatingBanner from "../components/FloatingBanner";
import { usePageContent } from "../hooks/useContent";
import { EditableArea, contentEditPath } from "../components/EditableArea";
import { stripHtml } from "../lib/stripHtml";
import { SEO } from "../components/SEO";

const BANNER_DISMISSED_KEY = "floating_banner_dismissed";

const Home = () => {
  const location = useLocation();
  const { content } = usePageContent("home");
  const [bannerVisible, setBannerVisible] = useState(() => {
    return !sessionStorage.getItem(BANNER_DISMISSED_KEY);
  });

  const handleCloseBanner = () => {
    setBannerVisible(false);
    sessionStorage.setItem(BANNER_DISMISSED_KEY, "true");
  };

  // Get floating banner content from database with fallback (strip HTML tags)
  const bannerMessage = stripHtml(content.floating_banner || "*BEST PRICE GUARANTEE* We will beat any quote from Jellyfish, Trimlight, Oelo or Gemstone (Astoria).");

  useEffect(() => {
    const scrollToGallery = () => {
      const element = document.getElementById("gallery");
      if (element) {
        // Small timeout to ensure the DOM is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    // Check if we need to scroll to gallery (from navigation state or hash)
    if (
      location.state?.scrollToGallery ||
      window.location.hash === "#gallery"
    ) {
      scrollToGallery();
      // Clear the state to prevent scrolling again on re-renders
      window.history.replaceState(
        { ...location.state, scrollToGallery: false },
        ""
      );
    }
  }, [location]);
  return (
    <main className="bg-surface-950">
      <SEO
        canonical="/"
        title="Permanent Outdoor Lighting in Texas & Oklahoma"
        description="PermTrack permanent LED lighting installed by certified pros across the Austin metro. Lifetime PermTrack hardware warranty plus 5-year workmanship warranty."
      />
      {bannerVisible && (
        <EditableArea
          editPath={contentEditPath("home", "floating_banner")}
          label="Banner Text"
        >
          <FloatingBanner
            message={bannerMessage}
            variant="marquee"
            tone="brand"
            duration={60000}
            stickyTop="top-20 sm:top-24"
            className="z-40"
            reserveSpace
            reserveGapPx={8}
            onClose={handleCloseBanner}
          />
        </EditableArea>
      )}
      <section
        id="home"
        className="scroll-mt-28 sm:scroll-mt-32 lg:scroll-mt-40 xl:scroll-mt-44"
      >
        <Hero />
        <div id="gallery">
          <Suspense
            fallback={<div className="text-center py-12">Loading...</div>}
          >
            <Gallery />
          </Suspense>
        </div>
      </section>
      <Suspense
        fallback={<div className="text-center py-12">Loading...</div>}
      >
        <Testimonials />
      </Suspense>
      {/* Smooth transition spacer from dark testimonials to light Difference */}
      <div className="h-16 bg-gradient-to-b from-surface-950 to-surface-50" />
      <Suspense
        fallback={<div className="text-center py-12">Loading...</div>}
      >
        <Difference />
      </Suspense>
    </main>
  );
};

export default Home;
