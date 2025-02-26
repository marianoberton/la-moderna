'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface VehicleSearchBarProps {
  onSearch: (filters: any) => void;
}

export default function VehicleSearchBar({ onSearch }: VehicleSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    marcas: string[];
    precioRango: [number, number];
    añoRango: [number, number];
    kilometraje: string;
  }>({
    marcas: [],
    precioRango: [0, 50000000],
    añoRango: [2000, 2024],
    kilometraje: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Datos de ejemplo para sugerencias
  const sugerencias = [
    { value: 'volkswagen-amarok', label: 'Volkswagen Amarok', tipo: 'Pickup' },
    { value: 'toyota-hilux', label: 'Toyota Hilux', tipo: 'Pickup' },
    { value: 'volkswagen-taos', label: 'Volkswagen Taos', tipo: 'SUV' },
    // ... más sugerencias
  ];

  const marcas = [
    { value: 'volkswagen', label: 'Volkswagen', count: 15 },
    { value: 'toyota', label: 'Toyota', count: 12 },
    { value: 'chevrolet', label: 'Chevrolet', count: 8 },
    { value: 'ford', label: 'Ford', count: 10 },
    { value: 'renault', label: 'Renault', count: 6 }
  ];

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSelectMarca = (marca: string) => {
    setSelectedFilters(prev => {
      const newMarcas = prev.marcas.includes(marca)
        ? prev.marcas.filter(m => m !== marca)
        : [...prev.marcas, marca];
      
      return { ...prev, marcas: newMarcas };
    });
    updateActiveFilters();
  };

  const updateActiveFilters = () => {
    const newActiveFilters: string[] = [];
    
    if (selectedFilters.marcas.length > 0) {
      newActiveFilters.push(`${selectedFilters.marcas.length} marcas`);
    }
    
    if (selectedFilters.precioRango[0] > 0 || selectedFilters.precioRango[1] < 50000000) {
      newActiveFilters.push('Precio');
    }
    
    if (selectedFilters.añoRango[0] > 2000 || selectedFilters.añoRango[1] < 2024) {
      newActiveFilters.push('Año');
    }
    
    if (selectedFilters.kilometraje) {
      newActiveFilters.push('Kilometraje');
    }
    
    setActiveFilters(newActiveFilters);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  const removeFilter = (filter: string) => {
    if (filter.includes('marcas')) {
      setSelectedFilters(prev => ({ ...prev, marcas: [] }));
    } else if (filter === 'Precio') {
      setSelectedFilters(prev => ({ ...prev, precioRango: [0, 50000000] }));
    } else if (filter === 'Año') {
      setSelectedFilters(prev => ({ ...prev, añoRango: [2000, 2024] }));
    } else if (filter === 'Kilometraje') {
      setSelectedFilters(prev => ({ ...prev, kilometraje: '' }));
    }
    updateActiveFilters();
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      {/* Barra de búsqueda principal */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Busca por marca, modelo o características (ej: SUV 4x4)"
              value={searchTerm}
              onChange={handleSearchInput}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Sugerencias de búsqueda */}
          {showSuggestions && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {sugerencias
                .filter(sugerencia => 
                  sugerencia.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((sugerencia) => (
                  <div
                    key={sugerencia.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                    onClick={() => {
                      setSearchTerm(sugerencia.label);
                      setShowSuggestions(false);
                    }}
                  >
                    <span>{sugerencia.label}</span>
                    <span className="text-sm text-muted-foreground">{sugerencia.tipo}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                {/* Selección de marcas */}
                <div>
                  <h4 className="font-medium mb-2">Marcas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {marcas.map((marca) => (
                      <Button
                        key={marca.value}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-start",
                          selectedFilters.marcas.includes(marca.value) && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => handleSelectMarca(marca.value)}
                      >
                        {marca.label}
                        <Badge variant="secondary" className="ml-auto">
                          {marca.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rango de precios */}
                <div>
                  <h4 className="font-medium mb-2">Rango de precio</h4>
                  <Slider
                    defaultValue={selectedFilters.precioRango}
                    max={50000000}
                    step={100000}
                    onValueChange={(value: [number, number]) => {
                      setSelectedFilters(prev => ({ ...prev, precioRango: value }));
                      updateActiveFilters();
                    }}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{formatPrice(selectedFilters.precioRango[0])}</span>
                    <span>{formatPrice(selectedFilters.precioRango[1])}</span>
                  </div>
                </div>

                {/* Rango de años */}
                <div>
                  <h4 className="font-medium mb-2">Año</h4>
                  <Slider
                    defaultValue={selectedFilters.añoRango}
                    min={2000}
                    max={2024}
                    step={1}
                    onValueChange={(value: [number, number]) => {
                      setSelectedFilters(prev => ({ ...prev, añoRango: value }));
                      updateActiveFilters();
                    }}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{selectedFilters.añoRango[0]}</span>
                    <span>{selectedFilters.añoRango[1]}</span>
                  </div>
                </div>

                {/* Kilometraje */}
                <div>
                  <h4 className="font-medium mb-2">Kilometraje</h4>
                  <Select
                    value={selectedFilters.kilometraje}
                    onValueChange={(value) => {
                      setSelectedFilters(prev => ({ ...prev, kilometraje: value }));
                      updateActiveFilters();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar kilometraje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10000">0 - 10.000 km</SelectItem>
                      <SelectItem value="10000-50000">10.000 - 50.000 km</SelectItem>
                      <SelectItem value="50000-100000">50.000 - 100.000 km</SelectItem>
                      <SelectItem value="100000+">Más de 100.000 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button className="h-12" onClick={() => onSearch(selectedFilters)}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFilters({
                marcas: [],
                precioRango: [0, 50000000],
                añoRango: [2000, 2024],
                kilometraje: ''
              });
              setActiveFilters([]);
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
} 