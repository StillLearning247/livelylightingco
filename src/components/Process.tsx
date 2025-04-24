import React from 'react';
import { Phone, Ruler, Sparkles, Star } from 'lucide-react';

export const Process = () => {
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Before-After Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Home during day with visible light strips and cables" 
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-center text-gray-700 font-medium">DIY Installation</p>
              <p className="text-center text-gray-500 text-sm">Visible wires and mounts during day</p>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Home during day with clean, professional installation" 
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-center text-gray-700 font-medium">Professional Installation</p>
              <p className="text-center text-gray-500 text-sm">Clean look with hidden wires</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};