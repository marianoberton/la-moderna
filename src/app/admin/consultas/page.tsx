'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Consulta {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  vehiculo: string;
  mensaje: string;
  estado: 'pendiente' | 'respondida' | 'cerrada';
  fecha: Date;
}

export default function ConsultasPage() {
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);

  // Datos de ejemplo
  const consultas: Consulta[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      telefono: '1234567890',
      email: 'juan@example.com',
      vehiculo: 'Volkswagen Amarok 2023',
      mensaje: 'Me interesa conocer más detalles sobre el vehículo...',
      estado: 'pendiente',
      fecha: new Date(),
    },
    // Más consultas...
  ];

  const getEstadoBadge = (estado: Consulta['estado']) => {
    const variants = {
      pendiente: 'warning',
      respondida: 'success',
      cerrada: 'secondary',
    };

    return (
      <Badge variant={variants[estado] as any}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultas</h1>
        <div className="space-x-2">
          <Button variant="outline">Exportar</Button>
          <Button>Nueva Consulta</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultas.map((consulta) => (
              <TableRow key={consulta.id}>
                <TableCell>
                  {format(consulta.fecha, 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{consulta.nombre}</div>
                    <div className="text-sm text-muted-foreground">
                      {consulta.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{consulta.vehiculo}</TableCell>
                <TableCell>{getEstadoBadge(consulta.estado)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedConsulta(consulta)}
                  >
                    Ver detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedConsulta} onOpenChange={() => setSelectedConsulta(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Consulta</DialogTitle>
          </DialogHeader>
          {selectedConsulta && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Cliente</h4>
                  <p>{selectedConsulta.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConsulta.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConsulta.telefono}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Vehículo</h4>
                  <p>{selectedConsulta.vehiculo}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Mensaje</h4>
                <p className="mt-1">{selectedConsulta.mensaje}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Marcar como respondida</Button>
                <Button>Responder</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 