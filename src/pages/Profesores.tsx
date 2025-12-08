import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Phone, Mail, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const roleLabels: Record<string, string> = {
  practicas: 'Prácticas',
  teoricas: 'Teóricas',
  ambas: 'Prácticas y Teóricas',
};

export default function Profesores() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const handleDelete = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    toast({
      title: 'Profesor/a eliminado',
      description: 'El profesor/a ha sido dado de baja.',
    });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTeacher: Teacher = {
      id: editingTeacher?.id || String(Date.now()),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as 'practicas' | 'teoricas' | 'ambas',
      availability: editingTeacher?.availability || {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
      active: formData.get('active') === 'true',
      createdAt: editingTeacher?.createdAt || new Date(),
      stats: editingTeacher?.stats || {
        totalClasses: 0,
        thisMonth: 0,
        successRate: 0,
        activeStudents: 0,
      },
    };

    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? newTeacher : t));
      toast({
        title: 'Profesor/a actualizado',
        description: 'Los datos han sido actualizados correctamente.',
      });
    } else {
      setTeachers([...teachers, newTeacher]);
      toast({
        title: 'Profesor/a creado',
        description: 'El nuevo profesor/a ha sido dado de alta.',
      });
    }

    setIsDialogOpen(false);
    setEditingTeacher(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Gestión de Profesores
          </h1>
          <p className="text-muted-foreground">
            {teachers.filter(t => t.active).length} profesores activos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTeacher(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Profesor/a
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? 'Editar Profesor/a' : 'Nuevo Profesor/a'}
              </DialogTitle>
              <DialogDescription>
                {editingTeacher
                  ? 'Modifica los datos del profesor/a.'
                  : 'Completa el formulario para dar de alta un nuevo profesor/a.'}
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
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Clases</Label>
                <Select
                  name="role"
                  defaultValue={editingTeacher?.role || 'practicas'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practicas">Solo Prácticas</SelectItem>
                    <SelectItem value="teoricas">Solo Teóricas</SelectItem>
                    <SelectItem value="ambas">Prácticas y Teóricas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Estado</Label>
                <Select
                  name="active"
                  defaultValue={editingTeacher?.active ? 'true' : 'false'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingTeacher(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTeacher ? 'Guardar Cambios' : 'Crear Profesor/a'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teachers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden card-hover">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={teacher.photo} alt={teacher.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <StatusBadge
                      status={teacher.active ? 'Activo' : 'Inactivo'}
                      variant={teacher.active ? 'success' : 'error'}
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingTeacher(teacher);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{roleLabels[teacher.role]}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{teacher.stats.thisMonth}</p>
                  <p className="text-xs text-muted-foreground">Clases este mes</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-success">{teacher.stats.successRate}%</p>
                  <p className="text-xs text-muted-foreground">Tasa de éxito</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold">{teacher.stats.activeStudents}</p>
                  <p className="text-xs text-muted-foreground">Alumnos activos</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold">{teacher.stats.totalClasses}</p>
                  <p className="text-xs text-muted-foreground">Total clases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
