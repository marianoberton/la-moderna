'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Loader2, AlertCircle, Check, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | React.ReactNode | null>(null);
  const [success, setSuccess] = useState<string | React.ReactNode | null>(null);
  const [admin, setAdmin] = useState({
    email: '',
    password: '',
    name: 'Administrador'
  });
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  // Add a useEffect to log the admin state when it changes
  useEffect(() => {
    console.log('🔍 Estado del formulario:', {
      email: admin.email,
      passwordLength: admin.password.length,
      isEmailEmpty: admin.email.trim() === '',
      isPasswordEmpty: admin.password.trim() === '',
      shouldBeDisabled: loading || admin.email.trim() === '' || admin.password.trim() === ''
    });
  }, [admin, loading]);

  // Función para reenviar el correo de confirmación
  const resendConfirmationEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: admin.email,
      });
      
      if (error) throw error;
      
      setSuccess('Se ha reenviado el correo de confirmación. Por favor, verifica tu bandeja de entrada.');
    } catch (error: any) {
      setError(`Error al reenviar el correo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validación del formulario
  const isValidEmail = (email: string) => {
    return email.trim() !== '' && email.includes('@');
  };

  const isValidPassword = (password: string) => {
    return password.trim() !== '' && password.length >= 6;
  };

  const isFormValid = isValidEmail(admin.email) && isValidPassword(admin.password);

  const setupDatabase = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1. Verificar que Supabase esté configurado
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase no está configurado correctamente');
      }
      
      // 2. Verificar si la tabla profiles ya existe
      const { error: tableCheckError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      // Si hay un error que no sea "relation doesn't exist", hay otro problema
      if (tableCheckError && !tableCheckError.message.includes("does not exist")) {
        throw new Error(`Error al verificar la base de datos: ${tableCheckError.message}`);
      }
      
      // 3. Crear usuario administrador
      if (!admin.email || !admin.password) {
        throw new Error('Email y contraseña son obligatorios');
      }
      
      // Crear usuario admin usando el método de registro normal
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          data: {
            name: admin.name,
            role: 'admin'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario administrador');
      }

      // Intentar iniciar sesión inmediatamente para verificar si el email ya está confirmado
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: admin.email,
        password: admin.password
      });

      if (signInError) {
        // Si hay un error de "Email not confirmed", necesitamos confirmar el email
        if (signInError.message.includes("Email not confirmed")) {
          // Intentar confirmar el email usando un método alternativo
          try {
            // Intentar usar la API REST directamente
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${authData.user.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
              },
              body: JSON.stringify({
                email_confirm: true
              })
            });

            if (!response.ok) {
              console.warn('No se pudo confirmar el email automáticamente');
              setEmailSent(true);
              setSuccess(
                <div>
                  <p className="font-medium">¡Usuario creado!</p>
                  <p className="mt-2">Se ha enviado un correo de verificación a {admin.email}.</p>
                  <p className="mt-2">Por favor, verifica tu correo electrónico antes de continuar.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={resendConfirmationEmail}
                    disabled={loading}
                  >
                    Reenviar correo de verificación
                  </Button>
                </div>
              );
              return;
            }
          } catch (error) {
            console.warn('Error al intentar confirmar el email:', error);
            setEmailSent(true);
            setSuccess(
              <div>
                <p className="font-medium">¡Usuario creado!</p>
                <p className="mt-2">Se ha enviado un correo de verificación a {admin.email}.</p>
                <p className="mt-2">Por favor, verifica tu correo electrónico antes de continuar.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={resendConfirmationEmail}
                  disabled={loading}
                >
                  Reenviar correo de verificación
                </Button>
              </div>
            );
            return;
          }
        } else {
          throw signInError;
        }
      } else {
        // Si no hay error, significa que el usuario ya está autenticado
        console.log('Usuario autenticado correctamente:', signInData);
        
        // Continuar con la creación de la tabla y el perfil
        // 4. Si la tabla no existe, intentamos crearla con una inserción
        if (tableCheckError && tableCheckError.message.includes("does not exist")) {
          try {
            // Intentar crear la tabla con una inserción
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                email: admin.email,
                name: admin.name,
                role: 'admin'
              });
            
            if (insertError) {
              // Si hay un error al insertar, podría ser porque la tabla no existe
              // En este caso, necesitamos crear la tabla manualmente en Supabase
              console.error('Error al insertar perfil:', insertError);
              setError(
                <div>
                  <p className="font-bold mb-2">No se pudo crear la tabla de perfiles automáticamente.</p>
                  <p className="mb-2">Por favor, sigue estos pasos:</p>
                  <ol className="list-decimal pl-5 mb-2">
                    <li>Accede al panel de administración de Supabase</li>
                    <li>Ve a la sección "SQL Editor"</li>
                    <li>Crea un nuevo query y pega el siguiente código SQL:</li>
                  </ol>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto mb-2">
                    {`CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Los perfiles pueden ser leídos por usuarios autenticados"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Los usuarios pueden insertar sus propios perfiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar sus propios perfiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);`}
                  </pre>
                  <p>4. Ejecuta el query y vuelve a intentar la configuración</p>
                </div>
              );
              return;
            }
            
            setSuccess(
              <div>
                <p className="font-medium">¡Configuración completada!</p>
                <p className="mt-2">Tu cuenta ha sido creada y verificada correctamente.</p>
              </div>
            );
          } catch (error: any) {
            console.error('Error al crear tabla de perfiles:', error);
            setError(error.message || 'Error al crear la tabla de perfiles');
            return;
          }
        } else {
          // Si la tabla ya existe, verificar si ya hay administradores
          const { data: existingAdmins, error: checkAdminsError } = await supabase
            .from('profiles')
            .select('count')
            .eq('role', 'admin');
          
          if (checkAdminsError) {
            throw new Error(`Error al verificar administradores: ${checkAdminsError.message}`);
          }
          
          // Si ya hay administradores, no crear uno nuevo
          if (existingAdmins && existingAdmins.length > 0) {
            setSuccess('El sistema ya está configurado. Redirigiendo al inicio de sesión...');
            setTimeout(() => {
              router.push('/auth/login');
            }, 2000);
            return;
          }
          
          // Crear perfil para el admin
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: admin.email,
              name: admin.name,
              role: 'admin'
            });
          
          if (profileError) throw profileError;
          
          setSuccess(
            <div>
              <p className="font-medium">¡Configuración completada!</p>
              <p className="mt-2">Tu cuenta ha sido creada y verificada correctamente.</p>
            </div>
          );
        }
        
        // Redireccionar al login después de 4 segundos para dar tiempo a leer el mensaje
        setTimeout(() => {
          router.push('/auth/login');
        }, 4000);
      }
      
    } catch (error: any) {
      console.error('Error en la configuración:', error);
      setError(error.message || 'Error al configurar el sistema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[500px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Configuración Inicial</CardTitle>
          <CardDescription className="text-center">
            Configura tu sistema por primera vez
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              {typeof error === 'string' ? (
                <p className="text-sm">{error}</p>
              ) : (
                <div className="text-sm">{error}</div>
              )}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4 flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5" />
              <p className="text-sm">{success}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Información importante</h3>
              <p className="text-sm text-blue-700">
                Esta configuración creará la estructura necesaria en la base de datos y un usuario administrador para acceder al sistema.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email de administrador</Label>
              <Input 
                id="email" 
                type="email"
                value={admin.email}
                onChange={e => {
                  const newValue = e.target.value;
                  setAdmin({...admin, email: newValue});
                }}
                placeholder="admin@ejemplo.com"
                disabled={loading}
                className={admin.email.trim() !== '' && !isValidEmail(admin.email) ? 'border-red-500' : ''}
              />
              {admin.email.trim() !== '' && !isValidEmail(admin.email) && (
                <p className="text-xs text-red-500">
                  Por favor, ingresa un email válido
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password"
                value={admin.password}
                onChange={e => {
                  const newValue = e.target.value;
                  setAdmin({...admin, password: newValue});
                }}
                placeholder="Contraseña segura"
                disabled={loading}
                className={admin.password.trim() !== '' && !isValidPassword(admin.password) ? 'border-red-500' : ''}
              />
              <div className="text-xs space-y-1">
                <p className={admin.password.trim() !== '' && admin.password.length < 6 ? 'text-red-500' : 'text-muted-foreground'}>
                  Mínimo 6 caracteres
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre (opcional)</Label>
              <Input 
                id="name" 
                value={admin.name}
                onChange={e => setAdmin({...admin, name: e.target.value})}
                placeholder="Nombre del administrador"
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            className="w-full"
            onClick={setupDatabase}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Configurar sistema
              </>
            )}
          </Button>
          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-2">
            Estado del botón: {loading ? 'Cargando' : (!isFormValid ? 'Deshabilitado' : 'Habilitado')}
            <br />
            Email válido: {isValidEmail(admin.email) ? 'Sí' : 'No'} | Contraseña válida: {isValidPassword(admin.password) ? 'Sí' : 'No'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 