import { useState } from 'react';
import { Plus, CalendarDays, ChevronLeft, ChevronRight, Clock, Car } from 'lucide-react';
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
import { mockPracticalClasses, mockStudents, mockTeachers, mockVehicles } from '@/data/mockData';
import type { PracticalClass, ClassStatus } from '@/types/crm';
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
  '17:00', '18:00', '19:00', '20:00'
];

export default function ClasesPracticas() {
  const [classes, setClasses] = useState<PracticalClass[]>(mockPracticalClasses);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'week' | 'day'>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getClassesForDay = (date: Date) => {
    return classes.filter(c => isSameDay(c.date, date));
  };

  const getStudentName = (id: string) => mockStudents.find(s => s.id === id)?.name || 'Desconocido';
  const getTeacherName = (id: string) => mockTeachers.find(t => t.id === id)?.name || 'Desconocido';
  const getVehicle = (id: string) => mockVehicles.find(v => v.id === id);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClass: PracticalClass = {
      id: String(Date.now()),
      studentId: formData.get('studentId') as string,
      teacherId: formData.get('teacherId') as string,
      vehicleId: formData.get('vehicleId') as string,
      date: new Date(formData.get('date') as string),
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      status: 'programada',
      notes: formData.get('notes') as string,
    };

    setClasses([...classes, newClass]);
    toast({
      title: 'Clase programada',
      description: `Clase asignada a ${getStudentName(newClass.studentId)} el ${format(newClass.date, 'd/MM/yyyy')} a las ${newClass.startTime}`,
    });

    setIsDialogOpen(false);
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
            <CalendarDays className="h-8 w-8 text-primary" />
            Agenda de Clases Prácticas
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
                <DialogTitle>Programar Clase Práctica</DialogTitle>
                <DialogDescription>
                  Asigna una nueva clase práctica a un alumno.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Alumno</Label>
                  <Select name="studentId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.filter(s => s.status === 'activo').map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Profesor/a</Label>
                  <Select name="teacherId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar profesor/a" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.filter(t => t.role !== 'teoricas' && t.active).map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehículo</Label>
                  <Select name="vehicleId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVehicles.filter(v => v.active).map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.plate}
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
                <input type="hidden" name="endTime" value="11:00" />
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Observaciones para la clase..."
                    rows={2}
                  />
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
                  dayClasses.map((cls) => {
                    const vehicle = getVehicle(cls.vehicleId);
                    return (
                      <div
                        key={cls.id}
                        className={`rounded-lg border p-3 space-y-2 transition-all hover:shadow-md cursor-pointer ${
                          cls.status === 'realizada'
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
                        <p className="font-medium text-sm">
                          {getStudentName(cls.studentId).split(' ').slice(0, 2).join(' ')}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Car className="h-3 w-3" />
                          {vehicle ? `${vehicle.brand} ${vehicle.model}` : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Prof. {getTeacherName(cls.teacherId).split(' ')[0]}
                        </p>
                      </div>
                    );
                  })
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
