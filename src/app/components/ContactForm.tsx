'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { branches } from '../types/branches';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

// Esquema de validación
const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
  phone: z.string().min(8, { message: 'Ingrese un número de teléfono válido' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres' }),
  branch: z.string({ required_error: 'Por favor seleccione una sucursal' })
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<typeof branches[0] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      branch: ''
    },
  });

  // Actualizar la información mostrada cuando cambia la sucursal seleccionada
  useEffect(() => {
    const branchValue = form.watch('branch');
    if (branchValue) {
      const branch = branches.find(b => 
        b.id === (branchValue === 'trenque-lauquen' ? 1 : 2)
      );
      if (branch) {
        setSelectedBranch(branch);
      }
    }
  }, [form.watch('branch')]);

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      
      const branchData = branches.find(b => 
        b.id === (values.branch === 'trenque-lauquen' ? 1 : 2)
      );
      
      // Preparar los datos para enviar
      const formData = {
        nombre: values.name,
        email: values.email,
        telefono: values.phone,
        mensaje: values.message,
        sucursal: values.branch,
        // Opcional: puedes añadir el vehículo si este formulario se usa desde la página de un vehículo
        vehiculo: window.location.pathname.includes('/vehiculos/') ? window.location.pathname.split('/').pop() : undefined
      };
      
      // Enviar a la API
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el formulario');
      }
      
      // Resetear el formulario
      form.reset({
        name: '',
        email: '',
        phone: '',
        message: '',
        branch: ''
      });
      
      // Mostrar mensaje de éxito
      toast.success('Tu consulta ha sido enviada correctamente. Nos pondremos en contacto contigo lo antes posible.');
      
    } catch (error: any) {
      console.error('Error al enviar formulario:', error);
      toast.error(`Error al enviar el formulario: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-grow">
      <h2 className="text-xl font-bold mb-6">Envíanos tu consulta</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sucursal</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trenque-lauquen">La Moderna T. Lauquen</SelectItem>
                      <SelectItem value="pehuajo">La Moderna Pehuajo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedBranch && (
            <div className="p-3 bg-muted rounded-md mb-2">
              <p className="text-sm">Tu consulta será dirigida a <span className="font-medium">{selectedBranch.representatives[0].name}</span></p>
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tucorreo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 11 1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Escribí tu consulta acá..." 
                    className="resize-none h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[var(--background-dark-hover)] hover:bg-[var(--background-dark)] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 