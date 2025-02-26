'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VehicleConditionSelectorProps {
  condicion: string;
  onCondicionChange: (condicion: string) => void;
}

export default function VehicleConditionSelector({
  condicion,
  onCondicionChange
}: VehicleConditionSelectorProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">¿Qué estás buscando?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "h-auto py-6 flex flex-col items-center",
              condicion === "nuevos" && "border-primary bg-primary/5"
            )}
            onClick={() => onCondicionChange("nuevos")}
          >
            <div className="w-12 h-12 mb-2">
              {/* Icono de 0km */}
            </div>
            <span className="font-semibold">Vehículos 0km</span>
            <span className="text-sm text-muted-foreground">
              Nuevos con garantía de fábrica
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className={cn(
              "h-auto py-6 flex flex-col items-center",
              condicion === "usados" && "border-primary bg-primary/5"
            )}
            onClick={() => onCondicionChange("usados")}
          >
            <div className="w-12 h-12 mb-2">
              {/* Icono de usados */}
            </div>
            <span className="font-semibold">Vehículos Usados</span>
            <span className="text-sm text-muted-foreground">
              Seleccionados y garantizados
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 