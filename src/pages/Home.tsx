import React from "react";
import { Hero } from "../components/Hero";
import { Difference } from "../components/Difference";
import { Process } from "../components/Process";
import { Testimonials } from "../components/Testimonials";

const Home = () => {
  return (
    <main>
      <section>
        <Hero />
      </section>

      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Difference />
      </section>

      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Process />
      </section>

      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Testimonials />
      </section>
    </main>
  );
};

export default Home;
