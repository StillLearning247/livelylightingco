import React from "react";

interface YouTubeLiteProps {
  id: string;
  title: string;
  className?: string;
}

const YouTubeLite: React.FC<YouTubeLiteProps> = ({ id, title, className }) => {
  // component implementation
  return (
    <div className={className}>
      {/* Your YouTube embed logic here, using id and title */}
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeLite;
