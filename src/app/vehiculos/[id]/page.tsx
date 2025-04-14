import VehiculoDetalleClient from './VehiculoDetalleClient';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

// Marcar como dinámica para asegurar que siempre busque datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Función para validar si un ID es un UUID válido
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Definir tipo para los parámetros
type Props = {
  params: {
    id: string;
  };
};

// Definir interfaces para los datos
interface VehiculoData {
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
}

interface Concesionaria {
  id: number;
  nombre: string;
  whatsapp: string;
  direccion: string;
}

// Generar metadatos dinámicos para compartir
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Obtener el ID correctamente
    const { id } = await params;
    
    // Crear cliente de Supabase
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Consultar el vehículo
    const { data } = await supabase
      .from('vehicles')
      .select('marca, modelo, version, precio, año, kilometraje, combustible, transmision, ubicacion, imagenes')
      .eq('id', id)
      .single();
    
    if (!data) {
      return {
        title: 'Vehículo no encontrado',
        description: 'El vehículo solicitado no se encuentra disponible.'
      };
    }
    
    // Formatear información del vehículo para metadatos
    const title = `${data.marca} ${data.modelo} ${data.version} - La Moderna`;
    const description = `${data.año} · ${data.kilometraje.toLocaleString()} km · ${data.combustible} · ${data.transmision} · Disponible en ${data.ubicacion}`;
    
    // Asegurar URLs absolutas para compartir correctamente en Open Graph
    // Utilizar URL completa del dominio actual o una URL predeterminada
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lamoderna.com.ar';
    
    // Asegurar que la imagen tenga URL absoluta
    let imageUrl;
    if (data.imagenes && data.imagenes.length > 0) {
      imageUrl = data.imagenes[0].startsWith('http') 
        ? data.imagenes[0] 
        : `${baseUrl}${data.imagenes[0].startsWith('/') ? '' : '/'}${data.imagenes[0]}`;
    } else {
      imageUrl = `${baseUrl}/images/default-car.jpg`;
    }
    
    const pageUrl = `${baseUrl}/vehiculos/${id}`;
    
    // Crear objeto de metadatos completo
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }],
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
      // Eliminar appId específico para evitar problemas de autenticación
      // y dejar que Facebook maneje la compartición de manera estándar
      other: {
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:type': 'website',
        'og:price:amount': data.precio ? data.precio.toString() : '',
        'og:price:currency': 'ARS',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Vehículo - La Moderna',
      description: 'Descubra nuestro catálogo de vehículos nuevos y usados.'
    };
  }
}

// Este es el componente de página de servidor (Server Component)
export default async function VehiculoDetallePage({ params }: Props) {
  // Obtener el ID correctamente
  const { id } = await params;
  let vehiculo: VehiculoData | null = null;
  let error: string | null = null;

  try {
    // Validar el formato del ID
    if (!isValidUUID(id)) {
      throw new Error(`ID de vehículo inválido: "${id}". Se esperaba un UUID.`);
    }

    // Crear cliente de Supabase en el servidor
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Consultar el vehículo por su ID
    const { data, error: supabaseError } = await supabase
      .from('vehicles')
      .select('*, selected_highlights')
      .eq('id', id)
      .single();
    
    if (supabaseError) {
      throw new Error(`Error al obtener el vehículo: ${supabaseError.message}`);
    }
    
    if (!data) {
      throw new Error('Vehículo no encontrado');
    }
    
    // Formatear los datos del vehículo
    vehiculo = {
      id: data.id,
      marca: data.marca || 'No especificado',
      modelo: data.modelo || 'No especificado',
      version: data.version || 'No especificado',
      precio: data.precio || 0,
      año: data.año || new Date().getFullYear(),
      km: data.kilometraje || 0,
      transmision: data.transmision || 'No especificado',
      combustible: data.combustible || 'No especificado',
      color: data.color || 'No especificado',
      puertas: data.puertas || 0,
      pasajeros: data.pasajeros || 0,
      ubicacion: data.ubicacion || 'No especificado',
      imagenes: data.imagenes || [],
      caracteristicas: data.caracteristicas || [],
      equipamiento: data.equipamiento || {},
      selected_highlights: data.selected_highlights || [],
      condicion: data.condicion || 'usado',
      descripcion: data.descripcion || '',
      tipo: data.tipo || 'sedan'
    };
  } catch (err: any) {
    console.error('Error al cargar el vehículo:', err);
    error = err.message;
    
    // Si hay un error, podemos mostrar un vehículo de fallback o manejar el error de otra forma
    vehiculo = {
      id: id || 'desconocido',
      marca: 'Error',
      modelo: 'No se pudo cargar',
      version: '',
      precio: 0,
      año: 0,
      km: 0,
      transmision: '',
      combustible: '',
      color: '',
      puertas: 0,
      pasajeros: 0,
      ubicacion: '',
      imagenes: [],
      caracteristicas: [],
      equipamiento: {},
      selected_highlights: [],
      condicion: 'usado',
      descripcion: error || 'No se pudo cargar el vehículo',
      tipo: 'sedan'
    };
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

  // Renderiza el componente de cliente y pasa los datos como props
  return <VehiculoDetalleClient vehiculo={vehiculo} concesionarias={concesionarias} errorMessage={error} />;
} 