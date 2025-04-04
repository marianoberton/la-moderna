'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { User, getCurrentUser, hasRole } from '@/services/auth/authService';
import { Loader2, UserPlus, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Definición de la interfaz para usuarios del sistema
interface SystemUser extends User {
  last_login: string | null;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<SystemUser[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  });

  // Función para formatear fechas
  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const checkAccess = async () => {
      const user = await getCurrentUser();
      if (!user || !hasRole(user, 'admin')) {
        router.push('/admin');
        return;
      }
      setCurrentUser(user);
      fetchUsers();
    };
    checkAccess();
  }, [router]);

  // Función para cargar usuarios
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setUsuarios(profiles as SystemUser[]);
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para crear un nuevo usuario
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      setError('El email y la contraseña son requeridos');
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Crear el usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Crear el perfil del usuario
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
          });

        if (profileError) throw profileError;

        setSuccess('Usuario creado correctamente');
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'viewer'
        });
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      setError(error.message || 'Error al crear el usuario');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gestión de Usuarios</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Lista de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios del sistema</CardTitle>
            <CardDescription>
              Administra las cuentas de acceso al panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : usuarios.length > 0 ? (
                usuarios.map(usuario => (
                  <div key={usuario.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{usuario.name || 'Sin nombre'}</h3>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                        <div className="flex items-center mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            usuario.role === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : usuario.role === 'editor'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {usuario.role}
                          </span>
                          <span className="text-xs text-muted-foreground ml-3">
                            Último acceso: {formatDate(usuario.last_login)}
                          </span>
                        </div>
                      </div>
                      
                      {currentUser?.id !== usuario.id && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={currentUser?.id === usuario.id}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No hay usuarios registrados
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={fetchUsers}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </CardFooter>
        </Card>
        
        {/* Formulario de creación */}
        <Card>
          <CardHeader>
            <CardTitle>Crear nuevo usuario</CardTitle>
            <CardDescription>
              Agrega una nueva cuenta para acceder al panel
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nombre del usuario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <select 
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleCreateUser}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear usuario
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 