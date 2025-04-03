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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, StarOff, Save, Loader2, Sparkles, Clock, Car, Edit, Check, X } from "lucide-react";
import { toast } from "sonner";
import { VehicleWithFeatured } from "@/types/vehicle";
import ClientImage from '@/app/components/ClientImage';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Extender el tipo VehicleWithFeatured para incluir las características destacadas seleccionadas
interface ExtendedVehicleWithFeatured extends VehicleWithFeatured {
  selectedHighlights?: string[];
  originalSelectedHighlights?: string[];
}

export default function VehiculosDestacados() {
  const [vehicles, setVehicles] = useState<ExtendedVehicleWithFeatured[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<ExtendedVehicleWithFeatured[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [editingHighlightsForId, setEditingHighlightsForId] = useState<string | number | null>(null);
  const [tempSelectedHighlights, setTempSelectedHighlights] = useState<string[]>([]);

  // Función para cargar vehículos
  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      
      // Importación dinámica de supabase
      const { supabase } = await import('@/lib/supabase');
      
      // Consulta para obtener todos los vehículos excepto vendidos
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .neq('estado', 'vendido')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al cargar vehículos:', error);
        toast.error(`Error al cargar vehículos: ${error.message}`);
        return;
      }
      
      // Transformar los datos para adaptarlos a la interfaz ExtendedVehicleWithFeatured
      const transformedVehicles = data.map((vehicle) => ({
        ...vehicle,
        originalFeatured: vehicle.is_featured || false, // Guardamos el valor original
        featured: vehicle.is_featured || false, // Valor que se modificará en la UI
        selectedHighlights: vehicle.selected_highlights || [], // Características destacadas seleccionadas
        originalSelectedHighlights: vehicle.selected_highlights || [] // Valor original para comparar cambios
      }));
      
      setVehicles(transformedVehicles);
      
      // Inicializamos los vehículos seleccionados con los que ya están destacados
      const featured = transformedVehicles.filter(v => v.featured);
      setSelectedVehicles(featured);
      
    } catch (err) {
      console.error('Error en fetchVehicles:', err);
      toast.error("No se pudieron cargar los vehículos. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar vehículos al montar el componente
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Función para cambiar el estado "featured" de un vehículo
  const handleToggleFeatured = (vehicleId: number) => {
    // Actualizar el estado local de los vehículos
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, featured: !vehicle.featured } 
          : vehicle
      )
    );
  };

  // Función para abrir el diálogo de edición de características destacadas
  const handleEditHighlights = (vehicle: ExtendedVehicleWithFeatured) => {
    setEditingHighlightsForId(vehicle.id);
    setTempSelectedHighlights(vehicle.selectedHighlights || []);
  };

  // Función para guardar las características destacadas seleccionadas
  const handleSaveHighlights = () => {
    if (!editingHighlightsForId) return;

    // Limitar a 3 características
    const limitedHighlights = tempSelectedHighlights.slice(0, 3);
    
    // Actualizar el estado local
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === editingHighlightsForId 
          ? { ...vehicle, selectedHighlights: limitedHighlights } 
          : vehicle
      )
    );
    
    // Cerrar el diálogo
    setEditingHighlightsForId(null);
  };

  // Función para manejar el cambio en la selección de características
  const handleHighlightChange = (highlight: string) => {
    setTempSelectedHighlights(prev => {
      if (prev.includes(highlight)) {
        return prev.filter(h => h !== highlight);
      } else {
        if (prev.length >= 3) {
          // Ya hay 3 seleccionadas, reemplazar la primera
          return [...prev.slice(1), highlight];
        }
        return [...prev, highlight];
      }
    });
  };

  // Función para guardar los cambios en Supabase
  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("Iniciando proceso de guardado de vehículos destacados");

      // Importación dinámica de supabase
      const { supabase } = await import('@/lib/supabase');
      
      // Comprobar conexión a Supabase
      const { data: connectionTest, error: connectionError } = await supabase.from('vehicles').select('id').limit(1);
      
      if (connectionError) {
        console.error("Error de conexión a Supabase:", connectionError);
        toast.error(`Error de conexión a la base de datos: ${connectionError.message}`);
        return;
      }
      
      console.log("Conexión a Supabase OK. Identificando vehículos para actualizar");
      
      // Identificar vehículos que han cambiado su estado "featured" o sus características destacadas
      const vehiclesToUpdate = vehicles.filter(vehicle => 
        vehicle.featured !== vehicle.originalFeatured || 
        JSON.stringify(vehicle.selectedHighlights) !== JSON.stringify(vehicle.originalSelectedHighlights)
      );
      
      console.log(`Se encontraron ${vehiclesToUpdate.length} vehículos para actualizar`);
      
      if (vehiclesToUpdate.length === 0) {
        console.log("No hay cambios para guardar");
        toast.info("No hay cambios para guardar");
        setIsSaving(false);
        return;
      }
      
      // Primero verificamos si la columna is_featured existe en la tabla
      try {
        const { data: schemaData, error: schemaError } = await supabase
          .from('vehicles')
          .select('is_featured')
          .limit(1);
            
        // Si no existe la columna, intentamos crearla
        if (schemaError && schemaError.message.includes("column") && schemaError.message.includes("does not exist")) {
          console.log("La columna is_featured no existe. Intentando crear la columna...");
          
          toast.error("La columna is_featured no existe en la tabla vehicles. Por favor, ejecuta el siguiente comando SQL en la consola de Supabase: ALTER TABLE vehicles ADD COLUMN is_featured BOOLEAN DEFAULT false;");
          setIsSaving(false);
          return;
        }
      } catch (schemaErr) {
        console.error("Error al verificar el esquema:", schemaErr);
      }

      // Verificar si existe la columna selected_highlights
      try {
        const { data: schemaData, error: schemaError } = await supabase
          .from('vehicles')
          .select('selected_highlights')
          .limit(1);
            
        // Si no existe la columna, sugerimos crearla
        if (schemaError && schemaError.message.includes("column") && schemaError.message.includes("does not exist")) {
          console.log("La columna selected_highlights no existe. Intentando crear la columna...");
          
          toast.error("La columna selected_highlights no existe en la tabla vehicles. Por favor, ejecuta el siguiente comando SQL en la consola de Supabase: ALTER TABLE vehicles ADD COLUMN selected_highlights TEXT[] DEFAULT '{}';");
          setIsSaving(false);
          return;
        }
      } catch (schemaErr) {
        console.error("Error al verificar el esquema para selected_highlights:", schemaErr);
      }
      
      // Preparar actualizaciones
      const updatePromises = vehiclesToUpdate.map(vehicle => {
        console.log(`Actualizando vehículo ID: ${vehicle.id}`);
        
        return supabase
          .from('vehicles')
          .update({ 
            is_featured: vehicle.featured,
            selected_highlights: vehicle.selectedHighlights || []
          })
          .eq('id', vehicle.id)
          .then(({ data, error }) => {
            if (error) {
              console.error(`Error al actualizar vehículo ID ${vehicle.id}:`, error);
              throw new Error(`Error al actualizar vehículo ${vehicle.marca} ${vehicle.modelo}: ${error.message}`);
            }
            return `Vehículo ID ${vehicle.id} actualizado correctamente`;
          });
      });
      
      // Ejecutar todas las actualizaciones
      console.log("Ejecutando actualizaciones en la base de datos...");
      const results = await Promise.all(updatePromises);
      console.log("Resultados de actualizaciones:", results);
      
      // Actualizar el estado local para reflejar que los cambios se han guardado
      setVehicles(vehicles.map(vehicle => ({
        ...vehicle,
        originalFeatured: vehicle.featured,
        originalSelectedHighlights: vehicle.selectedHighlights
      })));
      
      toast.success("Cambios guardados correctamente");
      console.log("Proceso de guardado completado con éxito");
    } catch (err: any) {
      console.error("Error en handleSave:", err);
      toast.error(`Error al guardar cambios: ${err.message || "Error desconocido"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Obtener todas las posibles características de un vehículo
  const getVehicleHighlights = (vehicle: ExtendedVehicleWithFeatured): string[] => {
    const highlights: string[] = [];
    
    // Añadir características explícitas
    if (Array.isArray(vehicle.caracteristicas)) {
      highlights.push(...vehicle.caracteristicas);
    }
    
    // Añadir equipamiento activado
    if (vehicle.equipamiento && typeof vehicle.equipamiento === 'object') {
      const equipHighlights = Object.entries(vehicle.equipamiento)
        .filter(([key, value]) => value === true)
        .map(([key]) => {
          // Convertir camelCase a texto legible
          return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
        });
      
      highlights.push(...equipHighlights);
    }
    
    return highlights;
  };

  // Filtrar vehículos según la pestaña activa
  const filteredVehicles = (() => {
    if (activeTab === "todos") {
      return vehicles;
    } else if (activeTab === "nuevos") {
      return vehicles.filter(v => 
        ["nuevo", "0km", "NUEVO", "0KM"].includes(v.condicion?.toLowerCase() || "")
      );
    } else if (activeTab === "usados") {
      return vehicles.filter(v => 
        ["usado", "USADO"].includes(v.condicion?.toLowerCase() || "")
      );
    }
    return vehicles;
  })();

  // Contar cuántos vehículos destacados hay por tipo
  const featuredCounts = {
    todos: vehicles.filter(v => v.featured).length,
    nuevos: vehicles.filter(v => v.featured && ["nuevo", "0km", "NUEVO", "0KM"].includes(v.condicion?.toLowerCase() || "")).length,
    usados: vehicles.filter(v => v.featured && ["usado", "USADO"].includes(v.condicion?.toLowerCase() || "")).length
  };

  // Función para formatear precio
  const formatPrice = (price?: number) => {
    if (!price) return 'Consultar';
    return `$${price.toLocaleString('es-AR')}`;
  };

  // Renderizar tabla de vehículos
  const renderVehicleTable = (vehicles: ExtendedVehicleWithFeatured[], tabValue: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (vehicles.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          <Car className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <p>No hay vehículos disponibles para mostrar</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Imagen</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead className="hidden md:table-cell">Año</TableHead>
              <TableHead className="hidden md:table-cell">KM</TableHead>
              <TableHead className="hidden md:table-cell">Precio</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              <TableHead>Destacar</TableHead>
              <TableHead>Características</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => {
              // Mostrar todas las características disponibles
              const availableHighlights = getVehicleHighlights(vehicle);
              
              return (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                      {vehicle.imagenes && vehicle.imagenes.length > 0 ? (
                        <ClientImage 
                          src={vehicle.imagenes[0]} 
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Car className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vehicle.marca} {vehicle.modelo}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[180px]">{vehicle.version}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{vehicle.año || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vehicle.kilometraje === 0 ? '0 km' : vehicle.kilometraje?.toLocaleString() + ' km' || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatPrice(vehicle.precio)}</TableCell>
                  <TableCell className="hidden md:table-cell">{vehicle.ubicacion || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={vehicle.featured ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"}
                      onClick={() => handleToggleFeatured(vehicle.id as number)}
                    >
                      {vehicle.featured ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {/* Mostrar las características seleccionadas actualmente */}
                      {vehicle.selectedHighlights && vehicle.selectedHighlights.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {vehicle.selectedHighlights.map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Ninguna seleccionada</p>
                      )}
                      
                      {/* Botón para editar características */}
                      <Dialog open={editingHighlightsForId === vehicle.id} onOpenChange={(open) => {
                        if (!open) setEditingHighlightsForId(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs w-full"
                            onClick={() => handleEditHighlights(vehicle)}
                            disabled={!vehicle.featured}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar ({vehicle.selectedHighlights?.length || 0}/3)
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Seleccionar características destacadas</DialogTitle>
                            <DialogDescription>
                              Selecciona hasta 3 características para mostrar en los destacados.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="max-h-[300px] overflow-y-auto">
                            {availableHighlights.length === 0 ? (
                              <p className="text-muted-foreground text-center py-4">
                                Este vehículo no tiene características disponibles.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4">
                                {availableHighlights.map((highlight, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`highlight-${index}`} 
                                      checked={tempSelectedHighlights.includes(highlight)}
                                      onCheckedChange={() => handleHighlightChange(highlight)}
                                      disabled={
                                        !tempSelectedHighlights.includes(highlight) && 
                                        tempSelectedHighlights.length >= 3
                                      }
                                    />
                                    <label 
                                      htmlFor={`highlight-${index}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {highlight}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingHighlightsForId(null)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleSaveHighlights}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Guardar ({tempSelectedHighlights.length}/3)
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Vehículos Destacados</CardTitle>
          <CardDescription>
            Selecciona los vehículos que quieres destacar en la página principal.
          </CardDescription>
        </CardHeader>
        
        <Tabs
          defaultValue="todos"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="todos" className="relative">
                Todos
                <Badge className="ml-2 bg-muted-foreground">{featuredCounts.todos}</Badge>
              </TabsTrigger>
              <TabsTrigger value="nuevos">
                Nuevos
                <Badge className="ml-2 bg-muted-foreground">{featuredCounts.nuevos}</Badge>
              </TabsTrigger>
              <TabsTrigger value="usados">
                Usados
                <Badge className="ml-2 bg-muted-foreground">{featuredCounts.usados}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="px-0 py-4">
            <TabsContent value="todos" className="m-0">
              <div className="px-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona los vehículos que quieres destacar en la página principal. Aparecerán en las secciones "Vehículos 0KM Destacados" y "Vehículos Usados Destacados" según su condición.
                </p>
              </div>
              {renderVehicleTable(filteredVehicles, activeTab)}
            </TabsContent>
            
            <TabsContent value="nuevos" className="m-0">
              <div className="px-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona los vehículos nuevos que quieres destacar. Aparecerán en la sección "Vehículos 0KM Destacados" de la página principal.
                </p>
              </div>
              {renderVehicleTable(filteredVehicles, activeTab)}
            </TabsContent>
            
            <TabsContent value="usados" className="m-0">
              <div className="px-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona los vehículos usados que quieres destacar. Aparecerán en la sección "Vehículos Usados Destacados" de la página principal.
                </p>
              </div>
              {renderVehicleTable(filteredVehicles, activeTab)}
            </TabsContent>
          </CardContent>
          
          <CardFooter className="px-6 py-4 border-t">
            <Button 
              className="ml-auto"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
} 