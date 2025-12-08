import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function PlaceholderPage() {
  const location = useLocation();
  
  const getPageName = () => {
    const path = location.pathname.replace('/', '');
    const names: Record<string, string> = {
      'clases-teoricas': 'Clases Teóricas',
      'seguimiento': 'Seguimiento y Progreso',
      'notificaciones': 'Notificaciones',
      'documentos': 'Gestión Documental',
      'admin': 'Panel de Administración',
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Construction className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{getPageName()}</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Este módulo está en desarrollo. Pronto estará disponible con todas las funcionalidades.
      </p>
    </div>
  );
}
