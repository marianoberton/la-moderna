'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Oswald } from 'next/font/google';

// Keep the existing logoFont definition
const logoFont = Oswald({ subsets: ['latin'] });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();
  
  // Determinar si estamos en la página de inicio
  const isHomePage = pathname === '/';

  const navItems = [
    { href: '/vehiculos', label: 'Vehículos' },
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ];

  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para determinar las clases de la navbar según la página y el scroll
  const getNavbarClasses = () => {
    // Si no estamos en la página principal, siempre mostramos un fondo sólido
    if (!isHomePage) {
      return 'bg-background shadow-md';
    }
    
    // En la página principal, el comportamiento depende del scroll
    return hasScrolled ? 'bg-white shadow-md' : 'bg-transparent';
  };

  // Función para determinar el color del texto según la página y el scroll
  const getLinkClasses = () => {
    // En la página principal, el texto depende del scroll
    if (isHomePage) {
      return hasScrolled ? 'text-black hover:text-[var(--color-dark-bg)]' : 'text-white hover:text-[var(--color-gold)]';
    }
    
    // En otras páginas, usamos el color de texto por defecto
    return 'text-foreground hover:text-primary';
  };

  // Función para determinar las clases del botón de menú
  const getMenuButtonClasses = () => {
    if (isHomePage) {
      return hasScrolled ? 'text-black' : 'text-white';
    }
    return 'text-foreground';
  };

  // Función para determinar las clases del logo
  const getLogoClasses = () => {
    if (isHomePage) {
      return hasScrolled ? 'h-8 sm:h-9 md:h-10 w-auto' : 'h-8 sm:h-9 md:h-10 w-auto filter brightness-0 invert';
    }
    return 'h-8 sm:h-9 md:h-10 w-auto dark:invert';
  };

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${getNavbarClasses()}`}>
      <div className="container flex h-16 md:h-20 items-center px-3 sm:px-6">
        <div className="flex w-full justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo_full.svg"
              alt="La Moderna"
              width={160}
              height={40}
              className={getLogoClasses()}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium uppercase transition-colors ${getLinkClasses()}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className={`flex items-center justify-center h-12 w-12 ${getMenuButtonClasses()}`}>
                  <Menu className="h-8 w-8" />
                  <span className="sr-only">Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="mt-8 flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium uppercase text-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}