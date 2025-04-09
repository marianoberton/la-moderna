'use client';

import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BusinessHours() {
  return (
    <div className="mt-12">
      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-md">
        <div className="relative">
          {/* Fondo con gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-90" />
          
          {/* Contenido */}
          <div className="relative z-10 px-6 py-10 sm:px-8 sm:py-12">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                {/* Título e ícono */}
                <motion.div 
                  className="flex items-center gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-[var(--color-gold)]/20 rounded-full p-4 inline-flex">
                    <Clock className="h-10 w-10 text-[var(--color-gold)]" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-3xl text-white">HORARIO DE ATENCIÓN</h3>
                    <div className="h-1 w-20 bg-[var(--color-gold)] mt-3 rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Horarios */}
                <motion.div 
                  className="flex flex-col sm:flex-row items-center gap-12 md:gap-20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center">
                    <h4 className="font-medium text-white mb-2 uppercase text-sm tracking-wide">LUNES A VIERNES</h4>
                    <p className="text-gray-300 text-2xl md:text-3xl font-medium">8:00 - 12:00</p>
                    <p className="text-gray-300 text-2xl md:text-3xl font-medium">15:30 - 19:30</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-white mb-2 uppercase text-sm tracking-wide">SÁBADOS</h4>
                    <p className="text-gray-300 text-2xl md:text-3xl font-medium">8:00 - 12:00</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 