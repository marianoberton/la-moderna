'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '../vehiculos/components/DataTable';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, LayoutGrid, LayoutList } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { getVehicles, updateVehicle, deleteVehicle } from '@/services/vehicleService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { CardView } from '../vehiculos/components/CardView';

export default function VehiculosVendidos() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Cargar solo vehículos vendidos al montar el componente
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        
        // Establecer un tiempo máximo de espera para la carga
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Tiempo de espera excedido al cargar los vehículos'));
          }, 10000); // 10 segundos de timeout
        });
        
        // Importar supabase directamente para obtener TODOS los vehículos sin filtros
        const { supabase } = await import('@/lib/supabase');
        
        // Obtener todos los vehículos sin filtro
        const { data: allVehicles, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('estado', 'vendido') // Filtrar específicamente por estado vendido
          .order('created_at', { ascending: false });
        
        // Limpiar el timeout si la carga fue exitosa
        clearTimeout(timeoutId);
        
        if (error) {
          console.error("Error al cargar vehículos vendidos:", error);
          throw error;
        }
        
        if (isMounted) {
          console.log(`Vehículos vendidos encontrados: ${allVehicles?.length || 0}`);
          
          if (allVehicles && allVehicles.length > 0) {
            setVehicles(allVehicles);
          } else {
            console.log("No se encontraron vehículos vendidos");
            setVehicles([]);
          }
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        if (isMounted) {
          console.error('Error al cargar los vehículos vendidos:', error);
          
          if (error.message?.includes('Tiempo de espera excedido')) {
            toast.error('La carga está tomando más tiempo del esperado. Intente actualizar la página.');
          } else {
            toast.error('No se pudieron cargar los vehículos vendidos');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadVehicles();
    
    // Limpieza al desmontar el componente
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Actualizar rápidamente el estado de un vehículo
  const handleUpdateVehicleStatus = async (vehicleId: string, newStatus: 'activo' | 'vendido' | 'reservado' | 'en_pausa') => {
    try {
      console.log(`Actualizando estado del vehículo ${vehicleId} a: ${newStatus}`);
      const updatedVehicle = await updateVehicle(vehicleId, { estado: newStatus });
      
      if (newStatus !== 'vendido') {
        // Si cambia a un estado distinto de vendido, quitarlo de esta vista
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
        toast.success(`Vehículo actualizado y movido a la sección principal`);
      } else {
        // Si sigue siendo vendido, actualizar en la lista
        setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
        toast.success(`Estado actualizado a: ${newStatus}`);
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado del vehículo');
    }
  };

  // Eliminar un vehículo
  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    
    try {
      await deleteVehicle(vehicleToDelete);
      setVehicles(vehicles.filter(v => v.id !== vehicleToDelete));
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      toast.success('Vehículo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      toast.error('Error al eliminar el vehículo');
    }
  };

  // Redirigir a la edición completa
  const handleEditVehicle = (vehicle: Vehicle) => {
    // Redirigir a la página de edición principal
    window.location.href = `/admin/vehiculos?edit=${vehicle.id}`;
  };

  // Confirmar la eliminación de un vehículo
  const confirmDeleteVehicle = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/vehiculos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Vehículos Vendidos</h1>
        </div>

        <div className="border rounded-md p-1 flex">
          <Button 
            variant={viewMode === 'table' ? 'default' : 'ghost'} 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('table')}
            title="Vista de tabla"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'ghost'} 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('cards')}
            title="Vista de tarjetas"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando vehículos vendidos...</span>
        </div>
      ) : (
        <>
          {vehicles.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-muted-foreground text-lg">No se encontraron vehículos vendidos</p>
              <p className="text-sm text-gray-500 mt-2">
                Para marcar un vehículo como vendido, vaya a la lista principal de vehículos
                y cambie su estado a "Vendido" usando el menú de acciones.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/admin/vehiculos'} 
                className="mt-4"
              >
                Ir a vehículos
              </Button>
            </div>
          ) : (
            viewMode === 'table' ? (
              <DataTable 
                data={vehicles}
                onEdit={handleEditVehicle}
                onDelete={confirmDeleteVehicle}
                onUpdateStatus={handleUpdateVehicleStatus}
              />
            ) : (
              <CardView
                data={vehicles}
                onEdit={handleEditVehicle}
                onDelete={confirmDeleteVehicle}
                onUpdateStatus={handleUpdateVehicleStatus}
              />
            )
          )}
        </>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este vehículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El vehículo será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVehicle} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 