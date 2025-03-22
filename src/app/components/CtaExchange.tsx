'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeDollarSign, RefreshCw, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CtaExchange() {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hola, me gustaría cotizar mi vehículo para un posible cambio por uno nuevo.");
    window.open(`https://wa.me/5491123456789?text=${message}`, '_blank');
  };

  return (
    <section className="py-10">
      <div className="container px-4 sm:px-6">
        <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-lg">
          <div className="relative">
            {/* Fondo con gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1a2335] to-[#111827] opacity-80" />
            
            {/* Contenido principal - grid de dos columnas */}
            <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-6 px-8 py-10 sm:px-12 sm:py-12 md:px-12">
              {/* Columna izquierda - Texto y detalles */}
              <div className="space-y-8">
                {/* Título y descripción */}
                <div>
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Cambiá tu vehículo por uno
                    <span className="block mt-1">0KM sin complicaciones</span>
                  </motion.h2>
                  
                  <motion.p 
                    className="mt-4 text-white/80"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    Te ofrecemos la mejor tasación por tu usado. Consultá al instante y descubrí todas las opciones que tenemos para vos.
                  </motion.p>
                </div>
                
                {/* Beneficios */}
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 bg-white/10 rounded-full p-2.5">
                      <BadgeDollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase text-sm tracking-wide">Mejor precio por tu usado</h4>
                      <p className="text-sm text-white/70">Valoración justa y transparente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 bg-white/10 rounded-full p-2.5">
                      <RefreshCw className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase text-sm tracking-wide">Proceso simple y rápido</h4>
                      <p className="text-sm text-white/70">Sin papeleos innecesarios ni esperas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 bg-white/10 rounded-full p-2.5">
                      <ThumbsUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white uppercase text-sm tracking-wide">Atención personalizada</h4>
                      <p className="text-sm text-white/70">Te acompañamos en todo el proceso</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Botón de acción */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="pt-2"
                >
                  <Button
                    onClick={openWhatsApp}
                    className="group bg-white hover:bg-white/90 text-black rounded-full px-7 py-6 text-base font-medium transition-all shadow-lg"
                  >
                    <span className="flex items-center">
                      Cotizá tu vehículo ahora
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </motion.div>
              </div>
              
              {/* Columna derecha - Imagen */}
              <div className="flex items-center justify-center">
                <div className="w-full h-full max-h-[400px] relative">
                  {/* Usando img estándar en lugar de Image de Next.js para probar */}
                  <img 
                    src="/images/cotiza-usado.jpeg"
                    alt="Acuerdo de compra-venta de vehículo" 
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}