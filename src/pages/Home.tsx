import { Hero } from "../components/Hero";
import { Gallery } from "../components/Gallery";
import { Difference } from "../components/Difference";
import { Testimonials } from "../components/Testimonials";
// import React from "react";
import React, { lazy, Suspense } from "react";

const Home = () => {
  return (
    <main>
      <section id="home">
        <Hero />
        <Suspense
          fallback={<div className="text-center py-12">Loading...</div>}
        >
          <Gallery />
        </Suspense>
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
