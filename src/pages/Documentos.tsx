import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, FileText, Download, MoreVertical, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock documents since they weren't in the original mockData for global use
const mockDocuments = [
    { id: 1, name: 'Reglamento General.pdf', type: 'PDF', size: '2.4 MB', date: '2024-12-01' },
    { id: 2, name: 'Tasas DGT 2025.pdf', type: 'PDF', size: '1.1 MB', date: '2024-11-28' },
    { id: 3, name: 'Hoja de Reclamaciones.doc', type: 'DOC', size: '0.5 MB', date: '2024-10-15' },
    { id: 4, name: 'Contrato Alumno Tipo.pdf', type: 'PDF', size: '3.2 MB', date: '2024-09-01' },
];

export default function Documentos() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FolderOpen className="h-8 w-8 text-primary" />
                        Documentos
                    </h1>
                    <p className="text-muted-foreground">
                        Gestión de archivos y documentación interna
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Subir Archivo
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {mockDocuments.map((doc) => (
                    <Card key={doc.id} className="group relative overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="rounded-lg bg-primary/10 p-3">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Renombrar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold leading-none truncate" title={doc.name}>{doc.name}</h3>
                                <p className="text-sm text-muted-foreground">{doc.size} • {doc.date}</p>
                            </div>
                            <Button variant="ghost" className="w-full mt-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="h-4 w-4" />
                                Descargar
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
