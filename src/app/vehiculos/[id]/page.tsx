import React from 'react';
import VehiculoDetalleClient from './VehiculoDetalleClient';

// Este es el componente de página de servidor (Server Component)
export default async function VehiculoDetallePage({ params }: { params: { id: string } }) {
  // Este es un componente de servidor, por lo que aquí podrías:
  // 1. Hacer consultas a la base de datos
  // 2. Acceder a APIs externas
  // 3. Leer archivos del sistema, etc.

  const vehiculo = {
    id: Number(params.id) || 1,
    marca: 'Volkswagen',
    modelo: 'Amarok',
    version: 'AMAROK 2.0 HIGHLINE 4X4 AT',
    precio: 28500000,
    año: 2020,
    km: 65000,
    transmision: 'Automática',
    combustible: 'Diesel',
    color: 'Gris Oscuro',
    puertas: 4,
    pasajeros: 5,
    ubicacion: 'Trenque Lauquen',
    imagenes: [
      '/images/Usado/amarok_usada.jpg',
      '/images/Usado/amarokusada.jpg',
      '/images/Usado/Chevrolets10_usada.jpg',
      '/images/Usado/corolla1.jpg',
      '/images/Usado/corolla2.jpg',
      '/images/Usado/cruzeusado.jpg',
      '/images/Usado/duster.jpg',
      '/images/Usado/etios_usado.jpg',
      '/images/Usado/gol_trend_usado.jpg',
      '/images/Usado/gol_usado_2.jpg',
    ],
    caracteristicas: [
      'Aire acondicionado',
      'Dirección asistida',
      'Cierre centralizado',
      'Vidrios eléctricos',
      'Computadora de abordo',
      'Control de tracción',
      'ABS',
      'Airbags',
    ]
  };

  const concesionarias = [
    { 
      id: 1, 
      nombre: "La Moderna T. Lauquen", 
      whatsapp: "5491123456789",
      direccion: "Pasteur 1073, T. Lauquen"
    },
    { 
      id: 2, 
      nombre: "La Moderna Pehuajo", 
      whatsapp: "5491187654321",
      direccion: "Ruta 5 Km 370, Pehuajo"
    }
  ];

  // Renderiza el componente de cliente y pasa los datos como props
  return <VehiculoDetalleClient vehiculo={vehiculo} concesionarias={concesionarias} />;
}
