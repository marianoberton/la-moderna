'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Car, DollarSign, Users, MessageSquare } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const stats = [
  {
    title: "Vehículos Totales",
    value: "124",
    icon: Car,
    description: "12 nuevos este mes",
  },
  {
    title: "Consultas Pendientes",
    value: "8",
    icon: MessageSquare,
    description: "3 nuevas hoy",
  },
  {
    title: "Ventas del Mes",
    value: "$12.5M",
    icon: DollarSign,
    description: "+15% vs mes anterior",
  },
  {
    title: "Usuarios Activos",
    value: "1,234",
    icon: Users,
    description: "+22% vs mes anterior",
  },
];

export default function AdminDashboard() {
  const ventasData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas 2024',
        data: [12, 19, 15, 17, 22, 24],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const vehiculosData = {
    labels: ['0KM', 'Usados'],
    datasets: [
      {
        label: 'Inventario',
        data: [45, 79],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={ventasData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={vehiculosData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de últimas consultas */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehículos Más Vistos</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de vehículos más vistos */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 