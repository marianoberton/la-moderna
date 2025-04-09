'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeDollarSign, RefreshCw, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Datos de las concesionarias
const concesionarias = [
  { 
    id: 1, 
    nombre: "La Moderna T. Lauquen", 
    whatsapp: "5491154645940",
    direccion: "Av. Garcia Salinas 1163"
  },
  { 
    id: 2, 
    nombre: "La Moderna Pehuajo", 
    whatsapp: "5492396625108",
    direccion: "Acceso Pres. Nestor C. Kirchner 1151"
  }
];

export default function CtaExchange() {
  const [showConcesionarias, setShowConcesionarias] = useState(false);

  // Efecto para manejar el scroll después de que la página se cargue completamente
  useEffect(() => {
    // Comprobar si window está definido (solo en el cliente)
    if (typeof window !== 'undefined') {
      // Función para realizar el scroll al componente
      const scrollToComponent = () => {
        const shouldScroll = sessionStorage.getItem('scrollToCotiza');
        if (shouldScroll === 'true') {
          const element = document.getElementById('cotiza');
          if (element) {
            // Obtener la altura del navbar
            const navbarHeight = window.innerWidth >= 768 ? 80 : 64;
            
            // Calcular posición y hacer scroll
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - navbarHeight,
              behavior: 'smooth'
            });
            
            // Limpiar el flag después de usarlo
            sessionStorage.removeItem('scrollToCotiza');
          }
        }
      };
      
      // Usar una combinación de load y timeout para asegurar que todo esté cargado
      if (document.readyState === 'complete') {
        // Si la página ya está cargada
        setTimeout(scrollToComponent, 1000);
      } else {
        // Si la página aún se está cargando
        window.addEventListener('load', () => {
          setTimeout(scrollToComponent, 1000);
        });
      }
    }
  }, []);

  const toggleConcesionarias = () => {
    setShowConcesionarias(!showConcesionarias);
  };

  const openWhatsApp = (whatsapp: string) => {
    const message = encodeURIComponent("Hola, me gustaría cotizar mi vehículo para un posible cambio por uno nuevo.");
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
    setShowConcesionarias(false); // Cerrar el menú después de seleccionar
  };

  return (
    <section 
      id="cotiza" 
      className="py-10 sm:py-12 scroll-mt-16 md:scroll-mt-20"
    >
      <div className="container px-4 sm:px-6">
        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-md">
          <div className="relative">
            {/* Fondo con gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-90" />
            
            {/* Contenido principal - grid de dos columnas */}
            <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-6 px-6 py-8 sm:px-8 sm:py-10 md:px-10">
              {/* Columna izquierda - Texto y detalles */}
              <div className="space-y-6 sm:space-y-8">
                {/* Título y descripción */}
                <div>
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Cambiá tu vehículo
                    <span className="block mt-1">sin complicaciones</span>
                  </motion.h2>
                  
                  <motion.p 
                    className="mt-4 text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Te ofrecemos la mejor tasación por tu usado. Consultá al instante y descubrí todas las opciones que tenemos para vos.
                  </motion.p>
                </div>
                
                {/* Beneficios */}
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 bg-[var(--color-gold)]/20 rounded-full p-2.5">
                      <BadgeDollarSign className="h-5 w-5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase text-sm tracking-wide">Mejor precio por tu usado</h4>
                      <p className="text-sm text-gray-300">Cotización justa y transparente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 bg-[var(--color-gold)]/20 rounded-full p-2.5">
                      <RefreshCw className="h-5 w-5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase text-sm tracking-wide">Proceso simple y rápido</h4>
                      <p className="text-sm text-gray-300">Servicio de Gestoría</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 bg-[var(--color-gold)]/20 rounded-full p-2.5">
                      <ThumbsUp className="h-5 w-5 text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase text-sm tracking-wide">Atención personalizada</h4>
                      <p className="text-sm text-gray-300">Te acompañamos en todo el proceso</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Botón de acción con menú desplegable */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="pt-2 relative"
                >
                  <Button
                    onClick={toggleConcesionarias}
                    className="group bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)] text-black rounded-full px-7 py-6 text-base font-medium transition-all shadow-md"
                  >
                    <span className="flex items-center">
                      Cotizá tu vehículo ahora
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>

                  {/* Menú desplegable de concesionarias - ahora hacia arriba */}
                  <AnimatePresence>
                    {showConcesionarias && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-full mb-2 left-0 z-50 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl overflow-hidden"
                        style={{ width: '280px' }}
                      >
                        <div className="p-4">
                          <h4 className="font-medium text-center uppercase mb-3 text-sm text-white">Selecciona una concesionaria</h4>
                          <div className="space-y-3">
                            {concesionarias.map((concesionaria) => (
                              <button
                                key={concesionaria.id}
                                className="w-full text-left p-3 hover:bg-neutral-700 rounded-md flex items-center text-sm transition-colors"
                                onClick={() => openWhatsApp(concesionaria.whatsapp)}
                              >
                                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-neutral-700 mr-3 flex-shrink-0">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    className="h-6 w-6 text-[var(--color-gold)] fill-current"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-white">{concesionaria.nombre}</div>
                                  <div className="text-xs text-gray-400">{concesionaria.direccion}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              {/* Columna derecha - Imagen */}
              <div className="flex items-center justify-center">
                <motion.div 
                  className="w-full h-full max-h-[400px] relative rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src="/images/cotiza-usado.jpeg"
                    alt="Acuerdo de compra-venta de vehículo" 
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}