'use client';

import { useState, useEffect } from 'react';
import { DataTable } from './components/DataTable';
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import { VehicleForm } from './components/VehicleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Vehicle } from '@/types/vehicle';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/services/vehicleService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function VehiculosAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // Cargar vehículos al montar el componente
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error('Error al cargar los vehículos:', error);
        toast.error('No se pudieron cargar los vehículos');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVehicles();
  }, []);

  // Crear un nuevo vehículo
  const handleCreateVehicle = async (data: any) => {
    try {
      const newVehicle = await createVehicle(data);
      setVehicles([newVehicle, ...vehicles]);
      setIsDialogOpen(false);
      toast.success('Vehículo creado exitosamente');
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
      toast.error('Error al crear el vehículo');
      throw error; // Propagar el error para que el formulario lo maneje
    }
  };

  // Actualizar un vehículo existente
  const handleUpdateVehicle = async (data: any) => {
    if (!editingVehicle) return;
    
    try {
      const updatedVehicle = await updateVehicle(editingVehicle.id, data);
      setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
      setIsDialogOpen(false);
      setEditingVehicle(null);
      toast.success('Vehículo actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      toast.error('Error al actualizar el vehículo');
      throw error;
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

  // Iniciar la edición de un vehículo
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  // Confirmar la eliminación de un vehículo
  const confirmDeleteVehicle = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Cerrar el diálogo y reiniciar estados
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingVehicle(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administración de Vehículos</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVehicle(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}</DialogTitle>
            </DialogHeader>
            <VehicleForm 
              initialData={editingVehicle || undefined}
              onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando vehículos...</span>
        </div>
      ) : (
        <DataTable 
          data={vehicles}
          onEdit={handleEditVehicle}
          onDelete={confirmDeleteVehicle}
        />
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