import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Search, ChevronDown, LogOut, User, Settings, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
};

const typeColors = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  success: 'text-green-500',
  error: 'text-red-500',
};

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'Administradora',
      profesora: 'Profesora',
      secretaria: 'Secretaria',
    };
    return roles[role] || role;
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-lg transition-all duration-300 ${sidebarCollapsed ? 'left-[70px]' : 'left-[260px]'
        }`}
    >
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar alumnos, profesores, clases..."
          className="pl-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {unreadCount} nuevas
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No hay notificaciones
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn("cursor-pointer items-start gap-3 p-3", !notification.read && "bg-muted/30")}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={cn("mt-1", typeColors[notification.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-sm font-medium leading-none", !notification.read && "text-primary")}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-muted-foreground">
                            {format(notification.createdAt, "d MMM, HH:mm", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>
            <DropdownMenuSeparator />
            <Link to="/notificaciones">
              <DropdownMenuItem className="cursor-pointer justify-center text-primary font-medium">
                Ver todas
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-2 hover:bg-secondary"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user ? getRoleName(user.role) : ''}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/perfil">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
            </Link>
            <Link to="/admin">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
