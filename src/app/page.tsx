import Hero from './components/Hero';
import CarTypes from './components/CarTypes';
import FeaturedNew from './components/FeaturedNew';
import UsedCars from './components/UsedCars';
import CtaExchange from './components/CtaExchange';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <div className="py-4 container">
        <CarTypes />
      </div>
      
      <div className="bg-muted/30 pt-4 pb-2">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
        </div>
        <FeaturedNew />
      </div>
      
      <CtaExchange />
      
      <div className="pt-4 pb-8 container">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
        </div>
        <UsedCars />
      </div>
    </div>
  );
}
