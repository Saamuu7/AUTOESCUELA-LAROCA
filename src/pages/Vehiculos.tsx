import { useState } from 'react';
import { Plus, Car, Edit, Trash2, AlertTriangle, Calendar } from 'lucide-react';
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
import { mockVehicles } from '@/data/mockData';
import type { Vehicle } from '@/types/crm';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

export default function Vehiculos() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const getDaysUntil = (date: Date) => differenceInDays(date, new Date());

  const getItvStatus = (itvDate: Date) => {
    const days = getDaysUntil(itvDate);
    if (days < 0) return { label: 'Vencida', variant: 'error' as const };
    if (days < 30) return { label: 'Próxima', variant: 'warning' as const };
    return { label: 'Vigente', variant: 'success' as const };
  };

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    toast({
      title: 'Vehículo eliminado',
      description: 'El vehículo ha sido dado de baja.',
    });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newVehicle: Vehicle = {
      id: editingVehicle?.id || String(Date.now()),
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      plate: formData.get('plate') as string,
      year: Number(formData.get('year')),
      itvDate: new Date(formData.get('itvDate') as string),
      insuranceDate: new Date(formData.get('insuranceDate') as string),
      active: formData.get('active') === 'true',
    };

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? newVehicle : v));
      toast({
        title: 'Vehículo actualizado',
        description: 'Los datos del vehículo han sido actualizados.',
      });
    } else {
      setVehicles([...vehicles, newVehicle]);
      toast({
        title: 'Vehículo creado',
        description: 'El nuevo vehículo ha sido dado de alta.',
      });
    }

    setIsDialogOpen(false);
    setEditingVehicle(null);
  };

  const vehiclesWithUpcomingItv = vehicles.filter(v => getDaysUntil(v.itvDate) < 60);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Car className="h-8 w-8 text-primary" />
            Gestión de Vehículos
          </h1>
          <p className="text-muted-foreground">
            {vehicles.filter(v => v.active).length} vehículos activos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVehicle(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </DialogTitle>
              <DialogDescription>
                {editingVehicle
                  ? 'Modifica los datos del vehículo.'
                  : 'Completa el formulario para dar de alta un nuevo vehículo.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    name="brand"
                    defaultValue={editingVehicle?.brand}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    name="model"
                    defaultValue={editingVehicle?.model}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Matrícula</Label>
                  <Input
                    id="plate"
                    name="plate"
                    defaultValue={editingVehicle?.plate}
                    placeholder="0000 ABC"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="2000"
                    max="2030"
                    defaultValue={editingVehicle?.year || new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itvDate">Fecha ITV</Label>
                  <Input
                    id="itvDate"
                    name="itvDate"
                    type="date"
                    defaultValue={
                      editingVehicle
                        ? format(editingVehicle.itvDate, 'yyyy-MM-dd')
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceDate">Fecha Seguro</Label>
                  <Input
                    id="insuranceDate"
                    name="insuranceDate"
                    type="date"
                    defaultValue={
                      editingVehicle
                        ? format(editingVehicle.insuranceDate, 'yyyy-MM-dd')
                        : ''
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Estado</Label>
                <Select
                  name="active"
                  defaultValue={editingVehicle?.active ? 'true' : 'true'}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                    setEditingVehicle(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVehicle ? 'Guardar Cambios' : 'Crear Vehículo'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ITV Alerts */}
      {vehiclesWithUpcomingItv.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Alertas de ITV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vehiclesWithUpcomingItv.map((vehicle) => {
                const days = getDaysUntil(vehicle.itvDate);
                return (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {vehicle.brand} {vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${days < 0 ? 'text-destructive' : 'text-warning'}`}>
                        {days < 0
                          ? `Vencida hace ${Math.abs(days)} días`
                          : `Vence en ${days} días`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(vehicle.itvDate, "d 'de' MMMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => {
          const itvStatus = getItvStatus(vehicle.itvDate);
          return (
            <Card key={vehicle.id} className="overflow-hidden card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <Car className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {vehicle.brand} {vehicle.model}
                      </CardTitle>
                      <p className="font-mono text-lg text-muted-foreground">
                        {vehicle.plate}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={vehicle.active ? 'Activo' : 'Inactivo'}
                    variant={vehicle.active ? 'success' : 'error'}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      ITV
                    </div>
                    <p className="font-medium">
                      {format(vehicle.itvDate, 'd MMM yyyy', { locale: es })}
                    </p>
                    <StatusBadge
                      status={itvStatus.label}
                      variant={itvStatus.variant}
                      className="mt-1"
                    />
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Seguro
                    </div>
                    <p className="font-medium">
                      {format(vehicle.insuranceDate, 'd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Año: {vehicle.year}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingVehicle(vehicle);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
