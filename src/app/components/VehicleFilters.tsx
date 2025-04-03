'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RangeSlider } from "@/app/components/RangeSlider";
import { Search, ChevronDown, ChevronUp, Filter, Check, SlidersHorizontal, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { motion } from 'framer-motion';
import { TabsTrigger, TabsList, Tabs } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { carBrands } from '@/lib/car-brands';
import CarTypes from '@/app/components/CarTypes';

// Definir el tipo de los filtros
type VehicleFilters = {
  searchTerm: string;
  marca: string;
  modelo: string;
  tipoVehiculo: string;
  combustible: string;
  transmision: string;
  color: string;
  condicion: string;
  precioMin: number;
  precioMax: number;
  añoMin: number;
  añoMax: number;
  kmMin: number;
  kmMax: number;
  financiacion: boolean;
  permuta: boolean;
  equipamiento: string[];
};

interface VehicleFiltersProps {
  onFiltersChange?: (filters: VehicleFilters) => void;
  initialFilters?: VehicleFilters;
  marcasDisponibles?: string[];
  modelosDisponibles?: string[];
  tabCounts: {
    countTodo: number;
    countNuevo: number;
    countUsado: number;
  };
}

const TIPOS_VEHICULO = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'coupe', label: 'Coupe' }
];

const TIPOS_COMBUSTIBLE = [
  { value: 'NAFTA', label: 'Nafta' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HÍBRIDO', label: 'Híbrido' },
  { value: 'ELÉCTRICO', label: 'Eléctrico' },
  { value: 'GNC', label: 'GNC' }
];

const TIPOS_TRANSMISION = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'AUTOMÁTICA', label: 'Automática' }
];

const COLORES = [
  { value: 'blanco', label: 'Blanco' },
  { value: 'negro', label: 'Negro' },
  { value: 'gris', label: 'Gris' },
  { value: 'rojo', label: 'Rojo' },
  { value: 'azul', label: 'Azul' },
  { value: 'verde', label: 'Verde' },
  { value: 'amarillo', label: 'Amarillo' },
  { value: 'naranja', label: 'Naranja' },
  { value: 'marron', label: 'Marrón' },
  { value: 'beige', label: 'Beige' },
  { value: 'dorado', label: 'Dorado' },
  { value: 'plateado', label: 'Plateado' },
  { value: 'violeta', label: 'Violeta' },
  { value: 'bordo', label: 'Bordo' },
  { value: 'otro', label: 'Otro' }
]

const CONDICIONES = [
  { value: 'NUEVO', label: 'Nuevo' },
  { value: 'USADO', label: 'Usado' }
];

const EQUIPAMIENTO = [
  { value: 'aireAcondicionado', label: 'Aire acondicionado' },
  { value: 'direccionAsistida', label: 'Dirección asistida' },
  { value: 'vidriosElectricos', label: 'Vidrios eléctricos' },
  { value: 'tapiceriaCuero', label: 'Tapicería de cuero' },
  { value: 'cierreCentralizado', label: 'Cierre centralizado' },
  { value: 'alarma', label: 'Alarma' },
  { value: 'airbags', label: 'Airbags' },
  { value: 'bluetooth', label: 'Bluetooth' },
  { value: 'controlCrucero', label: 'Control crucero' },
  { value: 'techoSolar', label: 'Techo solar' },
  { value: 'llantasAleacion', label: 'Llantas de aleación' },
  { value: 'traccion4x4', label: 'Tracción 4x4' },
  { value: 'abs', label: 'ABS' },
  { value: 'esp', label: 'ESP' },
  { value: 'asistenteFrenado', label: 'Asistente de frenado' },
  { value: 'camaraReversa', label: 'Cámara de reversa' },
  { value: 'sensorEstacionamiento', label: 'Sensores de estacionamiento' },
  { value: 'navegacionGPS', label: 'Navegación GPS' },
  { value: 'controlVoz', label: 'Control por voz' },
  { value: 'asientosElectricos', label: 'Asientos eléctricos' },
  { value: 'asientosCalefaccionados', label: 'Asientos calefaccionados' },
  { value: 'volanteCuero', label: 'Volante de cuero' },
  { value: 'climatizador', label: 'Climatizador' }
];

