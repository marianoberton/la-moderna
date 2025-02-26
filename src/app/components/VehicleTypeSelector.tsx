'use client';

interface VehicleTypeSelectorProps {
  tipoSeleccionado: string;
  onTipoChange: (tipo: string) => void;
}

export default function VehicleTypeSelector({ tipoSeleccionado, onTipoChange }: VehicleTypeSelectorProps) {
  const tipos = [
    { id: 'sedan', nombre: 'Sedán', icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8L5 4H19L21 8M3 8V16M3 8H21M21 8V16M3 16V19C3 19.5523 3.44772 20 4 20H6C6.55228 20 7 19.5523 7 19V18H17V19C17 19.5523 17.4477 20 18 20H20C20.5523 20 21 19.5523 21 19V16M3 16H21M7 14C7 14.5523 6.55228 15 6 15C5.44772 15 5 14.5523 5 14C5 13.4477 5.44772 13 6 13C6.55228 13 7 13.4477 7 14ZM19 14C19 14.5523 18.5523 15 18 15C17.4477 15 17 14.5523 17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'hatchback', nombre: 'Hatchback', icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8L5 4H16L19 8M3 8V16M3 8H19M19 8V16M3 16V19C3 19.5523 3.44772 20 4 20H6C6.55228 20 7 19.5523 7 19V18H15V19C15 19.5523 15.4477 20 16 20H18C18.5523 20 19 19.5523 19 19V16M3 16H19M7 14C7 14.5523 6.55228 15 6 15C5.44772 15 5 14.5523 5 14C5 13.4477 5.44772 13 6 13C6.55228 13 7 13.4477 7 14ZM17 14C17 14.5523 16.5523 15 16 15C15.4477 15 15 14.5523 15 14C15 13.4477 15.4477 13 16 13C16.5523 13 17 13.4477 17 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'suv', nombre: 'SUV', icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8L5 4H19L21 8M3 8V16M3 8H21M21 8V16M3 16V19C3 19.5523 3.44772 20 4 20H6C6.55228 20 7 19.5523 7 19V18H17V19C17 19.5523 17.4477 20 18 20H20C20.5523 20 21 19.5523 21 19V16M3 16H21M7 14C7 14.5523 6.55228 15 6 15C5.44772 15 5 14.5523 5 14C5 13.4477 5.44772 13 6 13C6.55228 13 7 13.4477 7 14ZM19 14C19 14.5523 18.5523 15 18 15C17.4477 15 17 14.5523 17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'pickup', nombre: 'Pickup', icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8L5 4H14V16H3V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 8H21L19 16H14V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 19.5C5 18.6716 5.67157 18 6.5 18C7.32843 18 8 18.6716 8 19.5C8 20.3284 7.32843 21 6.5 21C5.67157 21 5 20.3284 5 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 19.5C16 18.6716 16.6716 18 17.5 18C18.3284 18 19 18.6716 19 19.5C19 20.3284 18.3284 21 17.5 21C16.6716 21 16 20.3284 16 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'coupe', nombre: 'Coupé', icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8L6 4H18L21 8M3 8V16M3 8H21M21 8V16M3 16V19C3 19.5523 3.44772 20 4 20H6C6.55228 20 7 19.5523 7 19V18H17V19C17 19.5523 17.4477 20 18 20H20C20.5523 20 21 19.5523 21 19V16M3 16H21M7 14C7 14.5523 6.55228 15 6 15C5.44772 15 5 14.5523 5 14C5 13.4477 5.44772 13 6 13C6.55228 13 7 13.4477 7 14ZM19 14C19 14.5523 18.5523 15 18 15C17.4477 15 17 14.5523 17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'cabriolet', nombre: 'Cabriolet', icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10C3 9.44772 3.44772 9 4 9H20C20.5523 9 21 9.44772 21 10V16H3V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V9H7V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 16V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V18H16V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 14C7 14.5523 6.55228 15 6 15C5.44772 15 5 14.5523 5 14C5 13.4477 5.44772 13 6 13C6.55228 13 7 13.4477 7 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 14C19 14.5523 18.5523 15 18 15C17.4477 15 17 14.5523 17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  ];

  return (
    <div className="bg-surface-2 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-heading font-bold text-primary mb-4 uppercase">Tipo de vehículo</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {tipos.map((tipo) => (
          <button
            key={tipo.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 ${
              tipoSeleccionado === tipo.id 
                ? 'border-accent ring-2 ring-accent/30 bg-white shadow-md' 
                : 'border-border-light bg-white hover:bg-surface hover:border-accent/30'
            }`}
            onClick={() => onTipoChange(tipoSeleccionado === tipo.id ? '' : tipo.id)}
          >
            <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-2 ${
              tipoSeleccionado === tipo.id ? 'text-accent' : 'text-primary'
            }`}>
              {tipo.icono}
            </div>
            <h3 className={`text-sm font-medium ${tipoSeleccionado === tipo.id ? 'text-accent' : 'text-primary'}`}>
              {tipo.nombre}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
} 