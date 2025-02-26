'use client';

import { useState } from 'react';
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
import { Slider } from "@/components/ui/slider";
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Definir el tipo de los filtros
type VehicleFilters = {
  busqueda: string;
  condicion: string;
  marca: string;
  modelo: string;
  precioRango: [number, number];
  añoRango: [number, number];
  kilometrajeRango: [number, number];
  combustible: string;
  transmision: string;
  // Filtros adicionales
  financiacion: boolean;
  permuta: boolean;
  color: string;
  puertas: string;
};

interface VehicleFiltersProps {
  onFiltersChange?: (filters: VehicleFilters) => void;
}

export default function VehicleFilters({
  onFiltersChange
}: VehicleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({
    busqueda: '',
    condicion: '',
    marca: '',
    modelo: '',
    precioRango: [0, 1000000],
    añoRango: [2000, 2024],
    kilometrajeRango: [0, 200000],
    combustible: '',
    transmision: '',
    financiacion: false,
    permuta: false,
    color: '',
    puertas: ''
  });

  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Botones de condición */}
        <div className="flex justify-center gap-2 md:gap-4 mb-6">
          <Button 
            variant="ghost"
            className={`flex-1 max-w-[150px] h-12 text-base font-medium transition-all duration-300 rounded-full ${
              filters.condicion === "0km" 
                ? "bg-[#e63946] text-white hover:bg-[#e63946]/90" 
                : "hover:bg-[#e63946]/10 border-2 border-[#e63946]/20"
            }`}
            onClick={() => handleFilterChange("condicion", filters.condicion === "0km" ? "" : "0km")}
          >
            0KM
          </Button>
          <Button 
            variant="ghost"
            className={`flex-1 max-w-[150px] h-12 text-base font-medium transition-all duration-300 rounded-full ${
              filters.condicion === "usado" 
                ? "bg-[#457b9d] text-white hover:bg-[#457b9d]/90" 
                : "hover:bg-[#457b9d]/10 border-2 border-[#457b9d]/20"
            }`}
            onClick={() => handleFilterChange("condicion", filters.condicion === "usado" ? "" : "usado")}
          >
            USADOS
          </Button>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Buscar marca, modelo o versión..." 
            className="pl-10 h-12"
            value={filters.busqueda}
            onChange={(e) => handleFilterChange('busqueda', e.target.value)}
          />
        </div>

        {/* Filtros principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select 
            value={filters.marca}
            onValueChange={(value) => handleFilterChange('marca', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volkswagen">Volkswagen</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="chevrolet">Chevrolet</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.modelo}
            onValueChange={(value) => handleFilterChange('modelo', value)}
            disabled={!filters.marca}
          >
            <SelectTrigger>
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              {/* Opciones dinámicas basadas en la marca */}
            </SelectContent>
          </Select>

          <Select 
            value={filters.combustible}
            onValueChange={(value) => handleFilterChange('combustible', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Combustible" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nafta">Nafta</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="gnc">GNC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rangos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <Label>Rango de precios</Label>
            <Slider
              value={filters.precioRango}
              max={1000000}
              step={10000}
              onValueChange={(value) => handleFilterChange('precioRango', value)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.precioRango[0].toLocaleString()}</span>
              <span>${filters.precioRango[1].toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Año</Label>
            <Slider
              value={filters.añoRango}
              min={2000}
              max={2024}
              step={1}
              onValueChange={(value) => handleFilterChange('añoRango', value)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.añoRango[0]}</span>
              <span>{filters.añoRango[1]}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Kilometraje</Label>
            <Slider
              value={filters.kilometrajeRango}
              min={0}
              max={200000}
              step={25000}
              onValueChange={(value) => handleFilterChange('kilometrajeRango', value)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.kilometrajeRango[0].toLocaleString()} km</span>
              <span>{filters.kilometrajeRango[1].toLocaleString()} km</span>
            </div>
          </div>
        </div>

        {/* Separador antes del botón de filtros */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="px-6 bg-background"
                >
                  {isOpen ? (
                    <>Menos filtros <ChevronUp className="h-4 w-4 ml-2" /></>
                  ) : (
                    <>Más filtros <ChevronDown className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 mt-6">
                {/* Transmisión */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    value={filters.transmision}
                    onValueChange={(value) => handleFilterChange('transmision', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Transmisión" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatica">Automática</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.color}
                    onValueChange={(value) => handleFilterChange('color', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blanco">Blanco</SelectItem>
                      <SelectItem value="negro">Negro</SelectItem>
                      <SelectItem value="gris">Gris</SelectItem>
                      <SelectItem value="rojo">Rojo</SelectItem>
                      <SelectItem value="azul">Azul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Puertas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    value={filters.puertas}
                    onValueChange={(value) => handleFilterChange('puertas', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Puertas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 puertas</SelectItem>
                      <SelectItem value="3">3 puertas</SelectItem>
                      <SelectItem value="4">4 puertas</SelectItem>
                      <SelectItem value="5">5 puertas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Características adicionales */}
                <div className="space-y-4">
                  <Label className="text-base">Características adicionales</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Acepta financiación</span>
                      <Switch
                        checked={filters.financiacion}
                        onCheckedChange={(checked) => handleFilterChange('financiacion', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Acepta permuta</span>
                      <Switch
                        checked={filters.permuta}
                        onCheckedChange={(checked) => handleFilterChange('permuta', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

      </CardContent>
    </Card>
  );
} 