import { Gallery as GalleryComponent } from "../components/Gallery";
import { SEO } from "../components/SEO";

const Gallery = () => {
  return (
    <main className="pt-20">
      <SEO
        canonical="/gallery"
        title="Gallery — Permanent Outdoor Lighting Installation Photos"
        description="Browse our gallery of professional Govee, Asahom, Eufy, and Enbrighten permanent outdoor lighting installations across Texas and Oklahoma — Austin, Dallas-Fort Worth, Houston, San Antonio, Oklahoma City, and Tulsa metros. See our expert craftsmanship."
      />
      <GalleryComponent />
    </main>
  );
};

export default Gallery;
