import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const typeIcons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: AlertCircle,
};

const typeColors = {
    info: 'text-blue-500 bg-blue-50',
    warning: 'text-yellow-500 bg-yellow-50',
    success: 'text-green-500 bg-green-50',
    error: 'text-red-500 bg-red-50',
};

export default function Notificaciones() {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Bell className="h-8 w-8 text-primary" />
                        Notificaciones
                    </h1>
                    <p className="text-muted-foreground">
                        Avisos y alertas del sistema
                    </p>
                </div>
                {notifications.some(n => !n.read) && (
                    <Button variant="outline" onClick={markAllAsRead}>
                        Marcar todas como leídas
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Últimas Notificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">No tienes notificaciones pendientes.</p>
                        ) : (
                            notifications.map((notification) => {
                                const Icon = typeIcons[notification.type];
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "flex items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-muted/50",
                                            !notification.read && "bg-muted/30 border-primary/20"
                                        )}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className={cn("rounded-full p-2", typeColors[notification.type])}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className={cn("font-medium", !notification.read && "text-primary")}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(notification.createdAt, "d MMM, HH:mm", { locale: es })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                            {notification.link && (
                                                <Link
                                                    to={notification.link}
                                                    className="text-xs font-medium text-primary hover:underline block pt-1"
                                                    onClick={(e) => e.stopPropagation()} // Prevent double click event if link is clicked
                                                >
                                                    Ver detalles
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
