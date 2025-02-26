'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { 
  Calendar, 
  Fuel, 
  Cog,
  Gauge
} from 'lucide-react';

export default function UsedCars() {
  // Estado para controlar qué imagen se muestra en vehículos con múltiples fotos
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

  // Función para cambiar la imagen activa de un vehículo
  const changeActiveImage = (carId: number, index: number) => {
    setActiveImageIndex({
      ...activeImageIndex,
      [carId]: index
    });
  };

  // Función para obtener la imagen activa de un vehículo
  const getActiveImage = (car: any) => {
    if (!car.images || car.images.length === 0) {
      return car.image;
    }
    
    const index = activeImageIndex[car.id] || 0;
    return car.images[index];
  };

  const usedCars = [
    {
      id: 1,
      brand: 'VOLKSWAGEN',
      model: 'AMAROK',
      version: 'AMAROK 2.0 HIGHLINE 4X4 AT',
      year: 2020,
      km: 65000,
      price: 28500000,
      fuel: 'Diesel',
      transmission: 'Automática',
      color: 'Gris',
      image: '/images/Usado/amarok_usada.jpg'
    },
    {
      id: 2,
      brand: 'VOLKSWAGEN',
      model: 'AMAROK',
      version: 'AMAROK 2.0 COMFORTLINE 4X2 MT',
      year: 2019,
      km: 78000,
      price: 24900000,
      fuel: 'Diesel',
      transmission: 'Manual',
      color: 'Blanco',
      image: '/images/Usado/amarokusada.jpg'
    },
    {
      id: 3,
      brand: 'CHEVROLET',
      model: 'S10',
      version: 'S10 2.8 LTZ 4X4 CD TDCI',
      year: 2018,
      km: 92000,
      price: 22500000,
      fuel: 'Diesel',
      transmission: 'Manual',
      color: 'Blanco',
      image: '/images/Usado/Chevrolets10_usada.jpg'
    },
    {
      id: 4,
      brand: 'TOYOTA',
      model: 'COROLLA',
      version: 'COROLLA 1.8 XEI CVT',
      year: 2021,
      km: 35000,
      price: 19800000,
      fuel: 'Nafta',
      transmission: 'Automática CVT',
      color: 'Gris Plata',
      images: [
        '/images/Usado/corolla1.jpg',
        '/images/Usado/corolla2.jpg',
        '/images/Usado/corolla3.jpg'
      ]
    },
    {
      id: 5,
      brand: 'CHEVROLET',
      model: 'CRUZE',
      version: 'CRUZE 1.4 LTZ AT',
      year: 2019,
      km: 48000,
      price: 17500000,
      fuel: 'Nafta',
      transmission: 'Automática',
      color: 'Blanco',
      image: '/images/Usado/cruzeusado.jpg'
    },
    {
      id: 6,
      brand: 'RENAULT',
      model: 'DUSTER',
      version: 'DUSTER 1.6 DYNAMIQUE 4X2',
      year: 2020,
      km: 42000,
      price: 15900000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Gris Oscuro',
      image: '/images/Usado/duster.jpg'
    },
    {
      id: 7,
      brand: 'TOYOTA',
      model: 'ETIOS',
      version: 'ETIOS 1.5 XLS SEDAN',
      year: 2019,
      km: 55000,
      price: 13800000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Gris Plata',
      image: '/images/Usado/etios_usado.jpg'
    },
    {
      id: 8,
      brand: 'TOYOTA',
      model: 'ETIOS',
      version: 'ETIOS 1.5 XLS HATCHBACK',
      year: 2020,
      km: 38000,
      price: 14500000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Rojo',
      images: [
        '/images/Usado/etios1.jpg',
        '/images/Usado/etios2.jpg',
        '/images/Usado/etios3.jpg'
      ]
    },
    {
      id: 9,
      brand: 'VOLKSWAGEN',
      model: 'GOL TREND',
      version: 'GOL TREND 1.6 TRENDLINE',
      year: 2019,
      km: 62000,
      price: 11900000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Blanco',
      image: '/images/Usado/gol_trend_usado.jpg'
    },
    {
      id: 10,
      brand: 'VOLKSWAGEN',
      model: 'GOL TREND',
      version: 'GOL TREND 1.6 HIGHLINE',
      year: 2018,
      km: 75000,
      price: 10800000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Gris',
      image: '/images/Usado/gol_usado_2.jpg'
    },
    {
      id: 11,
      brand: 'VOLKSWAGEN',
      model: 'GOL TREND',
      version: 'GOL TREND 1.6 COMFORTLINE',
      year: 2017,
      km: 89000,
      price: 9500000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Rojo',
      image: '/images/Usado/gol_usado.jpg'
    },
    {
      id: 12,
      brand: 'VOLKSWAGEN',
      model: 'GOLF',
      version: 'GOLF 1.4 TSI HIGHLINE DSG',
      year: 2020,
      km: 42000,
      price: 21500000,
      fuel: 'Nafta',
      transmission: 'Automática DSG',
      color: 'Blanco',
      images: [
        '/images/Usado/golf1 (2).jpg',
        '/images/Usado/golf2 (2).jpg',
        '/images/Usado/golf3 (2).jpg'
      ]
    },
    {
      id: 13,
      brand: 'VOLKSWAGEN',
      model: 'GOLF',
      version: 'GOLF 1.4 TSI COMFORTLINE MT',
      year: 2019,
      km: 55000,
      price: 19800000,
      fuel: 'Nafta',
      transmission: 'Manual',
      color: 'Gris',
      images: [
        '/images/Usado/golf1.jpg',
        '/images/Usado/golf2.jpg',
        '/images/Usado/golf3.jpg'
      ]
    },
    {
      id: 14,
      brand: 'TOYOTA',
      model: 'HILUX',
      version: 'HILUX 2.8 SRX 4X4 AT',
      year: 2021,
      km: 48000,
      price: 32500000,
      fuel: 'Diesel',
      transmission: 'Automática',
      color: 'Blanco',
      images: [
        '/images/Usado/hilux1.jpg',
        '/images/Usado/hilux2.jpg',
        '/images/Usado/hilux3.jpg'
      ]
    },
    {
      id: 15,
      brand: 'FORD',
      model: 'RANGER',
      version: 'RANGER 3.2 LIMITED 4X4 AT',
      year: 2023,
      km: 25000,
      price: 35900000,
      fuel: 'Diesel',
      transmission: 'Automática',
      color: 'Gris',
      image: '/images/Usado/ranger2023_usada.jpg'
    },
    {
      id: 16,
      brand: 'CHEVROLET',
      model: 'S10',
      version: 'S10 2.8 HIGH COUNTRY 4X4 AT',
      year: 2020,
      km: 58000,
      price: 29800000,
      fuel: 'Diesel',
      transmission: 'Automática',
      color: 'Negro',
      image: '/images/Usado/s10_usada.jpg'
    },
    {
      id: 17,
      brand: 'VOLKSWAGEN',
      model: 'TAOS',
      version: 'TAOS 1.4 HIGHLINE DSG',
      year: 2022,
      km: 32000,
      price: 27500000,
      fuel: 'Nafta',
      transmission: 'Automática DSG',
      color: 'Blanco',
      image: '/images/Usado/taos_usada.jpg'
    },
    {
      id: 18,
      brand: 'CHEVROLET',
      model: 'TRACKER',
      version: 'TRACKER 1.2 PREMIER AT',
      year: 2021,
      km: 38000,
      price: 23900000,
      fuel: 'Nafta',
      transmission: 'Automática',
      color: 'Gris',
      image: '/images/Usado/tracker_usada.jpg'
    }
  ];

  // Función para formatear precio en pesos argentinos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Mostrar solo los primeros 8 vehículos en la página principal
  const displayedCars = usedCars.slice(0, 8);

  return (
    <div className="relative py-12">
      <div className="container">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Vehículos Usados Seleccionados</h2>
          <div className="h-0.5 w-20 bg-primary rounded-full mb-4"></div>
          <p className="text-muted-foreground text-center max-w-2xl">
            Descubre nuestra selección de vehículos usados certificados con garantía
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCars.map((car, index) => (
            <VehicleCard 
              key={car.id} 
              car={car} 
              index={index} 
              activeImage={activeImageIndex[car.id] || 0}
              onImageChange={(index) => changeActiveImage(car.id, index)}
              getActiveImage={() => getActiveImage(car)}
              formatPrice={formatPrice}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/vehiculos/usados" 
            className="inline-block py-3 px-8 bg-surface border border-primary text-primary font-bold rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Ver todos los usados ({usedCars.length})
          </Link>
        </div>
      </div>
    </div>
  );
}

interface VehicleCardProps {
  car: any;
  index: number;
  activeImage: number;
  onImageChange: (index: number) => void;
  getActiveImage: () => string;
  formatPrice: (price: number) => string;
}

function VehicleCard({ 
  car, 
  index, 
  activeImage, 
  onImageChange, 
  getActiveImage,
  formatPrice
}: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-lg overflow-hidden border border-border flex-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal con overlay y badge - Clicable */}
      <div 
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={() => window.location.href = `/vehiculos/usados/${car.id}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-100'}`}></div>
        <img 
          src={getActiveImage()} 
          alt={`${car.brand} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/320x208";
          }}
        />
        <Badge className="absolute top-3 left-3 z-20 bg-accent text-accent-foreground">
          Usado
        </Badge>
        
        {/* Año y kilometraje en la imagen */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between z-20">
          <span className="bg-black/70 text-white text-xs py-1 px-2 rounded">
            {car.year}
          </span>
          <span className="bg-black/70 text-white text-xs py-1 px-2 rounded">
            {car.km.toLocaleString()} km
          </span>
        </div>
        
        {/* Indicadores de imágenes múltiples */}
        {car.images && car.images.length > 1 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
            {car.images.map((_: string, index: number) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation(); // Evitar navegación al cambiar imagen
                  onImageChange(index);
                }}
                className={`w-2 h-2 rounded-full ${
                  activeImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Marca y modelo - Clicable */}
        <div 
          className="mb-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => window.location.href = `/vehiculos/usados/${car.id}`}
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
        
        {/* Características adicionales - visible solo en hover */}
        <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-3 w-3 mr-1 text-primary" />
              <span className="text-xs">{car.year}</span>
            </div>
            <div className="flex items-center text-sm">
              <Gauge className="h-3 w-3 mr-1 text-primary" />
              <span className="text-xs">{car.km.toLocaleString()} km</span>
            </div>
          </div>
        </div>
        
        {/* Precio y botones de acción */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Precio:</span>
            <span className="text-base font-bold text-primary">{formatPrice(car.price)}</span>
          </div>
          
          <Button 
            size="sm"
            variant="outline"
            className="relative overflow-hidden transition-all duration-300"
            onClick={() => window.location.href = `/vehiculos/usados/${car.id}`}
          >
            <span className="relative z-10">Ver Detalles</span>
            <span className={`absolute inset-0 bg-primary/5 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 