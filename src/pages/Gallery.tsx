import { Gallery as GalleryComponent } from "../components/Gallery";
import { SEO } from "../components/SEO";

const Gallery = () => {
  return (
    <main className="pt-20">
      <SEO
        canonical="/gallery"
        title="Gallery"
        description="Browse photos of recent PermTrack permanent outdoor LED lighting installations across the Austin, TX metro."
      />
      <GalleryComponent />
    </main>
  );
};

export default Gallery;
