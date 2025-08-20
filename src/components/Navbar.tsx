import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll when menu is open (nice UX for overlays)
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed w-full z-[80] transition-all duration-300 ${
        isHomePage && !isScrolled
          ? "bg-transparent py-4"
          : "bg-white shadow-md py-2"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/lively-logo.jpg"
            alt="LivelyLightingCo Logo"
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/")
                ? "text-indigo-600 font-semibold bg-indigo-50 px-3 py-1.5 rounded-md relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600"
                : isHomePage && !isScrolled
                ? "text-white hover:bg-white/10 px-3 py-1.5 rounded-md"
                : "text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md"
            } hover:text-indigo-500`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors ${
              isActive("/about")
                ? "text-indigo-600 font-semibold bg-indigo-50 px-3 py-1.5 rounded-md relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600"
                : isHomePage && !isScrolled
                ? "text-white hover:bg-white/10 px-3 py-1.5 rounded-md"
                : "text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md"
            } hover:text-indigo-500`}
          >
            About
          </Link>
          <Link
            to="/"
            state={{ scrollToGallery: true }}
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
              setIsMenuOpen(false);
            }}
            className={`text-sm font-medium transition-colors ${
              isHomePage && !isScrolled
                ? "text-white hover:bg-white/10 px-3 py-1.5 rounded-md"
                : "text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md"
            } hover:text-indigo-500`}
          >
            Gallery
          </Link>
          <a
            href="https://goveelightinstallers.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            Book Online
          </a>
          <Link
            to="/contact"
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Free Quote
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X
              className={`h-6 w-6 ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            />
          ) : (
            <Menu
              className={`h-6 w-6 ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile menu (overlay + panel) */}
      {isMenuOpen && (
        <>
          {/* Backdrop to dim page + banner; click to close */}
          <button
            aria-hidden
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden fixed inset-0 z-[75] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel sits below the navbar (adjust top-* if your navbar is taller) */}
          <div className="md:hidden fixed top-16 left-0 right-0 z-[80] bg-white shadow-xl rounded-b-xl">
            <div className="px-6 py-4 space-y-3">
              <Link
                to="/"
                className={`block transition-colors ${
                  isActive("/")
                    ? "text-indigo-600 font-semibold bg-indigo-50 px-3 py-2 rounded-md"
                    : "text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`block transition-colors ${
                  isActive("/about")
                    ? "text-indigo-600 font-semibold bg-indigo-50 px-3 py-2 rounded-md"
                    : "text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link
                to="/"
                state={{ scrollToGallery: true }}
                onClick={(e) => {
                  if (isHomePage) {
                    e.preventDefault();
                    document
                      .getElementById("gallery")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Gallery
              </Link>

              <a
                href="https://goveelightinstallers.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-5 py-2.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md hover:shadow-lg w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Online
              </a>

              <Link
                to="/contact"
                className="block px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Free Quote/Contact
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
