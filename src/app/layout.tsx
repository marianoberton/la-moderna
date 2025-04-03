import type { Metadata, Viewport } from "next";
import { Montserrat, Oswald, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "./ClientLayoutWrapper";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "La Moderna - Concesionaria de Autos",
  description: "Tu concesionaria de autos de confianza desde 1995",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>La Moderna - Vehículos</title>
        <meta name="description" content="Concesionaria de vehículos - La Moderna" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={`min-h-screen ${montserrat.variable} ${oswald.variable} ${robotoMono.variable} antialiased`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
          duration={4000}
        />
      </body>
    </html>
  );
} 