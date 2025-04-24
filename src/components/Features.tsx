import React from 'react';
import { Smartphone, Calendar, Palette, Award } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: <Smartphone className="h-10 w-10 text-indigo-600" />,
      title: "Smart Control",
      description: "Control your lights from anywhere with the Govee app. Change colors, brightness, and patterns with a tap."
    },
    {
      icon: <Calendar className="h-10 w-10 text-indigo-600" />,
      title: "Year-Round Use",
      description: "Set it once and enjoy beautiful lighting all year. Automatic schedules and holiday presets available."
    },
    {
      icon: <Palette className="h-10 w-10 text-indigo-600" />,
      title: "Customized Design",
      description: "Lighting tailored to your home's unique architecture, professionally installed for a perfect fit."
    },
    {
      icon: <Award className="h-10 w-10 text-indigo-600" />,
      title: "Expert Installation",
      description: "3-year craftsmanship warranty. Clean, professional setup with no visible wires or messy adhesives."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Permanent Lighting</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tired of climbing ladders every holiday? We install permanent, app-controlled Govee lighting 
            so you can enjoy dazzling lights year-round without the hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 bg-indigo-50 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};