import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverImageProps {
  src: string;
  title: string;
  author?: string;
  className?: string;
}

export function BookCoverImage({ src, title, author, className = '' }: BookCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-zinc-900 via-[#18181B] to-zinc-950 flex flex-col items-center justify-center p-5 text-center border-b border-zinc-800 ${className}`}
        role="img"
        aria-label={`غلاف كتاب ${title}`}
      >
        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#FACC15] mb-3">
          <BookOpen className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <p className="font-display font-semibold text-sm text-zinc-100 line-clamp-2 leading-snug">
          {title}
        </p>
        {author && (
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-1">{author}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`غلاف كتاب ${title}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
