import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
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
                ? "text-indigo-600"
                : isScrolled
                ? "text-gray-700"
                : "text-white"
            } hover:text-indigo-500`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors ${
              isActive("/about")
                ? "text-indigo-600"
                : isScrolled
                ? "text-gray-700"
                : "text-white"
            } hover:text-indigo-500`}
          >
            About
          </Link>
          <Link
            to="/gallery"
            className={`text-sm font-medium transition-colors ${
              isActive("/gallery")
                ? "text-indigo-600"
                : isScrolled
                ? "text-gray-700"
                : "text-white"
            } hover:text-indigo-500`}
          >
            Gallery
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X
              className={`h-6 w-6 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            />
          ) : (
            <Menu
              className={`h-6 w-6 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md">
          <div className="px-6 py-4 space-y-3">
            <Link
              to="/"
              className={`block text-gray-700 hover:text-indigo-500 transition-colors ${
                isActive("/") && "text-indigo-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`block text-gray-700 hover:text-indigo-500 transition-colors ${
                isActive("/about") && "text-indigo-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/gallery"
              className={`block text-gray-700 hover:text-indigo-500 transition-colors ${
                isActive("/gallery") && "text-indigo-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="block px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
