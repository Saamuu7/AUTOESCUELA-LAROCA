import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Users, CreditCard, Building } from 'lucide-react';

export default function Admin() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Settings className="h-8 w-8 text-primary" />
                    Administración
                </h1>
                <p className="text-muted-foreground">
                    Configuración global del sistema
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <Building className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="prices" className="gap-2">
                        <CreditCard className="h-4 w-4" /> Tarifas
                    </TabsTrigger>
                    <TabsTrigger value="users" className="gap-2">
                        <Users className="h-4 w-4" /> Usuarios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Autoescuela</CardTitle>
                            <CardDescription>Datos básicos de la empresa y configuración.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Nombre Comercial</Label>
                                    <Input defaultValue="Autoescuela La Roca" />
                                </div>
                                <div className="space-y-2">
                                    <Label>CIF/NIF</Label>
                                    <Input defaultValue="B-12345678" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Dirección</Label>
                                    <Input defaultValue="C/ Constitución, 11" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Teléfono</Label>
                                    <Input defaultValue="949 12 14 91" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                                <Switch id="notifications" defaultChecked />
                                <Label htmlFor="notifications">Enviar correos automáticos</Label>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button>Guardar Cambios</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="prices">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tarifas Vigentes</CardTitle>
                            <CardDescription>Precios base para clases y matrículas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Clase Práctica (45min)</Label>
                                    <Input type="number" defaultValue="28.00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tasa Examen DGT</Label>
                                    <Input type="number" defaultValue="94.05" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Matrícula Permiso B</Label>
                                    <Input type="number" defaultValue="150.00" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button>Actualizar Tarifas</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>Usuarios del Sistema</CardTitle>
                            <CardDescription>Gestión de accesos y roles (Solo lectura).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
                                Módulo de gestión de usuarios en construcción.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
