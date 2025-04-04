import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  name?: string;
  last_login?: string;
}

// Iniciar sesión con email y contraseña
export async function signIn(email: string, password: string) {
  try {
    // Verificamos la conexión a Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase no está configurado correctamente');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error al iniciar sesión:', error.message);
      throw new Error(error.message);
    }

    // Obtener información de rol del usuario desde la tabla 'profiles'
    let profileData: { role: string; name?: string } | null = null;
    const { data: profileResult, error: profileError } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', data.user.id)
      .single();

    // Si no se encuentra el perfil, intentamos crearlo
    if (profileError) {
      console.warn('No se encontró el perfil del usuario, intentando crearlo:', profileError.message);
      
      // Intentar crear un perfil básico para el usuario
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || 'Usuario',
          role: 'viewer' // Rol por defecto
        });
      
      if (createProfileError) {
        console.error('Error al crear el perfil:', createProfileError.message);
        // Si no podemos crear el perfil, cerramos la sesión
        await supabase.auth.signOut();
        throw new Error('No se pudo crear la información del usuario');
      }
      
      // Intentar obtener el perfil nuevamente
      const { data: newProfileData, error: newProfileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', data.user.id)
        .single();
      
      if (newProfileError) {
        console.error('Error al obtener el perfil después de crearlo:', newProfileError.message);
        await supabase.auth.signOut();
        throw new Error('No se pudo obtener la información del usuario');
      }
      
      // Usar el nuevo perfil
      profileData = newProfileData;
    } else {
      profileData = profileResult;
    }

    // Verificar que el usuario tenga un rol válido para acceder al admin
    if (!profileData || !profileData.role || !['admin', 'editor', 'viewer'].includes(profileData.role)) {
      await supabase.auth.signOut();
      throw new Error('No tienes permisos para acceder al panel de administración');
    }

    // Actualizar la fecha de último inicio de sesión
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    // Construir objeto de usuario con la información combinada
    const user: User = {
      id: data.user.id,
      email: data.user.email || '',
      role: profileData.role as 'admin' | 'editor' | 'viewer',
      name: profileData.name,
      last_login: new Date().toISOString()
    };

    return { user, session: data.session };
  } catch (error: any) {
    console.error('Error en la autenticación:', error.message);
    throw error;
  }
}

// Cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

// Obtener el usuario actual
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Obtener el rol y nombre del usuario desde la tabla de perfiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error('Error al obtener el perfil:', profileError.message);
      
      // Intentar crear un perfil básico para el usuario
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'Usuario',
          role: 'viewer' // Rol por defecto
        });
      
      if (createProfileError) {
        console.error('Error al crear el perfil:', createProfileError.message);
        return null;
      }
      
      // Intentar obtener el perfil nuevamente
      const { data: newProfileData, error: newProfileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', user.id)
        .single();
      
      if (newProfileError || !newProfileData) {
        console.error('Error al obtener el perfil después de crearlo:', newProfileError?.message);
        return null;
      }
      
      return {
        id: user.id,
        email: user.email || '',
        role: newProfileData.role || 'viewer',
        name: newProfileData.name,
      };
    }
    
    return {
      id: user.id,
      email: user.email || '',
      role: profileData.role || 'viewer',
      name: profileData.name,
    };
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return null;
  }
}

// Función para verificar si el usuario tiene un rol específico
export function hasRole(user: User | null, roles: ('admin' | 'editor' | 'viewer')[]) {
  if (!user) return false;
  return roles.includes(user.role);
} 