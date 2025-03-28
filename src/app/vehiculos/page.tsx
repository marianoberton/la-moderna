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

// Definir el estado inicial de los filtros FUERA del componente
const initialFilterState = {
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
};

export default function VehiculosPage() {
  console.log('[VehiculosPage] Render Start');
  // ---- DEFINICIONES INICIALES DE ESTADO ----
  const [ordenar, setOrdenar] = useState('destacados');
  // Usar la constante para el estado inicial
  const [filtros, setFiltros] = useState(initialFilterState); 
  
  const [isMobile, setIsMobile] = useState(false);
  
  // ---- DATOS DE VEHÍCULOS (simulados) ----
  const vehiculos = useMemo(() => [
    {
      id: 1,
      marca: 'Volkswagen',
      modelo: 'Taos',
      version: 'TAOS 1.4 HIGHLINE DSG',
      precio: 42500000,
      año: 2025,
      km: 0,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/0km/taos003.jpg',
      fotos: 12,
      destacado: true,
      fechaPublicacion: new Date('2024-03-01'),
      highlights: ['Motor 1.4 TSI', 'Caja DSG', 'Asistente de conducción'],
      tipoVehiculo: 'SUV',
      color: 'blanco',
      financiacion: true,
      permuta: true,
      equipamiento: {
        aireAcondicionado: true,
        direccionAsistida: true,
        vidriosElectricos: true,
        tapiceriaCuero: false,
        cierreCentralizado: true,
        alarma: true,
        airbags: true,
        bluetooth: true,
        controlCrucero: true,
        techoSolar: false,
        llantasAleacion: true,
        traccion4x4: false,
        abs: true,
        esp: true,
        asistenteFrenado: true,
        camaraReversa: true,
        sensorEstacionamiento: true,
        navegacionGPS: true,
        controlVoz: false,
        asientosElectricos: false,
        asientosCalefaccionados: false,
        volanteCuero: true,
        climatizador: true
      }
    },
    {
      id: 2,
      marca: 'Volkswagen',
      modelo: 'T-Cross',
      version: 'T-CROSS 1.4 TSI COMFORTLINE',
      precio: 35900000,
      año: 2025,
      km: 0,
      transmision: 'Manual',
      combustible: 'Nafta',
      imagen: '/images/0km/tcross_2024_1_confortline.jpg',
      fotos: 14,
      destacado: false,
      fechaPublicacion: new Date('2024-02-15'),
      highlights: ['Pantalla táctil', 'Conectividad Apple/Android', 'Climatizador'],
      tipoVehiculo: 'SUV',
      color: 'gris',
      financiacion: true,
      permuta: false,
      equipamiento: {
        aireAcondicionado: true,
        direccionAsistida: true,
        vidriosElectricos: true,
        tapiceriaCuero: false,
        cierreCentralizado: true,
        alarma: true,
        airbags: true,
        bluetooth: true,
        controlCrucero: false,
        techoSolar: false,
        llantasAleacion: true,
        traccion4x4: false,
        abs: true,
        esp: true,
        asistenteFrenado: true,
        camaraReversa: false,
        sensorEstacionamiento: true,
        navegacionGPS: false,
        controlVoz: false,
        asientosElectricos: false,
        asientosCalefaccionados: false,
        volanteCuero: false,
        climatizador: true
      }
    },
    {
      id: 3,
      marca: 'Volkswagen', 
      modelo: 'Nivus',
      version: 'NIVUS 200 TSI HIGHLINE AT',
      precio: 39800000,
      año: 2025,
      km: 0,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/0km/nivus0.jpg',
      fotos: 16,
      destacado: true,
      fechaPublicacion: new Date('2024-02-20'),
      highlights: ['Motor TSI', 'Techo panorámico', 'Sensores de parking'],
      tipoVehiculo: 'SUV',
      color: 'negro',
      financiacion: true,
      permuta: true,
      equipamiento: {
        aireAcondicionado: true,
        direccionAsistida: true,
        vidriosElectricos: true,
        tapiceriaCuero: true,
        cierreCentralizado: true,
        alarma: true,
        airbags: true,
        bluetooth: true,
        controlCrucero: true,
        techoSolar: true,
        llantasAleacion: true,
        traccion4x4: false,
        abs: true,
        esp: true,
        asistenteFrenado: true,
        camaraReversa: true,
        sensorEstacionamiento: true,
        navegacionGPS: true,
        controlVoz: true,
        asientosElectricos: true,
        asientosCalefaccionados: true,
        volanteCuero: true,
        climatizador: true
      }
    },
    {
      id: 4,
      marca: 'Toyota',
      modelo: 'Corolla Cross',
      version: 'COROLLA CROSS 2.0 XEI CVT',
      precio: 38900000,
      año: 2025,
      km: 0,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/0km/corolla-cross0.jpg',
      fotos: 10,
      destacado: false,
      fechaPublicacion: new Date('2024-03-05'),
      highlights: ['Motor 2.0L', 'Climatizador bizona', 'Control de crucero'],
      tipoVehiculo: 'SUV',
      color: 'rojo',
      financiacion: true,
      permuta: false,
      equipamiento: {
        aireAcondicionado: true,
        direccionAsistida: true,
        vidriosElectricos: true,
        tapiceriaCuero: true,
        cierreCentralizado: true,
        alarma: true,
        airbags: true,
        bluetooth: true,
        controlCrucero: true,
        techoSolar: false,
        llantasAleacion: true,
        traccion4x4: false,
        abs: true,
        esp: true,
        asistenteFrenado: true,
        camaraReversa: true,
        sensorEstacionamiento: true,
        navegacionGPS: true,
        controlVoz: false,
        asientosElectricos: false,
        asientosCalefaccionados: true,
        volanteCuero: true,
        climatizador: true
      }
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
      tipoVehiculo: 'CAMIONETA',
      color: 'plateado',
      financiacion: true,
      permuta: true,
      equipamiento: {
        aireAcondicionado: true,
        direccionAsistida: true,
        vidriosElectricos: true,
        tapiceriaCuero: true,
        cierreCentralizado: true,
        alarma: true,
        airbags: true,
        bluetooth: true,
        controlCrucero: true,
        techoSolar: false,
        llantasAleacion: true,
        traccion4x4: true,
        abs: true,
        esp: true,
        asistenteFrenado: true,
        camaraReversa: true,
        sensorEstacionamiento: true,
        navegacionGPS: true,
        controlVoz: false,
        asientosElectricos: true,
        asientosCalefaccionados: true,
        volanteCuero: true,
        climatizador: true
      }
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
      tipoVehiculo: 'CAMIONETA',
      color: 'gris',
      financiacion: false,
      permuta: true,
      equipamiento: {
        aireAcondicionado: true,
        direccionAsistida: true,
        vidriosElectricos: true,
        tapiceriaCuero: false,
        cierreCentralizado: true,
        alarma: true,
        airbags: true,
        bluetooth: true,
        controlCrucero: false,
        techoSolar: false,
        llantasAleacion: true,
        traccion4x4: false,
        abs: true,
        esp: true,
        asistenteFrenado: true,
        camaraReversa: false,
        sensorEstacionamiento: true,
        navegacionGPS: false,
        controlVoz: false,
        asientosElectricos: false,
        asientosCalefaccionados: false,
        volanteCuero: true,
        climatizador: false
      }
    }
  ], []); 
  console.log('[VehiculosPage] vehiculos count:', vehiculos.length);

  // ---- LÓGICA DE FILTRADO Y ORDENACIÓN (Funciones Puras) ----
  
  // Función para verificar si hay filtros activos (ahora recibe filtros como argumento)
  const checkActiveFilters = useCallback((currentFiltros: typeof initialFilterState): boolean => {
    console.log('[checkActiveFilters] Verificando filtros:', currentFiltros);
    // Filtros básicos
    if (currentFiltros.busqueda || 
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
    if (currentFiltros.precioRango[0] > initialFilterState.precioRango[0] || 
        currentFiltros.precioRango[1] < initialFilterState.precioRango[1] ||
        currentFiltros.añoRango[0] > initialFilterState.añoRango[0] || 
        currentFiltros.añoRango[1] < initialFilterState.añoRango[1] ||
        currentFiltros.kilometrajeRango[0] > initialFilterState.kilometrajeRango[0] || 
        currentFiltros.kilometrajeRango[1] < initialFilterState.kilometrajeRango[1]) {
      console.log('[checkActiveFilters] Filtro de rango activo encontrado.');
      return true;
    }
    
    // Filtros de equipamiento
    if (Object.values(currentFiltros.equipamiento).some(v => v)) {
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
  const aplicarFiltros = useCallback((currentFiltros: typeof initialFilterState): Vehiculo[] => {
    console.log('--- Iniciando aplicarFiltros ---');
    console.log('Filtros a aplicar:', currentFiltros);
    if (vehiculos.length === 0) {
        console.log('[aplicarFiltros] No hay vehículos base para filtrar.');
        return [];
    }
    
    const vehiculosFiltrados = vehiculos.filter(vehiculo => {
      let pasaFiltros = true; // Asumir que pasa hasta que un filtro lo descarte

      // 1. Filtro de Búsqueda (marca, modelo, version)
      if (currentFiltros.busqueda) {
        const busquedaLower = currentFiltros.busqueda.toLowerCase();
        if (
          !vehiculo.marca.toLowerCase().includes(busquedaLower) &&
          !vehiculo.modelo.toLowerCase().includes(busquedaLower) &&
          !vehiculo.version.toLowerCase().includes(busquedaLower)
        ) {
          // console.log(`[Filtro Busqueda] Descartado ${vehiculo.id}: ${currentFiltros.busqueda} no encontrado`);
          pasaFiltros = false;
        }
      }

      // 2. Filtro de Marca
      if (pasaFiltros && currentFiltros.marca && vehiculo.marca.toLowerCase() !== currentFiltros.marca.toLowerCase()) {
        // console.log(`[Filtro Marca] Descartado ${vehiculo.id}: ${vehiculo.marca} !== ${currentFiltros.marca}`);
        pasaFiltros = false;
      }

      // 3. Filtro de Modelo
      if (pasaFiltros && currentFiltros.modelo && vehiculo.modelo.toLowerCase() !== currentFiltros.modelo.toLowerCase()) {
        // console.log(`[Filtro Modelo] Descartado ${vehiculo.id}: ${vehiculo.modelo} !== ${currentFiltros.modelo}`);
        pasaFiltros = false;
      }

      // 4. Filtro de Condición (0km/Usado)
      if (pasaFiltros && currentFiltros.condicion !== 'todo') {
        if (currentFiltros.condicion === '0km' && vehiculo.km > 0) {
          // console.log(`[Filtro Condicion] Descartado ${vehiculo.id}: Es usado, se busca 0km`);
          pasaFiltros = false;
        }
        if (currentFiltros.condicion === 'usado' && vehiculo.km === 0) {
          // console.log(`[Filtro Condicion] Descartado ${vehiculo.id}: Es 0km, se busca usado`);
          pasaFiltros = false;
        }
      }
      
      // 5. Filtro de Tipo de Vehículo
      if (pasaFiltros && currentFiltros.tipoVehiculo) {
         const tipoFiltro = currentFiltros.tipoVehiculo.toLowerCase().trim();
         const tipoVehiculoActual = vehiculo.tipoVehiculo?.toLowerCase().trim(); // Usar optional chaining
         if (!tipoVehiculoActual || tipoFiltro !== tipoVehiculoActual) {
            // console.log(`[Filtro Tipo] Descartado ${vehiculo.id}: ${tipoVehiculoActual} !== ${tipoFiltro}`);
            pasaFiltros = false;
         }
      }

      // 6. Filtro de Combustible
      if (pasaFiltros && currentFiltros.combustible && vehiculo.combustible.toLowerCase() !== currentFiltros.combustible.toLowerCase()) {
        // console.log(`[Filtro Combustible] Descartado ${vehiculo.id}: ${vehiculo.combustible} !== ${currentFiltros.combustible}`);
        pasaFiltros = false;
      }

      // 7. Filtro de Transmisión (CON NORMALIZACIÓN)
      if (pasaFiltros && currentFiltros.transmision) {
        // Normalizar: convertir a minúsculas, quitar tildes y espacios extra
        const normalizeString = (str: string) => 
          str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

        const filtroTransmisionNorm = normalizeString(currentFiltros.transmision);
        const vehiculoTransmisionNorm = normalizeString(vehiculo.transmision);

        console.log(`[Filtro Transmision] Vehiculo ${vehiculo.id}: Comparando normalizado "${vehiculoTransmisionNorm}" con filtro normalizado "${filtroTransmisionNorm}"`);
        
        if (vehiculoTransmisionNorm !== filtroTransmisionNorm) {
          console.log(`[Filtro Transmision] Descartado ${vehiculo.id}: "${vehiculoTransmisionNorm}" !== "${filtroTransmisionNorm}"`);
          pasaFiltros = false;
        }
      }
      
      // 8. Filtro de Color
      if (pasaFiltros && currentFiltros.color && vehiculo.color?.toLowerCase() !== currentFiltros.color.toLowerCase()) { // Usar optional chaining
        // console.log(`[Filtro Color] Descartado ${vehiculo.id}: ${vehiculo.color} !== ${currentFiltros.color}`);
        pasaFiltros = false;
      }

      // 9. Filtro de Financiación
      if (pasaFiltros && currentFiltros.financiacion && !vehiculo.financiacion) {
        // console.log(`[Filtro Financiacion] Descartado ${vehiculo.id}: No ofrece financiacion`);
        pasaFiltros = false;
      }

      // 10. Filtro de Permuta
      if (pasaFiltros && currentFiltros.permuta && !vehiculo.permuta) {
        // console.log(`[Filtro Permuta] Descartado ${vehiculo.id}: No acepta permuta`);
        pasaFiltros = false;
      }

      // 11. Filtros de Rango (Precio, Año, Kilometraje)
      // Solo aplicar si el rango es diferente al inicial
      if (pasaFiltros && (currentFiltros.precioRango[0] > initialFilterState.precioRango[0] || currentFiltros.precioRango[1] < initialFilterState.precioRango[1])) {
        if (vehiculo.precio < currentFiltros.precioRango[0] || vehiculo.precio > currentFiltros.precioRango[1]) {
          // console.log(`[Filtro Precio] Descartado ${vehiculo.id}: ${vehiculo.precio} fuera de [${currentFiltros.precioRango[0]}, ${currentFiltros.precioRango[1]}]`);
          pasaFiltros = false;
        }
      }
      if (pasaFiltros && (currentFiltros.añoRango[0] > initialFilterState.añoRango[0] || currentFiltros.añoRango[1] < initialFilterState.añoRango[1])) {
        if (vehiculo.año < currentFiltros.añoRango[0] || vehiculo.año > currentFiltros.añoRango[1]) {
          // console.log(`[Filtro Año] Descartado ${vehiculo.id}: ${vehiculo.año} fuera de [${currentFiltros.añoRango[0]}, ${currentFiltros.añoRango[1]}]`);
          pasaFiltros = false;
        }
      }
      
      // Filtro Kilometraje (CORREGIDO)
      const kmRangeChanged = currentFiltros.kilometrajeRango[0] > initialFilterState.kilometrajeRango[0] || currentFiltros.kilometrajeRango[1] < initialFilterState.kilometrajeRango[1];
      
      // Aplicar filtro KM SOLO si el rango ha cambiado desde el inicial
      if (pasaFiltros && kmRangeChanged) {
        const [minKm, maxKm] = currentFiltros.kilometrajeRango;
        console.log(`[Filtro KM] Vehiculo ${vehiculo.id} (KM: ${vehiculo.km}): Verificando rango [${minKm}, ${maxKm}]. Rango cambiado: ${kmRangeChanged}`);
        
        // Si el KM del vehículo está FUERA del rango seleccionado
        if (vehiculo.km < minKm || vehiculo.km > maxKm) {
          console.log(`[Filtro KM] Descartado ${vehiculo.id}: ${vehiculo.km} fuera de rango [${minKm}, ${maxKm}].`);
          pasaFiltros = false;
        } else {
          console.log(`[Filtro KM] OK ${vehiculo.id}: ${vehiculo.km} dentro de rango [${minKm}, ${maxKm}].`);
        }
      } else if (pasaFiltros && !kmRangeChanged) {
         // console.log(`[Filtro KM] Vehiculo ${vehiculo.id}: Rango KM no cambiado, saltando filtro.`);
      }

      // 12. Filtro de Equipamiento
      if (pasaFiltros && vehiculo.equipamiento) { // Verificar si el vehículo tiene datos de equipamiento
        for (const key in currentFiltros.equipamiento) {
          // Si el filtro de equipamiento está activo (true) y el vehículo no lo tiene (false o undefined)
          if (currentFiltros.equipamiento[key as keyof typeof currentFiltros.equipamiento] && !vehiculo.equipamiento[key]) {
            // console.log(`[Filtro Equipamiento] Descartado ${vehiculo.id}: Falta ${key}`);
            pasaFiltros = false;
            break; // No necesita seguir verificando equipamiento para este vehículo
          }
        }
      } else if (pasaFiltros && Object.values(currentFiltros.equipamiento).some(v => v)) {
         // Si se busca equipamiento pero el vehículo no tiene datos de equipamiento, descartarlo
         // console.log(`[Filtro Equipamiento] Descartado ${vehiculo.id}: No tiene datos de equipamiento`);
         pasaFiltros = false;
      }

      // Si llegó hasta aquí sin ser false, el vehículo pasa todos los filtros activos
      return pasaFiltros;
    });

    console.log(`[aplicarFiltros] Finalizado. Vehículos encontrados: ${vehiculosFiltrados.length}`);
    return vehiculosFiltrados;

  }, [vehiculos]); // Depende solo de vehiculos

  // Función para ordenar vehículos (ahora recibe vehículos y orden como argumento)
  const ordenarVehiculos = useCallback((vehiculosToSort: Vehiculo[], orderBy: string): Vehiculo[] => {
    console.log('[ordenarVehiculos] Ordenando por:', orderBy);
    const ordenados = [...vehiculosToSort];
    switch (orderBy) {
      case 'precio_asc':
        return ordenados.sort((a, b) => a.precio - b.precio);
      default: // destacados
        return ordenados.sort((a, b) => {
          // ... lógica de destacados ...
          return 0; // Placeholder
        });
    }
    // return ordenados; // No es necesario si todos los casos retornan
  }, []); // Sin dependencias, es una función pura

  // ---- ESTADOS DERIVADOS Y EFECTOS ----

  // Estado para la lista final mostrada (resultado de filtrar Y ordenar)
  const [vehiculosMostrados, setVehiculosMostrados] = useState<Vehiculo[]>(() => ordenarVehiculos([...vehiculos], 'destacados'));
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
    let vehiculosProcesados: Vehiculo[];
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

  // ---- EVENTOS DE INTERACCIÓN ----
  
  // Función para manejar cambios en los filtros - CON COMPARACIÓN MÁS ROBUSTA Y useCallback
  const handleFiltersChange = useCallback((newFilterData: Partial<typeof initialFilterState>) => {
    console.log('[handleFiltersChange] Recibido:', newFilterData);
    // Log específico para kilometraje
    if (newFilterData.kilometrajeRango) {
      console.log('[handleFiltersChange] Kilometraje Rango recibido:', newFilterData.kilometrajeRango);
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
      
      // Comparar JSON para decidir si actualizar (simple pero efectivo para objetos anidados)
      if (JSON.stringify(potentialNextFiltros) !== JSON.stringify(prevFiltros)) {
        console.log('[handleFiltersChange] Filtros cambiaron semánticamente. Actualizando estado.');
        return potentialNextFiltros; // Devolver el nuevo estado
      } else {
        console.log('[handleFiltersChange] Filtros no cambiaron semánticamente. Saltando actualización.');
        return prevFiltros; // Devolver el estado anterior
      }
    });
  }, [vehiculos]); // Depende de vehiculos para la lógica de reseteo de modelo

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

  // ---- CÁLCULO DE CONTADORES PARA TABS (ANTES DEL RENDER) ----
  const tabCounts = useMemo(() => {
    console.log('[useMemo] Calculando tabCounts');
    // Crear un objeto de filtros temporales sin la condición actual
    const filtrosSinCondicion = { ...filtros, condicion: 'todo' as 'todo' }; // Forzar 'todo' para no filtrar por condición aquí
    
    // Aplicar todos los filtros EXCEPTO el de condición
    // Reutilizamos aplicarFiltros pasándole el objeto modificado
    const vehiculosPreFiltrados = aplicarFiltros(filtrosSinCondicion);
    
    const countTodo = vehiculosPreFiltrados.length;
    const countNuevo = vehiculosPreFiltrados.filter(v => v.km === 0).length;
    const countUsado = vehiculosPreFiltrados.filter(v => v.km > 0).length;
    
    console.log('[useMemo] tabCounts calculados:', { countTodo, countNuevo, countUsado });
    return { countTodo, countNuevo, countUsado };
    
  // Dependemos de 'filtros' (para recalcular si cambian otros filtros) y 'aplicarFiltros' (que depende de 'vehiculos')
  }, [filtros, aplicarFiltros]); 

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
          <Car className="h-16 w-16 text-gray-400 mb-4" />
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
    // Fallback si no está cargando y no hay vehículos (puede ser el estado inicial antes de que vehiculos cargue, o un error)
    console.log('[RENDER] DEBUG: Mostrando mensaje de carga/inicial/vacío (fallback)');
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
         <Car className="h-16 w-16 text-gray-400 mb-4" />
         <h3 className="text-lg font-medium">
           {vehiculos.length === 0 ? "Cargando vehículos..." : "No hay vehículos disponibles"}
         </h3>
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


