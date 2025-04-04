'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/services/auth/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Redireccionar al panel de administración
      router.push('/admin');
    } catch (err: any) {
      console.error('Error de autenticación:', err);
      // Traducir mensajes de error comunes de Supabase
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Por favor confirma tu correo electrónico antes de iniciar sesión');
      } else if (err.message?.includes('No tienes permisos')) {
        setError('No tienes permisos para acceder al panel de administración');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Panel de Administración</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold)]/90"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500">
            La Moderna © {new Date().getFullYear()} - Panel de Administración
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 