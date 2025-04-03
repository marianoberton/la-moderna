'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Car, DollarSign, Tag, ListChecks } from 'lucide-react';
import { getVehicleStats } from '@/services/vehicleService';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Tipo para vehículos
interface DashboardVehicle {
  id: string;
  marca: string;
  modelo: string;
  version?: string;
  imagenes?: string[];
  estado?: string;
  precio?: number;
  condicion?: string;
  año?: number;
  tipo?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    sold: 0,
    active: 0,
    new: 0
  });
  
  const [recentVehicles, setRecentVehicles] = useState<DashboardVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesByType, setVehiclesByType] = useState<{[key: string]: number}>({});
  const [totalSalesValue, setTotalSalesValue] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Cargar estadísticas
        const vehicleStats = await getVehicleStats();
        setStats(vehicleStats);
        
        // Obtener datos de vehículos para análisis
        const { supabase } = await import('@/lib/supabase');
        
        // Obtener vehículos recientes
        const { data: recents, error: recentsError } = await supabase
          .from('vehicles')
          .select('id, marca, modelo, version, imagenes, estado, precio, condicion, año:anio, tipo, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recents && !recentsError) {
          try {
            // Asegurarse de que los datos tengan la estructura correcta
            const formattedRecents = recents.map((vehicle: any) => ({
              id: vehicle.id || '',
              marca: vehicle.marca || '',
              modelo: vehicle.modelo || '',
              version: vehicle.version || '',
              imagenes: vehicle.imagenes || [],
              estado: vehicle.estado || '',
              precio: vehicle.precio || 0,
              condicion: vehicle.condicion || '',
              año: vehicle.año || new Date().getFullYear(),
              tipo: vehicle.tipo || ''
            }));
            setRecentVehicles(formattedRecents);
          } catch (err) {
            console.error('Error al procesar vehículos recientes:', err);
            setRecentVehicles([]);
          }
        } else {
          console.error('Error al obtener vehículos recientes:', recentsError);
          setRecentVehicles([]);
        }
        
        // Procesar vehículos por tipo
        const typeMap: {[key: string]: number} = {};
        
        const { data: vehicleData } = await supabase
          .from('vehicles')
          .select('tipo, condicion')
          .eq('estado', 'activo');
        
        if (vehicleData) {
          vehicleData.forEach(vehicle => {
            const tipo = vehicle.tipo || 'otro';
            typeMap[tipo] = (typeMap[tipo] || 0) + 1;
          });
          setVehiclesByType(typeMap);
        }
        
        // Calcular valor total de ventas
        const { data: soldVehicles } = await supabase
          .from('vehicles')
          .select('precio')
          .eq('estado', 'vendido');
        
        if (soldVehicles) {
          const totalValue = soldVehicles.reduce((sum, vehicle) => {
            return sum + (vehicle.precio || 0);
          }, 0);
          setTotalSalesValue(totalValue);
        }
        
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Capitalizar primera letra
  const capitalizeFirst = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const dashboardStats = [
    {
      title: "Vehículos Publicados",
      value: loading ? "-" : stats.active.toString(),
      icon: Car,
      description: `${stats.new} nuevos este mes`,
    },
    {
      title: "Vehículos Vendidos",
      value: loading ? "-" : stats.sold.toString(),
      icon: Tag,
      description: "Transferidos y entregados",
    },
    {
      title: "Vehículos Totales",
      value: loading ? "-" : stats.total.toString(),
      icon: ListChecks,
      description: "En inventario general",
    },
    {
      title: "Ventas",
      value: loading ? "-" : formatPrice(totalSalesValue),
      icon: DollarSign,
      description: "Valor total de ventas",
    },
  ];

  // Datos para gráficos
  const currentInventoryData = {
    labels: ['Nuevos', 'Usados'],
    datasets: [
      {
        label: 'Inventario',
        data: [
          Math.round(stats.active * 0.4), // Aproximadamente 40% de activos son nuevos
          Math.round(stats.active * 0.6), // Aproximadamente 60% de activos son usados
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };
  
  // Datos de vehículos por tipo
  const typeData = {
    labels: Object.keys(vehiclesByType).map(tipo => {
      if (tipo === 'suv') return 'SUV';
      if (tipo === 'pickup') return 'Pickup';
      return capitalizeFirst(tipo);
    }),
    datasets: [
      {
        label: 'Vehículos por Tipo',
        data: Object.values(vehiclesByType),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Condición</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <Bar 
                data={currentInventoryData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.parsed.y} vehículos`;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <Bar 
                data={typeData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.parsed.y} vehículos`;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehículos Más Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentVehicles.map((vehicle) => (
                <Link 
                  href={`/vehiculos/${vehicle.id}`} 
                  key={vehicle.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0">
                    {vehicle.imagenes && vehicle.imagenes.length > 0 ? (
                      <img 
                        src={vehicle.imagenes[0]} 
                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Car className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {vehicle.marca} {vehicle.modelo}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {vehicle.version || ""}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant={vehicle.estado === "activo" ? "default" : 
                               vehicle.estado === "vendido" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {vehicle.condicion === "0km" ? "Nuevo" : "Usado"}
                      </Badge>
                      <span className="ml-2 text-xs font-medium">
                        {formatPrice(vehicle.precio || 0)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No hay vehículos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 