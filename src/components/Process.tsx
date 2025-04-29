import { Phone, Ruler, Sparkles, Star } from "lucide-react";

export const Process = () => {
  const steps = [
    {
      icon: <Phone className="h-6 w-6 text-white" />,
      title: "Free Consultation",
      description:
        "Schedule a quick call to discuss your vision and get expert recommendations.",
      details: [
        "Discuss your lighting goals",
        "Get professional recommendations",
        "Review color options and effects",
        "Receive preliminary pricing",
      ],
    },
    {
      icon: <Ruler className="h-6 w-6 text-white" />,
      title: "Custom Design",
      description:
        "We create a tailored lighting plan that perfectly matches your home's architecture.",
      details: [
        "Measure your home's dimensions",
        "Design optimal light placement",
        "Calculate exact materials needed",
        "Provide detailed final quote",
      ],
    },
    {
      icon: <Sparkles className="h-6 w-6 text-white" />,
      title: "Expert Installation",
      description:
        "Our team installs your lighting system with precision and attention to detail.",
      details: [
        "Professional mounting system",
        "Hidden wire management",
        "Weather-resistant installation",
        "Quality assurance check",
      ],
    },
    {
      icon: <Star className="h-6 w-6 text-white" />,
      title: "Smart Control Setup",
      description:
        "Take control of your new lighting system with the Govee app.",
      details: [
        "App setup and configuration",
        "Custom scene creation",
        "Schedule programming",
        "Usage demonstration",
      ],
    },
  ];

  return (
    <section
      id="process"
      className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Our Simple Process
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Our streamlined process makes getting beautiful permanent lighting
            simple and hassle-free
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 h-full w-px bg-gradient-to-b from-white/30 to-white/10 hidden sm:block" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative mb-12 sm:mb-16 ${
                index % 2 === 0 ? "sm:pr-1/2" : "sm:pl-1/2 sm:ml-auto"
              }`}
            >
              {/* Timeline dot */}
              <div
                className="hidden sm:block absolute top-0 w-4 h-4 rounded-full bg-white shadow-md"
                style={{
                  left: index % 2 === 0 ? "auto" : "0",
                  right: index % 2 === 0 ? "0" : "auto",
                  transform: "translate(50%, 50%)",
                }}
              />

              <div
                className={`relative bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 ${
                  index % 2 === 0 ? "sm:mr-8" : "sm:ml-8"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    {step.icon}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-indigo-200 mb-1">
                      Step {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-indigo-100 mb-4">{step.description}</p>

                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-indigo-50">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
