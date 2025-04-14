'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  Map
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
  equipamiento: Record<string, boolean>;
  selected_highlights: string[];
  condicion: string;
  descripcion: string;
  tipo: string;
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
  errorMessage?: string;
}

// Update Facebook SDK interface
interface FacebookSDK {
  ui: (params: any) => void;
  init: (params: {
    appId: string;
    xfbml: boolean;
    version: string;
  }) => void;
}

// Add global Window interface extension
declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export default function VehiculoDetalleClient({ vehiculo, concesionarias, errorMessage }: VehiculoDetalleClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showConcesionarias, setShowConcesionarias] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">No se pudo cargar el vehículo</h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage}
            </p>
            <Button asChild>
              <Link href="/vehiculos">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver a listado de vehículos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    setShowShareOptions(!showShareOptions);
  };

  const shareToWhatsApp = () => {
    // Create a rich message with vehicle details
    const vehicleDetails = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version}`;
    const vehiclePrice = vehiculo.km === 0 ? 'Consultar precio' : `$${vehiculo.precio.toLocaleString()}`;
    const vehicleSpecs = `Año: ${vehiculo.año} | ${vehiculo.km.toLocaleString()} km | ${formatText(vehiculo.combustible)} | ${formatText(vehiculo.transmision)}`;
    const vehicleLocation = `Ubicación: ${formatText(vehiculo.ubicacion)}`;
    
    const message = encodeURIComponent(
      `¡Mira este vehículo! ✨\n\n*${vehicleDetails}*\n${vehiclePrice}\n${vehicleSpecs}\n${vehicleLocation}\n\nVer más detalles: ${window.location.href}`
    );
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareToFacebook = () => {
    // Simplemente abrir la URL de Facebook con un enlace directo
    window.open('https://www.facebook.com/share.php?u=' + encodeURIComponent(window.location.href), '_blank');
    setShowShareOptions(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 3000);
        setShowShareOptions(false);
      })
      .catch((err) => console.error('Error al copiar: ', err));
  };

  // Función para obtener la concesionaria según la ubicación
  const getConcesionariaByUbicacion = () => {
    const ubicacion = vehiculo.ubicacion.toLowerCase();
    return concesionarias.find(c => {
      if (ubicacion === 'trenque lauquen') {
        return c.nombre.toLowerCase().includes('t. lauquen');
      } else if (ubicacion === 'pehuajo') {
        return c.nombre.toLowerCase().includes('pehuajo');
      }
      return false;
    });
  };

  const concesionariaActual = getConcesionariaByUbicacion();

  // Asegurarnos de que la descripción se muestre correctamente
  const descripcionEjemplo = `¡Excelente oportunidad! Presentamos esta ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version} en impecable estado.

Este vehículo se destaca por su excelente mantenimiento y cuidado. Cuenta con service oficiales al día y documentación completa lista para transferir.

Características destacadas:
- Interior en perfecto estado
- Cubiertas con más del 80% de vida útil
- Service recién realizado
- Único dueño
- Todos los servicios realizados en concesionario oficial

No dudes en contactarnos para coordinar una visita y conocer esta unidad personalmente. ¡Te esperamos!

