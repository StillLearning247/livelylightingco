import { Hero } from "../components/Hero";
import { Gallery } from "../components/Gallery";

export const AdminHome = () => {
  return (
    <main>
      <Hero adminMode />
      <Gallery adminMode />
    </main>
  );
};
