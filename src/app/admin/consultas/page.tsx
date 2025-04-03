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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

export default function ConsultasPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Consultas</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Exportar</Button>
          <Button>Nueva Consulta</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando consultas...</span>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground text-lg">Esta funcionalidad está en desarrollo</p>
          <p className="text-sm text-muted-foreground mt-2">Pronto podrás gestionar todas las consultas de tus clientes desde aquí.</p>
        </div>
      )}
    </div>
  );
} 