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
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, Save, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { carBrands, getModelsByBrand } from "@/lib/car-brands";

// Define the vehicle types based on CarTypes.tsx
const vehicleTypes = [
  { id: 'sedan', nombre: 'SEDAN' },
  { id: 'hatchback', nombre: 'HATCHBACK' },
  { id: 'suv', nombre: 'SUV' },
  { id: 'pickup', nombre: 'CAMIONETA' }, // "pickup" is used as the id in the backend
  { id: 'coupe', nombre: 'COUPE' }
];

const equipamientoDefault = {
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
};

const vehicleSchema = z.object({
  version: z.string().min(2, {
    message: "Debe tener al menos 2 caracteres.",
  }),
  marca: z.string().min(1, {
    message: "Debe seleccionar una marca.",
  }),
  modelo: z.string().min(1, {
    message: "Debe ingresar un modelo.",
  }),
  // Fields to store original brand and model for "otra" brand cases
  originalBrand: z.string().optional(),
  originalModel: z.string().optional(),
  year: z.string().min(4, {
    message: "Debe ingresar un año válido.",
  }),
  fuel: z.enum(["NAFTA", "DIESEL", "HÍBRIDO", "ELÉCTRICO", "GNC"], {
    message: "Debe seleccionar un tipo de combustible.",
  }),
  transmission: z.enum(["MANUAL", "AUTOMÁTICA"], {
    message: "Debe seleccionar un tipo de transmisión.",
  }),
  price: z.string().min(1, {
    message: "Debe ingresar un precio.",
  }),
  description: z.string().min(1, {
    message: "Debe ingresar una descripción.",
  }),
  km: z.string().min(1, {
    message: "Debe ingresar el kilometraje.",
  }),
  passengers: z.string().min(1, {
    message: "Debe ingresar la cantidad de pasajeros.",
  }),
  doors: z.string().min(1, {
    message: "Debe ingresar la cantidad de puertas.",
  }),
  color: z.string().min(1, {
    message: "Debe ingresar un color.",
  }),
  location: z.enum(["TRENQUE LAUQUEN", "PEHUAJO", "BUENOS AIRES"], {
    message: "Debe seleccionar una ubicación.",
  }),
  images: z.array(z.string()).min(1, {
    message: "Debe subir al menos una imagen.",
  }),
  condition: z.enum(["NUEVO", "USADO"], {
    message: "Debe seleccionar una condición.",
  }),
  vehicleType: z.string().min(1, {
    message: "Debe seleccionar un tipo de vehículo.",
  }),
  status: z.enum(["DISPONIBLE", "RESERVADO", "VENDIDO", "EN PAUSA"], {
    message: "Debe seleccionar un estado.",
  }),
  caracteristicas: z.array(
    z.object({
      texto: z.string(),
      categoria: z.enum(["Confort", "Seguridad", "Tecnología", "Extras"])
    })
  ).default([]),
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
  }).default(equipamientoDefault).refine(
    (data) => Object.values(data).some(value => value === true),
    {
      message: "Debe seleccionar al menos un elemento de equipamiento",
      path: ["equipamiento"]
    }
  ),
});

// Tipo para valores del formulario basado en el esquema
type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Interface para props del componente
interface VehicleFormProps {
  initialData?: Partial<VehicleFormValues> & { id?: string };
  onSubmit: (data: any) => Promise<any>;
}

type StepConfig = {
  title: string;
  description: string;
}

const STEPS: StepConfig[] = [
  {
    title: "Información Básica",
    description: "Detalles generales del vehículo"
  },
  {
    title: "Características Técnicas",
    description: "Especificaciones técnicas del vehículo"
  },
  {
    title: "Equipamiento",
    description: "Características y equipamiento incluido"
  },
  {
    title: "Imágenes",
    description: "Fotos del vehículo"
  },
  {
    title: "Información de Venta",
    description: "Precio y condiciones de venta"
  }
];

// Verificamos que las imágenes tengan el formato correcto
const formatImages = (images: any[] | undefined): string[] => {
  if (!images) return [];
  return images.map(img => typeof img === 'string' ? img : img.url);
};

// Extraemos el equipamiento si existe
const getEquipamiento = (data: Partial<VehicleFormValues> | undefined) => {
  if (!data || !data.equipamiento) {
    return equipamientoDefault;
  }
  return data.equipamiento;
};

