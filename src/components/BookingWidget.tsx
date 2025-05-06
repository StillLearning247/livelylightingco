import React from "react";

interface BookingWidgetProps {
  className?: string;
}

const VCITA_URL = import.meta.env.VITE_VCITA_URL;

export const BookingWidget: React.FC<BookingWidgetProps> = ({ className }) => {
  const handleClick = () => {
    if (!VCITA_URL) {
      console.error("vCita URL not configured");
      return;
    }

    window.open(VCITA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      Book Installation
    </button>
  );
};
