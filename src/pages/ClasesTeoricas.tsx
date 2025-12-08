import { useState } from 'react';
import { Plus, CalendarDays, ChevronLeft, ChevronRight, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
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

const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '16:00', '17:00', '18:00', '19:00', '20:00'
];

const commonTopics = [
    'Normas de Circulación',
    'Señales de Tráfico',
    'Seguridad Vial',
    'Mecánica Básica',
    'Primeros Auxilios',
    'Documentación y Puntos',
    'Maniobras y Prioridad',
    'Velocidad y Distancias'
];

export default function ClasesTeoricas() {
    const [classes, setClasses] = useState<TheoreticalClass[]>(mockTheoreticalClasses);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customTopic, setCustomTopic] = useState('');

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

    const getClassesForDay = (date: Date) => {
        return classes.filter(c => isSameDay(c.date, date));
    };

    const getTeacherName = (id: string) => mockTeachers.find(t => t.id === id)?.name || 'Desconocido';

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedTopic = formData.get('topic') as string;
        const topic = selectedTopic === 'other' ? customTopic : selectedTopic;

        if (selectedTopic === 'other' && !customTopic) {
            toast({
                title: 'Error',
                description: 'Por favor, introduce el tema de la clase',
                variant: 'destructive',
            });
            return;
        }

        const newClass: TheoreticalClass = {
            id: String(Date.now()),
            teacherId: formData.get('teacherId') as string,
            date: new Date(formData.get('date') as string),
            startTime: formData.get('startTime') as string,
            endTime: String(Number(formData.get('startTime')?.toString().split(':')[0]) + 1) + ':00',
            topic: topic,
            attendees: [],
            status: 'programada',
        };

        setClasses([...classes, newClass]);
        toast({
            title: 'Clase programada',
            description: `Clase de teórica sobre "${topic}" programada para el ${format(newClass.date, 'd/MM/yyyy')} a las ${newClass.startTime}`,
        });

        setIsDialogOpen(false);
        setCustomTopic('');
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
                        Agenda de Clases Teóricas
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Clase
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Programar Clase Teórica</DialogTitle>
                                <DialogDescription>
                                    Programa una nueva sesión teórica para los alumnos.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="teacherId">Profesor/a</Label>
                                    <Select name="teacherId" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar profesor/a" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockTeachers.filter(t => t.role !== 'practicas' && t.active).map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="topic">Tema</Label>
                                    <Select name="topic" required onValueChange={(val) => val !== 'other' && setCustomTopic('')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tema" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {commonTopics.map((topic) => (
                                                <SelectItem key={topic} value={topic}>
                                                    {topic}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="other">Otro...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* Conditional input for custom topic would need state to track select value, simpler to rely on just Select for now or handling "other" logic more reactively if needed, but keeping it simple as per plan */}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Fecha</Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Hora</Label>
                                        <Select name="startTime" required>
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

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit">Programar Clase</Button>
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
                                        Sin clases
                                    </p>
                                ) : (
                                    dayClasses.map((cls) => (
                                        <div
                                            key={cls.id}
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
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                {cls.attendees.length} alumnos
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Prof. {getTeacherName(cls.teacherId).split(' ')[0]}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <CalendarDays className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{classes.filter(c => c.status === 'programada').length}</p>
                                <p className="text-sm text-muted-foreground">Programadas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                                <CalendarDays className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{classes.filter(c => c.status === 'realizada').length}</p>
                                <p className="text-sm text-muted-foreground">Realizadas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                                <CalendarDays className="h-6 w-6 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{classes.filter(c => c.status === 'cancelada').length}</p>
                                <p className="text-sm text-muted-foreground">Canceladas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{classes.length}</p>
                                <p className="text-sm text-muted-foreground">Total Clases</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
