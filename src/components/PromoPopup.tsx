import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useActivePromo } from "../hooks/usePromoSettings";

const PROMO_DISMISSED_KEY = "promo_popup_dismissed";

export const PromoPopup = () => {
  const { promo, loading } = useActivePromo();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup should be shown
    if (loading) return;

    // Don't show if no active promo
    if (!promo) return;

    // Check if user has already dismissed this session
    const dismissed = sessionStorage.getItem(PROMO_DISMISSED_KEY);
    if (dismissed) return;

    // Show popup after a brief delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }, 500);

    return () => clearTimeout(timer);
  }, [promo, loading]);

  const handleClose = () => {
    setIsVisible(false);
    document.body.style.overflow = "";
    // Remember that user dismissed the popup for this session
    sessionStorage.setItem(PROMO_DISMISSED_KEY, "true");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible]);

  if (!isVisible || !promo?.image_url) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        className="relative max-w-lg w-full animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors group"
          aria-label="Close promotional popup"
        >
          <X className="h-6 w-6 text-gray-600 group-hover:text-gray-900" />
        </button>

        {/* Promo image */}
        <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
          <img
            src={promo.image_url}
            alt={promo.name || "Special promotion"}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
