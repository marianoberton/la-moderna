export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  año: number;
  precio: number;
  kilometraje: number;
  combustible: string;
  transmision: string;
  color: string;
  puertas: number;
  condicion: '0km' | 'usado';
  tipo: 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'coupe' | 'cabriolet';
  descripcion: string;
  caracteristicas: string[];
  imagenes: {
    url: string;
    principal: boolean;
  }[];
  estado: 'activo' | 'vendido' | 'reservado';
  createdAt: Date;
  updatedAt: Date;
} 