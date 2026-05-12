import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Save, Loader2, Check, FileText, Edit2, X } from "lucide-react";
import { useAllContent } from "../../hooks/useContent";
import { RichTextEditor } from "../../components/admin/RichTextEditor";

interface ContentSection {
  key: string;
  label: string;
  description?: string;
}

const PAGE_SECTIONS: Record<string, ContentSection[]> = {
  home: [
    { key: "hero_title", label: "Hero Title", description: "Main headline on the homepage" },
    { key: "hero_subtitle", label: "Hero Subtitle", description: "Text below the main headline" },
    { key: "floating_banner", label: "Banner Text", description: "Scrolling banner at the top" },
    { key: "gallery_title", label: "Gallery Title" },
    { key: "gallery_description", label: "Gallery Description" },
    { key: "testimonials_title", label: "Testimonials Title" },
    { key: "testimonials_description", label: "Testimonials Description" },
    { key: "difference_title", label: "Why Choose Us Title" },
    { key: "difference_description", label: "Why Choose Us Description" },
  ],
  about: [
    { key: "page_title", label: "Page Title" },
    { key: "page_subtitle", label: "Page Subtitle" },
    { key: "mission_title", label: "Mission Title" },
    { key: "mission_text", label: "Mission Text" },
    { key: "service_area_title", label: "Service Area Title" },
    { key: "service_area_intro", label: "Service Area Introduction" },
    { key: "service_areas_list", label: "Service Areas List", description: "Comma-separated list of cities (e.g., Austin, Round Rock, Cedar Park)" },
  ],
  contact: [
    { key: "form_title", label: "Form Title" },
    { key: "consultation_title", label: "Consultation Title" },
    { key: "consultation_description", label: "Consultation Description" },
  ],
  footer: [
    { key: "tagline", label: "Company Tagline", description: "Short description under the logo" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email Address" },
    { key: "hours", label: "Business Hours" },
    { key: "service_area", label: "Service Area", description: "e.g., Austin, TX and surrounding areas" },
    { key: "facebook_url", label: "Facebook URL" },
    { key: "youtube_url", label: "YouTube URL" },
  ],
};

const PAGES = [
  { id: "home", label: "Home Page" },
  { id: "about", label: "About Page" },
  { id: "contact", label: "Contact Page" },
  { id: "footer", label: "Footer" },
];

// Default content values (shown when database doesn't have the value yet)
const DEFAULT_CONTENT: Record<string, Record<string, string>> = {
  home: {
    hero_title: "Permanent Outdoor Lighting. Expertly Installed",
    hero_subtitle: "Year-round custom lighting. No hassle or ugly wires. All controlled from your phone. Installed by Govee lighting experts.",
    floating_banner: "*BEST PRICE GUARANTEE* We will beat any quote from Jellyfish, Trimlight, Oelo or Gemstone (Astoria).",
    gallery_title: "Our Work",
    gallery_description: "Browse our gallery of beautiful lighting installations. Each project is custom designed to complement the home's architecture.",
    testimonials_title: "What Our Customers Say",
    testimonials_description: "Don't just take our word for it. Here's what homeowners think about our service.",
    difference_title: "Why Choose LivelyLightingCo",
    difference_description: "Don't let a bad installation ruin your investment. We bring unmatched expertise to every project.",
  },
  about: {
    page_title: "About LivelyLightingCo",
    page_subtitle: "Austin's Premier Govee Permanent Lighting Installers",
    mission_title: "Our Mission",
    mission_text: "To provide homeowners with beautiful, professional permanent lighting installations that enhance their homes year-round.",
    service_area_title: "Service Area",
    service_area_intro: "Proudly serving Texas and Oklahoma — from the Hill Country to the Plains, we bring premium Govee lighting installations to homeowners across both states.",
    service_areas_list: "Greater Austin, Dallas–Fort Worth, Greater Houston, San Antonio, Oklahoma City Metro, Tulsa Metro",
  },
  contact: {
    form_title: "Request a Free Quote",
    consultation_title: "Get Your Free Consultation",
    consultation_description: "Fill out the form and we'll get back to you within 24 hours to schedule your free in-home consultation.",
  },
  footer: {
    tagline: "Experience Permanent Light Installations at an Affordable Price. Govee, Asahom, Eufy and Enbrighten.",
    phone: "(737)-423-7246",
    email: "installs@livelylightingco.com",
    hours: "Mon-Fri: 9am-6pm",
    service_area: "Proudly serving Texas and Oklahoma",
    facebook_url: "https://facebook.com/livelylightingco",
    youtube_url: "https://www.youtube.com/channel/UChIr1JGEiGCqtX_2fl1gfNQ",
  },
};

export const AdminContent = () => {
  const { content, loading, updateContent } = useAllContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState("home");
  const [editingSection, setEditingSection] = useState<{ page: string; section: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Get content value for a specific page/section (with fallback to defaults)
  const getContentValue = (page: string, section: string): string => {
    const item = content.find((c) => c.page === page && c.section === section);
    if (item?.content) return item.content;
    // Return default value if database doesn't have this content yet
    return DEFAULT_CONTENT[page]?.[section] || "";
  };

  // Handle URL query params to auto-open editor
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const sectionParam = searchParams.get("section");

    if (pageParam && sectionParam && content.length > 0) {
      // Set active page tab
      if (["home", "about", "contact", "footer"].includes(pageParam)) {
        setActivePage(pageParam);
      }
      // Open editor for this section
      setEditValue(getContentValue(pageParam, sectionParam));
      setEditingSection({ page: pageParam, section: sectionParam });
      // Clear the params so it doesn't reopen on every render
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, content]);

  // Open edit modal
  const handleEdit = (page: string, section: string) => {
    setEditValue(getContentValue(page, section));
    setEditingSection({ page, section });
  };

  // Save changes
  const handleSave = async () => {
    if (!editingSection) return;

    setSaving(true);
    try {
      await updateContent(editingSection.page, editingSection.section, editValue);
      setEditingSection(null);
    } catch (err) {
      console.error("Error saving content:", err);
      alert("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  // Close modal
  const handleClose = () => {
    setEditingSection(null);
    setEditValue("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const sections = PAGE_SECTIONS[activePage] || [];

  // Get the label for the currently editing section
  const editingSectionLabel = editingSection
    ? sections.find((s) => s.key === editingSection.section)?.label || editingSection.section
    : "";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Page Content</h1>
        <p className="text-slate-600">Edit text content across your website</p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activePage === page.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Content Cards */}
      {sections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No content sections
          </h3>
          <p className="text-slate-600">
            This page doesn't have any editable content sections yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const value = getContentValue(activePage, section.key);

            return (
              <ContentCard
                key={section.key}
                label={section.label}
                description={section.description}
                content={value}
                onEdit={() => handleEdit(activePage, section.key)}
              />
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Edit {editingSectionLabel}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <RichTextEditor
              content={editValue}
              onChange={setEditValue}
              placeholder={`Enter ${editingSectionLabel.toLowerCase()}...`}
            />

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ContentCardProps {
  label: string;
  description?: string;
  content: string;
  onEdit: () => void;
}

const ContentCard = ({ label, description, content, onEdit }: ContentCardProps) => {
  // Strip HTML tags for preview
  const plainText = content.replace(/<[^>]*>/g, "").trim();
  const isEmpty = !plainText;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900">{label}</span>
          </div>
          {description && (
            <p className="text-sm text-slate-500 mb-2">{description}</p>
          )}
          <div className="mt-2">
            {isEmpty ? (
              <p className="text-slate-400 italic">No content yet. Click edit to add.</p>
            ) : (
              <p className="text-slate-700 line-clamp-3">{plainText}</p>
            )}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          title="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminContent;
