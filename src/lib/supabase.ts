import { createClient } from '@supabase/supabase-js';

// Verificación de variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si estás teniendo problemas con la clave anónima, puedes descomentar estas líneas
// y agregar la clave de service role a tu .env.local (solo para desarrollo)
// const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const useServiceRole = process.env.NODE_ENV === 'development' && serviceRoleKey;

// Verificar que las variables estén definidas para depuración
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables de entorno de Supabase no definidas:');
  console.error('URL:', supabaseUrl);
  console.error('ANON KEY existe:', !!supabaseAnonKey);
  
  // En el lado del cliente, esto ayudará a evitar errores de inicialización
  if (typeof window !== 'undefined') {
    throw new Error('Falta configuración de Supabase. Verifica tu archivo .env.local');
  }
}

console.log('Inicializando cliente Supabase con URL:', supabaseUrl?.substring(0, 20) + '...');

// Crear cliente con las variables disponibles
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
  // useServiceRole ? serviceRoleKey || '' : supabaseAnonKey || '' // Descomentar si usas service role
); 