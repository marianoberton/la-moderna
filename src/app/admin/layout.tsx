'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Car, 
  MessageSquare, 
  Settings, 
  BarChart2, 
  Menu,
  X,
  Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    submenu: [
      {
        title: 'Todos',
        icon: Car,
        href: '/admin/vehiculos',
      },
      {
        title: 'Destacados',
        icon: Star,
        href: '/admin/vehiculos/destacados',
      }
    ]
  },
  {
    title: 'Consultas',
    icon: MessageSquare,
    href: '/admin/consultas',
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSubmenu = (href: string) => {
    if (expandedMenu === href) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(href);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-background border-r transition-all duration-300`}>
        <div className="p-4 flex items-center">
          {isSidebarOpen ? (
            <Link href="/admin" className="flex-1">
              <Image 
                src="/images/logo_full.svg"
                alt="La Moderna"
                width={160}
                height={40}
                className="h-8 w-auto dark:invert"
                priority
              />
            </Link>
          ) : null}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`h-10 w-10 ${!isSidebarOpen ? 'mx-auto' : ''}`}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-2 space-y-1">
            {menuItems.map((item) => (
              <div key={item.href}>
                {item.submenu ? (
                  <>
                    <Button
                      variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                      className={`w-full justify-start ${!isSidebarOpen ? 'px-2' : ''}`}
                      onClick={() => toggleSubmenu(item.href)}
                    >
                      <item.icon className={`h-4 w-4 ${!isSidebarOpen ? 'mx-auto' : 'mr-2'}`} />
                      {isSidebarOpen && (
                        <div className="flex flex-1 items-center justify-between">
                          <span>{item.title}</span>
                          <span className="text-xs">
                            {expandedMenu === item.href ? '▼' : '▶'}
                          </span>
                        </div>
                      )}
                    </Button>
                    
                    {isSidebarOpen && expandedMenu === item.href && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href}>
                            <Button
                              variant={pathname === subItem.href ? "secondary" : "ghost"}
                              className="w-full justify-start"
                              size="sm"
                            >
                              <subItem.icon className="h-3.5 w-3.5 mr-2" />
                              {subItem.title}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={`w-full justify-start ${!isSidebarOpen ? 'px-2' : ''}`}
                    >
                      <item.icon className={`h-4 w-4 ${!isSidebarOpen ? 'mx-auto' : 'mr-2'}`} />
                      {isSidebarOpen && item.title}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-16 border-b flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold">
            {(() => {
              // Check if current pathname is in submenu
              for (const item of menuItems) {
                if (item.submenu) {
                  const foundSubItem = item.submenu.find(subItem => subItem.href === pathname);
                  if (foundSubItem) {
                    return foundSubItem.title;
                  }
                }
              }
              // Default to direct menu item
              return menuItems.find(item => item.href === pathname)?.title || 'Dashboard';
            })()}
          </h2>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
} 