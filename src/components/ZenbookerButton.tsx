import React from 'react';

interface ZenbookerButtonProps {
  className?: string;
}

export const ZenbookerButton: React.FC<ZenbookerButtonProps> = ({ className }) => {
  const handleClick = () => {
    window.open(
      'https://widget.zenbooker.com/book/1724689463359x510699585134110500',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      Book Online
    </button>
  );
};

// Add TypeScript declaration for window object
declare global {
  interface Window {
    Zenbooker?: {
      showPopupWidget: (url: string) => void;
    };
  }
}