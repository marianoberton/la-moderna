import { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Calendar, Trophy, Users, Star, Heart } from 'lucide-react';
import BusinessHours from '../components/BusinessHours';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | La Moderna Automotores',
  description: 'La Moderna: concesionaria con más de 50 años de experiencia. Especialistas en venta de vehículos 0km y usados, con sedes en Trenque Lauquen y Pehuajó.'
};

export default function SobreNosotrosPage() {
  return (
    <div className="container max-w-7xl mx-auto pb-16 pt-28 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Nosotros</h1>
        <div className="h-1 w-20 bg-[var(--color-gold)] mx-auto mb-6 rounded-full"></div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Desde 1972, La Moderna se destaca por su experiencia, seriedad y compromiso. Con más de 50 años en el mercado, 
          ofrecemos una atención personalizada y soluciones confiables para quienes buscan un vehículo con respaldo y seguridad.
        </p>
      </div>

      {/* Historia y Trayectoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
        <div className="order-2 lg:order-1 space-y-6">
          <h2 className="text-3xl font-bold mb-4">Entre Nosotros</h2>
          <div className="h-1 w-16 bg-[var(--color-gold)] mb-6 rounded-full"></div>
          
          <p className="text-muted-foreground">
            La Moderna es una concesionaria con más de 50 años de trayectoria. Iniciamos nuestras actividades en 1972 como un negocio familiar, 
            con el objetivo de brindar un servicio serio, transparente y cercano a cada cliente. Hoy seguimos con ese mismo compromiso, 
            con presencia en Trenque Lauquen y Pehuajó.
          </p>
          
          <p className="text-muted-foreground">
            Nos especializamos en la venta de vehículos de todo tipo: sedanes, pick-ups, SUVs y 4x4. 
            Ofrecemos atención personalizada en cada paso del proceso. Escuchamos a nuestros clientes, 
            entendemos sus necesidades y buscamos soluciones que se adapten a sus posibilidades, 
            ya sea a través de permutas, planes de financiación o asesoramiento directo.
          </p>
          
          <p className="text-muted-foreground">
            Nuestro enfoque está en construir relaciones de confianza a largo plazo. Por eso, muchos de nuestros clientes vuelven y nos recomiendan. 
            Sabemos que elegir un vehículo es una decisión importante, y nuestro equipo está preparado para acompañar esa elección 
            con seriedad, claridad y compromiso.
          </p>
          
          <p className="text-muted-foreground">
            En La Moderna, creemos que un buen servicio comienza con una buena escucha. Y ese ha sido nuestro diferencial desde el primer día.
          </p>
        </div>
        
        <div className="order-1 lg:order-2 rounded-xl overflow-hidden shadow-lg relative h-[400px] lg:h-[500px]">
          <Image 
            src="/images/cotiza-usado.jpeg" 
            alt="Historia de La Moderna Automotores" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-[var(--color-gold)]" />
              <span className="font-semibold">Desde 1972</span>
            </div>
            <h3 className="text-2xl font-bold">Más de 50 años de experiencia</h3>
          </div>
        </div>
      </div>

      {/* Valores y Diferencial */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
          <div className="h-1 w-16 bg-[var(--color-gold)] mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Estos principios guían nuestro trabajo diario y definen la manera en que nos relacionamos con cada cliente
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[var(--color-gold)]/20 rounded-full p-3 inline-flex mb-4">
              <Users className="h-6 w-6 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Enfoque en el Cliente</h3>
            <p className="text-muted-foreground">
              Te escuchamos, te asesoramos, y te acompañamos en cada paso. En La Moderna, comprar un auto es simple, seguro y con respaldo.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[var(--color-gold)]/20 rounded-full p-3 inline-flex mb-4">
              <Trophy className="h-6 w-6 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Experiencia</h3>
            <p className="text-muted-foreground">
              Más de 50 años en el mercado nos respaldan. Nuestra trayectoria nos permite ofrecer un servicio profesional y de calidad.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[var(--color-gold)]/20 rounded-full p-3 inline-flex mb-4">
              <Star className="h-6 w-6 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transparencia</h3>
            <p className="text-muted-foreground">
              Claridad en cada operación. Brindamos información honesta sobre los vehículos y todas las condiciones de compra.
            </p>
          </div>
          
          {/* Card 4 */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[var(--color-gold)]/20 rounded-full p-3 inline-flex mb-4">
              <Heart className="h-6 w-6 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compromiso</h3>
            <p className="text-muted-foreground">
              Construimos relaciones a largo plazo. Muchos de nuestros clientes vuelven y nos recomiendan porque valoran nuestro servicio.
            </p>
          </div>
        </div>
      </div>
      
      {/* Propuesta de Valor */}
      <div className="bg-neutral-900 text-white rounded-xl p-8 mb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-90"></div>
        
        <div className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Nuestra Propuesta de Valor</h2>
            <div className="h-1 w-16 bg-[var(--color-gold)] mx-auto mb-8 rounded-full"></div>
            
            <p className="text-xl mb-6 text-gray-300">
              "Entendemos que elegir un auto es una decisión importante. Por eso, en La Moderna te escuchamos, 
              te asesoramos y te ofrecemos opciones pensadas para vos: desde la entrega de tu usado hasta planes 
              de financiación adaptados a tu necesidad. Nuestra prioridad es que te sientas acompañado y seguro."
            </p>
            
            <p className="text-xl text-gray-300 mb-8">
              "Venta de autos 0km y usados, permutas, financiación personalizada y atención profesional. 
              En La Moderna simplificamos tu próxima compra con soluciones claras, ágiles y seguras."
            </p>
            
            <Button 
              asChild 
              className="bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)] text-black rounded-full px-8 py-6 text-base font-medium transition-all"
            >
              <Link href="/vehiculos" className="inline-flex items-center">
                Explorar Vehículos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sección CTA - Estilo similar al componente CtaExchange */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center bg-card border border-border rounded-xl p-8 shadow-md">
        <div>
          <h2 className="text-3xl font-bold mb-4">¿Querés cambiar tu vehículo?</h2>
          <div className="h-1 w-16 bg-[var(--color-gold)] mb-6 rounded-full"></div>
          <p className="text-muted-foreground mb-6">
            En La Moderna, te ofrecemos la mejor tasación por tu vehículo usado. Consultá sin compromiso 
            y descubrí todas las opciones que tenemos para vos.
          </p>
          <Button 
            asChild 
            className="bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)] text-black rounded-full px-8 py-6 text-base font-medium transition-all"
          >
            <Link href="/#cotiza" className="inline-flex items-center">
              Cotizá tu vehículo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg relative h-[300px]">
          <Image 
            src="/images/cotiza-usado.jpeg" 
            alt="Cotizá tu vehículo" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>
      
      {/* Sección de horarios */}
      <div className="mb-12">
        <BusinessHours />
      </div>
    </div>
  );
} 