import React from "react";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Difference } from "../components/Difference";
import { Process } from "../components/Process";
import { Testimonials } from "../components/Testimonials";

const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Difference />
      <Process />
      <Testimonials />
    </main>
  );
};

export default Home;
