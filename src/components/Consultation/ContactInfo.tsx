import { Phone, Mail, MapPin } from "lucide-react";

export const ContactInfo = () => {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-full">
          <Phone className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Phone</h3>
          <p className="text-gray-600">
            <a
              href="tel:+15128097323"
              aria-label="Call us at (512) 809-7323"
              className="hover:text-indigo-600 transition-colors"
            >
              (512)-809-7323
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-full">
          <Mail className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Email</h3>
          <p className="text-gray-600">
            <a
              href="mailto:contact@livelylightingco.com"
              aria-label="Email us at contact@livelylightingco.com"
              className="hover:text-indigo-600 transition-colors"
            >
              contact@livelylightingco.com
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-full">
          <MapPin className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Service Area</h3>
          <p className="text-gray-600">
            Austin, Round Rock, Cedar Park, and surrounding areas
          </p>
        </div>
      </div>
    </div>
  );
};
