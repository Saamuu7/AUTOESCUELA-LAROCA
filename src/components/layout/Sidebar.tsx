import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  BookOpen,
  TrendingUp,
  CreditCard,
  Bell,
  BarChart3,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Profesores', href: '/profesores', icon: Users },
  { name: 'Alumnos', href: '/alumnos', icon: GraduationCap },
  { name: 'Clases Prácticas', href: '/clases-practicas', icon: CalendarDays },
  { name: 'Clases Teóricas', href: '/clases-teoricas', icon: BookOpen },
  { name: 'Pagos', href: '/pagos', icon: CreditCard },
  { name: 'Notificaciones', href: '/notificaciones', icon: Bell },
  { name: 'Estadísticas', href: '/estadisticas', icon: BarChart3 },
  { name: 'Documentos', href: '/documentos', icon: FolderOpen },
  { name: 'Vehículos', href: '/vehiculos', icon: Car },
  { name: 'Administración', href: '/admin', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold text-sidebar-foreground">
                Autoescuela
              </span>
              <span className="font-display text-xs text-primary">La Roca</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          const linkContent = (
            <NavLink
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                  !isActive && 'group-hover:scale-110'
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.name}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Button */}
      <div className="absolute -right-3 top-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 rounded-full border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-sidebar-foreground" />
          )}
        </Button>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-center text-xs text-sidebar-foreground/50">
            <p>C/ Constitución, 11</p>
            <p>19003 Guadalajara</p>
            <p className="mt-1">949 12 14 91</p>
          </div>
        )}
      </div>
    </aside>
  );
}
