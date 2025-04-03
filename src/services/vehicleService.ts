import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types/vehicle';

// Verificar la conexión a Supabase
let isSupabaseInitialized = false;

async function checkSupabaseConnection() {
  if (isSupabaseInitialized) return true;
  
  try {
    // Intentar una consulta simple para verificar la conexión
    const { data, error } = await supabase
      .from('vehicles')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('Error al verificar la conexión con Supabase:', error);
      return false;
    }
    
    isSupabaseInitialized = true;
    console.log('Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error general al verificar conexión con Supabase:', error);
    return false;
  }
}

// Obtener todos los vehículos
export const getVehicles = async (onlyActive = true): Promise<any[]> => {
  try {
    await checkSupabaseConnection();

    // Consulta base de Supabase
    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Aplicar filtros según el parámetro onlyActive
    if (onlyActive) {
      // Para la vista pública, solo mostrar vehículos activos
      query = query.eq('estado', 'activo');
    } else {
      // Para el panel admin, mostrar todos excepto vendidos
      query = query.neq('estado', 'vendido');
    }
    
    // Ejecutar la consulta
    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener vehículos:", error);
      return [];
    }

    // Debug - contar estados
    const estadosCounts: Record<string, number> = {};
    data.forEach(vehicle => {
      const estado = vehicle.estado || 'sin_estado';
      estadosCounts[estado] = (estadosCounts[estado] || 0) + 1;
    });
    
    console.log(`Encontrados ${data.length} vehículos. Filtro: ${onlyActive ? 'solo activos' : 'todos excepto vendidos'}. Estados:`, estadosCounts);

    return data || [];
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    return [];
  }
}

// Obtener un vehículo por ID
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vehicle:', error);
    throw new Error('Error al obtener el vehículo');
  }

  return data;
}

// Crear un nuevo vehículo
export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> {
  try {
    console.log('Datos a enviar a Supabase:', {
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      imagenes_length: vehicle.imagenes?.length || 0,
      full_data: JSON.stringify(vehicle)
    });
    
    // Validación de datos antes de enviar
    if (!vehicle.marca || !vehicle.modelo) {
      throw new Error('Faltan datos básicos del vehículo (marca, modelo)');
    }
    
    // Asegurarnos de que las imágenes sean un array
    if (!Array.isArray(vehicle.imagenes)) {
      console.error('Error: imagenes no es un array:', vehicle.imagenes);
      throw new Error('Las imágenes deben ser un array');
    }
    
    // Convertir arrays a formato PostgreSQL si es necesario
    // Asegurarse de que caracteristicas e imagenes sean arrays
    const caracteristicas = Array.isArray(vehicle.caracteristicas) 
      ? vehicle.caracteristicas 
      : [];
      
    const imagenes = Array.isArray(vehicle.imagenes) 
      ? vehicle.imagenes 
      : [];
    
    // Asegurar que equipamiento sea un objeto
    const equipamiento = vehicle.equipamiento || {};
    
    // Fecha actual para created_at y updated_at
    const now = new Date().toISOString();
    
    // Crear objeto con estructura validada
    const vehicleData = {
      ...vehicle,
      caracteristicas,
      imagenes,
      equipamiento,
      created_at: now,
      updated_at: now
    };
    
    console.log('Iniciando inserción en Supabase con la tabla "vehicles"...');
    
    // Intento de insercción separado para detectar errores específicos
    const result = await supabase
      .from('vehicles')
      .insert(vehicleData);
      
    // Verificar si hay error antes de pedir el registro
    if (result.error) {
      console.error('Error al insertar en vehicles:', JSON.stringify(result.error));
      throw new Error(`Error al crear el vehículo: ${result.error.message} (${result.error.code})`);
    }
    
    console.log('Inserción exitosa, buscando registro creado...');
    
    // Obtener el vehículo recién creado
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error al obtener el vehículo creado:', JSON.stringify(error));
      throw new Error(`Vehículo creado pero no se pudo recuperar: ${error.message}`);
    }

    if (!data) {
      throw new Error('No se recibieron datos del vehículo creado');
    }

    console.log('Vehículo creado exitosamente con ID:', data.id);
    return data;
  } catch (error) {
    console.error('Error general al crear vehículo:', error);
    throw error;
  }
}

