import Hero from './components/Hero';
import CarTypes from './components/CarTypes';
import FeaturedNew from './components/FeaturedNew';
import UsedCars from './components/UsedCars';
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <div className="py-16 container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary uppercase">
            Nuestros Vehículos
          </h2>
          <Separator className="w-24 bg-accent/50 h-1 mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra amplia selección de vehículos para todos los terrenos y necesidades.
            Calidad y confianza garantizada.
          </p>
        </div>
        <CarTypes />
      </div>
      
      <div className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary uppercase">
              Vehículos Destacados
            </h2>
            <Separator className="w-24 bg-accent/50 h-1 mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Los mejores vehículos seleccionados por nuestro equipo de expertos.
            </p>
          </div>
          <FeaturedNew />
        </div>
      </div>
      
      <div className="py-16 container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary uppercase">
            Vehículos Usados
          </h2>
          <Separator className="w-24 bg-accent/50 h-1 mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vehículos usados en excelente estado, inspeccionados y con garantía.
          </p>
        </div>
        <UsedCars />
      </div>
    </div>
  );
}
