import { useState, useEffect } from "react";
import { Loader2, Save, ImageIcon, Eye, EyeOff } from "lucide-react";
import { useAdminPromoSettings } from "../../hooks/usePromoSettings";

export const AdminPromo = () => {
  const { settings, loading, error, toggleEnabled, updateImageUrl } = useAdminPromoSettings();
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Debug: log settings changes
  useEffect(() => {
    console.log("Promo settings:", settings);
    if (error) {
      console.error("Promo settings error:", error);
    }
  }, [settings, error]);

  // Sync local state with loaded settings
  useEffect(() => {
    if (settings?.image_url) {
      setImageUrl(settings.image_url);
    }
  }, [settings?.image_url]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleEnabled();
    } catch (err) {
      console.error("Error toggling promo:", err);
      alert("Failed to toggle promo. Please try again.");
    }
    setToggling(false);
  };

  const handleSaveImage = async () => {
    if (!imageUrl.trim()) {
      alert("Please enter an image URL or path");
      return;
    }

    setSaving(true);
    try {
      await updateImageUrl(imageUrl.trim());
      alert("Promo image updated successfully!");
    } catch (err) {
      console.error("Error saving image URL:", err);
      alert("Failed to save image. Please try again.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const currentImageUrl = imageUrl || settings?.image_url || "/images/NewYears flyer2026.png";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Promo Popup</h1>
        <p className="text-slate-600">
          Manage the promotional popup that appears when visitors first arrive
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-medium text-red-900 mb-1">Database Error</h3>
          <p className="text-sm text-red-700">
            Could not load promo settings. Make sure the promo_settings table exists in Supabase.
          </p>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">{error}</pre>
        </div>
      )}

      {/* No settings warning */}
      {!error && !settings?.id && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-medium text-yellow-900 mb-1">Setup Required</h3>
          <p className="text-sm text-yellow-700">
            No promo settings found in database. Click the toggle to create initial settings.
          </p>
        </div>
      )}

      {/* Enable/Disable Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {settings?.enabled ? (
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-slate-100 rounded-lg">
                <EyeOff className="h-6 w-6 text-slate-400" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Popup Status
              </h2>
              <p className="text-slate-600">
                {settings?.enabled
                  ? "The promo popup is currently visible to visitors"
                  : "The promo popup is currently hidden"}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              settings?.enabled ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            {toggling ? (
              <Loader2 className="h-4 w-4 animate-spin absolute left-1/2 -translate-x-1/2 text-white" />
            ) : (
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  settings?.enabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Image Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Promo Image</h2>
        </div>

        <div className="space-y-4">
          {/* Current Image Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Image Preview
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 max-w-md">
              <img
                src={currentImageUrl}
                alt="Current promo"
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/placeholder.png";
                }}
              />
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Image Path or URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="imageUrl"
                value={imageUrl || settings?.image_url || ""}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/your-promo-image.png"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSaveImage}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Enter a path to an image in your public folder (e.g.,
              /images/promo.png) or a full URL
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            - The popup appears once per browser session when a visitor first
            arrives
          </li>
          <li>- Visitors can close it by clicking the X or clicking outside</li>
          <li>
            - To change the promo image, upload a new image to the{" "}
            <code className="bg-blue-100 px-1 rounded">public/images</code>{" "}
            folder
          </li>
          <li>
            - Then update the image path above (e.g.,
            /images/your-new-promo.png)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPromo;
