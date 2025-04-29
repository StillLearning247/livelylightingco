import React, { useState } from "react";
import {
  Phone,
  Ruler,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Process = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const steps = [
    {
      icon: <Phone className="h-10 w-10 text-white" />,
      title: "Consultation",
      description:
        "We discuss your vision, preferences, and answer any questions about our permanent lighting.",
      bgColor: "bg-indigo-600",
    },
    {
      icon: <Ruler className="h-10 w-10 text-white" />,
      title: "Design & Quote",
      description:
        "We'll create a custom design for your home's architecture and provide a detailed quote.",
      bgColor: "bg-indigo-700",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-white" />,
      title: "Professional Installation",
      description:
        "Our expert team installs your lighting system with precision and care.",
      bgColor: "bg-indigo-800",
    },
    {
      icon: <Star className="h-10 w-10 text-white" />,
      title: "Enjoy & Control",
      description:
        "Control your new lighting system easily from your phone with the Govee app.",
      bgColor: "bg-indigo-900",
    },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }
    if (touchStart - touchEnd < -75) {
      handlePrev();
    }
  };

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Simple Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From consultation to installation, we make getting beautiful
            permanent lighting easy and hassle-free.
          </p>
        </div>

        {/* Desktop view */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute top-1/4 left-full w-full h-0.5 bg-gray-200 z-0"></div>
              )}
              <ProcessCard step={step} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="lg:hidden relative">
          <div
            className="overflow-hidden touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}
            >
              {steps.map((step, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <ProcessCard step={step} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg z-10"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg z-10"
            aria-label="Next step"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Step indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === index ? "bg-indigo-600 w-4" : "bg-gray-300"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Before-After comparison section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Professional Difference
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how our professional installation compares to typical DIY
              attempts
            </p>
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative p-8 bg-gradient-to-br from-red-50 to-white">
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  DIY Installation
                </div>
                <img
                  src="/images/Before pic.jpg"
                  alt="DIY installation showing visible wires and mounts"
                  className="w-full aspect-[4/3] object-cover rounded-lg shadow-md mb-6"
                />
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Common DIY Issues
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Visible wires during daytime
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Loose or sagging mounts
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Poor weatherproofing
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative p-8 bg-gradient-to-br from-green-50 to-white">
                <div className="absolute top-4 left-4 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  Professional Installation
                </div>
                <img
                  src="/images/After pic.jpg"
                  alt="Professional installation with clean finish"
                  className="w-full aspect-[4/3] object-cover rounded-lg shadow-md mb-6"
                />
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Our Professional Results
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Clean, hidden wiring system
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Secure, permanent mounting
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Professional weatherproofing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProcessCardProps {
  step: {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
  };
  index: number;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ step, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full relative z-10">
      <div className={`${step.bgColor} rounded-t-xl p-6 flex justify-center`}>
        <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
          {step.icon}
        </div>
      </div>
      <div className="p-6">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">
          {index + 1}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {step.title}
        </h3>
        <p className="text-gray-600">{step.description}</p>
      </div>
    </div>
  );
};
