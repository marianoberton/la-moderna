'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { User, getCurrentUser, hasRole } from '@/services/auth/authService';
import { Loader2, UserPlus, RefreshCw, AlertCircle, Check, Settings, Users, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

// Definición de la interfaz para usuarios del sistema
interface AdminUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  last_login?: string;
}

export default function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'viewer'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['admin'])) {
          toast.error('No tienes permisos para acceder a esta sección');
          router.push('/admin');
          return;
        }
        
        setCurrentUser(user);
        await fetchUsers();
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, name, last_login');
      
      if (error) throw error;
      
      setUsuarios(data || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setError(null);
    setSuccess(null);
    setIsCreating(true);
    
    try {
      // Validar campos
      if (!newUser.email || !newUser.password || !newUser.name) {
        setError('Todos los campos son obligatorios');
        return;
      }
      
      // 1. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // 2. Crear perfil del usuario
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
      setNewUser({ email: '', password: '', name: '', role: 'viewer' });
      await fetchUsers();
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      setError(error.message || 'Error al crear el usuario');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Configuración del Sistema</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
            <CardDescription>
              Ajustes generales del sistema y preferencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configura los ajustes generales del sistema, incluyendo preferencias de visualización y comportamiento.
            </p>
            <Button asChild>
              <Link href="/admin/configuracion/general">
                Configurar
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Administra usuarios y permisos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gestiona los usuarios del sistema, sus roles y permisos. También puedes corregir problemas con los perfiles.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/configuracion/usuarios">
                  Gestionar Usuarios
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/configuracion/fix-profiles">
                  Corregir Perfiles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de Datos
            </CardTitle>
            <CardDescription>
              Herramientas de base de datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Accede a herramientas de mantenimiento y gestión de la base de datos.
            </p>
            <Button variant="outline" asChild>
              <Link href="/admin/configuracion/database">
                Herramientas DB
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 