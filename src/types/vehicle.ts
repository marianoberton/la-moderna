export interface Vehicle {
  id: string | number;
  marca: string;
  modelo: string;
  version: string;
  año?: number;
  precio?: number;
  kilometraje?: number;
  combustible?: string;
  transmision?: string;
  color?: string;
  puertas?: number;
  pasajeros?: number;
  ubicacion?: string;
  condicion?: string;
  tipo?: 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'coupe' | 'cabriolet';
  descripcion?: string;
  financiacion?: boolean;
  permuta?: boolean;
  caracteristicas?: string[];
  equipamiento?: {
    aireAcondicionado?: boolean;
    direccionAsistida?: boolean;
    vidriosElectricos?: boolean;
    tapiceriaCuero?: boolean;
    cierreCentralizado?: boolean;
    alarma?: boolean;
    airbags?: boolean;
    bluetooth?: boolean;
    controlCrucero?: boolean;
    techoSolar?: boolean;
    llantasAleacion?: boolean;
    traccion4x4?: boolean;
    abs?: boolean;
    esp?: boolean;
    asistenteFrenado?: boolean;
    camaraReversa?: boolean;
    sensorEstacionamiento?: boolean;
    navegacionGPS?: boolean;
    controlVoz?: boolean;
    asientosElectricos?: boolean;
    asientosCalefaccionados?: boolean;
    volanteCuero?: boolean;
    climatizador?: boolean;
    [key: string]: boolean | undefined;
  };
  imagenes?: string[];
  estado?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  is_featured?: boolean;
  featured?: boolean;
}

// Extiende el tipo Vehicle para incluir propiedades específicas de los vehículos destacados
export interface VehicleWithFeatured extends Vehicle {
  // Almacena el valor original de featured para controlar cambios
  originalFeatured: boolean;
  // El valor actual que puede ser modificado en la interfaz
  featured: boolean;
} 