'use client';

import { usePathname } from 'next/navigation';

export default function NavbarSpacer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Solo mostrar el espaciador si no estamos en la página de inicio
  if (isHomePage) {
    return null;
  }
  
  return (
    <div className="w-full h-16 md:h-20" aria-hidden="true">
      {/* Este div simplemente actúa como un espaciador invisible con la misma altura que la navbar */}
    </div>
  );
} 