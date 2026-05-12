import { Check } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-brand-400" />
      </div>
      <h3 className="font-heading text-2xl font-bold text-surface-900 mb-2">Thank You!</h3>
      <p className="text-surface-500 mb-6">
        We've received your request! Please check your inbox shortly for
        confirmation details and next steps.
      </p>
      <button
        onClick={onReset}
        className="text-brand-400 font-medium hover:text-brand-500 transition-colors"
      >
        Submit another request
      </button>
    </div>
  );
};
