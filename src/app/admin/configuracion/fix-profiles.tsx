'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertCircle, Check, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function FixProfilesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    usersWithoutProfiles: number;
    invalidRoles: number;
    duplicateProfiles: number;
    fixedProfiles: number;
  } | null>(null);

  const checkProfiles = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setStats(null);

    try {
      // 1. Verificar si hay usuarios en auth.users que no tienen perfiles
      const { data: usersWithoutProfiles, error: usersError } = await supabase
        .from('auth.users')
        .select('id, email')
        .not('id', 'in', (await supabase.from('profiles').select('id')).data?.map(p => p.id) || []);

      if (usersError) {
        console.error('Error al verificar usuarios sin perfiles:', usersError);
        // Continuar con las otras verificaciones
      }

      // 2. Verificar si hay perfiles con roles inválidos
      const { data: invalidRoles, error: rolesError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .not('role', 'in', ['admin', 'editor', 'viewer']);

      if (rolesError) {
        console.error('Error al verificar roles inválidos:', rolesError);
      }

      // 3. Verificar si hay perfiles duplicados
      const { data: duplicateProfiles, error: duplicatesError } = await supabase
        .rpc('get_duplicate_profiles');

      if (duplicatesError) {
        console.error('Error al verificar perfiles duplicados:', duplicatesError);
      }

      setStats({
        usersWithoutProfiles: usersWithoutProfiles?.length || 0,
        invalidRoles: invalidRoles?.length || 0,
        duplicateProfiles: duplicateProfiles?.length || 0,
        fixedProfiles: 0
      });

      setSuccess('Verificación completada. Haz clic en "Corregir perfiles" para aplicar las correcciones.');
    } catch (error: any) {
      console.error('Error al verificar perfiles:', error);
      setError(error.message || 'Error al verificar los perfiles');
    } finally {
      setLoading(false);
    }
  };

  const fixProfiles = async () => {
    if (!stats) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let fixedCount = 0;

      // 1. Crear perfiles para usuarios que no los tienen
      if (stats.usersWithoutProfiles > 0) {
        const { data: users, error: usersError } = await supabase
          .from('auth.users')
          .select('id, email, raw_user_meta_data')
          .not('id', 'in', (await supabase.from('profiles').select('id')).data?.map(p => p.id) || []);

        if (!usersError && users) {
          for (const user of users) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                name: user.raw_user_meta_data?.name || 'Usuario',
                role: user.raw_user_meta_data?.role || 'viewer'
              });

            if (!insertError) fixedCount++;
          }
        }
      }

      // 2. Corregir roles inválidos
      if (stats.invalidRoles > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'viewer' })
          .not('role', 'in', ['admin', 'editor', 'viewer']);

        if (!updateError) fixedCount += stats.invalidRoles;
      }

      // 3. Eliminar perfiles duplicados
      if (stats.duplicateProfiles > 0) {
        const { error: deleteError } = await supabase
          .rpc('delete_duplicate_profiles');

        if (!deleteError) fixedCount += stats.duplicateProfiles;
      }

      setStats({
        ...stats,
        fixedProfiles: fixedCount
      });

      setSuccess(`Se corrigieron ${fixedCount} perfiles correctamente.`);
    } catch (error: any) {
      console.error('Error al corregir perfiles:', error);
      setError(error.message || 'Error al corregir los perfiles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Corregir Perfiles de Usuario</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Verificar y corregir perfiles</CardTitle>
          <CardDescription>
            Esta herramienta verifica y corrige problemas comunes con los perfiles de usuario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4 flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5" />
              <p className="text-sm">{success}</p>
            </div>
          )}
          
          {stats && (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium">Resultados de la verificación:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Usuarios sin perfiles: {stats.usersWithoutProfiles}</li>
                <li>Perfiles con roles inválidos: {stats.invalidRoles}</li>
                <li>Perfiles duplicados: {stats.duplicateProfiles}</li>
                {stats.fixedProfiles > 0 && (
                  <li className="font-medium text-green-600">
                    Perfiles corregidos: {stats.fixedProfiles}
                  </li>
                )}
              </ul>
            </div>
          )}
          
          <div className="flex gap-4">
            <Button 
              onClick={checkProfiles}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Verificar perfiles
                </>
              )}
            </Button>
            
            {stats && (
              <Button 
                onClick={fixProfiles}
                disabled={loading || (stats.usersWithoutProfiles === 0 && stats.invalidRoles === 0 && stats.duplicateProfiles === 0)}
                variant="outline"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Corrigiendo...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Corregir perfiles
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
          <CardDescription>
            Sigue estos pasos para corregir los perfiles de usuario:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Haz clic en "Verificar perfiles" para identificar problemas.</li>
            <li>Revisa los resultados de la verificación.</li>
            <li>Si se encontraron problemas, haz clic en "Corregir perfiles" para solucionarlos.</li>
            <li>Verifica nuevamente para confirmar que los problemas se han resuelto.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
} 