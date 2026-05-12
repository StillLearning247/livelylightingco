import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePageContent } from "../hooks/useContent";
import { EditableArea, contentEditPath } from "./EditableArea";
import { stripHtml } from "../lib/stripHtml";

export const Difference = () => {
  const [showPainPoints, setShowPainPoints] = useState(false);

  // Fetch content from database
  const { content } = usePageContent("home");

  // Get content from database with fallbacks (strip HTML tags)
  const differenceTitle = stripHtml(content.difference_title || "Why Choose LivelyLightingCo");
  const differenceDescription = stripHtml(content.difference_description || "Don't let a bad installation ruin your investment. We bring unmatched expertise to every project.");

  return (
    <section
      id="difference"
      className="py-20 bg-surface-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <EditableArea
            editPath={contentEditPath("home", "difference_title")}
            label="Why Choose Us Title"
          >
            <h2 className="font-heading text-3xl font-bold text-surface-900 mb-4">
              {differenceTitle}
            </h2>
          </EditableArea>
          <EditableArea
            editPath={contentEditPath("home", "difference_description")}
            label="Why Choose Us Description"
          >
            <p className="text-xl text-surface-500 max-w-3xl mx-auto">
              {differenceDescription}
            </p>
          </EditableArea>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute -inset-2 bg-brand-gradient rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="font-heading text-2xl font-semibold text-surface-800">
                    The LivelyLightingCo Difference
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-surface-800 font-medium">
                        Premium Track System
                      </p>
                      <p className="text-surface-500">
                        We use the #1 permanent track mounting system for a
                        seamless, clean look
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-surface-800 font-medium">
                        Expert Installation
                      </p>
                      <p className="text-surface-500">
                        Led by Jakob Rowe, a nationally recognized expert in
                        permanent lighting
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-surface-800 font-medium">
                        Professional Weatherproofing
                      </p>
                      <p className="text-surface-500">
                        Built to withstand Texas heat, rain, and weather
                        year-round
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-surface-800 font-medium">
                        Lifetime PermTrack + 5-Year Install Warranty
                      </p>
                      <p className="text-surface-500">
                        Industry-leading coverage: lifetime warranty on our
                        PermTrack mounting hardware and a 5-year warranty on
                        your installation
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="px-8 py-4 bg-brand-50 border-t border-brand-100">
                <p className="text-brand-700 font-medium">
                  Professional installation by certified Govee lighting experts
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPainPoints(!showPainPoints)}
              className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <span className="text-lg font-medium text-surface-800">
                  Why proper installation matters
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-surface-500 transition-transform duration-300 group-hover:text-surface-700 ${
                  showPainPoints ? "rotate-180" : ""
                }`}
              />
            </button>

            {showPainPoints && (
              <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
                <div className="p-5 sm:p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-surface-600">
                        Loose mounts that fall after a few months
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-surface-600">
                        Exposed wires that look unsightly during the day
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-surface-600">
                        Improper weatherproofing leading to shorts and failures
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-surface-600">
                        Poor installation planning that wastes light strips
                      </p>
                    </li>
                  </ul>
                  <p className="mt-6 text-surface-600 italic">
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
            className="px-8 py-4 rounded-md bg-accent-400 text-surface-900 text-center font-heading font-bold hover:bg-accent-500 transition-colors shadow-lg"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
};
