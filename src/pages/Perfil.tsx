import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, Shield, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Perfil() {
    const { user, updateUser, changePassword } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            updateUser({ name: formData.name, email: formData.email });
            toast({
                title: "Perfil actualizado",
                description: "Los cambios se han guardado correctamente.",
            });
        }
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Las contraseñas no coinciden.",
                variant: "destructive",
            });
            return;
        }

        const success = changePassword(formData.currentPassword, formData.newPassword);

        if (success) {
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            toast({
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido modificada correctamente.",
            });
        } else {
            toast({
                title: "Error",
                description: "La contraseña actual no es correcta.",
                variant: "destructive",
            });
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ avatar: reader.result as string });
                toast({
                    title: "Foto actualizada",
                    description: "Tu foto de perfil se ha actualizado.",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container max-w-4xl py-6 animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Mi Perfil</h1>
                <p className="text-muted-foreground">Gestiona tu información personal y preferencias de cuenta</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Imagen de Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                <AvatarFallback className="bg-primary/10 text-4xl text-primary">
                                    {user ? getInitials(user.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary shadow-md hover:bg-secondary/80 transition-colors absolute bottom-0 right-0">
                                    <Camera className="h-4 w-4" />
                                </div>
                            </Label>
                            <Input
                                id="avatar-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">{user?.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleUpdateProfile}>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="general">Información General</TabsTrigger>
                            <TabsTrigger value="security">Seguridad</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Datos Personales</CardTitle>
                                    <CardDescription>Actualiza tu información básica de contacto.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre Completo</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Rol</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                value={user?.role}
                                                disabled
                                                className="pl-9 capitalize bg-muted"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Tu rol es gestionado por el administrador.</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button type="submit">Guardar Cambios</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contraseña</CardTitle>
                                    <CardDescription>Cambia tu contraseña para mantener tu cuenta segura.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current">Contraseña Actual</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="current"
                                                type="password"
                                                className="pl-9"
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new">Nueva Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="new"
                                                type="password"
                                                className="pl-9"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm">Confirmar Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirm"
                                                type="password"
                                                className="pl-9"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button onClick={handleUpdatePassword}>Actualizar Contraseña</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </div>
    );
}
