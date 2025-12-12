import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminProvider";
import { Edit2 } from "lucide-react";

interface EditableAreaProps {
  children: React.ReactNode;
  /** The admin route to navigate to */
  editPath: string;
  /** Optional label shown on hover */
  label?: string;
  /** Additional class names */
  className?: string;
  /** Whether to use inline display */
  inline?: boolean;
}

/**
 * Wraps content to make it editable by admin users.
 * - Shows edit indicator on hover when logged in as admin
 * - Double-click navigates to the admin editor
 */
export const EditableArea = ({
  children,
  editPath,
  label,
  className = "",
  inline = false,
}: EditableAreaProps) => {
  const { admin } = useAdmin();
  const navigate = useNavigate();

  // If not admin, just render children without any wrapper functionality
  if (!admin) {
    return <>{children}</>;
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(editPath);
  };

  const Tag = inline ? "span" : "div";

  return (
    <Tag
      className={`group/edit relative cursor-pointer ${className}`}
      onDoubleClick={handleDoubleClick}
      title={label ? `Double-click to edit: ${label}` : "Double-click to edit"}
    >
      {/* Edit indicator - shows on hover */}
      <div className="absolute -top-2 -right-2 z-50 opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Edit2 className="h-3 w-3" />
          <span className="hidden sm:inline">{label || "Edit"}</span>
        </div>
      </div>

      {/* Highlight border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover/edit:border-indigo-500 group-hover/edit:border-dashed rounded-lg pointer-events-none transition-colors" />

      {children}
    </Tag>
  );
};

/**
 * Helper to create edit paths for content sections
 */
export const contentEditPath = (page: string, section: string) =>
  `/admin/content?page=${page}&section=${section}`;

export default EditableArea;
