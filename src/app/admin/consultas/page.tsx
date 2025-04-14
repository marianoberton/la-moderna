'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, EyeOff, Check, Clock, X, Mail } from 'lucide-react';
import { getConsultas, marcarConsultaLeida, cambiarEstadoConsulta, Consulta } from '@/services/consultaService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Definir un evento personalizado para actualizar el contador de notificaciones
export const emitConsultasActualizadas = () => {
  const event = new CustomEvent('consultas-actualizadas');
  window.dispatchEvent(event);
};

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);

  // Cargar las consultas cuando se monta el componente
  useEffect(() => {
    loadConsultas();
  }, []);

  const loadConsultas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getConsultas();
      setConsultas(data);
    } catch (err: any) {
      console.error('Error al cargar consultas:', err);
      setError(err.message || 'Error al cargar consultas');
      toast.error('Error al cargar consultas');
    } finally {
      setIsLoading(false);
    }
  };

  // Marcar una consulta como leída
  const handleMarcarLeida = async (id: string) => {
    try {
      await marcarConsultaLeida(id);
      // Actualizar el estado local
      setConsultas(prevConsultas => 
        prevConsultas.map(c => c.id === id ? { ...c, leida: true } : c)
      );
      toast.success('Consulta marcada como leída');
      
      // Emitir evento para actualizar el contador de notificaciones
      emitConsultasActualizadas();
    } catch (err: any) {
      console.error('Error al marcar como leída:', err);
      toast.error('Error al marcar como leída: ' + err.message);
    }
  };

  // Cambiar el estado de una consulta
  const handleCambiarEstado = async (id: string, nuevoEstado: 'pendiente' | 'respondida' | 'cerrada') => {
    try {
      await cambiarEstadoConsulta(id, nuevoEstado);
      // Actualizar el estado local
      setConsultas(prevConsultas => 
        prevConsultas.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c)
      );
      toast.success(`Consulta marcada como ${nuevoEstado}`);
    } catch (err: any) {
      console.error('Error al cambiar estado:', err);
      toast.error('Error al cambiar estado: ' + err.message);
    }
  };

  // Función para marcar todas las consultas como leídas
  const handleMarcarTodasLeidas = async () => {
    try {
      const consultasNoLeidas = consultas.filter(c => !c.leida);
      if (consultasNoLeidas.length === 0) {
        toast.info('No hay consultas nuevas por leer');
        return;
      }

      setIsLoading(true);
      // Marcar cada consulta no leída como leída
      for (const consulta of consultasNoLeidas) {
        await marcarConsultaLeida(consulta.id);
      }

      // Actualizar estado local
      setConsultas(prevConsultas => 
        prevConsultas.map(c => ({ ...c, leida: true }))
      );

      toast.success(`${consultasNoLeidas.length} consultas marcadas como leídas`);
      
      // Emitir evento para actualizar el contador de notificaciones
      emitConsultasActualizadas();
    } catch (err: any) {
      console.error('Error al marcar todas como leídas:', err);
      toast.error('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar el badge del estado
  const renderEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pendiente</Badge>;
      case 'respondida':
        return <Badge variant="outline" className="border-green-500 text-green-600">Respondida</Badge>;
      case 'cerrada':
        return <Badge variant="outline" className="border-gray-500 text-gray-600">Cerrada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (err) {
      console.error('Error al formatear fecha:', err);
      return 'Fecha inválida';
    }
  };

  // Función para truncar texto largo
  const truncateText = (text: string, maxLength: number = 60): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Contar consultas no leídas
  const consultasNoLeidas = consultas.filter(c => !c.leida).length;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Consultas</h1>
          <Badge variant="secondary">{consultas.length}</Badge>
          {consultasNoLeidas > 0 && (
            <Badge variant="destructive">
              {consultasNoLeidas} nueva{consultasNoLeidas !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          {consultasNoLeidas > 0 && (
            <Button 
              variant="outline" 
              onClick={handleMarcarTodasLeidas} 
              disabled={isLoading}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Marcar todas como leídas
            </Button>
          )}
          <Button variant="outline" onClick={loadConsultas} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando consultas...</span>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
            <CardDescription className="text-red-700">No se pudieron cargar las consultas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button onClick={loadConsultas} variant="destructive" className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : consultas.length === 0 ? (
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>No hay consultas</CardTitle>
            <CardDescription>
              Aún no hay consultas registradas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Las consultas enviadas desde el formulario de contacto aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Estado</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultas.map((consulta) => (
                <TableRow 
                  key={consulta.id}
                  className={!consulta.leida ? "bg-muted/30" : ""} 
                >
                  <TableCell>
                    {renderEstadoBadge(consulta.estado)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {consulta.nombre}
                    {!consulta.leida && (
                      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                        Nueva
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${consulta.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {consulta.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {consulta.telefono ? (
                      <a href={`tel:${consulta.telefono}`} className="hover:underline">
                        {consulta.telefono}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="hover:bg-muted text-left font-normal justify-start px-2 h-auto"
                          onClick={() => setSelectedConsulta(consulta)}
                        >
                          <span className="truncate block max-w-[200px]">
                            {truncateText(consulta.mensaje)}
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Mensaje de {consulta.nombre}</DialogTitle>
                          <DialogDescription>
                            Enviado el {formatDate(consulta.fecha)} • {consulta.email}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
                          {consulta.mensaje}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{consulta.sucursal}</TableCell>
                  <TableCell>{formatDate(consulta.fecha)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!consulta.leida ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMarcarLeida(consulta.id)}
                          title="Marcar como leída"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled
                          title="Ya leída"
                        >
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}

                      {consulta.estado === 'pendiente' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCambiarEstado(consulta.id, 'respondida')}
                          title="Marcar como respondida"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      {consulta.estado === 'respondida' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCambiarEstado(consulta.id, 'cerrada')}
                          title="Marcar como cerrada"
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {consulta.estado === 'cerrada' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCambiarEstado(consulta.id, 'pendiente')}
                          title="Reabrir consulta"
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 