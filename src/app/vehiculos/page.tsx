'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Gauge } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VehicleFilters from '../components/VehicleFilters';

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
  destacado?: boolean;
  fechaPublicacion?: Date;
  equipamiento?: Record<string, boolean>;
  financiacion?: boolean;
  permuta?: boolean;
  tipoVehiculo?: string;
}

export default function VehiculosPage() {
  const [ordenar, setOrdenar] = useState('destacados');
  const [filtros, setFiltros] = useState({
    busqueda: '',
    marca: '',
    modelo: '',
    precioRango: [0, 100000000] as [number, number],
    añoRango: [1990, 2025] as [number, number],
    kilometrajeRango: [0, 300000] as [number, number],
    combustible: '',
    transmision: '',
    financiacion: false,
    permuta: false,
    color: '',
    tipoVehiculo: '',
    condicion: 'todo',
    equipamiento: {
      aireAcondicionado: false,
      direccionAsistida: false,
      vidriosElectricos: false,
      tapiceriaCuero: false,
      cierreCentralizado: false,
      alarma: false,
      airbags: false,
      bluetooth: false,
      controlCrucero: false,
      techoSolar: false,
      llantasAleacion: false,
      traccion4x4: false,
      abs: false,
      esp: false,
      asistenteFrenado: false,
      camaraReversa: false,
      sensorEstacionamiento: false,
      navegacionGPS: false,
      controlVoz: false,
      asientosElectricos: false,
      asientosCalefaccionados: false,
      volanteCuero: false,
      climatizador: false
    }
  });
  const [isMobile, setIsMobile] = useState(false);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>([]);
  
  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Datos de vehículos
  const vehiculos = [
    {
      id: 1,
      marca: 'Volkswagen',
      modelo: 'Taos',
      version: 'TAOS 1.4 HIGHLINE DSG',
      precio: 42500000,
      año: 2024,
      km: 0,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/0km/taos003.jpg',
      fotos: 12,
      destacado: true,
      fechaPublicacion: new Date('2024-03-01'),
      highlights: ['Motor 1.4 TSI', 'Caja DSG', 'Asistente de conducción'],
      tipoVehiculo: 'SUV'
    },
    {
      id: 2,
      marca: 'Volkswagen',
      modelo: 'T-Cross',
      version: 'T-CROSS 1.4 TSI COMFORTLINE',
      precio: 35900000,
      año: 2024,
      km: 0,
      transmision: 'Manual',
      combustible: 'Nafta',
      imagen: '/images/0km/tcross_2024_1_confortline.jpg',
      fotos: 14,
      destacado: false,
      fechaPublicacion: new Date('2024-02-15'),
      highlights: ['Pantalla táctil', 'Conectividad Apple/Android', 'Climatizador'],
      tipoVehiculo: 'SUV'
    },
    {
      id: 3,
      marca: 'Volkswagen', 
      modelo: 'Nivus',
      version: 'NIVUS 200 TSI HIGHLINE AT',
      precio: 39800000,
      año: 2024,
      km: 0,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/0km/nivus0.jpg',
      fotos: 16,
      destacado: true,
      fechaPublicacion: new Date('2024-02-20'),
      highlights: ['Motor TSI', 'Techo panorámico', 'Sensores de parking'],
      tipoVehiculo: 'SUV'
    },
    {
      id: 4,
      marca: 'Toyota',
      modelo: 'Corolla Cross',
      version: 'COROLLA CROSS 2.0 XEI CVT',
      precio: 38900000,
      año: 2024,
      km: 0,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/0km/corolla-cross0.jpg',
      fotos: 10,
      destacado: false,
      fechaPublicacion: new Date('2024-03-05'),
      highlights: ['Motor 2.0L', 'Climatizador bizona', 'Control de crucero'],
      tipoVehiculo: 'SUV'
    },
    {
      id: 5,
      marca: 'Volkswagen',
      modelo: 'Amarok',
      version: 'AMAROK 2.0 HIGHLINE 4X4 AT',
      precio: 28500000,
      año: 2020,
      km: 65000,
      transmision: 'Automática',
      combustible: 'Diesel',
      imagen: '/images/Usado/amarok_usada.jpg',
      fotos: 18,
      destacado: true,
      fechaPublicacion: new Date('2024-01-10'),
      highlights: ['Tracción 4x4', 'Cámara de retroceso', 'Asientos de cuero'],
      tipoVehiculo: 'CAMIONETA'
    },
    {
      id: 6,
      marca: 'Volkswagen',
      modelo: 'Amarok',
      version: 'AMAROK 2.0 COMFORTLINE 4X2 MT',
      precio: 24900000,
      año: 2019,
      km: 78000,
      transmision: 'Manual',
      combustible: 'Diesel',
      imagen: '/images/Usado/amarokusada.jpg',
      fotos: 15,
      destacado: false,
      fechaPublicacion: new Date('2024-01-20'),
      highlights: ['Faros LED', 'Sensores de estacionamiento', 'Bluetooth'],
      tipoVehiculo: 'CAMIONETA'
    }
  ];
  
  // Filtrar y ordenar vehículos
  useEffect(() => {
    let filtrados = [...vehiculos];
    
    // Filtrar por condición (nuevo/usado)
    if (filtros.condicion === 'nuevo') {
      filtrados = filtrados.filter(v => v.km === 0);
    } else if (filtros.condicion === 'usado') {
      filtrados = filtrados.filter(v => v.km > 0);
    }
    
    // Filtrar por búsqueda
    if (filtros.busqueda) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      filtrados = filtrados.filter(v => 
        v.marca.toLowerCase().includes(busquedaLower) || 
        v.modelo.toLowerCase().includes(busquedaLower) || 
        v.version.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Filtrar por marca
    if (filtros.marca) {
      filtrados = filtrados.filter(v => 
        v.marca.toLowerCase() === filtros.marca.toLowerCase()
      );
    }
    
    // Filtrar por modelo
    if (filtros.modelo) {
      filtrados = filtrados.filter(v => 
        v.modelo.toLowerCase() === filtros.modelo.toLowerCase()
      );
    }
    
    // Filtrar por tipo de vehículo
    if (filtros.tipoVehiculo) {
      filtrados = filtrados.filter(v => 
        v.tipoVehiculo?.toLowerCase() === filtros.tipoVehiculo.toLowerCase()
      );
    }
    
    // Ordenar
    filtrados.sort((a, b) => {
      switch (ordenar) {
        case 'destacados':
          if (a.destacado === b.destacado) {
            return 0;
          }
          return a.destacado ? -1 : 1;
          
        case 'precio_asc':
          return a.precio - b.precio;
          
        case 'precio_desc':
          return b.precio - a.precio;
          
        case 'nuevos':
          return 0;
          
        case 'año_desc':
          return b.año - a.año;
          
        case 'km_asc':
          return a.km - b.km;
          
        default:
          return 0;
      }
    });
    
    setVehiculosFiltrados(filtrados);
  }, [filtros, ordenar]);

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

  // Resetear todos los filtros
  const resetFilters = () => {
    setFiltros({
      busqueda: '',
      marca: '',
      modelo: '',
      precioRango: [0, 100000000] as [number, number],
      añoRango: [1990, 2025] as [number, number],
      kilometrajeRango: [0, 300000] as [number, number],
      combustible: '',
      transmision: '',
      financiacion: false,
      permuta: false,
      color: '',
      tipoVehiculo: '',
      condicion: 'todo',
      equipamiento: {
        aireAcondicionado: false,
        direccionAsistida: false,
        vidriosElectricos: false,
        tapiceriaCuero: false,
        cierreCentralizado: false,
        alarma: false,
        airbags: false,
        bluetooth: false,
        controlCrucero: false,
        techoSolar: false,
        llantasAleacion: false,
        traccion4x4: false,
        abs: false,
        esp: false,
        asistenteFrenado: false,
        camaraReversa: false,
        sensorEstacionamiento: false,
        navegacionGPS: false,
        controlVoz: false,
        asientosElectricos: false,
        asientosCalefaccionados: false,
        volanteCuero: false,
        climatizador: false
      }
    });
  };

  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Panel de búsqueda principal */}
      <div className="bg-surface py-6 shadow-soft relative overflow-hidden border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Componente de filtros unificado */}
          <VehicleFilters 
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      {/* Sección de resultados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Encabezado de resultados */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-primary mb-4 md:mb-0 flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">{vehiculosFiltrados.length}</span>
              vehículos encontrados
            </h2>
            <Button 
              variant="outline" 
              className="ml-4 text-primary border-border hover:bg-surface-2 transition-colors"
              onClick={resetFilters}
            >
              Limpiar filtros
            </Button>
          </div>
          <div className="flex items-center bg-[var(--color-dark-bg)]/5 rounded-lg shadow-sm px-4 py-2 border border-border">
            <span className="mr-3 text-primary font-medium">Ordenar por:</span>
            <select 
              className="p-2 border border-border rounded-md bg-white text-primary focus:outline-none focus:ring-1 focus:ring-[var(--color-dark-bg)] font-medium appearance-none pr-8 relative"
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="destacados">Destacados</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="nuevos">Más recientes</option>
              <option value="año_desc">Modelo más nuevo</option>
              <option value="km_asc">Menos kilometraje</option>
            </select>
          </div>
        </div>

        {/* Cuadrícula de vehículos - 4 columnas para pantallas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {vehiculosFiltrados.map((vehiculo, index) => (
            <Link key={vehiculo.id} href={`/vehiculos/${vehiculo.id}`} className="block h-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-lg overflow-hidden border border-border h-full flex flex-col relative cursor-pointer hover:shadow-md transition-all duration-300"
              >
                {/* Imagen principal con badges */}
                <div className="relative h-48 sm:h-60 overflow-hidden bg-gray-50 p-0 sm:p-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={vehiculo.imagen || "https://via.placeholder.com/320x208"} 
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/320x208";
                    }}
                  />
                  <Badge className={`absolute top-3 left-3 z-20 ${vehiculo.km === 0 ? 'bg-[var(--color-gold)] text-black' : 'bg-[var(--color-dark-bg)] text-white'} font-semibold`}>
                    {vehiculo.km === 0 ? '0KM' : 'USADO'}
                  </Badge>
                  
                  {/* Año y kilometraje solo para usados */}
                  {vehiculo.km > 0 && (
                    <div className="absolute bottom-3 left-3 z-20 flex space-x-2">
                      <Badge variant="outline" className="bg-black/70 text-white border-none text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {vehiculo.año}
                      </Badge>
                      <Badge variant="outline" className="bg-black/70 text-white border-none text-xs">
                        <Gauge className="h-3 w-3 mr-1" />
                        {vehiculo.km.toLocaleString()} km
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  {/* Marca y modelo */}
                  <div className="mb-2">
                    <h3 className="text-base sm:text-lg font-bold line-clamp-1">
                      {vehiculo.marca} <span className="text-[var(--color-dark-bg)]">{vehiculo.modelo}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{vehiculo.version}</p>
                  </div>
                  
                  {/* Precio */}
                  <div>
                    <p className="text-base font-bold text-[var(--color-dark-bg)]">
                      {formatPrecio(vehiculo.precio)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
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