// Actualizar un vehículo existente
export async function updateVehicle(id: string, vehicle: Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>): Promise<Vehicle> {
  const now = new Date();
  
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      ...vehicle,
      updated_at: now.toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle:', error);
    throw new Error('Error al actualizar el vehículo');
  }

  return data;
}

// Eliminar un vehículo
export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw new Error('Error al eliminar el vehículo');
  }
}

// Subir una imagen a Supabase Storage
export async function uploadImage(file: File): Promise<string> {
  try {
    console.log('Iniciando carga de imagen:', file.name, 'tamaño:', file.size);
    
    // En lugar de verificar el bucket (que requiere permisos especiales),
    // intentamos directamente la carga
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    console.log('Subiendo archivo con nombre:', filename);
    
    const { data, error } = await supabase
      .storage
      .from('vehicle-images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error detallado al subir imagen:', JSON.stringify(error));
      
      // Si el error es de bucket no encontrado, proporcionar mensaje más claro
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        throw new Error(`El bucket 'vehicle-images' no existe o no tienes acceso. Verifica en Supabase Storage.`);
      }
      
      throw new Error(`Error al subir la imagen: ${error.message}`);
    }

    if (!data || !data.path) {
      throw new Error('La carga fue exitosa pero no se recibieron datos de la imagen');
    }

    console.log('Imagen subida exitosamente, obteniendo URL pública');
    
    // Obtener la URL pública de la imagen
    const { data: publicUrl } = supabase
      .storage
      .from('vehicle-images')
      .getPublicUrl(data.path);

    console.log('URL pública obtenida:', publicUrl.publicUrl);
    
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error en proceso de carga:', error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
}

// Eliminar una imagen de Supabase Storage
export async function deleteImage(url: string): Promise<void> {
  // Extraer el nombre del archivo de la URL
  const filename = url.split('/').pop();
  
  if (!filename) {
    throw new Error('No se pudo extraer el nombre del archivo');
  }
  
  const { error } = await supabase
    .storage
    .from('vehicle-images')
    .remove([filename]);

  if (error) {
    console.error('Error deleting image:', error);
    throw new Error('Error al eliminar la imagen');
  }
}

// Obtener estadísticas de vehículos
export async function getVehicleStats(): Promise<any> {
  try {
    await checkSupabaseConnection();
    
    // Total de vehículos
    const { data: totalVehicles, error: totalError } = await supabase
      .from('vehicles')
      .select('count');
    
    // Vehículos vendidos
    const { data: soldVehicles, error: soldError } = await supabase
      .from('vehicles')
      .select('count')
      .eq('estado', 'vendido');
    
    // Vehículos activos
    const { data: activeVehicles, error: activeError } = await supabase
      .from('vehicles')
      .select('count')
      .eq('estado', 'activo');
    
    // Nuevos vehículos este mes
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { data: newVehicles, error: newError } = await supabase
      .from('vehicles')
      .select('count')
      .gte('created_at', firstDayOfMonth.toISOString());
    
    if (totalError || soldError || activeError || newError) {
      console.error('Error al obtener estadísticas de vehículos');
      return {
        total: 0,
        sold: 0,
        active: 0,
        new: 0
      };
    }
    
    return {
      total: totalVehicles ? totalVehicles[0].count : 0,
      sold: soldVehicles ? soldVehicles[0].count : 0,
      active: activeVehicles ? activeVehicles[0].count : 0,
      new: newVehicles ? newVehicles[0].count : 0
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de vehículos:', error);
    return {
      total: 0,
      sold: 0,
      active: 0,
      new: 0
    };
  }
} 