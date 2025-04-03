'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2, 
  PlusCircle,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import Link from 'next/link';

export default function NuevosPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('condicion', '0km')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setVehicles(data);
        }
      } catch (error: any) {
        console.error('Error loading vehicles:', error);
        toast.error(`Error al cargar vehículos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este vehículo? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Vehículo eliminado correctamente');
      
      // Update local state
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast.error(`Error al eliminar vehículo: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Vehículos Nuevos</h1>
        <Button asChild>
          <Link href="/admin/vehiculos/agregar?condicion=NUEVO">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Vehículo Nuevo
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listado de Vehículos Nuevos</CardTitle>
          <CardDescription>
            Gestiona todos los vehículos nuevos (0km) disponibles en tu inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marca/Modelo</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Destacado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      {vehicle.marca} {vehicle.modelo}
                    </TableCell>
                    <TableCell>{vehicle.version}</TableCell>
                    <TableCell>{vehicle.año}</TableCell>
                    <TableCell>
                      ${vehicle.precio.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : vehicle.estado === 'vendido'
                          ? 'bg-red-100 text-red-800'
                          : vehicle.estado === 'reservado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.estado === 'activo' ? 'Disponible' : 
                         vehicle.estado === 'vendido' ? 'Vendido' : 
                         vehicle.estado === 'reservado' ? 'Reservado' : 'En Pausa'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {vehicle.featured ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          <span className="mr-1">★</span> Destacado
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          asChild
                        >
                          <Link href={`/admin/vehiculos/editar/${vehicle.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {vehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay vehículos nuevos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Total: {vehicles.length} vehículos nuevos
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 