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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

// Definir el tipo de los filtros
type VehicleFilters = {
  busqueda: string;
  marca: string;
  modelo: string;
  precioRango: [number, number];
  añoRango: [number, number];
  kilometrajeRango: [number, number];
  combustible: string;
  transmision: string;
  financiacion: boolean;
  permuta: boolean;
  color: string;
  tipoVehiculo: string;
  condicion: string; // Todo, nuevo, usado
  equipamiento: {
    aireAcondicionado: boolean;
    direccionAsistida: boolean;
    vidriosElectricos: boolean;
    tapiceriaCuero: boolean;
    cierreCentralizado: boolean;
    alarma: boolean;
    airbags: boolean;
    bluetooth: boolean;
    controlCrucero: boolean;
    techoSolar: boolean;
    llantasAleacion: boolean;
    traccion4x4: boolean;
    abs: boolean;
    esp: boolean;
    asistenteFrenado: boolean;
    camaraReversa: boolean;
    sensorEstacionamiento: boolean;
    navegacionGPS: boolean;
    controlVoz: boolean;
    asientosElectricos: boolean;
    asientosCalefaccionados: boolean;
    volanteCuero: boolean;
    climatizador: boolean;
  };
};

interface VehicleFiltersProps {
  onFiltersChange?: (filters: VehicleFilters) => void;
  initialFilters?: VehicleFilters;
  marcasDisponibles?: string[];
  modelosDisponibles?: string[];
}

