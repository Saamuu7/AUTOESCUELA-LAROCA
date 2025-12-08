import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { mockTeachers } from '@/data/mockData';
import type { Teacher } from '@/types/crm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

export default function Profesores() {
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const handleDelete = (id: string) => {
        setTeachers(teachers.filter(t => t.id !== id));
        toast({
            title: 'Profesor eliminado',
            description: 'El profesor ha sido eliminado correctamente.',
        });
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // In a real app we would handle the photo upload properly
        // For now we preserve existing photo if editing, or no photo for new

        const newTeacher: Teacher = {
            id: editingTeacher?.id || String(Date.now()),
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            role: formData.get('role') as 'teoricas' | 'practicas' | 'ambas',
            active: true,
            createdAt: editingTeacher?.createdAt || new Date(),
            availability: editingTeacher?.availability || {
                monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
            },
            stats: editingTeacher?.stats || {
                totalClasses: 0,
                thisMonth: 0,
                successRate: 0,
                activeStudents: 0
            },
            photo: editingTeacher?.photo // Preserve photo
        };

        if (editingTeacher) {
            setTeachers(teachers.map(t => t.id === editingTeacher.id ? newTeacher : t));
            toast({
                title: 'Profesor actualizado',
                description: 'Los datos del profesor han sido actualizados.',
            });
        } else {
            setTeachers([...teachers, newTeacher]);
            toast({
                title: 'Profesor añadido',
                description: 'Nuevo profesor incorporado al equipo.',
            });
        }

        setIsDialogOpen(false);
        setEditingTeacher(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <UsersIcon className="h-8 w-8 text-primary" />
                        Equipo Docente
                    </h1>
                    <p className="text-muted-foreground">
                        Gestión de profesores y monitores ({teachers.length})
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingTeacher(null)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Profesor
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingTeacher ? 'Editar Profesor' : 'Nuevo Profesor'}
                            </DialogTitle>
                            <DialogDescription>
                                Añade o modifica los datos de un profesor.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={editingTeacher?.name}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={editingTeacher?.email}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={editingTeacher?.phone}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rol / Especialidad</Label>
                                <Select name="role" defaultValue={editingTeacher?.role || 'ambas'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="practicas">Prácticas</SelectItem>
                                        <SelectItem value="teoricas">Teóricas</SelectItem>
                                        <SelectItem value="ambas">Ambas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {editingTeacher ? 'Guardar Cambios' : 'Añadir Profesor'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                    <Card key={teacher.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 bg-muted/30 pb-4">
                            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                <AvatarImage src={teacher.photo} />
                                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                    {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">{teacher.name}</CardTitle>
                                <CardDescription className="truncate">{teacher.email}</CardDescription>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="capitalize">
                                        {teacher.role}
                                    </Badge>
                                    {teacher.active && (
                                        <Badge variant="success" className="h-5">Activo</Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{teacher.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(teacher.createdAt), 'MMM yyyy', { locale: es })}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-y bg-muted/10 rounded-lg p-2">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Alumnos</p>
                                    <p className="text-lg font-bold text-primary">{teacher.stats.activeStudents}</p>
                                </div>
                                <div className="text-center border-x border-muted/20">
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Clases</p>
                                    <p className="text-lg font-bold">{teacher.stats.thisMonth}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Aprobados</p>
                                    <p className="text-lg font-bold text-success">{teacher.stats.successRate}%</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setEditingTeacher(teacher);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(teacher.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
