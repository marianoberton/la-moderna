'use client';

import React from 'react';
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QRCodeDialog } from './QRCodeDialog';

interface CardViewProps {
  data: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: 'activo' | 'vendido' | 'reservado' | 'en_pausa') => void;
}

export function CardView({ data, onEdit, onDelete, onUpdateStatus }: CardViewProps) {
  // Función para formatear el precio
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "$0";
    return `$${price.toLocaleString('es-AR')}`;
  };

  // Función para determinar la clase de estado
  const getStatusVariant = (estado: string | undefined) => {
    if (!estado) return "outline";
    return estado === "activo" ? "default" : 
           estado === "reservado" ? "secondary" : 
           estado === "vendido" ? "destructive" : "outline";
  };

  // Formato amigable del estado
  const getStatusDisplay = (estado: string | undefined) => {
    if (!estado) return "Desconocido";
    return estado === "activo" ? "Disponible" : 
           estado === "reservado" ? "Reservado" : 
           estado === "vendido" ? "Vendido" : 
           estado === "en_pausa" ? "En Pausa" : estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground text-lg">No hay vehículos registrados</p>
        </div>
      ) : (
        data.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-40 bg-muted">
              {vehicle.imagenes && vehicle.imagenes.length > 0 ? (
                <img 
                  src={vehicle.imagenes[0]} 
                  alt={`${vehicle.marca} ${vehicle.modelo}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                  Sin imagen
                </div>
              )}
              
              {/* Estado del vehículo como badge flotante */}
              {onUpdateStatus ? (
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 px-2 py-0 bg-background/80 backdrop-blur-sm hover:bg-background/90">
                        <Badge 
                          variant={getStatusVariant(vehicle.estado) as any}
                          className={`cursor-pointer ${vehicle.estado === "activo" ? "bg-green-500" : vehicle.estado === "reservado" ? "bg-amber-500" : ""}`}
                        >
                          {getStatusDisplay(vehicle.estado)}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className={vehicle.estado === "activo" ? "font-bold" : ""}
                        onClick={() => onUpdateStatus(String(vehicle.id), "activo")}
                      >
                        <Badge variant="default" className="mr-2 bg-green-500">•</Badge> Disponible
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={vehicle.estado === "reservado" ? "font-bold" : ""}
                        onClick={() => onUpdateStatus(String(vehicle.id), "reservado")}
                      >
                        <Badge variant="secondary" className="mr-2 bg-amber-500">•</Badge> Reservado
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={vehicle.estado === "vendido" ? "font-bold" : ""}
                        onClick={() => onUpdateStatus(String(vehicle.id), "vendido")}
                      >
                        <Badge variant="destructive" className="mr-2">•</Badge> Vendido
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={vehicle.estado === "en_pausa" ? "font-bold" : ""}
                        onClick={() => onUpdateStatus(String(vehicle.id), "en_pausa")}
                      >
                        <Badge variant="outline" className="mr-2">•</Badge> En Pausa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant={getStatusVariant(vehicle.estado) as any}
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    {getStatusDisplay(vehicle.estado)}
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-base leading-none tracking-tight">
                  {vehicle.marca} {vehicle.modelo}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1" title={vehicle.version}>
                  {vehicle.version}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="font-semibold text-base">
                    {formatPrice(vehicle.precio)}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">
                      {vehicle.condicion === "0km" ? "Nuevo" : "Usado"} · {vehicle.año}
                    </p>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      {vehicle.ubicacion}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0 flex flex-col gap-2">
              <div className="flex justify-between w-full gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 h-8 px-2"
                  onClick={() => onEdit(vehicle)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="ml-1 text-xs">Editar</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 px-2 text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(String(vehicle.id))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="ml-1 text-xs">Eliminar</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 h-8 px-2"
                  asChild
                >
                  <a href={`/vehiculos/${vehicle.id}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="ml-1 text-xs">Ver</span>
                  </a>
                </Button>
              </div>
              
              {/* QR Code Button */}
              <QRCodeDialog
                vehicleId={String(vehicle.id || '')}
                brandModel={`${vehicle.marca || ''} ${vehicle.modelo || ''}`}
                variant="full"
              />
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
} 