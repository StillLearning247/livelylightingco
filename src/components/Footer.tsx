import { useState } from "react";
import { Facebook, Youtube, Mail, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AdminLogin } from "./AdminLogin";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { useAdmin } from "./AdminProvider";
import { usePageContent } from "../hooks/useContent";
import { stripHtml } from "../lib/stripHtml";
import { EditableArea, contentEditPath } from "./EditableArea";

export const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { admin, signOut } = useAdmin();
  const location = useLocation();
  const { content } = usePageContent("footer");

  // Get content from CMS with fallbacks
  const tagline = stripHtml(content.tagline || "Experience Permanent Light Installations at an Affordable Price. Govee, Asahom, Eufy and Enbrighten.");
  const phone = stripHtml(content.phone || "(737)-423-7246");
  const email = stripHtml(content.email || "installs@livelylightingco.com");
  const hours = stripHtml(content.hours || "Mon-Fri: 9am-6pm");
  const serviceArea = stripHtml(content.service_area || "Proudly serving the Austin, TX metro — expanding across Texas and Oklahoma");
  const facebookUrl = stripHtml(content.facebook_url || "https://facebook.com/livelylightingco");
  const youtubeUrl = stripHtml(content.youtube_url || "https://www.youtube.com/channel/UChIr1JGEiGCqtX_2fl1gfNQ");

  // Hide footer on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-surface-950 text-white">
      {/* Gradient top border */}
      <div className="h-px bg-brand-gradient-r w-full" />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img
              src="/images/lively-logo.jpg"
              alt="LivelyLightingCo Logo"
              className="h-12 w-auto mb-4"
            />
            <EditableArea editPath={contentEditPath("footer", "tagline")} label="Tagline">
              <p className="text-surface-400 mb-6">
                {tagline}
              </p>
            </EditableArea>
            <div className="flex space-x-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="text-surface-400 hover:text-brand-300 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                className="text-surface-400 hover:text-brand-300 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Email us"
                className="text-surface-400 hover:text-brand-300 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Quick Links</h3>
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
                    className="text-surface-400 hover:text-brand-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <EditableArea editPath={contentEditPath("footer", "phone")} label="Phone">
                <li className="text-surface-400">
                  <strong className="text-white">Phone:</strong>{" "}
                  <a
                    href={`tel:+1${phone.replace(/\D/g, "")}`}
                    className="hover:text-brand-300 transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              </EditableArea>
              <EditableArea editPath={contentEditPath("footer", "email")} label="Email">
                <li className="text-surface-400 break-all">
                  <strong className="text-white">Email:</strong>{" "}
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-brand-300 transition-colors"
                  >
                    {email}
                  </a>
                </li>
              </EditableArea>
              <EditableArea editPath={contentEditPath("footer", "hours")} label="Hours">
                <li className="text-surface-400">
                  <strong className="text-white">Hours:</strong> {hours}
                </li>
              </EditableArea>
              <EditableArea editPath={contentEditPath("footer", "service_area")} label="Service Area">
                <li className="text-surface-400">
                  <strong className="text-white">Service Area:</strong> {serviceArea}
                </li>
              </EditableArea>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-surface-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-surface-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LivelyLightingCo. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <PrivacyPolicy
              isOpen={isPrivacyOpen}
              onOpen={() => setIsPrivacyOpen(true)}
              onClose={() => setIsPrivacyOpen(false)}
            />
            {admin ? (
              <div className="flex flex-wrap items-center gap-3 max-w-full">
                <span className="text-surface-400 text-sm flex items-center gap-1 min-w-0">
                  <User className="h-4 w-4 flex-shrink-0" />
                  Logged in as: <span className="text-white break-all">{admin.username || admin.email || "Admin"}</span>
                </span>
                <button
                  onClick={signOut}
                  className="text-surface-400 hover:text-brand-300 transition-colors flex items-center gap-1 text-sm"
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
