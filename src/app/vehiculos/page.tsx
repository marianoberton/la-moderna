'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Gauge, Filter, Car } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VehicleFilters from '../components/VehicleFilters';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from 'react';
import { getVehicles } from '@/services/vehicleService';
import { Vehicle } from '@/types/vehicle';
import { useRouter } from 'next/navigation';

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
const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const isNew = vehicle.kilometraje === 0 || vehicle.condicion === '0km';
  const imageUrl = vehicle.imagenes?.[0] || "/placeholder-car.jpg";
  const year = vehicle.año || 0;
  const km = vehicle.kilometraje || 0;
  const router = useRouter();

  // Función para abrir WhatsApp
  const openWhatsApp = (whatsapp: string, carInfo: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en el vehículo: ${carInfo}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  // Función para ir a la página de detalles
  const goToDetails = () => {
    router.push(`/vehiculos/${vehicle.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full relative"
    >
      {/* Imagen principal con badges - ahora clickeable */}
      <div 
        className="relative h-60 overflow-hidden bg-gray-50 p-3 cursor-pointer"
        onClick={goToDetails}
      >
        <img 
          src={imageUrl} 
            alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover object-center transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-car.jpg";
            }}
          />
          <StatusBadge 
            className={`absolute top-3 left-3 z-20 ${
            isNew
                ? 'bg-[var(--color-gold)] text-black border-[var(--color-gold)]' 
                : 'bg-[var(--color-dark-bg)] text-white border-[var(--color-dark-bg)]'
            }`}
          >
          {isNew ? 'OKM' : 'USADO'}
          </StatusBadge>
          
          {/* Año y kilometraje solo para usados - ahora a la derecha */}
        {!isNew && (
            <div className="absolute bottom-3 right-3 z-20 flex space-x-2">
              <InfoBadge className="bg-black/70 text-white">
                <Calendar className="h-3 w-3 mr-1" />
              {year}
              </InfoBadge>
              <InfoBadge className="bg-black/70 text-white">
                <Gauge className="h-3 w-3 mr-1" />
              {km.toLocaleString()} km
              </InfoBadge>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Marca y modelo - ahora clickeable */}
        <div 
          className="mb-2 sm:mb-3 cursor-pointer"
          onClick={goToDetails}
        >
            <h3 className="text-lg sm:text-xl font-bold line-clamp-1">
              {vehicle.marca} <span className="text-[var(--color-dark-bg)]">{vehicle.modelo}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{vehicle.version}</p>
          </div>
          
        {/* Precio o Consultar */}
          <div className="mt-auto">
          {isNew ? (
            <Button 
              size="sm"
              className="w-full bg-[var(--color-dark-hover)] hover:bg-[var(--color-dark-bg)] text-white"
              onClick={() => openWhatsApp("5491154645940", `${vehicle.marca} ${vehicle.modelo} ${vehicle.version}`)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="h-4 w-4 mr-1.5 text-white fill-current"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar
            </Button>
          ) : (
            <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-bold text-[var(--color-dark-bg)]">
                $ {(vehicle.precio || 0).toLocaleString()}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={goToDetails}
              >
                Ver más
              </Button>
          </div>
          )}
        </div>
      </div>
    </div>
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

// Definir el estado inicial de los filtros FUERA del componente
const initialFilterState = {
    searchTerm: '',  // Cambiado de 'busqueda' a 'searchTerm' para coincidir con VehicleFilters
    marca: '',
    modelo: '',
    tipoVehiculo: '',
    combustible: '',
    transmision: '',
    color: '',
    condicion: 'todo',
    precioMin: 0,
    precioMax: 100000000,
    añoMin: 1990,
    añoMax: new Date().getFullYear(),
    kmMin: 0,
    kmMax: 500000,
    financiacion: false,
    permuta: false,
    equipamiento: [] as string[]  // Cambiado a array para coincidir con VehicleFilters
};

export default function VehiculosPage() {
  console.log('[VehiculosPage] Render Start');
  // ---- DEFINICIONES INICIALES DE ESTADO ----
  const [ordenar, setOrdenar] = useState('destacados');
  const [filtros, setFiltros] = useState(initialFilterState); 
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  
  // Leer parámetros de URL del buscador Hero
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Crear objeto para nuevos filtros
      const newFilters: Partial<typeof initialFilterState> = {};
      
      // Mapear los parámetros de búsqueda a filtros
      if (params.has('searchTerm')) {
        newFilters.searchTerm = params.get('searchTerm') || '';
      }
      
      if (params.has('marca')) {
        newFilters.marca = params.get('marca') || '';
      }
      
      if (params.has('condicion')) {
        newFilters.condicion = params.get('condicion') || 'todo';
      }
      
      // Parámetros numéricos: precio, año, kilometraje
      if (params.has('precioMin')) {
        newFilters.precioMin = Number(params.get('precioMin')) || 0;
      }
      
      if (params.has('precioMax')) {
        newFilters.precioMax = Number(params.get('precioMax')) || 100000000;
      }
      
      if (params.has('añoMin')) {
        newFilters.añoMin = Number(params.get('añoMin')) || 1990;
      }
      
      if (params.has('añoMax')) {
        newFilters.añoMax = Number(params.get('añoMax')) || new Date().getFullYear();
      }
      
      if (params.has('tipoVehiculo')) {
        newFilters.tipoVehiculo = params.get('tipoVehiculo') || '';
      }
      
      // Si hay parámetros, actualizar filtros
      if (Object.keys(newFilters).length > 0) {
        console.log('[URL Params] Aplicando filtros desde URL:', newFilters);
        setFiltros(prevState => ({
          ...prevState,
          ...newFilters
        }));
      }
    }
  }, []);
  
  // Cargar vehículos al montar el componente
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const data = await getVehicles(true);
        console.log('Vehículos cargados desde Supabase:', data.length);
        
        // Información detallada de cada vehículo para depuración
        data.forEach((v, index) => {
          console.log(`Vehículo ${index + 1}:`, {
            id: v.id, 
            marca: v.marca, 
            modelo: v.modelo, 
            condicion: v.condicion,
            kilometraje: v.kilometraje,
            estado: v.estado,
            created_at: v.created_at
          });
        });
        
        setVehiculos(data);
      } catch (err) {
        console.error('Error al cargar vehículos:', err);
        setError('Error al cargar los vehículos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // ---- LÓGICA DE FILTRADO Y ORDENACIÓN (Funciones Puras) ----
  
  // Función para verificar si hay filtros activos (ahora recibe filtros como argumento)
  const checkActiveFilters = useCallback((currentFiltros: typeof initialFilterState): boolean => {
    console.log('[checkActiveFilters] Verificando filtros:', currentFiltros);
    // Filtros básicos
    if (currentFiltros.searchTerm || 
        currentFiltros.marca || 
        currentFiltros.modelo || 
        currentFiltros.combustible || 
        currentFiltros.transmision || 
        currentFiltros.color ||
        currentFiltros.tipoVehiculo ||
        currentFiltros.financiacion || 
        currentFiltros.permuta) {
      console.log('[checkActiveFilters] Filtro básico activo encontrado.');
      return true;
    }
    
    // Filtros de rango (comparar con los valores iniciales)
    if (currentFiltros.precioMin > initialFilterState.precioMin || 
        currentFiltros.precioMax < initialFilterState.precioMax ||
        currentFiltros.añoMin > initialFilterState.añoMin || 
        currentFiltros.añoMax < initialFilterState.añoMax ||
        currentFiltros.kmMin > initialFilterState.kmMin || 
        currentFiltros.kmMax < initialFilterState.kmMax) {
      console.log('[checkActiveFilters] Filtro de rango activo encontrado.');
      return true;
    }
    
    // Filtros de equipamiento (ahora como array)
    if (currentFiltros.equipamiento && currentFiltros.equipamiento.length > 0) {
      console.log('[checkActiveFilters] Filtro de equipamiento activo encontrado.');
      return true;
    }
    
    // Si la condición no es 'todo'
    if (currentFiltros.condicion !== initialFilterState.condicion) {
      console.log('[checkActiveFilters] Filtro de condición activo encontrado:', currentFiltros.condicion);
      return true;
    }
    
    console.log('[checkActiveFilters] Ningún filtro activo encontrado.');
    return false;
  }, []); // Dependencia vacía porque initialFilterState es constante

  // Función para aplicar filtros (ahora recibe filtros como argumento)
  const aplicarFiltros = useCallback((currentFiltros: typeof initialFilterState): Vehicle[] => {
    console.log('--- Iniciando aplicarFiltros ---');
    console.log('Filtros a aplicar:', JSON.stringify(currentFiltros, null, 2));
    
    // Validar los rangos
    console.log('Rango de precios:', currentFiltros.precioMin, 'a', currentFiltros.precioMax);
    console.log('Rango de años:', currentFiltros.añoMin, 'a', currentFiltros.añoMax);
    console.log('Rango de kilometraje:', currentFiltros.kmMin, 'a', currentFiltros.kmMax);
    
    // Validar el equipamiento
    console.log('Tipo de equipamiento:', typeof currentFiltros.equipamiento);
    if (Array.isArray(currentFiltros.equipamiento)) {
      console.log('Equipamiento (array):', currentFiltros.equipamiento);
    } else if (typeof currentFiltros.equipamiento === 'object') {
      console.log('Equipamiento (objeto):', currentFiltros.equipamiento);
    }
    
    return vehiculos.filter(vehiculo => {
      let pasaFiltros = true;
      
      // 1. Filtro de búsqueda
      if (pasaFiltros && currentFiltros.searchTerm) {
        const searchTerm = currentFiltros.searchTerm.toLowerCase();
        const searchableText = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          pasaFiltros = false;
        }
      }

      // 2. Filtro de marca
      if (pasaFiltros && currentFiltros.marca) {
        const marca = vehiculo.marca || '';
        console.log(`Filtrando por marca: "${currentFiltros.marca}" vs "${marca}" (ID: ${vehiculo.id})`);
        // Comparación insensible a mayúsculas/minúsculas
        if (marca.toLowerCase() !== currentFiltros.marca.toLowerCase()) {
          pasaFiltros = false;
          console.log(`Vehículo ${vehiculo.id} filtrado por marca`);
        }
      }
      
      // 3. Filtro de modelo
      if (pasaFiltros && currentFiltros.modelo) {
        const modelo = vehiculo.modelo || '';
        console.log(`Filtrando por modelo: "${currentFiltros.modelo}" vs "${modelo}" (ID: ${vehiculo.id})`);
        // Comparación insensible a mayúsculas/minúsculas
        if (modelo.toLowerCase() !== currentFiltros.modelo.toLowerCase()) {
          pasaFiltros = false;
          console.log(`Vehículo ${vehiculo.id} filtrado por modelo`);
        }
      }
      
      // 4. Filtro de tipo de vehículo
      if (pasaFiltros && currentFiltros.tipoVehiculo) {
        if (vehiculo.tipo !== currentFiltros.tipoVehiculo) {
            pasaFiltros = false;
         }
      }

      // 5. Filtro de combustible
      if (pasaFiltros && currentFiltros.combustible) {
        if (vehiculo.combustible !== currentFiltros.combustible) {
        pasaFiltros = false;
        }
      }

      // 6. Filtro de transmisión
      if (pasaFiltros && currentFiltros.transmision) {
        if (vehiculo.transmision !== currentFiltros.transmision) {
          pasaFiltros = false;
        }
      }
      
      // 7. Filtro de color
      if (pasaFiltros && currentFiltros.color) {
        if (vehiculo.color !== currentFiltros.color) {
        pasaFiltros = false;
        }
      }
      
      // 8. Filtro de condición (0km/Usado)
      if (pasaFiltros && currentFiltros.condicion !== 'todo') {
        // En la base de datos, 0km = nuevo, usado = usado
        const esNuevo = (vehiculo.kilometraje === 0) || (vehiculo.condicion === '0km');
        if (currentFiltros.condicion === 'NUEVO' && !esNuevo) {
          console.log(`Filtrando vehículo ${vehiculo.id} porque no es nuevo:`, vehiculo.kilometraje, vehiculo.condicion);
          pasaFiltros = false;
        }
        if (currentFiltros.condicion === 'USADO' && esNuevo) {
          console.log(`Filtrando vehículo ${vehiculo.id} porque no es usado:`, vehiculo.kilometraje, vehiculo.condicion);
          pasaFiltros = false;
        }
      }
      
      // 9. Filtro de precio
      if (pasaFiltros && vehiculo.precio) {
        // Usar los campos individuales en lugar del rango
        const minPrecio = currentFiltros.precioMin !== undefined ? currentFiltros.precioMin : 0;
        const maxPrecio = currentFiltros.precioMax !== undefined ? currentFiltros.precioMax : 100000000;
        
        console.log(`Filtrando vehículo ${vehiculo.id} por precio: ${minPrecio} <= ${vehiculo.precio} <= ${maxPrecio}`);
        
        if (vehiculo.precio < minPrecio || vehiculo.precio > maxPrecio) {
          pasaFiltros = false;
          console.log(`Vehículo ${vehiculo.id} filtrado por precio: ${vehiculo.precio}`);
        }
      }
      
      // 10. Filtro de año
      if (pasaFiltros && vehiculo.año) {
        // Usar los campos individuales en lugar del rango
        const minAño = currentFiltros.añoMin !== undefined ? currentFiltros.añoMin : 1990;
        const maxAño = currentFiltros.añoMax !== undefined ? currentFiltros.añoMax : new Date().getFullYear();
        
        console.log(`Filtrando vehículo ${vehiculo.id} por año: ${minAño} <= ${vehiculo.año} <= ${maxAño}`);
        
        if (vehiculo.año < minAño || vehiculo.año > maxAño) {
          pasaFiltros = false;
          console.log(`Vehículo ${vehiculo.id} filtrado por año: ${vehiculo.año}`);
        }
      }
      
      // 11. Filtro de kilometraje
      if (pasaFiltros && vehiculo.kilometraje !== undefined) {
        // Usar los campos individuales en lugar del rango
        const minKm = currentFiltros.kmMin !== undefined ? currentFiltros.kmMin : 0;
        const maxKm = currentFiltros.kmMax !== undefined ? currentFiltros.kmMax : 500000;
        
        console.log(`Filtrando vehículo ${vehiculo.id} por kilometraje: ${minKm} <= ${vehiculo.kilometraje} <= ${maxKm}`);
        
        if (vehiculo.kilometraje < minKm || vehiculo.kilometraje > maxKm) {
          pasaFiltros = false;
          console.log(`Vehículo ${vehiculo.id} filtrado por kilometraje: ${vehiculo.kilometraje}`);
        }
      }
      
      // 12. Filtro de financiación
      if (pasaFiltros && currentFiltros.financiacion) {
        if (!vehiculo.financiacion) {
          pasaFiltros = false;
        }
      }
      
      // 13. Filtro de permuta
      if (pasaFiltros && currentFiltros.permuta) {
        if (!vehiculo.permuta) {
          pasaFiltros = false;
        }
      }
      
      // 14. Filtro de equipamiento - asegurarse de que funcione con estructura de array o de objeto
      if (pasaFiltros && vehiculo.equipamiento) {
        // Verificar cada equipamiento seleccionado
        if (Array.isArray(currentFiltros.equipamiento) && currentFiltros.equipamiento.length > 0) {
          console.log(`Verificando equipamiento para vehículo ${vehiculo.id}:`, currentFiltros.equipamiento);
          // Verificar que el vehículo tenga todos los equipamientos seleccionados
          for (const item of currentFiltros.equipamiento) {
            if (!vehiculo.equipamiento[item]) {
              console.log(`Vehículo ${vehiculo.id} filtrado por equipamiento: falta ${item}`);
              pasaFiltros = false;
              break;
            }
          }
        }
      }

      return pasaFiltros;
    });
  }, [vehiculos]);

  // Función para ordenar vehículos (ahora recibe vehículos y orden como argumento)
  const ordenarVehiculos = useCallback((vehiculosToSort: Vehicle[], orderBy: string): Vehicle[] => {
    console.log('[ordenarVehiculos] Ordenando por:', orderBy);
    const ordenados = [...vehiculosToSort];
    
    ordenados.sort((a, b) => {
    switch (orderBy) {
        case 'precio-asc':
          return (a.precio || 0) - (b.precio || 0);
        case 'precio-desc':
          return (b.precio || 0) - (a.precio || 0);
        case 'año-desc':
          return (b.año || 0) - (a.año || 0);
        case 'año-asc':
          return (a.año || 0) - (b.año || 0);
        case 'destacados':
          return ((b.is_featured || b.featured) ? 1 : 0) - ((a.is_featured || a.featured) ? 1 : 0);
        default:
          return 0;
      }
    });
    
    return ordenados;
  }, []);

  // ---- ESTADOS DERIVADOS Y EFECTOS ----

  // Estado para la lista final mostrada (resultado de filtrar Y ordenar)
  const [vehiculosMostrados, setVehiculosMostrados] = useState<Vehicle[]>(() => ordenarVehiculos([...vehiculos], 'destacados'));
  // Estado para indicar si hay filtros activos (calculado en el efecto)
  const [hayFiltrosActivos, setHayFiltrosActivos] = useState(() => checkActiveFilters(filtros));
  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  // Ref para saltar el primer efecto
  const isInitialMount = useRef(true);

  // Efecto principal para FILTRAR Y ORDENAR cuando cambian los filtros o el orden
  useEffect(() => {
    // Saltar el montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log('[EFFECT Principal] Montaje inicial, saltando.');
      // Asegurar que el estado inicial de hayFiltrosActivos sea correcto
      setHayFiltrosActivos(checkActiveFilters(filtros));
      // Asegurar que la lista inicial esté ordenada
      setVehiculosMostrados(prev => ordenarVehiculos(prev, ordenar));
      return;
    }

    console.log('[EFFECT Principal] Ejecutando por cambio en filtros u ordenar.');
    setIsLoading(true);

    // 1. Verificar si hay filtros activos
    const isActive = checkActiveFilters(filtros);
    console.log('[EFFECT Principal] checkActiveFilters resultado:', isActive);
    setHayFiltrosActivos(isActive); // Actualizar estado

    // 2. Aplicar filtros si es necesario
    let vehiculosProcesados: Vehicle[];
    if (isActive) {
      console.log('[EFFECT Principal] Aplicando filtros...');
      vehiculosProcesados = aplicarFiltros(filtros);
    } else {
      console.log('[EFFECT Principal] No hay filtros activos, usando todos los vehículos.');
      vehiculosProcesados = [...vehiculos]; // Usar copia del original
    }
    console.log('[EFFECT Principal] Vehículos después de filtrar:', vehiculosProcesados.length);

    // 3. Ordenar la lista resultante
    console.log('[EFFECT Principal] Aplicando ordenación. Ordenar por:', ordenar);
    const vehiculosFinales = ordenarVehiculos(vehiculosProcesados, ordenar);
    console.log('[EFFECT Principal] Vehículos después de ordenar:', vehiculosFinales.length);

    // 4. Actualizar el estado de los vehículos mostrados (solo si cambia)
    setVehiculosMostrados(currentVehiculos => {
      const finalIds = vehiculosFinales.map(v => v.id).join(',');
      const actualesIds = currentVehiculos.map(v => v.id).join(',');

      if (finalIds !== actualesIds) {
        console.log('[EFFECT Principal] Actualizando vehiculosMostrados con', vehiculosFinales.length, 'vehículos.');
        return vehiculosFinales; 
      } else {
        console.log('[EFFECT Principal] Sin cambios en vehiculosMostrados. Saltando actualización.');
        return currentVehiculos; 
      }
    });

    // 5. Quitar el estado de carga (con un pequeño delay para permitir renderizado)
    const timerId = setTimeout(() => {
        setIsLoading(false);
        console.log('[EFFECT Principal] Finalizado. isLoading=false');
    }, 0); // Timeout 0 para ejecutar después del render actual

    return () => clearTimeout(timerId); // Limpiar timeout

  // Dependencias: filtros, ordenar (vehiculos, checkActiveFilters, aplicarFiltros, ordenarVehiculos son estables gracias a useMemo/useCallback)
  }, [filtros, ordenar, vehiculos, checkActiveFilters, aplicarFiltros, ordenarVehiculos]); 

  // ELIMINADO: Efecto de ordenación separado

  // Agregar función para loguear las pestañas y el estado actual
  useEffect(() => {
    // Solo ejecutar en el lado del cliente
    if (typeof window !== 'undefined') {
      console.log('[DEBUG TABS] Estado actual de filtros.condicion:', filtros.condicion);
      console.log('[DEBUG TABS] Valores de filtros:', JSON.stringify(filtros, null, 2));
    }
  }, [filtros]);

  // ---- EVENTOS DE INTERACCIÓN ----
  
  // Función para manejar cambios en los filtros con procesamiento especial para condición
  const handleFiltersChange = useCallback((newFilterData: Partial<typeof initialFilterState>) => {
    console.log('[handleFiltersChange] Recibido:', newFilterData);
    
    // Log especial y procesamiento para condición
    if ('condicion' in newFilterData) {
      console.log('[handleFiltersChange] Nueva condición recibida:', newFilterData.condicion);
      
      // Procesar condición - asegurarnos de que se maneje correctamente
      if (newFilterData.condicion === 'NUEVO' || newFilterData.condicion === 'nuevo') {
        newFilterData.condicion = 'NUEVO'; // Normalizar a mayúsculas
      } else if (newFilterData.condicion === 'USADO' || newFilterData.condicion === 'usado') {
        newFilterData.condicion = 'USADO'; // Normalizar a mayúsculas
      }
    }
    
    // Log específico para kilometraje
    if (newFilterData.kmMin || newFilterData.kmMax) {
      console.log('[handleFiltersChange] Kilometraje Rango recibido:', newFilterData.kmMin, 'a', newFilterData.kmMax);
    }
    
    setFiltros(prevFiltros => {
      // Crear el estado potencial siguiente
      let potentialNextFiltros = { ...prevFiltros, ...newFilterData };

      // Lógica de reseteo de modelo si cambia la marca (corregido chequeo de undefined)
      if (newFilterData.marca !== undefined && newFilterData.marca !== prevFiltros.marca && prevFiltros.modelo) {
        console.log('[handleFiltersChange] Marca cambió. Verificando modelo.');
        const modelosValidos = vehiculos
          .filter(v => v.marca.toLowerCase() === newFilterData.marca!.toLowerCase()) // Usar ! porque ya verificamos undefined
          .map(v => v.modelo);
        if (!modelosValidos.includes(prevFiltros.modelo)) {
          console.log('[handleFiltersChange] Reseteando modelo.');
          potentialNextFiltros.modelo = ''; // Resetear modelo en el objeto potencial
        }
      }
      
      console.log('[handleFiltersChange] Estado filtros antiguo:', prevFiltros);
      console.log('[handleFiltersChange] Estado filtros nuevo:', potentialNextFiltros);
      
      // Comparar JSON para decidir si actualizar (simple pero efectivo para objetos anidados)
      if (JSON.stringify(potentialNextFiltros) !== JSON.stringify(prevFiltros)) {
        console.log('[handleFiltersChange] Filtros cambiaron semánticamente. Actualizando estado.');
        return potentialNextFiltros; // Devolver el nuevo estado
      } else {
        console.log('[handleFiltersChange] Filtros no cambiaron semánticamente. Saltando actualización.');
        return prevFiltros; // Devolver el estado anterior
      }
    });
    
    // Si se cambió la condición, forzar actualización de UI después de un pequeño retraso
    if ('condicion' in newFilterData) {
      setTimeout(() => {
        console.log('[handleFiltersChange] Verificando estado después de cambio de condición:', 
          'condición actual:', filtros.condicion);
      }, 10);
    }
  }, [vehiculos, filtros.condicion]); // Depende de vehiculos para la lógica de reseteo de modelo y filtros.condicion para logs

  // Resetear filtros - Usar la constante
  const resetFilters = useCallback(() => {
    console.log('[resetFilters] Reseteando filtros y orden.');
    setFiltros(initialFilterState); // Usar la constante
    setOrdenar('destacados');
  }, []); // Sin dependencias

  // ---- CÁLCULO DE MARCAS Y MODELOS DISPONIBLES (ANTES DEL RENDER) ----
  
  // Calculamos las marcas disponibles solo una vez o cuando 'vehiculos' cambia
  const marcasDisponibles = useMemo(() => {
    console.log('[useMemo] Calculando marcasDisponibles');
    return [...new Set(vehiculos.map(v => v.marca))].sort();
  }, [vehiculos]);

  // Calculamos los modelos disponibles solo cuando cambia la marca seleccionada o 'vehiculos'
  const modelosDisponibles = useMemo(() => {
    console.log('[useMemo] Calculando modelosDisponibles para marca:', filtros.marca);
    if (!filtros.marca) return [];
    
    return [...new Set(vehiculos
      .filter(v => v.marca.toLowerCase() === filtros.marca.toLowerCase())
      .map(v => v.modelo))]
      .sort();
  }, [vehiculos, filtros.marca]);

  // Calcular conteos para las pestañas - SOLO VEHÍCULOS ACTIVOS
  const tabCounts = useMemo(() => {
    // Para el conteo, usamos todos los vehículos disponibles (sin filtros adicionales)
    // excepto los filtros básicos como marca, modelo, etc.
    
    // Contamos todos los vehículos directamente (no usamos aplicarFiltros)
    const countTodo = vehiculos.length;
    
    // Contamos nuevos y usados de todos los vehículos
    const countNuevo = vehiculos.filter(v => ((v.kilometraje || 0) === 0) || (v.condicion === '0km')).length;
    const countUsado = vehiculos.filter(v => ((v.kilometraje || 0) > 0) && (v.condicion !== '0km')).length;
    
    console.log('[useMemo] tabCounts calculados (recuento directo):', { 
      countTodo, 
      countNuevo, 
      countUsado, 
      totalVehiculos: vehiculos.length
    });
    
    return { countTodo, countNuevo, countUsado };
  }, [vehiculos]);

  // ---- RENDERIZADO DEL COMPONENTE ----
  console.log('[VehiculosPage] Render executing JSX. State:', { isLoading, hayFiltrosActivos, vehiculosMostradosLength: vehiculosMostrados.length });
  // Log adicional para depurar visibilidad del botón
  console.log('[RENDER] hayFiltrosActivos:', hayFiltrosActivos); 
  
  // Lógica de renderizado condicional (ahora usa vehiculosMostrados)
  const renderContent = () => {
    console.log('[RENDER] DEBUG: Evaluando condiciones:', { isLoading, hayFiltrosActivos, vehiculosMostradosLength: vehiculosMostrados.length });
    if (isLoading) {
      console.log('[RENDER] DEBUG: Mostrando VehicleGridSkeleton');
      return <VehicleGridSkeleton />;
    }
    if (hayFiltrosActivos && vehiculosMostrados.length === 0) {
      console.log('[RENDER] DEBUG: Mostrando mensaje "No se encontraron vehículos"');
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img 
            src="/images/logo_full.svg" 
            alt="La Moderna" 
            className="h-16 w-auto mb-4"
          />
          <h3 className="text-lg font-medium">No se encontraron vehículos</h3>
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
           <Button onClick={resetFilters} variant="outline" className="mt-4">
             Limpiar filtros
           </Button>
        </div>
      );
    }
    // Modificado: Mostrar grid si hay vehículos, independientemente de si hay filtros activos o no
    if (vehiculosMostrados.length > 0) { 
      console.log('[RENDER] DEBUG: Mostrando grid de vehículos:', vehiculosMostrados.length);
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiculosMostrados.map((vehiculo) => (
            <VehicleCard key={vehiculo.id} vehicle={vehiculo} />
          ))}
        </div>
      );
    }
    // Fallback si no está cargando y no hay vehículos
    console.log('[RENDER] DEBUG: Mostrando mensaje de carga/inicial/vacío (fallback)');
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <img 
          src="/images/logo_full.svg" 
          alt="La Moderna" 
          className="h-16 w-auto mb-4"
        />
        <h3 className="text-lg font-medium">
          {vehiculos.length === 0 ? "Cargando vehículos..." : "No hay vehículos disponibles"}
        </h3>
        {vehiculos.length > 0 && (
          <div className="mt-4 max-w-md text-gray-500">
            <p>No se están mostrando vehículos. Esto puede deberse a varias razones:</p>
            <ul className="list-disc text-left mt-2 ml-6">
              <li>No hay vehículos marcados como "Disponible" (estado activo) en la base de datos</li>
              <li>Los vehículos pueden estar marcados como "Reservado", "Vendido" o "En pausa"</li>
              <li>Los vehículos disponibles están filtrados por los criterios actuales</li>
            </ul>
            <div className="mt-4">
              <Button onClick={resetFilters} variant="outline">
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Título y contador (usa vehiculosMostrados) */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase">
            {filtros.condicion === '0km' ? 'Vehículos 0km' : 
             filtros.condicion === 'usado' ? 'Vehículos usados' : 
             'Todos los vehículos'}
          </h1>
          <p className="text-gray-500">{vehiculosMostrados.length} vehículos encontrados</p>
        </div>

        {/* Componente de filtros (AHORA CON TAB COUNTS) */}
        <VehicleFilters 
          onFiltersChange={handleFiltersChange}
          initialFilters={filtros} // Pasamos los filtros actuales para que sepa cuál está activo
          marcasDisponibles={marcasDisponibles}
          modelosDisponibles={modelosDisponibles}
          tabCounts={tabCounts} // <--- Pasar los contadores calculados
        />

        {/* Encabezado de resultados (usa vehiculosMostrados) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between my-6 gap-4">
          {/* Contador, Título y Botón Limpiar */}
          <div className="flex items-center gap-2"> {/* Contenedor para contador, título y botón */}
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm shrink-0">
              {vehiculosMostrados.length}
            </div>
            <h2 className="ml-2 font-bold uppercase whitespace-nowrap">Vehículos encontrados</h2>
            {/* Botón Limpiar Filtros (visible si hay filtros activos) */}
            {hayFiltrosActivos && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters} 
                className="ml-2" // Añadir margen izquierdo
              >
                Limpiar filtros
              </Button>
            )}
          </div>
          
          {/* Selector de Orden (ahora separado) */}
          <div className="w-full sm:w-auto"> {/* Contenedor para el selector */}
            <Select value={ordenar} onValueChange={setOrdenar}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="destacados">Destacados</SelectItem>
                <SelectItem value="precio_asc">Precio (Menor a Mayor)</SelectItem>
                {/* Añadir más opciones si es necesario */}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Renderizado del contenido */}
        {renderContent()}
      </div>
    </div>
  );
}


