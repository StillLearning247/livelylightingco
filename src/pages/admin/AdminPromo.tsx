import { useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ImageIcon,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import { useAdminPromos, ScheduledPromo } from "../../hooks/usePromoSettings";

// Helper to format date for datetime-local input
const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Format: YYYY-MM-DDTHH:MM
  return date.toISOString().slice(0, 16);
};

// Helper to format date for display
const formatDateForDisplay = (dateString: string | null): string => {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Get status badge for a promo
const getPromoStatus = (
  promo: ScheduledPromo,
  isCurrentlyActive: (p: ScheduledPromo) => boolean
): { label: string; color: string } => {
  if (!promo.is_active) {
    return { label: "Disabled", color: "bg-slate-100 text-slate-600" };
  }

  const now = new Date();

  if (promo.start_date && new Date(promo.start_date) > now) {
    return { label: "Scheduled", color: "bg-blue-100 text-blue-700" };
  }

  if (promo.end_date && new Date(promo.end_date) < now) {
    return { label: "Expired", color: "bg-orange-100 text-orange-700" };
  }

  if (isCurrentlyActive(promo)) {
    return { label: "Live Now", color: "bg-green-100 text-green-700" };
  }

  return { label: "Active", color: "bg-green-100 text-green-700" };
};

interface PromoFormData {
  name: string;
  image_url: string;
  start_date: string;
  end_date: string;
  priority: number;
  is_active: boolean;
}

const emptyFormData: PromoFormData = {
  name: "",
  image_url: "",
  start_date: "",
  end_date: "",
  priority: 0,
  is_active: true,
};

export const AdminPromo = () => {
  const {
    promos,
    loading,
    error,
    addPromo,
    updatePromo,
    deletePromo,
    toggleActive,
    isPromoCurrentlyActive,
  } = useAdminPromos();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PromoFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddNew = () => {
    setFormData(emptyFormData);
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (promo: ScheduledPromo) => {
    setFormData({
      name: promo.name,
      image_url: promo.image_url,
      start_date: formatDateForInput(promo.start_date),
      end_date: formatDateForInput(promo.end_date),
      priority: promo.priority,
      is_active: promo.is_active,
    });
    setEditingId(promo.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.image_url.trim()) {
      alert("Please fill in the name and image path");
      return;
    }

    setSaving(true);
    try {
      const promoData = {
        name: formData.name.trim(),
        image_url: formData.image_url.trim(),
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        priority: formData.priority,
        is_active: formData.is_active,
      };

      if (editingId) {
        await updatePromo(editingId, promoData);
      } else {
        await addPromo(promoData);
      }

      handleCancel();
    } catch (err) {
      console.error("Error saving promo:", err);
      alert("Failed to save promo. Please try again.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo?")) return;

    setDeletingId(id);
    try {
      await deletePromo(id);
    } catch (err) {
      console.error("Error deleting promo:", err);
      alert("Failed to delete promo. Please try again.");
    }
    setDeletingId(null);
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      await toggleActive(id, currentActive);
    } catch (err) {
      console.error("Error toggling promo:", err);
      alert("Failed to toggle promo. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scheduled Promos</h1>
          <p className="text-slate-600">
            Manage promotional popups with automatic scheduling
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Promo
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-medium text-red-900 mb-1">Database Error</h3>
          <p className="text-sm text-red-700">
            Could not load promos. Make sure the scheduled_promos table exists.
          </p>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">{error}</pre>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Promo" : "Add New Promo"}
              </h3>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Promo Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., New Years 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image Path *
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="/images/your-promo.png"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  Path to image in public folder or full URL
                </p>
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-auto max-h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave empty to start immediately
                </p>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Clock className="inline h-4 w-4 mr-1" />
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave empty to run indefinitely
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Higher priority promos show first when multiple are active
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">
                  Enable this promo
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_active ? "bg-green-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      formData.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {editingId ? "Save Changes" : "Add Promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promos List */}
      {promos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No promos yet
          </h3>
          <p className="text-slate-600 mb-4">
            Create your first scheduled promo to display on your website.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Promo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo) => {
            const status = getPromoStatus(promo, isPromoCurrentlyActive);
            const isExpanded = expandedId === promo.id;

            return (
              <div
                key={promo.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Main Row */}
                <div className="p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={promo.image_url}
                      alt={promo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {promo.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Priority: {promo.priority}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(promo.id, promo.is_active)}
                      className={`p-2 rounded-lg transition-colors ${
                        promo.is_active
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                      title={promo.is_active ? "Disable" : "Enable"}
                    >
                      {promo.is_active ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : promo.id)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(promo.id)}
                      disabled={deletingId === promo.id}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === promo.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Start:</span>{" "}
                        <span className="text-slate-900">
                          {formatDateForDisplay(promo.start_date)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">End:</span>{" "}
                        <span className="text-slate-900">
                          {formatDateForDisplay(promo.end_date)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Image:</span>{" "}
                        <span className="text-slate-900 break-all">
                          {promo.image_url}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(promo)}
                      className="mt-4 w-full px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Edit Promo
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">How scheduling works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            - <strong>Start Date:</strong> Promo won't show until this date/time
          </li>
          <li>
            - <strong>End Date:</strong> Promo automatically stops after this date/time
          </li>
          <li>
            - <strong>Priority:</strong> When multiple promos are active, highest priority shows
          </li>
          <li>
            - <strong>Toggle:</strong> Quickly enable/disable without changing dates
          </li>
          <li>
            - Visitors see the popup once per browser session
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPromo;
