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
  // Solo mostrar mensaje de error, no interrumpir la compilación
  console.warn('Variables de entorno de Supabase no definidas:');
  console.warn('URL:', supabaseUrl);
  console.warn('ANON KEY existe:', !!supabaseAnonKey);
  
  // Solo lanzar error en el cliente durante desarrollo
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.error('Falta configuración de Supabase. Verifica tu archivo .env.local');
  }
}

// Crear cliente con las variables disponibles, incluso si son undefined o vacías
// Esto permite que la compilación avance, el error real ocurrirá solo al usar el cliente
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
  // useServiceRole ? serviceRoleKey || '' : supabaseAnonKey || '' // Descomentar si usas service role
); 