'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Car, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart2, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart2,
    href: '/admin',
  },
  {
    title: 'Vehículos',
    icon: Car,
    href: '/admin/vehiculos',
  },
  {
    title: 'Consultas',
    icon: MessageSquare,
    href: '/admin/consultas',
  },
  {
    title: 'Usuarios',
    icon: Users,
    href: '/admin/usuarios',
  },
  {
    title: 'Configuración',
    icon: Settings,
    href: '/admin/configuracion',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen transition-transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 border-r bg-card w-64
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <Car className="h-6 w-6" />
              <span className="font-bold text-xl">La Moderna</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm
                      transition-colors hover:bg-accent
                      ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">admin@lamoderna.com</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-margin
        ${sidebarOpen ? 'md:ml-64' : ''}
      `}>
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            {/* Aquí puedes agregar notificaciones, búsqueda, etc. */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 