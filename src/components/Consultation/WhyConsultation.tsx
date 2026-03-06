import { Check } from "lucide-react";

export const WhyConsultation = () => {
  return (
    <div>
      <h2 className="font-heading text-3xl font-bold text-surface-900 mb-6">
        Get Your Free Consultation
      </h2>
      <p className="text-lg text-surface-500 mb-8">
        Ready to transform your home with stunning, permanent lighting? Fill out
        the form for a free consultation or reach out directly.
      </p>

      <div className="bg-surface-900 text-white rounded-xl p-6 border border-surface-700 mb-12">
        <h3 className="font-heading text-lg font-medium mb-3">
          Why Get a Consultation?
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-brand-300 flex-shrink-0 mt-0.5" />
            <span className="text-surface-300">
              Custom design plans tailored to your home
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-brand-300 flex-shrink-0 mt-0.5" />
            <span className="text-surface-300">
              Accurate pricing with no surprises
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-brand-300 flex-shrink-0 mt-0.5" />
            <span className="text-surface-300">
              Expert advice on lighting options and placement
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-brand-300 flex-shrink-0 mt-0.5" />
            <span className="text-surface-300">
              No obligation - friendly chat to explore possibilities
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
