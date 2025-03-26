'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const concesionarias = [
  { 
    id: 1, 
    nombre: "La Moderna T. Lauquen", 
    whatsapp: "5491154645940",
    direccion: "Av. Garcia Salinas 1163"
  },
  { 
    id: 2, 
    nombre: "La Moderna Pehuajo", 
    whatsapp: "5492396625108",
    direccion: "Acceso Pres. Nestor C. Kirchner 1151"
  }
];

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const openWhatsApp = (whatsapp: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en información sobre vehículos`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Menú desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
            style={{ width: '280px' }}
          >
            <div className="p-4">
              <h4 className="font-bold text-center uppercase mb-3 text-sm">Contactar via WhatsApp</h4>
              <div className="space-y-3">
                {concesionarias.map((concesionaria) => (
                  <button
                    key={concesionaria.id}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-md flex items-center text-sm transition-colors"
                    onClick={() => openWhatsApp(concesionaria.whatsapp)}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#25D366] mr-3 flex-shrink-0">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        className="h-6 w-6 text-white fill-current"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{concesionaria.nombre}</div>
                      <div className="text-xs text-gray-500">{concesionaria.direccion}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de WhatsApp */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-8 h-8 text-white fill-current"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.button>
    </>
  );
} 