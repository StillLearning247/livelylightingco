import { ArrowRight } from "lucide-react";

export const Booking = () => {
  return (
    <div id="booking" className="py-1 px-6">
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl blur-xl opacity-80"></div>
        <div className="relative bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Home?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-white/60 to-white/20 mx-auto rounded-full"></div>
            </div>
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
                <p className="text-xl text-white/90 mb-6">
                  Professional installation by our expert team
                </p>
                <a
                  href="https://widget.zenbooker.com/book/1724689463359x510699585134110500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold transition-all hover:scale-[1.02] hover:shadow-lg w-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Book My Installation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
