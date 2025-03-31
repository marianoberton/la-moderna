'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface DataTableProps {
  data: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function DataTable({ data, onEdit, onDelete }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "marca",
      header: "Marca",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("marca")}</div>
          <div className="text-sm text-muted-foreground">{row.original.modelo}</div>
        </div>
      ),
    },
    {
      accessorKey: "version",
      header: "Versión",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("version")}>
          {row.getValue("version")}
        </div>
      ),
    },
    {
      accessorKey: "precio",
      header: "Precio",
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue("precio"));
        return (
          <div className="font-medium">
            ${precio.toLocaleString('es-AR')}
          </div>
        );
      },
    },
    {
      accessorKey: "año",
      header: "Año",
    },
    {
      accessorKey: "condicion",
      header: "Condición",
      cell: ({ row }) => {
        const condicion = row.getValue("condicion") as string;
        return (
          <Badge variant={condicion === "0km" ? "default" : "secondary"}>
            {condicion === "0km" ? "Nuevo" : "Usado"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "ubicacion",
      header: "Ubicación",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado") as string;
        const variant = 
          estado === "activo" ? "success" : 
          estado === "reservado" ? "warning" : "destructive";
        
        return (
          <Badge variant={variant as any}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              asChild
            >
              <a href={`/vehiculos/${row.original.id}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver</span>
              </a>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay vehículos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
} 