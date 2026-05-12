import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { useAdmin } from "./AdminProvider";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");
  const { admin } = useAdmin();

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

  // Hide navbar on admin pages (admin has its own layout)
  if (isAdminPage) return null;

  const navLinkBase = "font-heading text-sm font-semibold tracking-wide uppercase transition-colors px-3 py-1.5 rounded-md";

  const navLinkClass = (path: string) => {
    if (isActive(path))
      return `${navLinkBase} text-brand-300 border-b-2 border-brand-300`;
    if (isHomePage && !isScrolled)
      return `${navLinkBase} text-white hover:text-brand-300`;
    return `${navLinkBase} text-surface-200 hover:text-brand-300`;
  };

  // For gallery link (no active state match)
  const galleryLinkClass = () => {
    if (isHomePage && !isScrolled)
      return `${navLinkBase} text-white hover:text-brand-300`;
    return `${navLinkBase} text-surface-200 hover:text-brand-300`;
  };

  return (
    <nav
      className={`fixed w-full z-[80] transition-all duration-300 ${
        isHomePage && !isScrolled
          ? "bg-transparent py-4"
          : "bg-surface-900/95 backdrop-blur-md shadow-lg py-2"
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
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link to="/about" className={navLinkClass("/about")}>
            About
          </Link>
          <Link
            to="/#gallery"
            onClick={() => setIsMenuOpen(false)}
            className={galleryLinkClass()}
          >
            Gallery
          </Link>
          <Link to="/compare" className={navLinkClass("/compare")}>
            Compare
          </Link>
          <a
            href="https://goveelightinstallers.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-heading font-semibold rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            Book Online
          </a>
          <Link
            to="/contact"
            className="px-5 py-2.5 text-sm font-heading font-bold rounded-md bg-accent-400 text-surface-900 hover:bg-accent-500 transition-colors shadow-md hover:shadow-lg"
          >
            Get Free Quote
          </Link>
          {admin && (
            <Link
              to="/admin"
              className="p-2.5 rounded-lg bg-surface-700 text-white hover:bg-surface-600 transition-colors shadow-md"
              title="Admin Panel"
            >
              <Settings className="h-5 w-5" />
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu
              className={`h-6 w-6 ${
                isHomePage && !isScrolled ? "text-white" : "text-white"
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

          {/* Panel sits below the navbar */}
          <div className="md:hidden fixed top-20 left-0 right-0 z-[80] bg-surface-900 shadow-xl rounded-b-xl border-t border-white/10">
            <div className="px-6 py-4 space-y-3">
              <Link
                to="/"
                className={`block font-heading text-sm font-semibold tracking-wide uppercase transition-colors px-3 py-2 rounded-md ${
                  isActive("/")
                    ? "text-brand-300 bg-brand-300/10"
                    : "text-surface-200 hover:text-brand-300 hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`block font-heading text-sm font-semibold tracking-wide uppercase transition-colors px-3 py-2 rounded-md ${
                  isActive("/about")
                    ? "text-brand-300 bg-brand-300/10"
                    : "text-surface-200 hover:text-brand-300 hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link
                to="/#gallery"
                onClick={() => setIsMenuOpen(false)}
                className="block font-heading text-sm font-semibold tracking-wide uppercase text-surface-200 hover:text-brand-300 hover:bg-white/5 px-3 py-2 rounded-md transition-colors"
              >
                Gallery
              </Link>

              <Link
                to="/compare"
                className={`block font-heading text-sm font-semibold tracking-wide uppercase transition-colors px-3 py-2 rounded-md ${
                  isActive("/compare")
                    ? "text-brand-300 bg-brand-300/10"
                    : "text-surface-200 hover:text-brand-300 hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>

              <a
                href="https://goveelightinstallers.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-5 py-2.5 text-sm font-heading font-semibold rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Online
              </a>

              <Link
                to="/contact"
                className="block px-5 py-2.5 text-sm font-heading font-bold rounded-md bg-accent-400 text-surface-900 hover:bg-accent-500 transition-colors shadow-md w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Free Quote
              </Link>
              {admin && (
                <Link
                  to="/admin"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-heading font-semibold rounded-md bg-surface-700 text-white hover:bg-surface-600 transition-colors shadow-md w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
