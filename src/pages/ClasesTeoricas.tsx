import { useState } from 'react';
import { Plus, BookOpen, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
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
import { mockTheoreticalClasses, mockTeachers } from '@/data/mockData';
import type { TheoreticalClass, ClassStatus } from '@/types/crm';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const statusVariants: Record<ClassStatus, 'success' | 'warning' | 'info'> = {
    realizada: 'success',
    cancelada: 'warning',
    programada: 'info',
};

const statusLabels: Record<ClassStatus, string> = {
    realizada: 'Realizada',
    cancelada: 'Cancelada',
    programada: 'Programada',
};

const topics = [
    'Señales de Tráfico',
    'Normas de Circulación',
    'Seguridad Vial',
    'Mecánica Básica',
    'Primeros Auxilios',
    'Documentación y Puntos',
];

const timeSlots = [
    '10:00', '11:00', '16:00', '17:00', '18:00', '19:00'
];

export default function ClasesTeoricas() {
    const [classes, setClasses] = useState<TheoreticalClass[]>(mockTheoreticalClasses);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<TheoreticalClass | null>(null);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

    const getClassesForDay = (date: Date) => {
        return classes
            .filter(c => isSameDay(new Date(c.date), date))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const getTeacherName = (id: string) => mockTeachers.find(t => t.id === id)?.name || 'Desconocido';

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const classData: TheoreticalClass = {
            id: editingClass ? editingClass.id : String(Date.now()),
            teacherId: formData.get('teacherId') as string,
            date: new Date(formData.get('date') as string),
            startTime: formData.get('startTime') as string,
            endTime: formData.get('endTime') as string || '11:00',
            topic: formData.get('topic') as string,
            status: (formData.get('status') as ClassStatus) || 'programada',
            attendees: editingClass ? editingClass.attendees : [],
        };

        if (editingClass) {
            setClasses(classes.map(c => c.id === editingClass.id ? classData : c));
            toast({
                title: 'Clase actualizada',
                description: `La sesión teórica ha sido modificada.`,
            });
        } else {
            setClasses([...classes, classData]);
            toast({
                title: 'Clase teórica programada',
                description: `Clase de ${classData.topic} programada para el ${format(classData.date, 'd/MM/yyyy')} a las ${classData.startTime}`,
            });
        }

        setIsDialogOpen(false);
        setEditingClass(null);
    };

    const handleEditClick = (cls: TheoreticalClass) => {
        setEditingClass(cls);
        setIsDialogOpen(true);
    };

    const handleNewClick = () => {
        setEditingClass(null);
        setIsDialogOpen(true);
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentDate(addDays(currentDate, direction === 'next' ? 7 : -7));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Agenda Teórica
                    </h1>
                    <p className="text-muted-foreground">
                        {format(weekStart, "d 'de' MMMM", { locale: es })} - {format(addDays(weekStart, 4), "d 'de' MMMM yyyy", { locale: es })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center rounded-lg border bg-card">
                        <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentDate(new Date())}
                            className="px-4"
                        >
                            Hoy
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setEditingClass(null);
                    }}>
                        <DialogTrigger asChild>
                            <Button onClick={handleNewClick}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Sesión
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingClass ? 'Editar Clase Teórica' : 'Programar Clase Teórica'}</DialogTitle>
                                <DialogDescription>
                                    {editingClass ? 'Modifica los detalles de la sesión.' : 'Crea una nueva sesión teórica.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="topic">Tema</Label>
                                    <Select name="topic" defaultValue={editingClass?.topic} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tema" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topics.map((topic) => (
                                                <SelectItem key={topic} value={topic}>
                                                    {topic}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="teacherId">Profesor/a</Label>
                                    <Select name="teacherId" defaultValue={editingClass?.teacherId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar profesor/a" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockTeachers.filter(t => t.role !== 'practicas').map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Fecha</Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            defaultValue={editingClass ? format(new Date(editingClass.date), 'yyyy-MM-dd') : ''}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Hora</Label>
                                        <Select name="startTime" defaultValue={editingClass?.startTime} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Hora" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {editingClass && (
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Estado</Label>
                                        <Select name="status" defaultValue={editingClass.status} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="programada">Programada</SelectItem>
                                                <SelectItem value="realizada">Realizada</SelectItem>
                                                <SelectItem value="cancelada">Cancelada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit">{editingClass ? 'Guardar Cambios' : 'Programar Sesión'}</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Weekly Calendar Grid */}
            <div className="grid grid-cols-5 gap-4">
                {weekDays.map((day) => {
                    const dayClasses = getClassesForDay(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <Card
                            key={day.toISOString()}
                            className={`min-h-[400px] ${isToday ? 'ring-2 ring-primary' : ''}`}
                        >
                            <CardHeader className={`pb-2 ${isToday ? 'bg-primary/10' : ''}`}>
                                <CardTitle className="flex flex-col items-center text-center">
                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                        {format(day, 'EEEE', { locale: es })}
                                    </span>
                                    <span className={`text-2xl ${isToday ? 'text-primary' : ''}`}>
                                        {format(day, 'd')}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 p-3">
                                {dayClasses.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-8">
                                        Sin sesiones
                                    </p>
                                ) : (
                                    dayClasses.map((cls) => (
                                        <div
                                            key={cls.id}
                                            onClick={() => handleEditClick(cls)}
                                            className={`rounded-lg border p-3 space-y-2 transition-all hover:shadow-md cursor-pointer ${cls.status === 'realizada'
                                                ? 'bg-success/10 border-success/30'
                                                : cls.status === 'cancelada'
                                                    ? 'bg-warning/10 border-warning/30'
                                                    : 'bg-primary/5 border-primary/20'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                                    <Clock className="h-3 w-3" />
                                                    {cls.startTime}
                                                </div>
                                                <StatusBadge
                                                    status={statusLabels[cls.status]}
                                                    variant={statusVariants[cls.status]}
                                                />
                                            </div>
                                            <p className="font-medium text-sm line-clamp-2">
                                                {cls.topic}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Prof. {getTeacherName(cls.teacherId).split(' ')[0]}</span>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{cls.attendees.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
