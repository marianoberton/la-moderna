'use client';

import Navbar from './components/Navbar';
import NavbarSpacer from './components/NavbarSpacer';
import Footer from './components/Footer';
import ThemeProvider from './components/ThemeProvider';
import WhatsAppButton from './components/WhatsAppButton';
import { usePathname } from 'next/navigation';

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <ThemeProvider>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <NavbarSpacer />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </ThemeProvider>
  );
} 