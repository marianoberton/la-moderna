'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { 
  Calendar, 
  Fuel, 
  Cog,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Vehiculo } from './VehicleCard';

// Badge personalizado sin hover para USADO/0KM
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

// Datos de las concesionarias
const concesionarias = [
  { 
    id: 1, 
    nombre: "La Moderna T. Lauquen", 
    whatsapp: "5491154645940",
    direccion: "Av. Garcia Salinas 1163"
  },
  { 
    id: 2, 
    nombre: "La Moderna Pehuajo", 
    whatsapp: "5492396625108",
    direccion: "Acceso Pres. Nestor C. Kirchner 1151"
  }
];

export default function UsedCars() {
  // Mantenemos los datos mock como fallback
  const mockUsedCars: Vehiculo[] = [
    {
      id: 1,
      marca: 'VOLKSWAGEN',
      modelo: 'AMAROK',
      version: 'AMAROK 2.0 HIGHLINE 4X4 AT',
      año: 2020,
      km: 65000,
      precio: 28500000,
      combustible: 'Diesel',
      transmision: 'Automática',
      imagen: '/images/Usado/amarok_usada.jpg',
      fotos: 18,
      highlights: ['Tracción 4x4', 'Asientos de cuero', 'Control de estabilidad']
    },
    {
      id: 2,
      marca: 'VOLKSWAGEN',
      modelo: 'AMAROK',
      version: 'AMAROK 2.0 COMFORTLINE 4X2 MT',
      año: 2019,
      km: 78000,
      precio: 24900000,
      combustible: 'Diesel',
      transmision: 'Manual',
      imagen: '/images/Usado/amarokusada.jpg',
      fotos: 15,
      highlights: ['Dirección asistida', 'Control de tracción', 'Bluetooth']
    },
    {
      id: 3,
      marca: 'CHEVROLET',
      modelo: 'S10',
      version: 'S10 2.8 LTZ 4X4 CD TDCI',
      año: 2018,
      km: 92000,
      precio: 22500000,
      combustible: 'Diesel',
      transmision: 'Manual',
      imagen: '/images/Usado/Chevrolets10_usada.jpg',
      fotos: 14,
      highlights: ['4x4', 'Motor 2.8 TDCI', 'Climatizador']
    },
    {
      id: 4,
      marca: 'TOYOTA',
      modelo: 'COROLLA',
      version: 'COROLLA 1.8 XEI CVT',
      año: 2021,
      km: 35000,
      precio: 19800000,
      combustible: 'Nafta',
      transmision: 'Automática CVT',
      imagen: '/images/Usado/corolla1.jpg',
      fotos: 20,
      highlights: ['Caja CVT', 'Pantalla táctil', 'LED']
    },
    {
      id: 5,
      marca: 'CHEVROLET',
      modelo: 'CRUZE',
      version: 'CRUZE 1.4 LTZ AT',
      año: 2019,
      km: 48000,
      precio: 17500000,
      combustible: 'Nafta',
      transmision: 'Automática',
      imagen: '/images/Usado/cruzeusado.jpg',
      fotos: 16,
      highlights: ['Motor turbo', 'Caja automática', 'Sensores']
    },
    {
      id: 6,
      marca: 'RENAULT',
      modelo: 'DUSTER',
      version: 'DUSTER 1.6 DYNAMIQUE 4X2',
      año: 2020,
      km: 42000,
      precio: 15900000,
      combustible: 'Nafta',
      transmision: 'Manual',
      imagen: '/images/Usado/duster.jpg',
      fotos: 12,
      highlights: ['Multimedia', 'Control crucero', 'Aire acondicionado']
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [showConcesionarias, setShowConcesionarias] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usedCars, setUsedCars] = useState<Vehiculo[]>(mockUsedCars);

  // Cargar vehículos destacados desde Supabase
  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      try {
        setIsLoading(true);
        
        // Importar el servicio de vehículos
        const { getVehicles } = await import('@/services/vehicleService');
        
        // Obtener todos los vehículos activos
        const allVehicles = await getVehicles(true);
        
        // Filtrar vehículos usados destacados
        const featuredUsedVehicles = allVehicles.filter(vehicle => 
          vehicle.is_featured && 
          (vehicle.condicion === 'USADO' || vehicle.condicion === 'usado') &&
          vehicle.kilometraje > 0
        );
        
        if (!featuredUsedVehicles || featuredUsedVehicles.length === 0) {
          console.log('No hay vehículos usados destacados, usando datos de ejemplo');
          setUsedCars(mockUsedCars);
          setIsLoading(false);
          return;
        }
        
        // Transformar los datos al formato de Vehiculo
        const transformed: Vehiculo[] = featuredUsedVehicles.map((vehicle, index) => {
          // Extraer características destacadas
          let highlights: string[] = [];
          
          // Primero usamos las características seleccionadas específicamente para destacados
          if (Array.isArray(vehicle.selected_highlights) && vehicle.selected_highlights.length > 0) {
            console.log(`Vehículo ${vehicle.id} tiene ${vehicle.selected_highlights.length} características destacadas seleccionadas`, vehicle.selected_highlights);
            highlights = [...vehicle.selected_highlights];
          } 
          // Si no hay características seleccionadas, usamos las características y equipamiento
          else {
            console.log(`Vehículo ${vehicle.id} no tiene características destacadas seleccionadas, usando caracteristicas y equipamiento`);
            // Añadimos las características explícitas si existen
            if (Array.isArray(vehicle.caracteristicas) && vehicle.caracteristicas.length > 0) {
              highlights = [...vehicle.caracteristicas];
            }
            
            // Luego añadimos el equipamiento activado
            if (vehicle.equipamiento && typeof vehicle.equipamiento === 'object') {
              const equipHighlights = Object.entries(vehicle.equipamiento)
                .filter(([key, value]) => value === true)
                .map(([key]) => {
                  // Convertir camelCase a texto legible
                  const readable = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  return readable;
                });
              
              highlights = [...highlights, ...equipHighlights];
            }
          }
          
          // Limitar a 3 características para mostrar
          const limitedHighlights = highlights.slice(0, 3);
          
          // Formatear correctamente combustible y transmisión con solo la primera letra en mayúscula
          const formatFirstLetterUpper = (text: string) => {
            if (!text) return '';
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
          };

          return {
            id: vehicle.id, // Mantener el ID original que puede ser UUID
            marca: vehicle.marca.toUpperCase(),
            modelo: vehicle.modelo.toUpperCase(),
            version: vehicle.version,
            año: vehicle.año || new Date().getFullYear(),
            km: vehicle.kilometraje || 0,
            precio: vehicle.precio || 0,
            combustible: formatFirstLetterUpper(vehicle.combustible) || 'Nafta',
            transmision: formatFirstLetterUpper(vehicle.transmision) || 'Manual',
            imagen: vehicle.imagenes?.[0] || '/placeholder-car.jpg',
            fotos: vehicle.imagenes?.length || 0,
            images: vehicle.imagenes,
            color: vehicle.color,
            highlights: limitedHighlights
          };
        });
        
        console.log('Vehículos usados destacados cargados:', transformed.length);
        setUsedCars(transformed);
      } catch (error) {
        console.error('Error al cargar vehículos usados destacados:', error);
        setUsedCars(mockUsedCars);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedVehicles();
  }, []);

  // Mostrar solo los primeros vehículos en la página principal
  const displayedCars = usedCars.slice(0, 8);

  // Efecto para ajustar itemsPerPage según el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // móvil
        setItemsPerPage(1);
        setIsMobile(true);
      } else if (width < 1024) { // tablet
        setItemsPerPage(2);
        setIsMobile(false);
      } else { // desktop
        setItemsPerPage(3);
        setIsMobile(false);
      }
    };

    handleResize(); // Llamada inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (isMobile) {
      setActiveIndex((prev) => 
        prev + 1 >= displayedCars.length ? 0 : prev + 1
      );
    } else {
      setActiveIndex((prev) => 
        prev + itemsPerPage >= displayedCars.length ? 0 : prev + itemsPerPage
      );
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setActiveIndex((prev) => 
        prev - 1 < 0 ? displayedCars.length - 1 : prev - 1
      );
    } else {
      setActiveIndex((prev) => 
        prev - itemsPerPage < 0 ? Math.max(0, displayedCars.length - itemsPerPage) : prev - itemsPerPage
      );
    }
  };

  const totalPages = Math.ceil(displayedCars.length / itemsPerPage);
  const currentPage = Math.floor(activeIndex / itemsPerPage);

  // Función para cambiar la imagen activa de un vehículo
  const changeActiveImage = (carId: number, index: number) => {
    setActiveImageIndex({
      ...activeImageIndex,
      [carId]: index
    });
  };

  // Función para obtener la imagen activa de un vehículo
  const getActiveImage = (car: Vehiculo) => {
    if (!car.images || car.images.length === 0) {
      return car.imagen;
    }
    
    const index = activeImageIndex[car.id] || 0;
    return car.images[index];
  };

  // Función para formatear precio en pesos argentinos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Función para abrir WhatsApp
  const openWhatsApp = (whatsapp: string, carInfo: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en el vehículo: ${carInfo}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  // Función para navegar a la página de detalles del vehículo
  const navigateToVehicleDetails = (carId: number | string) => {
    if (!carId) return;
    
    // Verificar si estamos trabajando con datos de ejemplo (IDs numéricos 1-6)
    const isMockData = typeof carId === 'number' && carId <= 6;
    
    if (isMockData) {
      // Para datos de ejemplo, mostrar mensaje explicativo
      console.log('ID es de datos de ejemplo, no se puede navegar a la ficha real');
      alert('Este vehículo es un ejemplo y no tiene una ficha detallada. En la versión final, aquí se mostrará la información completa del vehículo.');
      return;
    }
    
    // Es un ID real, navegar a la página
    window.location.href = `/vehiculos/${carId}`;
  };

  // Para móvil, limitamos el activeIndex al rango de vehículos disponibles
  useEffect(() => {
    if (isMobile && activeIndex >= displayedCars.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, isMobile, displayedCars.length]);

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
    <div className="relative py-6">
      <div className="container px-0 sm:px-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-center">VEHÍCULOS USADOS SELECCIONADOS</h2>
          <div className="h-0.5 w-20 bg-[var(--color-dark-bg)] rounded-full mb-2"></div>
          <div className="h-0.5 w-20 bg-[var(--color-dark-bg)] rounded-full"></div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--color-dark-bg)]" />
          </div>
        ) : displayedCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Gauge className="h-6 w-6 text-[var(--color-dark-bg)]" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay vehículos destacados</h3>
            <p className="text-muted-foreground max-w-md">
              Actualmente no hay vehículos usados seleccionados para mostrar. Por favor, vuelva a revisar más tarde.
            </p>
            <Button 
              asChild 
              variant="default"
              className="mt-6 rounded-full bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-hover)] px-8 py-3 font-semibold text-sm"
            >
              <Link href="/vehiculos?condicion=USADO" className="inline-flex items-center">
                Ver todos los usados
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="relative px-0 sm:px-2">
              {isMobile ? (
                // Vista móvil - cada vehículo ocupa todo el ancho visible
                <div className="overflow-hidden">
                  <motion.div 
                    className="flex"
                    initial={false}
                    animate={{ x: `-${activeIndex * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {displayedCars.map((car, index) => (
                      <div 
                        key={car.id} 
                        style={{ width: '100%', flex: '0 0 100%' }}
                        className="px-0"
                      >
                        <UsedVehicleCard 
                          car={car}
                          index={index}
                          formatPrice={formatPrice}
                          concesionarias={concesionarias}
                          showConcesionarias={showConcesionarias === car.id}
                          onConsultarClick={() => setShowConcesionarias(showConcesionarias === car.id ? null : car.id)}
                          onConcesionariaSelect={(whatsapp) => {
                            openWhatsApp(whatsapp, `${car.marca} ${car.modelo} ${car.version}`);
                            setShowConcesionarias(null);
                          }}
                          onClose={() => setShowConcesionarias(null)}
                          onViewDetails={() => navigateToVehicleDetails(car.id)}
                          isMobile={isMobile}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              ) : (
                // Vista tablet/desktop con el mismo enfoque que FeaturedNew
                <div className="overflow-hidden">
                  <motion.div 
                    className="flex"
                    initial={false}
                    animate={{ x: `-${activeIndex * (100/3)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      width: "auto",
                    }}
                  >
                    {displayedCars.map((car, index) => (
                      <div 
                        key={car.id} 
                        style={{ width: "33.333%" }}
                        className="px-1 sm:px-2 flex-shrink-0"
                      >
                        <UsedVehicleCard 
                          car={car}
                          index={index}
                          formatPrice={formatPrice}
                          concesionarias={concesionarias}
                          showConcesionarias={showConcesionarias === car.id}
                          onConsultarClick={() => setShowConcesionarias(showConcesionarias === car.id ? null : car.id)}
                          onConcesionariaSelect={(whatsapp) => {
                            openWhatsApp(whatsapp, `${car.marca} ${car.modelo} ${car.version}`);
                            setShowConcesionarias(null);
                          }}
                          onClose={() => setShowConcesionarias(null)}
                          onViewDetails={() => navigateToVehicleDetails(car.id)}
                          isMobile={isMobile}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Navegación del carrusel para todas las vistas - posicionamiento ajustado */}
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute -left-4 sm:-left-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Anterior</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute -right-4 sm:-right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Siguiente</span>
              </Button>
              
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-[var(--color-dark-bg)] w-6 sm:w-8' : 'bg-muted hover:bg-[var(--color-dark-bg)]/50'}`}
                    aria-label={`Ir a página ${i + 1}`}
                    onClick={() => setActiveIndex(i * itemsPerPage)}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button 
                asChild 
                variant="default"
                className="rounded-full bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-hover)] px-8 py-3 font-semibold text-sm"
              >
                <Link href="/vehiculos?condicion=USADO" className="inline-flex items-center">
                  Ver todos los usados ({usedCars.length})
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface UsedVehicleCardProps {
  car: Vehiculo;
  index: number;
  formatPrice: (price: number) => string;
  concesionarias: Array<{id: number; nombre: string; whatsapp: string; direccion: string}>;
  showConcesionarias: boolean;
  onConsultarClick: () => void;
  onConcesionariaSelect: (whatsapp: string) => void;
  onClose: () => void;
  onViewDetails: () => void;
  isMobile: boolean;
}

function UsedVehicleCard({ 
  car, 
  index, 
  formatPrice,
  concesionarias, 
  showConcesionarias, 
  onConsultarClick, 
  onConcesionariaSelect, 
  onClose, 
  onViewDetails,
  isMobile
}: UsedVehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Función para obtener la imagen correcta del vehículo
  const getCarImage = () => {
    if (imageError) {
      return "https://via.placeholder.com/320x208?text=Sin+Imagen";
    }
    
    // Si hay imágenes en el array, usa la primera
    if (car.images && car.images.length > 0) {
      return car.images[0];
    }
    
    // Si hay una imagen principal, úsala
    if (car.imagen) {
      return car.imagen;
    }
    
    // Imagen por defecto si no hay ninguna
    return "https://via.placeholder.com/320x208?text=Sin+Imagen";
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-lg overflow-hidden border border-border h-full flex flex-col relative mx-2 sm:mx-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal con overlay y badges */}
      <div 
        className="relative h-60 sm:h-64 overflow-hidden cursor-pointer bg-gray-50 p-3" 
        onClick={onViewDetails}
      >
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-100'}`}></div>
        <img 
          src={getCarImage()} 
          alt={`${car.marca} ${car.modelo}`}
          className="w-full h-full object-cover object-center transition-all duration-500"
          onError={(e) => {
            console.log(`Error cargando imagen para vehículo ${car.id}`);
            setImageError(true);
          }}
        />
        <StatusBadge className="absolute top-3 left-3 z-20 bg-[var(--color-dark-bg)] text-white border-[var(--color-dark-bg)]">
          USADO
        </StatusBadge>
        
        {/* Badges para año y kilometraje - ahora a la derecha como en la página vehiculos */}
        <div className="absolute bottom-3 right-3 z-20 flex space-x-2">
          <InfoBadge className="bg-black/70 text-white">
            <Calendar className="h-3 w-3 mr-1" />
            {car.año}
          </InfoBadge>
          <InfoBadge className="bg-black/70 text-white">
            <Gauge className="h-3 w-3 mr-1" />
            {car.km.toLocaleString()} km
          </InfoBadge>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Marca y modelo */}
        <div 
          className="mb-2 sm:mb-3 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={onViewDetails}
        >
          <h3 className="text-lg sm:text-xl font-bold line-clamp-1">
            {car.marca} <span className="text-[var(--color-dark-bg)]">{car.modelo}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{car.version}</p>
        </div>
        
        {/* Precio */}
        <div className="mb-3">
          <p className="text-base sm:text-lg font-bold text-[var(--color-dark-bg)]">
            {formatPrice(car.precio)}
          </p>
        </div>
        
        {/* Especificaciones esenciales con iconos - solo para desktop o si no es móvil */}
        {!isMobile && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex flex-col items-center text-center">
              <Fuel className="h-4 w-4 text-[var(--color-dark-bg)] mb-1" />
              <span className="text-xs text-muted-foreground">Combustible</span>
              <span className="text-xs sm:text-sm font-medium">{car.combustible}</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <img 
                src="/manual-transmission.svg" 
                alt="Transmisión"
                className="h-4 w-4 text-[var(--color-dark-bg)] mb-1"
              />
              <span className="text-xs text-muted-foreground">Transmisión</span>
              <span className="text-xs sm:text-sm font-medium">{car.transmision}</span>
            </div>
          </div>
        )}
        
        {/* Equipamiento destacado solo en hover para desktop */}
        {!isMobile && car.highlights && car.highlights.length > 0 && isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 text-center border-t border-border pt-2"
          >
            <p className="text-xs font-medium text-[var(--color-dark-bg)] mb-1">Equipamiento destacado</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {car.highlights.slice(0, 3).map((highlight: string, i: number) => (
                <span key={`${car.id}-highlight-${i}`} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {highlight}
                </span>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center mt-auto gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 text-xs sm:text-sm relative overflow-hidden transition-all duration-300"
            onClick={onViewDetails}
          >
            <span className="relative z-10">Ver Detalles</span>
            <span className={`absolute inset-0 bg-[var(--color-dark-bg)]/5 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`} />
          </Button>
          
          <div className="relative flex-1">
            <Button 
              size="sm"
              className="w-full text-xs sm:text-sm relative overflow-hidden transition-all duration-300 bg-[var(--color-dark-hover)] hover:bg-[var(--color-dark-bg)] text-white"
              onClick={onConsultarClick}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="h-4 w-4 mr-1.5 text-white fill-current"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="relative z-10">Contactar</span>
            </Button>
            
            {/* Selector de concesionaria con AnimatePresence */}
            <AnimatePresence>
              {showConcesionarias && (
                <motion.div 
                  className="absolute bottom-full mb-2 bg-white shadow-xl rounded-lg border border-border z-30 overflow-hidden"
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ 
                    right: '0',
                    width: '280px',
                    maxWidth: '280px',
                    left: 'auto'
                  }}
                >
                  <div className="p-4">
                    <h4 className="font-bold text-center uppercase mb-3 text-sm">Selecciona una concesionaria</h4>
                    <div className="space-y-3">
                      {concesionarias.map((concesionaria) => (
                        <button
                          key={concesionaria.id}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-md flex items-center text-sm transition-colors"
                          onClick={() => onConcesionariaSelect(concesionaria.whatsapp)}
                        >
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#25D366] mr-3 flex-shrink-0">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              className="h-6 w-6 text-white fill-current"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{concesionaria.nombre}</div>
                            <div className="text-xs text-gray-500">{concesionaria.direccion}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}