'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientImage from '../components/ClientImage';
import VehicleFilters from '../components/VehicleFilters';

export default function VehiculosPage() {
  const [ordenar, setOrdenar] = useState('nuevos');
  const [filtros, setFiltros] = useState({});
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  
  // Actualizar los vehículos con las imágenes nuevas
  const vehiculos = [
    {
      id: 1,
      marca: 'Volkswagen',
      modelo: 'Amarok',
      version: 'AMAROK 2.0 HIGHLINE 4X4 AT',
      precio: 28500000,
      año: 2020,
      km: 65000,
      transmision: 'Automática',
      combustible: 'Diesel',
      imagen: '/images/Usado/amarok_usada.jpg',
      fotos: 18
    },
    {
      id: 2,
      marca: 'Volkswagen',
      modelo: 'Amarok',
      version: 'AMAROK 2.0 COMFORTLINE 4X2 MT',
      precio: 24900000,
      año: 2019,
      km: 78000,
      transmision: 'Manual',
      combustible: 'Diesel',
      imagen: '/images/Usado/amarokusada.jpg',
      fotos: 15
    },
    {
      id: 3,
      marca: 'Toyota',
      modelo: 'Corolla',
      version: 'COROLLA 1.8 XEI CVT',
      precio: 19800000,
      año: 2021,
      km: 35000,
      transmision: 'Automática CVT',
      combustible: 'Nafta',
      imagen: '/images/Usado/corolla1.jpg',
      fotos: 24
    },
    {
      id: 4,
      marca: 'Chevrolet',
      modelo: 'Cruze',
      version: 'CRUZE 1.4 LTZ AT',
      precio: 17500000,
      año: 2019,
      km: 48000,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/Usado/cruzeusado.jpg',
      fotos: 16
    },
    {
      id: 5,
      marca: 'Toyota',
      modelo: 'Hilux',
      version: 'HILUX 2.8 SRX 4X4 AT',
      precio: 32500000,
      año: 2021,
      km: 48000,
      transmision: 'Automática',
      combustible: 'Diesel',
      imagen: '/images/Usado/hilux1.jpg',
      fotos: 22
    },
    {
      id: 6,
      marca: 'Volkswagen',
      modelo: 'Golf',
      version: 'GOLF 1.4 TSI HIGHLINE DSG',
      precio: 21500000,
      año: 2020,
      km: 42000,
      transmision: 'Automática DSG',
      combustible: 'Nafta',
      imagen: '/images/Usado/golf1 (2).jpg',
      fotos: 20
    },
    {
      id: 7,
      marca: 'Volkswagen',
      modelo: 'Taos',
      version: 'TAOS 1.4 HIGHLINE DSG',
      precio: 27500000,
      año: 2022,
      km: 32000,
      transmision: 'Automática DSG',
      combustible: 'Nafta',
      imagen: '/images/Usado/taos_usada.jpg',
      fotos: 18
    },
    {
      id: 8,
      marca: 'Chevrolet',
      modelo: 'Tracker',
      version: 'TRACKER 1.2 PREMIER AT',
      precio: 23900000,
      año: 2021,
      km: 38000,
      transmision: 'Automática',
      combustible: 'Nafta',
      imagen: '/images/Usado/tracker_usada.jpg',
      fotos: 19
    }
  ];

  // Actualizar vehículos filtrados cuando cambian los filtros
  useEffect(() => {
    // Aquí iría la lógica para filtrar los vehículos según los filtros aplicados
    setVehiculosFiltrados(vehiculos);
  }, [filtros]);

  // Formatea el precio en formato argentino
  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(precio);
  };

  // Manejar cambios en los filtros
  const handleFiltersChange = (newFilters: any) => {
    setFiltros(newFilters);
  };

  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Panel de búsqueda principal */}
      <div className="bg-surface py-8 shadow-soft relative overflow-hidden border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Componente de filtros unificado */}
          <VehicleFilters 
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>

      {/* Sección de resultados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Encabezado de resultados */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 md:mb-0 flex items-center">
            <span className="bg-accent text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">{vehiculosFiltrados.length}</span>
            vehículos encontrados
          </h2>
          <div className="flex items-center bg-surface rounded-lg shadow-sm px-4 py-2 border border-border-light">
            <span className="mr-3 text-muted font-medium">Ordenar:</span>
            <select 
              className="p-2 border-0 rounded appearance-none bg-surface text-primary focus:outline-none"
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
            >
              <option value="nuevos">Nuevos ingresos</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="año_desc">Más nuevos</option>
              <option value="año_asc">Más antiguos</option>
              <option value="km_asc">Menos km</option>
              <option value="km_desc">Más km</option>
            </select>
          </div>
        </div>

        {/* Cuadrícula de vehículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehiculosFiltrados.map((vehiculo, index) => (
            <div 
              key={vehiculo.id} 
              className="bg-surface rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={`/vehiculos/${vehiculo.id}`} className="block">
                <div className="relative">
                  <ClientImage 
                    src={vehiculo.imagen}
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vehiculo.fotos}
                  </div>
                  {vehiculo.km === 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-accent to-accent/80 text-white text-xs py-1 px-3 rounded-md font-semibold shadow-sm">
                      NUEVO
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-primary">{vehiculo.marca} {vehiculo.modelo}</h3>
                    <div className="bg-surface-2 text-primary text-xs px-2 py-1 rounded font-medium">
                      {vehiculo.año}
                    </div>
                  </div>
                  <p className="text-sm text-muted mb-3 line-clamp-1">{vehiculo.version}</p>
                  <p className="text-xl font-bold text-accent mb-4 group-hover:text-accent/90 transition-colors">{formatPrecio(vehiculo.precio)}</p>
                  
                  <div className="flex justify-between text-sm text-muted pt-3 border-t border-border-light">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {vehiculo.transmision}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {vehiculo.km > 0 ? vehiculo.km.toLocaleString() + ' km' : 'Nuevo'}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-12">
          <nav className="inline-flex rounded-lg shadow-sm overflow-hidden">
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">Anterior</a>
            <a href="#" className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors font-medium text-sm">1</a>
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">2</a>
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">3</a>
            <a href="#" className="px-4 py-2 bg-surface border border-border-light text-primary hover:bg-surface-2 transition-colors font-medium text-sm">Siguiente</a>
          </nav>
        </div>
      </div>

      {/* Botón de volver arriba */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-50 bg-accent hover:bg-accent/90 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Volver arriba"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}


