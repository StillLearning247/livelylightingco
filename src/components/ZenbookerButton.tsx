import { useEffect } from 'react';

export const ZenbookerButton = () => {
  useEffect(() => {
    // Load Zenbooker CSS
    const zenCSS = document.createElement('link');
    zenCSS.rel = 'stylesheet';
    zenCSS.href = 'https://cdn.zenbooker.com/widget/latest/zenbooker.css';
    document.head.appendChild(zenCSS);

    // Load Zenbooker script
    const zenScript = document.createElement('script');
    zenScript.src = 'https://cdn.zenbooker.com/widget/latest/zenbooker.js';
    zenScript.async = true;
    document.body.appendChild(zenScript);

    return () => {
      // Clean up when component unmounts
      document.head.removeChild(zenCSS);
      document.body.removeChild(zenScript);
    };
  }, []);

  return (
    <div className="text-center">
      <button
        id="IMuG-trigger"
        style={{
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '20px',
          backgroundColor: '#2196F3',
          cursor: 'pointer',
          padding: '0.75rem 1.5rem',
          border: 'none'
        }}
        onClick={() =>
          window.Zenbooker?.showPopupWidget(
            'https://widget.zenbooker.com/book/1724689463359x510699585134110500?embed=true'
          )
        }
      >
        Book Online
      </button>
    </div>
  );
};