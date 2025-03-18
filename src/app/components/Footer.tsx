import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-background text-foreground pt-8 pb-4 px-[5%] border-t border-border">
      <div className="flex flex-wrap justify-between md:gap-8 gap-6 mb-6 max-w-7xl mx-auto">
        {/* Logo y redes sociales - Primero en mobile */}
        <div className="flex-1 min-w-[200px] flex flex-col md:items-end items-center justify-start md:w-auto w-full md:order-5 order-1 md:mt-0 mb-4">
          <div className="mb-3">
            <Image 
              src="/images/logo_full.svg" 
              alt="La Moderna" 
              width={160}
              height={40}
              className="h-10 w-auto dark:invert"
            />
          </div>
          <p className="text-muted-foreground text-sm mb-4 md:text-right text-center">Tu concesionaria de confianza desde 1995</p>
          
          <div className="flex gap-3 mb-3">
            <a href="#" className="w-9 h-9 bg-card rounded-full flex justify-center items-center hover:bg-primary hover:text-primary-foreground transition-colors border border-border">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-card rounded-full flex justify-center items-center hover:bg-primary hover:text-primary-foreground transition-colors border border-border">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Navegación - Segundo en mobile */}
        <div className="flex-1 min-w-[200px] md:text-left text-center md:items-start items-center md:w-auto w-full md:order-1 order-2">
          <h3 className="text-base mb-3 font-bold uppercase text-foreground">Navegación</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2">
            <Link href="/vehiculos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Todos los Vehículos
            </Link>
            <Link href="/vehiculos/nuevos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              0km
            </Link>
            <Link href="/vehiculos/usados" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Usados
            </Link>
            <Link href="/nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Quienes Somos
            </Link>
            <Link href="/contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </div>
        </div>
        
        {/* La Moderna T. Lauquen - Tercero en mobile */}
        <div className="flex-1 min-w-[180px] md:text-left text-center md:w-auto w-full md:order-2 order-3">
          <h3 className="text-base mb-3 font-bold uppercase text-foreground">La Moderna T. Lauquen</h3>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Pasteur+1073+Trenque+Lauquen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex md:justify-start justify-center items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pasteur 1073, T. Lauquen
          </a>
        </div>
        
        {/* La Moderna Pehuajo - Cuarto en mobile */}
        <div className="flex-1 min-w-[180px] md:text-left text-center md:w-auto w-full md:order-3 order-4">
          <h3 className="text-base mb-3 font-bold uppercase text-foreground">La Moderna Pehuajo</h3>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Ruta+5+Km+370+Pehuajo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex md:justify-start justify-center items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ruta 5 Km 370, Pehuajo
          </a>
        </div>
        
        {/* Horario de Atención - Quinto en mobile */}
        <div className="flex-1 min-w-[180px] md:text-left text-center md:w-auto w-full md:order-4 order-5">
          <h3 className="text-base mb-3 font-bold uppercase text-foreground">Horario de Atención</h3>
          <p className="text-sm text-muted-foreground">Lunes a Viernes: 9:00 - 18:00</p>
          <p className="text-sm text-muted-foreground">Sábados: 9:00 - 13:00</p>
        </div>
      </div>
      
      <div className="pt-3 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} La Moderna. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}