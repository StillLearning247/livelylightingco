import { ArrowRight } from "lucide-react";

export const Booking = () => {
  return (
    <div id="booking" className="mb-20">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-8 md:p-12">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-indigo-100">
              Choose the best booking option for your location
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto booking-section">
            <div className="bg-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Greater Austin Area
              </h3>
              <p className="text-gray-600 mb-6">
                Professional installation by our local expert team
              </p>
              <a
                href="https://live.vcita.com/site/duplzj70p474cj96/activity/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all w-full"
              >
                Book Installation
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Outside Central Texas
              </h3>
              <p className="text-gray-600 mb-6">
                Connect with a certified installer in your area
              </p>
              <a
                href="https://widget.zenbooker.com/book/1724689463359x510699585134110500"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all w-full"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Find Installer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
