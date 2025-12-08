import { useState } from 'react';
import { Plus, Edit, Trash2, Car, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Switch } from '@/components/ui/switch';
import { mockVehicles } from '@/data/mockData';
import type { Vehicle } from '@/types/crm';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

export default function Vehiculos() {
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const getDaysUntil = (date: Date) => {
        return differenceInDays(new Date(date), new Date());
    };

    const getStatusColor = (days: number) => {
        if (days < 0) return 'text-destructive';
        if (days < 30) return 'text-warning';
        return 'text-success';
    };

    const handleDelete = (id: string) => {
        setVehicles(vehicles.filter(v => v.id !== id));
        toast({
            title: 'Vehículo eliminado',
            description: 'El vehículo ha sido dado de baja correctamente.',
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
            active: true, // Default to true, or add switch to form
        };

        if (editingVehicle) {
            setVehicles(vehicles.map(v => v.id === editingVehicle.id ? newVehicle : v));
            toast({
                title: 'Vehículo actualizado',
                description: 'Datos del vehículo actualizados correctamente.',
            });
        } else {
            setVehicles([...vehicles, newVehicle]);
            toast({
                title: 'Vehículo añadido',
                description: 'Nuevo vehículo añadido a la flota.',
            });
        }

        setIsDialogOpen(false);
        setEditingVehicle(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Car className="h-8 w-8 text-primary" />
                        Flota de Vehículos
                    </h1>
                    <p className="text-muted-foreground">
                        Gestión y mantenimiento de vehículos ({vehicles.length})
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
                                Información técnica y mantenimiento del vehículo.
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
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Año</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        type="number"
                                        defaultValue={editingVehicle?.year}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="itvDate">Próxima ITV</Label>
                                <Input
                                    id="itvDate"
                                    name="itvDate"
                                    type="date"
                                    defaultValue={editingVehicle ? format(new Date(editingVehicle.itvDate), 'yyyy-MM-dd') : ''}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="insuranceDate">Vencimiento Seguro</Label>
                                <Input
                                    id="insuranceDate"
                                    name="insuranceDate"
                                    type="date"
                                    defaultValue={editingVehicle ? format(new Date(editingVehicle.insuranceDate), 'yyyy-MM-dd') : ''}
                                    required
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
                                <Button type="submit">
                                    {editingVehicle ? 'Guardar Cambios' : 'Añadir Vehículo'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => {
                    const itvDays = getDaysUntil(vehicle.itvDate);
                    const insuranceDays = getDaysUntil(vehicle.insuranceDate);

                    return (
                        <Card key={vehicle.id} className="hover:shadow-md transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{vehicle.brand} {vehicle.model}</CardTitle>
                                        <CardDescription className="font-mono text-lg font-medium text-primary mt-1">
                                            {vehicle.plate}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={vehicle.active ? 'success' : 'secondary'}>
                                        {vehicle.active ? 'En servicio' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <AlertTriangle className="h-3 w-3" /> ITV
                                            </span>
                                            <span className={`font-medium ${getStatusColor(itvDays)}`}>
                                                {format(new Date(vehicle.itvDate), 'd MMM yyyy', { locale: es })}
                                            </span>
                                        </div>
                                        <Progress value={Math.max(0, Math.min(100, (itvDays / 365) * 100))} className="h-1.5" />
                                        <p className="text-xs text-right mt-1 text-muted-foreground">
                                            {itvDays} días restantes
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3" /> Seguro
                                            </span>
                                            <span className={`font-medium ${getStatusColor(insuranceDays)}`}>
                                                {format(new Date(vehicle.insuranceDate), 'd MMM yyyy', { locale: es })}
                                            </span>
                                        </div>
                                        <Progress value={Math.max(0, Math.min(100, (insuranceDays / 365) * 100))} className="h-1.5" />
                                        <p className="text-xs text-right mt-1 text-muted-foreground">
                                            {insuranceDays} días restantes
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t mt-4">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 h-8"
                                        onClick={() => {
                                            setEditingVehicle(vehicle);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="mr-2 h-3.5 w-3.5" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-shrink-0 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(vehicle.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
