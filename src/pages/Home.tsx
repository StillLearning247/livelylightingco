import { Hero } from "../components/Hero";
import { Gallery } from "../components/Gallery";
import { Difference } from "../components/Difference";
import { Testimonials } from "../components/Testimonials";

const Home = () => {
  return (
    <main>
      <section id="home">
        <Hero />
        <Gallery />
      </section>

      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Testimonials />
      </section>

      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/10 to-transparent"></div>
        <Difference />
      </section>
    </main>
  );
};

export default Home;
