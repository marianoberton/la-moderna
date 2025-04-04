'use client';

import { useState, useEffect } from 'react';
import { DataTable } from './components/DataTable';
import { Button } from "@/components/ui/button";
import { Plus, Loader2, LayoutGrid, LayoutList } from 'lucide-react';
import { VehicleForm } from './components/VehicleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Vehicle } from '@/types/vehicle';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/services/vehicleService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { CardView } from './components/CardView';
import { FormWrapper } from './components/FormWrapper';

// Función para transformar un vehículo al formato del formulario
const vehicleToFormData = (vehicle: Vehicle) => {
  // Convertir características de string[] a formato estructurado
  const caracteristicasFormateadas = Array.isArray(vehicle.caracteristicas) 
    ? vehicle.caracteristicas.map(texto => ({
        texto,
        categoria: "Extras" as const // Por defecto todas las características van a la categoría "Extras"
      })) 
    : [];

  return {
    id: vehicle.id,
    version: vehicle.version || '',
    marca: vehicle.marca || '',
    modelo: vehicle.modelo || '',
    year: vehicle.año?.toString() || '',
    fuel: vehicle.combustible as "NAFTA" | "DIESEL" | "HÍBRIDO" | "ELÉCTRICO" | "GNC",
    transmission: vehicle.transmision as "MANUAL" | "AUTOMÁTICA",
    price: vehicle.precio?.toString() || '',
    description: vehicle.descripcion || '',
    km: vehicle.kilometraje?.toString() || '',
    passengers: vehicle.pasajeros?.toString() || '',
    doors: vehicle.puertas?.toString() || '',
    color: vehicle.color || '',
    location: vehicle.ubicacion || '',
    images: vehicle.imagenes || [],
    condition: vehicle.condicion === '0km' ? "NUEVO" : "USADO",
    vehicleType: vehicle.tipo || 'sedan',
    status: vehicle.estado === 'activo' ? "DISPONIBLE" : 
           vehicle.estado === 'vendido' ? "VENDIDO" : 
           vehicle.estado === 'en_pausa' ? "EN PAUSA" : "RESERVADO",
    caracteristicas: caracteristicasFormateadas,
    equipamiento: {
      aireAcondicionado: vehicle.equipamiento?.aireAcondicionado || false,
      direccionAsistida: vehicle.equipamiento?.direccionAsistida || false,
      vidriosElectricos: vehicle.equipamiento?.vidriosElectricos || false,
      tapiceriaCuero: vehicle.equipamiento?.tapiceriaCuero || false,
      cierreCentralizado: vehicle.equipamiento?.cierreCentralizado || false,
      alarma: vehicle.equipamiento?.alarma || false,
      airbags: vehicle.equipamiento?.airbags || false,
      bluetooth: vehicle.equipamiento?.bluetooth || false,
      controlCrucero: vehicle.equipamiento?.controlCrucero || false,
      techoSolar: vehicle.equipamiento?.techoSolar || false,
      llantasAleacion: vehicle.equipamiento?.llantasAleacion || false,
      traccion4x4: vehicle.equipamiento?.traccion4x4 || false,
      abs: vehicle.equipamiento?.abs || false,
      esp: vehicle.equipamiento?.esp || false,
      asistenteFrenado: vehicle.equipamiento?.asistenteFrenado || false,
      camaraReversa: vehicle.equipamiento?.camaraReversa || false,
      sensorEstacionamiento: vehicle.equipamiento?.sensorEstacionamiento || false,
      navegacionGPS: vehicle.equipamiento?.navegacionGPS || false,
      controlVoz: vehicle.equipamiento?.controlVoz || false,
      asientosElectricos: vehicle.equipamiento?.asientosElectricos || false,
      asientosCalefaccionados: vehicle.equipamiento?.asientosCalefaccionados || false,
      volanteCuero: vehicle.equipamiento?.volanteCuero || false,
      climatizador: vehicle.equipamiento?.climatizador || false,
    }
  };
};