export function VehicleForm({ initialData = {}, onSubmit }: VehicleFormProps) {
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error' | 'info' | null, message: string}>({
    type: null,
    message: ''
  });
  const [images, setImages] = useState<string[]>(formatImages(initialData?.images));
  const [caracteristicasInput, setCaracteristicasInput] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<"Confort" | "Seguridad" | "Tecnología" | "Extras">("Confort");
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);
  
  // Determinar si estamos en modo edición
  const isEditing = !!initialData?.id;
  
  // Inicializar valores por defecto para el formulario
  const defaultValues: Partial<VehicleFormValues> = {
    version: '',
    marca: '',
    modelo: '',
    originalBrand: '',
    originalModel: '',
    year: '', // Start with blank year
    fuel: "NAFTA" as const,
    transmission: "MANUAL" as const,
    price: '',
    description: '',
    km: '',
    passengers: '',
    doors: '',
    color: '',
    location: "TRENQUE LAUQUEN" as const,
    images: [],
    condition: "USADO" as const,
    vehicleType: "sedan",
    status: "DISPONIBLE" as const,
    caracteristicas: [],
    equipamiento: {
      ...equipamientoDefault,
    },
  };

  // Función para preparar las características, corrigiendo el error de tipos
  const prepareCaracteristicas = () => {
    if (!initialData?.caracteristicas) return [];
    
    // Verificar si las características ya tienen el formato nuevo (con categoría)
    if (
      Array.isArray(initialData.caracteristicas) && 
      initialData.caracteristicas.length > 0 && 
      typeof initialData.caracteristicas[0] === 'object' && 
      'texto' in initialData.caracteristicas[0]
    ) {
      return initialData.caracteristicas;
    }
    
    // Convertir de formato antiguo (array de strings) a nuevo (array de objetos)
    // Primero convertimos a unknown para evitar el error de tipo
    const caracteristicasArray = initialData.caracteristicas as unknown;
    
    // Luego convertimos de manera segura al tipo que esperamos
    if (Array.isArray(caracteristicasArray)) {
      return caracteristicasArray.map((item: unknown) => {
        if (typeof item === 'string') {
          return {
            texto: item,
            categoria: "Extras" as const // Por defecto asignamos a "Extras"
          };
        }
        // Si no es string, devolvemos un objeto predeterminado para evitar errores
        return {
          texto: String(item),
          categoria: "Extras" as const
        };
      });
    }
    
    return [];
  };

  // Crear formulario con validación de zod
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
      images: images,
      caracteristicas: prepareCaracteristicas(),
      equipamiento: {
        ...equipamientoDefault,
        ...(initialData?.equipamiento || {}),
      }
    },
  });

  // Actualizar campos del formulario cuando cambian las imágenes
  useEffect(() => {
    form.setValue('images', images);
  }, [images, form]);

  // Encontrar la marca y modelo correspondientes en modo edición
  useEffect(() => {
    if (isEditing && initialData.marca && initialData.modelo) {
      console.log("🚀 Cargando datos iniciales de marca/modelo:", {
        marca: initialData.marca,
        modelo: initialData.modelo
      });
      
      // Guardar los valores originales para respaldo siempre, no solo si no se encuentra
      form.setValue("originalBrand", initialData.marca);
      form.setValue("originalModel", initialData.modelo);
      
      // Intentamos primero mapear las marcas conocidas
      let foundBrand = false;
      
      // Intentar encontrar coincidencia exacta primero
      let brand = carBrands.find(b => b.name.toLowerCase() === initialData.marca?.toLowerCase());
      
      // Si no hay coincidencia exacta, tratar de encontrar una marca que comience con el mismo texto
      if (!brand && initialData.marca) {
        const marcaValue = initialData.marca; // Crear constante local para evitar errores de TypeScript
        brand = carBrands.find(b => 
          marcaValue.toLowerCase().startsWith(b.name.toLowerCase()) || 
          b.name.toLowerCase().startsWith(marcaValue.toLowerCase())
        );
      }
      
      // Si se encuentra una marca coincidente
      if (brand) {
        foundBrand = true;
        // Establecer el valor de la marca
        form.setValue("marca", brand.id);
        
        // Obtener modelos para esta marca
        const models = getModelsByBrand(brand.id);
        setAvailableModels(models);
        
        // Buscar modelo por nombre o establecer el primer modelo
        const model = models.find(m => {
          if (!initialData.modelo) return false;
          return m.name.toLowerCase() === initialData.modelo.toLowerCase() ||
            initialData.modelo.toLowerCase().includes(m.name.toLowerCase()) ||
            m.name.toLowerCase().includes(initialData.modelo.toLowerCase());
        });
        
        if (model) {
          form.setValue("modelo", model.id);
        } else {
          // Si no se encuentra el modelo pero estamos manteniendo la marca original
          console.log("Modelo no encontrado para marca conocida, usando otra");
          
          // Si no se encuentra el modelo correspondiente, usamos "otra" para preservar el valor original
          const otraBrand = carBrands.find(b => b.id === 'otra');
          if (otraBrand) {
            form.setValue("marca", otraBrand.id);
            const otherModels = getModelsByBrand(otraBrand.id);
            setAvailableModels(otherModels);
            
            if (otherModels.length > 0) {
              form.setValue("modelo", otherModels[0].id);
            }
          }
        }
      } else {
        // Si no se encuentra la marca, usar "otra"
        console.log("Marca no encontrada, usando marca 'otra'");
        const otraBrand = carBrands.find(b => b.id === 'otra');
        if (otraBrand) {
          form.setValue("marca", otraBrand.id);
          const models = getModelsByBrand(otraBrand.id);
          setAvailableModels(models);
          
          // Establecer el modelo "otro"
          if (models.length > 0) {
            form.setValue("modelo", models[0].id);
          }
        }
      }
    }
  }, [isEditing, initialData, form]);
  
  // Actualizar modelos disponibles cuando cambia la marca
  useEffect(() => {
    const selectedBrand = form.watch("marca");
    if (selectedBrand) {
      const models = getModelsByBrand(selectedBrand);
      setAvailableModels(models);
      
      // Reset modelo if current value is not in the new models list
      const currentModel = form.getValues("modelo");
      const modelExists = models.some(m => m.id === currentModel);
      if (!modelExists) {
        form.setValue("modelo", "");
      }
    } else {
      setAvailableModels([]);
    }
  }, [form.watch("marca")]);

  // Set initial year value based on condition
  useEffect(() => {
    // Only set year to current year if it's a new vehicle without existing data and no year set
    if (!initialData?.year && form.getValues("condition") === "NUEVO" && !form.getValues("year")) {
      form.setValue("year", "2025");
    }
  }, []);
  
  // Update KM and year when condition changes
  useEffect(() => {
    const condition = form.watch("condition");
    if (condition === "NUEVO") {
      form.setValue("km", "0");
      // Only set year if it's not already set
      const currentYear = form.getValues("year");
      if (!currentYear) {
        form.setValue("year", "2025");
      }
    } else if (condition === "USADO") {
      // For used vehicles, clear the year field if it was previously set to 2024 or 2025
      const currentYear = form.getValues("year");
      if (currentYear === "2025" || currentYear === "2024") {
        form.setValue("year", "");
      }
    }
  }, [form.watch("condition"), form]);

  // Función para actualizar el listado de características
  const handleAddCaracteristica = () => {
    if (!caracteristicasInput.trim()) return;
    
    const current = form.getValues("caracteristicas") || [];
    const newCaracteristica = {
      texto: caracteristicasInput.trim(),
      categoria: selectedCategoria
    };
    form.setValue("caracteristicas", [...current, newCaracteristica]);
    setCaracteristicasInput('');
  };

  const handleRemoveCaracteristica = (index: number) => {
    const current = form.getValues("caracteristicas") || [];
    form.setValue(
      "caracteristicas",
      current.filter((_: any, i: number) => i !== index)
    );
  };

  // También necesitamos asegurarnos de que se establezca el valor correcto para vehicleType
  useEffect(() => {
    if (isEditing && initialData.vehicleType) {
      // Verificar si el tipo de vehículo existe en nuestras opciones
      const vehicleTypeExists = vehicleTypes.some(type => type.id === initialData.vehicleType);
      
      if (vehicleTypeExists) {
        form.setValue("vehicleType", initialData.vehicleType);
      }
    }
  }, [isEditing, initialData, form]);

  const handleSubmit = async (values: VehicleFormValues) => {
    setIsSubmitting(true);
    setStatusMessage({ type: 'info', message: "Guardando vehículo..." });
    
    try {
      // Formatting the vehicle data for Supabase
      if (!values.marca || !values.modelo || !values.year || !values.price || !values.km) {
        throw new Error('Faltan campos obligatorios');
      }
      
      // Format values before sending
      const formattedValues = {
        marca: values.marca,
        modelo: values.modelo,
        version: values.version,
        año: parseInt(values.year),
        precio: parseInt(values.price),
        kilometraje: parseInt(values.km),
      };
      
      // Verify that the data types are correct
      if (isNaN(formattedValues.año) || isNaN(formattedValues.precio) || isNaN(formattedValues.kilometraje)) {
        throw new Error('Los campos numéricos deben contener valores válidos');
      }
      
      console.log('⭐ Iniciando prueba de conexión a Supabase antes de enviar datos...');
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: connection, error: connectionError } = await supabase.from('vehicles').select('count').single();
        
        if (connectionError) {
          console.error('⚠️ Error probando conexión:', connectionError);
          throw new Error(`Error de conexión: ${connectionError.message}`);
        }
        console.log('✅ Conexión exitosa a Supabase');
      } catch (connectionError: any) {
        console.error('⚠️ Error verificando conexión:', connectionError);
        throw new Error(`Error al conectar con Supabase: ${connectionError.message || 'Error desconocido'}`);
      }
      
      console.log('⭐ Enviando datos al servicio...');
      try {
        // Get current form values
        const values = form.getValues();
        
        // Get brand and model names based on selected IDs
        const selectedBrandId = values.marca;
        const selectedModelId = values.modelo;
        
        // Find the selected brand
        let selectedBrand = carBrands.find(b => b.id === selectedBrandId);
        let brandName = '';
        let modelName = '';
        
        // Manejo especial para "otra" marca: SIEMPRE usar valores originales si están disponibles
        if (selectedBrandId === 'otra') {
          brandName = values.originalBrand || 'Otra';
          modelName = values.originalModel || 'Otro';
          console.log(`Usando valores originales en submit: marca=${brandName}, modelo=${modelName}`);
        } else {
          // Manejo normal de marca/modelo
          if (!selectedBrand) {
            // Fallback a marca "otra"
            selectedBrand = carBrands.find(b => b.id === 'otra');
            if (!selectedBrand) {
              throw new Error('Error: No se pudo encontrar la marca seleccionada');
            }
            console.warn('Usando marca de respaldo "otra" porque la marca seleccionada no se encontró');
            
            // Si caemos en "otra", usar los valores originales
            brandName = values.originalBrand || 'Otra';
            modelName = values.originalModel || 'Otro';
          } else {
            brandName = selectedBrand.name;
            
            // Obtener modelos para esta marca
            const models = getModelsByBrand(selectedBrand.id);
            
            // Encontrar el modelo seleccionado
            const selectedModel = models.find(m => m.id === selectedModelId);
            
            if (selectedModel) {
              modelName = selectedModel.name;
            } else if (models.length > 0) {
              // Fallback al primer modelo
              modelName = models[0].name;
              console.warn('Usando modelo de respaldo porque el modelo seleccionado no se encontró');
            } else {
              modelName = 'Otro';
            }
          }
        }
        
        // Formatear las características para guardarlas en Supabase (text only)
        const caracteristicasFormatted = values.caracteristicas.map(
          (c: {texto: string, categoria: string}) => c.texto
        );
        
        const formattedValues = {
          marca: brandName,
          modelo: modelName,
          version: values.version,
          año: parseInt(values.year),
          precio: parseInt(values.price),
          kilometraje: parseInt(values.km),
          combustible: values.fuel,
          transmision: values.transmission,
          color: values.color,
          puertas: parseInt(values.doors),
          pasajeros: parseInt(values.passengers),
          ubicacion: values.location,
          condicion: values.condition === "NUEVO" ? "0km" : "usado",
          tipo: values.vehicleType,
          descripcion: values.description || "",
          financiacion: false,
          permuta: false,
          caracteristicas: caracteristicasFormatted,
          equipamiento: values.equipamiento || {},
          imagenes: values.images || [],
          estado: values.status === "DISPONIBLE" ? "activo" : 
                  values.status === "VENDIDO" ? "vendido" : 
                  values.status === "EN PAUSA" ? "en_pausa" : "reservado"
        };
        
        // Verify basic validation
        if (!formattedValues.marca || !formattedValues.modelo) {
          throw new Error('Faltan datos obligatorios: marca y modelo');
        }
        
        if (!Array.isArray(formattedValues.imagenes) || formattedValues.imagenes.length === 0) {
          throw new Error('Debe incluir al menos una imagen');
        }
        
        // Access directly to Supabase (working method)
        const { supabase } = await import('@/lib/supabase');
        
        // Verify if we're editing or creating a new vehicle
        const vehicleId = initialData?.id;
        const isEditing = !!vehicleId;
        console.log(`Modo: ${isEditing ? 'EDICIÓN de vehículo ID ' + vehicleId : 'CREACIÓN'}`);
        
        let result;
        let successMessage;
        
        if (isEditing && vehicleId) {
          // EDIT MODE - Update existing vehicle
          console.log(`Actualizando vehículo con ID: ${vehicleId}`);
          
          const now = new Date().toISOString();
          result = await supabase
            .from('vehicles')
            .update({
              ...formattedValues,
              updated_at: now
            })
            .eq('id', vehicleId)
            .select()
            .single();
            
          successMessage = `Vehículo actualizado correctamente con ID: ${vehicleId}`;
        } else {
          // CREATE MODE - Insert new vehicle
          console.log('Enviando datos a Supabase para crear nuevo vehículo');
          
          result = await supabase
            .from('vehicles')
            .insert(formattedValues)
            .select()
            .single();
            
          successMessage = 'Vehículo creado correctamente';
        }
        
        // Handle result (error or success)
        if (result.error) {
          console.error(`Error al ${isEditing ? 'actualizar' : 'crear'}:`, result.error);
          setStatusMessage({
            type: 'error', 
            message: `Error: ${result.error.message}`
          });
          toast.error(`Error: ${result.error.message}`);
        } else {
          console.log(`Vehículo ${isEditing ? 'actualizado' : 'creado'} exitosamente:`, result.data);
          setStatusMessage({
            type: 'success',
            message: successMessage
          });
          toast.success(successMessage);
          
          // Also try to use the original method (to maintain compatibility)
          try {
            // Comentamos esta línea para evitar la duplicación de publicaciones
            // await onSubmit(formattedValues);
            console.log('Vehículo guardado correctamente a través de Supabase directo');
          } catch (submitError: any) {
            console.log(`Nota: El método onSubmit no funcionó, pero el vehículo ya fue ${isEditing ? 'actualizado' : 'creado'} correctamente`);
          }
        }
      } catch (e: any) {
        console.error('Error general:', e);
        setStatusMessage({
          type: 'error',
          message: `Error: ${e.message || JSON.stringify(e)}`
        });
        toast.error(`Error: ${e.message || JSON.stringify(e)}`);
      } finally {
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("⚠️ Error detallado al guardar:", error);
      toast.error(`Error al guardar el vehículo: ${error.message || 'Error desconocido'}`);
    }
  };

  // Función para contar cuántos elementos de equipamiento están seleccionados
  const countSelectedEquipamiento = (): number => {
    const equipamiento = form.getValues("equipamiento");
    return Object.values(equipamiento).filter(Boolean).length;
  };

  // Validar los campos del paso actual antes de avanzar
  const validateStep = async (step: number): Promise<boolean> => {
    let isValid = true;

    switch(step) {
      case 1:
        // Todos los campos del primer paso son obligatorios
        isValid = await form.trigger(['marca', 'modelo', 'version', 'year', 'condition', 'vehicleType', 'location']);
        break;
      case 2:
        // Todos los campos técnicos son obligatorios excepto las características adicionales
        isValid = await form.trigger(['km', 'fuel', 'transmission', 'color', 'doors', 'passengers', 'description']);
        break;
      case 3:
        // Validar que al menos un elemento de equipamiento esté seleccionado
        const equipamientoCount = countSelectedEquipamiento();
        isValid = equipamientoCount > 0;
        if (!isValid) {
          toast.error('Debe seleccionar al menos un elemento de equipamiento');
        }
        break;
      case 4:
        // La validación de imágenes es obligatoria
        isValid = images.length > 0;
        if (!isValid) {
          toast.error('Debe subir al menos una imagen del vehículo');
        }
        break;
      case 5:
        // El precio es obligatorio
        isValid = await form.trigger(['price', 'status']);
        break;
      default:
        isValid = true;
    }

    return isValid;
  }

  // Modificar la función nextStep para permitir navegación libre en modo edición
  const nextStep = async () => {
    if (isEditing) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      const isStepValid = await validateStep(currentStep);
      if (isStepValid && currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  // Modificar la función prevStep para permitir navegación libre en modo edición
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Agregar función para navegar directamente a un paso específico
  const goToStep = async (step: number) => {
    // Reload form data from database to ensure we have the latest changes
    if (isEditing && initialData.id) {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: refreshedVehicle, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', initialData.id)
          .single();
        
        if (!error && refreshedVehicle) {
          console.log("🔄 Actualizando con datos frescos:", {
            tipo: refreshedVehicle.tipo,
            marca: refreshedVehicle.marca,
            modelo: refreshedVehicle.modelo,
            condicion: refreshedVehicle.condicion
          });
          
          // Guardar siempre los valores originales
          form.setValue("originalBrand", refreshedVehicle.marca);
          form.setValue("originalModel", refreshedVehicle.modelo);
          
          // Buscar coincidencia en marcas conocidas
          let foundBrand = false;
          let brand = carBrands.find(b => b.name.toLowerCase() === refreshedVehicle.marca.toLowerCase());
          
          // Intentar coincidencia parcial
          if (!brand) {
            brand = carBrands.find(b => 
              refreshedVehicle.marca.toLowerCase().includes(b.name.toLowerCase()) || 
              b.name.toLowerCase().includes(refreshedVehicle.marca.toLowerCase())
            );
          }
          
          if (brand) {
            foundBrand = true;
            form.setValue("marca", brand.id);
            
            const models = getModelsByBrand(brand.id);
            
            // Buscar modelo
            const model = models.find(m => 
              m.name.toLowerCase() === refreshedVehicle.modelo.toLowerCase() ||
              refreshedVehicle.modelo.toLowerCase().includes(m.name.toLowerCase()) ||
              m.name.toLowerCase().includes(refreshedVehicle.modelo.toLowerCase())
            );
            
            if (model) {
              form.setValue("modelo", model.id);
            } else {
              // Si el modelo no coincide, usar "otra"
              const otraBrand = carBrands.find(b => b.id === 'otra');
              if (otraBrand) {
                form.setValue("marca", otraBrand.id);
                const otherModels = getModelsByBrand(otraBrand.id);
                if (otherModels.length > 0) {
                  form.setValue("modelo", otherModels[0].id);
                }
              }
            }
          } else {
            // Si no hay coincidencia, usar "otra"
            const otraBrand = carBrands.find(b => b.id === 'otra');
            if (otraBrand) {
              form.setValue("marca", otraBrand.id);
              const models = getModelsByBrand(otraBrand.id);
              if (models.length > 0) {
                form.setValue("modelo", models[0].id);
              }
            }
          }
          
          // Para vehicleType, necesitamos un tratamiento especial
          if (refreshedVehicle.tipo) {
            const vehicleTypeExists = vehicleTypes.some(type => type.id === refreshedVehicle.tipo);
            if (vehicleTypeExists) {
              form.setValue("vehicleType", refreshedVehicle.tipo);
            }
          }
          
          // Actualizar condición
          form.setValue("condition", refreshedVehicle.condicion === "0km" ? "NUEVO" : "USADO");
        }
      } catch (error) {
        console.error('Error al refrescar datos del vehículo:', error);
      }
    }
    
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
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
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${
                  currentStep >= index + 1 ? 'text-primary' : 'text-muted-foreground'
                }`}
                style={{ width: `${100 / STEPS.length}%` }}
              >
                <button
                  type="button"
                  onClick={() => isEditing && goToStep(index + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index + 1 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep === index + 1
                        ? 'border-2 border-primary text-primary' 
                        : 'bg-muted text-muted-foreground'
                  } ${isEditing ? 'cursor-pointer hover:bg-primary/10' : 'cursor-default'}`}
                >
                  {index + 1}
                </button>
                <span className="text-xs mt-1 text-center hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">{STEPS[currentStep - 1].title}</h2>
          <p className="text-muted-foreground mb-6">{STEPS[currentStep - 1].description}</p>

          {/* Step 1: Información Básica */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isEditing ? initialData.marca : "Seleccione una marca"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {carBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={availableModels.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={
                              isEditing 
                                ? initialData.modelo 
                                : availableModels.length === 0 
                                  ? "Seleccione una marca primero" 
                                  : "Seleccione un modelo"
                            } 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input {...field} placeholder="Ej: Corolla XLI 1.8" />
                    </FormControl>
                    <FormDescription>
                      Versión específica del modelo (ej: XLI 1.8, GLI 2.0, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condición</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una condición" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NUEVO">Nuevo</SelectItem>
                        <SelectItem value="USADO">Usado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    {form.watch("condition") === "NUEVO" ? (
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el año" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
                    {form.watch("condition") === "NUEVO" && (
                      <FormDescription>
                        Seleccione el año del modelo (actual o anterior)
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vehículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ubicación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una ubicación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TRENQUE LAUQUEN">Trenque Lauquen</SelectItem>
                        <SelectItem value="PEHUAJO">Pehuajo</SelectItem>
                        <SelectItem value="BUENOS AIRES">Buenos Aires</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Sucursal donde se encuentra el vehículo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Características Técnicas */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value)} 
                        disabled={form.watch("condition") === "NUEVO"}
                        readOnly={form.watch("condition") === "NUEVO"}
                      />
                    </FormControl>
                    {form.watch("condition") === "NUEVO" && (
                      <FormDescription>
                        El kilometraje se establece en 0 para vehículos nuevos
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combustible</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NAFTA">Nafta</SelectItem>
                        <SelectItem value="DIESEL">Diesel</SelectItem>
                        <SelectItem value="HÍBRIDO">Híbrido</SelectItem>
                        <SelectItem value="ELÉCTRICO">Eléctrico</SelectItem>
                        <SelectItem value="GNC">GNC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
          <FormField
            control={form.control}
                name="transmission"
            render={({ field }) => (
              <FormItem>
                    <FormLabel>Transmisión</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                        <SelectItem value="AUTOMÁTICA">Automática</SelectItem>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puertas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pasajeros</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descripción General</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describa el vehículo, su estado, historia, etc."
                        className="min-h-[120px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Equipamiento */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Agregamos la sección de características adicionales aquí */}
              <div className="mb-8 border-b pb-8">
                <FormLabel className="text-xl">Características Adicionales</FormLabel>
                <FormDescription className="mb-4">
                  Agregue características adicionales específicas de este vehículo, indicando a qué categoría pertenecen.
                </FormDescription>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2 mb-4">
                  <Select 
                    value={selectedCategoria} 
                    onValueChange={(val) => setSelectedCategoria(val as any)}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confort">Confort</SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Extras">Extras</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex flex-1 space-x-2">
                    <Input
                      placeholder="Agregar característica"
                      value={caracteristicasInput}
                      onChange={e => setCaracteristicasInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCaracteristica();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCaracteristica}
                      size="sm"
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
                
                {/* Mostrar características organizadas por categoría */}
                {["Confort", "Seguridad", "Tecnología", "Extras"].map((categoria) => {
                  const caracteristicasCategoria = form.watch('caracteristicas')?.filter(
                    (c: any) => c.categoria === categoria
                  );
                  
                  if (!caracteristicasCategoria || caracteristicasCategoria.length === 0) return null;
                  
                  return (
                    <div key={categoria} className="mb-4">
                      <h4 className="text-sm font-medium text-primary mb-2">{categoria}</h4>
                      <div className="flex flex-wrap gap-2">
                        {caracteristicasCategoria.map((caract: any, index: number) => {
                          const globalIndex = form.watch('caracteristicas')?.findIndex(
                            (c: any) => c.texto === caract.texto && c.categoria === caract.categoria
                          );
                          
                          return (
                            <div key={index} className="flex items-center bg-muted px-2 py-1 rounded">
                              <span className="mr-1">{caract.texto}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0" 
                                onClick={() => handleRemoveCaracteristica(globalIndex)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Sección de equipamiento original */}
              {Object.entries(equipamientoCategories).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-medium text-primary">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map(item => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name={`equipamiento.${item.id}` as any}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">{item.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Mensaje de error si no hay equipamiento seleccionado */}
              {countSelectedEquipamiento() === 0 && (
                <p className="text-destructive text-sm mt-2">Debe seleccionar al menos un elemento de equipamiento</p>
              )}
            </div>
          )}

          {/* Step 4: Imágenes */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <FormLabel>Imágenes del Vehículo</FormLabel>
                <FormDescription className="mb-4">
                  Sube imágenes del vehículo. La primera imagen será la principal.
                  Puedes arrastrar para reordenar.
                </FormDescription>
            <ImageUpload
              value={images}
                  onChange={setImages}
                  onReorder={setImages}
                />
                {images.length === 0 && (
                  <p className="text-destructive text-sm mt-2">Al menos una imagen es requerida</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Información de Venta */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de venta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                        <SelectItem value="RESERVADO">Reservado</SelectItem>
                        <SelectItem value="VENDIDO">Vendido</SelectItem>
                        <SelectItem value="EN PAUSA">En Pausa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {/* Show save button on all steps when editing */}
            {isEditing && (
              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
                onClick={async () => {
                  try {
                    console.log('Iniciando guardado directo...');
                    setStatusMessage({type: 'info', message: 'Guardando vehículo...'});
                    setIsSubmitting(true);
                    
                    // Obtener valores actuales del formulario
                    const values = form.getValues();
                    
                    // Obtener el nombre de la marca y modelo basado en los IDs seleccionados
                    const selectedBrandId = values.marca;
                    const selectedModelId = values.modelo;
                    
                    // Find the selected brand
                    let selectedBrand = carBrands.find(b => b.id === selectedBrandId);
                    
                    // If brand not found, use fallback
                    if (!selectedBrand) {
                      // Use "otra" brand as fallback
                      selectedBrand = carBrands.find(b => b.id === 'otra');
                      if (!selectedBrand) {
                        // If somehow "otra" brand is missing, show error
                        throw new Error('Error: No se pudo encontrar la marca seleccionada');
                      }
                      // Set marca value to the fallback brand
                      form.setValue("marca", selectedBrand.id);
                      console.warn('Using fallback brand "otra" because selected brand was not found');
                    }
                    
                    // Get models for this brand
                    const models = getModelsByBrand(selectedBrand.id);
                    
                    // Find the selected model
                    let selectedModel = selectedBrand.models.find(m => m.id === selectedModelId);
                    
                    // If model not found, use fallback
                    if (!selectedModel && models.length > 0) {
                      // Use first model as fallback
                      selectedModel = models[0];
                      form.setValue("modelo", selectedModel.id);
                      console.warn('Using fallback model because selected model was not found');
                    }
                    
                    if (!selectedModel) {
                      throw new Error('Error: No se pudo encontrar el modelo seleccionado');
                    }
                    
                    // Formatear las características para guardarlas en Supabase (solo texto)
                    const caracteristicasFormatted = values.caracteristicas.map(
                      (c: {texto: string, categoria: string}) => c.texto
                    );
                    
                    const formattedValues = {
                      marca: selectedBrand.name,
                      modelo: selectedModel.name,
                      version: values.version,
                      año: parseInt(values.year),
                      precio: parseInt(values.price),
                      kilometraje: parseInt(values.km),
                      combustible: values.fuel,
                      transmision: values.transmission,
                      color: values.color,
                      puertas: parseInt(values.doors),
                      pasajeros: parseInt(values.passengers),
                      ubicacion: values.location,
                      condicion: values.condition === "NUEVO" ? "0km" : "usado",
                      tipo: values.vehicleType,
                      descripcion: values.description || "",
                      financiacion: false,
                      permuta: false,
                      caracteristicas: caracteristicasFormatted, // Guardamos solo los textos para compatibilidad
                      equipamiento: values.equipamiento || {},
                      imagenes: values.images || [],
                      estado: values.status === "DISPONIBLE" ? "activo" : 
                              values.status === "VENDIDO" ? "vendido" : 
                              values.status === "EN PAUSA" ? "en_pausa" : "reservado"
                    };
                    
                    // Validación básica
                    if (!formattedValues.marca || !formattedValues.modelo) {
                      throw new Error('Faltan datos obligatorios: marca y modelo');
                    }
                    
                    if (!Array.isArray(formattedValues.imagenes) || formattedValues.imagenes.length === 0) {
                      throw new Error('Debe incluir al menos una imagen');
                    }
                    
                    // Acceder directamente a Supabase (método que funciona)
                    const { supabase } = await import('@/lib/supabase');
                    
                    // Verificar si estamos editando o creando un vehículo nuevo
                    const vehicleId = initialData?.id;
                    const isEditing = !!vehicleId;
                    console.log(`Modo: ${isEditing ? 'EDICIÓN de vehículo ID ' + vehicleId : 'CREACIÓN'}`);
                    
                    let result;
                    let successMessage;
                    
                    if (isEditing && vehicleId) {
                      // MODO EDICIÓN - Actualizar vehículo existente
                      console.log(`Actualizando vehículo con ID: ${vehicleId}`);
                      
                      const now = new Date().toISOString();
                      result = await supabase
                        .from('vehicles')
                        .update({
                          ...formattedValues,
                          updated_at: now
                        })
                        .eq('id', vehicleId)
                        .select()
                        .single();
                        
                      successMessage = `Vehículo actualizado correctamente con ID: ${vehicleId}`;
                    } else {
                      // MODO CREACIÓN - Insertar nuevo vehículo
                      console.log('Enviando datos a Supabase para crear nuevo vehículo');
                      
                      result = await supabase
                        .from('vehicles')
                        .insert(formattedValues)
                        .select()
                        .single();
                        
                      successMessage = 'Vehículo creado correctamente';
                    }
                    
                    // Manejar resultado (error o éxito)
                    if (result.error) {
                      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'}:`, result.error);
                      setStatusMessage({
                        type: 'error', 
                        message: `Error: ${result.error.message}`
                      });
                      toast.error(`Error: ${result.error.message}`);
                    } else {
                      console.log(`Vehículo ${isEditing ? 'actualizado' : 'creado'} exitosamente:`, result.data);
                      setStatusMessage({
                        type: 'success',
                        message: successMessage
                      });
                      toast.success(successMessage);
                      
                      // También intenta usar el método original (para mantener compatibilidad)
                      try {
                        // Comentamos esta línea para evitar la duplicación de publicaciones
                        // await onSubmit(formattedValues);
                        console.log('Vehículo guardado correctamente a través de Supabase directo');
                      } catch (submitError: any) {
                        console.log(`Nota: El método onSubmit no funcionó, pero el vehículo ya fue ${isEditing ? 'actualizado' : 'creado'} correctamente`);
                      }
                    }
                  } catch (e: any) {
                    console.error('Error general:', e);
                    setStatusMessage({
                      type: 'error',
                      message: `Error: ${e.message || JSON.stringify(e)}`
                    });
                    toast.error(`Error: ${e.message || JSON.stringify(e)}`);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Actualizar Vehículo
                  </>
                )}
              </Button>
            )}
            
            {/* Show next button if not on the last step, or save button on last step if not editing */}
            {currentStep !== STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : !isEditing ? (
              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
                onClick={async () => {
                  try {
                    console.log('Iniciando guardado directo...');
                    setStatusMessage({type: 'info', message: 'Guardando vehículo...'});
                    setIsSubmitting(true);
                    
                    // Obtener valores actuales del formulario
                    const values = form.getValues();
                    
                    // Obtener el nombre de la marca y modelo basado en los IDs seleccionados
                    const selectedBrandId = values.marca;
                    const selectedModelId = values.modelo;
                    
                    // Find the selected brand
                    let selectedBrand = carBrands.find(b => b.id === selectedBrandId);
                    
                    // If brand not found, use fallback
                    if (!selectedBrand) {
                      // Use "otra" brand as fallback
                      selectedBrand = carBrands.find(b => b.id === 'otra');
                      if (!selectedBrand) {
                        // If somehow "otra" brand is missing, show error
                        throw new Error('Error: No se pudo encontrar la marca seleccionada');
                      }
                      // Set marca value to the fallback brand
                      form.setValue("marca", selectedBrand.id);
                      console.warn('Using fallback brand "otra" because selected brand was not found');
                    }
                    
                    // Get models for this brand
                    const models = getModelsByBrand(selectedBrand.id);
                    
                    // Find the selected model
                    let selectedModel = selectedBrand.models.find(m => m.id === selectedModelId);
                    
                    // If model not found, use fallback
                    if (!selectedModel && models.length > 0) {
                      // Use first model as fallback
                      selectedModel = models[0];
                      form.setValue("modelo", selectedModel.id);
                      console.warn('Using fallback model because selected model was not found');
                    }
                    
                    if (!selectedModel) {
                      throw new Error('Error: No se pudo encontrar el modelo seleccionado');
                    }
                    
                    // Formatear las características para guardarlas en Supabase (solo texto)
                    const caracteristicasFormatted = values.caracteristicas.map(
                      (c: {texto: string, categoria: string}) => c.texto
                    );
                    
                    const formattedValues = {
                      marca: selectedBrand.name,
                      modelo: selectedModel.name,
                      version: values.version,
                      año: parseInt(values.year),
                      precio: parseInt(values.price),
                      kilometraje: parseInt(values.km),
                      combustible: values.fuel,
                      transmision: values.transmission,
                      color: values.color,
                      puertas: parseInt(values.doors),
                      pasajeros: parseInt(values.passengers),
                      ubicacion: values.location,
                      condicion: values.condition === "NUEVO" ? "0km" : "usado",
                      tipo: values.vehicleType,
                      descripcion: values.description || "",
                      financiacion: false,
                      permuta: false,
                      caracteristicas: caracteristicasFormatted, // Guardamos solo los textos para compatibilidad
                      equipamiento: values.equipamiento || {},
                      imagenes: values.images || [],
                      estado: values.status === "DISPONIBLE" ? "activo" : 
                              values.status === "VENDIDO" ? "vendido" : 
                              values.status === "EN PAUSA" ? "en_pausa" : "reservado"
                    };
                    
                    // Validación básica
                    if (!formattedValues.marca || !formattedValues.modelo) {
                      throw new Error('Faltan datos obligatorios: marca y modelo');
                    }
                    
                    if (!Array.isArray(formattedValues.imagenes) || formattedValues.imagenes.length === 0) {
                      throw new Error('Debe incluir al menos una imagen');
                    }
                    
                    // Acceder directamente a Supabase (método que funciona)
                    const { supabase } = await import('@/lib/supabase');
                    
                    // Verificar si estamos editando o creando un vehículo nuevo
                    const vehicleId = initialData?.id;
                    const isEditing = !!vehicleId;
                    console.log(`Modo: ${isEditing ? 'EDICIÓN de vehículo ID ' + vehicleId : 'CREACIÓN'}`);
                    
                    let result;
                    let successMessage;
                    
                    if (isEditing && vehicleId) {
                      // MODO EDICIÓN - Actualizar vehículo existente
                      console.log(`Actualizando vehículo con ID: ${vehicleId}`);
                      
                      const now = new Date().toISOString();
                      result = await supabase
                        .from('vehicles')
                        .update({
                          ...formattedValues,
                          updated_at: now
                        })
                        .eq('id', vehicleId)
                        .select()
                        .single();
                        
                      successMessage = `Vehículo actualizado correctamente con ID: ${vehicleId}`;
                    } else {
                      // MODO CREACIÓN - Insertar nuevo vehículo
                      console.log('Enviando datos a Supabase para crear nuevo vehículo');
                      
                      result = await supabase
                        .from('vehicles')
                        .insert(formattedValues)
                        .select()
                        .single();
                        
                      successMessage = 'Vehículo creado correctamente';
                    }
                    
                    // Manejar resultado (error o éxito)
                    if (result.error) {
                      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'}:`, result.error);
                      setStatusMessage({
                        type: 'error', 
                        message: `Error: ${result.error.message}`
                      });
                      toast.error(`Error: ${result.error.message}`);
                    } else {
                      console.log(`Vehículo ${isEditing ? 'actualizado' : 'creado'} exitosamente:`, result.data);
                      setStatusMessage({
                        type: 'success',
                        message: successMessage
                      });
                      toast.success(successMessage);
                      
                      // También intenta usar el método original (para mantener compatibilidad)
                      try {
                        // Comentamos esta línea para evitar la duplicación de publicaciones
                        // await onSubmit(formattedValues);
                        console.log('Vehículo guardado correctamente a través de Supabase directo');
                      } catch (submitError: any) {
                        console.log(`Nota: El método onSubmit no funcionó, pero el vehículo ya fue ${isEditing ? 'actualizado' : 'creado'} correctamente`);
                      }
                    }
                  } catch (e: any) {
                    console.error('Error general:', e);
                    setStatusMessage({
                      type: 'error',
                      message: `Error: ${e.message || JSON.stringify(e)}`
                    });
                    toast.error(`Error: ${e.message || JSON.stringify(e)}`);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Vehículo
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Status message display */}
        {statusMessage.type && (
          <div className={`mt-4 p-3 rounded-md ${
            statusMessage.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
            statusMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
            'bg-blue-100 text-blue-700 border border-blue-300'
          }`}>
            <div className="flex items-center">
              {statusMessage.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {statusMessage.type === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {statusMessage.type === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p>{statusMessage.message}</p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
} 