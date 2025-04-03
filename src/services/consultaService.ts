import { supabase } from '@/lib/supabase';

export interface Consulta {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  vehiculo?: string;
  mensaje: string;
  estado: 'pendiente' | 'respondida' | 'cerrada';
  fecha: Date | string;
  sucursal: string;
  leida: boolean;
}

// Verificar que Supabase esté disponible
const checkSupabaseConnection = async () => {
  // Si no tenemos las variables de entorno, no intentamos conectar
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase no está configurado. Faltan variables de entorno.");
  }
  
  try {
    // Prueba simple para verificar conexión
    const { error } = await supabase.from('consultas').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (err) {
    throw new Error("No se pudo conectar con la base de datos");
  }
};

// Obtener todas las consultas
export async function getConsultas(): Promise<Consulta[]> {
  try {
    await checkSupabaseConnection();
    
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener consultas:', error);
      throw new Error(`Error al obtener las consultas: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error general al obtener consultas:', error);
    throw error;
  }
}

// Obtener consultas no leídas
export async function getConsultasNoLeidas(): Promise<Consulta[]> {
  try {
    await checkSupabaseConnection();
    
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('leida', false)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener consultas no leídas:', error);
      throw new Error(`Error al obtener las consultas no leídas: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error general al obtener consultas no leídas:', error);
    throw error;
  }
}

// Crear una nueva consulta
export async function createConsulta(consulta: Omit<Consulta, 'id' | 'fecha' | 'estado' | 'leida'>): Promise<Consulta> {
  try {
    await checkSupabaseConnection();
    
    const now = new Date().toISOString();
    
    const consultaData = {
      ...consulta,
      fecha: now,
      estado: 'pendiente' as const,
      leida: false
    };

    const { data, error } = await supabase
      .from('consultas')
      .insert(consultaData)
      .select()
      .single();

    if (error) {
      console.error('Error al crear consulta:', error);
      throw new Error(`Error al crear la consulta: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error general al crear consulta:', error);
    throw error;
  }
}

// Marcar una consulta como leída
export async function marcarConsultaLeida(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('consultas')
      .update({ leida: true })
      .eq('id', id);

    if (error) {
      console.error('Error al marcar consulta como leída:', error);
      throw new Error(`Error al marcar la consulta como leída: ${error.message}`);
    }
  } catch (error) {
    console.error('Error general al marcar consulta como leída:', error);
    throw error;
  }
}

// Cambiar el estado de una consulta (pendiente, respondida, cerrada)
export async function cambiarEstadoConsulta(id: string, estado: 'pendiente' | 'respondida' | 'cerrada'): Promise<void> {
  try {
    const { error } = await supabase
      .from('consultas')
      .update({ estado })
      .eq('id', id);

    if (error) {
      console.error('Error al cambiar estado de consulta:', error);
      throw new Error(`Error al cambiar el estado de la consulta: ${error.message}`);
    }
  } catch (error) {
    console.error('Error general al cambiar estado de consulta:', error);
    throw error;
  }
}

// Contar las consultas pendientes
export async function contarConsultasPendientes(): Promise<number> {
  try {
    const { data, error, count } = await supabase
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'pendiente');

    if (error) {
      console.error('Error al contar consultas pendientes:', error);
      throw new Error(`Error al contar consultas pendientes: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Error general al contar consultas pendientes:', error);
    throw error;
  }
}

// Contar las consultas no leídas
export async function contarConsultasNoLeidas(): Promise<number> {
  try {
    const { data, error, count } = await supabase
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .eq('leida', false);

    if (error) {
      console.error('Error al contar consultas no leídas:', error);
      throw new Error(`Error al contar consultas no leídas: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Error general al contar consultas no leídas:', error);
    throw error;
  }
} 