export default function VehicleFilters({
  onFiltersChange,
  initialFilters,
  marcasDisponibles = [],
  modelosDisponibles = [],
  tabCounts
}: VehicleFiltersProps) {
  // Estados internos UI
  const [isOpen, setIsOpen] = useState(false);
  const [isCompactModeOpen, setIsCompactModeOpen] = useState(false);
  const [showEquipamientoModal, setShowEquipamientoModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Estado para controlar la primera renderización
  const firstRenderRef = useRef(true);
  
  // Estado para la pestaña seleccionada
  const [selectedTab, setSelectedTab] = useState('todo');
  
  // Importante: No mantenemos un estado local de los filtros
  // Simplemente usamos lo que recibimos del componente padre
  const filters = {
    searchTerm: initialFilters?.searchTerm || '',
    marca: initialFilters?.marca || '',
    modelo: initialFilters?.modelo || '',
    tipoVehiculo: initialFilters?.tipoVehiculo || '',
    combustible: initialFilters?.combustible || '',
    transmision: initialFilters?.transmision || '',
    color: initialFilters?.color || '',
    condicion: initialFilters?.condicion || '',
    precioMin: initialFilters?.precioMin || 0,
    precioMax: initialFilters?.precioMax || 100000000,
    añoMin: initialFilters?.añoMin || 1990,
    añoMax: initialFilters?.añoMax || 2025,
    kmMin: initialFilters?.kmMin || 0,
    kmMax: initialFilters?.kmMax || 500000,
    financiacion: initialFilters?.financiacion || false,
    permuta: initialFilters?.permuta || false,
    equipamiento: Array.isArray(initialFilters?.equipamiento) ? initialFilters.equipamiento : []
  };

  // Función para verificar si un item está en el equipamiento
  const isEquipamientoSelected = (value: string): boolean => {
    if (!filters.equipamiento) return false;
    if (Array.isArray(filters.equipamiento)) {
      return filters.equipamiento.includes(value);
    }
    // Si es un objeto (para mantener compatibilidad con estados anteriores)
    if (typeof filters.equipamiento === 'object') {
      return Boolean((filters.equipamiento as any)[value]);
    }
    return false;
  };

  // Función para formatear números con seguridad
  const formatNumber = (value: number | undefined, defaultValue: number = 0) => {
    return (value ?? defaultValue).toLocaleString();
  };

  // Función específica para formatear años sin puntos
  const formatYear = (value: number | undefined, defaultValue: number = 1990) => {
    return (value ?? defaultValue).toString();
  };

  // Efecto para actualizar la pestaña seleccionada basada en initialFilters
  useEffect(() => {
    if (initialFilters) {
      console.log('[VehicleFilters] initialFilters.condicion cambió a:', initialFilters.condicion);
      if (initialFilters.condicion === 'NUEVO' || initialFilters.condicion === 'nuevo') {
        setSelectedTab('nuevo');
      } else if (initialFilters.condicion === 'USADO' || initialFilters.condicion === 'usado') {
        setSelectedTab('usado');
      } else {
        setSelectedTab('todo');
      }
    }
  }, [initialFilters?.condicion]);

  // Manejador para cambios en un filtro individual
  const handleFilterChange = (key: string, value: any) => {
    if (!onFiltersChange) return;
    
    // Crear una copia del objeto de filtros actual
    const newFilters = { ...filters };
    
    // Actualizar el valor correspondiente
    (newFilters as any)[key] = value;
    
    // Si se cambia la marca, resetear el modelo
    if (key === 'marca' && newFilters.modelo) {
      newFilters.modelo = '';
    }
    
    // Notificar al componente padre
    onFiltersChange(newFilters);
  };

  // Manejador para cambios de pestaña (todo/nuevo/usado)
  const handleTabChange = (value: string) => {
    console.log('[VehicleFilters] handleTabChange llamado con:', value, 'selectedTab actual:', selectedTab);
    if (value === selectedTab) return; // No hacer nada si el tab es el mismo
    
    // Actualizar el estado de la pestaña inmediatamente
    setSelectedTab(value);
    
    if (!onFiltersChange) return;
    
    // Mapear el valor de la pestaña a la condición correspondiente
    let condicion = 'todo'; // Por defecto, usar 'todo'
    if (value === 'nuevo') condicion = 'NUEVO';
    if (value === 'usado') condicion = 'USADO';
    
    console.log('[VehicleFilters] Enviando cambio de condición:', condicion);
    
    // Notificar el cambio al componente padre
    onFiltersChange({ ...filters, condicion });
    
    // Forzar la actualización de UI para reflejar el cambio inmediatamente
    setTimeout(() => {
      console.log('[VehicleFilters] Después del cambio, selectedTab es:', value);
    }, 0);
  };

  // Función para resetear los filtros
  const resetFilters = () => {
    if (!onFiltersChange) return;
    
    // Mantener solo la condición actual basada en la pestaña seleccionada
    const condicion = selectedTab === 'nuevo' ? 'nuevo' : selectedTab === 'usado' ? 'usado' : '';
    
    // Crear un objeto de filtros reseteado
    const newFilters = {
      searchTerm: '',
      marca: '',
      modelo: '',
      tipoVehiculo: '',
      combustible: '',
      transmision: '',
      color: '',
      condicion,
      precioMin: 0,
      precioMax: 100000000,
      añoMin: 1990,
      añoMax: 2025,
      kmMin: 0,
      kmMax: 500000,
      financiacion: false,
      permuta: false,
      equipamiento: [] // Aseguramos que siempre sea un array
    };
    
    // Notificar al componente padre
    onFiltersChange(newFilters);
    
    // Cerrar el modal si está abierto
    setIsOpen(false);
  };

  // Número de filtros activos
  const activeFiltersCount = (() => {
    let count = 0;
    if (filters.marca) count++;
    if (filters.modelo) count++;
    if (filters.tipoVehiculo) count++;
    if (filters.combustible) count++;
    if (filters.transmision) count++;
    if (filters.financiacion) count++;
    if (filters.permuta) count++;
    if (filters.color) count++;
    
    // Contar equipamiento activo (aseguramos que sea un array)
    if (Array.isArray(filters.equipamiento)) {
      filters.equipamiento.forEach(() => count++);
    }
    
    if (filters.precioMin > 0 || filters.precioMax < 100000000) count++;
    if (filters.añoMin > 1990 || filters.añoMax < 2025) count++;
    if (filters.kmMin > 0 || filters.kmMax < 500000) count++;
    return count;
  })();

  // Aplicar filtros (cerrando el diálogo)
  const applyFilters = () => {
    setIsOpen(false);
  };

  // Handlers para los filtros
  const handleSearchTermChange = (value: string) => {
    // ... existing code ...
  };
  
  // Handler para el equipamiento
  const handleEquipamientoChange = (value: string) => {
    console.log(`[VehicleFilters] Equipamiento change: ${value}`);
    
    const currentEquipamiento = Array.isArray(filters.equipamiento) ? [...filters.equipamiento] : [];
    
    // Alternar la selección
    const newEquipamiento = currentEquipamiento.includes(value)
      ? currentEquipamiento.filter(item => item !== value)
      : [...currentEquipamiento, value];
    
    console.log(`[VehicleFilters] New equipamiento:`, newEquipamiento);
    
    // Informar al componente padre
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        equipamiento: newEquipamiento
      });
    }
  };
  
  // Handler para el slider de precio
  const handlePriceChange = (values: number[]) => {
    console.log(`[VehicleFilters] Dragging price slider: ${values[0]} - ${values[1]}`);
  };
  
  // Handler para el commit del slider de precio (cuando se suelta)
  const handlePriceCommit = (values: number[]) => {
    console.log(`[VehicleFilters] Price slider committed: ${values[0]} - ${values[1]}`);
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        precioMin: values[0],
        precioMax: values[1]
      });
    }
  };
  
  // Handler para el slider de año
  const handleYearChange = (values: number[]) => {
    console.log(`[VehicleFilters] Dragging year slider: ${values[0]} - ${values[1]}`);
  };
  
  // Handler para el commit del slider de año (cuando se suelta)
  const handleYearCommit = (values: number[]) => {
    console.log(`[VehicleFilters] Year slider committed: ${values[0]} - ${values[1]}`);
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        añoMin: values[0],
        añoMax: values[1]
      });
    }
  };
  
  // Handler para el slider de kilometraje
  const handleKmChange = (values: number[]) => {
    console.log(`[VehicleFilters] Dragging km slider: ${values[0]} - ${values[1]}`);
  };
  
  // Handler para el commit del slider de kilometraje (cuando se suelta)
  const handleKmCommit = (values: number[]) => {
    console.log(`[VehicleFilters] Km slider committed: ${values[0]} - ${values[1]}`);
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        kmMin: values[0],
        kmMax: values[1]
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Pestañas de filtro Todo/Nuevo/Usado */}
      <div className="w-full max-w-7xl mx-auto bg-gray-100 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('todo')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              selectedTab === 'todo'
                ? 'text-black border-b-2 border-[var(--color-gold)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Todo ({tabCounts.countTodo})
          </button>
          <button
            onClick={() => handleTabChange('nuevo')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              selectedTab === 'nuevo'
                ? 'text-black border-b-2 border-[var(--color-gold)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nuevo ({tabCounts.countNuevo})
          </button>
          <button
            onClick={() => handleTabChange('usado')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              selectedTab === 'usado'
                ? 'text-black border-b-2 border-[var(--color-gold)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Usado ({tabCounts.countUsado})
          </button>
        </div>
      </div>

      {/* Versión móvil con filtros en Sheet */}
      <div className="lg:hidden">
        <div className="flex gap-2 w-full">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
            <Button 
              variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-white border-gray-200 shadow-sm h-11 text-gray-700"
              >
                <SlidersHorizontal size={16} />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
            </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-xl pt-4 px-4">
              <SheetHeader className="text-left mb-2">
                <SheetTitle>FILTROS DE BÚSQUEDA</SheetTitle>
                <SheetDescription>
                  Selecciona los filtros para encontrar tu vehículo ideal
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 max-h-[calc(80vh-110px)] overflow-y-auto pb-16">
                {/* Marca y Modelo */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">CARACTERÍSTICAS</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Select 
                      value={filters.marca}
                      onValueChange={(value) => handleFilterChange('marca', value)}
                    >
                      <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                        <SelectValue placeholder="Marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {carBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={filters.modelo}
                      onValueChange={(value) => handleFilterChange('modelo', value)}
                      disabled={!filters.marca}
                    >
                      <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                        <SelectValue placeholder="Modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelosDisponibles.map(modelo => (
                          <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Tipo y Combustible */}
                <div className="grid grid-cols-2 gap-3">
                  <Select 
                    value={filters.tipoVehiculo}
                    onValueChange={(value) => handleFilterChange('tipoVehiculo', value)}
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_VEHICULO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filters.combustible}
                    onValueChange={(value) => handleFilterChange('combustible', value)}
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Combustible" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_COMBUSTIBLE.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.transmision}
                    onValueChange={(value) => handleFilterChange('transmision', value)}
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Transmisión" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_TRANSMISION.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showEquipamientoModal} onOpenChange={setShowEquipamientoModal}>
                    <DialogTrigger asChild>
            <Button 
              variant="outline"
                        className="w-full h-10 border border-gray-200 rounded-lg bg-white text-gray-700 relative"
                      >
                        Equipamiento
                        {filters.equipamiento.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {filters.equipamiento.length}
                          </span>
                        )}
            </Button>
                    </DialogTrigger>
                  </Dialog>
          </div>

                {/* Precio */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Precio</Label>
                  <div className="py-2">
                    <RangeSlider
                      key="precio-slider"
                      value={[filters.precioMin || 0, filters.precioMax || 100000000]}
                      min={0}
                      max={100000000}
                      step={500000}
                      onValueChange={handlePriceChange}
                      onValueCommit={handlePriceCommit}
                      aria-label="Rango de precios"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${formatNumber(filters.precioMin)}</span>
                    <span>${formatNumber(filters.precioMax)}</span>
                  </div>
          </div>

                {/* Año */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Año</Label>
                  <div className="py-2">
                    <RangeSlider
                      key="año-slider"
                      value={[filters.añoMin || 1990, filters.añoMax || 2025]}
                      min={1990}
                      max={2025}
                      step={1}
                      onValueChange={handleYearChange}
                      onValueCommit={handleYearCommit}
                      aria-label="Rango de años"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatYear(filters.añoMin, 1990)}</span>
                    <span>{formatYear(filters.añoMax, 2025)}</span>
                  </div>
                </div>

                {/* Kilometraje */}
                {filters.condicion !== 'NUEVO' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Kilometraje</Label>
                    <div className="py-2">
                      <RangeSlider
                        key="km-slider"
                        value={[filters.kmMin || 0, filters.kmMax || 500000]}
                        min={0}
                        max={500000}
                        step={5000}
                        onValueChange={handleKmChange}
                        onValueCommit={handleKmCommit}
                        aria-label="Rango de kilometraje"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatNumber(filters.kmMin)} km</span>
                      <span>{formatNumber(filters.kmMax)} km</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="fixed bottom-0 left-0 right-0 bg-white py-4 px-4 border-t border-gray-200 flex flex-row space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={resetFilters}
                >
                  Limpiar
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1 bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90">
                    Ver resultados 
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-black text-[var(--color-gold)] text-xs font-medium inline-flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          
              <Select 
                value={filters.marca}
                onValueChange={(value) => handleFilterChange('marca', value)}
              >
            <SelectTrigger className="h-11 border border-gray-200 rounded-lg bg-white text-gray-700 flex-grow">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
              {carBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </div>
            </div>

      {/* Versión escritorio */}
      <Card className="hidden lg:block w-full max-w-7xl mx-auto bg-card/90 rounded-xl shadow-xl overflow-hidden">
        <CardContent className="p-4 md:p-6">
          {/* Versión compacta para móviles */}
          <div className="lg:hidden">
            <div className="flex flex-wrap gap-3">
              {/* Primera fila de filtros en móvil */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <div>
                  <Select 
                    value={filters.marca}
                    onValueChange={(value) => handleFilterChange('marca', value)}
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {carBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
              <Select 
                value={filters.modelo}
                onValueChange={(value) => handleFilterChange('modelo', value)}
                disabled={!filters.marca}
              >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                  <SelectValue placeholder="Modelo" />
                </SelectTrigger>
                <SelectContent>
                  {modelosDisponibles.map(modelo => (
                    <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
                </div>
              </div>

              {/* Segunda fila de filtros en móvil */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <div>
              <Select 
                value={filters.tipoVehiculo}
                onValueChange={(value) => handleFilterChange('tipoVehiculo', value)}
              >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_VEHICULO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filters.combustible}
                    onValueChange={(value) => handleFilterChange('combustible', value)}
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Combustible" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_COMBUSTIBLE.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

              {/* Tercera fila de filtros en móvil */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <div>
                  <Select 
                    value={filters.transmision}
                    onValueChange={(value) => handleFilterChange('transmision', value)}
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Transmisión" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_TRANSMISION.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Dialog open={showEquipamientoModal} onOpenChange={setShowEquipamientoModal}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full h-10 border border-gray-200 rounded-lg bg-white text-gray-700 relative"
                      >
                        Equipamiento
                        {filters.equipamiento.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {filters.equipamiento.length}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Rangos en móvil */}
            <div className="mt-4 space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-600">Rango de precios</Label>
                <div className="py-2">
                <RangeSlider
                    value={[filters.precioMin || 0, filters.precioMax || 100000000]}
                    min={0}
                    max={100000000}
                    step={500000}
                    defaultValue={[0, 100000000]}
                    onValueChange={handlePriceChange}
                    onValueCommit={handlePriceCommit}
                    aria-label="Rango de precios"
                  />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                  <span>${formatNumber(filters.precioMin)}</span>
                  <span>${formatNumber(filters.precioMax)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-600">Año</Label>
                <div className="py-2">
                <RangeSlider
                    value={[filters.añoMin || 1990, filters.añoMax || 2025]}
                    min={1990}
                    max={2025}
                    step={1}
                    defaultValue={[1990, 2025]}
                    onValueChange={handleYearChange}
                    onValueCommit={handleYearCommit}
                    aria-label="Rango de años"
                  />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatYear(filters.añoMin, 1990)}</span>
                  <span>{formatYear(filters.añoMax, 2025)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-600">Kilometraje</Label>
                <div className="py-2">
                <RangeSlider
                    value={[filters.kmMin || 0, filters.kmMax || 500000]}
                    min={0}
                    max={500000}
                    step={5000}
                    defaultValue={[0, 500000]}
                    onValueChange={handleKmChange}
                    onValueCommit={handleKmCommit}
                    aria-label="Rango de kilometraje"
                  />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatNumber(filters.kmMin)} km</span>
                  <span>{formatNumber(filters.kmMax)} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Versión escritorio - compacta y optimizada */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 gap-4">
              {/* Primera fila de selectores */}
              <div className="grid grid-cols-6 gap-3">
                <div>
                  <Select 
                    value={filters.marca}
                    onValueChange={(value) => handleFilterChange('marca', value)}
                  >
                    <SelectTrigger className="h-11 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {carBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>

                <div>
                  <Select 
                    value={filters.modelo}
                    onValueChange={(value) => handleFilterChange('modelo', value)}
                    disabled={!filters.marca}
                  >
                    <SelectTrigger className="h-11 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelosDisponibles.map(modelo => (
                        <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
          </div>

                <div>
                  <Select 
                    value={filters.tipoVehiculo}
                    onValueChange={(value) => handleFilterChange('tipoVehiculo', value)}
                  >
                    <SelectTrigger className="h-11 border border-gray-200 rounded-lg bg-white text-gray-700">
                      <SelectValue placeholder="Tipo de vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_VEHICULO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                <Select 
                  value={filters.combustible}
                  onValueChange={(value) => handleFilterChange('combustible', value)}
                >
                    <SelectTrigger className="h-11 border border-gray-200 rounded-lg bg-white text-gray-700">
                    <SelectValue placeholder="Combustible" />
                  </SelectTrigger>
                  <SelectContent>
                      {TIPOS_COMBUSTIBLE.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                </div>

                <div>
                <Select 
                  value={filters.transmision}
                  onValueChange={(value) => handleFilterChange('transmision', value)}
                >
                    <SelectTrigger className="h-11 border border-gray-200 rounded-lg bg-white text-gray-700">
                    <SelectValue placeholder="Transmisión" />
                  </SelectTrigger>
                  <SelectContent>
                      {TIPOS_TRANSMISION.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                </div>
                
                <div>
                  <Dialog open={showEquipamientoModal} onOpenChange={setShowEquipamientoModal}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="h-11 w-full border border-gray-200 rounded-lg bg-white text-gray-700 relative"
                      >
                        Equipamiento
                        {filters.equipamiento.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {filters.equipamiento.length}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
              
              {/* Segunda fila con sliders */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Precio</Label>
                  <div className="py-2">
                    <RangeSlider
                      key="precio-slider"
                      value={[filters.precioMin || 0, filters.precioMax || 100000000]}
                      min={0}
                      max={100000000}
                      step={500000}
                      onValueChange={handlePriceChange}
                      onValueCommit={handlePriceCommit}
                      aria-label="Rango de precios"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${formatNumber(filters.precioMin)}</span>
                    <span>${formatNumber(filters.precioMax)}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Año</Label>
                  <div className="py-2">
                    <RangeSlider
                      key="año-slider"
                      value={[filters.añoMin || 1990, filters.añoMax || 2025]}
                      min={1990}
                      max={2025}
                      step={1}
                      onValueChange={handleYearChange}
                      onValueCommit={handleYearCommit}
                      aria-label="Rango de años"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatYear(filters.añoMin, 1990)}</span>
                    <span>{formatYear(filters.añoMax, 2025)}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Kilometraje</Label>
                  <div className="py-2">
                    <RangeSlider
                      key="km-slider"
                      value={[filters.kmMin || 0, filters.kmMax || 500000]}
                      min={0}
                      max={500000}
                      step={5000}
                      onValueChange={handleKmChange}
                      onValueCommit={handleKmCommit}
                      aria-label="Rango de kilometraje"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatNumber(filters.kmMin)} km</span>
                    <span>{formatNumber(filters.kmMax)} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal de equipamiento */}
          <Dialog open={showEquipamientoModal} onOpenChange={setShowEquipamientoModal}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold mb-1">Equipamiento</DialogTitle>
                <DialogDescription>
                  Selecciona las características del vehículo que estás buscando
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EQUIPAMIENTO.map((item) => {
                    const isSelected = isEquipamientoSelected(item.value);
                    console.log(`[VehicleFilters] Equipamiento ${item.value}: ${isSelected ? 'seleccionado' : 'no seleccionado'}`);
                    return (
                      <div key={item.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={item.value}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            console.log(`[VehicleFilters] Checkbox ${item.value} cambiado a: ${checked}`);
                            handleEquipamientoChange(item.value);
                          }}
                        />
                        <label 
                          htmlFor={item.value} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="mt-4">
                <div className="flex gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" className="flex-1 bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90">
                      Aplicar filtros 
                      <span className="ml-1 h-5 w-5 rounded-full bg-black text-[var(--color-gold)] text-xs font-medium inline-flex items-center justify-center">
                        {filters.equipamiento.length}
                      </span>
                    </Button>
                  </DialogClose>
                  </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </CardContent>
    </Card>
    </div>
  );
} 