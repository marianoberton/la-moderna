'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fuel, GaugeCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ClientImage from './ClientImage';

// Definir la interfaz para el vehículo
export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  precio: number;
  año: number;
  km: number;
  transmision: string;
  combustible: string;
  imagen?: string;
  fotos?: number;
  image?: string;
  images?: string[];
  color?: string;
  highlights?: string[];
}

// Props para el componente VehicleCard
interface VehicleCardProps {
  vehiculo: Vehiculo;
  index: number;
  formatPrecio: (precio: number) => string;
}

export default function VehicleCard({ vehiculo, index, formatPrecio }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Función para obtener la imagen activa
  const getActiveImage = () => {
    if (vehiculo.images && vehiculo.images.length > 0) {
      return vehiculo.images[activeImage];
    }
    return vehiculo.imagen || vehiculo.image || "https://via.placeholder.com/320x208";
  };
  
  // Función para cambiar la imagen activa
  const changeActiveImage = (index: number) => {
    setActiveImage(index);
  };
  
  // Determinar si es 0KM o usado
  const is0KM = vehiculo.km === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-lg overflow-hidden border border-border h-full flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal con overlay y badge - Clicable */}
      <Link 
        href={`/vehiculos/${vehiculo.id}`}
        className="relative h-48 sm:h-60 overflow-hidden cursor-pointer bg-gray-50 p-0 sm:p-2 block" 
      >
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-100'}`}></div>
        <img 
          src={getActiveImage()} 
          alt={`${vehiculo.marca} ${vehiculo.modelo}`}
          className="w-full h-full object-cover object-center transition-all duration-500"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/320x208";
          }}
        />
        <Badge className={`absolute top-3 left-3 z-20 ${is0KM ? 'bg-[var(--color-gold)] text-black' : 'bg-accent text-accent-foreground'}`}>
          {is0KM ? '0KM' : 'Usado'}
        </Badge>
        
        {/* Año y kilometraje solo para usados */}
        {!is0KM && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-between z-20">
            <span className="bg-black/70 text-white text-xs py-1 px-2 rounded">
              {vehiculo.año}
            </span>
            <span className="bg-black/70 text-white text-xs py-1 px-2 rounded">
              {vehiculo.km.toLocaleString()} km
            </span>
          </div>
        )}
        
        {/* Indicadores de imágenes múltiples */}
        {vehiculo.images && vehiculo.images.length > 1 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
            {vehiculo.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  changeActiveImage(index);
                }}
                className={`w-2 h-2 rounded-full ${
                  activeImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </Link>
      
      <div className={`p-2 sm:p-4 flex-1 flex flex-col ${isMobile ? 'space-y-1' : 'space-y-3'}`}>
        {/* Marca y modelo - Clicable */}
        <Link 
          href={`/vehiculos/${vehiculo.id}`}
          className={`${isMobile ? 'mb-0' : 'mb-2'} cursor-pointer hover:opacity-80 transition-opacity`}
        >
          <h3 className="text-base sm:text-lg font-bold line-clamp-1">
            {vehiculo.marca} <span className="text-[var(--color-dark-bg)]">{vehiculo.modelo}</span>
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{vehiculo.version}</p>
        </Link>
        
        {/* Mostrar precio en móvil y características compactas */}
        {isMobile && (
          <div className="flex justify-between items-center mt-1">
            <div className="text-left">
              <span className="text-base font-bold text-[var(--color-dark-bg)]">{formatPrecio(vehiculo.precio)}</span>
            </div>
            
            <div className="flex space-x-3 text-xs">
              <span className="flex items-center">
                <Fuel className="h-3 w-3 text-[var(--color-dark-bg)] mr-1" />
                {vehiculo.combustible}
              </span>
              <span className="flex items-center">
                <img 
                  src="/manual-transmission.svg"
                  alt="Transmisión"
                  className="h-3 w-3 text-[var(--color-dark-bg)] mr-1"
                />
                {vehiculo.transmision}
              </span>
            </div>
          </div>
        )}
        
        {/* Especificaciones esenciales con iconos - Solo en desktop */}
        {!isMobile && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center text-center">
              <Fuel className="h-4 w-4 text-[var(--color-dark-bg)] mb-1" />
              <span className="text-xs text-muted-foreground">Combustible</span>
              <span className="text-xs sm:text-sm font-medium">{vehiculo.combustible}</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <img 
                src="/manual-transmission.svg"
                alt="Transmisión"
                className="h-4 w-4 text-[var(--color-dark-bg)] mb-1"
              />
              <span className="text-xs text-muted-foreground">Transmisión</span>
              <span className="text-xs sm:text-sm font-medium">{vehiculo.transmision}</span>
            </div>
          </div>
        )}
        
        {/* Botón de acción con precio incluido - Solo desktop */}
        {!isMobile && (
          <div className="mt-auto">
            <div className="mb-2">
              <div className="text-center">
                <span className="text-base font-bold text-[var(--color-dark-bg)]">{formatPrecio(vehiculo.precio)}</span>
              </div>
            </div>
            
            {/* Equipamiento destacado fijo debajo del precio */}
            {vehiculo.highlights && vehiculo.highlights.length > 0 && (
              <div className="mb-3 text-center border-t border-border pt-2">
                <p className="text-xs font-medium text-[var(--color-dark-bg)] mb-1">Equipamiento destacado</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {vehiculo.highlights.slice(0, 3).map((highlight, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Botón Ver Detalles */}
        <Button 
          asChild
          size="sm"
          variant="outline"
          className={`w-full text-xs relative overflow-hidden transition-all duration-300 ${isMobile ? 'mt-1 py-1 h-7' : ''}`}
        >
          <Link href={`/vehiculos/${vehiculo.id}`}>
            <span className="relative z-10">Ver Detalles</span>
            <span className={`absolute inset-0 bg-[var(--color-dark-bg)]/5 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`} />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
} 