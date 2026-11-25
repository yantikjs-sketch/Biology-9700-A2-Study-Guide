import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface DiagramImageCardProps {
  src: string;
  alt: string;
  title: string;
  syllabusTag: string;
  caption: string;
  keyStructures: string[];
}

export const DiagramImageCard: React.FC<DiagramImageCardProps> = ({
  src,
  alt,
  title,
  syllabusTag,
  caption,
  keyStructures,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-500">{syllabusTag}</p>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="block w-full h-auto max-h-[360px] object-contain"
          />
        ) : (
          <div className="flex h-60 sm:h-68 w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-emerald-50 p-6 text-center">
            <ImageIcon className="h-8 w-8 text-slate-400" />
            <p className="text-base font-medium text-slate-700">{title}</p>
            <p className="text-sm text-slate-500">{caption}</p>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <p className="text-base leading-relaxed text-slate-700">{caption}</p>
        <ul className="space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
          {keyStructures.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
