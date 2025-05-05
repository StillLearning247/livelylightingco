import { useState } from "react";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminLogin } from "./AdminLogin";
import { PrivacyPolicy } from "./PrivacyPolicy"; // <-- your corrected PrivacyPolicy that accepts props

export const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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
              Professional permanent lighting installation for homes in the
              greater Austin area.
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
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
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
          <div className="flex space-x-6">
            <PrivacyPolicy
              isOpen={isPrivacyOpen}
              onOpen={() => setIsPrivacyOpen(true)}
              onClose={() => setIsPrivacyOpen(false)}
            />
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <AdminLogin />
          </div>
        </div>
      </div>
    </footer>
  );
};
