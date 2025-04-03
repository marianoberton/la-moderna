'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ClientImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function ClientImage({
  src,
  alt,
  className = '',
  width = 320,
  height = 208,
  priority = false
}: ClientImageProps) {
  const [error, setError] = useState(false);

  // Si hay un error, mostrar una imagen de placeholder
  if (error) {
    return (
      <Image
        src="/placeholder-car.jpg"
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  );
} 