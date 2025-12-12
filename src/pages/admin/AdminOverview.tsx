import { Link } from "react-router-dom";
import { Image, FileText, MessageSquareQuote, ArrowRight } from "lucide-react";

const quickLinks = [
  {
    to: "/admin/gallery",
    icon: Image,
    title: "Gallery",
    description: "Manage photos and images",
    color: "bg-blue-500",
  },
  {
    to: "/admin/content",
    icon: FileText,
    title: "Page Content",
    description: "Edit text on all pages",
    color: "bg-green-500",
  },
  {
    to: "/admin/testimonials",
    icon: MessageSquareQuote,
    title: "Testimonials",
    description: "Manage customer reviews",
    color: "bg-purple-500",
  },
];

export const AdminOverview = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-slate-600 mt-1">
          Manage your website content from here.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${link.color} text-white mb-4`}
            >
              <link.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              {link.title}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-slate-600 text-sm mt-1">{link.description}</p>
          </Link>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Getting Started
        </h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
              1
            </span>
            <span>
              <strong>Gallery:</strong> Upload new installation photos or remove
              old ones. Drag to reorder.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
              2
            </span>
            <span>
              <strong>Page Content:</strong> Edit any text on the website -
              headings, descriptions, and more.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
              3
            </span>
            <span>
              <strong>Testimonials:</strong> Add, edit, or remove customer
              reviews.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminOverview;
