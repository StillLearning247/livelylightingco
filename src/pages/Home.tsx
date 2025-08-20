import { Hero } from "../components/Hero";
import { Gallery } from "../components/Gallery";
import { Difference } from "../components/Difference";
import { Testimonials } from "../components/Testimonials";
import { useEffect } from "react";
import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import FloatingBanner from "../components/FloatingBanner";

const Home = () => {
  const location = useLocation();

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
    <main className="bg-neutral-950">
      {" "}
      {/* optional, keeps any tiny gaps dark */}
      <FloatingBanner
        message="*BEST PRICE GUARANTEE* We will beat any quote from Jellyfish, Trimlight, Oelo or Gemstone (Astoria)."
        variant="marquee"
        tone="brand"
        duration={60000}
        stickyTop="top-20 sm:top-24"
        className="z-40"
      />
      <section id="home" className="scroll-mt-28 sm:scroll-mt-32">
        <Hero />
        <div id="gallery">
          <Suspense
            fallback={<div className="text-center py-12">Loading...</div>}
          >
            <Gallery />
          </Suspense>
        </div>
      </section>
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Suspense
          fallback={<div className="text-center py-12">Loading...</div>}
        >
          <Testimonials />
        </Suspense>
      </section>
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Suspense
          fallback={<div className="text-center py-12">Loading...</div>}
        >
          <Difference />
        </Suspense>
      </section>
    </main>
  );
};

export default Home;
