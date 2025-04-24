import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryImages = [
    {
      url: "/images/House1.jpg",
      title: "Holiday Themed with Multi-Color Display"
    },
    {
      url: "/images/House2.jpg",
      title: "Contemporary Home with RGB Accents"
    },
    {
      url: "/images/House3.jpg",
      title: "Modern Home with Bright White"
    },
    {
      url: "/images/House4.jpg",
      title: "Mediterranean Style with Subtle Lighting"
    },
    {
      url: "/images/House5.jpg",
      title: "Ranch Home with Vibrant Perimeter Lighting"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home's architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-gray-100 shadow-md transition-all duration-300 hover:shadow-xl"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-medium">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for fullsize image view */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-7xl max-h-full">
              <button 
                className="absolute -top-12 right-0 bg-white rounded-full p-2 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="max-h-[85vh] max-w-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};