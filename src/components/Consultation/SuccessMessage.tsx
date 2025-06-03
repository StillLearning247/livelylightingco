import { Check } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
      <p className="text-gray-600 mb-6">
        We've received your request! Please check your inbox shortly for
        confirmation details and next steps.
      </p>
      <button
        onClick={onReset}
        className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
      >
        Submit another request
      </button>
    </div>
  );
};
