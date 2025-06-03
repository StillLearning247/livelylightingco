import { Check } from "lucide-react";

export const WhyConsultation = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Get Your Free Consultation
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Ready to transform your home with stunning, permanent lighting? Fill out
        the form for a free consultation or reach out directly.
      </p>

      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Why Get a Consultation?
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">
              Custom design plans tailored to your home
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">
              Accurate pricing with no surprises
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">
              Expert advice on lighting options and placement
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">
              No obligation - friendly chat to explore possibilities
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
