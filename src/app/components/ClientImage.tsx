'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ClientImage({ src, alt, className, width, height }: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const [error, setError] = useState(false);
  
  return (
    error ? (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Imagen no disponible</span>
      </div>
    ) : (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className={className} 
        onError={() => setError(true)}
      />
    )
  );
} 