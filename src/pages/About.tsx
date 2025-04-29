import { Users, Award, PenTool as Tool } from "lucide-react";

const About = () => {
  return (
    <main className="pt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About LivelyLightingCo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're Austin's premier Govee lighting installation experts,
            dedicated to transforming homes with beautiful, permanent outdoor
            lighting solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Led by Jakob Rowe, our team brings years of lighting installation
              expertise.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
            <p className="text-gray-600">
              3-year warranty on all installations, ensuring lasting quality and
              peace of mind.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tool className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Professional Installation
            </h3>
            <p className="text-gray-600">
              Using premium mounting systems for a clean, professional look that
              lasts.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center">
            To provide homeowners with beautiful, permanent lighting solutions
            that enhance their homes year-round, installed with expert
            craftsmanship at an affordable price.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Service Area
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We proudly serve the greater Austin area, including:
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
            <li>• Austin</li>
            <li>• Round Rock</li>
            <li>• Cedar Park</li>
            <li>• Georgetown</li>
            <li>• Pflugerville</li>
            <li>• Leander</li>
            <li>• Buda</li>
            <li>• Kyle</li>
            <li>• Lakeway</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default About;
