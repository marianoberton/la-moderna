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
  ChevronDown
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

  return (
    <section className="relative min-h-[85vh] overflow-hidden flex flex-col">
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
            <source src="/videos/AdobeStock_756455246_Video_HD_Preview.mov" type="video/quicktime" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
        {/* Capa de opacidad con textura */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 max-w-7xl mx-auto w-full">
        {/* Título principal */}
        <div className="text-center mb-8 md:mb-12 max-w-4xl animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight font-heading">
            Los mejores vehículos seleccionados para ti, 
            <span className="text-primary"> con garantía certificada</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Encuentra el vehículo perfecto para tus necesidades con nuestra selección premium de autos nuevos y usados.
          </p>
        </div>
        
        {/* Buscador principal */}
        <div 
          ref={searchRef}
          className="w-full max-w-4xl bg-card/95 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 animate-slideInUp"
        >
          <div className="flex flex-col gap-6">
            {/* Botones de estado del vehículo */}
            <div className="flex justify-center gap-2 md:gap-4">
              <Button 
                variant="ghost"
                className={`flex-1 max-w-[150px] h-12 text-base font-medium transition-all duration-300 rounded-full ${
                  condicion === "0km" 
                    ? "bg-[#e63946] text-white hover:bg-[#e63946]/90" 
                    : "hover:bg-[#e63946]/10 border-2 border-[#e63946]/20"
                }`}
                onClick={() => setCondicion(condicion === "0km" ? "" : "0km")}
              >
                0KM
              </Button>
              <Button 
                variant="ghost"
                className={`flex-1 max-w-[150px] h-12 text-base font-medium transition-all duration-300 rounded-full ${
                  condicion === "usado" 
                    ? "bg-[#457b9d] text-white hover:bg-[#457b9d]/90" 
                    : "hover:bg-[#457b9d]/10 border-2 border-[#457b9d]/20"
                }`}
                onClick={() => setCondicion(condicion === "usado" ? "" : "usado")}
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
                className="h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Más de 100 vehículos disponibles
              </span>
              <Button variant="link" className="p-0 h-auto">
                Búsqueda avanzada
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
        <span className="text-white text-sm mb-1 font-medium">Descubre más</span>
        <ChevronDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
} 