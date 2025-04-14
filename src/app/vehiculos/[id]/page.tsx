import VehiculoDetalleClient from './VehiculoDetalleClient';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
// Eliminar la importación de Database
// import { Database } from '@/types/supabase';

// Marcar como dinámica para asegurar que siempre busque datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Función para validar si un ID es un UUID válido
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Definir tipo para los parámetros (Promise en Next.js 15)
type PageParams = {
  id: string;
};

// Usar un tipo inline en vez de la referencia a Database
type VehiculoDbRow = {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  precio?: number;
  año?: number;
  kilometraje?: number;
  combustible?: string;
  transmision?: string;
  color?: string;
  puertas?: number;
  pasajeros?: number;
  ubicacion?: string;
  imagenes?: string[];
  caracteristicas?: string[];
  equipamiento?: Record<string, boolean>;
  selected_highlights?: string[];
  condicion?: string;
  descripcion?: string;
  tipo?: string;
  created_at?: string;
  updated_at?: string;
};

// Interfaz para el componente cliente (asegúrate que coincida con la definición en VehiculoDetalleClient.tsx)
interface Vehiculo {
  id: string; // ID debe ser string (UUID)
  marca: string;
  modelo: string;
  version: string;
  precio: number;
  año: number;
  km: number; // Campo 'km' como espera el cliente
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

// Generar metadatos dinámicos para compartir
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  try {
    // Obtener el ID correctamente esperando la promesa
    const { id } = await params;
    
    // Validar UUID aquí también
    if (!isValidUUID(id)) {
      console.warn('Invalid UUID format in generateMetadata:', id);
      // Retornar metadatos genéricos si el ID no es válido
      return {
        title: 'Vehículo no válido - La Moderna',
        description: 'El ID del vehículo proporcionado no es válido.',
      };
    }
    
    // Crear cliente de Supabase (sin el tipo genérico Database)
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          persistSession: false // Recomendado para Server Components
        }
      }
    );
    
    // Consultar el vehículo seleccionando los campos necesarios
    const { data: rawData, error: queryError } = await supabase
      .from('vehicles')
      .select('marca, modelo, version, precio, año, kilometraje, combustible, transmision, ubicacion, imagenes') // Seleccionar solo los necesarios
      .eq('id', id)
      .single();

    // Manejar error de la consulta
    if (queryError) {
       console.error('Supabase query error in generateMetadata:', queryError);
       throw new Error(`Error al obtener datos del vehículo: ${queryError.message}`);
    }
    
    if (!rawData) {
      console.warn('Vehicle not found for metadata:', id);
      return {
        title: 'Vehículo no encontrado - La Moderna',
        description: 'El vehículo solicitado no se encuentra disponible.'
      };
    }
    
    // Casteamos explícitamente los datos para evitar errores de tipo
    const data = rawData as {
      marca?: string;
      modelo?: string;
      version?: string;
      precio?: number;
      año?: number;
      kilometraje?: number;
      combustible?: string;
      transmision?: string;
      ubicacion?: string;
      imagenes?: string[];
    };
    
    // Formatear información del vehículo para metadatos
    const title = `${data.marca || 'Vehículo'} ${data.modelo || ''} ${data.version || ''} - La Moderna`;
    const description = `${data.año || 'N/A'} · ${(data.kilometraje ?? 0).toLocaleString()} km · ${data.combustible || 'N/A'} · ${data.transmision || 'N/A'} · Disponible en ${data.ubicacion || 'N/A'}`;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lamoderna.com.ar';
    
    let imageUrl = `${baseUrl}/images/default-car.jpg`; // Default image
    if (data.imagenes && data.imagenes.length > 0 && data.imagenes[0]) {
      const firstImage = data.imagenes[0];
      imageUrl = firstImage.startsWith('http') 
        ? firstImage 
        : `${baseUrl}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`;
    }
    
    const pageUrl = `${baseUrl}/vehiculos/${id}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        type: 'website',
        locale: 'es_AR',
        siteName: 'La Moderna Automotores',
        url: pageUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      other: {
        'og:price:amount': data.precio ? data.precio.toString() : '',
        'og:price:currency': 'ARS',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Retornar metadatos genéricos en caso de error
    return {
      title: 'Detalle de Vehículo - La Moderna',
      description: 'Descubra nuestro catálogo de vehículos nuevos y usados en La Moderna Automotores.',
    };
  }
}

// Componente de página de servidor
export default async function VehiculoDetallePage({ params }: { params: Promise<PageParams> }) {
  let vehiculoClient: Vehiculo | null = null; // Tipo para el cliente
  let errorMessage: string | undefined = undefined;
  let id: string | null = null;

  try {
    // Obtener el ID correctamente esperando la promesa
     id = (await params).id;

    // Validar el formato del ID
    if (!isValidUUID(id)) {
      throw new Error(`ID de vehículo inválido: "${id}". Se esperaba un UUID válido.`);
    }

    // Crear cliente de Supabase en el servidor (sin el tipo genérico Database)
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          persistSession: false // Recomendado para Server Components
        }
      }
    );
    
    // Consultar el vehículo por su ID, seleccionando todos los campos
    const { data: vehicleRawData, error: supabaseError } = await supabase
      .from('vehicles')
      .select('*') // Seleccionar todo para mapear al cliente
      .eq('id', id)
      .single(); // Dejar que TS infiera el tipo
    
    if (supabaseError) {
      // No lanzar error si es "No rows found", eso lo manejamos después
      if (supabaseError.code !== 'PGRST116') {
        console.error('Supabase query error in page component:', supabaseError);
        throw new Error(`Error al obtener el vehículo: ${supabaseError.message}`);
      }
    }
    
    if (!vehicleRawData) {
      // Si no hay datos (o el error fue PGRST116), marcar como no encontrado
      errorMessage = 'Vehículo no encontrado. Es posible que el ID no exista o haya sido eliminado.';
    } else {
      // Casteamos los datos crudos a un tipo conocido para evitar errores de TS
      const vehicleDbData = vehicleRawData as VehiculoDbRow;
      
      // Mapear datos de Supabase (VehiculoDbRow) a la interfaz del cliente (Vehiculo)
      vehiculoClient = {
        id: vehicleDbData.id, // Mantener como string (UUID)
        marca: vehicleDbData.marca || 'No especificado',
        modelo: vehicleDbData.modelo || 'No especificado',
        version: vehicleDbData.version || 'No especificado',
        precio: vehicleDbData.precio ?? 0, // Usar ?? para manejar null/undefined
        año: vehicleDbData.año ?? new Date().getFullYear(),
        km: vehicleDbData.kilometraje ?? 0, // Mapear kilometraje a km
        transmision: vehicleDbData.transmision || 'No especificado',
        combustible: vehicleDbData.combustible || 'No especificado',
        color: vehicleDbData.color || 'No especificado',
        puertas: vehicleDbData.puertas ?? 0,
        pasajeros: vehicleDbData.pasajeros ?? 0,
        ubicacion: vehicleDbData.ubicacion || 'No especificado',
        imagenes: vehicleDbData.imagenes || [],
        caracteristicas: vehicleDbData.caracteristicas || [],
        // Asegurar que equipamiento sea un objeto vacío si es null/undefined
        equipamiento: vehicleDbData.equipamiento ? JSON.parse(JSON.stringify(vehicleDbData.equipamiento)) : {},
        selected_highlights: vehicleDbData.selected_highlights || [],
        condicion: vehicleDbData.condicion || 'usado',
        descripcion: vehicleDbData.descripcion || '',
        tipo: vehicleDbData.tipo || 'sedan'
      };
    }
  } catch (err: any) {
    console.error('Error critical loading vehicle page:', err);
    errorMessage = err.message || 'Ocurrió un error inesperado al cargar los detalles del vehículo.';
    
    // Dejar vehiculoClient como null si hay error crítico
    vehiculoClient = null;
  }

  const concesionarias: Concesionaria[] = [
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

  // Renderiza el componente de cliente SIEMPRE, pasando los datos o el mensaje de error
  // El componente cliente debe manejar el caso donde vehiculoClient es null
  return (
    <VehiculoDetalleClient
      vehiculo={vehiculoClient} // Pasar null si hubo error o no se encontró
      concesionarias={concesionarias} 
      errorMessage={errorMessage} 
    />
  );
} 