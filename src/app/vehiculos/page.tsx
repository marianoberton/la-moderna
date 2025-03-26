'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Gauge, Filter, Car } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VehicleFilters from '../components/VehicleFilters';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from 'react';

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

// Badge personalizado sin hover para OKM/USADO
const StatusBadge = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Badge personalizado sin hover para información de vehículo
const InfoBadge = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`inline-flex items-center rounded-md border border-transparent px-2.5 py-0.5 text-xs ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// Componente de tarjeta de vehículo
const VehicleCard = ({ vehicle }: { vehicle: Vehiculo }) => {
  return (
    <Link href={`/vehiculos/${vehicle.id}`} className="block h-full">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col relative">
        {/* Imagen principal con badges */}
        <div className="relative h-60 overflow-hidden bg-gray-50 p-3">
          <img 
            src={vehicle.imagen || "/placeholder-car.jpg"} 
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-car.jpg";
            }}
          />
          <StatusBadge 
            className={`absolute top-3 left-3 z-20 ${
              vehicle.km === 0 
                ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)]' 
                : 'bg-[var(--color-dark-bg)] text-white border-[var(--color-dark-bg)]'
            }`}
          >
            {vehicle.km === 0 ? 'OKM' : 'USADO'}
          </StatusBadge>
          
          {/* Año y kilometraje solo para usados - ahora a la derecha */}
          {vehicle.km > 0 && (
            <div className="absolute bottom-3 right-3 z-20 flex space-x-2">
              <InfoBadge className="bg-black/70 text-white">
                <Calendar className="h-3 w-3 mr-1" />
                {vehicle.año}
              </InfoBadge>
              <InfoBadge className="bg-black/70 text-white">
                <Gauge className="h-3 w-3 mr-1" />
                {vehicle.km.toLocaleString()} km
              </InfoBadge>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Marca y modelo */}
          <div className="mb-2 sm:mb-3">
            <h3 className="text-lg sm:text-xl font-bold line-clamp-1">
              {vehicle.marca} <span className="text-[var(--color-dark-bg)]">{vehicle.modelo}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{vehicle.version}</p>
          </div>
          
          {/* Precio */}
          <div className="mt-auto">
            <p className="text-base sm:text-lg font-bold text-[var(--color-dark-bg)]">
              $ {vehicle.precio.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Componente para mostrar durante la carga
const VehicleGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="bg-white rounded-lg shadow animate-pulse h-[300px]">
          <div className="h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function VehiculosPage() {
  // ---- DEFINICIONES INICIALES DE ESTADO ----
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Para evitar actualizaciones iniciales no deseadas
  const initialRenderRef = useRef(true);
  
  // ---- DETECCIÓN DE DISPOSITIVO MÓVIL ----
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // ---- DATOS DE VEHÍCULOS (simulados) ----
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

  // ---- CÁLCULO DE MARCAS Y MODELOS DISPONIBLES ----
  
  // Calculamos las marcas disponibles solo una vez
  const marcasDisponibles = useMemo(() => {
    return [...new Set(vehiculos.map(v => v.marca))].sort();
  }, [vehiculos]);

  // Calculamos los modelos disponibles solo cuando cambia la marca seleccionada
  const modelosDisponibles = useMemo(() => {
    if (!filtros.marca) return [];
    
    return [...new Set(vehiculos
      .filter(v => v.marca.toLowerCase() === filtros.marca.toLowerCase())
      .map(v => v.modelo))]
      .sort();
  }, [vehiculos, filtros.marca]);

  // ---- EFECTOS PARA ACTUALIZAR EL FILTRADO DE VEHÍCULOS ----
  
  // Inicialización de vehículos filtrados
  useEffect(() => {
    // Inicializamos solo una vez al cargar la página
    if (vehiculos.length > 0 && vehiculosFiltrados.length === 0) {
      setVehiculosFiltrados([...vehiculos]);
    }
  }, [vehiculos]); // Solo depende de vehiculos, no de vehiculosFiltrados

  // Función para aplicar filtros a los vehículos
  const aplicarFiltros = () => {
    // No hacer nada si no hay vehículos
    if (vehiculos.length === 0) return [];
    
    // Filtrar los vehículos según todos los criterios
    return vehiculos.filter(vehiculo => {
      // Filtrar por condición
      if (filtros.condicion !== 'todo') {
        if (filtros.condicion === '0km' && vehiculo.km > 0) return false;
        if (filtros.condicion === 'usado' && vehiculo.km === 0) return false;
      }
      
      // Filtrar por búsqueda
      if (filtros.busqueda) {
        const searchLower = filtros.busqueda.toLowerCase();
        const matchesSearch = 
          vehiculo.marca.toLowerCase().includes(searchLower) ||
          vehiculo.modelo.toLowerCase().includes(searchLower) ||
          vehiculo.version.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Filtrar por marca
      if (filtros.marca && vehiculo.marca.toLowerCase() !== filtros.marca.toLowerCase()) return false;
      
      // Filtrar por modelo
      if (filtros.modelo && vehiculo.modelo.toLowerCase() !== filtros.modelo.toLowerCase()) return false;
      
      // Filtrar por precio
      if (vehiculo.precio < filtros.precioRango[0] || vehiculo.precio > filtros.precioRango[1]) return false;
      
      // Filtrar por año
      if (vehiculo.año < filtros.añoRango[0] || vehiculo.año > filtros.añoRango[1]) return false;
      
      // Filtrar por kilometraje
      if (vehiculo.km < filtros.kilometrajeRango[0] || vehiculo.km > filtros.kilometrajeRango[1]) return false;
      
      // Filtrar por combustible
      if (filtros.combustible && vehiculo.combustible.toLowerCase() !== filtros.combustible.toLowerCase()) return false;
      
      // Filtrar por transmisión
      if (filtros.transmision && vehiculo.transmision.toLowerCase() !== filtros.transmision.toLowerCase()) return false;
      
      // Filtrar por tipo de vehículo - mejoramos la comparación para manejar diferencias de caso
      if (filtros.tipoVehiculo && vehiculo.tipoVehiculo) {
        // Normalizar ambos valores a minúsculas para comparación
        const tipoFiltro = filtros.tipoVehiculo.toLowerCase().trim();
        const tipoVehiculo = vehiculo.tipoVehiculo.toLowerCase().trim();
        if (tipoFiltro !== tipoVehiculo) return false;
      } else if (filtros.tipoVehiculo) {
        // Si se especificó un tipo pero el vehículo no tiene tipo, no coincide
        return false;
      }
      
      // Filtrar por color - uso seguro de tipos
      if (filtros.color) {
        const colorVehiculo = (vehiculo as any).color;
        if (!colorVehiculo || filtros.color.toLowerCase().trim() !== colorVehiculo.toLowerCase().trim()) {
          return false;
        }
      }
      
      // Filtrar por financiación - uso seguro de tipos
      if (filtros.financiacion && !(vehiculo as any).financiacion) return false;
      
      // Filtrar por permuta - uso seguro de tipos
      if (filtros.permuta && !(vehiculo as any).permuta) return false;
      
      // Filtrar por equipamiento - uso seguro de tipos
      const equipamiento = (vehiculo as any).equipamiento;
      if (equipamiento) {
        for (const [key, value] of Object.entries(filtros.equipamiento)) {
          if (value && !equipamiento[key]) {
            return false;
          }
        }
      } else {
        // Si el vehículo no tiene equipamiento pero hay filtros de equipamiento activos
        if (Object.values(filtros.equipamiento).some(v => v)) {
          return false;
        }
      }
      
      // Todos los filtros pasados
      return true;
    });
  };

  // Función para ordenar vehículos
  const ordenarVehiculos = (vehiculosFiltrados: Vehiculo[]) => {
    const ordenados = [...vehiculosFiltrados];
    
    switch (ordenar) {
      case 'precio_asc':
        return ordenados.sort((a, b) => a.precio - b.precio);
      case 'precio_desc':
        return ordenados.sort((a, b) => b.precio - a.precio);
      case 'año_desc':
        return ordenados.sort((a, b) => b.año - a.año);
      case 'año_asc':
        return ordenados.sort((a, b) => a.año - b.año);
      case 'destacados':
      default:
        // Ordenar por destacados primero, luego por fecha de publicación
        return ordenados.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          
          const fechaA = a.fechaPublicacion || new Date(0);
          const fechaB = b.fechaPublicacion || new Date(0);
          return fechaB.getTime() - fechaA.getTime();
        });
    }
  };
  
  // Para verificar si hay filtros activos (más detallado para debugging)
  const hasActiveFilters = (() => {
    // Filtros básicos
    if (filtros.busqueda || 
        filtros.marca || 
        filtros.modelo || 
        filtros.combustible || 
        filtros.transmision || 
        filtros.color ||
        filtros.tipoVehiculo ||
        filtros.financiacion || 
        filtros.permuta) {
      return true;
    }
    
    // Filtros de rango
    if (filtros.precioRango[0] > 0 || 
        filtros.precioRango[1] < 100000000 ||
        filtros.añoRango[0] > 1990 || 
        filtros.añoRango[1] < 2025 ||
        filtros.kilometrajeRango[0] > 0 || 
        filtros.kilometrajeRango[1] < 300000) {
      return true;
    }
    
    // Filtros de equipamiento
    if (Object.values(filtros.equipamiento).some(v => v)) {
      return true;
    }
    
    // Si la condición no es 'todo', también es un filtro activo
    if (filtros.condicion !== 'todo') {
      return true;
    }
    
    return false;
  })();
  
  // Efecto principal para aplicar filtros y actualizar vehículos
  useEffect(() => {
    // Saltarse la ejecución en el primer renderizado
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    try {
      // Utilizamos una función para obtener los vehículos filtrados
      const filtrados = aplicarFiltros();
      
      // Si hay filtros activos, mostramos los resultados filtrados
      // (incluso si es un array vacío, para mostrar "No hay vehículos")
      if (hasActiveFilters) {
        setVehiculosFiltrados(filtrados);
        return;
      }
      
      // Si no hay filtros activos, mostrar todos los vehículos
      setVehiculosFiltrados([...vehiculos]);
      
    } catch (error) {
      console.error("Error al filtrar vehículos:", error);
      // En caso de error, mostrar todos los vehículos
      setVehiculosFiltrados([...vehiculos]);
    }
  }, [filtros, ordenar]); // dependencias: filtros y ordenar, removemos hasActiveFilters porque ahora es calculado
  
  // Efecto para ordenar los vehículos cuando cambia el criterio de ordenamiento
  useEffect(() => {
    if (vehiculosFiltrados.length > 0) {
      const ordenados = ordenarVehiculos(vehiculosFiltrados);
      setVehiculosFiltrados(ordenados);
    }
  }, [ordenar]);

  // ---- EVENTOS DE INTERACCIÓN ----
  
  // Función para manejar cambios en los filtros
  const handleFiltersChange = (newFilters: any) => {
    // Validar que newFilters sea un objeto
    if (!newFilters || typeof newFilters !== 'object') {
      return;
    }
    
    // Si es un cambio de marca, verificar si el modelo actual sigue siendo válido
    if (newFilters.marca !== filtros.marca && filtros.modelo) {
      // Verificar si el modelo actual existe para la nueva marca
      const modelosValidos = vehiculos
        .filter(v => v.marca.toLowerCase() === newFilters.marca.toLowerCase())
        .map(v => v.modelo);
      
      // Si el modelo actual no existe para la nueva marca, lo reseteamos
      if (!modelosValidos.includes(filtros.modelo)) {
        newFilters.modelo = '';
      }
    }
    
    // Actualizar los filtros directamente
    setFiltros(newFilters);
  };

  // Resetear filtros
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
    setOrdenar('destacados');
  };

  // ---- RENDERIZADO DEL COMPONENTE ----
  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Sección principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Título de la página */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase">
            {filtros.condicion === '0km' ? 'Vehículos 0km' : 
             filtros.condicion === 'usado' ? 'Vehículos usados' : 
             'Todos los vehículos'}
          </h1>
          <p className="text-gray-500">{vehiculosFiltrados.length} vehículos encontrados</p>
        </div>

        {/* Componente de filtros - pasando solo referencias estables */}
        <VehicleFilters 
          onFiltersChange={handleFiltersChange}
          initialFilters={filtros}
          marcasDisponibles={marcasDisponibles}
          modelosDisponibles={modelosDisponibles}
        />

        {/* Encabezado de resultados */}
        <div className="flex items-center justify-between my-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
              {vehiculosFiltrados.length}
            </div>
            <h2 className="ml-2 font-bold uppercase">Vehículos encontrados</h2>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">Ordenar por:</span>
            <Select value={ordenar} onValueChange={setOrdenar}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Destacados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="destacados">Destacados</SelectItem>
                <SelectItem value="precio_asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="precio_desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="año_desc">Año: Más reciente</SelectItem>
                <SelectItem value="año_asc">Año: Más antiguo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grilla de vehículos */}
        {isLoading ? (
          <VehicleGridSkeleton />
        ) : vehiculosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculosFiltrados.map((vehiculo) => (
              <VehicleCard 
                key={vehiculo.id} 
                vehicle={vehiculo} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Car className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">
              No se encontraron vehículos
            </h3>
            <p className="mt-1 text-gray-500">
              {filtros.marca ? (
                filtros.modelo ? (
                  `No tenemos ${filtros.modelo} de ${filtros.marca} disponibles con los filtros seleccionados`
                ) : (
                  `No tenemos vehículos de ${filtros.marca} disponibles con los filtros seleccionados`
                )
              ) : (
                filtros.tipoVehiculo ? (
                  `No tenemos vehículos tipo ${filtros.tipoVehiculo} disponibles con los filtros seleccionados`
                ) : (
                  "Prueba ajustando los filtros de búsqueda"
                )
              )}
            </p>
            <Button 
              onClick={resetFilters} 
              variant="outline" 
              className="mt-4"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


