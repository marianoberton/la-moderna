'use client';

import { useState } from 'react';
import { DataTable } from './components/DataTable';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { VehicleForm } from './components/VehicleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Vehicle } from '@/types/vehicle';

export default function VehiculosAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const handleCreateVehicle = async (data: Omit<Vehicle, 'id'>) => {
    try {
      // Aquí irá la llamada a la API para crear el vehículo
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administración de Vehículos</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Vehículo</DialogTitle>
            </DialogHeader>
            <VehicleForm onSubmit={handleCreateVehicle} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable data={vehicles} />
    </div>
  );
} 