'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { 
  Calendar, 
  Fuel, 
  Cog, 
  Gauge,
  Users,
  PaintBucket,
  DoorOpen,
  MapPin,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

// Tipos de datos
interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  precio: number;
  año: number;
  km: number;
  transmision: string;
  combustible: string;
  color: string;
  puertas: number;
  pasajeros: number;
  ubicacion: string;
  imagenes: string[];
  caracteristicas: string[];
}

interface Concesionaria {
  id: number;
  nombre: string;
  whatsapp: string;
  direccion: string;
}

interface VehiculoDetalleClientProps {
  vehiculo: Vehiculo;
  concesionarias: Concesionaria[];
}

export default function VehiculoDetalleClient({ vehiculo, concesionarias }: VehiculoDetalleClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showConcesionarias, setShowConcesionarias] = useState(false);

  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(precio);
  };

  const openWhatsApp = (whatsapp: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en el vehículo: ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (showConcesionarias) {
        setShowConcesionarias(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showConcesionarias]);

  const nextImage = () => {
    setActiveImageIndex((prev) => 
      prev + 1 >= vehiculo.imagenes.length ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => 
      prev - 1 < 0 ? vehiculo.imagenes.length - 1 : prev - 1
    );
  };

  const shareVehicle = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version}`,
        text: `Mira este ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version} del año ${vehiculo.año}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Enlace copiado al portapapeles'))
        .catch((err) => console.error('Error al copiar: ', err));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        <div className="relative h-[60vh] bg-black">
          <motion.img
            key={activeImageIndex}
            src={vehiculo.imagenes[activeImageIndex]}
            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
            className="w-full h-full object-contain" // Changed from object-cover to object-contain
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Siguiente</span>
          </Button>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="container mx-auto">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {vehiculo.imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 
                      ${index === activeImageIndex ? 'border-accent' : 'border-transparent'}`}
                  >
                    <img
                      src={imagen}
                      alt={`${vehiculo.marca} ${vehiculo.modelo} - Vista ${index + 1}`}
                      className="w-full h-full object-contain bg-black" // Added bg-black for better visibility
                    />
                  </button>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAllPhotos(true)}
                  className="flex-shrink-0"
                >
                  Ver todas las fotos
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
            {vehiculo.imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeImageIndex === index ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 -mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-card shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">
                        {vehiculo.marca} <span className="text-primary">{vehiculo.modelo}</span>
                      </h1>
                      <p className="text-lg text-muted-foreground">{vehiculo.version}</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      {vehiculo.km === 0 ? 'Nuevo' : 'Usado'}
                    </Badge>
                  </div>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="flex flex-col items-center text-center">
                      <Calendar className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Año</span>
                      <span className="font-medium">{vehiculo.año}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Gauge className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Kilometraje</span>
                      <span className="font-medium">{vehiculo.km.toLocaleString()} km</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Fuel className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Combustible</span>
                      <span className="font-medium">{vehiculo.combustible}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Cog className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Transmisión</span>
                      <span className="font-medium">{vehiculo.transmision}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="flex flex-col items-center text-center">
                      <Users className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Pasajeros</span>
                      <span className="font-medium">{vehiculo.pasajeros}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <PaintBucket className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Color</span>
                      <span className="font-medium">{vehiculo.color}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <DoorOpen className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Puertas</span>
                      <span className="font-medium">{vehiculo.puertas}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <MapPin className="h-6 w-6 text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Ubicación</span>
                      <span className="font-medium">{vehiculo.ubicacion}</span>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div>
                    <h2 className="text-xl font-bold mb-4">Características</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vehiculo.caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                          <span className="text-sm">{caracteristica}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-card shadow-lg sticky top-4">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-sm text-muted-foreground">Precio:</span>
                    <div className="text-3xl font-bold text-primary">
                      {formatPrecio(vehiculo.precio)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <Button 
                        className="w-full relative overflow-hidden transition-all duration-300" 
                        size="lg"
                        onClick={() => setShowConcesionarias(!showConcesionarias)}
                      >
                        <span className="relative z-10">Contactar vendedor</span>
                        <span className="absolute inset-0 bg-primary/10 transform transition-transform duration-300 translate-y-full hover:translate-y-0" />
                      </Button>
                      <AnimatePresence>
                        {showConcesionarias && (
                          <motion.div 
                            className="absolute right-0 top-full mt-2 w-full bg-card shadow-lg rounded-lg border border-border z-30 overflow-hidden"
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 20, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-3">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Selecciona una concesionaria</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => setShowConcesionarias(false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {concesionarias.map((concesionaria) => (
                                  <button
                                    key={concesionaria.id}
                                    className="w-full text-left p-3 hover:bg-muted rounded flex items-center text-sm transition-colors"
                                    onClick={() => {
                                      openWhatsApp(concesionaria.whatsapp);
                                      setShowConcesionarias(false);
                                    }}
                                  >
                                    <div>
                                      <div className="font-medium">{concesionaria.nombre}</div>
                                      <div className="text-xs text-muted-foreground">{concesionaria.direccion}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full relative overflow-hidden transition-all duration-300" 
                      size="lg"
                      onClick={() => openWhatsApp(concesionarias[0].whatsapp)}
                    >
                      <span className="relative z-10">WhatsApp</span>
                      <span className="absolute inset-0 bg-green-500/10 transform transition-transform duration-300 translate-y-full hover:translate-y-0" />
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full relative overflow-hidden transition-all duration-300"
                        onClick={shareVehicle}
                      >
                        <span className="relative z-10 flex items-center">
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartir
                        </span>
                        <span className="absolute inset-0 bg-blue-500/10 transform transition-transform duration-300 translate-y-full hover:translate-y-0" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <AnimatePresence>
              {showAllPhotos && (
                <motion.div 
                  className="fixed inset-0 bg-black z-50 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-black/80 backdrop-blur-sm">
                    <h2 className="text-white font-bold text-xl">
                      {vehiculo.marca} {vehiculo.modelo} - Galería
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setShowAllPhotos(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehiculo.imagenes.map((imagen, index) => (
                        <motion.div 
                          key={index}
                          className="aspect-video relative rounded-lg overflow-hidden bg-black" // Added bg-black
                        >
                          <img 
                            src={imagen} 
                            alt={`${vehiculo.marca} ${vehiculo.modelo} - Imagen ${index + 1}`}
                            className="w-full h-full object-contain" // Changed from object-cover to object-contain
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
} 