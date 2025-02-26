import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface-2 text-primary pt-12 pb-4 px-[5%] border-t border-border-light">
      <div className="flex flex-wrap justify-between gap-8 mb-8 max-w-7xl mx-auto">
        <div className="flex-1 min-w-[200px]">
          <div className="mb-4">
            <Image 
              src="/images/La moderna fondo blanco letra negra-1.png" 
              alt="La Moderna" 
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <p className="text-muted">Tu concesionaria de confianza en el campo argentino</p>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-xl mb-4 font-heading font-bold uppercase">Navegación</h3>
          <ul>
            <li className="mb-2">
              <Link href="/vehiculos" className="text-muted hover:text-accent transition-colors">
                Todos los Vehículos
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/vehiculos/nuevos" className="text-muted hover:text-accent transition-colors">
                0km
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/vehiculos/usados" className="text-muted hover:text-accent transition-colors">
                Usados
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/nosotros" className="text-muted hover:text-accent transition-colors">
                Quienes Somos
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/contacto" className="text-muted hover:text-accent transition-colors">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-xl mb-4 font-heading font-bold uppercase">Contacto</h3>
          <p className="mb-3 flex items-center text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ruta Provincial 123, Km 45, Buenos Aires
          </p>
          <p className="mb-3 flex items-center text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (011) 4567-8900
          </p>
          <p className="mb-3 flex items-center text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@lamoderna.com
          </p>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-xl mb-4 font-heading font-bold uppercase">Síguenos</h3>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-surface rounded-full flex justify-center items-center hover:bg-accent hover:text-white transition-colors border border-border-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-surface rounded-full flex justify-center items-center hover:bg-accent hover:text-white transition-colors border border-border-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-surface rounded-full flex justify-center items-center hover:bg-accent hover:text-white transition-colors border border-border-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-surface rounded-full flex justify-center items-center hover:bg-accent hover:text-white transition-colors border border-border-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>
          <div className="mt-6">
            <h4 className="text-lg mb-2 font-heading font-bold">Horario de Atención</h4>
            <p className="text-muted">Lunes a Viernes: 9:00 - 18:00</p>
            <p className="text-muted">Sábados: 9:00 - 13:00</p>
          </div>
        </div>
      </div>
      
      <div className="pt-6 text-center border-t border-border-light">
        <p className="text-muted">&copy; 2023 La Moderna. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
} 