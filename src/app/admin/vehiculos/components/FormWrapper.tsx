'use client';

import { useState, useEffect } from 'react';
import { VehicleForm } from './VehicleForm';

interface FormWrapperProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<any>;
}

export function FormWrapper({ initialData = {}, onSubmit }: FormWrapperProps) {
  const [formData, setFormData] = useState(initialData);
  
  // Asegurarnos de que se preserven los valores originales
  useEffect(() => {
    if (initialData && initialData.id) {
      console.log("FormWrapper - Datos iniciales recibidos:", {
        id: initialData.id,
        marca: initialData.marca,
        modelo: initialData.modelo,
        vehicleType: initialData.vehicleType,
        originalBrand: initialData.originalBrand,
        originalModel: initialData.originalModel
      });
      
      // Si no tenemos valores originales, los agregamos
      if (!initialData.originalBrand && initialData.marca) {
        setFormData({
          ...initialData,
          originalBrand: initialData.marca,
          originalModel: initialData.modelo
        });
      } else {
        setFormData(initialData);
      }
    }
  }, [initialData]);

  // Función para manejar el envío y preservar valores originales
  const handleSubmit = async (data: any) => {
    // Asegurarnos de mantener los valores originales si elegimos "otra" como marca
    if (data.marca === 'otra') {
      // Usar los valores originales disponibles
      const dataToSubmit = {
        ...data,
        // Usar los valores originales o los actuales como respaldo
        marca: data.originalBrand || data.marca,
        modelo: data.originalModel || data.modelo
      };
      console.log("FormWrapper - Enviando datos con valores originales:", {
        marca: dataToSubmit.marca,
        modelo: dataToSubmit.modelo
      });
      return onSubmit(dataToSubmit);
    }
    
    // Si no es "otra", proceder normalmente
    return onSubmit(data);
  };

  return (
    <VehicleForm
      initialData={formData}
      onSubmit={handleSubmit}
    />
  );
} 