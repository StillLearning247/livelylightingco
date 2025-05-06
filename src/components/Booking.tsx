import { ArrowRight } from "lucide-react";

export const Booking = () => {
  return (
    <div id="booking" className="py-1">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Ready to Transform Your Home?
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-4">
                Professional installation by our expert team
              </p>
              <a
                href="https://widget.zenbooker.com/book/1724689463359x510699585134110500"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all w-full"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Book My Installation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
