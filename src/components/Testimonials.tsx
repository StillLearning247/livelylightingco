import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Jennifer S.",
      location: "Austin, TX",
      quote:
        "LivelyLightingCo transformed our home! The install was quick and professional – and we love controlling the lights with our phone. Our neighbors keep asking where we got our lights done.",
      rating: 5,
    },
    {
      name: "Michael T.",
      location: "Round Rock, TX",
      quote:
        "Jakob and his team were fantastic from start to finish. No more climbing ladders for holidays! The lights look clean and professional during the day and absolutely stunning at night.",
      rating: 5,
    },
    {
      name: "Sarah & David",
      location: "Cedar Park, TX",
      quote:
        "We tried installing Govee lights ourselves first and it was a disaster. LivelyLightingCo fixed everything and installed them properly with their track system. Worth every penny!",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 bg-indigo-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what homeowners think about
            our service.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <button
              className="absolute left-0 -ml-8 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors focus:outline-none"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex-1 bg-indigo-800 rounded-2xl shadow-xl p-10">
              <div className="flex mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-lg italic mb-6">
                "{testimonials[currentIndex].quote}"
              </p>
              <div>
                <p className="font-semibold">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-indigo-300">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </div>

            <button
              className="absolute right-0 -mr-8 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors focus:outline-none"
              onClick={nextTestimonial}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-white/30"
                } transition-colors`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
