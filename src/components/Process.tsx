import React from 'react';
import { Phone, Ruler, Sparkles, Star, ArrowLeftRight } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

export const Process = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastTouchX = useRef<number | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    const clampedPosition = Math.min(Math.max(position, 0), 100);
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setSliderPosition(clampedPosition);
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];
    lastTouchX.current = touch.clientX;
    handleMove(touch.clientX);
  }, [handleMove]);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleEnd = useCallback(() => {
    isDragging.current = false;
    lastTouchX.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [handleMouseMove, handleTouchMove, handleEnd]);

  const steps = [
    {
      icon: <Phone className="h-10 w-10 text-white" />,
      title: "Consultation",
      description: "We discuss your vision, preferences, and answer any questions about our permanent lighting.",
      bgColor: "bg-indigo-600"
    },
    {
      icon: <Ruler className="h-10 w-10 text-white" />,
      title: "Design & Quote",
      description: "We'll create a custom design for your home's architecture and provide a detailed quote.",
      bgColor: "bg-indigo-700"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-white" />,
      title: "Professional Installation",
      description: "Our expert team installs your lighting system with precision and care.",
      bgColor: "bg-indigo-800"
    },
    {
      icon: <Star className="h-10 w-10 text-white" />,
      title: "Enjoy & Control",
      description: "Control your new lighting system easily from your phone with the Govee app.",
      bgColor: "bg-indigo-900"
    }
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Simple Process</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From consultation to installation, we make getting beautiful permanent lighting easy and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-gray-200 z-0"></div>
              )}
              
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto bg-gray-50 rounded-xl p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">See the Difference</h3>
          <p className="text-gray-600 mb-6">Drag the slider to compare DIY vs Professional installation</p>
          
          <div 
            ref={containerRef}
            className="relative h-[400px] rounded-xl overflow-hidden cursor-ew-resize shadow-xl"
            onMouseDown={(e) => {
              e.preventDefault();
              handleMouseDown();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleMouseDown();
            }}
          >
            {/* After image (full width) */}
            <img
              src="/images/After pic.jpg"
              alt="Professional Installation"
              className="absolute inset-0 w-full h-full object-cover select-none"
              loading="lazy"
              draggable="false"
            />
            
            {/* Before image (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden transition-[width] duration-75 ease-out"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="/images/Before pic.jpg"
                alt="DIY Installation"
                className="absolute inset-0 w-full h-full object-cover select-none"
                loading="lazy"
                draggable="false"
              />
              
              {/* Gradient overlay for before image */}
              <div className="absolute inset-0 bg-red-500/10"></div>
            </div>
            
            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize transition-[left] duration-75 ease-out"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">
              After
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="font-medium text-red-600">DIY Installation</p>
              <p className="text-gray-500 text-sm">Visible wires and mounts</p>
            </div>
            <div>
              <p className="font-medium text-green-600">Professional Installation</p>
              <p className="text-gray-500 text-sm">Clean, seamless look</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};