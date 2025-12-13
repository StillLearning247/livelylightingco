import { useState } from "react";
import { Trash2, GripVertical, Plus, Loader2, ImageIcon, Save, X } from "lucide-react";
import { useAdminGallery, GalleryImage } from "../../hooks/useGallery";
import cld from "../../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";

export const AdminGallery = () => {
  const { images, loading, addImage, deleteImage, updateImage, reorderImages } = useAdminGallery();
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [localImages, setLocalImages] = useState<GalleryImage[] | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Use local state if we have unsaved reordering, otherwise use server state
  const displayImages = localImages || images;

  const handleUpload = () => {
    // @ts-ignore - Cloudinary widget
    if (window.cloudinary) {
      // @ts-ignore
      window.cloudinary.openUploadWidget(
        {
          cloudName: "dydz0lw6e",
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default",
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFiles: 10,
          resourceType: "image",
          folder: "livelylighting/gallery",
        },
        async (error: any, result: any) => {
          if (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
            return;
          }

          if (result.event === "success") {
            setUploading(true);
            try {
              await addImage(
                result.info.public_id,
                result.info.public_id,
                result.info.original_filename || ""
              );
            } catch (err) {
              console.error("Error saving image:", err);
              alert("Failed to save image. Please try again.");
            }
            setUploading(false);
          }
        }
      );
    } else {
      alert("Cloudinary widget not loaded. Please refresh the page.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleTitleChange = async (id: string, title: string) => {
    try {
      await updateImage(id, { title });
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Required for HTML5 drag and drop to work
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));

    setDraggedIndex(index);
    // Initialize local state if not already
    if (!localImages) {
      setLocalImages([...images]);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const currentImages = localImages || [...images];
    const newImages = [...currentImages];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    setLocalImages(newImages);
    setHasUnsavedChanges(true);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    if (!localImages) return;
    setSaving(true);
    try {
      await reorderImages(localImages);
      setLocalImages(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to save order. Please try again.");
    }
    setSaving(false);
  };

  const handleCancelReorder = () => {
    setLocalImages(null);
    setHasUnsavedChanges(false);
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
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-600">
            {hasUnsavedChanges
              ? "Drag images to reorder, then save your changes"
              : "Manage your installation photos - drag to reorder"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <>
              <button
                onClick={handleCancelReorder}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Save Order
              </button>
            </>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading || saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            Upload Images
          </button>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {hasUnsavedChanges && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-800">
          <span className="font-medium">You have unsaved changes.</span>
          <span>Click "Save Order" to apply the new arrangement.</span>
        </div>
      )}

      {images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No images yet
          </h3>
          <p className="text-slate-600 mb-4">
            Upload your first installation photo to get started.
          </p>
          <button
            onClick={handleUpload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Upload Images
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayImages.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              isDragging={draggedIndex === index}
              isDragOver={dragOverIndex === index}
              onDelete={() => setDeleteConfirm(image.id)}
              onTitleChange={(title) => handleTitleChange(image.id, title)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Delete Image?
            </h3>
            <p className="text-slate-600 mb-6">
              This action cannot be undone. The image will be permanently removed
              from the gallery.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ImageCardProps {
  image: GalleryImage;
  index: number;
  isDragging: boolean;
  isDragOver: boolean;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

const ImageCard = ({
  image,
  index,
  isDragging,
  isDragOver,
  onDelete,
  onTitleChange,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: ImageCardProps) => {
  const [title, setTitle] = useState(image.title);

  // Use the same Cloudinary library as the public gallery
  const cldImage = cld.image(image.cloudinary_public_id);
  cldImage
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(400).height(300));
  const imageUrl = cldImage.toURL();

  const handleBlur = () => {
    if (title !== image.title) {
      onTitleChange(title);
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`relative bg-white rounded-xl shadow-sm border-2 overflow-hidden group cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? "opacity-50 scale-95 border-indigo-400 shadow-lg"
          : isDragOver
          ? "border-indigo-500 scale-[1.02] shadow-lg ring-2 ring-indigo-200"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Position indicator */}
      <div className="absolute top-2 left-2 z-20 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full">
        #{index + 1}
      </div>

      <div className="relative aspect-[4/3]">
        <img
          src={imageUrl}
          alt={image.title || "Gallery image"}
          className="w-full h-full object-cover pointer-events-none"
          crossOrigin="anonymous"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Delete image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 bg-white/90 rounded-lg flex items-center gap-1">
              <GripVertical className="h-4 w-4 text-slate-600" />
              <span className="text-xs text-slate-600 font-medium">Drag to reorder</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          placeholder="Add a title..."
          className="w-full text-sm text-slate-700 placeholder-slate-400 border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 px-0 py-1"
        />
      </div>
    </div>
  );
};

export default AdminGallery;
