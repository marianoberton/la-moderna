'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const vehicleCategories = [
  {
    type: 'HATCHBACK',
    href: '/vehiculos?tipoVehiculo=hatchback',
    icon: '/hatchback.svg',
    scale: 1
  },
  {
    type: 'SEDAN',
    href: '/vehiculos?tipoVehiculo=sedan',
    icon: '/sedan.svg',
    scale: 1.15 // Ligeramente más grande
  },
  {
    type: 'SUV',
    href: '/vehiculos?tipoVehiculo=suv',
    icon: '/suv.svg',
    scale: 1
  },
  {
    type: 'CAMIONETA',
    href: '/vehiculos?tipoVehiculo=pickup',
    icon: '/camioneta.svg',
    scale: 1.15 // Ligeramente más grande
  },
  {
    type: 'COUPE',
    href: '/vehiculos?tipoVehiculo=coupe',
    icon: '/coupe.svg',
    scale: 1
  }
];

export default function CarTypes() {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 sm:px-6">
        {/* Grid container - Mobile: 2 filas específicas, Desktop: una sola fila */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Primera fila en móvil: 3 elementos */}
          <div className="col-span-3 grid grid-cols-3 gap-4 sm:gap-6">
            {vehicleCategories.slice(0, 3).map((category, index) => (
              <Link href={category.href} key={category.type} className="group no-underline flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="flex flex-col items-center"
                >
                  {/* Contenedor del icono con tamaño fijo */}
                  <div className="w-20 h-12 mb-4 flex items-center justify-center relative">
                    <motion.img 
                      src={category.icon}
                      alt={category.type}
                      style={{ 
                        transform: `scale(${category.scale})`,
                        filter: 'invert(9%) sepia(0%) saturate(0%) hue-rotate(246deg) brightness(102%) contrast(84%)' // Color #171717
                      }}
                      className="w-full h-full object-contain group-hover:filter-none transition-all duration-300"
                      whileHover={{ 
                        y: -3,
                        transition: { type: "spring", stiffness: 400, damping: 10 }
                      }}
                    />
                  </div>
                  
                  {/* Texto en mayúsculas con línea animada */}
                  <div className="text-center relative">
                    <h3 className="text-sm font-medium text-neutral-800 group-hover:text-[var(--color-dark-bg)] transition-colors duration-300">
                      {category.type}
                    </h3>
                    
                    {/* Línea que aparece en hover usando clases de Tailwind */}
                    <div className="h-0.5 bg-[var(--color-dark-bg)] w-0 mx-auto group-hover:w-full transition-all duration-300 ease-out"></div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Segunda fila en móvil: 2 elementos centrados */}
          <div className="col-span-3 md:hidden grid grid-cols-2 gap-4 sm:gap-6 justify-items-center">
            {vehicleCategories.slice(3, 5).map((category, index) => (
              <Link href={category.href} key={category.type} className="group no-underline flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index + 3) * 0.08 }}
                  className="flex flex-col items-center"
                >
                  {/* Contenedor del icono con tamaño fijo */}
                  <div className="w-20 h-12 mb-4 flex items-center justify-center relative">
                    <motion.img 
                      src={category.icon}
                      alt={category.type}
                      style={{ 
                        transform: `scale(${category.scale})`,
                        filter: 'invert(9%) sepia(0%) saturate(0%) hue-rotate(246deg) brightness(102%) contrast(84%)' // Color #171717
                      }}
                      className="w-full h-full object-contain group-hover:filter-none transition-all duration-300"
                      whileHover={{ 
                        y: -3,
                        transition: { type: "spring", stiffness: 400, damping: 10 }
                      }}
                    />
                  </div>
                  
                  {/* Texto en mayúsculas con línea animada */}
                  <div className="text-center relative">
                    <h3 className="text-sm font-medium text-neutral-800 group-hover:text-[var(--color-dark-bg)] transition-colors duration-300">
                      {category.type}
                    </h3>
                    
                    {/* Línea que aparece en hover usando clases de Tailwind */}
                    <div className="h-0.5 bg-[var(--color-dark-bg)] w-0 mx-auto group-hover:w-full transition-all duration-300 ease-out"></div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Version para tablet/desktop (todos en una fila) - elementos 3-5 */}
          {vehicleCategories.slice(3, 5).map((category, index) => (
            <Link 
              href={category.href} 
              key={`desktop-${category.type}`} 
              className="group no-underline hidden md:flex justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + 3) * 0.08 }}
                className="flex flex-col items-center"
              >
                {/* Contenedor del icono con tamaño fijo */}
                <div className="w-20 h-12 mb-4 flex items-center justify-center relative">
                  <motion.img 
                    src={category.icon}
                    alt={category.type}
                    style={{ 
                      transform: `scale(${category.scale})`,
                      filter: 'invert(9%) sepia(0%) saturate(0%) hue-rotate(246deg) brightness(102%) contrast(84%)' // Color #171717
                    }}
                    className="w-full h-full object-contain group-hover:filter-none transition-all duration-300"
                    whileHover={{ 
                      y: -3,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  />
                </div>
                
                {/* Texto en mayúsculas con línea animada */}
                <div className="text-center relative">
                  <h3 className="text-sm font-medium text-neutral-800 group-hover:text-[var(--color-dark-bg)] transition-colors duration-300">
                    {category.type}
                  </h3>
                  
                  {/* Línea que aparece en hover usando clases de Tailwind */}
                  <div className="h-0.5 bg-[var(--color-dark-bg)] w-0 mx-auto group-hover:w-full transition-all duration-300 ease-out"></div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            asChild
            size="lg" 
            className="font-bold bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-hover)] rounded-full px-8"
          >
            <Link href="/vehiculos">
              VER TODOS LOS VEHÍCULOS
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 