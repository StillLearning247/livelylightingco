import { Gallery as GalleryComponent } from "../components/Gallery";
import { SEO } from "../components/SEO";

const Gallery = () => {
  return (
    <main className="pt-20">
      <SEO
        canonical="/gallery"
        title="Gallery - Govee Lighting Installation Photos"
        description="Browse our gallery of professional Govee permanent outdoor lighting installations in Austin, Cedar Park, Round Rock & Houston TX. See our expert craftsmanship."
      />
      <GalleryComponent />
    </main>
  );
};

export default Gallery;