export default function VehicleFilters({
  onFiltersChange,
  initialFilters,
  marcasDisponibles = [],
  modelosDisponibles = []
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
  const filters = initialFilters || {
    busqueda: '',
    marca: '',
    modelo: '',
    precioRango: [0, 100000000],
    añoRango: [1990, 2025],
    kilometrajeRango: [0, 300000],
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

  // Efecto para actualizar la pestaña seleccionada basada en initialFilters
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.condicion === '0km') {
        setSelectedTab('nuevo');
      } else if (initialFilters.condicion === 'usado') {
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

  // Manejador para cambios en el equipamiento
  const handleEquipamientoChange = (equipName: string, checked: boolean) => {
    if (!onFiltersChange) return;
    
    // Crear una copia de los filtros actuales
    const newEquipamiento = { ...filters.equipamiento, [equipName]: checked };
    const newFilters = { ...filters, equipamiento: newEquipamiento };
    
    // Notificar al componente padre
    onFiltersChange(newFilters);
  };

  // Manejador para cambios de pestaña (todo/nuevo/usado)
  const handleTabChange = (value: string) => {
    if (value === selectedTab) return; // No hacer nada si el tab es el mismo
    
    // Actualizar el estado de la pestaña
    setSelectedTab(value);
    
    if (!onFiltersChange) return;
    
    // Mapear el valor de la pestaña a la condición correspondiente
    let condicion = 'todo';
    if (value === 'nuevo') condicion = '0km';
    if (value === 'usado') condicion = 'usado';
    
    // Notificar el cambio al componente padre
    onFiltersChange({ ...filters, condicion });
  };

  // Función para resetear los filtros
  const resetFilters = () => {
    if (!onFiltersChange) return;
    
    // Mantener solo la condición actual basada en la pestaña seleccionada
    const condicion = selectedTab === 'nuevo' ? '0km' : selectedTab === 'usado' ? 'usado' : 'todo';
    
    // Crear un objeto de filtros reseteado
    const newFilters = {
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
      condicion,
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
    
    // Contar equipamiento activo
    Object.values(filters.equipamiento).forEach(value => {
      if (value) count++;
    });
    
    if (filters.precioRango[0] > 0 || filters.precioRango[1] < 100000000) count++;
    if (filters.añoRango[0] > 1990 || filters.añoRango[1] < 2025) count++;
    if (filters.kilometrajeRango[0] > 0 || filters.kilometrajeRango[1] < 300000) count++;
    return count;
  })();

  // Aplicar filtros (cerrando el diálogo)
  const applyFilters = () => {
    setIsOpen(false);
  };

  // El resto del componente se mantiene igual...
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
            Todo ({29})
          </button>
          <button
            onClick={() => handleTabChange('nuevo')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              selectedTab === 'nuevo'
                ? 'text-black border-b-2 border-[var(--color-gold)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nuevo ({9})
          </button>
          <button
            onClick={() => handleTabChange('usado')}
            className={`flex-1 py-3 text-center font-medium text-sm ${
              selectedTab === 'usado'
                ? 'text-black border-b-2 border-[var(--color-gold)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Usado ({20})
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
                        {marcasDisponibles.map(marca => (
                          <SelectItem key={marca} value={marca}>{marca}</SelectItem>
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
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="camioneta">Camioneta</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
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
                      <SelectItem value="nafta">Nafta</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gnc">GNC</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
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
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatica">Automática</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showEquipamientoModal} onOpenChange={setShowEquipamientoModal}>
                    <DialogTrigger asChild>
            <Button 
              variant="outline"
                        className="w-full h-10 border border-gray-200 rounded-lg bg-white text-gray-700 relative"
                      >
                        Equipamiento
                        {Object.values(filters.equipamiento).filter(Boolean).length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {Object.values(filters.equipamiento).filter(Boolean).length}
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
                      value={filters.precioRango}
                      min={0}
                      max={100000000}
                      step={500000}
                      defaultValue={[0, 100000000]}
                      onValueChange={(value) => handleFilterChange('precioRango', value)}
                      aria-label="Rango de precios"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${filters.precioRango[0].toLocaleString()}</span>
                    <span>${filters.precioRango[1].toLocaleString()}</span>
                  </div>
          </div>

                {/* Año */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Año</Label>
                  <div className="py-2">
                    <RangeSlider
                      value={filters.añoRango}
                      min={1990}
                      max={2025}
                      step={1}
                      defaultValue={[1990, 2025]}
                      onValueChange={(value) => handleFilterChange('añoRango', value)}
                      aria-label="Rango de años"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.añoRango[0]}</span>
                    <span>{filters.añoRango[1]}</span>
                  </div>
                </div>

                {/* Kilometraje */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Kilometraje</Label>
                  <div className="py-2">
                    <RangeSlider
                      value={filters.kilometrajeRango}
                      min={0}
                      max={300000}
                      step={5000}
                      defaultValue={[0, 300000]}
                      onValueChange={(value) => handleFilterChange('kilometrajeRango', value)}
                      aria-label="Rango de kilometraje"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.kilometrajeRango[0].toLocaleString()} km</span>
                    <span>{filters.kilometrajeRango[1].toLocaleString()} km</span>
                  </div>
                </div>
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
                  {marcasDisponibles.map(marca => (
                    <SelectItem key={marca} value={marca}>{marca}</SelectItem>
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
                      {marcasDisponibles.map(marca => (
                        <SelectItem key={marca} value={marca}>{marca}</SelectItem>
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
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="camioneta">Camioneta</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
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
                      <SelectItem value="nafta">Nafta</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gnc">GNC</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
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
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatica">Automática</SelectItem>
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
                        {Object.values(filters.equipamiento).filter(Boolean).length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {Object.values(filters.equipamiento).filter(Boolean).length}
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
                  value={filters.precioRango}
                  min={0}
                  max={100000000}
                  step={500000}
                  defaultValue={[0, 100000000]}
                  onValueChange={(value) => handleFilterChange('precioRango', value)}
                  aria-label="Rango de precios"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>${filters.precioRango[0].toLocaleString()}</span>
                <span>${filters.precioRango[1].toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-600">Año</Label>
                <div className="py-2">
                <RangeSlider
                  value={filters.añoRango}
                  min={1990}
                  max={2025}
                  step={1}
                  defaultValue={[1990, 2025]}
                  onValueChange={(value) => handleFilterChange('añoRango', value)}
                  aria-label="Rango de años"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{filters.añoRango[0]}</span>
                <span>{filters.añoRango[1]}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-600">Kilometraje</Label>
                <div className="py-2">
                <RangeSlider
                  value={filters.kilometrajeRango}
                  min={0}
                  max={300000}
                  step={5000}
                  defaultValue={[0, 300000]}
                  onValueChange={(value) => handleFilterChange('kilometrajeRango', value)}
                  aria-label="Rango de kilometraje"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{filters.kilometrajeRango[0].toLocaleString()} km</span>
                <span>{filters.kilometrajeRango[1].toLocaleString()} km</span>
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
                      {marcasDisponibles.map(marca => (
                        <SelectItem key={marca} value={marca}>{marca}</SelectItem>
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
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="camioneta">Camioneta</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
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
                    <SelectItem value="nafta">Nafta</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="gnc">GNC</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
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
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatica">Automática</SelectItem>
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
                        {Object.values(filters.equipamiento).filter(Boolean).length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {Object.values(filters.equipamiento).filter(Boolean).length}
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
                      value={filters.precioRango}
                      min={0}
                      max={100000000}
                      step={500000}
                      defaultValue={[0, 100000000]}
                      onValueChange={(value) => handleFilterChange('precioRango', value)}
                      aria-label="Rango de precios"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${filters.precioRango[0].toLocaleString()}</span>
                    <span>${filters.precioRango[1].toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Año</Label>
                  <div className="py-2">
                    <RangeSlider
                      value={filters.añoRango}
                      min={1990}
                      max={2025}
                      step={1}
                      defaultValue={[1990, 2025]}
                      onValueChange={(value) => handleFilterChange('añoRango', value)}
                      aria-label="Rango de años"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.añoRango[0]}</span>
                    <span>{filters.añoRango[1]}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Kilometraje</Label>
                  <div className="py-2">
                    <RangeSlider
                      value={filters.kilometrajeRango}
                      min={0}
                      max={300000}
                      step={5000}
                      defaultValue={[0, 300000]}
                      onValueChange={(value) => handleFilterChange('kilometrajeRango', value)}
                      aria-label="Rango de kilometraje"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.kilometrajeRango[0].toLocaleString()} km</span>
                    <span>{filters.kilometrajeRango[1].toLocaleString()} km</span>
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
                  {/* Confort */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Confort</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="aire-acondicionado"
                        checked={filters.equipamiento.aireAcondicionado}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('aireAcondicionado', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="aire-acondicionado" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aire acondicionado
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="climatizador"
                        checked={filters.equipamiento.climatizador}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('climatizador', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="climatizador" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Climatizador
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="asientos-electricos"
                        checked={filters.equipamiento.asientosElectricos}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('asientosElectricos', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="asientos-electricos" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Asientos eléctricos
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="asientos-calefaccionados"
                        checked={filters.equipamiento.asientosCalefaccionados}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('asientosCalefaccionados', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="asientos-calefaccionados" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Asientos calefaccionados
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tapiceria-cuero"
                        checked={filters.equipamiento.tapiceriaCuero}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('tapiceriaCuero', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="tapiceria-cuero" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tapicería de cuero
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="volante-cuero"
                        checked={filters.equipamiento.volanteCuero}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('volanteCuero', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="volante-cuero" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Volante de cuero
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="techo-solar"
                        checked={filters.equipamiento.techoSolar}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('techoSolar', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="techo-solar" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Techo solar
                      </label>
                    </div>
                  </div>
                  
                  {/* Seguridad */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Seguridad</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="abs"
                        checked={filters.equipamiento.abs}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('abs', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="abs" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        ABS
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="airbags"
                        checked={filters.equipamiento.airbags}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('airbags', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="airbags" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Airbags
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="esp"
                        checked={filters.equipamiento.esp}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('esp', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="esp" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Control de estabilidad (ESP)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="asistente-frenado"
                        checked={filters.equipamiento.asistenteFrenado}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('asistenteFrenado', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="asistente-frenado" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Asistente de frenado
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="alarma"
                        checked={filters.equipamiento.alarma}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('alarma', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="alarma" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Alarma
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cierre-centralizado"
                        checked={filters.equipamiento.cierreCentralizado}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('cierreCentralizado', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="cierre-centralizado" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Cierre centralizado
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Segunda fila de categorías */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {/* Tecnología */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Tecnología</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bluetooth"
                        checked={filters.equipamiento.bluetooth}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('bluetooth', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="bluetooth" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Bluetooth
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gps"
                        checked={filters.equipamiento.navegacionGPS}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('navegacionGPS', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="gps" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Navegación GPS
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="camara-reversa"
                        checked={filters.equipamiento.camaraReversa}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('camaraReversa', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="camara-reversa" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Cámara de reversa
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sensor-estacionamiento"
                        checked={filters.equipamiento.sensorEstacionamiento}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('sensorEstacionamiento', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="sensor-estacionamiento" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sensores de estacionamiento
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="control-voz"
                        checked={filters.equipamiento.controlVoz}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('controlVoz', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="control-voz" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Control por voz
                      </label>
                    </div>
                  </div>
                  
                  {/* Extras y funcionales */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-800">Extras y funcionales</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="direccion-asistida"
                        checked={filters.equipamiento.direccionAsistida}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('direccionAsistida', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="direccion-asistida" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Dirección asistida
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="vidrios-electricos"
                        checked={filters.equipamiento.vidriosElectricos}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('vidriosElectricos', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="vidrios-electricos" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Vidrios eléctricos
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="control-crucero"
                        checked={filters.equipamiento.controlCrucero}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('controlCrucero', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="control-crucero" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Control crucero
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="llantas-aleacion"
                        checked={filters.equipamiento.llantasAleacion}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('llantasAleacion', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="llantas-aleacion" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Llantas de aleación
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="traccion-4x4"
                        checked={filters.equipamiento.traccion4x4}
                        onCheckedChange={(checked) => 
                          handleEquipamientoChange('traccion4x4', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="traccion-4x4" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tracción 4x4
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Financiación y permuta */}
                <div className="mt-6 space-y-3">
                  <h3 className="font-medium text-gray-800">Opciones de compra</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="financiacion"
                      checked={filters.financiacion}
                      onCheckedChange={(checked) => 
                        handleFilterChange('financiacion', checked as boolean)
                      }
                    />
                    <label 
                      htmlFor="financiacion" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepta financiación
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="permuta"
                      checked={filters.permuta}
                      onCheckedChange={(checked) => 
                        handleFilterChange('permuta', checked as boolean)
                      }
                    />
                    <label 
                      htmlFor="permuta" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepta permuta
                    </label>
                  </div>
                </div>
                
                {/* Color */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-3">Color</h3>
                <Select 
                  value={filters.color}
                  onValueChange={(value) => handleFilterChange('color', value)}
                >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg bg-white text-gray-700 w-full md:w-1/2">
                      <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blanco">Blanco</SelectItem>
                    <SelectItem value="negro">Negro</SelectItem>
                    <SelectItem value="gris">Gris</SelectItem>
                    <SelectItem value="rojo">Rojo</SelectItem>
                    <SelectItem value="azul">Azul</SelectItem>
                      <SelectItem value="verde">Verde</SelectItem>
                      <SelectItem value="amarillo">Amarillo</SelectItem>
                      <SelectItem value="naranja">Naranja</SelectItem>
                      <SelectItem value="marron">Marrón</SelectItem>
                      <SelectItem value="beige">Beige</SelectItem>
                      <SelectItem value="plateado">Plateado</SelectItem>
                      <SelectItem value="dorado">Dorado</SelectItem>
                  </SelectContent>
                </Select>
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
                        {activeFiltersCount}
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