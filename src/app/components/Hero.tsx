'use client';

import { useState, useRef } from 'react';
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
  Search, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Datos de ejemplo para autocompletado
const sugerencias = [
  { value: 'volkswagen-amarok', label: 'Volkswagen Amarok', tipo: 'Pickup' },
  { value: 'toyota-hilux', label: 'Toyota Hilux', tipo: 'Pickup' },
  { value: 'volkswagen-taos', label: 'Volkswagen Taos', tipo: 'SUV' },
  { value: 'toyota-corolla', label: 'Toyota Corolla', tipo: 'Sedan' },
  { value: 'volkswagen-golf', label: 'Volkswagen Golf', tipo: 'Hatchback' },
  { value: 'ford-ranger', label: 'Ford Ranger', tipo: 'Pickup' },
  { value: 'chevrolet-cruze', label: 'Chevrolet Cruze', tipo: 'Sedan' },
  { value: 'toyota-etios', label: 'Toyota Etios', tipo: 'Hatchback' },
  { value: 'volkswagen-nivus', label: 'Volkswagen Nivus', tipo: 'SUV' },
  { value: 'chevrolet-s10', label: 'Chevrolet S10', tipo: 'Pickup' },
];

export default function Hero() {
  const [value, setValue] = useState("");
  const [condicion, setCondicion] = useState("");
  const [marca, setMarca] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof sugerencias>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Add state for advanced search
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  // Add states for advanced search filters
  const [precio, setPrecio] = useState("");
  const [anio, setAnio] = useState("");
  const [tipo, setTipo] = useState("");
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Función para filtrar sugerencias
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setValue(userInput);
    
    // Filtrar sugerencias basadas en la entrada del usuario
    const filtered = sugerencias.filter(
      suggestion => suggestion.label.toLowerCase().includes(userInput.toLowerCase())
    );
    
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  // Función para seleccionar una sugerencia
  const handleSelectSuggestion = (suggestion: typeof sugerencias[0]) => {
    setValue(suggestion.label);
    setShowSuggestions(false);
  };

  // Función para manejar la búsqueda
  const handleSearch = () => {
    // Aquí iría la lógica para redirigir a la página de resultados
    const searchParams = new URLSearchParams();
    
    if (value) searchParams.append('query', value);
    if (condicion) searchParams.append('condicion', condicion);
    if (marca) searchParams.append('marca', marca);
    
    window.location.href = `/vehiculos/busqueda?${searchParams.toString()}`;
  };

  // Manejadores optimizados para los botones de condición
  const handleCondicion0km = () => {
    setCondicion(prev => prev === "0km" ? "" : "0km");
  };

  const handleCondicionUsado = () => {
    setCondicion(prev => prev === "usado" ? "" : "usado");
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Video de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero_video.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/40"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 max-w-7xl mx-auto w-full pt-28 md:pt-32">
        {/* Título principal */}
        <div className="text-center mb-8 md:mb-12 max-w-4xl animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight font-heading">
            Tu próximo auto te espera 
            <span className="text-[var(--color-gold)]"> en La Moderna</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium drop-shadow-md">
            Encontra el vehículo perfecto con nuestra selección premium de autos nuevos y usados.
          </p>
        </div>
        
        {/* Buscador principal - removed backdrop blur */}
        <div 
          ref={searchRef}
          className="w-full max-w-4xl bg-card/90 rounded-xl shadow-xl p-6 md:p-8 animate-slideInUp"
        >
          <div className="flex flex-col gap-6">
            {/* Botones de estado del vehículo - modificados para mejorar respuesta */}
            <div className="flex justify-center gap-4 md:gap-6">
              <Button 
                variant={condicion === "0km" ? "default" : "outline"}
                className={`flex-1 max-w-[180px] h-12 text-base font-semibold rounded-full
                  ${condicion === "0km" 
                    ? "bg-[var(--color-gold)] text-black border-[var(--color-gold)] shadow-md hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)]" 
                    : "bg-white/90 text-black border-gray-300 hover:bg-[var(--color-gold)]/90 hover:text-black hover:border-[var(--color-gold)]"
                  }`}
                onClick={handleCondicion0km}
              >
                0KM
              </Button>
              <Button 
                variant={condicion === "usado" ? "default" : "outline"}
                className={`flex-1 max-w-[180px] h-12 text-base font-semibold rounded-full
                  ${condicion === "usado" 
                    ? "bg-[var(--color-gold)] text-black border-[var(--color-gold)] shadow-md hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)]" 
                    : "bg-white/90 text-black border-gray-300 hover:bg-[var(--color-gold)]/90 hover:text-black hover:border-[var(--color-gold)]"
                  }`}
                onClick={handleCondicionUsado}
              >
                USADOS
              </Button>
            </div>
            
            {/* Barra de búsqueda con autocompletado */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Busca por marca, modelo o características (ej: SUV 4x4)"
                  className="pl-10 h-14 text-lg"
                  value={value}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Pequeño retraso para permitir que el clic en una sugerencia se registre
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
              </div>
              
              {/* Lista de sugerencias */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                  <ul className="py-1">
                    {filteredSuggestions.map((suggestion) => (
                      <li 
                        key={suggestion.value}
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                        onMouseDown={() => handleSelectSuggestion(suggestion)}
                      >
                        <span>{suggestion.label}</span>
                        <span className="text-xs text-muted-foreground">{suggestion.tipo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Filtros rápidos y botón de búsqueda */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={marca} onValueChange={setMarca}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="chevrolet">Chevrolet</SelectItem>
                    <SelectItem value="renault">Renault</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-semibold bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-hover)] rounded-full"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </div>
            
            {/* Advanced search toggle */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
              </span>
              <Button 
                variant="link" 
                className="p-0 h-auto flex items-center gap-1"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                Búsqueda avanzada
                {showAdvancedSearch ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            
            {/* Advanced search options */}
            {showAdvancedSearch && (
              <div className="pt-2 border-t border-border animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Select value={precio} onValueChange={setPrecio}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Rango de precio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1000000">Hasta $1.000.000</SelectItem>
                        <SelectItem value="1000000-2000000">$1.000.000 - $2.000.000</SelectItem>
                        <SelectItem value="2000000-3000000">$2.000.000 - $3.000.000</SelectItem>
                        <SelectItem value="3000000-5000000">$3.000.000 - $5.000.000</SelectItem>
                        <SelectItem value="5000000+">Más de $5.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={anio} onValueChange={setAnio}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023+">2023 o posterior</SelectItem>
                        <SelectItem value="2020-2022">2020 - 2022</SelectItem>
                        <SelectItem value="2015-2019">2015 - 2019</SelectItem>
                        <SelectItem value="2010-2014">2010 - 2014</SelectItem>
                        <SelectItem value="2010-">Anterior a 2010</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={tipo} onValueChange={setTipo}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Tipo de vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedán</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="deportivo">Deportivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}