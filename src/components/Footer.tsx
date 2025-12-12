import { useState } from "react";
import { Facebook, Youtube, Mail, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AdminLogin } from "./AdminLogin";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { useAdmin } from "./AdminProvider";

export const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { admin, signOut } = useAdmin();
  const location = useLocation();

  // Hide footer on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img
              src="/images/lively-logo.jpg"
              alt="LivelyLightingCo Logo"
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 mb-6">
              Experience Govee Light Installations at an Affordable Price.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/livelylightingco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UChIr1JGEiGCqtX_2fl1gfNQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@livelylightingco.com"
                aria-label="Email us"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
                { to: "/#gallery", label: "Gallery" },
                { to: "/#difference", label: "Why Choose Us" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <strong className="text-white">Phone:</strong> (512)-809-7323
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Email:</strong>{" "}
                contact@livelylightingco.com
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Hours:</strong> Mon-Fri: 9am-6pm
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Service Area:</strong> Austin, TX
                and surrounding areas
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LivelyLightingCo. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-6">
            <PrivacyPolicy
              isOpen={isPrivacyOpen}
              onOpen={() => setIsPrivacyOpen(true)}
              onClose={() => setIsPrivacyOpen(false)}
            />
            {admin ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Logged in as: <span className="text-white">{admin.username || admin.email || "Admin"}</span>
                </span>
                <button
                  onClick={signOut}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <AdminLogin />
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
