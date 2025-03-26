'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface VehicleType {
  id: string;
  nombre: string;
  icono: React.ReactNode;
}

interface VehicleTypeSelectorProps {
  tipoSeleccionado: string;
  onTipoChange: (tipo: string) => void;
  className?: string;
}

const tipos: VehicleType[] = [
  {
    id: 'sedan',
    nombre: 'Sedán',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12L4 8H20L22 12M2 12V16M2 12H22M22 12V16" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 8L6 5H18L20 8" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 15C7 15.5523 6.55228 16 6 16C5.44772 16 5 15.5523 5 15C5 14.4477 5.44772 14 6 14C6.55228 14 7 14.4477 7 15Z" fill="currentColor"/>
        <path d="M19 15C19 15.5523 18.5523 16 18 16C17.4477 16 17 15.5523 17 15C17 14.4477 17.4477 14 18 14C18.5523 14 19 14.4477 19 15Z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'hatchback',
    nombre: 'Hatchback',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12L5 8H15L18 12M3 12V16M3 12H18M18 12V16" stroke="currentColor" strokeWidth="2"/>
        <path d="M15 8L18 12V16H3V12L5 8H15Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M15 8L15 5H5L5 8" stroke="currentColor" strokeWidth="2"/>
        <circle cx="6" cy="15" r="1" fill="currentColor"/>
        <circle cx="15" cy="15" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'suv',
    nombre: 'SUV',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13L5 6H19L21 13M3 13V16M3 13H21M21 13V16" stroke="currentColor" strokeWidth="2"/>
        <path d="M5 6V3H19V6" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 16H21" stroke="currentColor" strokeWidth="2"/>
        <circle cx="7" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'pickup',
    nombre: 'Pickup',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12H12V16H2V12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 12H22L20 16H12V12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 12L14 8H20L22 12" stroke="currentColor" strokeWidth="2"/>
        <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'coupe',
    nombre: 'Coupé',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12L6 6H16L20 9L22 12M2 12V16M2 12H22M22 12V16" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 6L20 9" stroke="currentColor" strokeWidth="2"/>
        <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'cabriolet',
    nombre: 'Cabriolet',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12H22V16H2V12Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 12V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V12" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 7C8 7 10 4 12 4C14 4 16 7 16 7" stroke="currentColor" strokeWidth="2"/>
        <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  }
];

export default function VehicleTypeSelector({ 
  tipoSeleccionado, 
  onTipoChange,
  className 
}: VehicleTypeSelectorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-surface-2 rounded-xl shadow-md p-6",
        className
      )}
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-heading font-bold text-primary mb-4 uppercase"
      >
        Tipo de vehículo
      </motion.h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {tipos.map((tipo, index) => (
          <motion.button
            key={tipo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-accent/30",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              tipoSeleccionado === tipo.id 
                ? "border-accent ring-2 ring-accent/30 bg-white shadow-md" 
                : "border-border-light bg-white hover:bg-surface hover:border-accent/30"
            )}
            onClick={() => onTipoChange(tipoSeleccionado === tipo.id ? '' : tipo.id)}
            aria-pressed={tipoSeleccionado === tipo.id}
            aria-label={`Seleccionar tipo de vehículo ${tipo.nombre}`}
          >
            <motion.div 
              className={cn(
                "w-14 h-14 flex items-center justify-center rounded-full mb-2",
                tipoSeleccionado === tipo.id ? "text-accent" : "text-primary"
              )}
              animate={{ 
                scale: tipoSeleccionado === tipo.id ? 1.1 : 1,
                color: tipoSeleccionado === tipo.id ? "var(--accent)" : "var(--primary)" 
              }}
            >
              {tipo.icono}
            </motion.div>
            <motion.h3 
              className={cn(
                "text-sm font-medium",
                tipoSeleccionado === tipo.id ? "text-accent" : "text-primary"
              )}
              animate={{ 
                color: tipoSeleccionado === tipo.id ? "var(--accent)" : "var(--primary)" 
              }}
            >
              {tipo.nombre}
            </motion.h3>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 