export default function VehiculosAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Cargar vehículos al montar el componente
  useEffect(() => {
    async function loadVehicles() {
      try {
        setIsLoading(true);
        const vehiclesList = await getVehicles(false);
        setVehicles(vehiclesList);
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
        toast.error("No se pudieron cargar los vehículos");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadVehicles();
  }, []);

  // Verificar si hay un ID de vehículo para editar en la URL
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined' && !isLoading && vehicles.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get('edit');
      
      if (editId) {
        const vehicleToEdit = vehicles.find(v => v.id === editId);
        if (vehicleToEdit) {
          handleEditVehicle(vehicleToEdit);
          
          // Limpiar el parámetro de la URL para evitar abrir el diálogo nuevamente al recargar
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      }
    }
  }, [vehicles, isLoading]);

  // Crear un nuevo vehículo
  const handleCreateVehicle = async (formData: any) => {
    try {
      console.log('⭐ Iniciando proceso de creación de vehículo...');
      console.log('⭐ Datos recibidos del formulario:', {
        marca: formData.marca,
        modelo: formData.modelo,
        imagenes_length: formData.imagenes?.length
      });
      
      // Validación antes de enviar a servicio
      if (!formData.marca || !formData.modelo) {
        console.error('❌ Faltan datos marca/modelo');
        toast.error('Faltan datos fundamentales del vehículo');
        return null;
      }
      
      if (!Array.isArray(formData.imagenes) || formData.imagenes.length === 0) {
        console.error('❌ No hay imágenes');
        toast.error('Debe incluir al menos una imagen para el vehículo');
        return null;
      }
      
      // Test directo de conexión a Supabase antes de intentar crear
      try {
        console.log('⭐ Test directo de conexión a Supabase...');
        const { supabase } = await import('@/lib/supabase');
        
        // Importación para depuración
        console.log('⭐ URL de Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('⭐ Clave anónima definida:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        
        // Verificar tabla
        const { data: tableCheck, error: tableError } = await supabase
          .from('vehicles')
          .select('count')
          .limit(1);
          
        if (tableError) {
          console.error('❌ Error verificando tabla vehicles:', tableError);
          throw new Error(`Error de tabla: ${tableError.message}`);
        }
        
        console.log('✅ Tabla vehicles verificada');
      } catch (connectionError: any) {
        console.error('❌ Error de conexión a Supabase:', connectionError);
        toast.error(`Error de conexión: ${connectionError.message || 'Error desconocido'}`);
        return null;
      }
      
      console.log('⭐ Enviando datos al servicio createVehicle...');
      
      try {
        // Los datos ya están mapeados en VehicleForm.tsx
        const newVehicle = await createVehicle(formData);
        
        if (!newVehicle || !newVehicle.id) {
          throw new Error('No se recibió información del vehículo creado');
        }
        
        console.log('✅ Vehículo creado exitosamente:', newVehicle.id);
        
        // Actualizar estado local con el nuevo vehículo
        setVehicles([newVehicle, ...vehicles]);
        setIsDialogOpen(false);
        toast.success('Vehículo creado exitosamente');
        
        return newVehicle;
      } catch (serviceError: any) {
        console.error('❌ Error en servicio createVehicle:', serviceError);
        throw serviceError; // Re-lanzar para manejo en componente
      }
    } catch (error: any) {
      console.error('❌ Error completo al crear el vehículo:', error);
      
      // Mensaje personalizado basado en el tipo de error
      let message = 'Error al crear el vehículo';
      
      if (error.message?.includes('duplicate')) {
        message = 'Ya existe un vehículo con estas características';
      } else if (error.message?.includes('permission')) {
        message = 'No tienes permisos para crear vehículos';
      } else if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
        message = 'La tabla de vehículos no existe. Usa la opción "Configuración BD"';
      } else if (error.message) {
        message = `Error: ${error.message}`;
      }
      
      toast.error(message);
      return null;
    }
  };

  // Actualizar un vehículo existente
  const handleUpdateVehicle = async (data: any) => {
    if (!editingVehicle) return;
    
    try {
      const updatedVehicle = await updateVehicle(String(editingVehicle.id), data);
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

  // Actualizar rápidamente el estado de un vehículo
  const handleUpdateVehicleStatus = async (vehicleId: string, newStatus: 'activo' | 'vendido' | 'reservado' | 'en_pausa') => {
    try {
      console.log(`Actualizando estado del vehículo ${vehicleId} a: ${newStatus}`);
      const updatedVehicle = await updateVehicle(vehicleId, { estado: newStatus });
      
      // Si el estado actualizado es "vendido", quitarlo de esta vista
      if (newStatus === 'vendido') {
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
        toast.success(`Vehículo marcado como vendido y movido a la sección "Vendidos"`);
      } else {
        // De lo contrario, actualizar normalmente
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

  // Editar vehículo
  const handleEditVehicle = (vehicle: Vehicle) => {
    console.log("⭐ Abriendo editor para vehículo:", {
      id: vehicle.id,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      tipo: vehicle.tipo
    });
    
    // Asegurarnos de que estamos preparando correctamente los datos para el formulario
    const formData = {
      ...vehicleToFormData(vehicle),
      // Añadimos campos específicos para asegurar que se preserven los valores originales
      originalBrand: vehicle.marca || '',
      originalModel: vehicle.modelo || ''
    };

    console.log("📝 Datos preparados para formulario:", {
      marca: formData.marca,
      modelo: formData.modelo,
      originalBrand: formData.originalBrand,
      originalModel: formData.originalModel,
      vehicleType: formData.vehicleType
    });
    
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  // Confirmar la eliminación de un vehículo
  const confirmDeleteVehicle = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Función para cerrar el diálogo
  const handleDialogClose = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      setEditingVehicle(null);
    }
  };

  // Manejar el clic en el botón de nuevo vehículo
  const handleNewVehicleClick = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Administración de Vehículos</h1>
        </div>
        
        <div className="flex space-x-2">
          <div className="border rounded-md p-1 flex mr-2">
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
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingVehicle(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}</DialogTitle>
              </DialogHeader>
              <FormWrapper
                initialData={editingVehicle ? vehicleToFormData(editingVehicle) : {}}
                onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Link href="/admin/vendidos">
          <Button variant="outline">
            Ver Vendidos
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando vehículos...</span>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
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