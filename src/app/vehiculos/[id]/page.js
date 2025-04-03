import VehiculoDetalleClient from './VehiculoDetalleClient';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Marcar como dinámica para asegurar que siempre busque datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Función para validar si un ID es un UUID válido
function isValidUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Este es el componente de página de servidor (Server Component)
export default async function VehiculoDetallePage({ params }) {
  // Await params before accessing id
  const { id } = await params;
  let vehiculo = null;
  let error = null;

  try {
    // Validar el formato del ID
    if (!isValidUUID(id)) {
      throw new Error(`ID de vehículo inválido: "${id}". Se esperaba un UUID.`);
    }

    // Crear cliente de Supabase en el servidor
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
  } catch (err) {
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

  // Renderiza el componente de cliente y pasa los datos como props
  return <VehiculoDetalleClient vehiculo={vehiculo} concesionarias={concesionarias} errorMessage={error} />;
} 