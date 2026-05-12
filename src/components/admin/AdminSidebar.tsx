import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FileText,
  MessageSquareQuote,
  Megaphone,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { useAdmin } from "../AdminProvider";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/gallery", icon: Image, label: "Gallery" },
  { to: "/admin/content", icon: FileText, label: "Page Content" },
  { to: "/admin/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
  { to: "/admin/promo", icon: Megaphone, label: "Promo Popup" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { admin, signOut } = useAdmin();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - sticky on desktop, fixed on mobile */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-800 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 overflow-y-auto flex-shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src="/images/lively-logo.jpg"
              alt="Logo"
              className="h-8 w-8 rounded"
            />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-700 rounded"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        {admin && (
          <div className="px-4 py-3 border-b border-slate-700 text-sm">
            <p className="text-slate-400">Logged in as</p>
            <p className="font-medium truncate">
              {admin.username || admin.email}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign out button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
