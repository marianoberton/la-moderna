'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { ImageUpload } from "./ImageUpload";
import { Vehicle } from "@/types/vehicle";

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

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: z.infer<typeof vehicleSchema>) => Promise<void>;
}

export function VehicleForm({ vehicle, onSubmit }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(vehicle?.imagenes.map(img => img.url) || []);

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle || {
      marca: "",
      modelo: "",
      version: "",
      año: new Date().getFullYear(),
      precio: 0,
      kilometraje: 0,
      combustible: "",
      transmision: "",
      color: "",
      puertas: 4,
      condicion: "usado",
      tipo: "sedan",
      descripcion: "",
      caracteristicas: [],
      imagenes: [],
      estado: "activo"
    }
  });

  const handleSubmit = async (values: z.infer<typeof vehicleSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Error al guardar el vehículo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Agregar campos similares para version, año, precio, etc. */}
          
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

          {/* Subida de imágenes */}
          <div className="col-span-2">
            <FormLabel>Imágenes</FormLabel>
            <ImageUpload
              value={images}
              onChange={(urls) => {
                setImages(urls);
                form.setValue('imagenes', urls.map(url => ({
                  url,
                  principal: false
                })));
              }}
              onReorder={(newOrder) => {
                setImages(newOrder);
                form.setValue('imagenes', newOrder.map(url => ({
                  url,
                  principal: false
                })));
              }}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : vehicle ? 'Actualizar vehículo' : 'Crear vehículo'}
        </Button>
      </form>
    </Form>
  );
} 