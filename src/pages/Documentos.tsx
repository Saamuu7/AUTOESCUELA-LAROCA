import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, FileText, Download, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Document {
    id: number | string;
    name: string;
    type: string;
    size: string;
    date: string;
    content?: string; // Base64 content
}

const initialDocuments: Document[] = [
    { id: 1, name: 'Reglamento General.pdf', type: 'PDF', size: '2.4 MB', date: '2024-12-01' },
    { id: 2, name: 'Tasas DGT 2025.pdf', type: 'PDF', size: '1.1 MB', date: '2024-11-28' },
    { id: 3, name: 'Hoja de Reclamaciones.doc', type: 'DOC', size: '0.5 MB', date: '2024-10-15' },
    { id: 4, name: 'Contrato Alumno Tipo.pdf', type: 'PDF', size: '3.2 MB', date: '2024-09-01' },
];

export default function Documentos() {
    const [documents, setDocuments] = useState<Document[]>(() => {
        const saved = localStorage.getItem('crm_documents');
        return saved ? JSON.parse(saved) : initialDocuments;
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('crm_documents', JSON.stringify(documents));
    }, [documents]);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit size to ~2MB for local storage safety
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "Archivo demasiado grande",
                description: "El archivo no puede superar los 2MB para esta demo.",
                variant: "destructive"
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const newDoc: Document = {
                id: Date.now(),
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                size: formatFileSize(file.size),
                date: format(new Date(), 'yyyy-MM-dd'),
                content: event.target?.result as string
            };

            setDocuments(prev => [newDoc, ...prev]);
            toast({
                title: "Archivo subido",
                description: `${file.name} se ha guardado correctamente.`
            });
        };
        reader.readAsDataURL(file);

        // Reset input
        e.target.value = '';
    };

    const handleDelete = (id: number | string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        toast({
            title: "Archivo eliminado",
            description: "El documento ha sido eliminado."
        });
    };

    const handleDownload = (doc: Document) => {
        if (doc.content) {
            const link = document.createElement('a');
            link.href = doc.content;
            link.download = doc.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast({
                title: "Descarga simulada",
                description: "Este es un archivo de demostración (sin contenido real)."
            });
        }
    };

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
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Subir Archivo
                    </Button>
                </div>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground">No hay documentos cargados</p>
                    <Button variant="link" onClick={() => fileInputRef.current?.click()}>Subir el primero</Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {documents.map((doc) => (
                        <Card key={doc.id} className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                                        <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="text-destructive cursor-pointer">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold leading-none truncate" title={doc.name}>{doc.name}</h3>
                                    <p className="text-sm text-muted-foreground">{doc.size} • {doc.date}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                                    onClick={() => handleDownload(doc)}
                                >
                                    <Download className="h-4 w-4" />
                                    Descargar
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
