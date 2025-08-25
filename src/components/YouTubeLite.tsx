import React, { useState } from "react";

type YouTubeLiteProps = {
  id: string; // YouTube video ID
  title?: string;
  className?: string;
  ratio?: string | number; // e.g. "16 / 9" (default), "16 / 8.5", "4 / 3"
  start?: number; // optional start time (seconds)
};

const YouTubeLite: React.FC<YouTubeLiteProps> = ({
  id,
  title = "YouTube video",
  className = "",
  ratio = "21 / 9",
  start = 0,
}) => {
  const [playing, setPlaying] = useState(false);

  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&playsinline=1&rel=0&modestbranding=1&start=${start}`;

  // Thumbnails (fallback to HQ if maxres isn't available)
  const thumbMax = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const thumbHQ = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl shadow-lg ${className}`}
      style={{ aspectRatio: ratio as any }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full text-left"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={thumbMax}
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).src = thumbHQ)
            }
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40"
          />
          <span
            aria-hidden
            className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full bg-white/90 text-red-600 shadow-lg transition group-hover:bg-white"
          >
            {/* Play icon */}
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

export default YouTubeLite;
