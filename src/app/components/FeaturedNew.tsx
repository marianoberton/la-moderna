'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { 
  Calendar, 
  Fuel, 
  Cog,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Datos de las concesionarias
const concesionarias = [
  { 
    id: 1, 
    nombre: "La Moderna Pilar", 
    whatsapp: "5491123456789",
    direccion: "Ruta 8 Km 50, Pilar"
  },
  { 
    id: 2, 
    nombre: "La Moderna Escobar", 
    whatsapp: "5491187654321",
    direccion: "Ruta 25 Km 10, Escobar"
  }
];

export default function FeaturedNew() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showConcesionarias, setShowConcesionarias] = useState<number | null>(null);
  const itemsPerPage = 3;
  
  const featuredCars = [
    {
      id: 1,
      brand: 'VOLKSWAGEN',
      model: 'AMAROK',
      version: 'V6 COMFORTLINE 4X4 AT',
      condition: 'Nuevo',
      image: '/images/0km/amaraok0.jpg',
      price: 'Consultar',
      year: '2024',
      fuel: 'Diesel',
      transmission: 'Automática',
      highlights: ['Motor V6 TDI', 'Tracción 4x4', 'Asientos de cuero']
    },
    {
      id: 2,
      brand: 'VOLKSWAGEN',
      model: 'AMAROK',
      version: 'AMAROK 2.0 COMFORTLINE 4X2 MT',
      condition: 'Nuevo',
      image: '/images/0km/amaraok0 (2).jpg',
      imageHover: '/images/0km/amaraok0-interior.jpg', // Imagen alternativa para hover
      color: 'Blanco',
      drive: '4x2',
      price: 'Consultar',
      year: '2024',
      fuel: 'Diesel',
      transmission: 'Manual',
      highlights: ['Motor 2.0 TDI', 'Cámara de retroceso', 'Pantalla táctil 8"']
    },
    {
      id: 3,
      brand: 'TOYOTA',
      model: 'COROLLA CROSS',
      version: 'COROLLA CROSS 2.0 XEI CVT',
      condition: 'Nuevo',
      image: '/images/0km/corolla-cross0.jpg',
      imageHover: '/images/0km/corolla-cross0-interior.jpg', // Imagen alternativa para hover
      color: 'Blanco',
      drive: '4x2',
      price: 'Consultar',
      year: '2024',
      fuel: 'Nafta',
      transmission: 'Automática',
      highlights: ['Motor 2.0L', 'Climatizador bizona', 'Control de crucero']
    },
    {
      id: 4,
      brand: 'VOLKSWAGEN',
      model: 'NIVUS',
      version: 'NIVUS 200 TSI HIGHLINE AT',
      condition: 'Nuevo',
      image: '/images/0km/nivus0.jpg',
      imageHover: '/images/0km/nivus0-interior.jpg', // Imagen alternativa para hover
      color: 'Gris',
      drive: 'FWD',
      price: 'Consultar',
      year: '2024',
      fuel: 'Nafta',
      transmission: 'Automática',
      highlights: ['Motor TSI', 'Techo panorámico', 'Sensores de estacionamiento']
    },
    {
      id: 5,
      brand: 'VOLKSWAGEN',
      model: 'TAOS',
      version: 'TAOS 1.4 TSI HIGHLINE DSG',
      condition: 'Nuevo',
      image: '/images/0km/taos003.jpg',
      imageHover: '/images/0km/taos003-interior.jpg', // Imagen alternativa para hover
      color: 'Blanco',
      drive: 'FWD',
      price: 'Consultar',
      year: '2024',
      fuel: 'Nafta',
      transmission: 'Automática',
      highlights: ['Motor 1.4 TSI', 'Caja DSG', 'Asistente de conducción']
    },
    {
      id: 6,
      brand: 'VOLKSWAGEN',
      model: 'T-CROSS',
      version: 'T-CROSS 1.4 TSI COMFORTLINE',
      condition: 'Nuevo',
      image: '/images/0km/tcross_2024_1_confortline.jpg',
      imageHover: '/images/0km/tcross_2024_1_interior.jpg', // Imagen alternativa para hover
      color: 'Blanco',
      drive: 'FWD',
      price: 'Consultar',
      year: '2024',
      fuel: 'Nafta',
      transmission: 'Manual',
      highlights: ['Motor 1.4 TSI', 'Pantalla táctil', 'Bluetooth']
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => 
      prev + itemsPerPage >= featuredCars.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) => 
      prev - itemsPerPage < 0 ? Math.max(0, featuredCars.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  const totalPages = Math.ceil(featuredCars.length / itemsPerPage);
  const currentPage = Math.floor(activeIndex / itemsPerPage);

  // Función para abrir WhatsApp
  const openWhatsApp = (whatsapp: string, carInfo: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en el vehículo: ${carInfo}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  // Función para navegar a la página de detalles del vehículo
  const navigateToVehicleDetails = (carId: number) => {
    window.location.href = `/vehiculos/nuevos/${carId}`;
  };

  // Efecto para cerrar el selector de concesionarias al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showConcesionarias !== null) {
        setShowConcesionarias(null);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showConcesionarias]);

  return (
    <div className="relative py-12">
      <div className="container">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Vehículos 0KM Destacados</h2>
          <div className="h-0.5 w-20 bg-primary rounded-full mb-4"></div>
          <p className="text-muted-foreground text-center max-w-2xl">
            Descubre nuestra selección de vehículos nuevos con las mejores condiciones del mercado
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-6"
              initial={false}
              animate={{ x: `-${activeIndex * (100 / itemsPerPage)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {featuredCars.map((car, index) => (
                <VehicleCard 
                  key={car.id} 
                  car={car} 
                  index={index} 
                  concesionarias={concesionarias}
                  showConcesionarias={showConcesionarias === car.id}
                  onConsultarClick={() => setShowConcesionarias(car.id)}
                  onConcesionariaSelect={(whatsapp) => {
                    openWhatsApp(whatsapp, `${car.brand} ${car.model} ${car.version}`);
                    setShowConcesionarias(null);
                  }}
                  onClose={() => setShowConcesionarias(null)}
                  onViewDetails={() => navigateToVehicleDetails(car.id)}
                />
              ))}
            </motion.div>
          </div>

          {/* Navegación del carrusel (botones e indicadores) */}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Anterior</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Siguiente</span>
          </Button>
          
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-primary w-8' : 'bg-muted hover:bg-primary/50'}`}
                aria-label={`Ir a página ${i + 1}`}
                onClick={() => setActiveIndex(i * itemsPerPage)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface VehicleCardProps {
  car: any;
  index: number;
  concesionarias: Array<{id: number; nombre: string; whatsapp: string; direccion: string}>;
  showConcesionarias: boolean;
  onConsultarClick: () => void;
  onConcesionariaSelect: (whatsapp: string) => void;
  onClose: () => void;
  onViewDetails: () => void;
}

function VehicleCard({ 
  car, 
  index, 
  concesionarias, 
  showConcesionarias, 
  onConsultarClick, 
  onConcesionariaSelect, 
  onClose, 
  onViewDetails
}: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="min-w-[calc(33.333%-16px)] bg-card rounded-lg overflow-hidden border border-border flex-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal con overlay y badge - Clicable */}
      <div 
        className="relative h-48 overflow-hidden cursor-pointer" 
        onClick={onViewDetails}
      >
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-100'}`}></div>
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/320x208";
          }}
        />
        <Badge className="absolute top-3 left-3 z-20 bg-primary text-primary-foreground">
          0KM
        </Badge>
      </div>
      
      <div className="p-4">
        {/* Marca y modelo (movidos fuera de la imagen) - Clicable */}
        <div 
          className="mb-3 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={onViewDetails}
        >
          <h3 className="text-xl font-bold">
            {car.brand} <span className="text-primary">{car.model}</span>
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{car.version}</p>
        </div>
        
        {/* Especificaciones esenciales con iconos */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col items-center text-center">
            <Fuel className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Combustible</span>
            <span className="text-sm font-medium">{car.fuel}</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Cog className="h-4 w-4 text-primary mb-1" />
            <span className="text-xs text-muted-foreground">Transmisión</span>
            <span className="text-sm font-medium">{car.transmission}</span>
          </div>
        </div>
        
        {/* Características destacadas - visible solo en hover */}
        <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <p className="text-xs font-medium text-primary mb-2">Equipamiento destacado:</p>
          <ul className="flex flex-wrap gap-1">
            {car.highlights.map((highlight: string, i: number) => (
              <li key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center mt-4">
          {/* Botón Ver Detalles */}
          <Button 
            variant="outline"
            size="sm"
            className="relative overflow-hidden transition-all duration-300"
            onClick={onViewDetails}
          >
            <span className="relative z-10">Ver Detalles</span>
            <span className={`absolute inset-0 bg-primary/5 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`} />
          </Button>
          
          {/* Botón Contactar */}
          <div className="relative">
            <Button 
              size="sm"
              className={`relative overflow-hidden transition-all duration-300 ${isHovered ? 'bg-primary hover:bg-primary/90' : ''}`}
              onClick={onConsultarClick}
            >
              <span className="relative z-10">Contactar</span>
              <span className={`absolute inset-0 bg-primary/10 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`} />
            </Button>
            
            {/* Selector de concesionaria con animación */}
            {showConcesionarias && (
              <motion.div 
                className="absolute right-0 bottom-full mb-2 w-72 bg-card shadow-lg rounded-lg border border-border z-30 overflow-hidden"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-3">
                  <h4 className="font-medium mb-2">Selecciona una concesionaria</h4>
                  <div className="space-y-2">
                    {concesionarias.map((concesionaria) => (
                      <button
                        key={concesionaria.id}
                        className="w-full text-left p-3 hover:bg-muted rounded flex items-center text-sm transition-colors"
                        onClick={() => onConcesionariaSelect(concesionaria.whatsapp)}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          className="h-8 w-8 mr-3 text-green-500 fill-current flex-shrink-0"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <div className="flex-1">
                          <div className="font-medium">{concesionaria.nombre}</div>
                          <div className="text-xs text-muted-foreground">{concesionaria.direccion}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 