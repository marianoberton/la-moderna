'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

// Componente SVG base que usaremos para todos los vehículos
const VehicleIcon = ({ className, type }: { className?: string, type: string }) => {
  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <div className="w-full h-16 flex items-center justify-center">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 512 300" 
          preserveAspectRatio="xMidYMid meet"
          className="fill-current text-gray-800 group-hover:text-background transition-colors duration-300"
          style={{
            filter: 'none',
            transition: 'filter 0.3s ease-in-out'
          }}
          // Aplicamos el filtro de inversión en hover a través del grupo padre
          data-group-hover-filter="invert(1)"
        >
          <g>
            <path d="M 278.5,75.5 C 285.402,77.3018 292.069,79.8018 298.5,83C 318.21,92.5199 337.543,102.52 356.5,113C 382.147,117.092 407.813,121.092 433.5,125C 444.723,126.778 455.723,129.444 466.5,133C 470.092,135.921 472.925,139.421 475,143.5C 481.545,160.31 483.878,177.643 482,195.5C 480.413,198.756 477.913,200.923 474.5,202C 461.5,202.667 448.5,202.667 435.5,202C 433.643,200.818 432.643,199.151 432.5,197C 436.022,175.712 428.355,160.045 409.5,150C 390.124,142.874 373.624,147.041 360,162.5C 353.159,173.216 350.492,184.883 352,197.5C 351.5,198.667 350.667,199.5 349.5,200C 287.156,199.464 224.823,198.13 162.5,196C 161.069,195.535 159.903,194.701 159,193.5C 158.698,165.706 144.864,150.039 117.5,146.5C 97.573,147.593 84.4063,157.593 78,176.5C 77.339,182.174 76.1723,187.674 74.5,193C 59.6703,194.199 45.0036,193.199 30.5,190C 29.2986,189.097 28.4652,187.931 28,186.5C 27.3333,178.833 27.3333,171.167 28,163.5C 28.6667,162.167 29.6667,161.167 31,160.5C 31.3333,149.833 31.6667,139.167 32,128.5C 33.4578,126.04 35.2911,123.873 37.5,122C 68.0096,117.423 98.6762,114.257 129.5,112.5C 129.49,105.686 132.823,103.186 139.5,105C 142.664,111.149 145.83,117.316 149,123.5C 150.579,125.041 152.413,126.208 154.5,127C 174.497,127.5 194.497,127.667 214.5,127.5C 214.334,122.821 214.501,118.155 215,113.5C 220.333,105.5 225.667,105.5 231,113.5C 231.499,118.155 231.666,122.821 231.5,127.5C 265.173,127.833 298.84,127.5 332.5,126.5C 333.77,124.452 334.103,122.452 333.5,120.5C 314.5,110.333 295.5,100.167 276.5,90C 270.771,84.1623 271.438,79.329 278.5,75.5 Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

const vehicleCategories = [
  {
    type: 'Hatchback',
    href: '/vehiculos?tipo=hatchback'
  },
  {
    type: 'Sedan',
    href: '/vehiculos?tipo=sedan'
  },
  {
    type: 'SUV',
    href: '/vehiculos?tipo=suv'
  },
  {
    type: 'Pick-Up',
    href: '/vehiculos?tipo=pickup'
  },
  {
    type: 'Utilitario',
    href: '/vehiculos?tipo=utilitario'
  },
  {
    type: 'Moto',
    href: '/vehiculos?tipo=moto'
  }
];

export default function CarTypes() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {vehicleCategories.map((category, index) => (
            <Link href={category.href} key={category.type}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Fondo circular con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                
                <div className="relative z-10 flex flex-col items-center py-6 px-4">
                  {/* Círculo decorativo que aparece en hover - reposicionado */}
                  <div className="absolute w-24 h-24 rounded-full bg-primary/10 -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  
                  {/* SVG del vehículo con efecto negativo en hover */}
                  <div className="mb-4 relative">
                    <motion.div
                      whileHover={{ rotate: [0, -2, 2, -2, 0] }}
                      transition={{ duration: 0.5 }}
                      className="svg-container"
                    >
                      <VehicleIcon type={category.type} />
                      
                      {/* Aplicamos el filtro de inversión con CSS */}
                      <style jsx global>{`
                        .group:hover .svg-container svg {
                          filter: invert(1) hue-rotate(180deg);
                          background-color: #000;
                          border-radius: 50%;
                          padding: 8px;
                          transform: scale(0.9);
                        }
                      `}</style>
                    </motion.div>
                  </div>
                  
                  {/* Texto con línea decorativa - aumentado el espacio superior */}
                  <div className="text-center relative mt-1">
                    <h3 className="text-base font-heading font-semibold text-primary group-hover:text-primary">
                      {category.type}
                    </h3>
                    <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300 mx-auto mt-1" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="font-bold relative overflow-hidden group"
          >
            <span className="relative z-10">VER TODOS LOS VEHÍCULOS</span>
            <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
} 