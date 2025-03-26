import ContactForm from '../components/ContactForm';
import BranchMap from '../components/BranchMap';
import BusinessHours from '../components/BusinessHours';
import { branches } from '../types/branches';

export const metadata = {
  title: 'Contacto | La Moderna Automotores',
  description: 'Contacta con La Moderna Automotores. Estamos aquí para ayudarte con todas tus consultas sobre vehículos nuevos y usados.'
};

export default function ContactPage() {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Contacto</h1>
      <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
        Estamos acá para ayudarte. Completa el formulario o visítanos en alguna de nuestras sucursales.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Columna del formulario */}
        <div className="bg-card p-6 rounded-lg shadow-sm h-full flex flex-col">
          <ContactForm />
        </div>
        
        {/* Columna del mapa y sucursales */}
        <div className="h-full">
          <div className="bg-card p-6 rounded-lg shadow-sm h-full flex flex-col">
            <BranchMap branches={branches} />
          </div>
        </div>
      </div>

      {/* Sección de horarios */}
      <div className="mt-20 mb-12">
        <BusinessHours />
      </div>
    </div>
  );
} 