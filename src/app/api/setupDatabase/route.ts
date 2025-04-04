import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Verificar que Supabase esté configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase no está configurado correctamente" },
        { status: 500 }
      );
    }
    
    // Obtener datos del body
    const body = await request.json();
    const { email, password, name } = body;
    
    // Validar datos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }
    
    // Crear la función RPC para crear la tabla profiles si no existe
    const createProfilesTableSQL = `
      CREATE OR REPLACE FUNCTION create_profiles_table()
      RETURNS void AS $$
      BEGIN
        -- Verificar si la tabla existe
        IF NOT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles'
        ) THEN
          -- Crear la tabla si no existe
          CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            name TEXT,
            role TEXT NOT NULL DEFAULT 'viewer',
            last_login TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Crear política de seguridad para la lectura
          CREATE POLICY "Los perfiles pueden ser leídos por usuarios autenticados"
            ON profiles FOR SELECT
            USING (auth.role() = 'authenticated');

          -- Crear política para la inserción (solo por el propietario o admin)
          CREATE POLICY "Los usuarios pueden insertar sus propios perfiles"
            ON profiles FOR INSERT
            WITH CHECK (auth.uid() = id OR EXISTS (
              SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
            ));

          -- Crear política para la actualización (solo por el propietario o admin)
          CREATE POLICY "Los usuarios pueden actualizar sus propios perfiles"
            ON profiles FOR UPDATE
            USING (auth.uid() = id OR EXISTS (
              SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
            ));

          -- Habilitar RLS en la tabla
          ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Ejecutar la creación de la función
    const { error: functionError } = await supabase.rpc('create_sql_function', {
      sql: createProfilesTableSQL
    });
    
    if (functionError) {
      return NextResponse.json(
        { error: `Error al crear la función: ${functionError.message}` },
        { status: 500 }
      );
    }
    
    // Crear la tabla profiles
    const { error: createTableError } = await supabase.rpc('create_profiles_table');
    
    if (createTableError) {
      return NextResponse.json(
        { error: `Error al crear la tabla: ${createTableError.message}` },
        { status: 500 }
      );
    }
    
    // Verificar si ya existen administradores
    const { data: existingAdmins, error: adminsError } = await supabase
      .from('profiles')
      .select('count')
      .eq('role', 'admin');
    
    if (adminsError && !adminsError.message.includes("does not exist")) {
      return NextResponse.json(
        { error: `Error al verificar administradores: ${adminsError.message}` },
        { status: 500 }
      );
    }
    
    // Si ya hay administradores, no crear uno nuevo
    if (!adminsError && existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { message: "El sistema ya está configurado", status: "configured" },
        { status: 200 }
      );
    }
    
    // Crear usuario administrador
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      return NextResponse.json(
        { error: `Error al crear usuario: ${authError.message}` },
        { status: 500 }
      );
    }
    
    // Crear perfil de administrador
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name: name || 'Administrador',
        role: 'admin'
      });
    
    if (profileError) {
      return NextResponse.json(
        { error: `Error al crear perfil: ${profileError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "Sistema configurado correctamente", status: "success" },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Error en la configuración:", error);
    
    return NextResponse.json(
      { error: `Error al configurar el sistema: ${error.message}` },
      { status: 500 }
    );
  }
} 