import { useState } from 'react';
import { Feather } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3ECF0] via-[#FAF8F9] to-[#EFE5EA] text-[#6B5E65] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Feather className="w-6 h-6 text-[#C81E4C]/70 mb-2" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="font-serif text-sm text-[#1B1518] max-w-xs">{fallbackTitle}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
