'use client';

import { useState } from 'react';

export default function Filters() {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-2 px-3 shadow-md">
      <div className="max-w-7xl mx-auto">
        {/* Botón para mostrar/ocultar filtros */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between text-sm font-semibold mb-1"
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrar vehículos
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Filtros colapsables */}
        {showFilters && (
          <div className="pt-1 pb-2">
            {/* Filtros básicos en línea para ahorrar espacio */}
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex-1 min-w-[110px] bg-blue-800 bg-opacity-50 rounded p-1">
                <label className="block text-blue-200 text-xs mb-1">Marca</label>
                <select className="w-full bg-blue-700 border border-blue-600 rounded py-1 px-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="">Todas</option>
                  <option value="volkswagen">Volkswagen</option>
                  <option value="chevrolet">Chevrolet</option>
                  <option value="toyota">Toyota</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[110px] bg-blue-800 bg-opacity-50 rounded p-1">
                <label className="block text-blue-200 text-xs mb-1">Modelo</label>
                <select className="w-full bg-blue-700 border border-blue-600 rounded py-1 px-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="">Todos</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[110px] bg-blue-800 bg-opacity-50 rounded p-1">
                <label className="block text-blue-200 text-xs mb-1">Año</label>
                <select className="w-full bg-blue-700 border border-blue-600 rounded py-1 px-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="">Todos</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[110px] bg-blue-800 bg-opacity-50 rounded p-1">
                <label className="block text-blue-200 text-xs mb-1">Precio</label>
                <select className="w-full bg-blue-700 border border-blue-600 rounded py-1 px-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="">Todos</option>
                  <option value="0-10000000">Hasta $10M</option>
                  <option value="10000000-20000000">$10M - $20M</option>
                  <option value="20000000+">Más de $20M</option>
                </select>
              </div>
            </div>
            
            {/* Botón de búsqueda */}
            <div className="flex justify-end">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 text-xs font-bold px-3 py-1 rounded flex items-center justify-center transition-colors">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 