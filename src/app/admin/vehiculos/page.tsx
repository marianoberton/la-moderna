'use client';

import { useState } from 'react';
import { DataTable } from './components/DataTable';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { VehicleForm } from './components/VehicleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Vehicle } from '@/types/vehicle';
import * as z from 'zod';

// Importar el esquema de Zod desde VehicleForm o redefinirlo aquí
const vehicleSchema = z.object({
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  version: z.string().min(1, "La versión es requerida"),
  año: z.number().min(1900).max(2024),
  precio: z.number().min(0),
  kilometraje: z.number().min(0),
  combustible: z.string(),
  transmision: z.string(),
  color: z.string(),
  puertas: z.number().min(2).max(5),
  condicion: z.enum(['0km', 'usado']),
  tipo: z.enum(['sedan', 'suv', 'pickup', 'hatchback', 'coupe', 'cabriolet']),
  descripcion: z.string(),
  caracteristicas: z.array(z.string()),
  imagenes: z.array(z.object({
    url: z.string(),
    principal: z.boolean()
  })),
  estado: z.enum(['activo', 'vendido', 'reservado'])
});

export default function VehiculosAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Actualizar la firma de esta función para que coincida con lo que espera VehicleForm
  const handleCreateVehicle = async (data: z.infer<typeof vehicleSchema>) => {
    try {
      // Aquí irá la llamada a la API para crear el vehículo
      console.log('Datos del vehículo:', data);
      
      // Crear un vehículo con los datos del formulario y añadir campos adicionales necesarios
      const newVehicle: Vehicle = {
        ...data,
        id: `temp-${Date.now()}`, // ID temporal
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Actualizar el estado local (esto sería reemplazado por la respuesta de la API)
      setVehicles([...vehicles, newVehicle]);
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