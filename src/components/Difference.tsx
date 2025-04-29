import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Difference = () => {
  const [showPainPoints, setShowPainPoints] = useState(false);

  return (
    <section
      id="difference"
      className="py-20 bg-gradient-to-br from-indigo-50 to-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose LivelyLightingCo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't let a bad installation ruin your investment. We bring
            unmatched expertise to every project.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    The LivelyLightingCo Difference
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-800 font-medium">
                        Premium Track System
                      </p>
                      <p className="text-gray-600">
                        We use the #1 permanent track mounting system for a
                        seamless, clean look
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-800 font-medium">
                        Expert Installation
                      </p>
                      <p className="text-gray-600">
                        Led by Jakob Rowe, a nationally recognized expert in
                        permanent lighting
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-800 font-medium">
                        Professional Weatherproofing
                      </p>
                      <p className="text-gray-600">
                        Built to withstand Texas heat, rain, and weather
                        year-round
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-800 font-medium">
                        3-Year Warranty
                      </p>
                      <p className="text-gray-600">
                        Peace of mind with our comprehensive craftsmanship
                        warranty
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="px-8 py-4 bg-indigo-50 border-t border-indigo-100">
                <p className="text-indigo-800 font-medium">
                  Get the stunning look of professional permanent lighting
                  without the $8k price tag
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPainPoints(!showPainPoints)}
              className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <span className="text-lg font-medium text-gray-800">
                  Why proper installation matters
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  showPainPoints ? "rotate-180" : ""
                }`}
              />
            </button>

            {showPainPoints && (
              <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Loose mounts that fall after a few months
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Exposed wires that look unsightly during the day
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Improper weatherproofing leading to shorts and failures
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Poor installation planning that wastes light strips
                      </p>
                    </li>
                  </ul>
                  <p className="mt-6 text-gray-700 italic">
                    These issues are common with DIY or inexperienced installers
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/contact"
            className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-center font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
};
