import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { mockStudents, mockTeachers } from '@/data/mockData';
import type { Student, StudentStatus, LicenseType } from '@/types/crm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const statusVariants: Record<StudentStatus, 'success' | 'warning' | 'error' | 'info'> = {
  activo: 'success',
  pausado: 'warning',
  completado: 'info',
  baja: 'error',
};

const statusLabels: Record<StudentStatus, string> = {
  activo: 'Activo',
  pausado: 'Pausado',
  completado: 'Completado',
  baja: 'Baja',
};

export default function Alumnos() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const columns = [
    {
      key: 'name',
      header: 'Alumno',
      sortable: true,
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'license',
      header: 'Permiso',
      render: (student: Student) => (
        <span className="rounded-md bg-secondary px-2 py-1 text-sm font-medium">
          {student.license}
        </span>
      ),
    },
    {
      key: 'teacherId',
      header: 'Profesor/a',
      render: (student: Student) => {
        const teacher = mockTeachers.find(t => t.id === student.teacherId);
        return teacher ? teacher.name.split(' ')[0] + ' ' + teacher.name.split(' ')[1] : '-';
      },
    },
    {
      key: 'practicalProgress',
      header: 'Progreso Práctico',
      sortable: true,
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${student.practicalProgress}%` }}
            />
          </div>
          <span className="text-sm font-medium">{student.practicalProgress}%</span>
        </div>
      ),
    },
    {
      key: 'practicalClasses',
      header: 'Clases',
      sortable: true,
      render: (student: Student) => (
        <span className="font-medium">{student.practicalClasses}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (student: Student) => (
        <StatusBadge
          status={statusLabels[student.status]}
          variant={statusVariants[student.status]}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (student: Student) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setEditingStudent(student);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(student.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({
      title: 'Alumno eliminado',
      description: 'El alumno ha sido dado de baja correctamente.',
    });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newStudent: Student = {
      id: editingStudent?.id || String(Date.now()),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      dni: formData.get('dni') as string,
      birthDate: new Date(formData.get('birthDate') as string),
      address: formData.get('address') as string,
      license: formData.get('license') as LicenseType,
      status: formData.get('status') as StudentStatus,
      teacherId: formData.get('teacherId') as string,
      theoreticalProgress: editingStudent?.theoreticalProgress || 0,
      practicalProgress: editingStudent?.practicalProgress || 0,
      practicalClasses: editingStudent?.practicalClasses || 0,
      observations: formData.get('observations') as string,
      documents: editingStudent?.documents || [],
      enrollmentDate: editingStudent?.enrollmentDate || new Date(),
    };

    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? newStudent : s));
      toast({
        title: 'Alumno actualizado',
        description: 'Los datos del alumno han sido actualizados.',
      });
    } else {
      setStudents([...students, newStudent]);
      toast({
        title: 'Alumno creado',
        description: 'El nuevo alumno ha sido matriculado.',
      });
    }

    setIsDialogOpen(false);
    setEditingStudent(null);
  };

  const activeCount = students.filter(s => s.status === 'activo').length;
  const completedCount = students.filter(s => s.status === 'completado').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Gestión de Alumnos
          </h1>
          <p className="text-muted-foreground">
            {activeCount} alumnos activos · {completedCount} completados
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStudent(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Alumno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Editar Alumno' : 'Nuevo Alumno'}
              </DialogTitle>
              <DialogDescription>
                {editingStudent
                  ? 'Modifica los datos del alumno.'
                  : 'Completa el formulario para matricular un nuevo alumno.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingStudent?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    name="dni"
                    defaultValue={editingStudent?.dni}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingStudent?.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingStudent?.phone}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={
                      editingStudent
                        ? format(editingStudent.birthDate, 'yyyy-MM-dd')
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Permiso</Label>
                  <Select
                    name="license"
                    defaultValue={editingStudent?.license || 'B'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar permiso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM - Ciclomotor</SelectItem>
                      <SelectItem value="A1">A1 - Motocicleta hasta 125cc</SelectItem>
                      <SelectItem value="A2">A2 - Motocicleta hasta 35kW</SelectItem>
                      <SelectItem value="A">A - Motocicleta sin límite</SelectItem>
                      <SelectItem value="B">B - Turismo</SelectItem>
                      <SelectItem value="C">C - Camión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={editingStudent?.address}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Profesor/a Asignado</Label>
                  <Select
                    name="teacherId"
                    defaultValue={editingStudent?.teacherId || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar profesor/a" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    name="status"
                    defaultValue={editingStudent?.status || 'activo'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observations">Observaciones</Label>
                  <Textarea
                    id="observations"
                    name="observations"
                    defaultValue={editingStudent?.observations}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingStudent(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingStudent ? 'Guardar Cambios' : 'Matricular Alumno'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">{students.filter(s => s.status === 'pausado').length}</p>
              <p className="text-sm text-muted-foreground">Pausados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{students.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={students}
        columns={columns}
        searchable
        searchPlaceholder="Buscar por nombre, email o DNI..."
        searchKeys={['name', 'email', 'dni'] as (keyof Student)[]}
        pageSize={10}
      />
    </div>
  );
}
