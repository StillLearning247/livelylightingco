import { useState } from "react";
import { Trash2, GripVertical, Plus, Loader2, ImageIcon } from "lucide-react";
import { useAdminGallery, GalleryImage } from "../../hooks/useGallery";
import cld from "../../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";

export const AdminGallery = () => {
  const { images, loading, addImage, deleteImage, updateImage } = useAdminGallery();
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
          <p className="text-slate-600">Manage your installation photos</p>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
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
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={() => setDeleteConfirm(image.id)}
              onTitleChange={(title) => handleTitleChange(image.id, title)}
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
  onDelete: () => void;
  onTitleChange: (title: string) => void;
}

const ImageCard = ({ image, onDelete, onTitleChange }: ImageCardProps) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
      <div className="relative aspect-[4/3]">
        <img
          src={imageUrl}
          alt={image.title || "Gallery image"}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onDelete}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Delete image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <div className="p-2 bg-white/90 rounded-lg">
              <GripVertical className="h-4 w-4 text-slate-600" />
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
