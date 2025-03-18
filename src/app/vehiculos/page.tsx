'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ClientImage from '../components/ClientImage';
import VehicleFilters from '../components/VehicleFilters';
import { Calendar, Fuel, Cog, Gauge } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VehiculosPage() {
  const [ordenar, setOrdenar] = useState('nuevos');
  const [filtros, setFiltros] = useState({});
  // Track hover state for each vehicle
  const [hoveredVehicle, setHoveredVehicle] = useState<number | null>(null);
  
  // First, let's define an interface for the vehicle type
  interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    version: string;
    precio: number;
    año: number;
    km: number;
    transmision: string;
    combustible: string;
    imagen: string;
    fotos: number;
  }
  // Update the useState definition with the proper type
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>([]);
  
  // Actualizar los vehículos con las imágenes nuevas
  const vehiculos = [
    {
      id: 1,
      marca: 'Volkswagen',
      modelo: 'Amarok',
      version: 'AMAROK 2.0 HIGHLINE 4X4 AT',
      precio: 28500000,
      año: 2020,
      km: 65000,
      transmision: 'Automática',
      combustible: 'Diesel',
      imagen: '/images/Usado/amarok_usada.jpg',
      fotos: 18
    },
    {
      id: 2,
      marca: 'Volkswagen',
      modelo: 'Amarok',
      version: 'AMAROK 2.0 COMFORTLINE 4X2 MT',
      precio: 24900000,
      año: 2019,
      km: 78000,
      transmision: 'Manual',
      combustible: 'Diesel',
      imagen: '/images/Usado/amarokusada.jpg',
      fotos: 15
    },
    // ... other vehicles ...
  ];
  
  // Actualizar vehículos filtrados cuando cambian los filtros
  useEffect(() => {
    // Aquí iría la lógica para filtrar los vehículos según los filtros aplicados
    setVehiculosFiltrados(vehiculos);
  }, [filtros]);

  // Formatea el precio en formato argentino
  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(precio);
  };

  // Manejar cambios en los filtros
  const handleFiltersChange = (newFilters: any) => {
    setFiltros(newFilters);
  };

  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Panel de búsqueda principal */}
      <div className="bg-surface py-8 shadow-soft relative overflow-hidden border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Componente de filtros unificado */}
          <VehicleFilters 
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      {/* Sección de resultados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:grid-cols-8 mt-10">
        {/* Encabezado de resultados */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 md:mb-0 flex items-center">
            <span className="bg-primary text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">{vehiculosFiltrados.length}</span>
            vehículos encontrados
          </h2>
          <div className="flex items-center bg-surface rounded-lg shadow-sm px-4 py-2 border border-border-light">
            <span className="mr-3 text-muted font-medium">Ordenar:</span>
            <select 
              className="p-2 border-0 rounded appearance-none bg-surface text-primary focus:outline-none"
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
            >
              <option value="nuevos">Nuevos ingresos</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="año_desc">Más nuevos</option>
              <option value="año_asc">Más antiguos</option>
              <option value="km_asc">Menos km</option>
              <option value="km_desc">Más km</option>
            </select>
          </div>
        </div>

        {/* Cuadrícula de vehículos - Actualizada con el diseño de UsedCars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehiculosFiltrados.map((vehiculo, index) => (
            <motion.div 
              key={vehiculo.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden border border-border flex-1"
              onMouseEnter={() => setHoveredVehicle(vehiculo.id)}
              onMouseLeave={() => setHoveredVehicle(null)}
            >
              {/* Imagen principal con overlay y badge - Clicable */}
              <div 
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => window.location.href = `/vehiculos/${vehiculo.id}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity duration-300 ${hoveredVehicle === vehiculo.id ? 'opacity-70' : 'opacity-100'}`}></div>
                <ClientImage 
                  src={vehiculo.imagen}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className={`w-full h-full object-cover transition-transform duration-500 ${hoveredVehicle === vehiculo.id ? 'scale-110' : 'scale-100'}`}
                />
                <Badge className="absolute top-3 left-3 z-20 bg-accent text-accent-foreground">
                  {vehiculo.km === 0 ? 'Nuevo' : 'Usado'}
                </Badge>
                
                {/* Año y kilometraje en la imagen */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between z-20">
                  <span className="bg-black/70 text-white text-xs py-1 px-2 rounded">
                    {vehiculo.año}
                  </span>
                  <span className="bg-black/70 text-white text-xs py-1 px-2 rounded">
                    {vehiculo.km.toLocaleString()} km
                  </span>
                </div>
                
                {/* Contador de fotos */}
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs py-1 px-2 rounded-md flex items-center z-20">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {vehiculo.fotos}
                </div>
              </div>
              
              <div className="p-4">
                {/* Marca y modelo - Clicable */}
                <div 
                  className="mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.location.href = `/vehiculos/${vehiculo.id}`}
                >
                  <h3 className="text-xl font-bold">
                    {vehiculo.marca} <span className="text-primary">{vehiculo.modelo}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{vehiculo.version}</p>
                </div>
                
                {/* Especificaciones esenciales con iconos */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex flex-col items-center text-center">
                    <Fuel className="h-4 w-4 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Combustible</span>
                    <span className="text-sm font-medium">{vehiculo.combustible}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <Cog className="h-4 w-4 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Transmisión</span>
                    <span className="text-sm font-medium">{vehiculo.transmision}</span>
                  </div>
                </div>
                
                {/* Características adicionales - visible solo en hover */}
                <div className={`overflow-hidden transition-all duration-300 ${hoveredVehicle === vehiculo.id ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-primary" />
                      <span className="text-xs">{vehiculo.año}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Gauge className="h-3 w-3 mr-1 text-primary" />
                      <span className="text-xs">{vehiculo.km.toLocaleString()} km</span>
                    </div>
                  </div>
                </div>
                
                {/* Precio y botones de acción */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Precio:</span>
                    <span className="text-base font-bold text-primary">{formatPrecio(vehiculo.precio)}</span>
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="relative overflow-hidden transition-all duration-300"
                    onClick={() => window.location.href = `/vehiculos/${vehiculo.id}`}
                  >
                    <span className="relative z-10">Ver Detalles</span>
                    <span className={`absolute inset-0 bg-primary/5 transform transition-transform duration-300 ${hoveredVehicle === vehiculo.id ? 'translate-y-0' : 'translate-y-full'}`} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-12">
          <nav className="inline-flex rounded-lg shadow-sm overflow-hidden">
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">Anterior</a>
            <a href="#" className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors font-medium text-sm">1</a>
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">2</a>
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">3</a>
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">Siguiente</a>
          </nav>
        </div>
      </div>

      {/* Botón de volver arriba */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-50 bg-accent hover:bg-accent/90 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Volver arriba"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}


