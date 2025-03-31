'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "./ImageUpload";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

const vehicleSchema = z.object({
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  version: z.string().min(1, "La versión es requerida"),
  año: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  precio: z.coerce.number().min(0),
  kilometraje: z.coerce.number().min(0),
  combustible: z.string().min(1, "El tipo de combustible es requerido"),
  transmision: z.string().min(1, "El tipo de transmisión es requerido"),
  color: z.string().optional(),
  puertas: z.coerce.number().min(2).max(7),
  pasajeros: z.coerce.number().min(1).max(10),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  condicion: z.enum(['0km', 'usado']),
  tipo: z.enum(['SEDAN', 'SUV', 'PICKUP', 'HATCHBACK', 'COUPE', 'CABRIOLET']),
  descripcion: z.string().optional(),
  financiacion: z.boolean().default(false),
  permuta: z.boolean().default(false),
  caracteristicas: z.array(z.string()),
  equipamiento: z.object({
    aireAcondicionado: z.boolean().default(false),
    direccionAsistida: z.boolean().default(false),
    vidriosElectricos: z.boolean().default(false),
    tapiceriaCuero: z.boolean().default(false),
    cierreCentralizado: z.boolean().default(false),
    alarma: z.boolean().default(false),
    airbags: z.boolean().default(false),
    bluetooth: z.boolean().default(false),
    controlCrucero: z.boolean().default(false),
    techoSolar: z.boolean().default(false),
    llantasAleacion: z.boolean().default(false),
    traccion4x4: z.boolean().default(false),
    abs: z.boolean().default(false),
    esp: z.boolean().default(false),
    asistenteFrenado: z.boolean().default(false),
    camaraReversa: z.boolean().default(false),
    sensorEstacionamiento: z.boolean().default(false),
    navegacionGPS: z.boolean().default(false),
    controlVoz: z.boolean().default(false),
    asientosElectricos: z.boolean().default(false),
    asientosCalefaccionados: z.boolean().default(false),
    volanteCuero: z.boolean().default(false),
    climatizador: z.boolean().default(false),
  }),
  imagenes: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  estado: z.enum(['activo', 'vendido', 'reservado']).default('activo'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: VehicleFormValues) => Promise<void>;
}

export function VehicleForm({ initialData, onSubmit }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.imagenes?.map(img => typeof img === 'string' ? img : img.url) || []);
  const [caracteristicasInput, setCaracteristicasInput] = useState('');
  
  // Inicializar valores por defecto para el formulario
  const defaultValues: Partial<VehicleFormValues> = {
    marca: '',
    modelo: '',
    version: '',
    año: new Date().getFullYear(),
    precio: 0,
    kilometraje: 0,
    combustible: '',
    transmision: '',
    color: '',
    puertas: 4,
    pasajeros: 5,
    ubicacion: '',
    condicion: 'usado',
    tipo: 'SEDAN',
    descripcion: '',
    financiacion: false,
    permuta: false,
    caracteristicas: [],
    equipamiento: {
      aireAcondicionado: false,
      direccionAsistida: false,
      vidriosElectricos: false,
      tapiceriaCuero: false,
      cierreCentralizado: false,
      alarma: false,
      airbags: false,
      bluetooth: false,
      controlCrucero: false,
      techoSolar: false,
      llantasAleacion: false,
      traccion4x4: false,
      abs: false,
      esp: false,
      asistenteFrenado: false,
      camaraReversa: false,
      sensorEstacionamiento: false,
      navegacionGPS: false,
      controlVoz: false,
      asientosElectricos: false,
      asientosCalefaccionados: false,
      volanteCuero: false,
      climatizador: false,
    },
    imagenes: [],
    estado: 'activo',
  };

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData ? {
      ...defaultValues,
      ...initialData,
      imagenes: images,
      equipamiento: {
        ...defaultValues.equipamiento,
        ...(initialData.equipamiento || {}),
      }
    } : defaultValues
  });

  // Actualizar campos del formulario cuando cambian las imágenes
  useEffect(() => {
    form.setValue('imagenes', images);
  }, [images, form]);

  // Añadir una característica a la lista
  const addCaracteristica = () => {
    if (!caracteristicasInput.trim()) return;
    
    const currentCaracteristicas = form.getValues('caracteristicas') || [];
    form.setValue('caracteristicas', [...currentCaracteristicas, caracteristicasInput.trim()]);
    setCaracteristicasInput('');
  };

  // Eliminar una característica
  const removeCaracteristica = (index: number) => {
    const currentCaracteristicas = form.getValues('caracteristicas') || [];
    form.setValue('caracteristicas', currentCaracteristicas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: VehicleFormValues) => {
    if (images.length === 0) {
      toast.error('Debe subir al menos una imagen del vehículo');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Asegurarse de que el formato de las imágenes sea el correcto para guardar en DB
      const formattedValues = {
        ...values,
        imagenes: images
      };
      
      await onSubmit(formattedValues);
      toast.success(initialData ? 'Vehículo actualizado con éxito' : 'Vehículo creado con éxito');
    } catch (error) {
      console.error('Error al guardar el vehículo:', error);
      toast.error('Ha ocurrido un error al guardar el vehículo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const equipamientoCategories = {
    Confort: [
      { id: 'aireAcondicionado', label: 'Aire acondicionado' },
      { id: 'climatizador', label: 'Climatizador' },
      { id: 'asientosElectricos', label: 'Asientos eléctricos' },
      { id: 'asientosCalefaccionados', label: 'Asientos calefaccionados' },
      { id: 'tapiceriaCuero', label: 'Tapicería de cuero' },
      { id: 'volanteCuero', label: 'Volante de cuero' },
      { id: 'techoSolar', label: 'Techo solar' },
    ],
    Seguridad: [
      { id: 'abs', label: 'ABS' },
      { id: 'airbags', label: 'Airbags' },
      { id: 'esp', label: 'Control de estabilidad (ESP)' },
      { id: 'asistenteFrenado', label: 'Asistente de frenado' },
      { id: 'alarma', label: 'Alarma' },
      { id: 'cierreCentralizado', label: 'Cierre centralizado' },
    ],
    Tecnología: [
      { id: 'bluetooth', label: 'Bluetooth' },
      { id: 'navegacionGPS', label: 'Navegación GPS' },
      { id: 'camaraReversa', label: 'Cámara de reversa' },
      { id: 'sensorEstacionamiento', label: 'Sensores de estacionamiento' },
      { id: 'controlVoz', label: 'Control por voz' },
    ],
    Extras: [
      { id: 'direccionAsistida', label: 'Dirección asistida' },
      { id: 'vidriosElectricos', label: 'Vidrios eléctricos' },
      { id: 'controlCrucero', label: 'Control crucero' },
      { id: 'llantasAleacion', label: 'Llantas de aleación' },
      { id: 'traccion4x4', label: 'Tracción 4x4' },
    ]
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Información básica */}
        <div className="space-y-6">
          <div className="text-lg font-semibold">Información básica</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Versión</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="año"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kilometraje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilometraje</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condicion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condición</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar condición" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0km">0KM</SelectItem>
                      <SelectItem value="usado">Usado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SEDAN">Sedán</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="PICKUP">Pickup</SelectItem>
                      <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                      <SelectItem value="COUPE">Coupé</SelectItem>
                      <SelectItem value="CABRIOLET">Cabriolet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="combustible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combustible</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar combustible" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nafta">Nafta</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="GNC">GNC</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmisión</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar transmisión" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automática">Automática</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="Secuencial">Secuencial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Blanco">Blanco</SelectItem>
                      <SelectItem value="Negro">Negro</SelectItem>
                      <SelectItem value="Gris">Gris</SelectItem>
                      <SelectItem value="Rojo">Rojo</SelectItem>
                      <SelectItem value="Azul">Azul</SelectItem>
                      <SelectItem value="Verde">Verde</SelectItem>
                      <SelectItem value="Amarillo">Amarillo</SelectItem>
                      <SelectItem value="Beige">Beige</SelectItem>
                      <SelectItem value="Plateado">Plateado</SelectItem>
                      <SelectItem value="Dorado">Dorado</SelectItem>
                      <SelectItem value="Marrón">Marrón</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="puertas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puertas</FormLabel>
                  <FormControl>
                    <Input type="number" min={2} max={7} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pasajeros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasajeros</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Trenque Lauquen">Trenque Lauquen</SelectItem>
                      <SelectItem value="Pehuajó">Pehuajó</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del anuncio</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Opciones de compra */}
        <div className="space-y-6">
          <div className="text-lg font-semibold">Opciones de compra</div>
          <div className="flex flex-wrap gap-8">
            <FormField
              control={form.control}
              name="financiacion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Acepta financiación
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permuta"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Acepta permuta
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-6">
          <div className="text-lg font-semibold">Descripción</div>
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción detallada</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describa el vehículo detalladamente..." 
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Incluya características destacables, historia del vehículo, y cualquier información relevante para el comprador.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Características */}
        <div className="space-y-6">
          <div className="text-lg font-semibold">Características destacadas</div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                value={caracteristicasInput}
                onChange={(e) => setCaracteristicasInput(e.target.value)}
                placeholder="Añadir característica..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCaracteristica();
                  }
                }}
              />
              <Button type="button" onClick={addCaracteristica}>
                Añadir
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {form.watch('caracteristicas')?.map((caracteristica, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>{caracteristica}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCaracteristica(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipamiento */}
        <div className="space-y-6">
          <div className="text-lg font-semibold">Equipamiento</div>
          
          {Object.entries(equipamientoCategories).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-md font-medium">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {items.map(item => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`equipamiento.${item.id}` as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Imágenes */}
        <div className="space-y-6">
          <div className="text-lg font-semibold">Imágenes</div>
          <FormField
            control={form.control}
            name="imagenes"
            render={() => (
              <FormItem>
                <FormLabel>Subir imágenes</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={images}
                    onChange={setImages}
                    onReorder={setImages}
                  />
                </FormControl>
                <FormDescription>
                  La primera imagen será la principal y se mostrará como destacada en los listados.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar vehículo' : 'Crear vehículo'}
        </Button>
      </form>
    </Form>
  );
} 