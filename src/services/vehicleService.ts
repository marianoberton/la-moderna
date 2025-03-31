import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types/vehicle';

// Obtener todos los vehículos
export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw new Error('Error al obtener los vehículos');
  }

  return data || [];
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
export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
  const now = new Date();
  
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      ...vehicle,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating vehicle:', error);
    throw new Error('Error al crear el vehículo');
  }

  return data;
}

// Actualizar un vehículo existente
export async function updateVehicle(id: string, vehicle: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Vehicle> {
  const now = new Date();
  
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      ...vehicle,
      updatedAt: now.toISOString()
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
  const filename = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from('vehicle-images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error al subir la imagen');
  }

  // Obtener la URL pública de la imagen
  const { data: publicUrl } = supabase
    .storage
    .from('vehicle-images')
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
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