Aceptamos permutas y todas las formas de pago. Financiación disponible.`;

  // Usar la descripción del vehículo o la de ejemplo si no existe
  const descripcionMostrada = vehiculo.descripcion || descripcionEjemplo;

  const formatText = (text: string): string => {
    // Casos especiales de nombres propios compuestos
    const specialCases: Record<string, string> = {
      'trenque lauquen': 'Trenque Lauquen',
      'pehuajo': 'Pehuajo'
    };

    // Convertir a minúsculas para la comparación
    const lowerText = text.toLowerCase();
    
    // Si es un caso especial, retornar el valor predefinido
    if (specialCases[lowerText]) {
      return specialCases[lowerText];
    }

    // Para otros casos, capitalizar la primera letra
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatEquipamientoText = (text: string): string => {
    // Primero separamos por letras mayúsculas
    const words = text.replace(/([A-Z])/g, ' $1').trim().split(' ');
    // Luego capitalizamos cada palabra
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // Función para truncar el texto y agregar puntos suspensivos
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      <div className="min-h-screen bg-background py-4 lg:py-8">
        {/* Mensaje de confirmación de copia */}
        <AnimatePresence>
          {showCopyMessage && (
            <motion.div 
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">Enlace copiado</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="container mx-auto px-0 lg:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Galería de imágenes y acciones */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-[4/3] lg:aspect-square rounded-none lg:rounded-lg overflow-hidden">
                <motion.img
                  key={activeImageIndex}
                  src={vehiculo.imagenes[activeImageIndex]}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/40 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg z-10 bg-background/40 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Mobile share button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 bottom-4 rounded-full shadow-md hover:shadow-lg z-10 bg-background/40 backdrop-blur-sm block lg:hidden w-10 h-10 p-0 flex items-center justify-center border-0"
                  onClick={shareVehicle}
                >
                  <Share2 className="h-4 w-4 transform -translate-x-[1px]" />
                </Button>

                {/* Share options popup */}
                {showShareOptions && (
                  <div className="absolute right-4 bottom-16 z-20 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-neutral-200 dark:border-neutral-800 block lg:hidden">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start gap-2 px-3 text-[#25D366] hover:bg-[#25D366]/10"
                        onClick={() => {
                          shareToWhatsApp();
                          setShowShareOptions(false);
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          className="h-5 w-5 fill-current"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start gap-2 px-3 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        onClick={() => {
                          shareToFacebook();
                          setShowShareOptions(false);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5 fill-current"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start gap-2 px-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                        onClick={() => {
                          copyToClipboard();
                          setShowShareOptions(false);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5 fill-none stroke-current"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copiar link
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Miniaturas con scroll horizontal */}
              <div className="relative px-4 lg:px-0">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-accent lg:scrollbar-track-muted">
                  {vehiculo.imagenes.map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 lg:w-20 aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300
                        ${index === activeImageIndex ? 'border-accent scale-105' : 'border-transparent hover:border-accent/50'}`}
                    >
                      <img
                        src={imagen}
                        alt={`${vehiculo.marca} ${vehiculo.modelo} - Vista ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                {vehiculo.imagenes.length > 5 && (
                  <>
                    <div className="absolute left-4 lg:left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                    <div className="absolute right-4 lg:right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                  </>
                )}
              </div>

              {/* Contacto - Moved below for mobile, keeping original position for desktop */}
              <div className="lg:block hidden">
                {concesionariaActual && (
                  <div className="bg-card border rounded-lg p-6 mt-6">
                    <h3 className="font-semibold mb-4">CONTACTO</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{concesionariaActual.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{concesionariaActual.direccion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="default" 
                          className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white h-10"
                          onClick={() => openWhatsApp(concesionariaActual.whatsapp)}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            className="h-4 w-4 mr-2 fill-current"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full h-10"
                          onClick={() => window.open(`tel:${concesionariaActual.whatsapp}`, '_blank')}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Ficha del vehículo */}
            <div>
              <div className="bg-card shadow-none lg:shadow-lg rounded-none lg:rounded-lg">
                <div className="p-4 lg:p-6 mx-4 lg:mx-0">
                  {/* Encabezado */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-xl lg:text-2xl font-bold uppercase">
                        {vehiculo.marca} {vehiculo.modelo}
                      </h1>
                      <p className="text-muted-foreground mt-1">{vehiculo.version}</p>
                    </div>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {vehiculo.km === 0 ? 'Nuevo' : 'Usado'}
                    </Badge>
                  </div>

                  {/* Precio con fondo */}
                  <div className="mt-4 lg:mt-6 bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Precio</p>
                    {vehiculo.km === 0 ? (
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl lg:text-3xl font-bold text-primary">Consultar</h2>
                        <Button 
                          variant="default" 
                          className="bg-[#25D366] hover:bg-[#20BA5C] text-white"
                          onClick={() => openWhatsApp(concesionariaActual?.whatsapp || '')}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            className="h-4 w-4 mr-2 fill-current"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </Button>
                      </div>
                    ) : (
                      <h2 className="text-2xl lg:text-3xl font-bold text-primary">$ {vehiculo.precio.toLocaleString()}</h2>
                    )}
                  </div>

                  {/* Grid de características principales */}
                  <div className="grid grid-cols-2 gap-4 lg:gap-6 mt-6 lg:mt-8">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      <div>
                        <p className="text-sm text-muted-foreground">Año</p>
                        <p className="font-medium">{vehiculo.año}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Gauge className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      <div>
                        <p className="text-sm text-muted-foreground">Kilometraje</p>
                        <p className="font-medium">{vehiculo.km.toLocaleString()} km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Fuel className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      <div>
                        <p className="text-sm text-muted-foreground">Combustible</p>
                        <p className="font-medium">{formatText(vehiculo.combustible)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img 
                        src="/manual-transmission.svg"
                        alt="Transmisión"
                        className="h-5 w-5 text-neutral-700 dark:text-neutral-300"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">Transmisión</p>
                        <p className="font-medium">{formatText(vehiculo.transmision)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                      <div>
                        <p className="text-sm text-muted-foreground">Disponible en</p>
                        <p className="font-medium">{formatText(vehiculo.ubicacion)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Equipamiento */}
                  {vehiculo.equipamiento && Object.keys(vehiculo.equipamiento).length > 0 && (
                    <div className="bg-card border-0 lg:border rounded-none lg:rounded-lg p-4 lg:p-6 mt-4 lg:mt-6 -mx-4 lg:mx-0">
                      <h3 className="font-semibold mb-3 lg:mb-4">EQUIPAMIENTO</h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {Object.entries(vehiculo.equipamiento).map(([key, value]) => (
                          value && (
                            <div key={key} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--color-dark-bg)]" />
                              <span className="text-sm">{formatEquipamientoText(key)}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Descripción */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                    <div className="bg-card rounded-lg p-4 overflow-hidden">
                      <div className="whitespace-pre-wrap break-words w-full">
                        {isDescriptionExpanded 
                          ? descripcionMostrada
                          : truncateText(descripcionMostrada, 300)}
                      </div>
                      {descripcionMostrada.length > 300 && (
                        <Button
                          variant="link"
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="mt-2 p-0 h-auto font-medium hover:no-underline"
                        >
                          {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Mobile contact section - visible only on mobile */}
                  <div className="block lg:hidden mt-8">
                    {concesionariaActual && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">CONTACTO</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{concesionariaActual.nombre}</h4>
                            <p className="text-sm text-muted-foreground">{concesionariaActual.direccion}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              variant="default" 
                              className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white h-12"
                              onClick={() => openWhatsApp(concesionariaActual.whatsapp)}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                className="h-4 w-4 mr-2 fill-current"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              WhatsApp
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full h-12"
                              onClick={() => window.open(`tel:${concesionariaActual.whatsapp}`, '_blank')}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Llamar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compartir - solo visible en desktop */}
                  <div className="mt-6 lg:mt-8 bg-muted/50 rounded-lg p-4 lg:p-6 hidden lg:block">
                    <div className="flex items-center gap-2 mb-4">
                      <Share2 className="h-4 w-4" />
                      <h3 className="font-semibold text-sm">COMPARTIR</h3>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-background hover:bg-[#25D366] hover:border-[#25D366] transition-colors text-[#25D366] hover:text-white h-10"
                        onClick={shareToWhatsApp}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          className="h-4 w-4 mr-2 fill-current"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-background hover:bg-[#1877F2] hover:border-[#1877F2] transition-colors text-[#1877F2] hover:text-white h-10"
                        onClick={shareToFacebook}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 mr-2 fill-current"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-background hover:bg-neutral-700 hover:border-neutral-700 transition-colors text-neutral-700 hover:text-white h-10"
                        onClick={copyToClipboard}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 mr-2 fill-none stroke-current"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copiar link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de todas las fotos */}
      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-7xl">
          <DialogTitle className="sr-only">Galería de fotos</DialogTitle>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={() => setShowAllPhotos(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehiculo.imagenes.map((imagen, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={imagen}
                    alt={`${vehiculo.marca} ${vehiculo.modelo} - Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 